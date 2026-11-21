/**
 * Integration Tests for Allocation-Sensor Integration (Task 7.3)
 * 
 * Tests the end-to-end integration between the allocation service and rack sensor service:
 * - End-to-end inbound flow with sensor activation
 * - Inventory transaction succeeds on sensor failure
 * - Sensor activation with shared racks (S1-R08 to S1-R11)
 * - Multiple sequential inbound operations
 * 
 * Requirements: 2.1, 7.1, 8.1, 8.2, 8.6
 */

const { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');
const allocationService = require('../../allocation.service.js');
const rackSensorService = require('../rackSensor.service.js');
const { prisma } = require('../../db.js');

// Mock the PLC service to avoid hardware dependency
jest.mock('../../plc/plcService', () => ({
    writeCoil: jest.fn().mockResolvedValue({ success: true }),
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

describe('Allocation-Sensor Integration Tests (Task 7.3)', () => {
    let testSku;
    let testShelf;
    let testRack;

    beforeAll(async () => {
        // Clean up any existing test data
        await prisma.transaction.deleteMany({
            where: { skuId: { contains: 'TEST-' } }
        });
        await prisma.inventory.deleteMany({
            where: { sku: { skuCode: { contains: 'TEST-' } } }
        });
        await prisma.sKU.deleteMany({
            where: { skuCode: { contains: 'TEST-' } }
        });
    });

    beforeEach(async () => {
        // Create test category and subcategory
        const category = await prisma.category.upsert({
            where: { name: 'TEST-CATEGORY' },
            update: {},
            create: { name: 'TEST-CATEGORY' }
        });

        const subCategory = await prisma.subCategory.upsert({
            where: { name: 'TEST-SUBCATEGORY' },
            update: { categoryId: category.id },
            create: {
                name: 'TEST-SUBCATEGORY',
                categoryId: category.id
            }
        });

        // Create test SKU
        testSku = await prisma.sKU.create({
            data: {
                skuCode: `TEST-SKU-${Date.now()}`,
                name: 'Test Product for Sensor Integration',
                categoryId: category.id,
                subCategoryId: subCategory.id,
                stock: 0,
                length: 100,
                width: 100,
                height: 100,
                weight: 1000,
                barcode: `TEST-BARCODE-${Date.now()}`
            }
        });

        // Find or create test rack (S1-R01)
        testRack = await prisma.rack.upsert({
            where: { name: 'S1-R01' },
            update: {},
            create: {
                name: 'S1-R01',
                room: 'Cabin',
                description: 'Test Rack 1'
            }
        });

        // Create test shelf on the rack
        testShelf = await prisma.shelf.create({
            data: {
                rackId: testRack.id,
                level: 1,
                maxVolume: 10000000,
                maxWeight: 100000,
                usedVolume: 0,
                usedWeight: 0
            }
        });

        // Clear any mocks from previous tests
        jest.clearAllMocks();
    });

    afterEach(async () => {
        // Clean up test data after each test
        if (testSku) {
            await prisma.transaction.deleteMany({
                where: { skuId: testSku.id }
            });
            await prisma.inventory.deleteMany({
                where: { skuId: testSku.id }
            });
            await prisma.sKU.delete({
                where: { id: testSku.id }
            }).catch(() => { });
        }

        if (testShelf) {
            await prisma.shelf.delete({
                where: { id: testShelf.id }
            }).catch(() => { });
        }
    });

    afterAll(async () => {
        // Final cleanup
        await prisma.$disconnect();
    });

    describe('End-to-End Inbound Flow with Sensor Activation', () => {
        test('should complete inbound operation and trigger sensor activation', async () => {
            const plcService = require('../../plc/plcService');

            // Execute inbound operation
            const result = await allocationService.confirmInward(
                testSku.skuCode,
                10,
                testShelf.id
            );

            // Verify inventory transaction succeeded
            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.allocation).toBeDefined();
            expect(result.allocation.rackName).toBe('S1-R01');

            // Verify inventory was updated
            const inventory = await prisma.inventory.findFirst({
                where: { skuId: testSku.id, shelfId: testShelf.id }
            });
            expect(inventory).toBeDefined();
            expect(inventory.quantity).toBe(10);

            // Verify SKU stock was updated
            const updatedSku = await prisma.sKU.findUnique({
                where: { id: testSku.id }
            });
            expect(updatedSku.stock).toBe(10);

            // Verify transaction record was created
            const transaction = await prisma.transaction.findFirst({
                where: { skuId: testSku.id, type: 'INWARD' }
            });
            expect(transaction).toBeDefined();
            expect(transaction.quantity).toBe(10);
            expect(transaction.status).toBe('success');

            // Wait a bit for sensor activation to be triggered (fire-and-forget)
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify PLC write command was called for sensor activation
            // Note: Due to fire-and-forget, this happens asynchronously
            // We can't guarantee timing, but the mock should have been called
            expect(plcService.writeCoil).toHaveBeenCalled();
        }, 10000);

        test('should activate sensor for the correct rack', async () => {
            const plcService = require('../../plc/plcService');

            // Execute inbound operation
            await allocationService.confirmInward(
                testSku.skuCode,
                5,
                testShelf.id
            );

            // Wait for sensor activation
            await new Promise(resolve => setTimeout(resolve, 100));

            // S1-R01 should map to write address 19
            const mapping = rackSensorService.getSensorMapping('S1-R01');
            expect(mapping).toBeDefined();
            expect(mapping.writeAddress).toBe(19);

            // Verify writeCoil was called with correct address
            expect(plcService.writeCoil).toHaveBeenCalledWith('M', 19, true);
        }, 10000);
    });

    describe('Inventory Transaction Succeeds on Sensor Failure', () => {
        test('should complete inventory transaction even when sensor activation fails', async () => {
            const plcService = require('../../plc/plcService');

            // Mock PLC failure
            plcService.writeCoil.mockRejectedValueOnce(new Error('PLC connection lost'));

            // Execute inbound operation
            const result = await allocationService.confirmInward(
                testSku.skuCode,
                10,
                testShelf.id
            );

            // Verify inventory transaction STILL succeeded despite sensor failure
            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();

            // Verify inventory was updated
            const inventory = await prisma.inventory.findFirst({
                where: { skuId: testSku.id, shelfId: testShelf.id }
            });
            expect(inventory).toBeDefined();
            expect(inventory.quantity).toBe(10);

            // Verify SKU stock was updated
            const updatedSku = await prisma.sKU.findUnique({
                where: { id: testSku.id }
            });
            expect(updatedSku.stock).toBe(10);

            // Verify transaction record was created with success status
            const transaction = await prisma.transaction.findFirst({
                where: { skuId: testSku.id, type: 'INWARD' }
            });
            expect(transaction).toBeDefined();
            expect(transaction.status).toBe('success');
        }, 10000);

        test('should not throw error when sensor service fails', async () => {
            // Mock activateRackSensor to fail
            const originalActivate = rackSensorService.activateRackSensor;
            rackSensorService.activateRackSensor = jest.fn().mockRejectedValue(
                new Error('Sensor activation failed')
            );

            // Execute inbound operation - should NOT throw
            await expect(
                allocationService.confirmInward(testSku.skuCode, 5, testShelf.id)
            ).resolves.toBeDefined();

            // Restore original function
            rackSensorService.activateRackSensor = originalActivate;
        }, 10000);
    });

    describe('Sensor Activation with Shared Racks (S1-R08 to S1-R11)', () => {
        let sharedRacks;
        let sharedShelves;

        beforeEach(async () => {
            // Create shared racks S1-R08, S1-R09, S1-R10, S1-R11
            sharedRacks = [];
            sharedShelves = [];

            for (const rackNum of ['08', '09', '10', '11']) {
                const rack = await prisma.rack.upsert({
                    where: { name: `S1-R${rackNum}` },
                    update: {},
                    create: {
                        name: `S1-R${rackNum}`,
                        room: 'Cabin',
                        description: `Test Shared Rack ${rackNum}`
                    }
                });
                sharedRacks.push(rack);

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
                sharedShelves.push(shelf);
            }
        });

        afterEach(async () => {
            // Clean up shared shelves and racks
            for (const shelf of sharedShelves) {
                await prisma.shelf.delete({
                    where: { id: shelf.id }
                }).catch(() => { });
            }
            sharedShelves = [];
            sharedRacks = [];
        });

        test('should activate sensor for shared rack S1-R08', async () => {
            const plcService = require('../../plc/plcService');

            await allocationService.confirmInward(
                testSku.skuCode,
                5,
                sharedShelves[0].id // S1-R08
            );

            await new Promise(resolve => setTimeout(resolve, 100));

            // All shared racks map to write address 26
            const mapping = rackSensorService.getSensorMapping('S1-R08');
            expect(mapping).toBeDefined();
            expect(mapping.writeAddress).toBe(26);
            expect(mapping.shared).toBe(true);

            // Verify writeCoil was called with shared address
            expect(plcService.writeCoil).toHaveBeenCalledWith('M', 26, true);
        }, 10000);

        test('should activate sensor for shared rack S1-R11', async () => {
            const plcService = require('../../plc/plcService');

            await allocationService.confirmInward(
                testSku.skuCode,
                5,
                sharedShelves[3].id // S1-R11
            );

            await new Promise(resolve => setTimeout(resolve, 100));

            // All shared racks map to write address 26
            const mapping = rackSensorService.getSensorMapping('S1-R11');
            expect(mapping).toBeDefined();
            expect(mapping.writeAddress).toBe(26);
            expect(mapping.shared).toBe(true);

            // Verify writeCoil was called with shared address
            expect(plcService.writeCoil).toHaveBeenCalledWith('M', 26, true);
        }, 10000);

        test('should handle multiple shared racks correctly', async () => {
            // Verify all shared racks have the same sensor mapping
            const mappings = ['S1-R08', 'S1-R09', 'S1-R10', 'S1-R11'].map(
                rack => rackSensorService.getSensorMapping(rack)
            );

            // All should have writeAddress 26
            mappings.forEach(mapping => {
                expect(mapping.writeAddress).toBe(26);
                expect(mapping.readAddress).toBe(7);
                expect(mapping.sensor).toBe(8);
                expect(mapping.shared).toBe(true);
            });
        }, 10000);
    });

    describe('Multiple Sequential Inbound Operations', () => {
        test('should handle multiple sequential inbound operations correctly', async () => {
            const plcService = require('../../plc/plcService');

            // Create additional test shelves
            const shelf2 = await prisma.shelf.create({
                data: {
                    rackId: testRack.id,
                    level: 2,
                    maxVolume: 10000000,
                    maxWeight: 100000,
                    usedVolume: 0,
                    usedWeight: 0
                }
            });

            const shelf3 = await prisma.shelf.create({
                data: {
                    rackId: testRack.id,
                    level: 3,
                    maxVolume: 10000000,
                    maxWeight: 100000,
                    usedVolume: 0,
                    usedWeight: 0
                }
            });

            // Create additional test SKUs
            const category = await prisma.category.findFirst({
                where: { name: 'TEST-CATEGORY' }
            });
            const subCategory = await prisma.subCategory.findFirst({
                where: { name: 'TEST-SUBCATEGORY' }
            });

            const sku2 = await prisma.sKU.create({
                data: {
                    skuCode: `TEST-SKU2-${Date.now()}`,
                    name: 'Test Product 2',
                    categoryId: category.id,
                    subCategoryId: subCategory.id,
                    stock: 0,
                    length: 100,
                    width: 100,
                    height: 100,
                    weight: 1000,
                    barcode: `TEST-BARCODE2-${Date.now()}`
                }
            });

            const sku3 = await prisma.sKU.create({
                data: {
                    skuCode: `TEST-SKU3-${Date.now()}`,
                    name: 'Test Product 3',
                    categoryId: category.id,
                    subCategoryId: subCategory.id,
                    stock: 0,
                    length: 100,
                    width: 100,
                    height: 100,
                    weight: 1000,
                    barcode: `TEST-BARCODE3-${Date.now()}`
                }
            });

            try {
                // Execute multiple sequential inbound operations
                const result1 = await allocationService.confirmInward(sku2.skuCode, 10, shelf2.id);
                const result2 = await allocationService.confirmInward(sku3.skuCode, 15, shelf3.id);
                const result3 = await allocationService.confirmInward(testSku.skuCode, 20, testShelf.id);

                // All should succeed
                expect(result1.success).toBe(true);
                expect(result2.success).toBe(true);
                expect(result3.success).toBe(true);

                // Wait for sensor activations
                await new Promise(resolve => setTimeout(resolve, 200));

                // Verify PLC was called multiple times
                expect(plcService.writeCoil).toHaveBeenCalledTimes(3);

                // Verify all inventory records were created
                const inv1 = await prisma.inventory.findFirst({
                    where: { skuId: sku2.id, shelfId: shelf2.id }
                });
                const inv2 = await prisma.inventory.findFirst({
                    where: { skuId: sku3.id, shelfId: shelf3.id }
                });
                const inv3 = await prisma.inventory.findFirst({
                    where: { skuId: testSku.id, shelfId: testShelf.id }
                });

                expect(inv1.quantity).toBe(10);
                expect(inv2.quantity).toBe(15);
                expect(inv3.quantity).toBe(20);
            } finally {
                // Clean up
                await prisma.inventory.deleteMany({
                    where: { skuId: { in: [sku2.id, sku3.id] } }
                });
                await prisma.transaction.deleteMany({
                    where: { skuId: { in: [sku2.id, sku3.id] } }
                });
                await prisma.sKU.deleteMany({
                    where: { id: { in: [sku2.id, sku3.id] } }
                });
                await prisma.shelf.deleteMany({
                    where: { id: { in: [shelf2.id, shelf3.id] } }
                });
            }
        }, 15000);
    });

    describe('Fire-and-Forget Behavior', () => {
        test('should return immediately without waiting for sensor activation', async () => {
            const startTime = Date.now();

            // Execute inbound operation
            const result = await allocationService.confirmInward(
                testSku.skuCode,
                10,
                testShelf.id
            );

            const elapsedTime = Date.now() - startTime;

            // Should return quickly (under 500ms) even though sensor activation
            // includes a delay (default 1000ms)
            expect(elapsedTime).toBeLessThan(500);
            expect(result.success).toBe(true);
        }, 10000);

        test('should not block on sensor activation delay', async () => {
            // This test verifies that the allocation service doesn't wait
            // for the sensor activation sequence to complete

            const startTime = Date.now();

            await allocationService.confirmInward(
                testSku.skuCode,
                5,
                testShelf.id
            );

            const elapsedTime = Date.now() - startTime;

            // Should be much less than the default sensor delay (1000ms)
            expect(elapsedTime).toBeLessThan(500);
        }, 10000);
    });
});
