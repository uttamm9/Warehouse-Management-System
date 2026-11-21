# PLC Communication Logic Update Summary

## Changes Made

### 1. PLC Configuration Update (`plcConfig.js`)

#### Simplified Tag Mapping
- **Removed:** All conveyor control tags, conveyor status tags, and animation register tags
- **Kept Only:**
  - **READ Tags (Sensors):** M0-M15 (16 sensors)
  - **WRITE Tags (Rack Commands):** M19-M35 (17 rack commands)

#### Updated Default Settings
- **`sensorActivationDelay`:** Changed from 1000ms (1 second) to **15000ms (15 seconds)**
- **`sensorTimeout`:** Changed from 3000ms to **20000ms (20 seconds)** to accommodate longer delay
- **`enablePolling`:** Added new setting, set to **`false`** by default to disable continuous polling

### 2. PLC Service Update (`plcService.js`)

#### Disabled Continuous Polling
- Modified `_startPolling()` method to check `enablePolling` setting
- When `enablePolling` is `false`, polling is completely disabled
- PLC now only responds to explicit write commands (no continuous READ requests)
- Logged message: "Polling disabled in settings - PLC will only respond to explicit write commands"

### 3. Rack Sensor Service Update (`rackSensor.service.js`)

#### Updated Rack-to-Sensor Mapping
- Maintained write addresses M19-M35 for racks S1-R01 through S1-R17
- Corrected mapping for racks S1-R09 to S1-R17 (previously had duplicate address 26)
- Each rack now has unique write address except shared sensors
- Removed racks S1-R18 and S1-R19 (only 17 racks supported as per tag configuration)

#### Updated Test Function
- Modified `testRackSensor()` wait time from 1 second to **15 seconds** to match `sensorActivationDelay`

## Communication Flow (As Implemented)

**Similar to your Modbus testing project - automatic OFF after delay**

```
User confirms rack allocation
         ↓
activateRackSensor() called
         ↓
[RACK-SENSOR] Sending WRITE(M[address], TRUE)
         ↓
WRITE command sent to PLC
         ↓
Function returns immediately (fire-and-forget)
         ↓
... Background timer runs for 15 seconds ...
         ↓
[AUTO-OFF] Sending WRITE(M[address], FALSE)
         ↓
Sensor automatically turned OFF
         ↓
Complete (no further commands)
```

**Key Implementation Detail:**
- Uses `setTimeout()` for background auto-off (same as Modbus testing project)
- User doesn't wait for the delay
- OFF command happens automatically in background
- Detailed console logging like `[RACK-SENSOR]` and `[AUTO-OFF]`

## Tag Configuration

### READ Tags (Sensor Status)
| Tag Name   | Address | Type | Direction | Description           |
|------------|---------|------|-----------|----------------------|
| Sensor_1   | 0       | M    | Read      | Sensor 1 feedback    |
| Sensor_2   | 1       | M    | Read      | Sensor 2 feedback    |
| ...        | ...     | ...  | ...       | ...                  |
| Sensor_16  | 15      | M    | Read      | Sensor 16 feedback   |

### WRITE Tags (Rack Commands)
| Tag Name | Address | Type | Direction | Description          |
|----------|---------|------|-----------|---------------------|
| Rack_1   | 19      | M    | Write     | Rack 1 command bit  |
| Rack_2   | 20      | M    | Write     | Rack 2 command bit  |
| ...      | ...     | ...  | ...       | ...                 |
| Rack_17  | 35      | M    | Write     | Rack 17 command bit |

## Key Benefits

1. **Minimal PLC Communication:** Polling disabled by default, reducing unnecessary network traffic
2. **Clean Configuration:** Only essential tags (sensors and rack commands) are configured
3. **Extended Activation Time:** 15-second delay provides adequate time for physical rack operations
4. **No Automatic Commands:** Only explicit user-confirmed rack allocations trigger PLC writes
5. **Simplified Maintenance:** Reduced tag count makes configuration easier to understand and maintain

## Testing Recommendations

1. **Test Rack Allocation:** Confirm that rack allocation triggers correct write address
2. **Verify 15-Second Delay:** Ensure sensor stays ON for full 15 seconds before turning OFF
3. **Confirm No Polling:** Monitor PLC traffic to verify no continuous READ commands are sent
4. **Test Each Rack:** Test all 17 racks (S1-R01 through S1-R17) to verify correct address mapping
5. **Mock Mode Testing:** Use mock mode for initial testing without hardware connection

## Configuration Changes Required

### For Existing Installations
If upgrading from previous version, the PLC settings file may need to be updated:

1. Delete or rename existing settings file:
   - Windows: `%APPDATA%\warehouse-wms\plc-settings.json`
   - Or use the location shown in console logs

2. Restart application to generate new settings with updated defaults

3. Alternatively, manually add these keys to existing settings file:
   ```json
   {
     "enablePolling": false,
     "sensorActivationDelay": 15000,
     "sensorTimeout": 20000
   }
   ```

## Files Modified

1. `desktop/plc/plcConfig.js` - Updated tag configuration and default settings
2. `desktop/plc/plcService.js` - Added polling enable/disable logic
3. `desktop/services/rackSensor.service.js` - Updated rack mapping, test timing, and **auto-off logic using setTimeout (similar to Modbus testing project)**

## Implementation Style

The implementation now follows the same pattern as your Modbus testing project:

**Modbus Testing Project:**
```javascript
setTimeout(async () => {
    await modbusService.writeData({ writeType: "coil", address: address, value: false });
}, 3000); // 3 second delay
```

**Warehouse Project (Updated):**
```javascript
setTimeout(async () => {
    await _writeCoilSafe(writeAddress, false, { operation: 'SENSOR_OFF', rack: rackName });
}, delay); // 15 second delay (configurable)
```

Both use the same `setTimeout` approach for automatic background OFF.

## Notes

- The allocation service (`allocation.service.js`) remains unchanged
- Existing write command logic already follows correct pattern (TRUE → delay → FALSE)
- Mock mode continues to work without hardware for testing
- Error handling and logging remain intact
