# PLC Settings Reference - Matching Modbus Testing Project

## Settings from Your Modbus Testing Project (Image)

Based on your working Modbus testing configuration, warehouse project is now configured with:

### Connection Settings

| Setting | Value | Source | Description |
|---------|-------|--------|-------------|
| **HMI Station ID** | 1 | Image | Human Machine Interface ID |
| **PLC Station ID (Slave ID)** | 1 | Image | PLC device slave ID for Modbus RTU |
| **Interface Type** | TCP/RTU | Image | Modbus TCP or RTU (both RS232/RS485 options) |
| **COM Port** | COM5 | Image | Serial port for RTU communication |
| **Baud Rate** | 19200 bps | Image | Serial communication speed |
| **Data Bits** | 8 Bits | Image | Number of data bits per frame |
| **Stop Bits** | 1 Bit | Image | Number of stop bits |
| **Parity** | Even | Image | Parity checking mode |

### Timing & Diagnostics

| Setting | Value | Source | Description |
|---------|-------|--------|-------------|
| **Delay Time** | 100 ms | Image | Communication delay between requests |
| **Timeout** | 1000 ms | Image | Connection timeout duration |
| **Retries** | 3 | Image | Number of retry attempts on failure |

### Warehouse-Specific Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **Sensor Activation Delay** | 3000 ms | Time sensor stays ON before auto-OFF (matching Modbus 3s delay) |
| **Sensor Timeout** | 5000 ms | Timeout for sensor write operations |
| **Polling Enabled** | false | Continuous polling disabled (only explicit writes) |
| **Auto Connect** | false | Manual connection required |
| **Mock Mode** | false | Set to true for testing without hardware |

---

## Configuration File Location

**File:** `desktop/plc/plcConfig.js`

**Settings Object:**
```javascript
const DEFAULT_SETTINGS = {
    // Connection settings (matching image)
    port: 'COM5',              // COM Port from image
    baudRate: 19200,           // Baud Rate from image
    dataBits: 8,               // Data Bits from image
    stopBits: 1,               // Stop Bits from image
    parity: 'even',            // Parity from image
    slaveId: 1,                // PLC Station ID (Slave ID) from image
    
    // Additional settings
    autoConnect: false,
    pollInterval: 500,
    enablePolling: false,
    reconnectDelay: 5000,
    mockMode: false,
    
    // Timing settings matching Modbus testing project
    communicationDelay: 100,   // Delay Time from image
    connectionTimeout: 1000,   // Timeout from image
    connectRetries: 3,         // Retries from image
    
    // Sensor activation settings
    sensorActivationDelay: 3000,   // 3 seconds (matching Modbus testing)
    sensorTimeout: 5000
};
```

---

## Modbus Addressing

### Interface Type Options

From image, two interface types are shown:
1. **Modbus TCP** - Network-based communication (IP: 127.0.0.1, Port: 502)
2. **RS232 (RTU) / RS485 (RTU)** - Serial communication (COM5, 19200 baud)

Current configuration uses **RS485 (RTU)** settings:
- COM5 port
- 19200 baud rate
- 8 data bits, 1 stop bit, even parity

### Station IDs

- **HMI Station ID:** 1 (client/master ID)
- **PLC Station ID:** 1 (device/slave ID)

---

## Data Transfer Operations (From Image)

### Holding Register
- **Address:** 19 (0x13 in hex)
- **Operation:** Read register values

### Coil Status
- **Address:** 19 (0x13 in hex)
- **Write Value:** ON(True) / OFF(False)
- **Operation:** Write coil ON, auto-OFF after delay

---

## Rack Mapping (Warehouse Project)

Using the same addressing as Modbus testing:

| Rack | Coil Address | Example from Image |
|------|--------------|-------------------|
| S1-R01 | 19 | Matches "Coil Address: 19" in image |
| S1-R02 | 20 | Next address |
| S1-R03 | 21 | Next address |
| ... | ... | Sequential |
| S1-R17 | 35 | Last rack |

---

## Auto-OFF Timing

### Modbus Testing Project (Image Logs)
```
[2:54:01 PM] Write Success -> Coil Address 20 set to: true
[AUTO-OFF] Coil 20 will be turned OFF after 1 second...
[2:54:04 PM] (3 seconds later) Write Request -> Value: false
```

**Actual Delay:** 3 seconds (3000ms)

### Warehouse Project (Now Matching)
```javascript
sensorActivationDelay: 3000  // 3 seconds
```

**Flow:**
1. Rack allocated → Write Coil ON
2. Wait 3 seconds
3. Auto-OFF → Write Coil OFF

---

## Testing Configuration

### For Hardware Testing (Real PLC)
```javascript
{
    port: 'COM5',
    baudRate: 19200,
    dataBits: 8,
    stopBits: 1,
    parity: 'even',
    slaveId: 1,
    mockMode: false,    // Use real PLC
    autoConnect: true   // Auto-connect on startup
}
```

### For Software Testing (Mock Mode)
```javascript
{
    mockMode: true,     // Simulate PLC
    autoConnect: true   // Auto-connect on startup
}
```

---

## Connection Status Messages

### Expected Console Output (Matching Image)

**Modbus Testing:**
```
STATUS: 🟢 Connected
```

**Warehouse Project:**
```
✅ PLC Status: Connected to COM5
```

or in mock mode:
```
✅ PLC Status: Mock Mode
```

---

## Diagnostic Console Log Format

### Modbus Testing (Image)
```
[2:54:01 PM] INFO  Diagnostic Console Cleared.
[2:54:01 PM] INFO  Sending single write request for coil address 20...
[2:54:01 PM] TX    Write Request -> Type: coil, Address: 20, Value: 1
[2:54:04 PM] RX    Write Success -> Coil Address 20 set to: true
[2:54:07 PM] TX    Write Request -> Type: coil, Address: 20, Value: false
```

### Warehouse Project (Now Matching)
```
[RACK-SENSOR] Rack S1-R01 selected and confirmed - Sending WRITE(19, TRUE)
[WRITE REQUEST] Type: coil, Address: 19, Value: 1
[WRITE SUCCESS] Coil Address 19 set to: true
[AUTO-OFF] Sending OFF command to S1-R01 address 19
[WRITE REQUEST] Type: coil, Address: 19, Value: 0
[WRITE SUCCESS] Coil Address 19 set to: false
[AUTO-OFF] S1-R01 successfully turned OFF
```

---

## Settings Comparison

| Setting | Modbus Testing (Image) | Warehouse (Now) | Match |
|---------|----------------------|-----------------|-------|
| COM Port | COM5 | COM5 | ✅ |
| Baud Rate | 19200 | 19200 | ✅ |
| Data Bits | 8 | 8 | ✅ |
| Stop Bits | 1 | 1 | ✅ |
| Parity | Even | Even | ✅ |
| Slave ID | 1 | 1 | ✅ |
| Delay Time | 100ms | 100ms | ✅ |
| Timeout | 1000ms | 1000ms | ✅ |
| Retries | 3 | 3 | ✅ |
| Auto-OFF | 3s | 3s | ✅ |

**All settings now match! ✅**

---

## Quick Test Commands

### Test with Mock PLC (No Hardware)
```bash
node desktop/test-rack-sensor.js
```

### Test with Real PLC (Hardware Connected)
1. Update settings:
   ```javascript
   mockMode: false
   autoConnect: true
   ```
2. Restart application
3. Allocate product to rack
4. Check console logs

---

## Troubleshooting

### If Connection Fails

**Check:**
1. ✅ COM5 port exists and is available
2. ✅ PLC is powered on and connected
3. ✅ Baud rate matches PLC configuration (19200)
4. ✅ No other application is using COM5

**Solution:**
Enable mock mode for testing:
```javascript
mockMode: true
```

### If Auto-OFF Not Working

**Check:**
1. ✅ `sensorActivationDelay` is set (should be 3000)
2. ✅ Look for `[AUTO-OFF]` messages in console
3. ✅ Check if timer is being cancelled

**Debug:**
Reduce delay for faster testing:
```javascript
sensorActivationDelay: 1000  // 1 second for quick test
```

---

## Summary

✅ **All settings from Modbus testing image are now applied**

✅ **COM5, 19200 baud, 8-1-Even configuration**

✅ **3 second auto-OFF delay (matching Modbus testing)**

✅ **Same console log format**

✅ **Same connection check logic**

Ready for testing! 🚀
