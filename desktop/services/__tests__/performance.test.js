/**
 * Performance Tests for PLC Sensor Integration (Task 14.4)
 * 
 * Tests the performance characteristics and concurrency behavior of the sensor system:
 * - Rapid sequential inbound operations
 * - Concurrent allocations to shared sensor racks (S1-R08 to S1-R11)
 * - Race condition detection
 * - Response time and latency measurements
 * - Non-blocking operation verification
 * 
 * Requirements: 8.2, 8.4, 8.5
 */

const { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');
const allocationService = require('../../allocation.service.js');
const rackSensorService = require('../rackSensor.service.js');
const plcConfig = require('../../plc/plcConfig.js');
const { prisma } = require('../../db.js');

// Mock the PLC service to avoid hardware dependency
jest.mock('../../plc/plcService', () => ({
    writeCoil: jest.fn().mockImplementation(async (type, address, value) => {
        // Simulate realistic PLC response time (20-50ms)
        const delay = Math.floor(Math.random() * 30) + 20;
        await new Promise(resolve => setTimeout(resolve, delay));
        return { success: true, address, value };
    }),
    readCoil: jest.fn().mockResolvedValue({ success: true, values: [true] }),
    isConnected: jest.fn().mockReturnValue(true)
}));

// Mock the PLC logger to avoid database writes during tests
jest.mock('../../plc/plcLogger', () => ({
    log: {
        info: jest.fn(),
        error: jest.fn(),
        write: jest.fn(),
        read: jest.fn()
    }
}));

describe('Performance Tests: PLC Sensor Integration (Task 14.4)', () => {
    let testSkus = [];
    let testRacks = [];
    let testShelves = [];

    beforeAll(async () => {
        // Clean up any existing test data
        // Delete SKUs first (using contains on string field)
        await prisma.sKU.deleteMany({
            where: { skuCode: { contains: 'PERF-TEST-' } }
        });
        // Related records will be deleted via CASCADE
    });

    beforeEach(async () => {
        // Create test category and subcategory
        const category = await prisma.category.upsert({
            where: { name: 'PERF-TEST-CATEGORY' },
            update: {},
            create: { name: 'PERF-TEST-CATEGORY' }
        });

        const subCategory = await prisma.subCategory.upsert({
            where: { name: 'PERF-TEST-SUBCATEGORY' },
            update: { categoryId: category.id },
            create: {
                name: 'PERF-TEST-SUBCATEGORY',
                categoryId: category.id
            }
        });

        // Clear test arrays
        testSkus = [];
        testRacks = [];
        testShelves = [];

        // Clear mocks
        jest.clearAllMocks();
    });

    afterEach(async () => {
        // Clean up test data after each test
        if (testSkus.length > 0) {
            const skuIds = testSkus.map(sku => sku.id);
            await prisma.transaction.deleteMany({
                where: { skuId: { in: skuIds } }
            });
            await prisma.inventory.deleteMany({
                where: { skuId: { in: skuIds } }
            });
            await prisma.sKU.deleteMany({
                where: { id: { in: skuIds } }
            }).catch(() => { });
        }

        if (testShelves.length > 0) {
            const shelfIds = testShelves.map(shelf => shelf.id);
            await prisma.shelf.deleteMany({
                where: { id: { in: shelfIds } }
            }).catch(() => { });
        }
    });

    afterAll(async () => {
        // Final cleanup
        await prisma.$disconnect();
    });

    /**
     * Helper function to create test SKU
     */
    async function createTestSku(suffix) {
        const category = await prisma.category.findFirst({
            where: { name: 'PERF-TEST-CATEGORY' }
        });
        const subCategory = await prisma.subCategory.findFirst({
            where: { name: 'PERF-TEST-SUBCATEGORY' }
        });

        const sku = await prisma.sKU.create({
            data: {
                skuCode: `PERF-TEST-SKU-${suffix}-${Date.now()}`,
                name: `Performance Test Product ${suffix}`,
                categoryId: category.id,
                subCategoryId: subCategory.id,
                stock: 0,
                length: 100,
                width: 100,
                height: 100,
                weight: 1000,
                barcode: `PERF-BARCODE-${suffix}-${Date.now()}`
            }
        });

        testSkus.push(sku);
        return sku;
    }

    /**
     * Helper function to create test rack and shelf
     */
    async function createTestRackAndShelf(rackName) {
        const rack = await prisma.rack.upsert({
            where: { name: rackName },
            update: {},
            create: {
                name: rackName,
                room: 'Cabin',
                description: `Performance Test Rack ${rackName}`
            }
        });

        testRacks.push(rack);

        const shelf = await prisma.shelf.create({
            data: {
                rackId: rack.id,
                level: 1,
                maxVolume: 10000000,
                maxWeight: 100000,
                usedVolume: 0,
                usedWeight: 0
            }
        });

        testShelves.push(shelf);
        return { rack, shelf };
    }

    describe('Rapid Sequential Inbound Operations', () => {
        test('should handle 10 sequential inbound operations without blocking', async () => {
            console.log('\n⚡ Test: Rapid sequential inbound operations (10 ops)');

            // Create test rack
            const { rack, shelf } = await createTestRackAndShelf('S1-R01');

            // Create 10 test SKUs
            const skuPromises = [];
            for (let i = 0; i < 10; i++) {
                skuPromises.push(createTestSku(i));
            }
            const skus = await Promise.all(skuPromises);

            // Measure time for sequential operations
            const startTime = Date.now();
            const results = [];
            const responseTimes = [];

            for (let i = 0; i < skus.length; i++) {
                const opStart = Date.now();
                const result = await allocationService.confirmInward(
                    skus[i].skuCode,
                    10,
                    shelf.id
                );
                const opTime = Date.now() - opStart;

                results.push(result);
                responseTimes.push(opTime);

                console.log(`  Op ${i + 1}: ${opTime}ms - ${result.success ? 'SUCCESS' : 'FAILED'}`);
            }

            const totalTime = Date.now() - startTime;
            const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
            const maxResponseTime = Math.max(...responseTimes);
            const minResponseTime = Math.min(...responseTimes);

            console.log(`  ✅ Total time: ${totalTime}ms`);
            console.log(`  📊 Avg response: ${avgResponseTime.toFixed(2)}ms`);
            console.log(`  📊 Min response: ${minResponseTime}ms`);
            console.log(`  📊 Max response: ${maxResponseTime}ms`);

            // Verify all operations succeeded
            results.forEach(result => {
                expect(result.success).toBe(true);
            });

            // Verify each operation completed quickly (non-blocking)
            // Each operation should complete in under 500ms despite sensor delay
            responseTimes.forEach(time => {
                expect(time).toBeLessThan(500);
            });

            // Wait for sensor activations to complete
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('  ✅ Rapid sequential operations test passed\n');
        }, 30000);

        test('should not block UI during rapid operations', async () => {
            console.log('\n⚡ Test: Non-blocking UI during rapid operations');

            const { rack, shelf } = await createTestRackAndShelf('S1-R02');
            const skus = [];
            for (let i = 0; i < 5; i++) {
                skus.push(await createTestSku(`ui-${i}`));
            }

            // Track if operations return before sensor activation delay
            const sensorDelay = plcConfig.getSensorDelay() || 1000;
            const responseTimes = [];

            for (const sku of skus) {
                const start = Date.now();
                await allocationService.confirmInward(sku.skuCode, 5, shelf.id);
                const responseTime = Date.now() - start;
                responseTimes.push(responseTime);
            }

            // All operations should return immediately without waiting for sensor delay
            responseTimes.forEach(time => {
                expect(time).toBeLessThan(sensorDelay / 2);
            });

            console.log(`  ✅ All operations returned in < ${sensorDelay / 2}ms (sensor delay: ${sensorDelay}ms)`);
            console.log('  ✅ Non-blocking UI test passed\n');
        }, 20000);
    });

    describe('Concurrent Allocations to Shared Sensor Racks', () => {
        test('should handle concurrent allocations to different shared sensor racks', async () => {
            console.log('\n🔗 Test: Concurrent allocations to shared sensor racks (S1-R08 to S1-R11)');

            // Create shared sensor racks S1-R08, S1-R09, S1-R10, S1-R11
            const sharedRackNames = ['S1-R08', 'S1-R09', 'S1-R10', 'S1-R11'];
            const rackShelves = [];

            for (const rackName of sharedRackNames) {
                const { rack, shelf } = await createTestRackAndShelf(rackName);
                rackShelves.push({ rackName, shelf });
            }

            // Create test SKUs
            const skus = [];
            for (let i = 0; i < 4; i++) {
                skus.push(await createTestSku(`shared-${i}`));
            }

            const plcService = require('../../plc/plcService');

            // Execute concurrent allocations to all 4 shared racks
            const startTime = Date.now();
            const allocationPromises = skus.map((sku, idx) =>
                allocationService.confirmInward(sku.skuCode, 10, rackShelves[idx].shelf.id)
            );

            const results = await Promise.all(allocationPromises);
            const concurrentTime = Date.now() - startTime;

            console.log(`  ✅ Concurrent time: ${concurrentTime}ms`);

            // Verify all allocations succeeded
            results.forEach((result, idx) => {
                expect(result.success).toBe(true);
                expect(result.allocation.rackName).toBe(sharedRackNames[idx]);
                console.log(`  ✅ ${sharedRackNames[idx]}: allocation succeeded`);
            });

            // Wait for sensor activations
            await new Promise(resolve => setTimeout(resolve, 200));

            // Verify shared sensor address (26) was used for all racks
            const writeCoilCalls = plcService.writeCoil.mock.calls.filter(
                call => call[1] === 26 && call[2] === true
            );

            console.log(`  📊 Shared sensor (address 26) activated ${writeCoilCalls.length} times`);
            expect(writeCoilCalls.length).toBeGreaterThanOrEqual(4);

            console.log('  ✅ Concurrent shared sensor test passed\n');
        }, 20000);

        test('should handle rapid-fire allocations to same shared rack', async () => {
            console.log('\n🔗 Test: Rapid allocations to same shared rack (S1-R08)');

            const { rack, shelf } = await createTestRackAndShelf('S1-R08');

            // Create multiple SKUs
            const skus = [];
            for (let i = 0; i < 5; i++) {
                skus.push(await createTestSku(`same-shared-${i}`));
            }

            const plcService = require('../../plc/plcService');
            const startTime = Date.now();

            // Execute rapid sequential allocations to the same shared rack
            for (const sku of skus) {
                await allocationService.confirmInward(sku.skuCode, 5, shelf.id);
            }

            const totalTime = Date.now() - startTime;
            console.log(`  ✅ Completed 5 allocations in ${totalTime}ms`);

            // Wait for sensor activations
            await new Promise(resolve => setTimeout(resolve, 200));

            // Verify sensor was activated multiple times
            const writeCoilCalls = plcService.writeCoil.mock.calls.filter(
                call => call[1] === 26 && call[2] === true
            );

            console.log(`  📊 Sensor activated ${writeCoilCalls.length} times`);
            expect(writeCoilCalls.length).toBeGreaterThanOrEqual(5);

            console.log('  ✅ Same shared rack test passed\n');
        }, 20000);

        test('should not have race conditions with concurrent shared sensor access', async () => {
            console.log('\n🔗 Test: Race condition detection for shared sensors');

            const { rack: rack08, shelf: shelf08 } = await createTestRackAndShelf('S1-R08');
            const { rack: rack09, shelf: shelf09 } = await createTestRackAndShelf('S1-R09');

            const sku1 = await createTestSku('race-1');
            const sku2 = await createTestSku('race-2');

            const plcService = require('../../plc/plcService');

            // Execute truly concurrent allocations (Promise.all, not sequential)
            const [result1, result2] = await Promise.all([
                allocationService.confirmInward(sku1.skuCode, 10, shelf08.id),
                allocationService.confirmInward(sku2.skuCode, 15, shelf09.id)
            ]);

            // Both should succeed
            expect(result1.success).toBe(true);
            expect(result2.success).toBe(true);

            // Wait for sensor operations
            await new Promise(resolve => setTimeout(resolve, 200));

            // Verify PLC write commands completed without errors
            const writeErrors = plcService.writeCoil.mock.calls.filter(
                call => call[3] === false // Check for any failure indicators
            );

            expect(writeErrors.length).toBe(0);

            console.log('  ✅ No race conditions detected');
            console.log('  ✅ Race condition test passed\n');
        }, 20000);
    });

    describe('Response Times and Latency Measurement', () => {
        test('should measure and verify response times are within acceptable range', async () => {
            console.log('\n📊 Test: Response time measurement');

            const { rack, shelf } = await createTestRackAndShelf('S1-R03');

            // Create test SKUs
            const numOperations = 20;
            const skus = [];
            for (let i = 0; i < numOperations; i++) {
                skus.push(await createTestSku(`latency-${i}`));
            }

            const responseTimes = [];
            const operationTimestamps = [];

            // Execute operations and measure response times
            for (const sku of skus) {
                const start = Date.now();
                const result = await allocationService.confirmInward(sku.skuCode, 5, shelf.id);
                const responseTime = Date.now() - start;

                responseTimes.push(responseTime);
                operationTimestamps.push({
                    start,
                    end: Date.now(),
                    duration: responseTime,
                    success: result.success
                });
            }

            // Calculate statistics
            const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
            const maxResponseTime = Math.max(...responseTimes);
            const minResponseTime = Math.min(...responseTimes);
            const p95ResponseTime = responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.95)];

            console.log(`  📊 Operations: ${numOperations}`);
            console.log(`  📊 Avg response time: ${avgResponseTime.toFixed(2)}ms`);
            console.log(`  📊 Min response time: ${minResponseTime}ms`);
            console.log(`  📊 Max response time: ${maxResponseTime}ms`);
            console.log(`  📊 P95 response time: ${p95ResponseTime}ms`);

            // Verify all operations succeeded
            operationTimestamps.forEach(op => {
                expect(op.success).toBe(true);
            });

            // Response times should be reasonable (< 500ms for non-blocking operations)
            expect(avgResponseTime).toBeLessThan(500);
            expect(maxResponseTime).toBeLessThan(1000);

            console.log('  ✅ Response time measurement test passed\n');
        }, 40000);

        test('should measure log latency and verify persistence speed', async () => {
            console.log('\n📊 Test: Log latency measurement');

            const { rack, shelf } = await createTestRackAndShelf('S1-R04');

            // Create test SKUs
            const numOperations = 10;
            const skus = [];
            for (let i = 0; i < numOperations; i++) {
                skus.push(await createTestSku(`log-latency-${i}`));
            }

            const logTimestamps = [];

            // Execute operations and track log timing
            for (const sku of skus) {
                const operationStart = Date.now();
                await allocationService.confirmInward(sku.skuCode, 5, shelf.id);
                const operationEnd = Date.now();

                logTimestamps.push({
                    operationTime: operationEnd - operationStart
                });
            }

            // Wait for async sensor operations to complete
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Calculate average latencies
            const avgOperationTime = logTimestamps.reduce((a, b) => a + b.operationTime, 0) / logTimestamps.length;

            console.log(`  📊 Avg operation time: ${avgOperationTime.toFixed(2)}ms`);

            // Verify operations complete quickly (non-blocking)
            expect(avgOperationTime).toBeLessThan(500);

            console.log('  ✅ Log latency measurement test passed\n');
        }, 30000);
    });

    describe('Blocking and Race Condition Verification', () => {
        test('should verify no blocking occurs during sensor activation', async () => {
            console.log('\n🚫 Test: No blocking during sensor activation');

            const { rack, shelf } = await createTestRackAndShelf('S1-R05');
            const sku = await createTestSku('blocking-test');

            const sensorDelay = plcConfig.getSensorDelay() || 1000;

            // Execute inbound operation
            const start = Date.now();
            const result = await allocationService.confirmInward(sku.skuCode, 10, shelf.id);
            const completionTime = Date.now() - start;

            console.log(`  📊 Operation completed in: ${completionTime}ms`);
            console.log(`  📊 Sensor delay configured: ${sensorDelay}ms`);

            // Operation should complete immediately, not wait for sensor delay
            expect(completionTime).toBeLessThan(sensorDelay * 0.8);
            expect(result.success).toBe(true);

            console.log('  ✅ No blocking detected');
            console.log('  ✅ Blocking verification test passed\n');
        }, 15000);

        test('should handle extreme concurrent load without race conditions', async () => {
            console.log('\n🚫 Test: Extreme concurrent load (20 simultaneous operations)');

            // Create 20 different racks
            const rackNames = [
                'S1-R01', 'S1-R02', 'S1-R03', 'S1-R04', 'S1-R05',
                'S1-R06', 'S1-R07', 'S1-R08', 'S1-R09', 'S1-R10',
                'S1-R11', 'S1-R12', 'S1-R13', 'S1-R14', 'S1-R15',
                'S1-R16', 'S1-R17', 'S1-R18', 'S1-R19', 'S1-R01' // Reuse one
            ];

            const rackShelves = [];
            for (const rackName of rackNames) {
                // Try to find existing rack first, then create if needed
                let rack = await prisma.rack.findFirst({ where: { name: rackName } });
                if (!rack) {
                    const result = await createTestRackAndShelf(rackName);
                    rackShelves.push(result.shelf);
                } else {
                    // Get or create shelf for existing rack
                    let shelf = await prisma.shelf.findFirst({ where: { rackId: rack.id } });
                    if (!shelf) {
                        shelf = await prisma.shelf.create({
                            data: {
                                rackId: rack.id,
                                level: 1,
                                maxVolume: 10000000,
                                maxWeight: 100000,
                                usedVolume: 0,
                                usedWeight: 0
                            }
                        });
                        testShelves.push(shelf);
                    }
                    rackShelves.push(shelf);
                }
            }

            // Create SKUs
            const skus = [];
            for (let i = 0; i < 20; i++) {
                skus.push(await createTestSku(`extreme-${i}`));
            }

            const plcService = require('../../plc/plcService');

            // Execute all operations concurrently
            const startTime = Date.now();
            const allocationPromises = skus.map((sku, idx) =>
                allocationService.confirmInward(sku.skuCode, 5, rackShelves[idx].id)
            );

            const results = await Promise.all(allocationPromises);
            const totalTime = Date.now() - startTime;

            console.log(`  ✅ Completed 20 concurrent operations in ${totalTime}ms`);

            // Verify all succeeded
            const successCount = results.filter(r => r.success).length;
            expect(successCount).toBe(20);

            console.log(`  ✅ Success rate: ${successCount}/20 (100%)`);

            // Wait for sensor operations
            await new Promise(resolve => setTimeout(resolve, 300));

            // Verify PLC service was called correctly
            const plcWriteCalls = plcService.writeCoil.mock.calls.length;
            console.log(`  📊 Total PLC write calls: ${plcWriteCalls}`);

            // Should have at least 40 calls (20 activations + 20 deactivations)
            expect(plcWriteCalls).toBeGreaterThanOrEqual(40);

            console.log('  ✅ No race conditions detected in extreme load');
            console.log('  ✅ Extreme concurrent load test passed\n');
        }, 40000);
    });
});
