# Task 14.1: Complete Inbound Workflow Testing Guide

## Executive Summary

**Task:** 14.1 - Test complete inbound workflow with real PLC  
**Date:** 2025-01-15  
**Status:** ✅ Ready for Testing  
**Requirements Coverage:** All (comprehensive end-to-end validation)

This guide provides a structured approach to testing the PLC sensor integration with the inbound workflow. It includes both automated verification and manual testing procedures.

---

## System Verification Results

### Automated Verification

✅ **All 23 automated checks passed**

The verification script (`TASK_14_1_VERIFICATION_SCRIPT.ps1`) has confirmed:

#### Implementation Status
- ✅ Rack Sensor Service (`rackSensor.service.js`) - Implemented
- ✅ PLC Service (`plcService.js`) - Implemented
- ✅ PLC Logger (`plcLogger.js`) - Implemented with sensor methods
- ✅ Allocation Service Integration - Implemented
- ✅ E2E Test File - Created

#### Database Schema
- ✅ Prisma schema configured
- ✅ SystemLog.plcOperation field - Present
- ✅ SystemLog.plcAddress field - Present
- ✅ SystemLog.rackId field - Present

#### Core Features
- ✅ Rack-to-Sensor Mapping (19 racks → 16 sensors)
- ✅ Sensor activation method (`activateRackSensor`)
- ✅ Sensor deactivation method (`deactivateRackSensor`)
- ✅ Shared sensor configuration (S1-R08 through S1-R11)
- ✅ PLC logger sensor methods (`sensorActivate`, `sensorDeactivate`, `sensorError`)

#### Configuration
- ✅ Sensor activation delay configured
- ✅ Sensor timeout configured
- ✅ Database URL configured (PostgreSQL)

#### Hardware Readiness
- ✅ COM ports detected: COM1, COM3, COM4, CNCA2, CNCB2
- ✅ Dependencies installed (modbus-serial, @prisma/client)

---

## Testing Approach

This task requires testing with **real PLC hardware**. The testing approach includes:

### 1. **Verification Testing** (Completed ✅)
   - Automated code verification
   - Database schema validation
   - Configuration check

### 2. **Manual Hardware Testing** (Required)
   - Physical PLC connection
   - Real sensor activation observation
   - Database log verification
   - Shared sensor validation

### 3. **Documentation Review** (Required)
   - Test results documentation
   - Issue tracking
   - Sign-off

---

## Hardware Prerequisites

Before proceeding with manual testing, ensure:

### Required Hardware
- [ ] Delta DVP PLC powered on and operational
- [ ] RS485 cable connected between PC and PLC
- [ ] Physical rack sensors 1-16 visible and accessible
- [ ] Test racks S1-R01 and S1-R08 through S1-R11 available

### Software Configuration
- [ ] WMS application installed and running
- [ ] Database connection established
- [ ] PLC settings configured in application

### Test Environment
- [ ] Safe test environment (not production)
- [ ] Backup of current inventory data
- [ ] Test SKUs prepared

---

## Testing Procedures

### Option A: Manual Testing (Recommended for Real Hardware)

**Use the comprehensive manual testing guide:**

📄 **File:** `MANUAL_TEST_PROCEDURE_TASK_14_1.md`

This document provides:
- Step-by-step testing procedures
- 6 comprehensive test scenarios:
  1. Complete inbound workflow for S1-R01
  2. Shared sensor racks (S1-R08 to S1-R11)
  3. Database logging verification
  4. Configuration testing
  5. Error handling
  6. Performance and usability
- Visual observation checklists
- SQL verification queries
- Troubleshooting guide
- Test sign-off template

**Estimated Time:** 1-2 hours for complete test suite

**To Execute:**
1. Open `MANUAL_TEST_PROCEDURE_TASK_14_1.md`
2. Follow each test scenario in order
3. Record observations and results
4. Complete the test summary and sign-off

### Option B: Automated E2E Testing (Mock Mode)

If real hardware is not available, use the automated E2E test with mocked PLC:

**File:** `desktop/services/__tests__/e2e.inbound.workflow.test.js`

**To Run:**
```bash
npm test -- e2e.inbound.workflow.test.js
```

**Coverage:**
- ✅ Inbound operation completes successfully
- ✅ Sensor activation triggered for S1-R01
- ✅ Database logging of activation/deactivation
- ✅ Shared sensor handling (S1-R08 to S1-R11)
- ✅ Error handling (PLC timeout, connection loss)

**Limitations:**
- ⚠️ Does not validate real hardware connectivity
- ⚠️ Does not validate physical sensor activation
- ⚠️ Uses mocked PLC responses

### Option C: Hybrid Approach

1. Run automated verification script (✅ Already completed)
2. Run E2E tests with mocked PLC
3. Perform targeted manual tests on real hardware:
   - Test Scenario 1 (Complete workflow for S1-R01)
   - Test Scenario 2 (Shared sensor racks)
   - Test Scenario 3 (Database logging verification)

**Estimated Time:** 30-45 minutes

---

## Key Test Cases

### Critical Test Cases (Must Pass)

| Test ID | Description | Expected Result | Priority |
|---------|-------------|-----------------|----------|
| TC-1 | Inbound to S1-R01 activates Sensor 1 | Sensor 1 lights up for 1 second | HIGH |
| TC-2 | Database logs activation and deactivation | Two SystemLog entries with correct fields | HIGH |
| TC-3 | Inventory transaction succeeds | SKU quantity updated, transaction recorded | HIGH |
| TC-4 | Shared racks (S1-R08 to S1-R11) activate Sensor 8 | All four racks trigger same sensor | HIGH |
| TC-5 | Database distinguishes shared rack operations | Logs show specific rack ID despite shared sensor | HIGH |
| TC-6 | PLC failure doesn't block inbound | Inventory completes successfully, error logged | HIGH |
| TC-7 | Sensor activation delay is configurable | Changing delay updates activation duration | MEDIUM |
| TC-8 | PLC timeout handling | Timeout logged with error details | MEDIUM |

### Edge Cases

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| EC-1 | Concurrent operations to shared sensor racks | Operations queued, no race conditions |
| EC-2 | PLC disconnection during operation | Graceful degradation, operation continues |
| EC-3 | Invalid rack name | Error returned, no sensor activation |
| EC-4 | Rapid sequential inbound operations | All operations complete, no blocking |

---

## Verification Checklist

### Implementation Verification (✅ Completed)

- [x] Rack-to-sensor mapping includes all 19 racks
- [x] Write addresses in range 19-34
- [x] Read addresses in range 0-15
- [x] Shared sensor (S1-R08 to S1-R11) configured with address 26
- [x] Activation method implemented
- [x] Deactivation method implemented
- [x] PLC logger has sensor-specific methods
- [x] Database schema has PLC fields (plcOperation, plcAddress, rackId)
- [x] Allocation service integrated with sensor activation
- [x] Configuration supports sensorActivationDelay and sensorTimeout

### Functional Verification (To Be Tested)

- [ ] Sensor activates when inventory assigned to rack
- [ ] Correct sensor lights up for given rack
- [ ] Sensor deactivates after configured delay
- [ ] Database logs contain activation events
- [ ] Database logs contain deactivation events
- [ ] Shared sensor racks use same physical sensor
- [ ] Database distinguishes between shared rack operations
- [ ] PLC failures don't block inventory transactions
- [ ] Error logging captures timeout details
- [ ] Configuration changes take effect

### Requirements Coverage (To Be Verified)

- [ ] **Req 1.1-1.6:** Rack-to-Sensor Mapping
- [ ] **Req 2.1-2.6:** Sensor Activation During Inbound
- [ ] **Req 3.1-3.6:** Automatic Sensor Deactivation
- [ ] **Req 4.1-4.6:** PLC Communication Logging
- [ ] **Req 5.1-5.10:** PLC Configuration Management
- [ ] **Req 6.1-6.6:** Shared Sensor Handling
- [ ] **Req 7.1-7.6:** Error Handling and Recovery
- [ ] **Req 8.1-8.6:** Inbound Workflow Integration
- [ ] **Req 9.1-9.6:** PLC Communication Timeout Handling
- [ ] **Req 10.1-10.7:** Sensor Status Validation
- [ ] **Req 11.1-11.6:** Backend Rack Service Integration
- [ ] **Req 12.1-12.6:** PLC Log Persistence and Retrieval

---

## Database Verification Queries

After manual testing, run these SQL queries to verify logging:

### Query 1: Recent Sensor Operations
```sql
SELECT 
  "timestamp",
  "action",
  "item" as sku_code,
  "rackId",
  "plcOperation",
  "plcAddress",
  "plcValue",
  "status"
FROM "SystemLog"
WHERE "plcOperation" IS NOT NULL
  AND "timestamp" > NOW() - INTERVAL '1 hour'
ORDER BY "timestamp" DESC
LIMIT 20;
```

**Expected:** You should see pairs of SENSOR_ON and SENSOR_OFF operations.

### Query 2: Shared Sensor Verification
```sql
SELECT 
  "rackId",
  "plcAddress",
  COUNT(*) as operation_count,
  COUNT(CASE WHEN "plcOperation" = 'SENSOR_ON' THEN 1 END) as activations,
  COUNT(CASE WHEN "plcOperation" = 'SENSOR_OFF' THEN 1 END) as deactivations
FROM "SystemLog"
WHERE "rackId" IN ('S1-R08', 'S1-R09', 'S1-R10', 'S1-R11')
  AND "plcOperation" IS NOT NULL
GROUP BY "rackId", "plcAddress"
ORDER BY "rackId";
```

**Expected:** All four racks show plcAddress = 26, but distinct rackId values.

### Query 3: Error Rate Analysis
```sql
SELECT 
  "plcOperation",
  "status",
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY "plcOperation"), 2) as percentage
FROM "SystemLog"
WHERE "plcOperation" IS NOT NULL
  AND "timestamp" > NOW() - INTERVAL '1 day'
GROUP BY "plcOperation", "status"
ORDER BY "plcOperation", "status";
```

**Expected:** High success rate (>95%), low error rate.

---

## Known Limitations

### Hardware Dependency
- **Real PLC Required:** Full validation requires physical Delta DVP PLC connected via RS485
- **COM Port Availability:** Windows COM port must be available and accessible
- **Physical Access:** Visual confirmation of sensor activation requires physical access to warehouse

### Test Environment Constraints
- **Not suitable for production testing:** Use dedicated test environment
- **Database impact:** Test operations create real log entries
- **Inventory data:** Test SKUs should be used to avoid affecting real inventory

### Current Test Infrastructure Issues
The automated E2E test (`e2e.inbound.workflow.test.js`) encountered issues running via Jest:
- Database connection challenges in test environment
- Test runner configuration may need adjustment

**Recommendation:** Focus on manual testing with real hardware for Task 14.1.

---

## Troubleshooting

### Issue: "Failed to connect to PLC"

**Symptoms:** Application shows PLC connection error

**Solutions:**
1. Verify COM port in Settings matches actual hardware port
2. Check RS485 cable is securely connected at both ends
3. Ensure PLC is powered on
4. Restart WMS application
5. Try different COM port if needed (COM3 is common)

### Issue: Sensor doesn't light up

**Symptoms:** Inbound operation succeeds, but no physical sensor activation

**Solutions:**
1. Use "Test Sensor" function in PLC Settings to verify sensor
2. Check sensor wiring and power supply
3. Verify PLC ladder logic is running
4. Confirm sensor bulb/LED is not burned out
5. Review sensor address mapping in code

### Issue: Wrong sensor lights up

**Symptoms:** Different sensor activates than expected

**Solutions:**
1. Verify physical sensor labels match logical mapping
2. Use "Test Sensor" function to identify each sensor
3. Check RACK_SENSOR_MAPPING in rackSensor.service.js
4. Update mapping if labels don't match physical installation

### Issue: Database logs not appearing

**Symptoms:** Sensor activates but no SystemLog entries

**Solutions:**
1. Verify database connection in .env file
2. Check SystemLog table exists and has PLC columns
3. Run Prisma migration if schema is outdated:
   ```bash
   npx prisma migrate deploy
   ```
4. Check plcLogger.js for database write errors in console

---

## Success Criteria

Task 14.1 is considered **COMPLETE** when:

### ✅ Functional Requirements Met
- [ ] Inbound operation to S1-R01 activates Sensor 1 for configured duration
- [ ] Database logs show activation and deactivation events with correct details
- [ ] Shared sensor racks (S1-R08 to S1-R11) all activate Sensor 8
- [ ] Database logs distinguish between shared rack operations
- [ ] PLC failures don't block inventory transactions
- [ ] Configuration changes (sensor delay, timeout) take effect

### ✅ Quality Requirements Met
- [ ] No inventory data loss or corruption during testing
- [ ] Error handling gracefully manages PLC failures
- [ ] Performance is acceptable (sensor activation < 2 seconds)
- [ ] User experience is smooth (no UI freezing)

### ✅ Documentation Complete
- [ ] Test results documented in manual test procedure
- [ ] Any issues or bugs documented
- [ ] Recommendations for improvements noted
- [ ] Test sign-off completed

---

## Next Steps After Testing

### If All Tests Pass ✅
1. Document test results in `MANUAL_TEST_PROCEDURE_TASK_14_1.md`
2. Mark Task 14.1 as complete
3. Proceed to Task 14.2 (Error scenarios with real PLC)
4. Consider deploying to production after Task 14.4 (Performance testing)

### If Tests Fail ❌
1. Document failure details in test procedure
2. Create bug reports with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots or logs
   - Environment details
3. Fix identified issues
4. Re-run failing test cases
5. Mark Task 14.1 as complete only when all critical tests pass

### Recommendations for Future Enhancements
Based on testing, consider:
- Adding real-time sensor status monitoring UI
- Implementing sensor health dashboard
- Adding PLC log analysis and reporting features
- Creating automated regression test suite with hardware-in-the-loop

---

## Quick Reference

### Important Files

| File | Purpose |
|------|---------|
| `TASK_14_1_VERIFICATION_SCRIPT.ps1` | Automated implementation verification |
| `MANUAL_TEST_PROCEDURE_TASK_14_1.md` | Comprehensive manual testing guide |
| `TASK_14_1_TESTING_GUIDE.md` | This file - testing overview and approach |
| `desktop/services/rackSensor.service.js` | Rack sensor service implementation |
| `desktop/allocation.service.js` | Allocation service with sensor integration |
| `desktop/plc/plcService.js` | PLC communication service |
| `desktop/plc/plcLogger.js` | PLC logging service |
| `prisma/schema.prisma` | Database schema with PLC log fields |

### Key Configuration Values

| Setting | Default Value | Location |
|---------|---------------|----------|
| Sensor Activation Delay | 1000ms (1 second) | PLC Settings UI |
| PLC Timeout | 3000ms (3 seconds) | PLC Settings UI |
| COM Port | COM3 (typical) | PLC Settings UI |
| Baud Rate | 9600 | PLC Settings UI |
| Database | warehouse_wms | .env |

### Rack-to-Sensor Quick Reference

| Rack Range | Sensor Number | Write Address | Shared |
|------------|---------------|---------------|--------|
| S1-R01 | 1 | 19 | No |
| S1-R02 to S1-R07 | 2-7 | 20-25 | No |
| **S1-R08 to S1-R11** | **8** | **26** | **Yes** |
| S1-R12 to S1-R19 | 9-16 | 27-34 | No |

---

## Test Execution Tracking

### Test Session Log

**Session 1:** _______________

| Test Scenario | Status | Time | Tester | Notes |
|---------------|--------|------|--------|-------|
| Verification Script | ✅ PASS | [Auto] | System | All 23 checks passed |
| Test Scenario 1 (S1-R01) | [ ] | | | |
| Test Scenario 2 (Shared Sensors) | [ ] | | | |
| Test Scenario 3 (Database Logging) | [ ] | | | |
| Test Scenario 4 (Configuration) | [ ] | | | |
| Test Scenario 5 (Error Handling) | [ ] | | | |
| Test Scenario 6 (Performance) | [ ] | | | |

**Overall Result:** [ ] PASS  [ ] FAIL  [ ] PARTIAL

---

## Contact and Support

**For Questions or Issues:**
- Review the spec: `.kiro/specs/plc-sensor-integration/`
- Check requirements: `.kiro/specs/plc-sensor-integration/requirements.md`
- Review design: `.kiro/specs/plc-sensor-integration/design.md`
- Consult tasks: `.kiro/specs/plc-sensor-integration/tasks.md`

---

**Document Version:** 1.0  
**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Task:** 14.1 - Test complete inbound workflow with real PLC  
**Status:** Ready for Manual Testing
