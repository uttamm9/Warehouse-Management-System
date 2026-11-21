/**
 * Room1RackControl.jsx — Room 1 Rack Selection Panel
 *
 * Requirements: 6.1, 6.2, 6.7, 6.9, 8.4, 8.5, 12.1
 *
 * Layout (mirrors DOPSoft HMI topology):
 *   Top row  : Racks 1–8 (horizontal)
 *   Left col : Racks 9–11 (stacked)
 *   Mid left : Racks 12–15 (2×2 area)
 *   Mid right: Racks 16–19 (2×2 area)
 *   Bottom   : Sensor_1 – Sensor_16 (4-column indicator grid)
 */
import React, { useState } from 'react';
import { plcAPI, usePLCStatus, usePLCTags } from '../../services/plcService';

// ── Inline RackButton ──────────────────────────────────────────────────────────
/**
 * RackButton — momentary pulse on click (Req 6.2)
 * Renders amber when isActive (Req 8.5), disabled when disconnected (Req 6.9, 12.1).
 */
function RackButton({ rackNumber, isActive, isConnected, onSuccess }) {
  const [pressing, setPressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleClick = async () => {
    if (!isConnected || pressing) return;
    setPressing(true);
    setErrorMsg(null);

    try {
      const tagName = `Rack_${rackNumber}`;
      const result = await plcAPI.writeTag(tagName, true);

      if (!result.success) {
        setErrorMsg('Failed to send rack command');
        setPressing(false);
        return;
      }

      // Momentary pulse: reset to false after 200 ms (Req 6.2)
      setTimeout(async () => {
        try {
          await plcAPI.writeTag(tagName, false);
        } catch {
          // Best-effort reset; already logged server-side
        }
        setPressing(false);
        if (onSuccess) onSuccess(rackNumber);
      }, 200);
    } catch {
      setErrorMsg('Failed to send rack command');
      setPressing(false);
    }
  };

  // Base button style
  const baseStyle = {
    minWidth: '3.5rem',
    minHeight: '3rem',
    borderRadius: '8px',
    border: '2px solid',
    fontWeight: 700,
    fontSize: '0.8125rem',
    cursor: isConnected ? 'pointer' : 'not-allowed',
    transition: 'background 0.15s, border-color 0.15s, opacity 0.15s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    opacity: pressing ? 0.7 : 1,
    position: 'relative',
  };

  // Colour: amber when active (Req 8.5), muted-blue when pressing, default slate
  let bgColor, borderColor, textColor;
  if (isActive) {
    bgColor = 'rgba(255,152,0,0.20)';
    borderColor = '#FF9800';
    textColor = '#FF9800';
  } else if (pressing) {
    bgColor = 'rgba(59,130,246,0.25)';
    borderColor = '#60a5fa';
    textColor = '#93c5fd';
  } else {
    bgColor = 'rgba(30,41,59,0.6)';
    borderColor = '#475569';
    textColor = '#94a3b8';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
      <button
        onClick={handleClick}
        disabled={!isConnected}
        style={{ ...baseStyle, background: bgColor, borderColor, color: textColor }}
        title={`Rack ${rackNumber}`}
        aria-label={`Send command to Rack ${rackNumber}`}
        aria-pressed={isActive}
      >
        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>R</span>
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{rackNumber}</span>
        {pressing && (
          <span style={{
            position: 'absolute',
            top: 2, right: 4,
            fontSize: '0.5rem',
            color: '#60a5fa',
            letterSpacing: 0,
          }}>●</span>
        )}
      </button>
      {errorMsg && (
        <span style={{ fontSize: '0.6rem', color: '#f87171', maxWidth: '4rem', textAlign: 'center', lineHeight: 1.2 }}>
          {errorMsg}
        </span>
      )}
    </div>
  );
}

// ── Inline SensorIndicator ─────────────────────────────────────────────────────
/**
 * SensorIndicator — green when sensor value === true, grey otherwise (Req 6.7, 8.4).
 */
function SensorIndicator({ sensorNumber, value }) {
  const isActive = value === true;
  const color = isActive ? '#22c55e' : '#475569';
  const glowStyle = isActive
    ? { boxShadow: '0 0 6px 2px rgba(34,197,94,0.5)' }
    : {};

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
      title={`Sensor ${sensorNumber}: ${isActive ? 'Active' : 'Inactive'}`}
    >
      <div
        style={{
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: color,
          transition: 'background 0.2s, box-shadow 0.2s',
          ...glowStyle,
        }}
        role="status"
        aria-label={`Sensor ${sensorNumber} ${isActive ? 'active' : 'inactive'}`}
      />
      <span style={{ fontSize: '0.55rem', color: '#64748b', lineHeight: 1 }}>S{sensorNumber}</span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Room1RackControl() {
  const { status } = usePLCStatus();
  const tags = usePLCTags();

  // Track the active routing destination rack (Req 8.5)
  const [activeRack, setActiveRack] = useState(null);

  const isConnected = status.connected === true;

  const handleRackSuccess = (rackNumber) => {
    setActiveRack(rackNumber);
  };

  // Helper: render a single RackButton with correct props
  const renderRack = (n) => (
    <RackButton
      key={n}
      rackNumber={n}
      isActive={activeRack === n}
      isConnected={isConnected}
      onSuccess={handleRackSuccess}
    />
  );

  return (
    <div className="plc-page" style={{ position: 'relative' }}>

      {/* ── Disconnected overlay (Req 6.9, 12.1) ─────────────────────────── */}
      {!isConnected && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            background: 'rgba(2,6,23,0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
          }}
        >
          <div style={{
            background: 'rgba(30,41,59,0.95)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '12px',
            padding: '2rem 3rem',
            textAlign: 'center',
            color: '#f87171',
            fontWeight: 600,
            fontSize: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span style={{ fontSize: '2rem' }}>🔌</span>
            <strong>PLC Disconnected — Controls disabled</strong>
          </div>
        </div>
      )}

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="plc-page-header">
        <div>
          <h2 className="plc-page-title">Room 1 — Rack Control</h2>
          <p className="plc-page-sub">
            Rack selection commands (momentary pulse) and live sensor indicators
          </p>
        </div>
        <div className="plc-status-badge">
          <span className={`plc-dot ${isConnected ? 'plc-dot-green' : 'plc-dot-red'}`}>
            <span className="plc-dot-pulse" />
          </span>
          <span className={isConnected ? 'plc-status-text-green' : 'plc-status-text-red'}>
            {isConnected
              ? `PLC Connected${status.mockMode ? ' (Mock)' : ''}`
              : 'PLC Offline'}
          </span>
        </div>
      </div>

      {/* ── Active destination info strip ─────────────────────────────────── */}
      {activeRack !== null && (
        <div className="plc-banner plc-banner-ok" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>🎯</span>
          <span>
            Last command sent to <strong>Rack {activeRack}</strong>
            {' '}— button highlighted in amber
          </span>
        </div>
      )}

      {/* ── Rack Layout Card ──────────────────────────────────────────────── */}
      <div className="plc-card">
        <div className="plc-section-title">Rack Layout — Room 1</div>

        {/*
         * Layout:
         *
         *   [R1][R2][R3][R4][R5][R6][R7][R8]   ← top row (Req 6.1)
         *
         *   [R9 ]   [R12][R13]  [R16][R17]
         *   [R10]   [R14][R15]  [R18][R19]
         *   [R11]
         *           ↑ Req 6.1: left col + two 2-col mid groups
         */}

        {/* Top row: Racks 1–8 */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1.25rem',
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(renderRack)}
        </div>

        {/* Lower area: left column + two mid groups */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Left column: Racks 9–11 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Left Wing
            </div>
            {[9, 10, 11].map(renderRack)}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', alignSelf: 'stretch', margin: '0 0.5rem' }} />

          {/* Mid group A: Racks 12–15 (2×2) */}
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Mid Zone A
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {[12, 13, 14, 15].map(renderRack)}
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', alignSelf: 'stretch', margin: '0 0.5rem' }} />

          {/* Mid group B: Racks 16–19 (2×2) */}
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Mid Zone B
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {[16, 17, 18, 19].map(renderRack)}
            </div>
          </div>

        </div>
      </div>

      {/* ── Sensor Indicator Grid ─────────────────────────────────────────── */}
      <div className="plc-card">
        <div className="plc-section-title">Sensor Indicators (Sensor 1–16)</div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            Active
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#475569', display: 'inline-block' }} />
            Inactive / Unknown
          </span>
        </div>

        {/* 4-column grid of 16 indicators (Req 6.7, 8.4) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem 1rem',
            maxWidth: '320px',
          }}
        >
          {Array.from({ length: 16 }, (_, i) => i + 1).map((k) => (
            <SensorIndicator
              key={k}
              sensorNumber={k}
              value={tags[`Sensor_${k}`]}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
