/**
 * plcLogger.integration.test.js
 * Integration test to verify PLC logger database persistence in realistic scenarios
 */

const { log, clearLogs } = require('../plcLogger');
const { prisma } = require('../../db');

describe('PLC Logger - Integration Tests', () => {
    // Helper to wait for async database operations
    const waitForDb = () => new Promise(resolve => setTimeout(resolve, 500));

    beforeAll(async () => {
        // Clean up test data
        await prisma.systemLog.deleteMany({
            where: {
                OR: [
                    { item: { startsWith: 'SKU-INT-TEST' } },
                    { rackId: { in: ['S1R01', 'S1R08', 'S1R09', 'S1R10', 'S1R11', 'S1R19'] } }
                ]
            }
        });
    });

    afterAll(async () => {
        // Clean up test data
        await prisma.systemLog.deleteMany({
            where: {
                OR: [
                    { item: { startsWith: 'SKU-INT-TEST' } },
                    { rackId: { in: ['S1R01', 'S1R08', 'S1R09', 'S1R10', 'S1R11', 'S1R19'] } }
                ]
            }
        });
        await prisma.$disconnect();
    });

    beforeEach(() => {
        clearLogs();
    });

    it('should persist complete sensor activation workflow to database', async () => {
        // Simulate a complete workflow: activate -> wait -> deactivate
        const rack = 'S1R01';
        const sku = 'SKU-INT-TEST-001';
        const address = 19;
        const quantity = 50;

        // Step 1: Activation
        log.sensorActivate(rack, sku, address, quantity);
        await new Promise(resolve => setTimeout(resolve, 100));

        // Step 2: Deactivation
        log.sensorDeactivate(rack, address);

        // Wait for database operations to complete
        await waitForDb();

        // Additional wait to ensure all async operations are done
        await new Promise(resolve => setTimeout(resolve, 200));

        // Verify both operations were persisted
        const logs = await prisma.systemLog.findMany({
            where: {
                rackId: rack,
                plcOperation: { in: ['SENSOR_ON', 'SENSOR_OFF'] }
            },
            orderBy: { timestamp: 'asc' }
        });

        expect(logs.length).toBe(2);

        // Verify activation
        expect(logs[0].action).toBe('SensorActivated');
        expect(logs[0].plcOperation).toBe('SENSOR_ON');
        expect(logs[0].plcAddress).toBe(address);
        expect(logs[0].plcValue).toBe('true');
        expect(logs[0].item).toBe(sku);
        expect(logs[0].rackId).toBe(rack);

        // Verify deactivation
        expect(logs[1].action).toBe('SensorDeactivated');
        expect(logs[1].plcOperation).toBe('SENSOR_OFF');
        expect(logs[1].plcAddress).toBe(address);
        expect(logs[1].plcValue).toBe('false');
        expect(logs[1].rackId).toBe(rack);
    });

    it('should handle shared sensor scenarios (S1R08-S1R11)', async () => {
        // Shared sensors use the same address but different rack IDs
        const sharedAddress = 26;
        const racks = ['S1R08', 'S1R09', 'S1R10', 'S1R11'];
        const sku = 'SKU-INT-TEST-SHARED';

        // Activate sensors for multiple shared racks
        for (let i = 0; i < racks.length; i++) {
            log.sensorActivate(racks[i], sku, sharedAddress, 10 + i);
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Wait for database operations
        await waitForDb();

        // Additional wait to ensure all async operations are done
        await new Promise(resolve => setTimeout(resolve, 200));

        // Verify all racks were logged separately despite sharing address
        const logs = await prisma.systemLog.findMany({
            where: {
                rackId: { in: racks },
                plcOperation: 'SENSOR_ON'
            }
        });

        expect(logs.length).toBe(4);

        // Verify each rack has its own log entry
        racks.forEach(rack => {
            const rackLog = logs.find(log => log.rackId === rack);
            expect(rackLog).toBeDefined();
            expect(rackLog.plcAddress).toBe(sharedAddress);
            expect(rackLog.item).toBe(sku);
        });
    });

    it('should handle error scenarios with proper database persistence', async () => {
        const rack = 'S1R19';
        const operation = 'ACTIVATE';
        const error = 'PLC_TIMEOUT';
        const details = {
            timeout: 3000,
            port: 'COM3',
            address: 34
        };

        // Log an error
        log.sensorError(rack, operation, error, details);

        // Wait for database operation
        await waitForDb();

        // Verify error was persisted
        const logs = await prisma.systemLog.findMany({
            where: {
                rackId: rack,
                status: 'error'
            },
            orderBy: { timestamp: 'desc' },
            take: 1
        });

        expect(logs.length).toBe(1);
        expect(logs[0].action).toBe('SensorActivationFailed');
        expect(logs[0].status).toBe('error');
        expect(logs[0].plcOperation).toBe(operation);

        // Verify error details are preserved
        const errorDetails = JSON.parse(logs[0].details);
        expect(errorDetails.error).toBe(error);
        expect(errorDetails.timeout).toBe(3000);
        expect(errorDetails.port).toBe('COM3');
    });

    it('should maintain backward compatibility with non-PLC logs', async () => {
        // Log various non-PLC events
        log.connect('COM3');
        await new Promise(resolve => setTimeout(resolve, 30));

        log.info('System initialized', { component: 'PLC' });
        await new Promise(resolve => setTimeout(resolve, 30));

        log.disconnect('COM3', 'User requested');

        // Wait for database operations
        await waitForDb();

        // Verify logs were persisted but with null PLC-specific fields
        const logs = await prisma.systemLog.findMany({
            where: {
                plcOperation: null,
                rackId: null
            },
            orderBy: { timestamp: 'desc' },
            take: 3
        });

        // Should have at least the logs we just created
        expect(logs.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle rapid succession of sensor operations', async () => {
        const rack = 'S1R01';
        const sku = 'SKU-INT-TEST-RAPID';
        const address = 19;

        // Clean up existing test data for this rack to ensure test isolation
        await prisma.systemLog.deleteMany({
            where: {
                rackId: rack,
                OR: [
                    { item: { startsWith: sku } },
                    { item: rack, plcOperation: 'SENSOR_OFF' }
                ]
            }
        });

        // Simulate rapid operations (like multiple quick assignments)
        for (let i = 0; i < 5; i++) {
            log.sensorActivate(rack, `${sku}-${i}`, address, 10 * i);
            await new Promise(resolve => setTimeout(resolve, 10));
            log.sensorDeactivate(rack, address);
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        // Wait for all database operations
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify all operations were persisted
        const logs = await prisma.systemLog.findMany({
            where: {
                rackId: rack,
                plcOperation: { in: ['SENSOR_ON', 'SENSOR_OFF'] },
                OR: [
                    { item: { startsWith: sku } }, // Activations have SKU
                    { item: rack, plcOperation: 'SENSOR_OFF' } // Deactivations have rack as item
                ]
            }
        });

        // Should have 5 activations + 5 deactivations = 10 total
        expect(logs.length).toBe(10);

        // Verify equal number of activations and deactivations
        const activations = logs.filter(log => log.plcOperation === 'SENSOR_ON');
        const deactivations = logs.filter(log => log.plcOperation === 'SENSOR_OFF');

        expect(activations.length).toBe(5);
        expect(deactivations.length).toBe(5);

        // Verify activations have SKU in item field
        activations.forEach(log => {
            expect(log.item).toMatch(new RegExp(`^${sku}-\\d+$`));
        });
    });
});
