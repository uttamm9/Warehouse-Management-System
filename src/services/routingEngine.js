/**
 * src/services/routingEngine.js
 * Routing Engine — plain JS factory (no React hooks).
 * Manages a six-state machine for conveyor package routing.
 *
 * States: Idle → Pending → In_Transit → Complete | Timeout | Failed
 *         Failed → Idle (via dismiss)
 *         Timeout → Idle (via dismiss)
 *         Complete → Idle (automatic, 2s delay)
 */

/**
 * Build the route path string for a given rack and level.
 * e.g. rackNumber=7, level='C' → "Gate A → Junction 3 → Rack 7 → Level C"
 *
 * @param {number} rackNumber
 * @param {string} level - 'A'|'B'|'C'|'D'
 * @returns {string}
 */
function buildRoutePath(rackNumber, level) {
    const junction = Math.ceil(rackNumber / 3);
    return `Gate A → Junction ${junction} → Rack ${rackNumber} → Level ${level}`;
}

/**
 * Factory function — creates an independent Routing Engine instance.
 *
 * @param {object} plcAPI       - REST wrapper (plcAPI from plcService.js); must expose writeTag(tagName, value)
 * @param {object} socketClient - Socket.IO client-side socket; must expose on/off for 'plc:coil_update'
 * @returns {object} Routing engine with getState / subscribe / unsubscribe / startRoute / dismiss
 */
export function createRoutingEngine(plcAPI, socketClient) {
    // ── Internal state ──────────────────────────────────────────────────────
    let state = {
        status: 'Idle',          // 'Idle'|'Pending'|'In_Transit'|'Complete'|'Timeout'|'Failed'
        rackNumber: null,        // number | null
        level: null,             // 'A'|'B'|'C'|'D' | null
        routePath: '',           // e.g. "Gate A → Junction 1 → Rack 7 → Level C"
        startedAt: null,         // ISO8601 | null
        timeoutHandle: null,     // timer ID | null
        sensorTag: null,         // e.g. "Sensor_7"
    };

    // Registered listener functions
    const listeners = new Set();

    // Socket event handler reference — kept so we can remove it later
    let _coilUpdateHandler = null;

    // ── Helpers ─────────────────────────────────────────────────────────────

    /**
     * Shallow-merge patch into state, then notify all subscribers.
     * @param {object} patch
     */
    function applyPatch(patch) {
        state = { ...state, ...patch };
        const snapshot = getState();
        listeners.forEach((fn) => {
            try { fn(snapshot); } catch (_) { /* listener errors must not crash the engine */ }
        });
    }

    /** Remove the active socket listener, if any. */
    function removeCoilListener() {
        if (_coilUpdateHandler && socketClient) {
            socketClient.off('plc:coil_update', _coilUpdateHandler);
            _coilUpdateHandler = null;
        }
    }

    /** Cancel the 60-second timeout, if running. */
    function clearTimeoutHandle() {
        if (state.timeoutHandle !== null) {
            clearTimeout(state.timeoutHandle);
            // We patch timeoutHandle to null without a full notification here;
            // callers that invoke clearTimeoutHandle always follow up with applyPatch.
        }
    }

    // ── Public API ───────────────────────────────────────────────────────────

    /**
     * Returns a shallow copy of the current state (safe to read, not mutate).
     * @returns {object}
     */
    function getState() {
        return { ...state };
    }

    /**
     * Register a listener that is called with the new state on every transition.
     * @param {function} fn
     */
    function subscribe(fn) {
        listeners.add(fn);
    }

    /**
     * Remove a previously registered listener.
     * @param {function} fn
     */
    function unsubscribe(fn) {
        listeners.delete(fn);
    }

    /**
     * Start a routing operation.
     *
     * @param {number} rackNumber - 1–19
     * @param {string} level      - 'A'|'B'|'C'|'D'
     * @returns {{ success: boolean, message?: string }}
     */
    async function startRoute(rackNumber, level) {
        // Req 7.6 — reject if already active
        if (state.status === 'Pending' || state.status === 'In_Transit') {
            return { success: false, message: 'A routing operation is already in progress' };
        }

        const tagName = `Rack_${rackNumber}`;
        const sensorTag = `Sensor_${rackNumber}`;
        const routePath = buildRoutePath(rackNumber, level);
        const startedAt = new Date().toISOString();

        // Transition to Pending
        applyPatch({
            status: 'Pending',
            rackNumber,
            level,
            routePath,
            startedAt,
            sensorTag,
            timeoutHandle: null,
        });

        // Write the rack M-bit to PLC
        let writeResult;
        try {
            writeResult = await plcAPI.writeTag(tagName, true);
        } catch (err) {
            // Network / unexpected error — treat as failure
            writeResult = { success: false, message: err?.message || 'Unknown error' };
        }

        if (!writeResult || !writeResult.success) {
            // Req 7.7 — transition to Failed
            applyPatch({
                status: 'Failed',
                timeoutHandle: null,
            });
            return { success: false, message: writeResult?.message || 'PLC write failed' };
        }

        // Write succeeded — transition to In_Transit (Req 7.2 / 7.3)
        // Set up the 60-second timeout (Req 7.5)
        const handle = setTimeout(() => {
            if (state.status !== 'In_Transit') return;

            removeCoilListener();

            console.warn(
                `[RoutingEngine] Routing timeout: package did not reach Rack ${state.rackNumber} ` +
                `within 60 seconds. Please check conveyor manually.`
            );

            applyPatch({
                status: 'Timeout',
                timeoutHandle: null,
            });
        }, 60_000);

        // Register sensor listener before patching so we don't miss a
        // near-simultaneous coil update (Req 7.4)
        _coilUpdateHandler = (data) => {
            if (
                state.status === 'In_Transit' &&
                data.tag === state.sensorTag &&
                data.value === true
            ) {
                // Package confirmed — transition to Complete
                clearTimeout(handle);
                removeCoilListener();

                applyPatch({
                    status: 'Complete',
                    timeoutHandle: null,
                });

                // Clear route highlight after 2-second delay, return to Idle
                setTimeout(() => {
                    if (state.status === 'Complete') {
                        applyPatch({
                            status: 'Idle',
                            rackNumber: null,
                            level: null,
                            routePath: '',
                            startedAt: null,
                            timeoutHandle: null,
                            sensorTag: null,
                        });
                    }
                }, 2_000);
            }
        };

        if (socketClient) {
            socketClient.on('plc:coil_update', _coilUpdateHandler);
        }

        applyPatch({
            status: 'In_Transit',
            timeoutHandle: handle,
        });

        return { success: true };
    }

    /**
     * Dismiss a Failed or Timeout state, returning to Idle.
     * No-op in any other state.
     */
    function dismiss() {
        if (state.status === 'Failed' || state.status === 'Timeout') {
            clearTimeoutHandle();
            removeCoilListener();
            applyPatch({
                status: 'Idle',
                rackNumber: null,
                level: null,
                routePath: '',
                startedAt: null,
                timeoutHandle: null,
                sensorTag: null,
            });
        }
    }

    // ── Expose public surface ────────────────────────────────────────────────
    return {
        getState,
        subscribe,
        unsubscribe,
        startRoute,
        dismiss,
    };
}

export default createRoutingEngine;
