# Troubleshooting - Expected Console Logs

## Understanding the "Polling disabled" Message

**Message:** `Polling disabled in settings - PLC will only respond to explicit write commands`

**What it means:**
- ✅ This is **NOT an error** - it's an informational message
- ✅ It confirms that continuous polling is disabled (as per requirements)
- ✅ PLC will only send WRITE commands when rack is allocated
- ✅ No continuous READ commands will be sent

**Why this is good:**
- Minimizes PLC communication
- Reduces network traffic
- Only communicates when necessary (rack allocation)

---

## Expected Console Logs - Complete Flow

### When You Allocate to Rack 1 (S1-R01)

You should see these logs in sequence:

```
[Allocation] Triggering sensor activation for rack: S1-R01

========== RACK SENSOR ACTIVATION START ==========
Rack: S1-R01, SKU: YOUR-SKU-CODE, Quantity: YOUR-QUANTITY
Rack mapping found: { writeAddress: 19, readAddress: 0, sensor: 1 }
========== RACK SENSOR ACTIVATION QUEUED ==========

[RACK-SENSOR] Rack S1-R01 selected and confirmed - Sending WRITE(19, TRUE)
[RACK-SENSOR] Sensor 19 ON for S1-R01
[RACK-SENSOR] Will turn OFF after 15000ms (15 seconds)
[RACK-SENSOR] Background auto-off scheduled for S1-R01

... wait 15 seconds ...

[AUTO-OFF] Sending OFF command to S1-R01 address 19
[AUTO-OFF] S1-R01 successfully turned OFF
```

---

## If You're NOT Seeing [RACK-SENSOR] Messages

### Check 1: Is PLC Connected?

**Look for this message in logs:**
```
Mock PLC connected
```
or
```
[PLCService] Connected to COM3
```

**If not connected:**
- Go to PLC Settings in UI
- Click "Connect" or enable "Auto Connect"
- Or check if `mockMode: true` in settings

### Check 2: Is Rack Name Correct?

**The rack must be one of:** S1-R01, S1-R02, S1-R03, ... S1-R17

**If you see:**
```
[RackSensor ERROR] Invalid rack name: SOME-RACK
```

Then the rack name in database doesn't match expected format.

### Check 3: Check Allocation Service

**Look for this message:**
```
[Allocation] Triggering sensor activation for rack: S1-R01
```

**If missing:** The allocation service might not be calling rackSensorService

---

## Testing Without Full Application

### Quick Test Script

Run this command from project root:

```bash
node desktop/test-rack-sensor.js
```

This will:
1. Connect to PLC in mock mode
2. Trigger rack sensor for S1-R01
3. Wait for auto-off sequence
4. Show all logs

**Expected output:**
```
========================================
RACK SENSOR TEST - Manual Execution
========================================

Step 1: Connecting to PLC in mock mode...
Connection result: { success: true, port: 'MOCK', mock: true }

✅ PLC Connected in mock mode

Step 2: Testing Rack S1-R01 activation...

========== RACK SENSOR ACTIVATION START ==========
Rack: S1-R01, SKU: TEST-SKU-001, Quantity: 10
Rack mapping found: { writeAddress: 19, readAddress: 0, sensor: 1 }
========== RACK SENSOR ACTIVATION QUEUED ==========

[RACK-SENSOR] Rack S1-R01 selected and confirmed - Sending WRITE(19, TRUE)
[RACK-SENSOR] Sensor 19 ON for S1-R01
[RACK-SENSOR] Will turn OFF after 15000ms (15 seconds)
[RACK-SENSOR] Background auto-off scheduled for S1-R01

⏳ Waiting for auto-off sequence to complete...

[AUTO-OFF] Sending OFF command to S1-R01 address 19
[AUTO-OFF] S1-R01 successfully turned OFF

✅ Test complete!
```

---

## Common Issues and Solutions

### Issue 1: No Logs at All

**Possible causes:**
- Console logging is not visible
- Application is not running in development mode
- Logs are going to a file instead of console

**Solution:**
- Check if application is running
- Look for log files in project directory
- Run with: `npm run dev` (or your dev command)

### Issue 2: Only See "Polling disabled" Message

**This means:**
- PLC service started successfully
- Polling is disabled (correct behavior)
- But rack allocation hasn't happened yet

**Solution:**
- This is normal! Allocate a product to a rack to trigger sensor

### Issue 3: See Activation but No Auto-OFF

**Possible causes:**
- Delay is set to very long value
- Timer was cancelled
- Application restarted before timer fired

**Check:**
```javascript
// In plcConfig.js
sensorActivationDelay: 15000  // 15 seconds
```

**For faster testing:**
```javascript
sensorActivationDelay: 3000  // 3 seconds
```

### Issue 4: Error "Invalid rack name"

**Possible causes:**
- Rack name in database is not in format: S1-R01, S1-R02, etc.
- Rack number is > 17 (only S1-R01 to S1-R17 supported)

**Solution:**
- Check rack name in database
- Update rack names to match: S1-R01, S1-R02, ... S1-R17

---

## Debug Checklist

✅ **Step 1:** Check if PLC is connected
```
Look for: "Mock PLC connected" or "Connected to COM3"
```

✅ **Step 2:** Allocate a product to rack
```
Look for: "[Allocation] Triggering sensor activation for rack: S1-R01"
```

✅ **Step 3:** Check rack mapping found
```
Look for: "Rack mapping found: { writeAddress: 19, ... }"
```

✅ **Step 4:** Check sensor activation
```
Look for: "[RACK-SENSOR] Sensor 19 ON for S1-R01"
```

✅ **Step 5:** Wait for configured delay
```
Look for: "[RACK-SENSOR] Will turn OFF after 15000ms"
```

✅ **Step 6:** Check auto-off
```
Look for: "[AUTO-OFF] S1-R01 successfully turned OFF"
```

---

## Enabling More Detailed Logs

If you need even more detailed logs, you can enable PLC logger verbose mode:

```javascript
// In plc/plcLogger.js or plcConfig.js
logLevel: 'debug'  // or 'verbose'
```

---

## Quick Reference - Rack to Address Mapping

| Rack | Write Address | What You'll See in Logs |
|------|---------------|------------------------|
| S1-R01 | 19 | `WRITE(19, TRUE/FALSE)` |
| S1-R02 | 20 | `WRITE(20, TRUE/FALSE)` |
| S1-R03 | 21 | `WRITE(21, TRUE/FALSE)` |
| S1-R04 | 22 | `WRITE(22, TRUE/FALSE)` |
| S1-R05 | 23 | `WRITE(23, TRUE/FALSE)` |
| S1-R06 | 24 | `WRITE(24, TRUE/FALSE)` |
| S1-R07 | 25 | `WRITE(25, TRUE/FALSE)` |
| S1-R08 | 26 | `WRITE(26, TRUE/FALSE)` |
| S1-R09 | 27 | `WRITE(27, TRUE/FALSE)` |
| S1-R10 | 28 | `WRITE(28, TRUE/FALSE)` |
| S1-R11 | 29 | `WRITE(29, TRUE/FALSE)` |
| S1-R12 | 30 | `WRITE(30, TRUE/FALSE)` |
| S1-R13 | 31 | `WRITE(31, TRUE/FALSE)` |
| S1-R14 | 32 | `WRITE(32, TRUE/FALSE)` |
| S1-R15 | 33 | `WRITE(33, TRUE/FALSE)` |
| S1-R16 | 34 | `WRITE(34, TRUE/FALSE)` |
| S1-R17 | 35 | `WRITE(35, TRUE/FALSE)` |

---

## Summary

✅ **"Polling disabled"** is normal and expected - not an error

✅ Run test script to verify: `node desktop/test-rack-sensor.js`

✅ Look for `[RACK-SENSOR]` and `[AUTO-OFF]` messages in console

✅ Default delay is 15 seconds - change to 3 seconds for faster testing

✅ Only racks S1-R01 to S1-R17 are supported with addresses 19-35
