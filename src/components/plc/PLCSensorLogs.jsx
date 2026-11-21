/**
 * PLCSensorLogs.jsx — PLC Sensor Log Viewer
 * Displays logs from GET /api/logs/plc endpoint with filtering and pagination
 * Requirements: 4.6, 12.3, 12.4
 */
import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001';

// All 19 racks for filter dropdown
const ALL_RACKS = Array.from({ length: 19 }, (_, i) =>
    `S1-R${String(i + 1).padStart(2, '0')}`
);

const OPERATIONS = ['SENSOR_ON', 'SENSOR_OFF', 'READ', 'WRITE'];

export default function PLCSensorLogs() {
    // Filter state
    const [rackId, setRackId] = useState('');
    const [operation, setOperation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Pagination state
    const [limit] = useState(50);
    const [offset, setOffset] = useState(0);

    // Data state
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Statistics state
    const [statistics, setStatistics] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);

    // Fetch logs from API
    const fetchLogs = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                limit: limit.toString(),
                offset: offset.toString()
            });

            if (rackId) params.append('rackId', rackId);
            if (operation) params.append('operation', operation);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await fetch(`${API_BASE}/api/logs/plc?${params}`);
            const result = await response.json();

            if (result.success) {
                setLogs(result.data.logs);
                setTotal(result.data.total);
            } else {
                setError(result.message || 'Failed to fetch logs');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch logs');
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics from API
    const fetchStatistics = async () => {
        setStatsLoading(true);

        try {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await fetch(`${API_BASE}/api/logs/plc/statistics?${params}`);
            const result = await response.json();

            if (result.success) {
                setStatistics(result.data);
            }
        } catch (err) {
            console.error('Failed to fetch statistics:', err);
        } finally {
            setStatsLoading(false);
        }
    };

    // Fetch logs on mount and when filters/pagination change
    useEffect(() => {
        fetchLogs();
    }, [rackId, operation, startDate, endDate, offset]);

    // Fetch statistics when date range changes
    useEffect(() => {
        fetchStatistics();
    }, [startDate, endDate]);

    // Handle filter reset
    const handleReset = () => {
        setRackId('');
        setOperation('');
        setStartDate('');
        setEndDate('');
        setOffset(0);
    };

    // Handle export to CSV
    const handleExportCSV = () => {
        if (logs.length === 0) return;

        const dateStr = new Date().toISOString().slice(0, 10);
        const headers = ['Timestamp', 'Rack ID', 'Operation', 'Address', 'Value', 'Status', 'SKU', 'Details'];

        const escapeCSV = (val) => {
            const s = String(val == null ? '' : val);
            return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
        };

        const rows = logs.map(log => [
            log.timestamp,
            log.rackId || '',
            log.plcOperation || '',
            log.plcAddress !== undefined ? log.plcAddress : '',
            log.plcValue || '',
            log.status || '',
            log.item || '',
            log.details || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\r\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", url);
        dlAnchorElem.setAttribute("download", `plc-sensor-logs-${dateStr}.csv`);
        document.body.appendChild(dlAnchorElem);
        dlAnchorElem.click();
        document.body.removeChild(dlAnchorElem);
        URL.revokeObjectURL(url);
    };

    // Calculate pagination info
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);
    const hasMore = (offset + limit) < total;

    return (
        <div className="plc-page">
            {/* Header */}
            <div className="plc-page-header">
                <div>
                    <h2 className="plc-page-title">PLC Sensor Logs</h2>
                    <p className="plc-page-sub">View sensor activation history with filtering and statistics</p>
                </div>
                <div className="plc-tag-actions">
                    <button
                        className="plc-btn plc-btn-secondary"
                        onClick={handleExportCSV}
                        disabled={logs.length === 0}
                    >
                        📤 Export to CSV
                    </button>
                    <button
                        className="plc-btn plc-btn-secondary"
                        onClick={fetchLogs}
                        disabled={loading}
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="plc-stats-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px'
                }}>
                    <div className="plc-card" style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Total Operations</div>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#e2e8f0' }}>
                            {statistics.totalOperations}
                        </div>
                    </div>

                    <div className="plc-card" style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Success Rate</div>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: statistics.successRate >= 90 ? '#10b981' : '#f59e0b' }}>
                            {statistics.successRate}%
                        </div>
                    </div>

                    {statistics.averageResponseTime !== null && (
                        <div className="plc-card" style={{ padding: '16px' }}>
                            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Avg Response Time</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#e2e8f0' }}>
                                {statistics.averageResponseTime}ms
                            </div>
                        </div>
                    )}

                    <div className="plc-card" style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Operation Breakdown</div>
                        <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '8px' }}>
                            {statistics.operationBreakdown && Object.entries(statistics.operationBreakdown).map(([op, count]) => (
                                <div key={op} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span>{op}:</span>
                                    <span style={{ fontWeight: 'bold' }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {statistics.errorsByRack && Object.keys(statistics.errorsByRack).length > 0 && (
                        <div className="plc-card" style={{ padding: '16px' }}>
                            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Errors by Rack</div>
                            <div style={{ fontSize: '12px', color: '#fbbf24', marginTop: '8px' }}>
                                {Object.entries(statistics.errorsByRack).map(([rack, count]) => (
                                    <div key={rack} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span>{rack}:</span>
                                        <span style={{ fontWeight: 'bold' }}>{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Filter Panel */}
            <div className="plc-card plc-toolbar-card mb-6">
                <div style={{ marginBottom: '16px' }}>
                    <strong style={{ color: '#e2e8f0' }}>Filters</strong>
                </div>
                <div className="plc-grid2">
                    {/* Rack Filter */}
                    <label className="plc-label">
                        Rack ID
                        <select
                            className="plc-select"
                            value={rackId}
                            onChange={e => {
                                setRackId(e.target.value);
                                setOffset(0); // Reset to first page when filter changes
                            }}
                        >
                            <option value="">All Racks</option>
                            {ALL_RACKS.map(rack => (
                                <option key={rack} value={rack}>{rack}</option>
                            ))}
                        </select>
                    </label>

                    {/* Operation Filter */}
                    <label className="plc-label">
                        Operation
                        <select
                            className="plc-select"
                            value={operation}
                            onChange={e => {
                                setOperation(e.target.value);
                                setOffset(0);
                            }}
                        >
                            <option value="">All Operations</option>
                            {OPERATIONS.map(op => (
                                <option key={op} value={op}>{op}</option>
                            ))}
                        </select>
                    </label>

                    {/* Start Date Filter */}
                    <label className="plc-label">
                        Start Date
                        <input
                            type="date"
                            className="plc-input"
                            value={startDate}
                            onChange={e => {
                                setStartDate(e.target.value);
                                setOffset(0);
                            }}
                        />
                    </label>

                    {/* End Date Filter */}
                    <label className="plc-label">
                        End Date
                        <input
                            type="date"
                            className="plc-input"
                            value={endDate}
                            onChange={e => {
                                setEndDate(e.target.value);
                                setOffset(0);
                            }}
                        />
                    </label>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#94a3b8' }}>
                        Showing {logs.length} of {total} logs
                    </span>
                    <button className="plc-btn plc-btn-secondary" onClick={handleReset}>
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="plc-banner plc-banner-err" role="alert" style={{ marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            {/* Logs Table */}
            <div className="plc-card plc-table-card">
                <div className="plc-table-wrapper max-h-[600px] overflow-y-auto">
                    <table className="plc-table">
                        <thead className="sticky top-0 bg-[#1e293b]">
                            <tr>
                                <th>Timestamp</th>
                                <th>Rack</th>
                                <th>Operation</th>
                                <th>Address</th>
                                <th>Value</th>
                                <th>Status</th>
                                <th>SKU</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center text-slate-400 py-10">
                                        Loading logs...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center text-slate-500 py-10">
                                        No sensor logs found matching the current filters.
                                    </td>
                                </tr>
                            ) : (
                                logs.map(log => {
                                    let statusClass = 'text-slate-300';
                                    if (log.status === 'success') statusClass = 'text-green-400';
                                    else if (log.status === 'error') statusClass = 'text-red-400';
                                    else if (log.status === 'warning') statusClass = 'text-yellow-400';

                                    return (
                                        <tr key={log.id}>
                                            <td className="font-mono text-xs text-slate-400 whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="font-semibold text-blue-300">
                                                {log.rackId || '—'}
                                            </td>
                                            <td>
                                                <span className={`plc-log-type ${log.plcOperation === 'SENSOR_ON' ? 'log-write' :
                                                        log.plcOperation === 'SENSOR_OFF' ? 'log-read' :
                                                            'log-info'
                                                    }`}>
                                                    {log.plcOperation || '—'}
                                                </span>
                                            </td>
                                            <td className="font-mono text-sm">
                                                {log.plcAddress !== undefined && log.plcAddress !== null ? log.plcAddress : '—'}
                                            </td>
                                            <td className="font-mono">
                                                {log.plcValue || '—'}
                                            </td>
                                            <td className={statusClass}>
                                                {log.status || '—'}
                                            </td>
                                            <td className="text-slate-200 text-sm">
                                                {log.item || '—'}
                                            </td>
                                            <td className="text-slate-300 text-xs max-w-md truncate" title={log.details}>
                                                {log.details || '—'}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!loading && total > 0 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        borderTop: '1px solid #334155'
                    }}>
                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                            Page {currentPage} of {totalPages}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                className="plc-btn plc-btn-secondary"
                                onClick={() => setOffset(Math.max(0, offset - limit))}
                                disabled={offset === 0}
                            >
                                ← Previous
                            </button>
                            <button
                                className="plc-btn plc-btn-secondary"
                                onClick={() => setOffset(offset + limit)}
                                disabled={!hasMore}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
