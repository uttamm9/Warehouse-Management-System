/**
 * rackSensor.service.js
 * 
 * Centralized service for managing rack-to-sensor mappings and controlling
 * PLC-based rack sensors during warehouse operations.
 * 
 * Responsibilities:
 * - Maintain rack-to-sensor mapping for all 19 warehouse racks
 * - Orchestrate sensor activation sequences (ON → delay → OFF)
 * - Handle shared sensor logic (S1-R08 through S1-R11 share sensor 8)
 * - Provide non-blocking sensor operations (errors logged, never thrown)
 * - Integrate with PLC service for Modbus communication
 */

/**
 * Rack-to-Sensor Mapping
 * 
 * Maps warehouse racks (S1-R01 through S1-R17) to their corresponding
 * PLC addresses and sensor numbers.
 * 
 * Updated Configuration:
 * - writeAddress: Modbus coil addresses M19-M35 for rack allocation commands
 * - readAddress: Modbus coil addresses M0-M15 for reading sensor status
 * - sensor: Physical sensor number (1-16)
 * - shared: Boolean flag indicating if multiple racks share this sensor
 * 
 * Special case: Racks S1-R08, S1-R09, S1-R10, S1-R11 all share sensor 8 at write address 26
 */
const RACK_SENSOR_MAPPING = {
    'S1-R01': { writeAddress: 19, readAddress: 0, sensor: 1 },
    'S1-R02': { writeAddress: 20, readAddress: 1, sensor: 2 },
    'S1-R03': { writeAddress: 21, readAddress: 2, sensor: 3 },
    'S1-R04': { writeAddress: 22, readAddress: 3, sensor: 4 },
    'S1-R05': { writeAddress: 23, readAddress: 4, sensor: 5 },
    'S1-R06': { writeAddress: 24, readAddress: 5, sensor: 6 },
    'S1-R07': { writeAddress: 25, readAddress: 6, sensor: 7 },
    'S1-R08': { writeAddress: 26, readAddress: 7, sensor: 8, shared: true },
    'S1-R09': { writeAddress: 27, readAddress: 8, sensor: 9 },
    'S1-R10': { writeAddress: 28, readAddress: 9, sensor: 10 },
    'S1-R11': { writeAddress: 29, readAddress: 10, sensor: 11 },
    'S1-R12': { writeAddress: 30, readAddress: 11, sensor: 12 },
    'S1-R13': { writeAddress: 31, readAddress: 12, sensor: 13 },
    'S1-R14': { writeAddress: 32, readAddress: 13, sensor: 14 },
    'S1-R15': { writeAddress: 33, readAddress: 14, sensor: 15 },
    'S1-R16': { writeAddress: 34, readAddress: 15, sensor: 16 },
    'S1-R17': { writeAddress: 35, readAddress: 15, sensor: 16, shared: true }
};

/**
 * Get sensor mapping for a rack
 * @param {string} rackName - Rack identifier (e.g., "S1-R01")
 * @returns {{ writeAddress: number, readAddress: number, sensor: number, shared?: boolean } | null}
 */
function getSensorMapping(rackName) {
    if (!rackName || typeof rackName !== 'string') {
        return null;
    }

    // Use hasOwnProperty to avoid prototype pollution issues
    if (!RACK_SENSOR_MAPPING.hasOwnProperty(rackName)) {
        return null;
    }

    const mapping = RACK_SENSOR_MAPPING[rackName];
    return mapping ? { ...mapping } : null;
}

/**
 * Activate rack sensor (fire-and-forget)
 * Triggers the activation sequence (ON → delay → OFF) in the background.
 * Returns immediately with success status without waiting for the sequence to complete.
 * 
 * @param {string} rackName - Rack identifier (e.g., "S1-R01")
 * @param {string} skuCode - SKU being assigned to the rack
 * @param {number} quantity - Quantity being assigned
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
async function activateRackSensor(rackName, skuCode, quantity) {
    const plcService = require('../plc/plcService');
    
    console.log(`\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║     RACK SENSOR ACTIVATION START - ${rackName}              ║`);
    console.log(`╚════════════════════════════════════════════════════════════╝`);
    console.log(`📦 SKU: ${skuCode}`);
    console.log(`📊 Quantity: ${quantity}`);
    console.log(`🎯 Rack: ${rackName}`);
    console.log('');
    
    // STEP 1: Check PLC connection status first
    console.log('🔍 STEP 1: Checking PLC Connection Status...');
    console.log('─────────────────────────────────────────────────');
    const plcStatus = plcService.getStatus();
    console.log('PLC Status:', JSON.stringify(plcStatus, null, 2));
    
    if (!plcStatus.connected && !plcStatus.mockMode) {
        console.error('❌ ERROR: PLC is NOT connected!');
        console.error('   Please connect PLC from Settings or enable autoConnect.');
        console.error('   Current status:');
        console.error(`   - Connected: ${plcStatus.connected}`);
        console.error(`   - Port: ${plcStatus.port}`);
        console.error(`   - Mock Mode: ${plcStatus.mockMode}`);
        console.log('╚════════════════════════════════════════════════════════════╝\n');
        return {
            success: false,
            message: 'PLC not connected'
        };
    }
    
    if (plcStatus.connected || plcStatus.mockMode) {
        console.log(`✅ PLC Connection OK: ${plcStatus.mockMode ? 'Mock Mode' : 'Real Hardware on ' + plcStatus.port}`);
    }
    console.log('');
    
    // STEP 2: Validate rack name and get mapping
    console.log('🔍 STEP 2: Validating Rack Name & Getting Address Mapping...');
    console.log('─────────────────────────────────────────────────');
    const mapping = getSensorMapping(rackName);

    if (!mapping) {
        console.error(`❌ ERROR: Invalid rack name: ${rackName}`);
        console.error('   Valid rack names: S1-R01, S1-R02, ... S1-R17');
        console.log('╚════════════════════════════════════════════════════════════╝\n');
        return {
            success: false,
            message: 'Invalid rack name'
        };
    }

    console.log('✅ Rack mapping found:');
    console.log(`   - Write Address: M${mapping.writeAddress}`);
    console.log(`   - Read Address: M${mapping.readAddress}`);
    console.log(`   - Sensor Number: ${mapping.sensor}`);
    if (mapping.shared) {
        console.log(`   - ⚠️  Shared sensor (multiple racks use this sensor)`);
    }
    console.log('');

    // STEP 3: Trigger the activation sequence in the background
    console.log('🚀 STEP 3: Triggering Background Activation Sequence...');
    console.log('─────────────────────────────────────────────────');
    console.log(`   This will:`);
    console.log(`   1. WRITE M${mapping.writeAddress} = TRUE`);
    console.log(`   2. Wait for configured delay`);
    console.log(`   3. WRITE M${mapping.writeAddress} = FALSE`);
    console.log('');
    
    // Trigger the activation sequence in the background (fire-and-forget)
    // Don't await - this is intentionally non-blocking
    _executeActivationSequence(mapping.writeAddress, rackName, skuCode, quantity)
        .catch(err => {
            // Log error but don't propagate - sensor failures should never block operations
            console.error(`\n❌ [RackSensor] Activation sequence FAILED for ${rackName}:`);
            console.error(`   Error: ${err.message}`);
            console.error(`   Stack: ${err.stack}`);
        });

    console.log(`✅ Activation sequence queued successfully!`);
    console.log(`   Watch console for [RACK-SENSOR] and [AUTO-OFF] messages...`);
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    // Return success immediately
    return { success: true };
}

/**
 * Deactivate rack sensor
 * Sends a write command to turn off the sensor.
 * 
 * @param {string} rackName - Rack identifier (e.g., "S1-R01")
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
async function deactivateRackSensor(rackName) {
    // Lookup sensor mapping
    const mapping = getSensorMapping(rackName);

    if (!mapping) {
        return {
            success: false,
            message: 'Invalid rack name'
        };
    }

    // Send writeCoil command with value=false
    const result = await _writeCoilSafe(mapping.writeAddress, false, {
        operation: 'SENSOR_OFF',
        rack: rackName
    });

    return result;
}

/**
 * Execute activation sequence: ON → wait → OFF
 * This is called internally by activateRackSensor in fire-and-forget mode.
 * Similar to Modbus testing project - write TRUE, then auto-OFF after delay
 * 
 * @private
 * @param {number} writeAddress - Modbus write address for the sensor
 * @param {string} rackName - Rack identifier
 * @param {string} skuCode - SKU being assigned
 * @param {number} quantity - Quantity being assigned
 * @returns {Promise<void>}
 */
async function _executeActivationSequence(writeAddress, rackName, skuCode, quantity) {
    const plcConfig = require('../plc/plcConfig');
    const plcLogger = require('../plc/plcLogger');

    console.log(`\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║     EXECUTING ACTIVATION SEQUENCE - ${rackName}            ║`);
    console.log(`╚════════════════════════════════════════════════════════════╝`);
    
    // Step 1: Send writeCoil command with value=true (Rack allocation confirmed)
    console.log(`\n📤 STEP 1: Writing to PLC (Turn Sensor ON)...`);
    console.log('─────────────────────────────────────────────────');
    console.log(`[RACK-SENSOR] Rack ${rackName} selected and confirmed - Sending WRITE(M${writeAddress}, TRUE)`);
    console.log(`   Operation: WRITE`);
    console.log(`   Type: Coil (M-bit)`);
    console.log(`   Address: M${writeAddress}`);
    console.log(`   Value: TRUE (1)`);
    console.log(`   Context: Rack=${rackName}, SKU=${skuCode}, Qty=${quantity}`);
    
    const activationResult = await _writeCoilSafe(writeAddress, true, {
        operation: 'SENSOR_ON',
        rack: rackName,
        sku: skuCode,
        quantity
    });

    if (!activationResult.success) {
        console.error(`\n❌ STEP 1 FAILED: Could not activate sensor for ${rackName}`);
        console.error(`   Error: ${activationResult.message || 'Unknown error'}`);
        console.log('╚════════════════════════════════════════════════════════════╝\n');
        return;
    }

    console.log(`✅ STEP 1 SUCCESS: Sensor activated`);
    console.log(`[RACK-SENSOR] Sensor M${writeAddress} is now ON for ${rackName}`);

    // Step 2: Log the activation
    plcLogger.log.info(`Sensor activated for ${rackName}`, {
        rack: rackName,
        sku: skuCode,
        quantity,
        address: writeAddress,
        operation: 'SENSOR_ON'
    });

    // Step 3: Get configured delay (15 seconds by default)
    const settings = plcConfig.loadSettings();
    const delay = settings.sensorActivationDelay || 3000;

    console.log(`\n⏱️  STEP 2: Scheduling Auto-OFF...`);
    console.log('─────────────────────────────────────────────────');
    console.log(`[RACK-SENSOR] Will turn OFF after ${delay}ms (${delay/1000} seconds)`);
    console.log(`   Auto-OFF will execute in background`);
    console.log(`   Watch for [AUTO-OFF] message in ${delay/1000} seconds...`);

    console.log(`\n✅ Background auto-off scheduled for ${rackName}`);
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Step 4: Schedule automatic OFF after delay (similar to Modbus testing project)
    setTimeout(async () => {
        console.log(`\n╔════════════════════════════════════════════════════════════╗`);
        console.log(`║     AUTO-OFF TRIGGERED - ${rackName}                       ║`);
        console.log(`╚════════════════════════════════════════════════════════════╝`);
        
        try {
            console.log(`\n📤 STEP 3: Writing to PLC (Turn Sensor OFF)...`);
            console.log('─────────────────────────────────────────────────');
            console.log(`[AUTO-OFF] Sending OFF command to ${rackName} address M${writeAddress}`);
            console.log(`   Operation: WRITE`);
            console.log(`   Type: Coil (M-bit)`);
            console.log(`   Address: M${writeAddress}`);
            console.log(`   Value: FALSE (0)`);
            
            const deactivationResult = await _writeCoilSafe(writeAddress, false, {
                operation: 'SENSOR_OFF',
                rack: rackName
            });

            if (deactivationResult.success) {
                console.log(`✅ STEP 3 SUCCESS: Sensor deactivated`);
                console.log(`[AUTO-OFF] ${rackName} successfully turned OFF`);
                
                plcLogger.log.info(`Sensor deactivated for ${rackName}`, {
                    rack: rackName,
                    address: writeAddress,
                    operation: 'SENSOR_OFF'
                });
            } else {
                console.error(`❌ STEP 3 FAILED: Could not deactivate sensor`);
                console.error(`[AUTO-OFF ERROR] Failed to turn OFF ${rackName}`);
                console.error(`   Error: ${deactivationResult.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(`\n❌ AUTO-OFF EXCEPTION for ${rackName}:`);
            console.error(`   Error: ${err.message}`);
            console.error(`   Stack: ${err.stack}`);
        }
        
        console.log('╚════════════════════════════════════════════════════════════╝\n');
    }, delay);
}

/**
 * Test sensor activation (used by settings UI)
 * Tests the complete sensor activation cycle by writing, reading, and verifying the sensor state.
 * 
 * @param {string} rackName - Rack identifier (e.g., "S1-R01")
 * @returns {Promise<{ success: boolean, message: string, data?: Object }>}
 */
async function testRackSensor(rackName) {
    const plcService = require('../plc/plcService');
    const startTime = Date.now();

    // Lookup sensor mapping
    const mapping = getSensorMapping(rackName);

    if (!mapping) {
        return {
            success: false,
            message: `Invalid rack name: ${rackName}`
        };
    }

    try {
        // Step 1: Activate sensor (writeCoil true)
        const writeResult = await plcService.writeCoil('M', mapping.writeAddress, true);

        if (!writeResult.success) {
            return {
                success: false,
                message: `Sensor activation failed: ${writeResult.message || 'Unknown error'}`,
                data: {
                    rack: rackName,
                    sensor: mapping.sensor,
                    writeAddress: mapping.writeAddress,
                    writeSuccess: false
                }
            };
        }

        // Step 2: Read sensor status (readCoil)
        const readResult = await plcService.readCoil('M', mapping.readAddress, 1);

        if (!readResult.success) {
            // Deactivate sensor before returning
            await plcService.writeCoil('M', mapping.writeAddress, false);

            return {
                success: false,
                message: `Sensor read failed: ${readResult.message || 'Unknown error'}`,
                data: {
                    rack: rackName,
                    sensor: mapping.sensor,
                    writeAddress: mapping.writeAddress,
                    readAddress: mapping.readAddress,
                    writeSuccess: true,
                    readSuccess: false
                }
            };
        }

        // Step 3: Compare written and read values
        const readValue = readResult.values && readResult.values[0];
        const valueMatch = readValue === true;

        // Step 4: Wait 15 seconds (matching sensorActivationDelay)
        await new Promise(resolve => setTimeout(resolve, 15000));

        // Step 5: Deactivate sensor
        const deactivateResult = await plcService.writeCoil('M', mapping.writeAddress, false);

        const responseTime = Date.now() - startTime;

        // Step 6: Return test result
        if (valueMatch && deactivateResult.success) {
            return {
                success: true,
                message: 'Sensor test completed successfully',
                data: {
                    rack: rackName,
                    sensor: mapping.sensor,
                    writeAddress: mapping.writeAddress,
                    readAddress: mapping.readAddress,
                    writeSuccess: true,
                    readSuccess: true,
                    valueMatch: true,
                    deactivateSuccess: true,
                    responseTime
                }
            };
        } else if (!valueMatch) {
            return {
                success: false,
                message: `Sensor test failed: Written value (true) does not match read value (${readValue})`,
                data: {
                    rack: rackName,
                    sensor: mapping.sensor,
                    writeAddress: mapping.writeAddress,
                    readAddress: mapping.readAddress,
                    writeSuccess: true,
                    readSuccess: true,
                    valueMatch: false,
                    writtenValue: true,
                    readValue,
                    deactivateSuccess: deactivateResult.success,
                    responseTime
                }
            };
        } else {
            return {
                success: false,
                message: `Sensor deactivation failed: ${deactivateResult.message || 'Unknown error'}`,
                data: {
                    rack: rackName,
                    sensor: mapping.sensor,
                    writeAddress: mapping.writeAddress,
                    readAddress: mapping.readAddress,
                    writeSuccess: true,
                    readSuccess: true,
                    valueMatch: true,
                    deactivateSuccess: false,
                    responseTime
                }
            };
        }

    } catch (error) {
        // Attempt to deactivate sensor on exception
        try {
            await plcService.writeCoil('M', mapping.writeAddress, false);
        } catch (cleanupError) {
            // Ignore cleanup errors
        }

        return {
            success: false,
            message: `Sensor test exception: ${error.message}`,
            data: {
                rack: rackName,
                sensor: mapping.sensor,
                error: error.message
            }
        };
    }
}

/**
 * Write coil with error handling (never throws)
 * Wraps plcService.writeCoil() with try-catch to ensure errors never propagate.
 * Similar to Modbus testing project - detailed logging
 * 
 * @private
 * @param {number} address - Modbus address to write
 * @param {boolean} value - Value to write (true/false)
 * @param {Object} context - Context information for logging (operation, rack, sku, quantity)
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
async function _writeCoilSafe(address, value, context = {}) {
    const plcService = require('../plc/plcService');
    const plcLogger = require('../plc/plcLogger');

    try {
        // Log write request (like Modbus testing: "Sending single write request...")
        console.log(`\n[WRITE REQUEST] Type: coil, Address: ${address}, Value: ${value ? 1 : 0}`);
        
        // Call plcService.writeCoil with 'M' type
        const result = await plcService.writeCoil('M', address, value);

        if (result.success) {
            // Log success (like Modbus testing: "Write Success -> Coil Address XX set to: true")
            console.log(`[WRITE SUCCESS] Coil Address ${address} set to: ${value}`);
            return { success: true };
        } else {
            // Write failed - log error with full context
            console.error(`[WRITE FAILED] Address ${address}, Value: ${value}, Error: ${result.message || 'Unknown error'}`);
            
            plcLogger.log.error(`PLC write failed: ${context.operation || 'WRITE'} ${context.rack || ''}`, {
                address,
                value,
                message: result.message || 'Unknown error',
                ...context
            });

            return {
                success: false,
                message: result.message || 'PLC write failed'
            };
        }
    } catch (error) {
        // Exception occurred - log error with full context
        console.error(`[WRITE ERROR] Exception at Address ${address}: ${error.message}`);
        
        plcLogger.log.error(`PLC write exception: ${context.operation || 'WRITE'} ${context.rack || ''}`, {
            address,
            value,
            error: error.message,
            stack: error.stack,
            ...context
        });

        return {
            success: false,
            message: error.message || 'PLC write exception'
        };
    }
}

/**
 * Activate outbound confirmation signal
 * Sends WRITE command to value=49 with status=true for outbound operations.
 * Unlike inbound, this does NOT auto-turn off. Instead, it starts a polling
 * mechanism to check value=0 every 500ms and turns off when status becomes true.
 * 
 * @param {string} skuCode - SKU being dispatched
 * @param {number} quantity - Quantity being dispatched
 * @param {string} rackLocation - Rack location (optional)
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
async function activateOutboundConfirmation(skuCode, quantity, rackLocation = null) {
    const plcService = require('../plc/plcService');
    
    console.log(`\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║     OUTBOUND CONFIRMATION ACTIVATION                       ║`);
    console.log(`╚════════════════════════════════════════════════════════════╝`);
    console.log(`📦 SKU: ${skuCode}`);
    console.log(`📊 Quantity: ${quantity}`);
    console.log(`🎯 Rack Location: ${rackLocation || 'N/A'}`);
    console.log('');
    
    // STEP 1: Check PLC connection status first
    console.log('🔍 STEP 1: Checking PLC Connection Status...');
    console.log('─────────────────────────────────────────────────');
    const plcStatus = plcService.getStatus();
    console.log('PLC Status:', JSON.stringify(plcStatus, null, 2));
    
    if (!plcStatus.connected && !plcStatus.mockMode) {
        console.error('❌ ERROR: PLC is NOT connected!');
        console.error('   Please connect PLC from Settings or enable autoConnect.');
        console.log('╚════════════════════════════════════════════════════════════╝\n');
        return {
            success: false,
            message: 'PLC not connected'
        };
    }
    
    if (plcStatus.connected || plcStatus.mockMode) {
        console.log(`✅ PLC Connection OK: ${plcStatus.mockMode ? 'Mock Mode' : 'Real Hardware on ' + plcStatus.port}`);
    }
    console.log('');
    
    // STEP 2: Send outbound confirmation signal (value=49, status=true)
    console.log('🔍 STEP 2: Sending Outbound Confirmation Signal...');
    console.log('─────────────────────────────────────────────────');
    console.log(`[OUTBOUND-CONFIRM] Sending WRITE(M49, TRUE) for outbound confirmation`);
    console.log(`   Operation: WRITE`);
    console.log(`   Type: Coil (M-bit)`);
    console.log(`   Address: M49`);
    console.log(`   Value: TRUE (1)`);
    console.log(`   Context: SKU=${skuCode}, Qty=${quantity}, Location=${rackLocation}`);
    
    const confirmationResult = await _writeCoilSafe(49, true, {
        operation: 'OUTBOUND_CONFIRM',
        sku: skuCode,
        quantity,
        rackLocation
    });

    if (!confirmationResult.success) {
        console.error(`\n❌ STEP 2 FAILED: Could not send outbound confirmation`);
        console.error(`   Error: ${confirmationResult.message || 'Unknown error'}`);
        console.log('╚════════════════════════════════════════════════════════════╝\n');
        return {
            success: false,
            message: 'Outbound confirmation failed'
        };
    }

    console.log(`✅ STEP 2 SUCCESS: Outbound confirmation sent`);
    console.log(`[OUTBOUND-CONFIRM] M49 is now ON for outbound operation`);
    console.log('');

    // STEP 3: Start polling mechanism to check M0 every 500ms
    console.log(`🔍 STEP 3: Starting Polling Mechanism...`);
    console.log('─────────────────────────────────────────────────');
    console.log(`[OUTBOUND-POLL] Will check M0 every 500ms`);
    console.log(`   When M0 status becomes TRUE:`);
    console.log(`   → Send WRITE(M49, FALSE) to complete outbound cycle`);
    console.log(`   → Stop polling`);
    
    // Start the polling mechanism in background (fire-and-forget)
    _startOutboundPolling(skuCode, quantity, rackLocation)
        .catch(err => {
            console.error(`\n❌ [OutboundPolling] Polling FAILED for ${skuCode}:`);
            console.error(`   Error: ${err.message}`);
            console.error(`   Stack: ${err.stack}`);
        });

    console.log(`✅ STEP 3 SUCCESS: Polling mechanism started`);
    console.log(`   Watch console for [OUTBOUND-POLL] and [OUTBOUND-COMPLETE] messages...`);
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    return { success: true };
}

/**
 * Start polling mechanism for outbound operations
 * Checks M0 every 500ms until status becomes true, then sends M49=false
 * 
 * @private
 * @param {string} skuCode - SKU being dispatched
 * @param {number} quantity - Quantity being dispatched  
 * @param {string} rackLocation - Rack location
 * @returns {Promise<void>}
 */
async function _startOutboundPolling(skuCode, quantity, rackLocation) {
    const plcService = require('../plc/plcService');
    const plcLogger = require('../plc/plcLogger');
    
    console.log(`\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║     OUTBOUND POLLING STARTED                               ║`);
    console.log(`╚════════════════════════════════════════════════════════════╝`);
    console.log(`📦 SKU: ${skuCode}`);
    console.log(`📊 Quantity: ${quantity}`);
    console.log(`🎯 Location: ${rackLocation}`);
    console.log(`⏱️  Poll Interval: 500ms`);
    console.log(`🎯 Target: M0 status becomes TRUE`);
    console.log('');

    let pollCount = 0;
    const maxPolls = 240; // 2 minutes max (240 * 500ms = 120 seconds)
    
    const pollInterval = setInterval(async () => {
        pollCount++;
        
        try {
            console.log(`[OUTBOUND-POLL] Check #${pollCount} - Reading M0...`);
            
            // Read M0 status
            const readResult = await plcService.readCoil('M', 0, 1);
            
            if (!readResult.success) {
                console.warn(`[OUTBOUND-POLL] Read failed: ${readResult.message}`);
                return; // Continue polling
            }

            const m0Status = readResult.values && readResult.values[0];
            console.log(`[OUTBOUND-POLL] M0 Status: ${m0Status}`);
            
            // Check if M0 is true
            if (m0Status === true) {
                console.log(`\n╔════════════════════════════════════════════════════════════╗`);
                console.log(`║     OUTBOUND COMPLETION TRIGGERED                          ║`);
                console.log(`╚════════════════════════════════════════════════════════════╝`);
                console.log(`✅ M0 status is TRUE - Completing outbound cycle`);
                console.log(`📤 Sending WRITE(M49, FALSE) to turn off confirmation`);
                
                // Stop polling
                clearInterval(pollInterval);
                
                // Send M49=false to complete the cycle
                const completeResult = await _writeCoilSafe(49, false, {
                    operation: 'OUTBOUND_COMPLETE',
                    sku: skuCode,
                    quantity,
                    rackLocation
                });

                if (completeResult.success) {
                    console.log(`✅ OUTBOUND COMPLETE: M49 turned OFF successfully`);
                    console.log(`[OUTBOUND-COMPLETE] ${skuCode} outbound cycle completed`);
                    
                    plcLogger.log.info(`Outbound cycle completed for ${skuCode}`, {
                        sku: skuCode,
                        quantity,
                        rackLocation,
                        operation: 'OUTBOUND_COMPLETE',
                        pollCount
                    });
                } else {
                    console.error(`❌ OUTBOUND COMPLETE FAILED: Could not turn OFF M49`);
                    console.error(`   Error: ${completeResult.message || 'Unknown error'}`);
                }
                
                console.log('╚════════════════════════════════════════════════════════════╝\n');
                return;
            }
            
            // Continue polling if M0 is still false
            console.log(`[OUTBOUND-POLL] M0 still FALSE - Continue polling...`);
            
        } catch (error) {
            console.error(`[OUTBOUND-POLL] Exception during poll #${pollCount}:`);
            console.error(`   Error: ${error.message}`);
            // Continue polling despite errors
        }
        
        // Safety timeout - stop after maxPolls attempts
        if (pollCount >= maxPolls) {
            console.warn(`\n⚠️  [OUTBOUND-POLL] TIMEOUT: Reached maximum polls (${maxPolls})`);
            console.warn(`   Stopping polling for safety. M0 never became TRUE.`);
            console.warn(`   Manual intervention may be required.`);
            clearInterval(pollInterval);
            
            plcLogger.log.warn(`Outbound polling timeout for ${skuCode}`, {
                sku: skuCode,
                quantity,
                rackLocation,
                operation: 'OUTBOUND_TIMEOUT',
                pollCount
            });
        }
        
    }, 500); // Poll every 500ms as requested
}

module.exports = {
    RACK_SENSOR_MAPPING,
    getSensorMapping,
    activateRackSensor,
    deactivateRackSensor,
    testRackSensor,
    activateOutboundConfirmation,  // New function for outbound operations
    _executeActivationSequence,    // Export for testing purposes
    _writeCoilSafe,               // Export for testing purposes
    _startOutboundPolling         // Export for testing purposes
};
