# PLC Panel Implementation - test-rack-sensor Logic

## Overview

PLC Settings panel now implements the exact same logic as `test-rack-sensor.js` script:
1. Connects using currentConfig settings
2. Writes to Coil Address (M19-M35) based on selected rack
3. Reads from Sensor Address (M0-M15)
4. Auto-OFF after configured delay
5. Detailed console logging like Modbus testing project

---

## Implementation Details

### File: `src/components/plc/PLCSettings.jsx`

#### Test Sensor Function (Lines 114-253)

```javascript
const handleTestSensor = async () => {
  // Step 1: Calculate addresses based on selected rack
  const rackNumber = parseInt(selectedRack.replace('S1-R', ''));
  const WRITE_COIL_ADDRESS = 18 + rackNumber; // M19-M35
  const READ_SENSOR_ADDRESS = rackNumber - 1;   // M0-M15
  const AUTO_OFF_DELAY = form.sensorActivationDelay || 3000;

  // Step 2: WRITE to coil (Turn ON)
  await fetch('/api/plc/write-coil', {
    method: 'POST',
    body: JSON.stringify({
      type: 'M',
      address: WRITE_COIL_ADDRESS,
      value: true
    })
  });

  // Step 3: READ from sensor
  await fetch('/api/plc/read-coil', {
    method: 'POST',
    body: JSON.stringify({
      type: 'M',
      address: READ_SENSOR_ADDRESS,
      count: 1
    })
  });

  // Step 4: Wait for Auto-OFF delay
  await new Promise(resolve => setTimeout(resolve, AUTO_OFF_DELAY));

  // Step 5: WRITE to coil (Turn OFF)
  await fetch('/api/plc/write-coil', {
    method: 'POST',
    body: JSON.stringify({
      type: 'M',
      address: WRITE_COIL_ADDRESS,
      value: false
    })
  });
};
```

---

## Address Mapping

### Rack to Address Mapping

| Rack | Write Address | Read Address | Calculation |
|------|---------------|--------------|-------------|
| S1-R01 | M19 | M0 | 18 + 1 = 19, 1 - 1 = 0 |
| S1-R02 | M20 | M1 | 18 + 2 = 20, 2 - 1 = 1 |
| S1-R03 | M21 | M2 | 18 + 3 = 21, 3 - 1 = 2 |
| ... | ... | ... | ... |
| S1-R17 | M35 | M16 | 18 + 17 = 35, 17 - 1 = 16 |

### Formula:
```javascript
WRITE_ADDRESS = 18 + rackNumber  // M19-M35
READ_ADDRESS = rackNumber - 1     // M0-M15 (for 16 sensors)
```

---

## API Endpoints

### File: `desktop/expressServer.js`

#### Added Endpoints:

**1. POST /api/plc/read-coil**
```javascript
POST /api/plc/read-coil
Body: { type: 'M', address: 0, count: 1 }
Response: { success: true, values: [true/false], address: 0 }
```

**2. POST /api/plc/write-coil**
```javascript
POST /api/plc/write-coil
Body: { type: 'M', address: 19, value: true }
Response: { success: true, address: 19, value: true }
```

---

## Console Output (Browser Console)

When testing Rack S1-R01:

```
╔══════════════════════════════════════════════════╗
║    TESTING RACK S1-R01 SENSOR                  ║
╚══════════════════════════════════════════════════╝
  Write Address: M19
  Read Address:  M0
  Auto-OFF:      3000ms

📤 WRITING TO PLC (COIL ON)...
   [WRITE REQUEST] Type: coil, Address: 19, Value: 1
   [WRITE SUCCESS] Coil Address 19 set to: true

📥 READING FROM PLC (SENSOR STATUS)...
   [READ REQUEST] Type: coil, Address: 0
   [READ SUCCESS] Sensor Address 0 value: OFF (0)

⏱️  AUTO-OFF SCHEDULED (3000ms)...

📤 AUTO-OFF TRIGGERED...
   [AUTO-OFF] Sending OFF command to Coil 19
   [WRITE REQUEST] Type: coil, Address: 19, Value: 0
   [WRITE SUCCESS] Coil Address 19 set to: false
✅ [AUTO-OFF] Coil 19 successfully turned OFF
```

---

## UI Flow

### Step 1: Open PLC Settings Panel

Navigate to: `Settings → PLC Settings` or sidebar "PLC Settings"

### Step 2: Configure Connection

1. Set COM Port (default: COM3)
2. Set Baud Rate (default: 19200)
3. Set Data/Stop/Parity (default: 8-1-Even)
4. Enable "Mock Mode" for testing without hardware
5. Click "Save Settings"

### Step 3: Connect to PLC

Click "🔌 Connect to PLC" button

**Expected Result:**
- Badge shows "🟢 Connected"
- Port displays: COM3 or MOCK
- Status card updated

### Step 4: Test Sensor

1. Scroll to "Sensor Testing" section
2. Select Rack (default: S1-R01)
3. Click "🔍 Test Sensor"

**Expected Result:**
- Button shows "Testing..."
- Console logs appear (see above)
- After 3 seconds, result banner shows:
  - ✓ SUCCESS: Green banner with test details
  - ✗ FAILED: Red banner with error message

### Step 5: View Results

Result banner shows:
- Write Success: ✓ or ✗
- Read Success: ✓ or ✗
- Value Match: ✓ or ✗
- Response Time: XXXms

---

## Configuration

### PLC Settings (DEFAULT_SETTINGS)

**File:** `desktop/plc/plcConfig.js`

```javascript
const DEFAULT_SETTINGS = {
    // Connection - matching currentConfig
    port: 'COM3',
    baudRate: 19200,
    dataBits: 8,
    stopBits: 1,
    parity: 'even',
    slaveId: 1,
    
    // Interface
    interfaceType: 'RS485',
    manufacturer: 'Delta',
    seriesType: 'DOPSoft / Modbus RTU-TCP',
    
    // Timing
    communicationDelay: 100,
    connectionTimeout: 100,
    connectRetries: 3,
    
    // Sensor activation (changed from 15s to 3s)
    sensorActivationDelay: 3000,  // 3 seconds
    sensorTimeout: 5000,
    
    // Connection control
    autoConnect: false,
    mockMode: false,
    enablePolling: false
};
```

### Tag Configuration (DEFAULT_TAGS)

**Only rack placement tags retained:**

```javascript
const DEFAULT_TAGS = [
    // ── Sensor Tags (Read) — M0-M15 ──
    { id: 1, name: 'Sensor_1', address: 0, type: 'M', direction: 'Read', ... },
    { id: 2, name: 'Sensor_2', address: 1, type: 'M', direction: 'Read', ... },
    // ... up to Sensor_16 (M15)
    
    // ── Rack Command Tags (Write) — M19-M35 ──
    { id: 17, name: 'Rack_1', address: 19, type: 'M', direction: 'Write', ... },
    { id: 18, name: 'Rack_2', address: 20, type: 'M', direction: 'Write', ... },
    // ... up to Rack_17 (M35)
];
```

---

## Testing Checklist

### ✅ Step 1: Connect to PLC
- [ ] Open PLC Settings panel
- [ ] Enable "Mock Mode" (for testing without hardware)
- [ ] Click "Connect to PLC"
- [ ] Verify badge shows "🟢 Connected"

### ✅ Step 2: Test Rack S1-R01
- [ ] Select "S1-R01" from dropdown
- [ ] Click "🔍 Test Sensor"
- [ ] Check browser console for logs
- [ ] Wait 3 seconds for auto-off
- [ ] Verify green success banner appears

### ✅ Step 3: Test Different Rack
- [ ] Select "S1-R05" from dropdown
- [ ] Click "🔍 Test Sensor"
- [ ] Verify console shows Address M23 (write) and M4 (read)
- [ ] Verify success banner after 3 seconds

### ✅ Step 4: Test with Real PLC
- [ ] Disable "Mock Mode"
- [ ] Connect real PLC to COM3
- [ ] Click "Connect to PLC"
- [ ] Test rack S1-R01
- [ ] Verify physical sensor responds

---

## Comparison: test-rack-sensor.js vs PLC Panel

| Feature | test-rack-sensor.js | PLC Panel |
|---------|-------------------|-----------|
| **Connection** | Manual script | UI button click |
| **Settings** | Hardcoded in script | Form in UI |
| **Rack Selection** | Fixed S1-R01 | Dropdown (S1-R01 to S1-R17) |
| **Console Logs** | Node.js console | Browser console |
| **Address Calc** | Fixed (19, 0) | Dynamic based on rack |
| **Auto-OFF** | 3 seconds | Configurable in settings |
| **Result Display** | Console only | UI banner + console |
| **Error Handling** | Try-catch | Try-catch + UI feedback |

---

## Key Differences from Original Implementation

### Before (Old PLC Panel):
```javascript
// Called API endpoint /api/racks/test-sensor
// Backend handled everything
// Limited visibility into process
```

### After (New PLC Panel - test-rack-sensor logic):
```javascript
// Direct PLC API calls from frontend
// Step-by-step process visible
// Detailed console logging
// Matches test-rack-sensor.js behavior
```

---

## Troubleshooting

### Issue: "PLC must be connected to test sensors"

**Solution:**
1. Click "🔌 Connect to PLC" button
2. Wait for "🟢 Connected" badge
3. Try test again

### Issue: Test hangs or no response

**Check:**
1. Is Mock Mode enabled? (For testing without hardware)
2. Is COM port available?
3. Check browser console for errors
4. Check backend logs for PLC errors

### Issue: Write/Read failed

**Check:**
1. PLC connection stable?
2. Addresses valid for selected rack?
3. Timeout settings adequate?

**Solution:**
- Increase `connectionTimeout` in settings
- Increase `sensorTimeout` in settings
- Enable Mock Mode for testing

---

## Files Modified

1. ✅ `src/components/plc/PLCSettings.jsx` - Test sensor function updated
2. ✅ `desktop/expressServer.js` - Added POST endpoints for read/write-coil
3. ✅ `desktop/plc/plcConfig.js` - Updated DEFAULT_SETTINGS and DEFAULT_TAGS
4. ✅ `desktop/services/rackSensor.service.js` - Connection check and logging

---

## Summary

✅ **PLC Panel now matches test-rack-sensor.js**

✅ **Uses exact currentConfig settings**

✅ **Dynamic address calculation based on selected rack**

✅ **Detailed console logging like Modbus testing**

✅ **Auto-OFF after configurable delay**

✅ **UI feedback with success/fail banners**

✅ **Only rack placement tags in DEFAULT_TAGS**

**Ready to test in PLC Settings panel!** 🎯
