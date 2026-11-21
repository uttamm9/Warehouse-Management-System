/**
 * Test script for rack sensor activation
 * Similar to Modbus testing project
 * - Connects using exact currentConfig settings
 * - Writes to Coil Address 19 (ON)
 * - Reads from Sensor Address 0
 * - Auto-OFF after 3 seconds
 * 
 * Run: node desktop/test-rack-sensor.js
 */

const plcService = require('./plc/plcService');

// Exact currentConfig from Modbus testing project
const currentConfig = {
    linkName: 'Delta_HMI_Link',
    manufacturer: 'Delta',
    seriesType: 'DOPSoft / Modbus RTU-TCP',
    password: '',
    hmiStationId: '1',
    plcStationId: '1',
    interfaceType: 'RS485',
    comPort: 'COM3',
    baudRate: '19200',
    dataBits: '8',
    stopBits: '1',
    parityBits: 'Even',
    communicationDelay: '100',
    connectionTimeout: '100',
    connectRetries: '3',
    connectionEnabled: false,
    simulationMode: false  // Set to true for mock mode testing
};

// Test configuration
const WRITE_COIL_ADDRESS = 19;  // Coil address for WRITE operation
const READ_SENSOR_ADDRESS = 0;   // Sensor address for READ operation
const AUTO_OFF_DELAY = 3000;     // 3 seconds delay before auto-off

async function testRackSensor() {
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║    WAREHOUSE PLC TEST - RACK SENSOR SCRIPT       ║');
    console.log('║         (Modbus Testing Compatible)              ║');
    console.log('╚══════════════════════════════════════════════════╝\n');

    try {
        // ═══════════════════════════════════════════════════════════════
        // STEP 1: Display currentConfig settings
        // ═══════════════════════════════════════════════════════════════
        console.log('📋 CURRENT CONFIGURATION:');
        console.log('─────────────────────────────────────────────────');
        console.log(`  Link Name:       ${currentConfig.linkName}`);
        console.log(`  Manufacturer:    ${currentConfig.manufacturer}`);
        console.log(`  Series Type:     ${currentConfig.seriesType}`);
        console.log(`  Interface Type:  ${currentConfig.interfaceType}`);
        console.log(`  COM Port:        ${currentConfig.comPort}`);
        console.log(`  Baud Rate:       ${currentConfig.baudRate} bps`);
        console.log(`  Data Bits:       ${currentConfig.dataBits}`);
        console.log(`  Stop Bits:       ${currentConfig.stopBits}`);
        console.log(`  Parity:          ${currentConfig.parityBits}`);
        console.log(`  HMI Station ID:  ${currentConfig.hmiStationId}`);
        console.log(`  PLC Station ID:  ${currentConfig.plcStationId}`);
        console.log(`  Comm Delay:      ${currentConfig.communicationDelay}ms`);
        console.log(`  Timeout:         ${currentConfig.connectionTimeout}ms`);
        console.log(`  Retries:         ${currentConfig.connectRetries}`);
        console.log(`  Simulation Mode: ${currentConfig.simulationMode ? 'Yes' : 'No'}`);
        console.log('');

        // ═══════════════════════════════════════════════════════════════
        // STEP 2: Connect to PLC using currentConfig
        // ═══════════════════════════════════════════════════════════════
        console.log('🔌 CONNECTING TO PLC...');
        console.log('─────────────────────────────────────────────────');
        
        // Map currentConfig to plcService format
        const connectionSettings = {
            port: currentConfig.comPort,
            baudRate: parseInt(currentConfig.baudRate),
            dataBits: parseInt(currentConfig.dataBits),
            stopBits: parseInt(currentConfig.stopBits),
            parity: currentConfig.parityBits.toLowerCase(),
            slaveId: parseInt(currentConfig.plcStationId),
            mockMode: currentConfig.simulationMode,  // Use simulationMode from config
            communicationDelay: parseInt(currentConfig.communicationDelay),
            connectionTimeout: parseInt(currentConfig.connectionTimeout),
            connectRetries: parseInt(currentConfig.connectRetries)
        };

        const connectResult = await plcService.connect(connectionSettings);
        
        if (!connectResult.success) {
            console.error('❌ Connection failed:', connectResult.message);
            console.error('\n💡 TIP: Set simulationMode: true in currentConfig for testing without hardware\n');
            return;
        }

        console.log(`✅ Connected successfully!`);
        console.log(`   Port: ${connectResult.port}`);
        console.log(`   Mode: ${connectResult.mock ? 'Simulation (Mock)' : 'Real Hardware'}`);
        console.log('');

        // Verify connection status
        const status = plcService.getStatus();
        console.log('📊 PLC STATUS:');
        console.log('─────────────────────────────────────────────────');
        console.log(`  Connected:    ${status.connected ? '✅ Yes' : '❌ No'}`);
        console.log(`  Port:         ${status.port}`);
        console.log(`  Slave ID:     ${status.slaveId}`);
        console.log(`  Mock Mode:    ${status.mockMode ? 'Yes' : 'No'}`);
        console.log(`  Polling:      ${status.connected && !status.mockMode ? 'Disabled' : 'N/A'}`);
        console.log('');

        // ═══════════════════════════════════════════════════════════════
        // STEP 3: Write to Coil Address 19 (Turn ON)
        // ═══════════════════════════════════════════════════════════════
        console.log('📤 WRITING TO PLC (COIL ON)...');
        console.log('─────────────────────────────────────────────────');
        console.log(`  Operation:    WRITE`);
        console.log(`  Type:         Coil (M-bit)`);
        console.log(`  Address:      ${WRITE_COIL_ADDRESS}`);
        console.log(`  Value:        ON (True)`);
        console.log('');

        const writeOnResult = await plcService.writeCoil('M', WRITE_COIL_ADDRESS, true);
        
        if (!writeOnResult.success) {
            console.error('❌ Write failed:', writeOnResult.message);
            await plcService.disconnect();
            return;
        }

        console.log('✅ Write successful!');
        console.log(`   [WRITE REQUEST] Type: coil, Address: ${WRITE_COIL_ADDRESS}, Value: 1`);
        console.log(`   [WRITE SUCCESS] Coil Address ${WRITE_COIL_ADDRESS} set to: true`);
        console.log('');

        // ═══════════════════════════════════════════════════════════════
        // STEP 4: Read from Sensor Address 0
        // ═══════════════════════════════════════════════════════════════
        console.log('📥 READING FROM PLC (SENSOR STATUS)...');
        console.log('─────────────────────────────────────────────────');
        console.log(`  Operation:    READ`);
        console.log(`  Type:         Coil (Sensor)`);
        console.log(`  Address:      ${READ_SENSOR_ADDRESS}`);
        console.log('');

        const readResult = await plcService.readCoil('M', READ_SENSOR_ADDRESS, 1);
        
        if (!readResult.success) {
            console.error('❌ Read failed:', readResult.message);
        } else {
            const sensorValue = readResult.values[0];
            console.log('✅ Read successful!');
            console.log(`   [READ REQUEST] Type: coil, Address: ${READ_SENSOR_ADDRESS}`);
            console.log(`   [READ SUCCESS] Sensor Address ${READ_SENSOR_ADDRESS} value: ${sensorValue ? 'ON (1)' : 'OFF (0)'}`);
        }
        console.log('');

        // ═══════════════════════════════════════════════════════════════
        // STEP 5: Schedule Auto-OFF (like Modbus testing)
        // ═══════════════════════════════════════════════════════════════
        console.log('⏱️  AUTO-OFF SCHEDULED...');
        console.log('─────────────────────────────────────────────────');
        console.log(`  Delay:        ${AUTO_OFF_DELAY}ms (${AUTO_OFF_DELAY / 1000} seconds)`);
        console.log(`  Address:      ${WRITE_COIL_ADDRESS}`);
        console.log(`  Value:        OFF (False)`);
        console.log('');
        console.log(`⏳ Waiting ${AUTO_OFF_DELAY / 1000} seconds before turning OFF...`);
        console.log('');

        // Wait for delay
        await new Promise(resolve => setTimeout(resolve, AUTO_OFF_DELAY));

        // ═══════════════════════════════════════════════════════════════
        // STEP 6: Write to Coil Address 19 (Turn OFF)
        // ═══════════════════════════════════════════════════════════════
        console.log('📤 AUTO-OFF TRIGGERED...');
        console.log('─────────────────────────────────────────────────');
        console.log(`  [AUTO-OFF] Sending OFF command to Coil ${WRITE_COIL_ADDRESS}`);

        const writeOffResult = await plcService.writeCoil('M', WRITE_COIL_ADDRESS, false);
        
        if (!writeOffResult.success) {
            console.error('❌ Auto-OFF failed:', writeOffResult.message);
        } else {
            console.log(`   [WRITE REQUEST] Type: coil, Address: ${WRITE_COIL_ADDRESS}, Value: 0`);
            console.log(`   [WRITE SUCCESS] Coil Address ${WRITE_COIL_ADDRESS} set to: false`);
            console.log(`✅ [AUTO-OFF] Coil ${WRITE_COIL_ADDRESS} successfully turned OFF`);
        }
        console.log('');

        // ═══════════════════════════════════════════════════════════════
        // STEP 7: Disconnect from PLC
        // ═══════════════════════════════════════════════════════════════
        console.log('🔌 DISCONNECTING FROM PLC...');
        console.log('─────────────────────────────────────────────────');
        await plcService.disconnect();
        console.log('✅ Disconnected successfully');
        console.log('');

        // ═══════════════════════════════════════════════════════════════
        // TEST COMPLETE
        // ═══════════════════════════════════════════════════════════════
        console.log('╔══════════════════════════════════════════════════╗');
        console.log('║              ✅ TEST COMPLETED                    ║');
        console.log('╚══════════════════════════════════════════════════╝');
        console.log('');
        console.log('📊 SUMMARY:');
        console.log(`  ✅ Connected to PLC (${currentConfig.comPort} @ ${currentConfig.baudRate} bps)`);
        console.log(`  ✅ Written to Coil ${WRITE_COIL_ADDRESS} (ON)`);
        console.log(`  ✅ Read from Sensor ${READ_SENSOR_ADDRESS}`);
        console.log(`  ✅ Auto-OFF after ${AUTO_OFF_DELAY / 1000}s`);
        console.log(`  ✅ Written to Coil ${WRITE_COIL_ADDRESS} (OFF)`);
        console.log(`  ✅ Disconnected from PLC`);
        console.log('');

    } catch (error) {
        console.error('\n╔══════════════════════════════════════════════════╗');
        console.error('║              ❌ TEST FAILED                       ║');
        console.error('╚══════════════════════════════════════════════════╝\n');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        console.error('');
        
        // Try to disconnect on error
        try {
            await plcService.disconnect();
        } catch (disconnectError) {
            // Ignore disconnect errors
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// RUN THE TEST
// ═══════════════════════════════════════════════════════════════
console.log('\n');
console.log('════════════════════════════════════════════════════');
console.log('  WAREHOUSE PLC TEST SCRIPT');
console.log('  Coil Write: Address 19');
console.log('  Sensor Read: Address 0');
console.log('  Auto-OFF: 3 seconds');
console.log('════════════════════════════════════════════════════');

testRackSensor()
    .then(() => {
        console.log('════════════════════════════════════════════════════');
        console.log('  Script execution completed');
        console.log('════════════════════════════════════════════════════\n');
        process.exit(0);
    })
    .catch(err => {
        console.error('════════════════════════════════════════════════════');
        console.error('  Script execution failed:', err.message);
        console.error('════════════════════════════════════════════════════\n');
        process.exit(1);
    });
