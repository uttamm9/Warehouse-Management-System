/**
 * plcApi.ts — PLC REST + Socket.IO client for the renderer app
 * All calls are safe — never throw, always return fallback values.
 */

import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

// ── Backend URL ───────────────────────────────────────────────────────────────
export const API_BASE: string =
    (import.meta as any).env?.VITE_PLC_API_URL ?? 'http://localhost:3001';

// ── Socket.IO singleton ───────────────────────────────────────────────────────
let _socket: ReturnType<typeof io> | null = null;

function getSocket() {
    if (!_socket) {
        _socket = io(API_BASE, {
            transports: ['websocket'],
            reconnectionDelay: 1000,
            reconnectionDelayMax: 30000,
            reconnectionAttempts: Infinity,
            autoConnect: true,
        });
    }
    return _socket;
}

// ── REST helper ───────────────────────────────────────────────────────────────
async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });
        if (!res.ok) return { success: false, message: `HTTP ${res.status}` };
        return await res.json();
    } catch (e: any) {
        console.warn(`[plcApi] fetch ${path} failed:`, e?.message);
        return { success: false, message: e?.message ?? 'Network error' };
    }
}

// ── Public REST API ───────────────────────────────────────────────────────────
export const plcAPI = {
    getStatus: () => apiFetch('/api/plc/status'),
    connect: (cfg: any = {}) => apiFetch('/api/plc/connect', { method: 'POST', body: JSON.stringify(cfg) }),
    disconnect: () => apiFetch('/api/plc/disconnect', { method: 'POST', body: '{}' }),
    getPorts: () => apiFetch('/api/plc/ports'),
    writeTag: (name: string, val: any) => apiFetch('/api/plc/write/tag', { method: 'POST', body: JSON.stringify({ tagName: name, value: val }) }),
    readTag: (name: string) => apiFetch(`/api/plc/read/tag?tagName=${encodeURIComponent(name)}`),
    getSettings: () => apiFetch('/api/plc/settings'),
    saveSettings: (cfg: any) => apiFetch('/api/plc/settings', { method: 'POST', body: JSON.stringify(cfg) }),
    getTags: () => apiFetch('/api/plc/tags'),
    saveTags: (tags: any[]) => apiFetch('/api/plc/tags', { method: 'POST', body: JSON.stringify(tags) }),
    getLogs: (opts: Record<string, any> = {}) =>
        apiFetch(`/api/plc/logs?${new URLSearchParams(opts as any)}`),
    clearLogs: () => apiFetch('/api/plc/logs', { method: 'DELETE' }),
};

// ── Hook: PLC connection status ───────────────────────────────────────────────
export function usePLCStatus() {
    const [status, setStatus] = useState<any>({
        connected: false, connecting: false, reconnecting: false,
        mockMode: false, port: '', slaveId: 1, pollInterval: 500,
    });

    useEffect(() => {
        plcAPI.getStatus().then((r: any) => {
            if (r?.data) setStatus((p: any) => ({ ...p, ...r.data }));
        });
        const socket = getSocket();
        const handler = (data: any) => setStatus((p: any) => ({ ...p, ...data }));
        socket.on('plc:status', handler);
        return () => { socket.off('plc:status', handler); };
    }, []);

    const connect = useCallback((cfg?: any) => plcAPI.connect(cfg ?? {}), []);
    const disconnect = useCallback(() => plcAPI.disconnect(), []);
    return { status, connect, disconnect };
}

// ── Hook: live tag values ─────────────────────────────────────────────────────
export function usePLCTags(): Record<string, any> {
    const [tagValues, setTagValues] = useState<Record<string, any>>({});

    useEffect(() => {
        const socket = getSocket();
        const handler = (data: any) => {
            if (data?.tag !== undefined) {
                setTagValues(p => ({ ...p, [data.tag]: data.value }));
            }
        };
        socket.on('plc:coil_update', handler);
        socket.on('plc:register_update', handler);
        return () => {
            socket.off('plc:coil_update', handler);
            socket.off('plc:register_update', handler);
        };
    }, []);

    return tagValues;
}

// ── Hook: fault events ────────────────────────────────────────────────────────
export function usePLCFault() {
    const [fault, setFault] = useState<any>(null);

    useEffect(() => {
        const socket = getSocket();
        const handler = (data: any) => setFault(data);
        socket.on('plc:fault', handler);
        return () => { socket.off('plc:fault', handler); };
    }, []);

    const clearFault = useCallback(() => setFault(null), []);
    return { fault, clearFault };
}

// ── Hook: PLC logs ────────────────────────────────────────────────────────────
export function usePLCLogs(limit = 100) {
    const [logs, setLogs] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        setLoading(true);
        plcAPI.getLogs({ limit })
            .then((r: any) => {
                if (r?.logs !== undefined) setLogs(r.logs);
                if (r?.total !== undefined) setTotal(r.total);
            })
            .finally(() => setLoading(false));
    }, [limit]);

    useEffect(() => {
        refresh();
        const socket = getSocket();
        socket.on('plc:status', refresh);
        socket.on('plc:coil_update', refresh);
        socket.on('plc:register_update', refresh);
        return () => {
            socket.off('plc:status', refresh);
            socket.off('plc:coil_update', refresh);
            socket.off('plc:register_update', refresh);
        };
    }, [refresh]);

    return { logs, total, loading, refresh };
}
