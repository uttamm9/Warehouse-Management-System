/**
 * ConveyorControl.jsx — Animated Conveyor Belt Control Panel
 * Requirements: 6.3, 6.4, 6.5, 6.6, 6.8, 6.9, 8.1, 8.2, 8.3, 12.1, 12.6
 */
import React, { useState, useEffect, useRef } from 'react';
import { plcAPI, usePLCStatus, usePLCTags, usePLCFault } from '../../services/plcService';

export default function ConveyorControl() {
  const { status } = usePLCStatus();
  const tags = usePLCTags();
  const { fault, clearFault } = usePLCFault();
  const [speed, setSpeed] = useState(50);
  const [writing, setWriting] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);
  const [estopError, setEstopError] = useState(null); // persistent E-stop error (Req 12.6)
  const [faultTimestamp, setFaultTimestamp] = useState(null);

  // Sync speed from PLC tag
  const liveSpeed = tags['Belt_Speed'];
  useEffect(() => {
    if (liveSpeed !== undefined) setSpeed(liveSpeed);
  }, [liveSpeed]);

  // Track fault timestamp when Conveyor_Fault goes true; clear E-stop error when fault clears
  const faultTagValue = tags['Conveyor_Fault'];
  useEffect(() => {
    if (faultTagValue === true) {
      setFaultTimestamp(new Date().toISOString());
    } else if (faultTagValue === false) {
      setFaultTimestamp(null);
      setEstopError(null);
    }
  }, [faultTagValue]);

  // Conv_Anim registers — any non-zero value means a belt segment is animating (Req 6.8)
  const convAnimActive = ['Conv_Anim_D0', 'Conv_Anim_D2', 'Conv_Anim_D3', 'Conv_Anim_D4', 'Conv_Anim_D5', 'Conv_Anim_D10']
    .some(k => tags[k] !== undefined && tags[k] !== 0);

  const showActionMsg = (ok, text, persistent = false) => {
    setActionMsg({ ok, text, persistent });
    if (!persistent) setTimeout(() => setActionMsg(null), 3000);
  };

  // Momentary pulse: write true → after 200 ms write false (Req 6.4, 6.5)
  const momentaryPulse = async (tagName) => {
    if (!status.connected) return showActionMsg(false, 'Cannot write: PLC is offline');
    setWriting(true);
    try {
      const r = await plcAPI.writeTag(tagName, true);
      if (!r.success) {
        showActionMsg(false, r.message || `Failed to send command to '${tagName}'`);
        setWriting(false);
        return;
      }
      setTimeout(() => plcAPI.writeTag(tagName, false), 200);
      showActionMsg(true, `Command sent to '${tagName}'`);
    } catch (e) {
      showActionMsg(false, 'Network error executing PLC command');
    }
    setWriting(false);
  };

  // Emergency Stop: latched, no auto-reset (Req 6.6, 12.6)
  const handleEStop = async () => {
    setWriting(true);
    try {
      const r = await plcAPI.writeTag('Emergency_Stop', true);
      if (!r.success) {
        const msg = 'Emergency stop command failed — activate physical E-stop on HMI panel immediately!';
        setEstopError(msg);
        showActionMsg(false, msg, true);
      }
    } catch (e) {
      const msg = 'Emergency stop command failed — activate physical E-stop on HMI panel immediately!';
      setEstopError(msg);
      showActionMsg(false, msg, true);
    }
    setWriting(false);
  };

  const handleWriteTag = async (tagName, value) => {
    if (!status.connected) return showActionMsg(false, 'Cannot write: PLC is offline');
    setWriting(true);
    try {
      const r = await plcAPI.writeTag(tagName, value);
      if (r.success) showActionMsg(true, `Command sent to '${tagName}'`);
      else showActionMsg(false, r.message || `Failed to write tag '${tagName}'`);
    } catch (e) {
      showActionMsg(false, 'Network error executing PLC command');
    }
    setWriting(false);
  };

  const handleSpeedChange = (e) => setSpeed(parseInt(e.target.value, 10));
  const handleSpeedCommit = async () => { await handleWriteTag('Belt_Speed', speed); };

  const isRunning = Boolean(tags['Conveyor_Running']) || convAnimActive;
  const isFault = Boolean(tags['Conveyor_Fault']) || !!fault;
  const animationDuration = speed > 0 ? `${Math.max(0.5, 3 - (speed / 40))}s` : '0s';

  return (
    <div className="plc-page" style={{ position: 'relative' }}>

      {/* Disconnected overlay (Req 6.9, 12.1) */}
      {!status.connected && (
        <div className="plc-disconnected-overlay" role="alert" aria-live="assertive">
          <div className="plc-disconnected-msg">
            <span style={{ fontSize: '2rem' }}>🔌</span>
            <strong>PLC Disconnected — Controls disabled</strong>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="plc-page-header">
        <div>
          <h2 className="plc-page-title">Conveyor Belt Automation</h2>
          <p className="plc-page-sub">Direct control and live visualization of Room 1 Conveyor system</p>
        </div>
        <div className="plc-status-badge">
          <span className={`plc-dot ${status.connected ? 'plc-dot-green' : 'plc-dot-red'}`}>
            <span className="plc-dot-pulse" />
          </span>
          <span className={status.connected ? 'plc-status-text-green' : 'plc-status-text-red'}>
            {status.connected ? `PLC Connected${status.mockMode ? ' (Mock)' : ''}` : 'PLC Offline'}
          </span>
        </div>
      </div>

      {/* Fault banner (Req 8.3) */}
      {isFault && (
        <div className="plc-alarm-banner">
          <span className="plc-alarm-icon">⚠️</span>
          <div className="plc-alarm-content">
            <strong>FAULT</strong>
            <span>Conveyor fault detected{faultTimestamp ? ` at ${new Date(faultTimestamp).toLocaleTimeString()}` : ''}. Check E-Stop status or mechanical blockages.</span>
          </div>
          <button className="plc-alarm-reset-btn" onClick={clearFault}>Acknowledge</button>
        </div>
      )}

      {/* Persistent E-Stop error (Req 12.6) */}
      {estopError && (
        <div className="plc-banner plc-banner-err" style={{ fontWeight: 'bold' }}>
          🚨 {estopError}
        </div>
      )}

      {/* Transient message feedback */}
      {actionMsg && !actionMsg.persistent && (
        <div className={`plc-banner ${actionMsg.ok ? 'plc-banner-ok' : 'plc-banner-err'}`}>
          {actionMsg.text}
        </div>
      )}

      {/* Main Grid */}
      <div className="plc-grid-main">
        {/* Animated SVG Conveyor Panel */}
        <div className={`plc-card plc-conveyor-card ${isRunning ? 'state-running' : ''} ${isFault ? 'state-fault' : ''}`}>
          <div className="plc-section-title">
            Live System Visualization
            {isFault && (
              <span style={{ marginLeft: '1rem', background: '#ef4444', color: '#fff', borderRadius: '4px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                FAULT
              </span>
            )}
          </div>

          <div className="plc-conveyor-viewport">
            <svg viewBox="0 0 800 240" className="plc-conveyor-svg">
              <defs>
                <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {isRunning && !isFault && <rect x="40" y="80" width="720" height="70" rx="35" fill="#10b981" opacity="0.03" filter="url(#glow-green)" />}
              {isFault && <rect x="40" y="80" width="720" height="70" rx="35" fill="#ef4444" opacity="0.08" filter="url(#glow-red)" />}

              {/* Belt track */}
              <rect x="40" y="80" width="720" height="70" rx="35" fill="none"
                stroke={isFault ? '#ef4444' : '#475569'} strokeWidth="8" />

              {/* Belt loop — red when faulted (Req 8.3) */}
              <rect x="45" y="85" width="710" height="60" rx="30" fill="none"
                stroke={isFault ? '#b91c1c' : isRunning ? '#059669' : '#1e293b'}
                strokeWidth="12" strokeDasharray="30 15"
                style={{
                  animationName: isRunning && !isFault ? 'conveyor-run' : 'none',
                  animationDuration,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'linear'
                }}
                className="conveyor-belt-loop" />

              {/* Gears */}
              {[100, 400, 700].map((cx, i) => (
                <g key={i} transform={`translate(${cx}, 115)`}
                  style={{
                    animationName: isRunning && !isFault ? 'spin-clockwise' : 'none',
                    animationDuration, animationIterationCount: 'infinite', animationTimingFunction: 'linear'
                  }}
                  className="conveyor-gear">
                  <circle cx="0" cy="0" r="30" fill="#334155" stroke="#64748b" strokeWidth="4" />
                  <line x1="0" y1="-30" x2="0" y2="30" stroke="#64748b" strokeWidth="4" />
                  <line x1="-30" y1="0" x2="30" y2="0" stroke="#64748b" strokeWidth="4" />
                  <circle cx="0" cy="0" r="10" fill="#0f172a" />
                </g>
              ))}

              {/* Moving packages */}
              {isRunning && !isFault && (
                <>
                  <rect x="0" y="95" width="40" height="30" rx="4" fill="#d97706" opacity="0.9">
                    <animateTransform attributeName="transform" type="translate" from="80 0" to="680 0" dur="6s" repeatCount="indefinite" />
                  </rect>
                  <rect x="0" y="95" width="45" height="30" rx="4" fill="#b45309" opacity="0.9">
                    <animateTransform attributeName="transform" type="translate" from="-200 0" to="680 0" dur="9s" repeatCount="indefinite" />
                  </rect>
                </>
              )}
              {!isRunning && !isFault && (
                <rect x="350" y="95" width="40" height="30" rx="4" fill="#92400e" opacity="0.8" />
              )}
              {isFault && (
                <g>
                  <rect x="350" y="95" width="40" height="30" rx="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
                  <text x="364" y="115" fill="#ef4444" fontSize="18" fontWeight="bold">!</text>
                </g>
              )}
            </svg>
          </div>

          {/* Diagnostics */}
          <div className="plc-conveyor-stats mt-4">
            <div className="plc-conveyor-stat">
              <span>Running Status</span>
              <strong className={isRunning ? 'text-green-400' : 'text-slate-400'}>
                {isRunning ? 'RUNNING' : 'STOPPED'}
              </strong>
            </div>
            <div className="plc-conveyor-stat">
              <span>Belt Speed</span>
              <strong className="text-blue-300">{speed}%</strong>
            </div>
            <div className="plc-conveyor-stat">
              <span>Fault Status</span>
              <strong className={isFault ? 'text-red-400' : 'text-green-400'}>
                {isFault ? 'FAULT' : 'OK'}
              </strong>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="plc-card plc-controls-card">
          <div className="plc-section-title">Control Operations</div>

          <div className="plc-ops-buttons">
            {/* Start — momentary pulse (Req 6.4) */}
            <button
              id="conveyor-start-btn"
              className="plc-btn-large plc-btn-start"
              onClick={() => momentaryPulse('Conveyor_Start')}
              disabled={writing || isFault || !status.connected}
              aria-disabled={writing || isFault || !status.connected}
            >
              <span className="plc-ops-icon">🟢</span>
              <span className="plc-ops-lbl">START SYSTEM</span>
            </button>

            {/* Stop — momentary pulse (Req 6.5) */}
            <button
              id="conveyor-stop-btn"
              className="plc-btn-large plc-btn-stop"
              onClick={() => momentaryPulse('Conveyor_Stop')}
              disabled={writing || !status.connected}
              aria-disabled={writing || !status.connected}
            >
              <span className="plc-ops-icon">🔴</span>
              <span className="plc-ops-lbl">STOP SYSTEM</span>
            </button>

            {/* E-Stop — latched (Req 6.6) */}
            <button
              id="conveyor-estop-btn"
              className="plc-btn-large plc-btn-estop"
              onClick={handleEStop}
              disabled={writing || !status.connected}
              aria-disabled={writing || !status.connected}
            >
              <span className="plc-ops-icon">🛑</span>
              <span className="plc-ops-lbl">EMERGENCY STOP</span>
            </button>
          </div>

          <hr className="plc-divider" />

          {/* Speed Slider */}
          <div className="plc-speed-slider-container">
            <div className="plc-slider-header">
              <span className="plc-label-main">Belt Target Speed</span>
              <span className="plc-slider-value">{speed}%</span>
            </div>
            <input
              id="conveyor-speed-slider"
              type="range"
              min="0"
              max="100"
              value={speed}
              onChange={handleSpeedChange}
              onMouseUp={handleSpeedCommit}
              onTouchEnd={handleSpeedCommit}
              disabled={!status.connected || isFault}
              className="plc-speed-slider"
            />
            <div className="plc-slider-ticks">
              <span>0% (Halt)</span>
              <span>50% (Normal)</span>
              <span>100% (Maximum)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
