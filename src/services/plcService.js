/**
 * src/services/plcService.js
 * Frontend PLC service — wraps REST API calls + Socket.IO subscriptions.
 * Provides React hooks for components to consume PLC state.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:3001';
let _socket = null;

// ── Singleton Socket.IO client ────────────────────────────────────────────────
function getSocket() {
    if (!_socket) {
        _socket = io(API_BASE, {
            transports: ['websocket'],
            reconnectionDelay: 1000,
            reconnectionDelayMax: 30000,
            reconnectionAttempts: Infinity
        });
    }
    return _socket;
}

// ── REST helpers ──────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    return res.json();
}

export const plcAPI = {
    getStatus: () => apiFetch('/api/plc/status'),
    connect: (cfg = {}) => apiFetch('/api/plc/connect', { method: 'POST', body: JSON.stringify(cfg) }),
    disconnect: () => apiFetch('/api/plc/disconnect', { method: 'POST', body: '{}' }),
    getPorts: () => apiFetch('/api/plc/ports'),
    writeTag: (tagName, val) => apiFetch('/api/plc/write/tag', { method: 'POST', body: JSON.stringify({ tagName, value: val }) }),
    readTag: (tagName) => apiFetch(`/api/plc/read/tag?tagName=${encodeURIComponent(tagName)}`),
    writeCoil: (t, a, v) => apiFetch('/api/plc/write/coil', { method: 'POST', body: JSON.stringify({ type: t, address: a, value: v }) }),
    readCoil: (t, a, c = 1) => apiFetch(`/api/plc/read/coil?type=${t}&address=${a}&count=${c}`),
    writeRegister: (t, a, v) => apiFetch('/api/plc/write/register', { method: 'POST', body: JSON.stringify({ type: t, address: a, value: v }) }),
    readRegister: (t, a, c = 1) => apiFetch(`/api/plc/read/register?type=${t}&address=${a}&count=${c}`),
    getSettings: () => apiFetch('/api/plc/settings'),
    saveSettings: (cfg) => apiFetch('/api/plc/settings', { method: 'POST', body: JSON.stringify(cfg) }),
    getTags: () => apiFetch('/api/plc/tags'),
    saveTags: (tags) => apiFetch('/api/plc/tags', { method: 'POST', body: JSON.stringify(tags) }),
    getLogs: (opts = {}) => apiFetch(`/api/plc/logs?${new URLSearchParams(opts)}`),
    clearLogs: () => apiFetch('/api/plc/logs', { method: 'DELETE' }),
};

// ── Hook: PLC connection status ───────────────────────────────────────────────
export function usePLCStatus() {
    const [status, setStatus] = useState({
        connected: false,
        connecting: false,
        reconnecting: false,
        mockMode: false,
        port: null,
        slaveId: null,
        pollInterval: 500,
    });

    useEffect(() => {
        plcAPI.getStatus().then(r => { if (r.success) setStatus(r.data); }).catch(() => { });
        const socket = getSocket();
        const handler = (data) => setStatus(prev => ({ ...prev, ...data }));
        socket.on('plc:status', handler);
        return () => socket.off('plc:status', handler);
    }, []);

    const connect = useCallback((cfg) => plcAPI.connect(cfg), []);
    const disconnect = useCallback(() => plcAPI.disconnect(), []);

    return { status, connect, disconnect };
}

// ── Hook: live tag values ─────────────────────────────────────────────────────
export function usePLCTags() {
    const [tagValues, setTagValues] = useState({});   // { tagName: value }

    useEffect(() => {
        const socket = getSocket();

        const handleCoil = (data) => {
            setTagValues(prev => ({ ...prev, [data.tag]: data.value }));
        };
        const handleReg = (data) => {
            setTagValues(prev => ({ ...prev, [data.tag]: data.value }));
        };

        socket.on('plc:coil_update', handleCoil);
        socket.on('plc:register_update', handleReg);

        return () => {
            socket.off('plc:coil_update', handleCoil);
            socket.off('plc:register_update', handleReg);
        };
    }, []);

    return tagValues;
}

// ── Hook: fault events ────────────────────────────────────────────────────────
export function usePLCFault() {
    const [fault, setFault] = useState(null);

    useEffect(() => {
        const socket = getSocket();
        const handler = (data) => setFault(data);
        socket.on('plc:fault', handler);
        return () => socket.off('plc:fault', handler);
    }, []);

    const clearFault = () => setFault(null);
    return { fault, clearFault };
}

// ── Hook: PLC logs (live) ─────────────────────────────────────────────────────
export function usePLCLogs(limit = 100) {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        setLoading(true);
        plcAPI.getLogs({ limit }).then(r => {
            if (r.success) { setLogs(r.logs || []); setTotal(r.total || 0); }
        }).catch(() => { }).finally(() => {
            setLoading(false);
        });
    }, [limit]);

    useEffect(() => {
        refresh();
        // Re-fetch on any new PLC log via socket
        const socket = getSocket();
        socket.on('plc:coil_update', refresh);
        socket.on('plc:register_update', refresh);
        socket.on('plc:status', refresh);
        return () => {
            socket.off('plc:coil_update', refresh);
            socket.off('plc:register_update', refresh);
            socket.off('plc:status', refresh);
        };
    }, [refresh]);

    return { logs, total, loading, refresh };
}

export default plcAPI;
