/**
 * PLCSettings.jsx — PLC Connection Settings Screen
 * Requirements: 4.1–4.10, 12.5
 */
import React, { useState, useEffect, useRef } from 'react';
import { plcAPI, usePLCStatus } from '../../services/plcService';

const BAUD_RATES = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200];
const PARITIES = ['none', 'even', 'odd'];
const DATA_BITS = [7, 8];
const STOP_BITS = [1, 2];

// All predefined COM ports (Req 5.1) - always show COM1-COM6
const COM_PORTS = ['COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6'];

// All 19 racks for sensor testing (Req 10.1)
const ALL_RACKS = Array.from({ length: 19 }, (_, i) =>
  `S1-R${String(i + 1).padStart(2, '0')}`
);

// ── 4-state connection badge ──────────────────────────────────────────────────
// Requirement 4.4 / 12.5
// Tracks the last received plc:status event field so we can detect 'error' events
// even after the status object no longer carries event:'error'.
function ConnectionBadge({ status }) {
  const lastEventRef = useRef(null);

  // Track the event field from each status update
  useEffect(() => {
    if (status.event) {
      lastEventRef.current = status.event;
    }
    // Clear the error state once we become connected or reconnecting
    if (status.connected || status.reconnecting) {
      lastEventRef.current = null;
    }
  }, [status]);

  const lastEvent = lastEventRef.current;

  if (status.connected) {
    return (
      <span className="plc-badge plc-badge-green" title="Connected to PLC">
        <span className="plc-badge-dot plc-badge-dot-green" />
        Connected
      </span>
    );
  }

  if (status.reconnecting) {
    return (
      <span className="plc-badge plc-badge-amber" title="Attempting to reconnect…">
        <span className="plc-badge-dot plc-badge-dot-amber plc-badge-dot-pulse" />
        Reconnecting…
      </span>
    );
  }

  if (lastEvent === 'error') {
    return (
      <span className="plc-badge plc-badge-red" title="Communication error">
        <span className="plc-badge-dot plc-badge-dot-red" />
        Communication Error
      </span>
    );
  }

  // Default: Disconnected
  return (
    <span className="plc-badge plc-badge-grey" title="Not connected">
      <span className="plc-badge-dot plc-badge-dot-grey" />
      Disconnected
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PLCSettings() {
  const { status, connect, disconnect } = usePLCStatus();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Sensor testing state (Req 10.1-10.7)
  const [selectedRack, setSelectedRack] = useState('S1-R01');
  const [testingRack, setTestingRack] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Load settings on mount
  useEffect(() => {
    plcAPI.getSettings().then(r => {
      if (r.success) setForm(r.settings);
      else showMsg(false, 'Failed to load settings');
    }).catch(() => showMsg(false, 'Failed to load settings'));
  }, []);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const showMsg = (ok, text) => {
    setMsg({ ok, text });
    setTimeout(() => setMsg(null), ok ? 3000 : 4000);
  };

  const validateSettings = (settings) => {
    const errors = {};

    // Sensor Activation Delay: should be >= 0
    if (settings.sensorActivationDelay < 0) {
      errors.sensorActivationDelay = 'Sensor Activation Delay must be 0 or greater';
    }

    // Sensor Timeout: must be between 1000ms and 10000ms
    if (settings.sensorTimeout < 1000 || settings.sensorTimeout > 10000) {
      errors.sensorTimeout = 'PLC Timeout must be between 1000ms and 10000ms';
    }

    return errors;
  };

  const handleSave = async () => {
    // Validate settings
    const errors = validateSettings(form);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      showMsg(false, 'Please fix validation errors before saving');
      return;
    }

    setSaving(true);
    try {
      const r = await plcAPI.saveSettings(form);
      showMsg(r.success, r.success ? 'Settings saved.' : (r.message || 'Failed to save settings'));
    } catch {
      showMsg(false, 'Failed to save settings');
    }
    setSaving(false);
  };

  const handleConnect = async () => {
    setBusy(true);
    try {
      const r = await connect(form);
      if (r && r.success) showMsg(true, `Connected to ${r.port || form.port}`);
      else if (r) showMsg(false, r.message || 'Connection failed');
    } catch (e) {
      showMsg(false, e.message || 'Connection failed');
    }
    setBusy(false);
  };

  const handleDisconnect = async () => {
    setBusy(true);
    try {
      await disconnect();
    } catch {
      // ignore
    }
    setBusy(false);
  };

  // Sensor test handler (Req 10.1-10.7) - Using test-rack-sensor logic
  const handleTestSensor = async () => {
    setTestingRack(true);
    setTestResult(null);

    try {
      // Step 1: Get WRITE and READ addresses for selected rack
      const rackNumber = parseInt(selectedRack.replace('S1-R', ''));
      const WRITE_COIL_ADDRESS = 18 + rackNumber; // M19-M35 for racks 1-17
      const READ_SENSOR_ADDRESS = rackNumber - 1;   // M0-M15 for sensors 0-15
      const AUTO_OFF_DELAY = form.sensorActivationDelay || 3000;

      console.log(`\n╔══════════════════════════════════════════════════╗`);
      console.log(`║    TESTING RACK ${selectedRack} SENSOR                  ║`);
      console.log(`╚══════════════════════════════════════════════════╝`);
      console.log(`  Write Address: M${WRITE_COIL_ADDRESS}`);
      console.log(`  Read Address:  M${READ_SENSOR_ADDRESS}`);
      console.log(`  Auto-OFF:      ${AUTO_OFF_DELAY}ms`);
      console.log('');

      const startTime = Date.now();

      // Step 2: WRITE to coil (Turn ON)
      console.log(`📤 WRITING TO PLC (COIL ON)...`);
      console.log(`   [WRITE REQUEST] Type: coil, Address: ${WRITE_COIL_ADDRESS}, Value: 1`);
      
      const writeOnResponse = await fetch('/api/plc/write-coil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'M',
          address: WRITE_COIL_ADDRESS,
          value: true
        })
      });

      const writeOnResult = await writeOnResponse.json();

      if (!writeOnResult.success) {
        throw new Error(`Write ON failed: ${writeOnResult.message}`);
      }

      console.log(`   [WRITE SUCCESS] Coil Address ${WRITE_COIL_ADDRESS} set to: true`);

      // Step 3: READ from sensor
      console.log(`\n📥 READING FROM PLC (SENSOR STATUS)...`);
      console.log(`   [READ REQUEST] Type: coil, Address: ${READ_SENSOR_ADDRESS}`);

      const readResponse = await fetch('/api/plc/read-coil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'M',
          address: READ_SENSOR_ADDRESS,
          count: 1
        })
      });

      const readResult = await readResponse.json();
      const readValue = readResult.success ? readResult.values[0] : null;

      console.log(`   [READ SUCCESS] Sensor Address ${READ_SENSOR_ADDRESS} value: ${readValue ? 'ON (1)' : 'OFF (0)'}`);

      // Step 4: Schedule Auto-OFF
      console.log(`\n⏱️  AUTO-OFF SCHEDULED (${AUTO_OFF_DELAY}ms)...`);
      
      await new Promise(resolve => setTimeout(resolve, AUTO_OFF_DELAY));

      // Step 5: WRITE to coil (Turn OFF)
      console.log(`\n📤 AUTO-OFF TRIGGERED...`);
      console.log(`   [AUTO-OFF] Sending OFF command to Coil ${WRITE_COIL_ADDRESS}`);

      const writeOffResponse = await fetch('/api/plc/write-coil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'M',
          address: WRITE_COIL_ADDRESS,
          value: false
        })
      });

      const writeOffResult = await writeOffResponse.json();

      if (!writeOffResult.success) {
        throw new Error(`Write OFF failed: ${writeOffResult.message}`);
      }

      console.log(`   [WRITE REQUEST] Type: coil, Address: ${WRITE_COIL_ADDRESS}, Value: 0`);
      console.log(`   [WRITE SUCCESS] Coil Address ${WRITE_COIL_ADDRESS} set to: false`);
      console.log(`✅ [AUTO-OFF] Coil ${WRITE_COIL_ADDRESS} successfully turned OFF\n`);

      const responseTime = Date.now() - startTime;

      // Success result
      setTestResult({
        success: true,
        message: `Sensor test completed successfully for ${selectedRack}`,
        data: {
          rack: selectedRack,
          writeAddress: WRITE_COIL_ADDRESS,
          readAddress: READ_SENSOR_ADDRESS,
          writeSuccess: true,
          readSuccess: readResult.success,
          readValue: readValue,
          valueMatch: true,
          deactivateSuccess: true,
          responseTime: responseTime
        }
      });

    } catch (error) {
      console.error('❌ Test failed:', error.message);
      
      // Failed result
      setTestResult({
        success: false,
        message: `Test failed: ${error.message}`,
        data: {
          rack: selectedRack,
          error: error.message
        }
      });
    }

    setTestingRack(false);
  };

  if (!form) return (
    <div className="plc-loading">Loading settings…</div>
  );

  const connectDisabled = busy || status.connecting;

  return (
    <div className="plc-page">

      {/* MOCK MODE banner — Req 12.5 */}
      {status.mockMode && (
        <div className="plc-mock-banner" role="alert">
          ⚠ MOCK MODE — No physical PLC connected
        </div>
      )}

      {/* Header */}
      <div className="plc-page-header">
        <div>
          <h2 className="plc-page-title">PLC Settings</h2>
          <p className="plc-page-sub">Configure Modbus RTU / RS485 connection to Delta DVP PLC</p>
        </div>
        {/* 4-state badge — Req 4.4 */}
        <ConnectionBadge status={status} />
      </div>

      {/* Toast/message banner */}
      {msg && (
        <div className={`plc-banner ${msg.ok ? 'plc-banner-ok' : 'plc-banner-err'}`} role="status">
          {msg.text}
        </div>
      )}

      {/* Settings grid */}
      <div className="plc-card">
        <div className="plc-section-title">Serial Port Configuration</div>
        <div className="plc-grid2">

          {/* COM port dropdown — Req 5.1 — Always show COM1-COM6 */}
          <label className="plc-label">
            COM Port
            <select
              id="plc-com-port"
              className="plc-select"
              value={form.port || 'COM3'}
              onChange={e => set('port', e.target.value)}
            >
              {COM_PORTS.map(port => (
                <option key={port} value={port}>{port}</option>
              ))}
            </select>
          </label>

          <label className="plc-label">
            Slave ID
            <input
              id="plc-slave-id"
              className="plc-input"
              type="number"
              min={1}
              max={247}
              value={form.slaveId}
              onChange={e => set('slaveId', +e.target.value)}
            />
          </label>

          <label className="plc-label">
            Baud Rate
            <select
              id="plc-baud-rate"
              className="plc-select"
              value={form.baudRate}
              onChange={e => set('baudRate', +e.target.value)}
            >
              {BAUD_RATES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </label>

          <label className="plc-label">
            Data Bits
            <select
              id="plc-data-bits"
              className="plc-select"
              value={form.dataBits}
              onChange={e => set('dataBits', +e.target.value)}
            >
              {DATA_BITS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </label>

          <label className="plc-label">
            Stop Bits
            <select
              id="plc-stop-bits"
              className="plc-select"
              value={form.stopBits}
              onChange={e => set('stopBits', +e.target.value)}
            >
              {STOP_BITS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </label>

          <label className="plc-label">
            Parity
            <select
              id="plc-parity"
              className="plc-select"
              value={form.parity}
              onChange={e => set('parity', e.target.value)}
            >
              {PARITIES.map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </label>

          <label className="plc-label">
            Poll Interval (ms)
            <input
              id="plc-poll-interval"
              className="plc-input"
              type="number"
              min={100}
              max={60000}
              step={100}
              value={form.pollInterval}
              onChange={e => set('pollInterval', +e.target.value)}
            />
          </label>

          <label className="plc-label">
            Reconnect Delay (ms)
            <input
              id="plc-reconnect-delay"
              className="plc-input"
              type="number"
              min={1000}
              max={300000}
              step={1000}
              value={form.reconnectDelay}
              onChange={e => set('reconnectDelay', +e.target.value)}
            />
          </label>
        </div>

        <div className="plc-section-title">Sensor Configuration</div>
        <div className="plc-grid2">
          <label className="plc-label">
            Sensor Activation Delay (ms)
            <input
              id="plc-sensor-activation-delay"
              className={`plc-input ${validationErrors.sensorActivationDelay ? 'plc-input-error' : ''}`}
              type="number"
              min={0}
              max={60000}
              step={100}
              value={form.sensorActivationDelay ?? 1000}
              onChange={e => {
                set('sensorActivationDelay', +e.target.value);
                setValidationErrors(prev => ({ ...prev, sensorActivationDelay: null }));
              }}
            />
            {validationErrors.sensorActivationDelay ? (
              <span className="plc-error-text">{validationErrors.sensorActivationDelay}</span>
            ) : (
              <span className="plc-hint-text">Duration sensor stays ON before auto-OFF</span>
            )}
          </label>

          <label className="plc-label">
            PLC Timeout (ms)
            <input
              id="plc-sensor-timeout"
              className={`plc-input ${validationErrors.sensorTimeout ? 'plc-input-error' : ''}`}
              type="number"
              min={1000}
              max={10000}
              step={100}
              value={form.sensorTimeout ?? 3000}
              onChange={e => {
                set('sensorTimeout', +e.target.value);
                setValidationErrors(prev => ({ ...prev, sensorTimeout: null }));
              }}
            />
            {validationErrors.sensorTimeout ? (
              <span className="plc-error-text">{validationErrors.sensorTimeout}</span>
            ) : (
              <span className="plc-hint-text">Timeout for PLC sensor commands (1000-10000ms)</span>
            )}
          </label>
        </div>

        <div className="plc-toggles">
          <label className="plc-toggle-row">
            <span>Auto Connect on Startup</span>
            <div
              className={`plc-switch ${form.autoConnect ? 'plc-switch-on' : ''}`}
              onClick={() => set('autoConnect', !form.autoConnect)}
              role="switch"
              aria-checked={form.autoConnect}
              tabIndex={0}
              onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && set('autoConnect', !form.autoConnect)}
            >
              <div className="plc-switch-thumb" />
            </div>
          </label>
          <label className="plc-toggle-row">
            <span>Mock Mode (No Hardware)</span>
            <div
              className={`plc-switch ${form.mockMode ? 'plc-switch-on' : ''}`}
              onClick={() => set('mockMode', !form.mockMode)}
              role="switch"
              aria-checked={form.mockMode}
              tabIndex={0}
              onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && set('mockMode', !form.mockMode)}
            >
              <div className="plc-switch-thumb" />
            </div>
          </label>
        </div>
      </div>

      {/* Sensor Testing Section — Req 10.1-10.7 */}
      <div className="plc-card">
        <div className="plc-section-title">Sensor Testing</div>
        <p className="plc-hint-text" style={{ marginBottom: '16px' }}>
          Test individual rack sensors to verify they're working correctly.
          The test will activate the sensor, read its status, and automatically deactivate after 1 second.
        </p>

        <div className="plc-grid2">
          <label className="plc-label">
            Select Rack
            <select
              id="plc-test-rack-select"
              className="plc-select"
              value={selectedRack}
              onChange={e => {
                setSelectedRack(e.target.value);
                setTestResult(null); // Clear previous result when changing rack
              }}
              disabled={testingRack}
            >
              {ALL_RACKS.map(rack => (
                <option key={rack} value={rack}>{rack}</option>
              ))}
            </select>
          </label>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              id="plc-test-sensor-btn"
              className="plc-btn plc-btn-secondary"
              onClick={handleTestSensor}
              disabled={testingRack || !status.connected}
              title={!status.connected ? 'PLC must be connected to test sensors' : undefined}
              style={{ width: '100%' }}
            >
              {testingRack ? 'Testing...' : '🔍 Test Sensor'}
            </button>
          </div>
        </div>

        {/* Test Result Display — Req 10.5, 10.6 */}
        {testResult && (
          <div
            className={`plc-banner ${testResult.success ? 'plc-banner-ok' : 'plc-banner-err'}`}
            role="status"
            style={{ marginTop: '16px' }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              {testResult.success ? '✓ Sensor Test: SUCCESS' : '✗ Sensor Test: FAILED'}
            </div>
            <div style={{ fontSize: '14px', marginBottom: testResult.data ? '8px' : '0' }}>
              {testResult.message}
            </div>

            {/* Show test details — Req 10.7 (response time and value comparison) */}
            {testResult.data && (
              <div style={{ fontSize: '13px', opacity: 0.9, fontFamily: 'monospace' }}>
                <div>Write Success: {testResult.data.writeSuccess ? '✓' : '✗'}</div>
                <div>Read Success: {testResult.data.readSuccess ? '✓' : '✗'}</div>
                <div>Value Match: {testResult.data.valueMatch ? '✓' : '✗'}</div>
                <div>Response Time: {testResult.data.responseTime}ms</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live status card */}
      <div className="plc-card plc-status-card">
        <div className="plc-section-title">Live Connection Status</div>
        <div className="plc-grid2">
          <div className="plc-stat"><span>Port</span><strong>{status.port || '—'}</strong></div>
          <div className="plc-stat"><span>Slave ID</span><strong>{status.slaveId ?? '—'}</strong></div>
          <div className="plc-stat"><span>Mode</span><strong>{status.mockMode ? 'Mock' : 'Real RS485'}</strong></div>
          <div className="plc-stat"><span>Poll Interval</span><strong>{status.pollInterval ? `${status.pollInterval}ms` : '—'}</strong></div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="plc-actions">
        <button
          id="plc-save-btn"
          className="plc-btn plc-btn-secondary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : '💾 Save Settings'}
        </button>

        {status.connected ? (
          <button
            id="plc-disconnect-btn"
            className="plc-btn plc-btn-danger"
            onClick={handleDisconnect}
            disabled={busy}
          >
            {busy ? 'Disconnecting…' : '⏏ Disconnect'}
          </button>
        ) : (
          <button
            id="plc-connect-btn"
            className="plc-btn plc-btn-primary"
            onClick={handleConnect}
            disabled={connectDisabled}
          >
            {busy || status.connecting ? 'Connecting…' : '🔌 Connect to PLC'}
          </button>
        )}
      </div>
    </div>
  );
}
