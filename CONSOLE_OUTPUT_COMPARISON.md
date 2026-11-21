# Console Output Comparison - Modbus Testing vs Warehouse Project

## Your Modbus Testing Project Output (Working ✅)

### Connection Status
```
STATUS: 🟢 Connected
```

### When Writing Coil 19 with Value ON
```
=================== POST /write ===================
Received Write Form Data:
{
  "writeType": "coil",
  "address": "19",
  "value": "true"
}
=====================================================

[2:54:01 PM] INFO  Sending single write request for coil address 19...
[2:54:01 PM] TX    Write Request -> Type: coil, Address: 19, Value: 1
[2:54:04 PM] RX    Write Success -> Coil Address 19 set to: true
[AUTO-OFF] Coil 19 will be turned OFF after 1 second...

... wait 3 seconds ...

[AUTO-OFF] Sending OFF command to Coil 19
[2:54:07 PM] TX    Write Request -> Type: coil, Address: 19, Value: false
[AUTO-OFF] Coil 19 successfully turned OFF
```

---

## Warehouse Project Output (Now Similar ✅)

### Connection Status Check
```
PLC Connection Status: {
  connected: true,
  connecting: false,
  reconnecting: false,
  port: "MOCK",
  slaveId: 1,
  mockMode: true,
  pollInterval: 500
}
✅ PLC Status: Mock Mode
```

### When Rack S1-R01 is Allocated (Address M19)
```
[Allocation] Triggering sensor activation for rack: S1-R01

========== RACK SENSOR ACTIVATION START ==========
Rack: S1-R01, SKU: TEST-SKU-001, Quantity: 10
PLC Connection Status: { connected: true, mockMode: true, port: "MOCK", ... }
✅ PLC Status: Mock Mode
Rack mapping found: { writeAddress: 19, readAddress: 0, sensor: 1 }
========== RACK SENSOR ACTIVATION QUEUED ==========

[RACK-SENSOR] Rack S1-R01 selected and confirmed - Sending WRITE(19, TRUE)

[WRITE REQUEST] Type: coil, Address: 19, Value: 1
[WRITE SUCCESS] Coil Address 19 set to: true

[RACK-SENSOR] Sensor 19 ON for S1-R01
[RACK-SENSOR] Will turn OFF after 15000ms (15 seconds)
[RACK-SENSOR] Background auto-off scheduled for S1-R01

... wait 15 seconds ...

[AUTO-OFF] Sending OFF command to S1-R01 address 19

[WRITE REQUEST] Type: coil, Address: 19, Value: 0
[WRITE SUCCESS] Coil Address 19 set to: false

[AUTO-OFF] S1-R01 successfully turned OFF
```

---

## Side-by-Side Comparison

| Stage | Modbus Testing | Warehouse Project |
|-------|----------------|-------------------|
| **Connection Check** | `STATUS: Connected` | `✅ PLC Status: Mock Mode` |
| **Write Request** | `TX Write Request -> Type: coil, Address: 19, Value: 1` | `[WRITE REQUEST] Type: coil, Address: 19, Value: 1` |
| **Write Success** | `RX Write Success -> Coil Address 19 set to: true` | `[WRITE SUCCESS] Coil Address 19 set to: true` |
| **Auto-off Notice** | `[AUTO-OFF] Coil 19 will be turned OFF after 1 second...` | `[RACK-SENSOR] Will turn OFF after 15000ms (15 seconds)` |
| **Auto-off Trigger** | `[AUTO-OFF] Sending OFF command to Coil 19` | `[AUTO-OFF] Sending OFF command to S1-R01 address 19` |
| **OFF Request** | `TX Write Request -> Type: coil, Address: 19, Value: false` | `[WRITE REQUEST] Type: coil, Address: 19, Value: 0` |
| **OFF Success** | `[AUTO-OFF] Coil 19 successfully turned OFF` | `[AUTO-OFF] S1-R01 successfully turned OFF` |

---

## Test Script Output (node desktop/test-rack-sensor.js)

```
========================================
RACK SENSOR TEST - Manual Execution
Similar to Modbus Testing Project
========================================

Step 1: Checking PLC connection status...
Current PLC Status: {
  "connected": false,
  "connecting": false,
  "reconnecting": false,
  "port": "COM3",
  "slaveId": 1,
  "mockMode": false,
  "pollInterval": 500
}

Step 2: PLC not connected. Connecting in mock mode...
Connection result: { success: true, port: 'MOCK', mock: true }

✅ PLC Connected!
Updated Status: {
  "connected": true,
  "connecting": false,
  "reconnecting": false,
  "port": "MOCK",
  "slaveId": 1,
  "mockMode": true,
  "pollInterval": 500
}

╔══════════════════════════════════════════════════╗
║         PLC CONNECTION INFORMATION               ║
╚══════════════════════════════════════════════════╝
  Status:      🟢 Connected
  Port:        MOCK
  Slave ID:    1
  Mock Mode:   Yes
  Polling:     500ms (Disabled)

╔══════════════════════════════════════════════════╗
║         TESTING RACK SENSOR ACTIVATION           ║
╚══════════════════════════════════════════════════╝
  Rack:        S1-R01
  Address:     M19 (Coil 19)
  SKU:         TEST-SKU-001
  Quantity:    10

▶ Triggering activation...

========== RACK SENSOR ACTIVATION START ==========
Rack: S1-R01, SKU: TEST-SKU-001, Quantity: 10
PLC Connection Status: { connected: true, mockMode: true, ... }
✅ PLC Status: Mock Mode
Rack mapping found: { writeAddress: 19, readAddress: 0, sensor: 1 }
========== RACK SENSOR ACTIVATION QUEUED ==========

[RACK-SENSOR] Rack S1-R01 selected and confirmed - Sending WRITE(19, TRUE)

[WRITE REQUEST] Type: coil, Address: 19, Value: 1
[WRITE SUCCESS] Coil Address 19 set to: true

[RACK-SENSOR] Sensor 19 ON for S1-R01
[RACK-SENSOR] Will turn OFF after 15000ms (15 seconds)
[RACK-SENSOR] Background auto-off scheduled for S1-R01

Activation API result: { success: true }

╔══════════════════════════════════════════════════╗
║         WAITING FOR AUTO-OFF SEQUENCE            ║
╚══════════════════════════════════════════════════╝
⏳ Auto-off will occur in 15000ms (15 seconds)
   Watch console for [AUTO-OFF] messages...

[AUTO-OFF] Sending OFF command to S1-R01 address 19

[WRITE REQUEST] Type: coil, Address: 19, Value: 0
[WRITE SUCCESS] Coil Address 19 set to: false

[AUTO-OFF] S1-R01 successfully turned OFF

╔══════════════════════════════════════════════════╗
║              TEST COMPLETED                      ║
╚══════════════════════════════════════════════════╝
✅ Test complete! Check logs above for:
   - [RACK-SENSOR] messages (activation)
   - [AUTO-OFF] messages (deactivation)

Disconnecting from PLC...
✅ Disconnected

════════════════════════════════════════════════════
Test script finished successfully
════════════════════════════════════════════════════
```

---

## Key Similarities ✅

1. **Connection Status Check** - Both verify PLC is connected before writing
2. **Detailed Write Logs** - Both show TX (write request) and RX/success messages
3. **Auto-off Pattern** - Both use `setTimeout` for background auto-off
4. **Error Handling** - Both gracefully handle errors without breaking flow
5. **Console Formatting** - Similar log message structure and formatting

---

## Testing Checklist

### ✅ Run Test Script
```bash
node desktop/test-rack-sensor.js
```

**Expected Result:**
- Should see connection status check
- Should see connection info box
- Should see [WRITE REQUEST] and [WRITE SUCCESS] messages
- Should wait 15 seconds
- Should see [AUTO-OFF] messages

### ✅ Test in Application
1. Start warehouse application
2. Go to PLC Settings → Connect (or enable Mock Mode)
3. Allocate a product to Rack S1-R01
4. Check console logs

**Expected Result:**
- `[Allocation] Triggering sensor activation for rack: S1-R01`
- `✅ PLC Status: Connected` or `✅ PLC Status: Mock Mode`
- `[WRITE REQUEST] Type: coil, Address: 19, Value: 1`
- `[WRITE SUCCESS] Coil Address 19 set to: true`
- Wait 15 seconds...
- `[AUTO-OFF] Sending OFF command to S1-R01 address 19`
- `[WRITE SUCCESS] Coil Address 19 set to: false`

---

## If PLC Not Connected Error

### Expected Message:
```
[RackSensor ERROR] PLC is not connected!
Please connect PLC first before rack allocation.
```

### Solution:
1. Go to PLC Settings in UI
2. Click "Connect" button
3. Or enable "Mock Mode" for testing
4. Try rack allocation again

---

## Configuration for Quick Testing

To match Modbus testing project delay (3 seconds instead of 15):

```javascript
// In desktop/plc/plcConfig.js
const DEFAULT_SETTINGS = {
    // ... other settings
    sensorActivationDelay: 3000,  // 3 seconds like Modbus testing
};
```

Then restart application or run:
```bash
node desktop/test-rack-sensor.js
```

---

## Summary

✅ **Connection Check** - Now checks PLC status before write (like Modbus testing)

✅ **Detailed Logging** - Shows [WRITE REQUEST] and [WRITE SUCCESS] messages

✅ **Auto-off Pattern** - Uses setTimeout for background auto-off

✅ **Test Script** - Properly checks connection and displays status

✅ **Same Behavior** - Warehouse project now works like Modbus testing project
