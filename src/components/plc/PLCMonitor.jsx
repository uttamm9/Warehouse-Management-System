/**
 * PLCMonitor.jsx — Real-time PLC Register & Coil Monitor
 */
import React, { useState, useEffect } from 'react';
import { plcAPI, usePLCStatus, usePLCTags } from '../../services/plcService';

export default function PLCMonitor() {
  const { status } = usePLCStatus();
  const liveValues = usePLCTags();
  const [tagsList, setTagsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const r = await plcAPI.getTags();
      if (r.success) {
        setTagsList(r.tags || []);
      }
    } catch (e) {
      console.error('Error fetching tags for monitor', e);
    }
    setLoading(false);
  };

  const getStatusLabel = (tag) => {
    if (!status.connected) return { text: 'OFFLINE', className: 'monitor-stale' };
    const val = liveValues[tag.name];
    if (val === undefined) return { text: 'WAITING', className: 'monitor-waiting' };
    
    if (tag.name === 'Conveyor_Fault' && val) {
      return { text: 'FAULT', className: 'monitor-fault' };
    }
    return { text: 'OK', className: 'monitor-ok' };
  };

  const filteredTags = tagsList.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(search.toLowerCase()) || 
                          (tag.description && tag.description.toLowerCase().includes(search.toLowerCase()));
    const matchesType = filterType === 'ALL' || tag.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) return <div className="plc-loading">Loading live monitor…</div>;

  return (
    <div className="plc-page">
      {/* Header */}
      <div className="plc-page-header">
        <div>
          <h2 className="plc-page-title">Real-time PLC Status Monitor</h2>
          <p className="plc-page-sub">Live monitoring table of all mapped coils, inputs, and holding registers</p>
        </div>
        <div className="plc-status-badge">
          <span className={`plc-dot ${status.connected ? 'plc-dot-green' : 'plc-dot-red'}`}>
            <span className="plc-dot-pulse" />
          </span>
          <span className={status.connected ? 'plc-status-text-green' : 'plc-status-text-red'}>
            {status.connected ? `PLC Online${status.mockMode ? ' (Mock)' : ''}` : 'PLC Offline'}
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="plc-card plc-toolbar-card mb-6">
        <div className="plc-toolbar-flex">
          <input 
            type="text" 
            className="plc-input flex-1 max-w-md" 
            placeholder="🔍 Search tags or descriptions..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Filter Type:</span>
            <select 
              className="plc-select w-40" 
              value={filterType} 
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="ALL">All Registers</option>
              <option value="M">M (Coils)</option>
              <option value="X">X (Inputs)</option>
              <option value="Y">Y (Outputs)</option>
              <option value="D">D (Registers)</option>
              <option value="T">T (Timers)</option>
              <option value="C">C (Counters)</option>
            </select>
          </div>
          <button className="plc-btn plc-btn-secondary" onClick={fetchTags}>
            🔄 Refresh Tags Map
          </button>
        </div>
      </div>

      {/* Monitor Grid / Table */}
      <div className="plc-card plc-table-card">
        <table className="plc-table">
          <thead>
            <tr>
              <th>Tag Name</th>
              <th>Modbus / PLC Address</th>
              <th>Direction</th>
              <th>Description</th>
              <th>Live Value</th>
              <th className="text-right">Diagnostics Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTags.map(tag => {
              const liveVal = liveValues[tag.name];
              const stat = getStatusLabel(tag);
              
              // Value styling
              let valElement = <span className="text-slate-500">—</span>;
              if (status.connected && liveVal !== undefined) {
                if (tag.type === 'M' || tag.type === 'X' || tag.type === 'Y') {
                  valElement = liveVal ? (
                    <span className="plc-monitor-val val-high">ON / 1</span>
                  ) : (
                    <span className="plc-monitor-val val-low">OFF / 0</span>
                  );
                } else {
                  valElement = <span className="plc-monitor-val val-reg">{liveVal}</span>;
                }
              }

              return (
                <tr key={tag.id}>
                  <td className="font-semibold text-blue-300">{tag.name}</td>
                  <td>
                    <span className={`plc-tag-type mr-2 badge-${tag.type}`}>{tag.type}</span>
                    <span className="text-slate-400">Address {tag.address}</span>
                  </td>
                  <td>
                    <span className={`plc-tag-dir dir-${tag.direction.replace('+', '_')}`}>
                      {tag.direction}
                    </span>
                  </td>
                  <td className="text-slate-400 text-sm max-w-xs truncate" title={tag.description}>
                    {tag.description || '—'}
                  </td>
                  <td className="font-mono text-base">{valElement}</td>
                  <td className="text-right">
                    <span className={`plc-diag-status ${stat.className}`}>
                      {stat.text}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filteredTags.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-slate-500 py-8">
                  No matching tags found under current search or filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
