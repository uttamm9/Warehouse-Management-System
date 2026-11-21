# Complete Logs Guide - Rack Allocation PLC Commands

## Expected Full Log Flow

When you click "Confirm 1 Placement" button, you should see this complete log sequence:

### 1. API Endpoint Hit
```
╔════════════════════════════════════════════════════════════╗
║         POST /inventory/inward - ENDPOINT HIT              ║
╚════════════════════════════════════════════════════════════╝
Request Body: {
  "skuCode": "SKU-1001",
  "quantity": "1",
  "overrideShelfId": 123
}

➡️  Calling allocationService.confirmInward()...
   SKU: SKU-1001
   Quantity: 1
   Override Shelf: 123 (or None for auto-allocate)
```

### 2. Allocation Complete
```
✅ Allocation Service Result:
   Success: true
   Rack: S1-R05
   Shelf Level: 1

✅ WebSocket event emitted: inward_update
╚════════════════════════════════════════════════════════════╝
```

### 3. Sensor Activation Trigger
```
╔════════════════════════════════════════════════════════════╗
║     ALLOCATION COMPLETE - TRIGGERING SENSOR                ║
╚════════════════════════════════════════════════════════════╝
📦 SKU: SKU-1001
📊 Quantity: 1
🎯 Allocated Rack: S1-R05
📍 Shelf Level: 1

➡️  Calling rackSensorService.activateRackSensor()...
    This will send PLC commands to activate rack sensor.
```

### 4. Rack Sensor Activation Start
```
╔════════════════════════════════════════════════════════════╗
║     RACK SENSOR ACTIVATION START - S1-R05              ║
╚════════════════════════════════════════════════════════════╝
📦 SKU: SKU-1001
📊 Quantity: 1
🎯 Rack: S1-R05

🔍 STEP 1: Checking PLC Connection Status...
─────────────────────────────────────────────────
PLC Status: {
  "connected": true,
  "connecting": false,
  "reconnecting": false,
  "port": "MOCK",
  "slaveId": 1,
  "mockMode": true,
  "pollInterval": 400
}
✅ PLC Connection OK: Mock Mode
```

### 5. Rack Mapping Validation
```
🔍 STEP 2: Validating Rack Name & Getting Address Mapping...
─────────────────────────────────────────────────
✅ Rack mapping found:
   - Write Address: M23
   - Read Address: M4
   - Sensor Number: 5
```

### 6. Activation Sequence Queued
```
🚀 STEP 3: Triggering Background Activation Sequence...
─────────────────────────────────────────────────
   This will:
   1. WRITE M23 = TRUE
   2. Wait for configured delay
   3. WRITE M23 = FALSE

✅ Activation sequence queued successfully!
   Watch console for [RACK-SENSOR] and [AUTO-OFF] messages...
╚════════════════════════════════════════════════════════════╝

✅ [Allocation] Sensor activation initiated successfully
```

### 7. Executing Activation Sequence
```
╔════════════════════════════════════════════════════════════╗
║     EXECUTING ACTIVATION SEQUENCE - S1-R05            ║
╚════════════════════════════════════════════════════════════╝

📤 STEP 1: Writing to PLC (Turn Sensor ON)...
─────────────────────────────────────────────────
[RACK-SENSOR] Rack S1-R05 selected and confirmed - Sending WRITE(M23, TRUE)
   Operation: WRITE
   Type: Coil (M-bit)
   Address: M23
   Value: TRUE (1)
   Context: Rack=S1-R05, SKU=SKU-1001, Qty=1

[WRITE REQUEST] Type: coil, Address: 23, Value: 1
[WRITE SUCCESS] Coil Address 23 set to: true

✅ STEP 1 SUCCESS: Sensor activated
[RACK-SENSOR] Sensor M23 is now ON for S1-R05
```

### 8. Auto-OFF Scheduled
```
⏱️  STEP 2: Scheduling Auto-OFF...
─────────────────────────────────────────────────
[RACK-SENSOR] Will turn OFF after 3000ms (3 seconds)
   Auto-OFF will execute in background
   Watch for [AUTO-OFF] message in 3 seconds...

✅ Background auto-off scheduled for S1-R05
╚════════════════════════════════════════════════════════════╝
```

### 9. Auto-OFF Executed (After 3 seconds)
```
╔════════════════════════════════════════════════════════════╗
║     AUTO-OFF TRIGGERED - S1-R05                       ║
╚════════════════════════════════════════════════════════════╝

📤 STEP 3: Writing to PLC (Turn Sensor OFF)...
─────────────────────────────────────────────────
[AUTO-OFF] Sending OFF command to S1-R05 address M23
   Operation: WRITE
   Type: Coil (M-bit)
   Address: M23
   Value: FALSE (0)

[WRITE REQUEST] Type: coil, Address: 23, Value: 0
[WRITE SUCCESS] Coil Address 23 set to: false

✅ STEP 3 SUCCESS: Sensor deactivated
[AUTO-OFF] S1-R05 successfully turned OFF
╚════════════════════════════════════════════════════════════╝
```

---

## Where to Look for Logs

### Terminal/Console (Node.js Backend)
All the above logs appear in the terminal where you started the application:
```bash
npm start
# or
node desktop/main.js
# or
electron .
```

### Browser Console (F12)
Some logs may also appear in browser console if you have client-side logging.

---

## Debugging: What Logs Are You Seeing?

### Scenario 1: NO LOGS AT ALL

**If you see NOTHING when clicking "Confirm Placement":**

**Possible Causes:**
1. API endpoint not being called
2. RBAC middleware blocking request
3. Network error
4. Console not visible

**Debug Steps:**
1. Open browser DevTools (F12) → Network tab
2. Click "Confirm Placement"
3. Look for POST request to `/inventory/inward`
4. Check response status (should be 200)
5. Check backend terminal for logs

---

### Scenario 2: Only API Endpoint Logs

**If you ONLY see:**
```
╔════════════════════════════════════════════════════════════╗
║         POST /inventory/inward - ENDPOINT HIT              ║
╚════════════════════════════════════════════════════════════╝
```

**Then STOPS - no further logs:**

**Possible Causes:**
1. `allocationService.confirmInward()` is failing
2. Exception thrown before reaching sensor service
3. Database error

**Debug:**
- Check if error logged in catch block
- Check database connection
- Verify shelf/rack exists

---

### Scenario 3: Allocation Success but No Sensor Logs

**If you see:**
```
✅ Allocation Service Result:
   Success: true
   Rack: S1-R05
╚════════════════════════════════════════════════════════════╝
```

**But NO "ALLOCATION COMPLETE - TRIGGERING SENSOR":**

**Possible Causes:**
1. `rackSensorService.activateRackSensor()` not being called
2. Import missing in allocation.service.js
3. Function call syntax error

**Debug:**
- Check `desktop/allocation.service.js` line ~193
- Verify `rackSensorService` is imported
- Verify `.activateRackSensor()` is being called

---

### Scenario 4: Sensor Activation but PLC Not Connected

**If you see:**
```
🔍 STEP 1: Checking PLC Connection Status...
PLC Status: { "connected": false, ... }
❌ ERROR: PLC is NOT connected!
```

**Solution:**
```javascript
// In desktop/plc/plcConfig.js
autoConnect: true,   // Enable auto-connect
mockMode: true,      // Enable mock mode
```

Restart application.

---

### Scenario 5: Invalid Rack Name

**If you see:**
```
🔍 STEP 2: Validating Rack Name & Getting Address Mapping...
❌ ERROR: Invalid rack name: CR-R05
```

**Solution:**
- Check database rack names
- Must be format: `S1-R01`, `S1-R02`, etc.
- Update database if needed

---

### Scenario 6: Write Command Fails

**If you see:**
```
📤 STEP 1: Writing to PLC (Turn Sensor ON)...
[WRITE REQUEST] Type: coil, Address: 23, Value: 1
[WRITE FAILED] Address 23, Error: Timeout
❌ STEP 1 FAILED
```

**Solution:**
1. Increase timeout in settings
2. Enable mock mode for testing
3. Check COM port if using real hardware

---

## Quick Checklist

### Before Testing:

- [ ] Application restarted with new logging code
- [ ] Terminal/console window visible
- [ ] Browser F12 console open
- [ ] PLC connected (check sidebar for 🟢)

### During Testing:

- [ ] Click "Confirm 1 Placement"
- [ ] **Watch terminal immediately**
- [ ] Look for "POST /inventory/inward"
- [ ] Look for "ALLOCATION COMPLETE"
- [ ] Look for "RACK SENSOR ACTIVATION START"
- [ ] Look for "WRITE SUCCESS"

### Expected Results:

- [ ] See API endpoint hit
- [ ] See allocation success
- [ ] See sensor trigger
- [ ] See PLC connection OK
- [ ] See rack mapping found
- [ ] See WRITE SUCCESS (M23 = TRUE)
- [ ] Wait 3 seconds
- [ ] See AUTO-OFF (M23 = FALSE)

---

## Rack Number to Address Reference

Quick reference for debugging which address should be written:

| Rack Name | Write Address | Example Log |
|-----------|---------------|-------------|
| S1-R01 | M19 | `WRITE(M19, TRUE)` |
| S1-R02 | M20 | `WRITE(M20, TRUE)` |
| S1-R03 | M21 | `WRITE(M21, TRUE)` |
| S1-R04 | M22 | `WRITE(M22, TRUE)` |
| S1-R05 | M23 | `WRITE(M23, TRUE)` |
| S1-R06 | M24 | `WRITE(M24, TRUE)` |
| S1-R07 | M25 | `WRITE(M25, TRUE)` |
| S1-R08 | M26 | `WRITE(M26, TRUE)` |
| S1-R09 | M27 | `WRITE(M27, TRUE)` |
| S1-R10 | M28 | `WRITE(M28, TRUE)` |
| S1-R11 | M29 | `WRITE(M29, TRUE)` |
| S1-R12 | M30 | `WRITE(M30, TRUE)` |
| S1-R13 | M31 | `WRITE(M31, TRUE)` |
| S1-R14 | M32 | `WRITE(M32, TRUE)` |
| S1-R15 | M33 | `WRITE(M33, TRUE)` |
| S1-R16 | M34 | `WRITE(M34, TRUE)` |
| S1-R17 | M35 | `WRITE(M35, TRUE)` |

---

## Common Issues Summary

| Issue | You See | Solution |
|-------|---------|----------|
| **API not called** | No logs at all | Check browser network tab, verify endpoint |
| **PLC not connected** | "PLC is NOT connected" | Enable `autoConnect: true`, `mockMode: true` |
| **Invalid rack** | "Invalid rack name" | Check database rack format: S1-R## |
| **Write timeout** | "WRITE FAILED: Timeout" | Increase timeout or enable mock mode |
| **No sensor trigger** | Stops after allocation | Check rackSensorService import |
| **No auto-off** | No [AUTO-OFF] after 3s | Check timer, look for errors |

---

## Next Steps

### 1. Restart Application
```bash
# Kill current process
# Restart application
npm start
```

### 2. Open Both Consoles
- Terminal (backend logs)
- Browser F12 (frontend logs)

### 3. Test Allocation
- Go to Inbound Inventory
- Scan SKU: SKU-1001
- Select rack (e.g., S1-R05 in your image: CR-R05)
- Click "Confirm 1 Placement"

### 4. Watch Terminal

You should see the complete log sequence from sections 1-9 above.

### 5. Report Back

Tell me:
- ✅ Which sections you see (1-9)
- ❌ Where it stops
- 📋 Copy-paste the actual logs

This will help identify exactly where the issue is!

---

## Summary

✅ **Enhanced logging at every step**
✅ **API endpoint logs request**
✅ **Allocation service logs result**
✅ **Sensor service logs connection**
✅ **PLC commands logged with addresses**
✅ **Auto-OFF logged after delay**

**Now you can see exactly what's happening (or not happening)!** 🎯
