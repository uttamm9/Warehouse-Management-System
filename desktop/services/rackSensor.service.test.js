/**
 * Unit tests for rackSensor.service.js
 * Testing task 1.7: activateRackSensor method
 */

const {
    getSensorMapping,
    activateRackSensor,
    _executeActivationSequence
} = require('./rackSensor.service');

describe('rackSensor.service - Task 1.7: activateRackSensor', () => {
    describe('activateRackSensor - validation', () => {
        test('should return error for invalid rack name', async () => {
            const result = await activateRackSensor('INVALID-RACK', 'SKU-001', 100);

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return error for null rack name', async () => {
            const result = await activateRackSensor(null, 'SKU-001', 100);

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return error for undefined rack name', async () => {
            const result = await activateRackSensor(undefined, 'SKU-001', 100);

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return error for empty rack name', async () => {
            const result = await activateRackSensor('', 'SKU-001', 100);

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return error for non-existent rack S1-R99', async () => {
            const result = await activateRackSensor('S1-R99', 'SKU-001', 100);

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });
    });

    describe('activateRackSensor - valid racks', () => {
        test('should return success immediately for valid rack S1-R01', async () => {
            const result = await activateRackSensor('S1-R01', 'SKU-001', 100);

            expect(result).toEqual({
                success: true
            });
        });

        test('should return success immediately for valid rack S1-R05', async () => {
            const result = await activateRackSensor('S1-R05', 'SKU-002', 50);

            expect(result).toEqual({
                success: true
            });
        });

        test('should return success immediately for valid rack S1-R19', async () => {
            const result = await activateRackSensor('S1-R19', 'SKU-003', 25);

            expect(result).toEqual({
                success: true
            });
        });

        test('should return success for shared sensor rack S1-R08', async () => {
            const result = await activateRackSensor('S1-R08', 'SKU-004', 75);

            expect(result).toEqual({
                success: true
            });
        });

        test('should return success for shared sensor rack S1-R09', async () => {
            const result = await activateRackSensor('S1-R09', 'SKU-005', 30);

            expect(result).toEqual({
                success: true
            });
        });

        test('should return success for shared sensor rack S1-R10', async () => {
            const result = await activateRackSensor('S1-R10', 'SKU-006', 40);

            expect(result).toEqual({
                success: true
            });
        });

        test('should return success for shared sensor rack S1-R11', async () => {
            const result = await activateRackSensor('S1-R11', 'SKU-007', 60);

            expect(result).toEqual({
                success: true
            });
        });
    });

    describe('activateRackSensor - fire-and-forget behavior', () => {
        test('should return immediately without waiting for activation sequence', async () => {
            const startTime = Date.now();
            const result = await activateRackSensor('S1-R05', 'SKU-001', 100);
            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(result.success).toBe(true);
            // Should return in less than 50ms (fire-and-forget)
            expect(duration).toBeLessThan(50);
        });

        test('should call getSensorMapping internally', async () => {
            // We can verify the mapping is retrieved by checking valid vs invalid behavior
            const validResult = await activateRackSensor('S1-R01', 'SKU-001', 100);
            const invalidResult = await activateRackSensor('INVALID', 'SKU-001', 100);

            expect(validResult.success).toBe(true);
            expect(invalidResult.success).toBe(false);
            expect(invalidResult.message).toBe('Invalid rack name');
        });
    });

    describe('activateRackSensor - integration with mapping', () => {
        test('should use correct write address from mapping for S1-R01', async () => {
            const mapping = getSensorMapping('S1-R01');
            expect(mapping.writeAddress).toBe(19);

            const result = await activateRackSensor('S1-R01', 'SKU-001', 100);
            expect(result.success).toBe(true);
        });

        test('should use correct write address from mapping for S1-R05', async () => {
            const mapping = getSensorMapping('S1-R05');
            expect(mapping.writeAddress).toBe(23);

            const result = await activateRackSensor('S1-R05', 'SKU-002', 50);
            expect(result.success).toBe(true);
        });

        test('should use shared sensor address for S1-R08 through S1-R11', async () => {
            const mapping08 = getSensorMapping('S1-R08');
            const mapping09 = getSensorMapping('S1-R09');
            const mapping10 = getSensorMapping('S1-R10');
            const mapping11 = getSensorMapping('S1-R11');

            // All should share the same write address (26)
            expect(mapping08.writeAddress).toBe(26);
            expect(mapping09.writeAddress).toBe(26);
            expect(mapping10.writeAddress).toBe(26);
            expect(mapping11.writeAddress).toBe(26);

            // All activations should succeed
            const result08 = await activateRackSensor('S1-R08', 'SKU-001', 100);
            const result09 = await activateRackSensor('S1-R09', 'SKU-002', 100);
            const result10 = await activateRackSensor('S1-R10', 'SKU-003', 100);
            const result11 = await activateRackSensor('S1-R11', 'SKU-004', 100);

            expect(result08.success).toBe(true);
            expect(result09.success).toBe(true);
            expect(result10.success).toBe(true);
            expect(result11.success).toBe(true);
        });
    });

    describe('activateRackSensor - all 19 racks', () => {
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
            test(`should activate sensor for ${rack} with address ${expectedAddress}`, async () => {
                const mapping = getSensorMapping(rack);
                expect(mapping).not.toBeNull();
                expect(mapping.writeAddress).toBe(expectedAddress);

                const result = await activateRackSensor(rack, `SKU-${rack}`, 100);
                expect(result).toEqual({
                    success: true
                });
            });
        });
    });

    describe('_executeActivationSequence - placeholder', () => {
        test('should exist as a function', () => {
            expect(typeof _executeActivationSequence).toBe('function');
        });

        test('should be async (returns Promise)', () => {
            const result = _executeActivationSequence(19, 'S1-R01', 'SKU-001', 100);
            expect(result).toBeInstanceOf(Promise);
        });

        test('should not throw error when called', async () => {
            await expect(
                _executeActivationSequence(19, 'S1-R01', 'SKU-001', 100)
            ).resolves.not.toThrow();
        });
    });
});
