# Modbus Testing vs Warehouse Project - Side by Side Comparison

## Your Modbus Testing Project (Working Perfect ✅)

### Controller Code
```javascript
exports.write = async (req, res) => {
    try {
        const result = await modbusService.writeData(req.body);
        
        // Check if this is a coil write operation with value ON/True
        const isCoilWrite = req.body.writeType === "coil";
        const isOnValue = req.body.value === "true" || req.body.value === true || parseInt(req.body.value) === 1;
        
        if (isCoilWrite && isOnValue) {
            const address = parseInt(req.body.address);
            console.log(`[AUTO-OFF] Coil ${address} will be turned OFF after 1 second...`);
            
            // Schedule automatic OFF after 1 second (or 3 seconds based on image)
            setTimeout(async () => {
                try {
                    console.log(`[AUTO-OFF] Sending OFF command to Coil ${address}`);
                    await modbusService.writeData({
                        writeType: "coil",
                        address: address,
                        value: false
                    });
                    console.log(`[AUTO-OFF] Coil ${address} successfully turned OFF`);
                } catch (err) {
                    console.error(`[AUTO-OFF ERROR] Failed to turn OFF Coil ${address}: ${err.message}`);
                }
            }, 3000); // 3 second delay
        }
        
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
```

### Console Output
```
[2:54:01 PM] INFO  Sending single write request for coil address 20...
[2:54:01 PM] TX    Write Request -> Type: coil, Address: 20, Value: 1
[2:54:04 PM] RX    Write Success -> Coil Address 20 set to: true
[AUTO-OFF] Sending OFF command to Coil 20
[2:54:07 PM] TX    Write Request -> Type: coil, Address: 20, Value: false
```

---

## Warehouse Project (Now Updated ✅)

### Service Code
```javascript
async function _executeActivationSequence(writeAddress, rackName, skuCode, quantity) {
    const plcConfig = require('../plc/plcConfig');
    const plcLogger = require('../plc/plcLogger');

    // Step 1: Send writeCoil command with value=true (Rack allocation confirmed)
    console.log(`[RACK-SENSOR] Rack ${rackName} selected and confirmed - Sending WRITE(${writeAddress}, TRUE)`);
    
    const activationResult = await _writeCoilSafe(writeAddress, true, {
        operation: 'SENSOR_ON',
        rack: rackName,
        sku: skuCode,
        quantity
    });

    if (!activationResult.success) {
        console.error(`[RACK-SENSOR ERROR] Failed to activate sensor for ${rackName}`);
        return;
    }

    plcLogger.log.info(`Sensor activated for ${rackName}`, {
        rack: rackName,
        sku: skuCode,
        quantity,
        address: writeAddress,
        operation: 'SENSOR_ON'
    });

    console.log(`[RACK-SENSOR] Sensor ${writeAddress} ON for ${rackName}`);

    // Get configured delay (15 seconds by default)
    const settings = plcConfig.loadSettings();
    const delay = settings.sensorActivationDelay || 15000;

    console.log(`[RACK-SENSOR] Will turn OFF after ${delay}ms (${delay/1000} seconds)`);

    // Schedule automatic OFF after delay (SAME AS MODBUS TESTING PROJECT)
    setTimeout(async () => {
        try {
            console.log(`[AUTO-OFF] Sending OFF command to ${rackName} address ${writeAddress}`);
            
            const deactivationResult = await _writeCoilSafe(writeAddress, false, {
                operation: 'SENSOR_OFF',
                rack: rackName
            });

            if (deactivationResult.success) {
                console.log(`[AUTO-OFF] ${rackName} successfully turned OFF`);
                plcLogger.log.info(`Sensor deactivated for ${rackName}`, {
                    rack: rackName,
                    address: writeAddress,
                    operation: 'SENSOR_OFF'
                });
            } else {
                console.error(`[AUTO-OFF ERROR] Failed to turn OFF ${rackName}`);
            }
        } catch (err) {
            console.error(`[AUTO-OFF ERROR] Exception turning OFF ${rackName}: ${err.message}`);
        }
    }, delay);

    console.log(`[RACK-SENSOR] Background auto-off scheduled for ${rackName}`);
}
```

### Console Output (Expected)
```
[RACK-SENSOR] Rack S1-R01 selected and confirmed - Sending WRITE(19, TRUE)
[RACK-SENSOR] Sensor 19 ON for S1-R01
[RACK-SENSOR] Will turn OFF after 15000ms (15 seconds)
[RACK-SENSOR] Background auto-off scheduled for S1-R01

... 15 seconds later ...

[AUTO-OFF] Sending OFF command to S1-R01 address 19
[AUTO-OFF] S1-R01 successfully turned OFF
```

---

## Side-by-Side Comparison

| Feature | Modbus Testing | Warehouse Project |
|---------|----------------|-------------------|
| **Trigger** | User clicks "Write Data" with Coil ON | User confirms rack allocation |
| **Write ON** | `modbusService.writeData({ writeType: "coil", value: true })` | `_writeCoilSafe(writeAddress, true, {...})` |
| **Delay Mechanism** | `setTimeout(() => {...}, 3000)` | `setTimeout(() => {...}, delay)` |
| **Default Delay** | 3 seconds (hardcoded) | 15 seconds (configurable) |
| **Write OFF** | `modbusService.writeData({ writeType: "coil", value: false })` | `_writeCoilSafe(writeAddress, false, {...})` |
| **Logging** | `[AUTO-OFF]` prefix | `[RACK-SENSOR]` and `[AUTO-OFF]` prefix |
| **Error Handling** | Try-catch in setTimeout | Try-catch + safe write wrapper |
| **Configuration** | None (hardcoded) | Configurable via `sensorActivationDelay` |

---

## Key Similarities ✅

1. **Both use `setTimeout` for automatic OFF**
2. **Both return immediately (fire-and-forget)**
3. **Both have detailed console logging**
4. **Both handle errors gracefully**
5. **Both execute OFF in background**

---

## Example Test Scenario

### Modbus Testing
```
User Action: Write Coil 19 with value ON
Immediate: Coil 19 = TRUE
After 3s: Coil 19 = FALSE (automatic)
```

### Warehouse Project
```
User Action: Confirm placement to Rack S1-R01 (which maps to address 19)
Immediate: M19 = TRUE
After 15s: M19 = FALSE (automatic)
```

---

## How to Test

### 1. Test in Mock Mode (No Hardware)
```javascript
// In plcConfig.js settings
{
    mockMode: true,
    sensorActivationDelay: 3000  // Use 3 seconds for quick testing
}
```

### 2. Allocate a Product to Rack
- Select SKU
- Enter quantity
- Confirm placement to S1-R01

### 3. Watch Console
You should see:
```
[RACK-SENSOR] Rack S1-R01 selected and confirmed - Sending WRITE(19, TRUE)
[RACK-SENSOR] Sensor 19 ON for S1-R01
[RACK-SENSOR] Will turn OFF after 3000ms (3 seconds)
[RACK-SENSOR] Background auto-off scheduled for S1-R01

... wait 3 seconds ...

[AUTO-OFF] Sending OFF command to S1-R01 address 19
[AUTO-OFF] S1-R01 successfully turned OFF
```

### 4. Test Multiple Racks
- Allocate to S1-R01, then immediately to S1-R02
- Both should have independent auto-off timers
- Check console for separate `[AUTO-OFF]` messages

---

## Configuration

To match your Modbus testing project delay (3 seconds):

```javascript
// desktop/plc/plcConfig.js
const DEFAULT_SETTINGS = {
    // ... other settings
    sensorActivationDelay: 3000,  // 3 seconds instead of 15 seconds
};
```

Or update via PLC Settings UI in the application.

---

## Troubleshooting

### Issue: OFF command not firing
**Check:**
- Is the activation successful? (Check `[RACK-SENSOR]` logs)
- Is the delay configured correctly?
- Any errors in console during write?

### Issue: Delay too long
**Solution:**
Change `sensorActivationDelay` in settings to lower value (e.g., 3000 for 3 seconds)

### Issue: Multiple racks interfering
**Note:**
Each rack has independent timer - they should not interfere with each other

---

## Summary

✅ **Implementation Complete** - Warehouse project now uses same `setTimeout` pattern as Modbus testing project

✅ **Console Logging** - Similar detailed logging with `[RACK-SENSOR]` and `[AUTO-OFF]` prefixes

✅ **Background Execution** - OFF command happens automatically without blocking user

✅ **Error Handling** - Graceful error handling that doesn't break the flow

✅ **Configurable** - Delay can be adjusted via settings (unlike hardcoded in Modbus testing)
