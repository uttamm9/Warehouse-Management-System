# Rack Allocation Communication Flow

## Updated Implementation - Similar to Modbus Testing Project

The rack allocation now works exactly like your Modbus testing project:
- User confirms rack allocation
- WRITE command sent (TRUE)
- Automatic OFF scheduled after configured delay
- Background timer turns OFF the sensor

## Flow Diagram

```
User selects Rack (e.g., S1-R01)
         ↓
User clicks "Confirm Placement"
         ↓
activateRackSensor() called
         ↓
[RACK-SENSOR] Rack S1-R01 confirmed - Sending WRITE(19, TRUE)
         ↓
WRITE Command: M19 = TRUE
         ↓
[RACK-SENSOR] Sensor 19 ON for S1-R01
         ↓
[RACK-SENSOR] Will turn OFF after 15000ms (15 seconds)
         ↓
Function returns immediately (fire-and-forget)
         ↓
User sees success message
         ↓
... 15 seconds pass in background ...
         ↓
[AUTO-OFF] Sending OFF command to S1-R01 address 19
         ↓
WRITE Command: M19 = FALSE
         ↓
[AUTO-OFF] S1-R01 successfully turned OFF
         ↓
Complete
```

## Console Output Example

### When Rack is Allocated:
```
[RACK-SENSOR] Rack S1-R01 selected and confirmed - Sending WRITE(19, TRUE)
[RACK-SENSOR] Sensor 19 ON for S1-R01
[RACK-SENSOR] Will turn OFF after 15000ms (15 seconds)
[RACK-SENSOR] Background auto-off scheduled for S1-R01
```

### After 15 Seconds (Automatic):
```
[AUTO-OFF] Sending OFF command to S1-R01 address 19
[AUTO-OFF] S1-R01 successfully turned OFF
```

## Code Comparison

### Your Modbus Testing Project (Working)
```javascript
// Write ON
await modbusService.writeData({ writeType: "coil", address: 19, value: true });

// Schedule automatic OFF after 3 seconds
setTimeout(async () => {
    await modbusService.writeData({ writeType: "coil", address: 19, value: false });
}, 3000);
```

### Warehouse Project (Now Similar)
```javascript
// Write ON
await _writeCoilSafe(writeAddress, true, { operation: 'SENSOR_ON', rack: rackName });

// Schedule automatic OFF after 15 seconds
setTimeout(async () => {
    await _writeCoilSafe(writeAddress, false, { operation: 'SENSOR_OFF', rack: rackName });
}, 15000);
```

## Key Features

✅ **Fire-and-Forget:** Function returns immediately, user doesn't wait  
✅ **Background Timer:** Automatic OFF happens in background after delay  
✅ **Detailed Logging:** Similar to Modbus testing project console logs  
✅ **Error Handling:** If OFF fails, error is logged but doesn't break flow  
✅ **Configurable Delay:** Can be changed in PLC settings (default 15 seconds)

## Rack to Address Mapping

| Rack Name | Write Address | Read Address | Sensor |
|-----------|---------------|--------------|--------|
| S1-R01    | 19 (M19)      | 0 (M0)       | 1      |
| S1-R02    | 20 (M20)      | 1 (M1)       | 2      |
| S1-R03    | 21 (M21)      | 2 (M2)       | 3      |
| S1-R04    | 22 (M22)      | 3 (M3)       | 4      |
| S1-R05    | 23 (M23)      | 4 (M4)       | 5      |
| S1-R06    | 24 (M24)      | 5 (M5)       | 6      |
| S1-R07    | 25 (M25)      | 6 (M6)       | 7      |
| S1-R08    | 26 (M26)      | 7 (M7)       | 8      |
| S1-R09    | 27 (M27)      | 8 (M8)       | 9      |
| S1-R10    | 28 (M28)      | 9 (M9)       | 10     |
| S1-R11    | 29 (M29)      | 10 (M10)     | 11     |
| S1-R12    | 30 (M30)      | 11 (M11)     | 12     |
| S1-R13    | 31 (M31)      | 12 (M12)     | 13     |
| S1-R14    | 32 (M32)      | 13 (M13)     | 14     |
| S1-R15    | 33 (M33)      | 14 (M14)     | 15     |
| S1-R16    | 34 (M34)      | 15 (M15)     | 16     |
| S1-R17    | 35 (M35)      | 15 (M15)     | 16*    |

*S1-R17 shares sensor 16 with S1-R16

## Configuration

### PLC Connection Settings (Matching Modbus Testing Project)

The warehouse project now uses the exact same settings as your working Modbus testing project:

```javascript
{
    port: 'COM5',              // COM Port (from image)
    baudRate: 19200,           // Baud Rate (from image)
    dataBits: 8,               // Data Bits (from image)
    stopBits: 1,               // Stop Bits (from image)
    parity: 'even',            // Parity (from image)
    slaveId: 1,                // PLC Station ID (from image)
    
    communicationDelay: 100,   // Delay Time (from image)
    connectionTimeout: 1000,   // Timeout (from image)
    connectRetries: 3,         // Retries (from image)
    
    sensorActivationDelay: 3000,  // 3 seconds auto-off (matching Modbus testing)
    enablePolling: false          // No continuous polling
}
```

### Settings Comparison

| Setting | Modbus Testing | Warehouse | Status |
|---------|---------------|-----------|--------|
| COM Port | COM5 | COM5 | ✅ Match |
| Baud Rate | 19200 | 19200 | ✅ Match |
| Data Bits | 8 | 8 | ✅ Match |
| Stop Bits | 1 | 1 | ✅ Match |
| Parity | Even | Even | ✅ Match |
| Slave ID | 1 | 1 | ✅ Match |
| Auto-OFF | 3s | 3s | ✅ Match |

## Testing

### Test Single Rack Allocation
1. Select SKU and quantity
2. Confirm placement to a rack
3. Check console for `[RACK-SENSOR]` messages
4. Wait for configured delay
5. Check console for `[AUTO-OFF]` messages

### Test Multiple Racks
- Multiple racks can be allocated simultaneously
- Each rack has its own independent auto-off timer
- Timers run in background without blocking

## Differences from Modbus Testing Project

| Feature | Modbus Testing | Warehouse Project |
|---------|----------------|-------------------|
| Delay | 3 seconds (hardcoded) | 15 seconds (configurable) |
| Logging Prefix | `[AUTO-OFF]` | `[RACK-SENSOR]` and `[AUTO-OFF]` |
| Error Handling | Try-catch only | Try-catch + dedicated safe write function |
| Configuration | None | Configurable via plcConfig settings |

## Integration Point

The rack allocation is triggered from `allocation.service.js`:

```javascript
// Fire-and-forget sensor activation after successful transaction
rackSensorService.activateRackSensor(allocation.rackName, skuCode, quantity)
  .catch(err => {
    console.error('[Allocation] Sensor activation failed:', err.message);
  });
```

This ensures:
- Allocation completes even if sensor fails
- Sensor activation happens in background
- User gets immediate feedback
