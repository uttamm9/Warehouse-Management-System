/**
 * plcService.js
 * Core Modbus RTU service for Delta DVP PLC communication.
 * Supports real connection AND mock mode (for UI testing without hardware).
 *
 * Events emitted (EventEmitter):
 *   'connected'    { port, slaveId }
 *   'disconnected' { port, reason }
 *   'error'        { message, error }
 *   'poll'         { tag, address, type, value, timestamp }
 *   'fault'        { message, timestamp }
 */

const EventEmitter = require('events');
const { loadSettings, loadTags, deltaAddressToModbus } = require('./plcConfig');
const { log } = require('./plcLogger');

// Lazy-require modbus-serial so the app doesn't crash if the module fails to load
let ModbusRTU;
try { ModbusRTU = require('modbus-serial'); } catch (e) {
    console.warn('[PLCService] modbus-serial not available – mock mode forced');
}

class PLCService extends EventEmitter {
    constructor() {
        super();
        this.client = null;
        this.connected = false;
        this.connecting = false;
        this.reconnecting = false;
        this.settings = loadSettings();
        this._pollTimer = null;
        this._reconnTimer = null;
        this._reconnectCount = 0;
        this._lastValues = {};        // tag → last known value (for change detection)
        this._mockState = {};         // mock mode coil/register state
        this._writeFailCounts = {};   // cacheKey → consecutive write failure count
    }

    // ── Public API ────────────────────────────────────────────────────────────

    getStatus() {
        return {
            connected: this.connected,
            connecting: this.connecting,
            reconnecting: this.reconnecting,
            port: this.settings.port,
            slaveId: this.settings.slaveId,
            mockMode: this.settings.mockMode || !ModbusRTU,
            pollInterval: this.settings.pollInterval
        };
    }

    async connect(overrideSettings = null) {
        if (this.connecting) return { success: false, message: 'Already connecting' };
        if (this.connected) return { success: true, message: 'Already connected' };

        if (overrideSettings) {
            this.settings = { ...this.settings, ...overrideSettings };
        } else {
            this.settings = loadSettings();
        }

        this.connecting = true;

        if (this.settings.mockMode || !ModbusRTU) {
            return this._connectMock();
        }
        return this._connectReal();
    }

    async disconnect() {
        this._stopPolling();
        this._stopReconnect();

        if (this.client) {
            try { await this.client.close(); } catch { /* ignore */ }
            this.client = null;
        }

        const wasConnected = this.connected;
        this.connected = false;
        this.connecting = false;

        if (wasConnected) {
            log.disconnect(this.settings.port, 'Manual disconnect');
            this.emit('disconnected', { port: this.settings.port, reason: 'manual' });
        }
        return { success: true };
    }

    /** Read coil(s) — M, X, Y registers */
    async readCoil(type, address, count = 1) {
        if (count < 1 || count > 2000) {
            return { success: false, message: 'Count out of range' };
        }
        const modbusAddr = deltaAddressToModbus(type, address);
        if (this.settings.mockMode || !ModbusRTU || !this.client) {
            return this._mockReadCoil(modbusAddr, count);
        }
        try {
            const result = await this.client.readCoils(modbusAddr, count);
            log.read(`${type}${address}`, modbusAddr, result.data);
            return { success: true, values: result.data, address: modbusAddr };
        } catch (e) {
            log.error(`Read coil ${type}${address} failed: ${e.message}`, { address: modbusAddr });
            this._handleCommError(e);
            return { success: false, message: e.message };
        }
    }

    /** Write a single coil — M, X, Y registers */
    async writeCoil(type, address, value, skipRetry = false) {
        const modbusAddr = deltaAddressToModbus(type, address);
        const boolVal = Boolean(value);
        const cacheKey = `${type}${address}`;
        if (this.settings.mockMode || !ModbusRTU || !this.client) {
            return this._mockWriteCoil(modbusAddr, boolVal);
        }
        try {
            await this.client.writeCoil(modbusAddr, boolVal);
            log.write(cacheKey, modbusAddr, boolVal);
            if (!skipRetry) {
                this._writeFailCounts[cacheKey] = 0;
            }
            return { success: true, address: modbusAddr, value: boolVal };
        } catch (e) {
            log.error(`Write coil ${cacheKey} failed: ${e.message}`, { address: modbusAddr, value: boolVal });
            this._handleCommError(e);
            if (!skipRetry) {
                this._writeFailCounts[cacheKey] = (this._writeFailCounts[cacheKey] || 0) + 1;
                if (this._writeFailCounts[cacheKey] >= 3) {
                    log.error(`Write retry limit exceeded for ${cacheKey}`, { address: modbusAddr });
                    this.emit('error', { message: 'Write retry limit exceeded', tag: cacheKey, address: modbusAddr });
                }
            }
            return { success: false, message: e.message };
        }
    }

    /** Read holding register(s) — D registers */
    async readRegister(type, address, count = 1) {
        if (count < 1 || count > 125) {
            return { success: false, message: 'Count out of range' };
        }
        const modbusAddr = deltaAddressToModbus(type, address);
        if (this.settings.mockMode || !ModbusRTU || !this.client) {
            return this._mockReadRegister(modbusAddr, count);
        }
        try {
            const result = await this.client.readHoldingRegisters(modbusAddr, count);
            log.read(`${type}${address}`, modbusAddr, result.data);
            return { success: true, values: result.data, address: modbusAddr };
        } catch (e) {
            log.error(`Read register ${type}${address} failed: ${e.message}`, { address: modbusAddr });
            this._handleCommError(e);
            return { success: false, message: e.message };
        }
    }

    /** Write a single holding register — D registers */
    async writeRegister(type, address, value, skipRetry = false) {
        const modbusAddr = deltaAddressToModbus(type, address);
        const intVal = parseInt(value, 10);
        const cacheKey = `${type}${address}`;
        if (this.settings.mockMode || !ModbusRTU || !this.client) {
            return this._mockWriteRegister(modbusAddr, intVal);
        }
        try {
            await this.client.writeRegister(modbusAddr, intVal);
            log.write(cacheKey, modbusAddr, intVal);
            if (!skipRetry) {
                this._writeFailCounts[cacheKey] = 0;
            }
            return { success: true, address: modbusAddr, value: intVal };
        } catch (e) {
            log.error(`Write register ${cacheKey} failed: ${e.message}`, { address: modbusAddr, value: intVal });
            this._handleCommError(e);
            if (!skipRetry) {
                this._writeFailCounts[cacheKey] = (this._writeFailCounts[cacheKey] || 0) + 1;
                if (this._writeFailCounts[cacheKey] >= 3) {
                    log.error(`Write retry limit exceeded for ${cacheKey}`, { address: modbusAddr });
                    this.emit('error', { message: 'Write retry limit exceeded', tag: cacheKey, address: modbusAddr });
                }
            }
            return { success: false, message: e.message };
        }
    }

    /** Write by tag name — looks up address from tag map */
    async writeTag(tagName, value) {
        const tags = loadTags();
        const tag = tags.find(t => t.name === tagName);
        if (!tag) return { success: false, message: `Tag '${tagName}' not found in tag map` };

        const skipRetry = tagName === 'Emergency_Stop';

        if (tag.type === 'D' || tag.type === 'T' || tag.type === 'C') {
            return this.writeRegister(tag.type, tag.address, value, skipRetry);
        }
        return this.writeCoil(tag.type, tag.address, value, skipRetry);
    }

    /** Read by tag name */
    async readTag(tagName) {
        const tags = loadTags();
        const tag = tags.find(t => t.name === tagName);
        if (!tag) return { success: false, message: `Tag '${tagName}' not found in tag map` };

        if (tag.type === 'D' || tag.type === 'T' || tag.type === 'C') {
            return this.readRegister(tag.type, tag.address);
        }
        return this.readCoil(tag.type, tag.address);
    }

    // ── Private: Real Connection ─────────────────────────────────────────────

    async _connectReal() {
        try {
            if (!ModbusRTU) throw new Error('modbus-serial module not available');

            this.client = new ModbusRTU();
            const { port, baudRate, dataBits, stopBits, parity, slaveId } = this.settings;

            await this.client.connectRTUBuffered(port, { baudRate, dataBits, stopBits, parity });
            this.client.setID(slaveId);
            this.client.setTimeout(2000);

            this.connected = false; // Will be set true after first successful read
            this.connecting = false;

            // Verify connection with a test read
            await this.client.readCoils(0, 1);

            this.connected = true;
            this.reconnecting = false;
            this._reconnectCount = 0;
            log.connect(port);
            this.emit('connected', { port, slaveId });
            this._startPolling();

            return { success: true, port, slaveId };
        } catch (e) {
            this.connecting = false;
            this.connected = false;
            log.error(`Connection failed: ${e.message}`, { port: this.settings.port });
            this.emit('error', { message: e.message, error: e });
            this._scheduleReconnect();
            return { success: false, message: e.message };
        }
    }

    // ── Private: Mock Connection ─────────────────────────────────────────────

    _connectMock() {
        this.connecting = false;
        this.connected = true;
        log.info('Mock PLC connected', { port: 'MOCK' });
        this.emit('connected', { port: 'MOCK', slaveId: this.settings.slaveId, mock: true });
        this._startPolling();
        return { success: true, port: 'MOCK', mock: true };
    }

    _mockReadCoil(addr, count) {
        const values = Array.from({ length: count }, (_, i) => Boolean(this._mockState[`c_${addr + i}`] || false));
        return { success: true, values, address: addr, mock: true };
    }

    _mockWriteCoil(addr, value) {
        this._mockState[`c_${addr}`] = value;
        // Auto-reset pulse outputs after 200ms
        if (value) {
            setTimeout(() => { this._mockState[`c_${addr}`] = false; }, 200);
        }
        return { success: true, address: addr, value, mock: true };
    }

    _mockReadRegister(addr, count) {
        const values = Array.from({ length: count }, (_, i) => this._mockState[`r_${addr + i}`] || 0);
        return { success: true, values, address: addr, mock: true };
    }

    _mockWriteRegister(addr, value) {
        this._mockState[`r_${addr}`] = value;
        return { success: true, address: addr, value, mock: true };
    }

    // ── Private: Polling ─────────────────────────────────────────────────────

    _startPolling() {
        this._stopPolling();
        
        // Check if polling is enabled in settings
        if (!this.settings.enablePolling) {
            log.info('Polling disabled in settings - PLC will only respond to explicit write commands');
            return;
        }
        
        const interval = this.settings.pollInterval || 500;
        this._pollTimer = setInterval(() => this._pollCycle(), interval);
        log.info(`Polling started (${interval}ms interval)`);
    }

    _stopPolling() {
        if (this._pollTimer) {
            clearInterval(this._pollTimer);
            this._pollTimer = null;
        }
    }

    async _pollCycle() {
        if (!this.connected) return;

        const tags = loadTags().filter(t => t.direction === 'Read' || t.direction === 'Read+Write');

        for (const tag of tags) {
            try {
                let result;
                if (tag.type === 'D' || tag.type === 'T' || tag.type === 'C') {
                    result = await this.readRegister(tag.type, tag.address);
                } else {
                    result = await this.readCoil(tag.type, tag.address);
                }

                if (!result.success) continue;

                const newValue = result.values[0];
                const cacheKey = `${tag.type}${tag.address}`;

                // Emit only on value change (reduces noise)
                if (this._lastValues[cacheKey] !== newValue) {
                    this._lastValues[cacheKey] = newValue;
                    const payload = {
                        tag: tag.name,
                        type: tag.type,
                        address: tag.address,
                        value: newValue,
                        timestamp: new Date().toISOString()
                    };
                    this.emit('poll', payload);
                }

                // Always emit fault when Conveyor_Fault is true (regardless of change)
                if (tag.name === 'Conveyor_Fault' && newValue === true) {
                    this.emit('fault', { message: 'Conveyor fault detected', timestamp: new Date().toISOString() });
                }
            } catch (e) {
                // Non-fatal poll error — log and continue
            }
        }
    }

    // ── Private: Error handling & reconnect ──────────────────────────────────

    _handleCommError(e) {
        const fatal = ['Port Not Open', 'disconnected', 'Timed out'].some(s => e.message?.includes(s));
        if (fatal && this.connected) {
            this.connected = false;
            log.disconnect(this.settings.port, e.message);
            this.emit('disconnected', { port: this.settings.port, reason: e.message });
            this._stopPolling();
            if (this.settings.autoConnect) this._scheduleReconnect();
        }
    }

    _scheduleReconnect() {
        this._stopReconnect();
        if (!this.settings.autoConnect) return;

        this._reconnectCount++;

        if (this._reconnectCount >= 10) {
            this.reconnecting = false;
            this.emit('error', { message: 'Communication error: 10 reconnect attempts failed' });
            return;
        }

        this.reconnecting = true;
        const delay = this.settings.reconnectDelay || 5000;
        log.info(`Reconnecting in ${delay / 1000}s… (attempt ${this._reconnectCount}/10)`);
        this._reconnTimer = setTimeout(async () => {
            if (!this.connected && !this.connecting) {
                await this._connectReal();
            }
        }, delay);
    }

    _stopReconnect() {
        if (this._reconnTimer) {
            clearTimeout(this._reconnTimer);
            this._reconnTimer = null;
        }
    }
}

// Export a singleton instance
const plcService = new PLCService();
module.exports = plcService;
