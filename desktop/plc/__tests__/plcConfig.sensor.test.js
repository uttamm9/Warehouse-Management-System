/**
 * plcConfig.sensor.test.js
 * Tests for sensor configuration settings in plcConfig
 * Validates Requirements 5.3, 5.4, 5.5, 5.6, 9.4, 9.5
 */

const {
    loadSettings,
    saveSettings,
    getSensorDelay,
    getSensorTimeout,
    DEFAULT_SETTINGS
} = require('../plcConfig');
const fs = require('fs');
const path = require('path');

// Mock the electron app.getPath to use a test directory
jest.mock('electron', () => ({
    app: {
        getPath: (name) => {
            const mockPath = require('path');
            if (name === 'userData') {
                return mockPath.join(__dirname, '.test-data');
            }
            return '/tmp';
        }
    }
}), { virtual: true });

describe('PLC Config - Sensor Settings', () => {
    const testDataDir = path.join(__dirname, '.test-data');
    const settingsFile = path.join(testDataDir, 'plc-settings.json');

    beforeEach(() => {
        // Clean up test data directory
        if (fs.existsSync(testDataDir)) {
            fs.rmSync(testDataDir, { recursive: true, force: true });
        }
    });

    afterEach(() => {
        // Clean up after tests
        if (fs.existsSync(testDataDir)) {
            fs.rmSync(testDataDir, { recursive: true, force: true });
        }
    });

    describe('Default Sensor Settings', () => {
        it('should have default sensorActivationDelay of 1000ms', () => {
            expect(DEFAULT_SETTINGS.sensorActivationDelay).toBe(1000);
        });

        it('should have default sensorTimeout of 3000ms', () => {
            expect(DEFAULT_SETTINGS.sensorTimeout).toBe(3000);
        });

        it('should return default values when no settings file exists', () => {
            const settings = loadSettings();
            expect(settings.sensorActivationDelay).toBe(1000);
            expect(settings.sensorTimeout).toBe(3000);
        });
    });

    describe('Sensor Delay Configuration', () => {
        it('should return default sensor delay when no custom value set', () => {
            const delay = getSensorDelay();
            expect(delay).toBe(1000);
        });

        it('should save and retrieve custom sensorActivationDelay', () => {
            const customDelay = 2000;
            const result = saveSettings({ sensorActivationDelay: customDelay });

            expect(result.success).toBe(true);
            expect(result.settings.sensorActivationDelay).toBe(customDelay);

            const delay = getSensorDelay();
            expect(delay).toBe(customDelay);
        });

        it('should accept sensorActivationDelay >= 0', () => {
            const result = saveSettings({ sensorActivationDelay: 0 });
            expect(result.success).toBe(true);
            expect(getSensorDelay()).toBe(0);
        });
    });

    describe('Sensor Timeout Configuration', () => {
        it('should return default sensor timeout when no custom value set', () => {
            const timeout = getSensorTimeout();
            expect(timeout).toBe(3000);
        });

        it('should save and retrieve custom sensorTimeout', () => {
            const customTimeout = 5000;
            const result = saveSettings({ sensorTimeout: customTimeout });

            expect(result.success).toBe(true);
            expect(result.settings.sensorTimeout).toBe(customTimeout);

            const timeout = getSensorTimeout();
            expect(timeout).toBe(customTimeout);
        });

        it('should accept sensorTimeout within valid range (1000-10000ms)', () => {
            // Test minimum value
            let result = saveSettings({ sensorTimeout: 1000 });
            expect(result.success).toBe(true);
            expect(getSensorTimeout()).toBe(1000);

            // Test maximum value
            result = saveSettings({ sensorTimeout: 10000 });
            expect(result.success).toBe(true);
            expect(getSensorTimeout()).toBe(10000);

            // Test mid-range value
            result = saveSettings({ sensorTimeout: 5000 });
            expect(result.success).toBe(true);
            expect(getSensorTimeout()).toBe(5000);
        });
    });

    describe('Settings Persistence', () => {
        it('should persist sensor settings to file system', () => {
            const settings = {
                sensorActivationDelay: 1500,
                sensorTimeout: 4000
            };

            const result = saveSettings(settings);
            expect(result.success).toBe(true);

            // Verify file was created
            expect(fs.existsSync(settingsFile)).toBe(true);

            // Load and verify
            const loaded = loadSettings();
            expect(loaded.sensorActivationDelay).toBe(1500);
            expect(loaded.sensorTimeout).toBe(4000);
        });

        it('should merge new sensor settings with existing settings', () => {
            // Save initial settings
            saveSettings({ port: 'COM5', baudRate: 19200 });

            // Save sensor settings
            const result = saveSettings({
                sensorActivationDelay: 2500,
                sensorTimeout: 6000
            });

            expect(result.success).toBe(true);

            // Verify all settings are preserved
            const loaded = loadSettings();
            expect(loaded.port).toBe('COM5');
            expect(loaded.baudRate).toBe(19200);
            expect(loaded.sensorActivationDelay).toBe(2500);
            expect(loaded.sensorTimeout).toBe(6000);
        });
    });

    describe('Integration with PLC Configuration', () => {
        it('should maintain sensor settings alongside other PLC settings', () => {
            const fullSettings = {
                port: 'COM3',
                baudRate: 9600,
                dataBits: 7,
                stopBits: 1,
                parity: 'even',
                slaveId: 1,
                sensorActivationDelay: 1200,
                sensorTimeout: 3500
            };

            const result = saveSettings(fullSettings);
            expect(result.success).toBe(true);

            const loaded = loadSettings();
            expect(loaded.port).toBe('COM3');
            expect(loaded.baudRate).toBe(9600);
            expect(loaded.sensorActivationDelay).toBe(1200);
            expect(loaded.sensorTimeout).toBe(3500);
        });
    });
});
