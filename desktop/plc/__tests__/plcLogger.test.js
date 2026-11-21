/**
 * plcLogger.test.js
 * Tests for PLC Logger sensor methods and database persistence
 */

const { log, getLogs, clearLogs, LOG_TYPES } = require('../plcLogger');
const { prisma } = require('../../db');

describe('PLC Logger - Sensor Methods', () => {
    beforeEach(() => {
        clearLogs();
    });

    describe('sensorActivate', () => {
        it('should log sensor activation with all required context', () => {
            const rack = 'S1R05';
            const sku = 'SKU-12345';
            const address = 23;
            const quantity = 10;

            log.sensorActivate(rack, sku, address, quantity);

            const logs = getLogs();
            expect(logs.logs.length).toBe(1);

            const entry = logs.logs[0];
            expect(entry.type).toBe(LOG_TYPES.WRITE);
            expect(entry.message).toBe('Sensor ON: S1R05');
            expect(entry.rack).toBe(rack);
            expect(entry.sku).toBe(sku);
            expect(entry.address).toBe(address);
            expect(entry.quantity).toBe(quantity);
            expect(entry.operation).toBe('SENSOR_ON');
            expect(entry.timestamp).toBeDefined();
        });
    });

    describe('sensorDeactivate', () => {
        it('should log sensor deactivation with rack and address', () => {
            const rack = 'S1R05';
            const address = 23;

            log.sensorDeactivate(rack, address);

            const logs = getLogs();
            expect(logs.logs.length).toBe(1);

            const entry = logs.logs[0];
            expect(entry.type).toBe(LOG_TYPES.WRITE);
            expect(entry.message).toBe('Sensor OFF: S1R05');
            expect(entry.rack).toBe(rack);
            expect(entry.address).toBe(address);
            expect(entry.operation).toBe('SENSOR_OFF');
            expect(entry.timestamp).toBeDefined();
        });
    });

    describe('sensorError', () => {
        it('should log sensor error with operation and error details', () => {
            const rack = 'S1R05';
            const operation = 'ACTIVATE';
            const error = 'PLC_TIMEOUT';
            const details = { timeout: 3000, port: 'COM3' };

            log.sensorError(rack, operation, error, details);

            const logs = getLogs();
            expect(logs.logs.length).toBe(1);

            const entry = logs.logs[0];
            expect(entry.type).toBe(LOG_TYPES.ERROR);
            expect(entry.message).toBe('Sensor ACTIVATE failed: S1R05');
            expect(entry.rack).toBe(rack);
            expect(entry.operation).toBe(operation);
            expect(entry.error).toBe(error);
            expect(entry.timeout).toBe(3000);
            expect(entry.port).toBe('COM3');
            expect(entry.timestamp).toBeDefined();
        });

        it('should log sensor error without additional details', () => {
            const rack = 'S1R12';
            const operation = 'DEACTIVATE';
            const error = 'WRITE_FAILED';

            log.sensorError(rack, operation, error);

            const logs = getLogs();
            expect(logs.logs.length).toBe(1);

            const entry = logs.logs[0];
            expect(entry.type).toBe(LOG_TYPES.ERROR);
            expect(entry.message).toBe('Sensor DEACTIVATE failed: S1R12');
            expect(entry.rack).toBe(rack);
            expect(entry.operation).toBe(operation);
            expect(entry.error).toBe(error);
        });
    });

    describe('sensor methods integration', () => {
        it('should log a complete activation/deactivation sequence', () => {
            const rack = 'S1R08';
            const sku = 'SKU-99999';
            const address = 26;
            const quantity = 5;

            // Activation
            log.sensorActivate(rack, sku, address, quantity);

            // Deactivation
            log.sensorDeactivate(rack, address);

            const logs = getLogs();
            expect(logs.logs.length).toBe(2);

            // Check activation entry (most recent first)
            expect(logs.logs[0].operation).toBe('SENSOR_OFF');
            expect(logs.logs[1].operation).toBe('SENSOR_ON');
        });
    });

    describe('database persistence', () => {
        // Helper to wait for async database operations
        const waitForDb = () => new Promise(resolve => setTimeout(resolve, 100));

        beforeEach(async () => {
            // Clean up any test logs from previous runs
            await prisma.systemLog.deleteMany({
                where: {
                    OR: [
                        { item: { startsWith: 'SKU-TEST' } },
                        { rackId: { startsWith: 'S1R' } }
                    ]
                }
            });
        });

        afterAll(async () => {
            // Clean up test data
            await prisma.systemLog.deleteMany({
                where: {
                    OR: [
                        { item: { startsWith: 'SKU-TEST' } },
                        { rackId: { startsWith: 'S1R' } }
                    ]
                }
            });
            await prisma.$disconnect();
        });

        it('should persist sensor activation to SystemLog table', async () => {
            const rack = 'S1R05';
            const sku = 'SKU-TEST-001';
            const address = 23;
            const quantity = 10;

            log.sensorActivate(rack, sku, address, quantity);

            // Wait for async database operation
            await waitForDb();

            // Query database
            const dbLogs = await prisma.systemLog.findMany({
                where: {
                    item: sku,
                    plcOperation: 'SENSOR_ON'
                },
                orderBy: { timestamp: 'desc' },
                take: 1
            });

            expect(dbLogs.length).toBe(1);
            const dbLog = dbLogs[0];

            expect(dbLog.action).toBe('SensorActivated');
            expect(dbLog.user).toBe('System');
            expect(dbLog.item).toBe(sku);
            expect(dbLog.status).toBe('info');
            expect(dbLog.plcOperation).toBe('SENSOR_ON');
            expect(dbLog.plcAddress).toBe(address);
            expect(dbLog.plcValue).toBe('true');
            expect(dbLog.rackId).toBe(rack);

            // Verify details JSON contains additional context
            const details = JSON.parse(dbLog.details);
            expect(details.quantity).toBe(quantity);
            expect(details.message).toBe(`Sensor ON: ${rack}`);
        });

        it('should persist sensor deactivation to SystemLog table', async () => {
            const rack = 'S1R12';
            const address = 27;

            log.sensorDeactivate(rack, address);

            // Wait for async database operation
            await waitForDb();

            // Query database
            const dbLogs = await prisma.systemLog.findMany({
                where: {
                    rackId: rack,
                    plcOperation: 'SENSOR_OFF'
                },
                orderBy: { timestamp: 'desc' },
                take: 1
            });

            expect(dbLogs.length).toBe(1);
            const dbLog = dbLogs[0];

            expect(dbLog.action).toBe('SensorDeactivated');
            expect(dbLog.user).toBe('System');
            expect(dbLog.item).toBe(rack); // Falls back to rack when no SKU
            expect(dbLog.status).toBe('info');
            expect(dbLog.plcOperation).toBe('SENSOR_OFF');
            expect(dbLog.plcAddress).toBe(address);
            expect(dbLog.plcValue).toBe('false');
            expect(dbLog.rackId).toBe(rack);
        });

        it('should persist sensor activation error to SystemLog table', async () => {
            const rack = 'S1R05';
            const operation = 'ACTIVATE';
            const error = 'PLC_TIMEOUT';
            const details = { timeout: 3000, port: 'COM3' };

            log.sensorError(rack, operation, error, details);

            // Wait for async database operation
            await waitForDb();

            // Query database
            const dbLogs = await prisma.systemLog.findMany({
                where: {
                    rackId: rack,
                    plcOperation: operation,
                    status: 'error'
                },
                orderBy: { timestamp: 'desc' },
                take: 1
            });

            expect(dbLogs.length).toBe(1);
            const dbLog = dbLogs[0];

            expect(dbLog.action).toBe('SensorActivationFailed');
            expect(dbLog.user).toBe('System');
            expect(dbLog.item).toBe(rack);
            expect(dbLog.status).toBe('error');
            expect(dbLog.plcOperation).toBe(operation);
            expect(dbLog.rackId).toBe(rack);

            // Verify error details
            const parsedDetails = JSON.parse(dbLog.details);
            expect(parsedDetails.error).toBe(error);
            expect(parsedDetails.timeout).toBe(3000);
            expect(parsedDetails.port).toBe('COM3');
        });

        it('should persist sensor deactivation error to SystemLog table', async () => {
            const rack = 'S1R08';
            const operation = 'DEACTIVATE';
            const error = 'WRITE_FAILED';

            log.sensorError(rack, operation, error);

            // Wait for async database operation
            await waitForDb();

            // Query database
            const dbLogs = await prisma.systemLog.findMany({
                where: {
                    rackId: rack,
                    plcOperation: operation,
                    status: 'error'
                },
                orderBy: { timestamp: 'desc' },
                take: 1
            });

            expect(dbLogs.length).toBe(1);
            const dbLog = dbLogs[0];

            expect(dbLog.action).toBe('SensorDeactivationFailed');
            expect(dbLog.user).toBe('System');
            expect(dbLog.status).toBe('error');
            expect(dbLog.plcOperation).toBe(operation);
            expect(dbLog.rackId).toBe(rack);
        });

        it('should maintain backward compatibility for non-PLC logs', async () => {
            const tag = 'M100';
            const address = 100;
            const value = true;

            log.write(tag, address, value);

            // Wait for async database operation
            await waitForDb();

            // Query database
            const dbLogs = await prisma.systemLog.findMany({
                where: {
                    item: tag
                },
                orderBy: { timestamp: 'desc' },
                take: 1
            });

            expect(dbLogs.length).toBe(1);
            const dbLog = dbLogs[0];

            expect(dbLog.action).toBe('ConfigChanged');
            expect(dbLog.user).toBe('System');
            expect(dbLog.item).toBe(tag);
            expect(dbLog.status).toBe('info');
            expect(dbLog.plcAddress).toBe(address);
            expect(dbLog.plcValue).toBe('true');
            // Non-PLC logs should have null for PLC-specific fields
            expect(dbLog.plcOperation).toBeNull();
            expect(dbLog.rackId).toBeNull();
        });

        it('should handle complete activation/deactivation sequence in database', async () => {
            const rack = 'S1R15';
            const sku = 'SKU-TEST-999';
            const address = 30;
            const quantity = 25;

            // Activation
            log.sensorActivate(rack, sku, address, quantity);

            // Wait a bit to ensure ordering
            await new Promise(resolve => setTimeout(resolve, 50));

            // Deactivation
            log.sensorDeactivate(rack, address);

            // Wait for async database operations
            await waitForDb();

            // Query database for both operations
            const dbLogs = await prisma.systemLog.findMany({
                where: {
                    rackId: rack,
                    plcOperation: { in: ['SENSOR_ON', 'SENSOR_OFF'] }
                },
                orderBy: { timestamp: 'asc' }
            });

            expect(dbLogs.length).toBe(2);

            // Check activation (first in time)
            const activationLog = dbLogs.find(log => log.plcOperation === 'SENSOR_ON');
            const deactivationLog = dbLogs.find(log => log.plcOperation === 'SENSOR_OFF');

            expect(activationLog).toBeDefined();
            expect(activationLog.action).toBe('SensorActivated');
            expect(activationLog.plcAddress).toBe(address);
            expect(activationLog.item).toBe(sku);

            // Check deactivation (second in time)
            expect(deactivationLog).toBeDefined();
            expect(deactivationLog.action).toBe('SensorDeactivated');
            expect(deactivationLog.plcAddress).toBe(address);
            expect(deactivationLog.item).toBe(rack); // Falls back to rack when no SKU
        });
    });
});
