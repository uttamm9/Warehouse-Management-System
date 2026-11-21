/**
 * PLCLogs.jsx — PLC Communication Log Viewer
 */
import React, { useState, useEffect, useRef } from 'react';
import { plcAPI, usePLCLogs } from '../../services/plcService';

export default function PLCLogs() {
  const [filterType, setFilterType] = useState('');
  const [searchText, setSearchText] = useState('');  // Req 9.6
  const [limit, setLimit] = useState(100);
  const { logs, total, refresh } = usePLCLogs(limit);
  const [busy, setBusy] = useState(false);
  const logEndRef = useRef(null);

  // Auto-scroll to top (since newest are first in getLogs reverse)
  useEffect(() => {
    // If the user wants to see newest first, they are at the top
  }, [logs]);

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all PLC communication logs?')) return;
    setBusy(true);
    try {
      const r = await plcAPI.clearLogs();
      if (r.success) {
        refresh();
      }
    } catch (e) {
      console.error('Failed to clear logs', e);
    }
    setBusy(false);
  };

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (Req 9.7)
    const headers = ['id', 'timestamp', 'type', 'message', 'tag', 'address', 'value'];
    const escapeCSV = (val) => {
      const s = String(val == null ? '' : val);
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = filteredLogs.map(e => [
      e.id || '',
      e.timestamp,
      e.type,
      e.message,
      e.tag || '',
      e.address !== undefined ? e.address : '',
      e.value !== undefined ? (typeof e.value === 'object' ? JSON.stringify(e.value) : e.value) : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", url);
    dlAnchorElem.setAttribute("download", `plc-log-${dateStr}.csv`);
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    document.body.removeChild(dlAnchorElem);
    URL.revokeObjectURL(url);
  };

  // Apply type filter and free-text message search (Req 9.6)
  const filteredLogs = logs.filter(log => {
    const typeMatch = !filterType || log.type === filterType;
    const searchMatch = !searchText || (log.message || '').toLowerCase().includes(searchText.toLowerCase());
    return typeMatch && searchMatch;
  });

  return (
    <div className="plc-page">
      {/* Header */}
      <div className="plc-page-header">
        <div>
          <h2 className="plc-page-title">PLC Communication Logs</h2>
          <p className="plc-page-sub">Trace communication logs, transactions, reads, writes, and connection events</p>
        </div>
        <div className="plc-tag-actions">
          <button className="plc-btn plc-btn-secondary" onClick={handleExportCSV} disabled={logs.length === 0}>
            📤 Export to CSV
          </button>
          <button className="plc-btn plc-btn-danger" onClick={handleClearLogs} disabled={busy}>
            🗑️ Clear Logs
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="plc-card plc-toolbar-card mb-6">
        <div className="plc-toolbar-flex">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Event Type:</span>
            <select
              className="plc-select w-44"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="">All Events</option>
              <option value="READ">READ (Polls)</option>
              <option value="WRITE">WRITE (Commands)</option>
              <option value="CONNECT">CONNECT</option>
              <option value="DISCONNECT">DISCONNECT</option>
              <option value="ERROR">ERROR</option>
              <option value="INFO">INFO</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Show Limit:</span>
            <select
              className="plc-select w-28"
              value={limit}
              onChange={e => {
                setLimit(parseInt(e.target.value));
                refresh();
              }}
            >
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
            </select>
          </div>

          {/* Free-text search (Req 9.6) */}
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-slate-400">Search:</span>
            <input
              type="text"
              className="plc-input flex-1"
              placeholder="Filter by message…"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>

          <span className="text-sm text-slate-400 flex-1 text-right">
            Showing {filteredLogs.length} of {total} total logs in memory
          </span>

          <button className="plc-btn plc-btn-secondary ml-4" onClick={refresh}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="plc-card plc-table-card">
        <div className="plc-table-wrapper max-h-[500px] overflow-y-auto">
          <table className="plc-table">
            <thead className="sticky top-0 bg-[#1e293b]">
              <tr>
                <th>Timestamp</th>
                <th>Type</th>
                <th>Target / Tag</th>
                <th>Value</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => {
                let typeClass = 'log-info';
                if (log.type === 'READ') typeClass = 'log-read';
                else if (log.type === 'WRITE') typeClass = 'log-write';
                else if (log.type === 'CONNECT') typeClass = 'log-connect';
                else if (log.type === 'DISCONNECT') typeClass = 'log-disconnect';
                else if (log.type === 'ERROR') typeClass = 'log-error';

                return (
                  <tr key={log.id} className={`log-row-${log.type.toLowerCase()}`}>
                    <td className="font-mono text-xs text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <span className={`plc-log-type ${typeClass}`}>{log.type}</span>
                    </td>
                    <td className="font-semibold text-blue-300">
                      {log.tag || (log.address !== undefined ? `Addr ${log.address}` : '—')}
                    </td>
                    <td className="font-mono">
                      {log.value !== undefined ? (
                        typeof log.value === 'boolean'
                          ? (log.value ? '1' : '0')
                          : String(log.value)
                      ) : '—'}
                    </td>
                    <td className="text-slate-200 text-sm max-w-lg break-all">
                      {log.message}
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-slate-500 py-10">
                    No communication events recorded in log history yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
