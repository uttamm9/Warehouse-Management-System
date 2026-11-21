# PLC Sensor Integration - End-to-End Testing Guide

## Overview

This document provides comprehensive testing procedures for validating the complete PLC sensor integration with the warehouse inbound workflow. Use this guide when testing with real Delta DVP PLC hardware.

## Prerequisites

### Hardware Requirements
- Delta DVP PLC powered and operational
- RS485 serial connection established
- All 16 rack sensors installed and wired
- Physical access to racks S1-R01 and S1-R08 through S1-R11 for visual verification

### Software Requirements
- WMS application running with database connection
- PLC connection settings configured in `plc-settings.json`
- Test SKUs and rack data seeded in database

### Pre-Test Configuration

1. **Verify PLC Connection Settings**
   ```bash
   # Location: %APPDATA%/Warehouse-WMS/plc-settings.json
   {
     "port": "COM3",           # Match your actual COM port
     "baudRate": 9600,
     "dataBits": 7,
     "stopBits": 1,
     "parity": "even",
     "slaveId": 1,
     "sensorActivationDelay": 1000,
     "sensorTimeout": 3000
   }
   ```

2. **Test PLC Connection**
   - Open WMS application
   - Navigate to Settings > PLC Configuration
   - Click "Connect PLC"
   - Verify connection status shows "Connected"

3. **Run Connection Test**
   ```powershell
   # From project root
   npm run test:plc-connection
   ```

## Test Scenarios

### Test 1: Complete Inbound Workflow for Rack S1-R01

**Objective:** Verify sensor activation, deactivation, and database logging for a standard rack.

**Procedure:**

1. **Start the test:**
   ```powershell
   REAL_PLC_TEST=true npm test -- e2e.inbound.workflow.test.js -t "Complete Inbound Workflow for Rack S1-R01"
   ```

2. **Visual verification steps:**
   - Position yourself to see Rack S1-R01 sensor (Sensor 1)
   - Wait for console message: `🔴 SENSOR SHOULD BE ON NOW`
   - **VERIFY:** Sensor 1 lights up
   - Wait for configured delay (~1 second by default)
   - Wait for console message: `🔵 SENSOR SHOULD BE OFF NOW`
   - **VERIFY:** Sensor 1 turns off

3. **Database verification:**
   ```sql
   SELECT 
     "timestamp",
     "action",
     "plcOperation",
     "plcAddress",
     "plcValue",
     "rackId",
     "status"
   FROM "SystemLog"
   WHERE "rackId" = 'S1-R01'
   ORDER BY "timestamp" DESC
   LIMIT 10;
   ```

4. **Expected results:**
   - ✅ Sensor 1 activates immediately when inbound operation completes
   - ✅ Sensor 1 stays on for exactly the configured delay
   - ✅ Sensor 1 deactivates automatically
   - ✅ Log entries exist for both SENSOR_ON and SENSOR_OFF operations
   - ✅ Log entries include correct plcAddress (19 for write, 0 for read)
   - ✅ Inventory transaction completed successfully regardless of sensor status

---

### Test 2: Shared Sensor Racks (S1-R08 to S1-R11)

**Objective:** Verify that racks S1-R08 through S1-R11 correctly activate the shared Sensor 8.

**Procedure:**

1. **Start the test:**
   ```powershell
   REAL_PLC_TEST=true npm test -- e2e.inbound.workflow.test.js -t "Shared Sensor Racks"
   ```

2. **Visual verification for S1-R08:**
   - Position yourself to see Sensor 8 (controls racks R08-R11)
   - Wait for console message indicating S1-R08 inbound
   - **VERIFY:** Sensor 8 lights up
   - **VERIFY:** Sensor 8 turns off after delay

3. **Visual verification for S1-R11:**
   - Wait for console message indicating S1-R11 inbound
   - **VERIFY:** Same Sensor 8 lights up again
   - **VERIFY:** Sensor 8 turns off after delay

4. **Database verification:**
   ```sql
   -- Check S1-R08 logs
   SELECT "rackId", "plcAddress", "plcOperation", "action"
   FROM "SystemLog"
   WHERE "rackId" = 'S1-R08'
   ORDER BY "timestamp" DESC
   LIMIT 5;

   -- Check S1-R11 logs
   SELECT "rackId", "plcAddress", "plcOperation", "action"
   FROM "SystemLog"
   WHERE "rackId" = 'S1-R11'
   ORDER BY "timestamp" DESC
   LIMIT 5;

   -- Both should use the same PLC address (26)
   ```

5. **Expected results:**
   - ✅ Sensor 8 activates for S1-R08 inbound
   - ✅ Sensor 8 activates for S1-R09 inbound
   - ✅ Sensor 8 activates for S1-R10 inbound
   - ✅ Sensor 8 activates for S1-R11 inbound
   - ✅ All log entries show correct rackId despite sharing sensor
   - ✅ All log entries show plcAddress = 26 (write address)
   - ✅ Shared sensor mapping flag = true in service

---

### Test 3: Sensor Activation Delay Configuration

**Objective:** Verify that changing the sensor activation delay affects the actual sensor on-time.

**Procedure:**

1. **Modify configuration:**
   ```json
   // Edit: %APPDATA%/Warehouse-WMS/plc-settings.json
   {
     "sensorActivationDelay": 3000  // Change to 3 seconds
   }
   ```

2. **Restart application** to load new settings

3. **Run inbound operation:**
   - Perform inbound for any rack (e.g., S1-R01)
   - Start a timer when sensor lights up
   - Measure time until sensor turns off
   - **VERIFY:** Sensor stays on for approximately 3 seconds

4. **Reset configuration:**
   ```json
   {
     "sensorActivationDelay": 1000  // Reset to 1 second
   }
   ```

5. **Expected results:**
   - ✅ Sensor on-time matches configured delay
   - ✅ Configuration change takes effect without code changes
   - ✅ Different delay values work correctly (tested 500ms, 1000ms, 3000ms)

---

### Test 4: PLC Timeout Handling

**Objective:** Verify graceful degradation when PLC does not respond within timeout.

**Procedure:**

1. **Configure short timeout:**
   ```json
   {
     "sensorTimeout": 1000  // 1 second timeout
   }
   ```

2. **Simulate timeout condition:**
   - Option A: Disconnect PLC cable during test
   - Option B: Modify PLC ladder logic to not respond

3. **Run inbound operation:**
   ```powershell
   REAL_PLC_TEST=true npm test -- e2e.inbound.workflow.test.js -t "Complete Inbound Workflow"
   ```

4. **Monitor console output:**
   - Watch for timeout error messages
   - **VERIFY:** Inventory transaction completes successfully
   - **VERIFY:** Error is logged but doesn't crash application

5. **Database verification:**
   ```sql
   SELECT "action", "status", "details"
   FROM "SystemLog"
   WHERE "status" = 'error'
   AND "plcOperation" IS NOT NULL
   ORDER BY "timestamp" DESC
   LIMIT 10;
   ```

6. **Expected results:**
   - ✅ Inventory transaction succeeds even with PLC timeout
   - ✅ Error log entry created with timeout details
   - ✅ Application continues normal operation
   - ✅ Subsequent operations work normally after reconnection

---

### Test 5: Database Logging Verification

**Objective:** Ensure all sensor operations are correctly logged to database.

**Procedure:**

1. **Clear existing logs:**
   ```sql
   DELETE FROM "SystemLog"
   WHERE "rackId" IN ('S1-R01', 'S1-R08', 'S1-R09', 'S1-R10', 'S1-R11');
   ```

2. **Run comprehensive test:**
   ```powershell
   REAL_PLC_TEST=true npm test -- e2e.inbound.workflow.test.js
   ```

3. **Verify log completeness:**
   ```sql
   -- Count logs by operation type
   SELECT 
     "plcOperation",
     "status",
     COUNT(*) as count
   FROM "SystemLog"
   WHERE "plcOperation" IS NOT NULL
   GROUP BY "plcOperation", "status";

   -- Expected output:
   -- SENSOR_ON   | success | 5+
   -- SENSOR_OFF  | success | 5+
   ```

4. **Verify log content:**
   ```sql
   SELECT 
     "timestamp",
     "rackId",
     "plcOperation",
     "plcAddress",
     "plcValue",
     "item",
     "details"
   FROM "SystemLog"
   WHERE "plcOperation" = 'SENSOR_ON'
   ORDER BY "timestamp" DESC
   LIMIT 3;
   ```

5. **Verify log fields:**
   - ✅ `rackId` contains correct rack identifier (e.g., 'S1-R01')
   - ✅ `plcOperation` contains operation type ('SENSOR_ON' or 'SENSOR_OFF')
   - ✅ `plcAddress` contains Modbus write address (19-34)
   - ✅ `plcValue` contains 'true' or 'false'
   - ✅ `item` contains SKU code
   - ✅ `details` contains JSON with context (sku, quantity, address)
   - ✅ `timestamp` is accurate
   - ✅ `status` is 'success' for successful operations

---

### Test 6: Multiple Sequential Operations

**Objective:** Verify system handles rapid sequential inbound operations without blocking.

**Procedure:**

1. **Prepare multiple test SKUs** (create in database if needed)

2. **Run rapid sequence test:**
   - Perform 5 inbound operations in quick succession
   - Use different racks for each operation
   - Monitor console and sensors

3. **Expected behavior:**
   - ✅ All inventory transactions complete quickly (< 500ms each)
   - ✅ Sensors activate in sequence (not blocking each other)
   - ✅ Each sensor activates for full duration
   - ✅ Database records all transactions correctly
   - ✅ No race conditions or timing conflicts

4. **Timing verification:**
   ```powershell
   # Total time should be ~5 seconds (5 operations × ~1 second delay each)
   # NOT 5+ seconds of blocking time
   ```

---

## Error Scenarios to Test

### Scenario 1: PLC Disconnected During Operation

1. Start inbound operation
2. Unplug PLC cable immediately after confirming
3. **VERIFY:** Transaction completes successfully
4. **VERIFY:** Error logged with "PLC disconnected" message
5. Reconnect PLC
6. Perform another inbound
7. **VERIFY:** Next operation works normally

### Scenario 2: Invalid Rack Name

1. Attempt to activate sensor for non-existent rack (e.g., 'S1-R99')
2. **VERIFY:** Error returned immediately
3. **VERIFY:** No PLC command sent
4. **VERIFY:** Clear error message in logs

### Scenario 3: Sensor Read Failure

1. Configure PLC to prevent read operations
2. Run sensor test via Settings UI
3. **VERIFY:** Test fails with readable error message
4. **VERIFY:** Sensor is deactivated after test (cleanup)

---

## Performance Benchmarks

Record these metrics during testing:

| Operation | Expected Time | Acceptable Range |
|-----------|--------------|------------------|
| Inbound transaction | < 500ms | 100-1000ms |
| Sensor activation command | < 50ms | 10-100ms |
| Sensor deactivation command | < 50ms | 10-100ms |
| Full activation sequence | ~1000ms | 950-1100ms |
| Database log write | < 100ms | 50-200ms |

---

## Troubleshooting

### Sensor doesn't activate

1. Check PLC connection status in UI
2. Verify COM port setting matches physical connection
3. Test with manual sensor test in Settings
4. Check PLC ladder logic is running
5. Verify sensor wiring and power supply

### Sensor activates but doesn't deactivate

1. Check `sensorActivationDelay` setting
2. Verify PLC accepts write commands
3. Check for exceptions in console logs
4. Verify deactivation command reaches PLC (use Modbus sniffer)

### Logs not appearing in database

1. Verify database connection
2. Check Prisma client is connected
3. Verify SystemLog table exists with PLC fields
4. Check for database permission issues
5. Review plcLogger.js logs for errors

### Wrong sensor activates

1. Verify rack-to-sensor mapping in `rackSensor.service.js`
2. Check PLC ladder logic address mapping
3. Verify hardware wiring matches documentation
4. Test with sensor test function in Settings UI

---

## Test Results Template

Use this template to document test results:

```
Test Date: _______________
Tester: _______________
PLC Model: Delta DVP _______________
Firmware Version: _______________

Test 1: Complete Inbound Workflow (S1-R01)
- Sensor activation: ☐ Pass ☐ Fail
- Sensor deactivation: ☐ Pass ☐ Fail
- Database logging: ☐ Pass ☐ Fail
- Notes: _________________________________

Test 2: Shared Sensor Racks
- S1-R08: ☐ Pass ☐ Fail
- S1-R09: ☐ Pass ☐ Fail
- S1-R10: ☐ Pass ☐ Fail
- S1-R11: ☐ Pass ☐ Fail
- Correct logging: ☐ Pass ☐ Fail
- Notes: _________________________________

Test 3: Configuration Changes
- Delay 500ms: ☐ Pass ☐ Fail
- Delay 1000ms: ☐ Pass ☐ Fail
- Delay 3000ms: ☐ Pass ☐ Fail
- Notes: _________________________________

Test 4: Error Handling
- PLC timeout: ☐ Pass ☐ Fail
- Connection lost: ☐ Pass ☐ Fail
- Graceful degradation: ☐ Pass ☐ Fail
- Notes: _________________________________

Test 5: Database Logging
- SENSOR_ON logs: ☐ Pass ☐ Fail
- SENSOR_OFF logs: ☐ Pass ☐ Fail
- Field completeness: ☐ Pass ☐ Fail
- Notes: _________________________________

Test 6: Sequential Operations
- Non-blocking: ☐ Pass ☐ Fail
- Correct timing: ☐ Pass ☐ Fail
- No race conditions: ☐ Pass ☐ Fail
- Notes: _________________________________

Overall Result: ☐ PASS ☐ FAIL

Signature: _______________ Date: _______________
```

---

## Automated Test Execution

To run all end-to-end tests with real PLC:

```powershell
# Set environment variable
$env:REAL_PLC_TEST="true"

# Run tests
npm test -- e2e.inbound.workflow.test.js

# Or with verbose output
npm test -- e2e.inbound.workflow.test.js --verbose
```

To run in mock mode (CI/CD):

```powershell
# No environment variable needed (default)
npm test -- e2e.inbound.workflow.test.js
```

---

## Maintenance Notes

- Run full test suite after any PLC firmware updates
- Re-verify after hardware changes (sensor replacement, wiring changes)
- Test configuration changes in staging before production
- Document any deviations from expected behavior
- Keep test logs for compliance and troubleshooting

---

## Support

For issues with PLC sensor integration:

1. Check console logs for error messages
2. Review database SystemLog table for error details
3. Verify PLC connection in Settings UI
4. Test sensors individually using Settings > Test Sensor
5. Contact PLC vendor if hardware issues suspected
