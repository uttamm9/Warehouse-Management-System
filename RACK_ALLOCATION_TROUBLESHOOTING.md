# Rack Allocation PLC Command Troubleshooting Guide

## Problem: Rack Assigns But No PLC Commands Sent

When you click "Assign Rack" in Inbound Inventory:
- ✅ Rack allocation completes successfully
- ✅ Data saved to database
- ❌ **NO PLC commands sent**
- ❌ **NO sensor activation**

---

## New Detailed Logging

After implementing enhanced logging, you will now see step-by-step what's happening:

### Expected Console Output (Success Case)

```
╔════════════════════════════════════════════════════════════╗
║     ALLOCATION COMPLETE - TRIGGERING SENSOR                ║
╚════════════════════════════════════════════════════════════╝
📦 SKU: SKU-1001
📊 Quantity: 10
🎯 Allocated Rack: S1-R02
📍 Shelf Level: 2

➡️  Calling rackSensorService.activateRackSensor()...
    This will send PLC commands to activate rack sensor.

╔════════════════════════════════════════════════════════════╗
║     RACK SENSOR ACTIVATION START - S1-R02              ║
╚════════════════════════════════════════════════════════════╝
📦 SKU: SKU-1001
📊 Quantity: 10
🎯 Rack: S1-R02

🔍 STEP 1: Checking PLC Connection Status...
─────────────────────────────────────────────────
PLC Status: {
  "connected": true,
  "port": "MOCK",
  "mockMode": true,
  "slaveId": 1
}
✅ PLC Connection OK: Mock Mode

🔍 STEP 2: Validating Rack Name & Getting Address Mapping...
─────────────────────────────────────────────────
✅ Rack mapping found:
   - Write Address: M20
   - Read Address: M1
   - Sensor Number: 2

🚀 STEP 3: Triggering Background Activation Sequence...
─────────────────────────────────────────────────
   This will:
   1. WRITE M20 = TRUE
   2. Wait for configured delay
   3. WRITE M20 = FALSE

✅ Activation sequence queued successfully!
   Watch console for [RACK-SENSOR] and [AUTO-OFF] messages...
╚════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════╗
║     EXECUTING ACTIVATION SEQUENCE - S1-R02            ║
╚════════════════════════════════════════════════════════════╝

📤 STEP 1: Writing to PLC (Turn Sensor ON)...
─────────────────────────────────────────────────
[RACK-SENSOR] Rack S1-R02 selected and confirmed - Sending WRITE(M20, TRUE)
   Operation: WRITE
   Type: Coil (M-bit)
   Address: M20
   Value: TRUE (1)
   Context: Rack=S1-R02, SKU=SKU-1001, Qty=10

[WRITE REQUEST] Type: coil, Address: 20, Value: 1
[WRITE SUCCESS] Coil Address 20 set to: true

✅ STEP 1 SUCCESS: Sensor activated
[RACK-SENSOR] Sensor M20 is now ON for S1-R02

⏱️  STEP 2: Scheduling Auto-OFF...
─────────────────────────────────────────────────
[RACK-SENSOR] Will turn OFF after 3000ms (3 seconds)
   Auto-OFF will execute in background
   Watch for [AUTO-OFF] message in 3 seconds...

✅ Background auto-off scheduled for S1-R02
╚════════════════════════════════════════════════════════════╝

... wait 3 seconds ...

╔════════════════════════════════════════════════════════════╗
║     AUTO-OFF TRIGGERED - S1-R02                       ║
╚════════════════════════════════════════════════════════════╝

📤 STEP 3: Writing to PLC (Turn Sensor OFF)...
─────────────────────────────────────────────────
[AUTO-OFF] Sending OFF command to S1-R02 address M20
   Operation: WRITE
   Type: Coil (M-bit)
   Address: M20
   Value: FALSE (0)

[WRITE REQUEST] Type: coil, Address: 20, Value: 0
[WRITE SUCCESS] Coil Address 20 set to: false

✅ STEP 3 SUCCESS: Sensor deactivated
[AUTO-OFF] S1-R02 successfully turned OFF
╚════════════════════════════════════════════════════════════╝
```

---

## Diagnostic Scenarios

### Scenario 1: PLC Not Connected

**Console Output:**
```
╔════════════════════════════════════════════════════════════╗
║     RACK SENSOR ACTIVATION START - S1-R02              ║
╚════════════════════════════════════════════════════════════╝

🔍 STEP 1: Checking PLC Connection Status...
─────────────────────────────────────────────────
PLC Status: {
  "connected": false,
  "port": "COM3",
  "mockMode": false
}
❌ ERROR: PLC is NOT connected!
   Please connect PLC from Settings or enable autoConnect.
   Current status:
   - Connected: false
   - Port: COM3
   - Mock Mode: false
╚════════════════════════════════════════════════════════════╝
```

**Solution:**
1. Go to PLC Settings
2. Click "Connect to PLC"
3. OR enable `autoConnect: true` in plcConfig.js
4. OR enable `mockMode: true` for testing

---

### Scenario 2: Invalid Rack Name

**Console Output:**
```
🔍 STEP 2: Validating Rack Name & Getting Address Mapping...
─────────────────────────────────────────────────
❌ ERROR: Invalid rack name: R-02-WRONG
   Valid rack names: S1-R01, S1-R02, ... S1-R17
╚════════════════════════════════════════════════════════════╝
```

**Solution:**
- Check database rack names
- Ensure format: `S1-R01`, `S1-R02`, etc.
- Rack numbers 1-17 only supported

---

### Scenario 3: Write Failed

**Console Output:**
```
📤 STEP 1: Writing to PLC (Turn Sensor ON)...
─────────────────────────────────────────────────
[RACK-SENSOR] Rack S1-R02 selected and confirmed - Sending WRITE(M20, TRUE)

[WRITE REQUEST] Type: coil, Address: 20, Value: 1
[WRITE FAILED] Address 20, Value: 1, Error: Timeout

❌ STEP 1 FAILED: Could not activate sensor for S1-R02
   Error: Timeout
╚════════════════════════════════════════════════════════════╝
```

**Solution:**
- Increase `connectionTimeout` in settings
- Check PLC communication stability
- Verify COM port settings
- Try mock mode first

---

### Scenario 4: No Logs at All

**If you see NO console logs when clicking "Assign Rack":**

**Possible Causes:**
1. `rackSensorService.activateRackSensor()` not being called
2. Allocation service not integrated properly
3. Console not visible

**Solution:**
1. Open browser console (F12)
2. Check Node.js console where app is running
3. Verify allocation.service.js is calling sensor service
4. Check file: `desktop/allocation.service.js` line ~193

---

## Step-by-Step Troubleshooting

### ✅ Step 1: Restart Application

After adding enhanced logging:
```bash
# Restart your application
```

### ✅ Step 2: Check PLC Connection

Before allocating rack:
1. Check sidebar: Should show 🟢 "PLC Connected"
2. Check PLC Logs page
3. Should see "Connected: COM3" or "Mock PLC connected"

**If not connected:**
```javascript
// In desktop/plc/plcConfig.js
const DEFAULT_SETTINGS = {
    autoConnect: true,   // ✅ Enable this
    mockMode: true,      // ✅ Enable for testing
    // ... other settings
};
```

### ✅ Step 3: Test Allocation

1. Go to Inbound Inventory
2. Scan/Enter SKU
3. Select Rack S1-R02
4. Click "Confirm Placement"
5. **Watch Console Immediately**

### ✅ Step 4: Analyze Console Output

**Look for these key markers:**

1. **Allocation Trigger:**
   ```
   ╔════════════════════════════════════════════════════════════╗
   ║     ALLOCATION COMPLETE - TRIGGERING SENSOR                ║
   ```
   - ✅ If you see this → Allocation service is working
   - ❌ If missing → Check allocation.service.js integration

2. **Sensor Activation Start:**
   ```
   ╔════════════════════════════════════════════════════════════╗
   ║     RACK SENSOR ACTIVATION START - S1-R02              ║
   ```
   - ✅ If you see this → rackSensorService called successfully
   - ❌ If missing → Check sensor service import in allocation.service.js

3. **PLC Status Check:**
   ```
   🔍 STEP 1: Checking PLC Connection Status...
   PLC Status: { "connected": true, ... }
   ✅ PLC Connection OK: Mock Mode
   ```
   - ✅ If connected → Good, should continue
   - ❌ If not connected → Need to connect PLC first

4. **Address Mapping:**
   ```
   ✅ Rack mapping found:
      - Write Address: M20
      - Read Address: M1
   ```
   - ✅ If shown → Rack name valid
   - ❌ If error → Check rack name format

5. **Write Commands:**
   ```
   [WRITE REQUEST] Type: coil, Address: 20, Value: 1
   [WRITE SUCCESS] Coil Address 20 set to: true
   ```
   - ✅ If SUCCESS → PLC command sent!
   - ❌ If FAILED → Check PLC communication

6. **Auto-OFF:**
   ```
   (after 3 seconds)
   [AUTO-OFF] S1-R02 successfully turned OFF
   ```
   - ✅ If shown → Complete cycle worked!
   - ❌ If missing → Timer didn't fire

---

## Quick Checklist

### Before Testing:

- [ ] Application restarted with new logging code
- [ ] PLC Settings shows 🟢 "Connected" OR `autoConnect: true` enabled
- [ ] `mockMode: true` enabled (for testing without hardware)
- [ ] Browser console open (F12)
- [ ] Node.js console visible

### During Testing:

- [ ] Scan SKU in Inbound
- [ ] Select rack (e.g., S1-R02)
- [ ] Click "Confirm Placement"
- [ ] **Immediately watch console**

### Expected Results:

- [ ] See "ALLOCATION COMPLETE" box
- [ ] See "RACK SENSOR ACTIVATION START" box
- [ ] See "PLC Connection OK" message
- [ ] See "Rack mapping found" with addresses
- [ ] See "[WRITE REQUEST]" and "[WRITE SUCCESS]"
- [ ] Wait 3 seconds
- [ ] See "[AUTO-OFF]" messages

---

## Common Issues & Solutions

### Issue: "Polling disabled" message but no other logs

**Cause:** PLC connected but sensor service not being called

**Debug:**
1. Add breakpoint in `allocation.service.js` line ~193
2. Check if `rackSensorService.activateRackSensor()` is called
3. Check if rack name is correct format

### Issue: Logs stop after "STEP 1: Checking PLC Connection"

**Cause:** PLC not connected

**Solution:**
```javascript
autoConnect: true,
mockMode: true
```

### Issue: "WRITE FAILED" or timeout errors

**Cause:** PLC communication issues

**Solution:**
1. Increase timeout: `connectionTimeout: 500`
2. Try mock mode: `mockMode: true`
3. Check COM port available
4. Restart PLC if real hardware

### Issue: No auto-off after 3 seconds

**Cause:** Timer not executing

**Debug:**
1. Check if `sensorActivationDelay` is set
2. Check if application crashed
3. Look for exception logs

---

## Summary

### New Logging Shows:

1. ✅ **Allocation trigger** - When sensor service is called
2. ✅ **PLC status** - Connection state with details
3. ✅ **Rack validation** - Valid rack name and address mapping
4. ✅ **Write operations** - Every PLC write command
5. ✅ **Success/Failure** - Clear indication of each step
6. ✅ **Auto-off** - Background deactivation after delay

### Use Logs To:

1. 🔍 **Identify** where the flow stops
2. 🔍 **Verify** PLC connection status
3. 🔍 **Confirm** addresses being written
4. 🔍 **Check** write success/failure
5. 🔍 **Monitor** auto-off execution

**Now you can see exactly what's happening at each step!** 🎯
