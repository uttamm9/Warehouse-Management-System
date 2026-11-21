/**
 * configuration.changes.test.js
 * 
 * Task 14.3 - Test configuration changes
 * 
 * Tests that configuration changes are properly applied and persisted:
 * - Change sensor activation delay via configuration API
 * - Verify new delay is used in next sensor activation
 * - Change PLC timeout and verify it's applied
 * - Test settings persistence after "restart" (reload)
 * 
 * Requirements: 5.3-5.6, 9.4-9.6
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Mock Electron app before requiring modules
const mockUserDataPath = path.join(os.tmpdir(), 'test-warehouse-wms-config-' + Date.now());

jest.mock('electron', () => ({
    app: {
        getPath: jest.fn(() => mockUserDataPath)
    }
}), { virtual: true });

// Now require the modules after mocking
const plcConfig = require('../../plc/plcConfig');
const rackSensorService = require('../rackSensor.service');

// Mock plcService to avoid real PLC communication
jest.mock('../../plc/plcService', () => ({
    writeCoil: jest.fn(),
    readCoil: jest.fn()
}));

// Mock plcLogger to avoid actual logging during tests
jest.mock('../../plc/plcLogger', () => ({
    log: {
        info: jest.fn(),
        error: jest.fn(),
        write: jest.fn(),
        read: jest.fn()
    }
}));

const plcService = require('../../plc/plcService');
const plcLogger = require('../../plc/plcLogger');

describe('Task 14.3 - Configuration Changes', () => {
    const SETTINGS_FILE = path.join(mockUserDataPath, 'plc-settings.json');

    beforeEach(() => {
        // Create temp directory for test settings
        if (!fs.existsSync(mockUserDataPath)) {
            fs.mkdirSync(mockUserDataPath, { recursive: true });
        }

        // Clear any existing settings file
        if (fs.existsSync(SETTINGS_FILE)) {
            fs.unlinkSync(SETTINGS_FILE);
        }

        // Clear all mocks
        jest.clearAllMocks();

        // Default mock behavior for plcService
        plcService.writeCoil.mockResolvedValue({ success: true });
        plcService.readCoil.mockResolvedValue({ success: true, values: [true] });
    });

    afterEach(() => {
        // Clean up test directory
        try {
            if (fs.existsSync(SETTINGS_FILE)) {
                fs.unlinkSync(SETTINGS_FILE);
            }
            if (fs.existsSync(mockUserDataPath)) {
                fs.rmdirSync(mockUserDataPath, { recursive: true });
            }
        } catch (err) {
            // Ignore cleanup errors
        }
    });

    describe('Sensor Activation Delay Configuration', () => {
        test('should use default sensor activation delay (1000ms) when no config exists', async () => {
            // Arrange: No config file exists
            expect(fs.existsSync(SETTINGS_FILE)).toBe(false);

            // Act: Load settings
            const settings = plcConfig.loadSettings();
            const delay = plcConfig.getSensorDelay();

            // Assert: Default values are used
            expect(settings.sensorActivationDelay).toBe(1000);
            expect(delay).toBe(1000);
        });

        test('should save and retrieve custom sensor activation delay', () => {
            // Arrange: Save new settings with custom delay
            const newDelay = 2500;
            const result = plcConfig.saveSettings({
                sensorActivationDelay: newDelay
            });

            // Assert: Save succeeded
            expect(result.success).toBe(true);
            expect(result.settings.sensorActivationDelay).toBe(newDelay);

            // Act: Load settings again
            const loadedSettings = plcConfig.loadSettings();
            const delay = plcConfig.getSensorDelay();

            // Assert: Custom delay is persisted
            expect(loadedSettings.sensorActivationDelay).toBe(newDelay);
            expect(delay).toBe(newDelay);
        });

        test('should use new delay in sensor activation sequence', async () => {
            // Arrange: Set custom delay to 500ms
            const customDelay = 500;
            plcConfig.saveSettings({
                sensorActivationDelay: customDelay
            });

            // Act: Trigger sensor activation
            const startTime = Date.now();
            await rackSensorService._executeActivationSequence(19, 'S1-R01', 'TEST-SKU', 10);
            const endTime = Date.now();
            const actualDuration = endTime - startTime;

            // Assert: Activation and deactivation commands were sent
            expect(plcService.writeCoil).toHaveBeenCalledTimes(2);
            expect(plcService.writeCoil).toHaveBeenNthCalledWith(1, 'M', 19, true);
            expect(plcService.writeCoil).toHaveBeenNthCalledWith(2, 'M', 19, false);

            // Assert: Duration matches the custom delay (with tolerance for execution time)
            expect(actualDuration).toBeGreaterThanOrEqual(customDelay);
            expect(actualDuration).toBeLessThan(customDelay + 200); // Allow 200ms tolerance
        });

        test('should use updated delay after configuration change', async () => {
            // Arrange: Start with default delay
            let settings = plcConfig.loadSettings();
            expect(settings.sensorActivationDelay).toBe(1000);

            // Act: Change delay to 300ms
            const newDelay = 300;
            plcConfig.saveSettings({
                sensorActivationDelay: newDelay
            });

            // Verify delay is updated
            settings = plcConfig.loadSettings();
            expect(settings.sensorActivationDelay).toBe(newDelay);

            // Act: Trigger sensor activation with new delay
            const startTime = Date.now();
            await rackSensorService._executeActivationSequence(20, 'S1-R02', 'TEST-SKU-2', 5);
            const endTime = Date.now();
            const actualDuration = endTime - startTime;

            // Assert: Duration matches the new delay
            expect(actualDuration).toBeGreaterThanOrEqual(newDelay);
            expect(actualDuration).toBeLessThan(newDelay + 200);
        });
    });

    describe('PLC Timeout Configuration', () => {
        test('should use default PLC timeout (3000ms) when no config exists', () => {
            // Arrange: No config file exists
            expect(fs.existsSync(SETTINGS_FILE)).toBe(false);

            // Act: Load settings
            const settings = plcConfig.loadSettings();
            const timeout = plcConfig.getSensorTimeout();

            // Assert: Default timeout is used
            expect(settings.sensorTimeout).toBe(3000);
            expect(timeout).toBe(3000);
        });

        test('should save and retrieve custom PLC timeout', () => {
            // Arrange: Save new timeout
            const newTimeout = 5000;
            const result = plcConfig.saveSettings({
                sensorTimeout: newTimeout
            });

            // Assert: Save succeeded
            expect(result.success).toBe(true);
            expect(result.settings.sensorTimeout).toBe(newTimeout);

            // Act: Load settings again
            const loadedSettings = plcConfig.loadSettings();
            const timeout = plcConfig.getSensorTimeout();

            // Assert: Custom timeout is persisted
            expect(loadedSettings.sensorTimeout).toBe(newTimeout);
            expect(timeout).toBe(newTimeout);
        });

        test('should accept valid timeout values (1000-10000ms)', () => {
            // Test minimum valid timeout
            let result = plcConfig.saveSettings({ sensorTimeout: 1000 });
            expect(result.success).toBe(true);
            expect(plcConfig.getSensorTimeout()).toBe(1000);

            // Test maximum valid timeout
            result = plcConfig.saveSettings({ sensorTimeout: 10000 });
            expect(result.success).toBe(true);
            expect(plcConfig.getSensorTimeout()).toBe(10000);

            // Test mid-range timeout
            result = plcConfig.saveSettings({ sensorTimeout: 5000 });
            expect(result.success).toBe(true);
            expect(plcConfig.getSensorTimeout()).toBe(5000);
        });
    });

    describe('Settings Persistence After Restart', () => {
        test('should persist sensor activation delay after simulated restart', () => {
            // Arrange: Save custom settings
            const customDelay = 1500;
            const customTimeout = 4000;

            plcConfig.saveSettings({
                sensorActivationDelay: customDelay,
                sensorTimeout: customTimeout
            });

            // Verify file was created
            expect(fs.existsSync(SETTINGS_FILE)).toBe(true);

            // Act: Simulate restart by reloading settings
            const loadedSettings = plcConfig.loadSettings();

            // Assert: Settings persisted correctly
            expect(loadedSettings.sensorActivationDelay).toBe(customDelay);
            expect(loadedSettings.sensorTimeout).toBe(customTimeout);
        });

        test('should merge new settings with existing persisted settings', () => {
            // Arrange: Save initial settings
            plcConfig.saveSettings({
                port: 'COM5',
                sensorActivationDelay: 1200
            });

            // Act: Save additional settings
            plcConfig.saveSettings({
                sensorTimeout: 6000
            });

            // Act: Load settings
            const loadedSettings = plcConfig.loadSettings();

            // Assert: All settings are preserved
            expect(loadedSettings.port).toBe('COM5');
            expect(loadedSettings.sensorActivationDelay).toBe(1200);
            expect(loadedSettings.sensorTimeout).toBe(6000);
        });

        test('should preserve all PLC connection settings along with sensor settings', () => {
            // Arrange: Save comprehensive settings
            const comprehensiveSettings = {
                port: 'COM4',
                baudRate: 19200,
                dataBits: 8,
                stopBits: 2,
                parity: 'odd',
                slaveId: 2,
                autoConnect: true,
                pollInterval: 1000,
                reconnectDelay: 3000,
                mockMode: true,
                sensorActivationDelay: 2000,
                sensorTimeout: 5000
            };

            plcConfig.saveSettings(comprehensiveSettings);

            // Act: Reload settings (simulated restart)
            const loadedSettings = plcConfig.loadSettings();

            // Assert: All settings are preserved
            expect(loadedSettings).toMatchObject(comprehensiveSettings);
        });

        test('should handle corrupted settings file gracefully', () => {
            // Arrange: Create corrupted settings file
            fs.writeFileSync(SETTINGS_FILE, '{ invalid json', 'utf-8');

            // Act: Load settings (should fall back to defaults)
            const loadedSettings = plcConfig.loadSettings();

            // Assert: Default settings are returned
            expect(loadedSettings.sensorActivationDelay).toBe(1000);
            expect(loadedSettings.sensorTimeout).toBe(3000);
        });
    });

    describe('End-to-End Configuration Change Flow', () => {
        test('complete workflow: change delay via UI -> verify in activation -> restart -> verify persistence', async () => {
            // Step 1: Simulate UI changing sensor activation delay to 750ms
            const newDelay = 750;
            const uiResult = plcConfig.saveSettings({
                sensorActivationDelay: newDelay
            });

            expect(uiResult.success).toBe(true);
            console.log('✓ Step 1: UI configuration saved successfully');

            // Step 2: Verify new delay is used in next activation
            const startTime = Date.now();
            await rackSensorService._executeActivationSequence(21, 'S1-R03', 'E2E-TEST-SKU', 15);
            const endTime = Date.now();
            const actualDuration = endTime - startTime;

            expect(actualDuration).toBeGreaterThanOrEqual(newDelay);
            expect(actualDuration).toBeLessThan(newDelay + 200);
            console.log(`✓ Step 2: New delay (${newDelay}ms) applied in activation (actual: ${actualDuration}ms)`);

            // Step 3: Simulate application restart by reloading settings
            const reloadedSettings = plcConfig.loadSettings();
            const reloadedDelay = plcConfig.getSensorDelay();

            expect(reloadedSettings.sensorActivationDelay).toBe(newDelay);
            expect(reloadedDelay).toBe(newDelay);
            console.log('✓ Step 3: Settings persisted after simulated restart');

            // Step 4: Verify delay is still used after restart
            const startTime2 = Date.now();
            await rackSensorService._executeActivationSequence(22, 'S1-R04', 'POST-RESTART-SKU', 8);
            const endTime2 = Date.now();
            const actualDuration2 = endTime2 - startTime2;

            expect(actualDuration2).toBeGreaterThanOrEqual(newDelay);
            expect(actualDuration2).toBeLessThan(newDelay + 200);
            console.log(`✓ Step 4: Delay still applied after restart (actual: ${actualDuration2}ms)`);
        });

        test('complete workflow: change timeout via UI -> verify applied -> restart -> verify persistence', () => {
            // Step 1: Simulate UI changing PLC timeout to 7000ms
            const newTimeout = 7000;
            const uiResult = plcConfig.saveSettings({
                sensorTimeout: newTimeout
            });

            expect(uiResult.success).toBe(true);
            console.log('✓ Step 1: UI timeout configuration saved successfully');

            // Step 2: Verify timeout is immediately available
            let loadedTimeout = plcConfig.getSensorTimeout();
            expect(loadedTimeout).toBe(newTimeout);
            console.log(`✓ Step 2: New timeout (${newTimeout}ms) applied immediately`);

            // Step 3: Simulate application restart
            const reloadedSettings = plcConfig.loadSettings();
            const reloadedTimeout = plcConfig.getSensorTimeout();

            expect(reloadedSettings.sensorTimeout).toBe(newTimeout);
            expect(reloadedTimeout).toBe(newTimeout);
            console.log('✓ Step 3: Timeout persisted after simulated restart');
        });

        test('simultaneous change of delay and timeout', async () => {
            // Arrange: Change both settings at once
            const newDelay = 600;
            const newTimeout = 8000;

            // Act: Save both settings together
            const result = plcConfig.saveSettings({
                sensorActivationDelay: newDelay,
                sensorTimeout: newTimeout
            });

            // Assert: Both settings saved
            expect(result.success).toBe(true);

            // Act: Verify both are loaded correctly
            const settings = plcConfig.loadSettings();
            expect(settings.sensorActivationDelay).toBe(newDelay);
            expect(settings.sensorTimeout).toBe(newTimeout);

            // Act: Verify delay is used in activation
            const startTime = Date.now();
            await rackSensorService._executeActivationSequence(23, 'S1-R05', 'DUAL-CONFIG-SKU', 20);
            const endTime = Date.now();
            const actualDuration = endTime - startTime;

            expect(actualDuration).toBeGreaterThanOrEqual(newDelay);
            expect(actualDuration).toBeLessThan(newDelay + 200);

            // Act: Simulate restart and verify persistence
            const reloadedSettings = plcConfig.loadSettings();
            expect(reloadedSettings.sensorActivationDelay).toBe(newDelay);
            expect(reloadedSettings.sensorTimeout).toBe(newTimeout);

            console.log('✓ Both delay and timeout configured, applied, and persisted successfully');
        });
    });

    describe('Edge Cases and Boundary Conditions', () => {
        test('should handle zero delay (immediate deactivation)', async () => {
            // Arrange: Set delay to 0ms
            plcConfig.saveSettings({ sensorActivationDelay: 0 });

            // Act: Execute activation sequence
            const startTime = Date.now();
            await rackSensorService._executeActivationSequence(24, 'S1-R06', 'ZERO-DELAY-SKU', 1);
            const endTime = Date.now();
            const actualDuration = endTime - startTime;

            // Assert: Both commands executed with minimal delay
            expect(plcService.writeCoil).toHaveBeenCalledTimes(2);
            // With 0ms delay, execution should be fast (under 2 seconds including async overhead)
            expect(actualDuration).toBeLessThan(2000);
            expect(plcConfig.getSensorDelay()).toBe(0);
        });

        test('should handle very large delay values', async () => {
            // Arrange: Set delay to 5000ms (5 seconds)
            const largeDelay = 5000;
            plcConfig.saveSettings({ sensorActivationDelay: largeDelay });

            // Act: Execute activation sequence (we'll measure start but not wait full duration)
            const activationPromise = rackSensorService._executeActivationSequence(25, 'S1-R07', 'LARGE-DELAY-SKU', 3);

            // Wait a short time and verify activation happened
            await new Promise(resolve => setTimeout(resolve, 100));
            expect(plcService.writeCoil).toHaveBeenNthCalledWith(1, 'M', 25, true);

            // Note: We don't wait the full 5 seconds in the test
            // Just verify the delay was loaded correctly
            expect(plcConfig.getSensorDelay()).toBe(largeDelay);

            // Clean up (the promise will resolve after the delay)
        }, 10000); // Increase test timeout

        test('should handle settings file deletion and recreation', () => {
            // Arrange: Create settings, then delete file
            plcConfig.saveSettings({ sensorActivationDelay: 1800 });
            expect(fs.existsSync(SETTINGS_FILE)).toBe(true);

            // Act: Delete settings file
            fs.unlinkSync(SETTINGS_FILE);
            expect(fs.existsSync(SETTINGS_FILE)).toBe(false);

            // Act: Load settings (should return defaults)
            const loadedSettings = plcConfig.loadSettings();
            expect(loadedSettings.sensorActivationDelay).toBe(1000);

            // Act: Save new settings
            plcConfig.saveSettings({ sensorActivationDelay: 2200 });

            // Assert: File recreated with new settings
            expect(fs.existsSync(SETTINGS_FILE)).toBe(true);
            const finalSettings = plcConfig.loadSettings();
            expect(finalSettings.sensorActivationDelay).toBe(2200);
        });

        test('should preserve other settings when updating sensor configuration', () => {
            // Arrange: Set initial comprehensive configuration
            plcConfig.saveSettings({
                port: 'COM6',
                baudRate: 9600,
                mockMode: false,
                sensorActivationDelay: 1000,
                sensorTimeout: 3000
            });

            // Act: Update only sensor settings
            plcConfig.saveSettings({
                sensorActivationDelay: 2000,
                sensorTimeout: 4000
            });

            // Assert: All settings preserved
            const finalSettings = plcConfig.loadSettings();
            expect(finalSettings.port).toBe('COM6');
            expect(finalSettings.baudRate).toBe(9600);
            expect(finalSettings.mockMode).toBe(false);
            expect(finalSettings.sensorActivationDelay).toBe(2000);
            expect(finalSettings.sensorTimeout).toBe(4000);
        });
    });
});
