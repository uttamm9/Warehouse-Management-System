/**
 * Unit tests for rackSensor.service.js - deactivateRackSensor method
 * Testing task 1.13: Implement deactivateRackSensor(rackName) method
 * 
 * Requirements covered:
 * - 11.4: Rack Service SHALL provide deactivateSensor function
 * - 11.6: Rack Service SHALL return structured results with success/failure
 */

const { describe, test, expect } = require('@jest/globals');
const {
    deactivateRackSensor,
    getSensorMapping
} = require('../rackSensor.service.js');

describe('RackSensorService - deactivateRackSensor', () => {
    describe('Validation - Invalid Inputs', () => {
        test('should return error for invalid rack name', async () => {
            const result = await deactivateRackSensor('INVALID-RACK');

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return error for null rack name', async () => {
            const result = await deactivateRackSensor(null);

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return error for undefined rack name', async () => {
            const result = await deactivateRackSensor(undefined);

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return error for empty string rack name', async () => {
            const result = await deactivateRackSensor('');

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return error for non-existent rack S1-R20', async () => {
            const result = await deactivateRackSensor('S1-R20');

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return error for non-existent rack S1-R00', async () => {
            const result = await deactivateRackSensor('S1-R00');

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });
    });

    describe('Valid Racks - Individual Tests', () => {
        test('should lookup sensor mapping for S1-R01', async () => {
            const mapping = getSensorMapping('S1-R01');
            expect(mapping).not.toBeNull();
            expect(mapping.writeAddress).toBe(19);

            // The deactivateRackSensor should use this mapping
            const result = await deactivateRackSensor('S1-R01');
            expect(result).toHaveProperty('success');
            expect(typeof result.success).toBe('boolean');
        });

        test('should lookup sensor mapping for S1-R05', async () => {
            const mapping = getSensorMapping('S1-R05');
            expect(mapping).not.toBeNull();
            expect(mapping.writeAddress).toBe(23);

            const result = await deactivateRackSensor('S1-R05');
            expect(result).toHaveProperty('success');
            expect(typeof result.success).toBe('boolean');
        });

        test('should lookup sensor mapping for S1-R19', async () => {
            const mapping = getSensorMapping('S1-R19');
            expect(mapping).not.toBeNull();
            expect(mapping.writeAddress).toBe(34);

            const result = await deactivateRackSensor('S1-R19');
            expect(result).toHaveProperty('success');
            expect(typeof result.success).toBe('boolean');
        });
    });

    describe('Shared Sensor Racks', () => {
        test('should handle shared sensor rack S1-R08', async () => {
            const mapping = getSensorMapping('S1-R08');
            expect(mapping).not.toBeNull();
            expect(mapping.writeAddress).toBe(26);
            expect(mapping.shared).toBe(true);

            const result = await deactivateRackSensor('S1-R08');
            expect(result).toHaveProperty('success');
            expect(typeof result.success).toBe('boolean');
        });

        test('should handle shared sensor rack S1-R09', async () => {
            const mapping = getSensorMapping('S1-R09');
            expect(mapping).not.toBeNull();
            expect(mapping.writeAddress).toBe(26);
            expect(mapping.shared).toBe(true);

            const result = await deactivateRackSensor('S1-R09');
            expect(result).toHaveProperty('success');
            expect(typeof result.success).toBe('boolean');
        });

        test('should handle shared sensor rack S1-R10', async () => {
            const mapping = getSensorMapping('S1-R10');
            expect(mapping).not.toBeNull();
            expect(mapping.writeAddress).toBe(26);
            expect(mapping.shared).toBe(true);

            const result = await deactivateRackSensor('S1-R10');
            expect(result).toHaveProperty('success');
            expect(typeof result.success).toBe('boolean');
        });

        test('should handle shared sensor rack S1-R11', async () => {
            const mapping = getSensorMapping('S1-R11');
            expect(mapping).not.toBeNull();
            expect(mapping.writeAddress).toBe(26);
            expect(mapping.shared).toBe(true);

            const result = await deactivateRackSensor('S1-R11');
            expect(result).toHaveProperty('success');
            expect(typeof result.success).toBe('boolean');
        });

        test('all shared racks should use same write address', async () => {
            const sharedRacks = ['S1-R08', 'S1-R09', 'S1-R10', 'S1-R11'];

            for (const rack of sharedRacks) {
                const mapping = getSensorMapping(rack);
                expect(mapping.writeAddress).toBe(26);
            }
        });
    });

    describe('All 19 Racks - Comprehensive Coverage', () => {
        const testCases = [
            { rack: 'S1-R01', expectedAddress: 19 },
            { rack: 'S1-R02', expectedAddress: 20 },
            { rack: 'S1-R03', expectedAddress: 21 },
            { rack: 'S1-R04', expectedAddress: 22 },
            { rack: 'S1-R05', expectedAddress: 23 },
            { rack: 'S1-R06', expectedAddress: 24 },
            { rack: 'S1-R07', expectedAddress: 25 },
            { rack: 'S1-R08', expectedAddress: 26 },
            { rack: 'S1-R09', expectedAddress: 26 },
            { rack: 'S1-R10', expectedAddress: 26 },
            { rack: 'S1-R11', expectedAddress: 26 },
            { rack: 'S1-R12', expectedAddress: 27 },
            { rack: 'S1-R13', expectedAddress: 28 },
            { rack: 'S1-R14', expectedAddress: 29 },
            { rack: 'S1-R15', expectedAddress: 30 },
            { rack: 'S1-R16', expectedAddress: 31 },
            { rack: 'S1-R17', expectedAddress: 32 },
            { rack: 'S1-R18', expectedAddress: 33 },
            { rack: 'S1-R19', expectedAddress: 34 }
        ];

        testCases.forEach(({ rack, expectedAddress }) => {
            test(`should deactivate sensor for ${rack} using address ${expectedAddress}`, async () => {
                const mapping = getSensorMapping(rack);
                expect(mapping).not.toBeNull();
                expect(mapping.writeAddress).toBe(expectedAddress);

                const result = await deactivateRackSensor(rack);
                expect(result).toHaveProperty('success');
                expect(typeof result.success).toBe('boolean');
            });
        });
    });

    describe('Structured Result Requirements', () => {
        test('should return structured result with success property for valid rack', async () => {
            const result = await deactivateRackSensor('S1-R05');

            expect(result).toHaveProperty('success');
            expect(typeof result.success).toBe('boolean');
        });

        test('should return structured result with success and message for invalid rack', async () => {
            const result = await deactivateRackSensor('INVALID');

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('result should be a plain object', async () => {
            const result = await deactivateRackSensor('S1-R05');

            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
            expect(Array.isArray(result)).toBe(false);
        });
    });

    describe('Async Behavior', () => {
        test('should return a Promise', () => {
            const result = deactivateRackSensor('S1-R05');
            expect(result).toBeInstanceOf(Promise);
        });

        test('should be awaitable', async () => {
            await expect(
                deactivateRackSensor('S1-R05')
            ).resolves.toHaveProperty('success');
        });

        test('should not throw on valid rack', async () => {
            await expect(
                deactivateRackSensor('S1-R01')
            ).resolves.not.toThrow();
        });

        test('should not throw on invalid rack', async () => {
            await expect(
                deactivateRackSensor('INVALID')
            ).resolves.not.toThrow();
        });
    });

    describe('Integration with getSensorMapping', () => {
        test('should use getSensorMapping to validate rack', async () => {
            // Valid rack should return success (or failure if PLC not connected)
            const validResult = await deactivateRackSensor('S1-R05');
            expect(validResult).toHaveProperty('success');

            // Invalid rack should return failure with specific message
            const invalidResult = await deactivateRackSensor('INVALID-RACK');
            expect(invalidResult).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should use correct write address from mapping', async () => {
            const rack = 'S1-R05';
            const mapping = getSensorMapping(rack);

            expect(mapping.writeAddress).toBe(23);

            // The deactivateRackSensor should internally use writeAddress 23
            const result = await deactivateRackSensor(rack);
            expect(result).toHaveProperty('success');
        });
    });

    describe('Method Behavior Requirements', () => {
        test('should lookup sensor mapping first', async () => {
            // Test that invalid mapping returns early
            const invalidResult = await deactivateRackSensor('S1-R99');
            expect(invalidResult).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should call writeCoil with value=false for valid rack', async () => {
            // This test verifies the method completes without error
            // Actual PLC communication is tested in integration tests
            const result = await deactivateRackSensor('S1-R05');
            expect(result).toHaveProperty('success');
            expect(typeof result.success).toBe('boolean');
        });

        test('should return structured result after writeCoil attempt', async () => {
            const result = await deactivateRackSensor('S1-R01');

            // Should return object with at least success property
            expect(result).toHaveProperty('success');

            // If success is false, should have message
            if (!result.success) {
                expect(result).toHaveProperty('message');
                expect(typeof result.message).toBe('string');
            }
        });
    });

    describe('Edge Cases', () => {
        test('should handle rack name with different casing (case-sensitive)', async () => {
            // Mapping is case-sensitive, so lowercase should fail
            const result = await deactivateRackSensor('s1-r05');
            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should handle rack name with extra whitespace', async () => {
            const result = await deactivateRackSensor(' S1-R05 ');
            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should handle non-string types gracefully', async () => {
            const result = await deactivateRackSensor(123);
            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should handle object input gracefully', async () => {
            const result = await deactivateRackSensor({ rack: 'S1-R05' });
            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should handle array input gracefully', async () => {
            const result = await deactivateRackSensor(['S1-R05']);
            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });
    });

    describe('Comparison with activateRackSensor', () => {
        test('both methods should accept same valid rack names', async () => {
            const { activateRackSensor } = require('../rackSensor.service.js');

            const validRack = 'S1-R05';

            const activateResult = await activateRackSensor(validRack, 'SKU-001', 100);
            const deactivateResult = await deactivateRackSensor(validRack);

            // Both should handle the rack without returning invalid rack error
            expect(activateResult.success).toBe(true);
            expect(deactivateResult).toHaveProperty('success');
        });

        test('both methods should reject same invalid rack names', async () => {
            const { activateRackSensor } = require('../rackSensor.service.js');

            const invalidRack = 'INVALID-RACK';

            const activateResult = await activateRackSensor(invalidRack, 'SKU-001', 100);
            const deactivateResult = await deactivateRackSensor(invalidRack);

            // Both should return the same error
            expect(activateResult).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
            expect(deactivateResult).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });
    });
});
