# Test Script Usage Guide - test-rack-sensor.js

## Overview

This script tests PLC communication exactly like your Modbus testing project:
1. Connects to PLC using **exact currentConfig** settings
2. **Writes** to Coil Address **19** (Turn ON)
3. **Reads** from Sensor Address **0**
4. Waits **3 seconds**
5. **Auto-OFF** - Writes to Coil Address **19** (Turn OFF)
6. Disconnects from PLC

---

## Configuration Location

**File:** `desktop/test-rack-sensor.js`

**Settings (Lines 15-32):**
```javascript
const currentConfig = {
    linkName: 'Delta_HMI_Link',
    manufacturer: 'Delta',
    seriesType: 'DOPSoft / Modbus RTU-TCP',
    password: '',
    hmiStationId: '1',
    plcStationId: '1',
    interfaceType: 'RS485',
    comPort: 'COM3',
    baudRate: '19200',
    dataBits: '8',
    stopBits: '1',
    parityBits: 'Even',
    communicationDelay: '100',
    connectionTimeout: '100',
    connectRetries: '3',
    connectionEnabled: false,
    simulationMode: false  // ⚠️ Set to true for testing without hardware
};
```

---

## Address Configuration

**Lines 34-36:**
```javascript
const WRITE_COIL_ADDRESS = 19;  // Coil address for WRITE operation
const READ_SENSOR_ADDRESS = 0;   // Sensor address for READ operation
const AUTO_OFF_DELAY = 3000;     // 3 seconds delay before auto-off
```

### Change Addresses Here:

**To test different coil:**
```javascript
const WRITE_COIL_ADDRESS = 20;  // Change to 20, 21, etc.
```

**To test different sensor:**
```javascript
const READ_SENSOR_ADDRESS = 1;  // Change to 1, 2, 3, etc.
```

**To change auto-off delay:**
```javascript
const AUTO_OFF_DELAY = 5000;  // Change to 5 seconds
```

---

## Running the Script

### Method 1: Without Hardware (Mock Mode)

**Step 1:** Enable simulation mode in script:
```javascript
simulationMode: true  // Line 30 in test-rack-sensor.js
```

**Step 2:** Run the script:
```bash
node desktop/test-rack-sensor.js
```

### Method 2: With Real PLC Hardware

**Step 1:** Ensure simulation mode is disabled:
```javascript
simulationMode: false  // Line 30 in test-rack-sensor.js
```

**Step 2:** Connect PLC to COM3

**Step 3:** Run the script:
```bash
node desktop/test-rack-sensor.js
```

---

## Expected Output

### Connection Phase:
```
════════════════════════════════════════════════════
  WAREHOUSE PLC TEST SCRIPT
  Coil Write: Address 19
  Sensor Read: Address 0
  Auto-OFF: 3 seconds
════════════════════════════════════════════════════

╔══════════════════════════════════════════════════╗
║    WAREHOUSE PLC TEST - RACK SENSOR SCRIPT       ║
║         (Modbus Testing Compatible)              ║
╚══════════════════════════════════════════════════╝

📋 CURRENT CONFIGURATION:
─────────────────────────────────────────────────
  Link Name:       Delta_HMI_Link
  Manufacturer:    Delta
  Series Type:     DOPSoft / Modbus RTU-TCP
  Interface Type:  RS485
  COM Port:        COM3
  Baud Rate:       19200 bps
  Data Bits:       8
  Stop Bits:       1
  Parity:          Even
  HMI Station ID:  1
  PLC Station ID:  1
  Comm Delay:      100ms
  Timeout:         100ms
  Retries:         3
  Simulation Mode: Yes

🔌 CONNECTING TO PLC...
─────────────────────────────────────────────────
✅ Connected successfully!
   Port: MOCK
   Mode: Simulation (Mock)

📊 PLC STATUS:
─────────────────────────────────────────────────
  Connected:    ✅ Yes
  Port:         MOCK
  Slave ID:     1
  Mock Mode:    Yes
  Polling:      N/A
```

### Write Phase:
```
📤 WRITING TO PLC (COIL ON)...
─────────────────────────────────────────────────
  Operation:    WRITE
  Type:         Coil (M-bit)
  Address:      19
  Value:        ON (True)

✅ Write successful!
   [WRITE REQUEST] Type: coil, Address: 19, Value: 1
   [WRITE SUCCESS] Coil Address 19 set to: true
```

### Read Phase:
```
📥 READING FROM PLC (SENSOR STATUS)...
─────────────────────────────────────────────────
  Operation:    READ
  Type:         Coil (Sensor)
  Address:      0

✅ Read successful!
   [READ REQUEST] Type: coil, Address: 0
   [READ SUCCESS] Sensor Address 0 value: OFF (0)
```

### Auto-OFF Phase:
```
⏱️  AUTO-OFF SCHEDULED...
─────────────────────────────────────────────────
  Delay:        3000ms (3 seconds)
  Address:      19
  Value:        OFF (False)

⏳ Waiting 3 seconds before turning OFF...

📤 AUTO-OFF TRIGGERED...
─────────────────────────────────────────────────
  [AUTO-OFF] Sending OFF command to Coil 19
   [WRITE REQUEST] Type: coil, Address: 19, Value: 0
   [WRITE SUCCESS] Coil Address 19 set to: false
✅ [AUTO-OFF] Coil 19 successfully turned OFF
```

### Summary:
```
🔌 DISCONNECTING FROM PLC...
─────────────────────────────────────────────────
✅ Disconnected successfully

╔══════════════════════════════════════════════════╗
║              ✅ TEST COMPLETED                    ║
╚══════════════════════════════════════════════════╝

📊 SUMMARY:
  ✅ Connected to PLC (COM3 @ 19200 bps)
  ✅ Written to Coil 19 (ON)
  ✅ Read from Sensor 0
  ✅ Auto-OFF after 3s
  ✅ Written to Coil 19 (OFF)
  ✅ Disconnected from PLC

════════════════════════════════════════════════════
  Script execution completed
════════════════════════════════════════════════════
```

---

## Testing Different Scenarios

### Test Coil 20 instead of 19:
```javascript
const WRITE_COIL_ADDRESS = 20;  // Change this line
```

### Test Sensor 1 instead of 0:
```javascript
const READ_SENSOR_ADDRESS = 1;  // Change this line
```

### Test with 5 second delay:
```javascript
const AUTO_OFF_DELAY = 5000;  // 5 seconds
```

### Test with Real PLC on COM5:
```javascript
const currentConfig = {
    // ... other settings
    comPort: 'COM5',           // Change from COM3 to COM5
    simulationMode: false      // Disable mock mode
};
```

---

## Flow Diagram

```
┌─────────────────────────────────────────────────┐
│  1. Display currentConfig Settings              │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  2. Connect to PLC (COM3 @ 19200)               │
│     - Use exact currentConfig settings          │
│     - simulationMode: true/false                │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  3. Verify Connection Status                    │
│     - Show PLC info                             │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  4. WRITE to Coil 19 (ON)                       │
│     - writeCoil('M', 19, true)                  │
│     - Log: [WRITE REQUEST/SUCCESS]              │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  5. READ from Sensor 0                          │
│     - readCoil('M', 0, 1)                       │
│     - Log: [READ REQUEST/SUCCESS]               │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  6. Wait 3 seconds                              │
│     - Show countdown message                    │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  7. WRITE to Coil 19 (OFF) - AUTO-OFF           │
│     - writeCoil('M', 19, false)                 │
│     - Log: [AUTO-OFF]                           │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  8. Disconnect from PLC                         │
│     - Show summary                              │
└─────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Error: Connection Failed

**Check:**
1. Is `simulationMode: true` for testing without hardware?
2. Is COM3 available? (Change to correct port)
3. Is PLC powered on and connected?

**Solution:**
```javascript
simulationMode: true  // Enable for testing
```

### Error: Write/Read Failed

**Check:**
1. Is PLC connected? (Check connection status)
2. Are addresses valid? (19, 0 should work)
3. Is timeout too short? (Increase to 500ms)

**Solution:**
```javascript
connectionTimeout: '500',  // Increase timeout
```

### No Output in Console

**Check:**
1. Did script run? (`node desktop/test-rack-sensor.js`)
2. Check for syntax errors
3. Check if plcService is available

---

## Quick Reference

| What | Where | Value |
|------|-------|-------|
| **Write Coil Address** | Line 34 | `19` |
| **Read Sensor Address** | Line 35 | `0` |
| **Auto-OFF Delay** | Line 36 | `3000` (3 seconds) |
| **COM Port** | Line 25 | `COM3` |
| **Baud Rate** | Line 26 | `19200` |
| **Simulation Mode** | Line 30 | `false` (set `true` for testing) |

---

## Summary

✅ **Exact currentConfig** - Uses all settings from Modbus testing  
✅ **Write to Coil 19** - Turns ON sensor/rack  
✅ **Read from Sensor 0** - Checks sensor status  
✅ **Auto-OFF after 3s** - Automatically turns OFF  
✅ **Detailed Logs** - Shows all operations like Modbus testing  
✅ **Easy to Modify** - Change addresses at top of script  

**Ready to test! Run:** `node desktop/test-rack-sensor.js` 🚀
