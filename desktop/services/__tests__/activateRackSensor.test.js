/**
 * Unit Tests for activateRackSensor method (Task 1.7)
 * 
 * Tests the fire-and-forget sensor activation method to ensure:
 * - It validates rack names correctly
 * - It returns success immediately for valid racks
 * - It handles invalid inputs gracefully
 */

const { describe, test, expect, beforeEach } = require('@jest/globals');
const rackSensorService = require('../rackSensor.service.js');

describe('RackSensorService - activateRackSensor (Task 1.7)', () => {

    describe('Valid Rack Names', () => {
        test('should return success immediately for valid rack S1-R01', async () => {
            // Mock _executeActivationSequence to prevent actual execution
            const mockExecute = jest.fn().mockResolvedValue(undefined);
            rackSensorService._executeActivationSequence = mockExecute;

            const result = await rackSensorService.activateRackSensor('S1-R01', 'SKU-001', 100);

            expect(result).toEqual({ success: true });
            expect(mockExecute).toHaveBeenCalledWith(19, 'S1-R01', 'SKU-001', 100);
        });

        test('should return success immediately for valid rack S1-R19', async () => {
            const mockExecute = jest.fn().mockResolvedValue(undefined);
            rackSensorService._executeActivationSequence = mockExecute;

            const result = await rackSensorService.activateRackSensor('S1-R19', 'SKU-999', 50);

            expect(result).toEqual({ success: true });
            expect(mockExecute).toHaveBeenCalledWith(34, 'S1-R19', 'SKU-999', 50);
        });

        test('should return success immediately for shared rack S1-R08', async () => {
            const mockExecute = jest.fn().mockResolvedValue(undefined);
            rackSensorService._executeActivationSequence = mockExecute;

            const result = await rackSensorService.activateRackSensor('S1-R08', 'SKU-ABC', 25);

            expect(result).toEqual({ success: true });
            expect(mockExecute).toHaveBeenCalledWith(26, 'S1-R08', 'SKU-ABC', 25);
        });

        test('should return success immediately for shared rack S1-R11', async () => {
            const mockExecute = jest.fn().mockResolvedValue(undefined);
            rackSensorService._executeActivationSequence = mockExecute;

            const result = await rackSensorService.activateRackSensor('S1-R11', 'SKU-XYZ', 75);

            expect(result).toEqual({ success: true });
            expect(mockExecute).toHaveBeenCalledWith(26, 'S1-R11', 'SKU-XYZ', 75);
        });
    });

    describe('Invalid Rack Names', () => {
        test('should return failure for non-existent rack S1-R20', async () => {
            const result = await rackSensorService.activateRackSensor('S1-R20', 'SKU-001', 100);

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return failure for non-existent rack S1-R00', async () => {
            const result = await rackSensorService.activateRackSensor('S1-R00', 'SKU-001', 100);

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return failure for invalid rack name format', async () => {
            const result = await rackSensorService.activateRackSensor('INVALID', 'SKU-001', 100);

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return failure for empty string', async () => {
            const result = await rackSensorService.activateRackSensor('', 'SKU-001', 100);

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return failure for null rack name', async () => {
            const result = await rackSensorService.activateRackSensor(null, 'SKU-001', 100);

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });

        test('should return failure for undefined rack name', async () => {
            const result = await rackSensorService.activateRackSensor(undefined, 'SKU-001', 100);

            expect(result).toEqual({
                success: false,
                message: 'Invalid rack name'
            });
        });
    });

    describe('Fire-and-Forget Behavior', () => {
        test('should not wait for _executeActivationSequence to complete', async () => {
            let sequenceStarted = false;
            let sequenceCompleted = false;

            // Mock with delayed execution
            const mockExecute = jest.fn().mockImplementation(async () => {
                sequenceStarted = true;
                await new Promise(resolve => setTimeout(resolve, 100));
                sequenceCompleted = true;
            });
            rackSensorService._executeActivationSequence = mockExecute;

            const result = await rackSensorService.activateRackSensor('S1-R05', 'SKU-001', 100);

            // Should return immediately with success
            expect(result).toEqual({ success: true });

            // Sequence should have been triggered
            expect(mockExecute).toHaveBeenCalled();

            // But should not have completed yet (fire-and-forget)
            expect(sequenceStarted).toBe(false);
            expect(sequenceCompleted).toBe(false);
        });

        test('should not propagate errors from _executeActivationSequence', async () => {
            // Mock with error
            const mockExecute = jest.fn().mockRejectedValue(new Error('PLC communication failed'));
            rackSensorService._executeActivationSequence = mockExecute;

            // Mock console.error to suppress error output in test
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            const result = await rackSensorService.activateRackSensor('S1-R05', 'SKU-001', 100);

            // Should still return success
            expect(result).toEqual({ success: true });
            expect(mockExecute).toHaveBeenCalled();

            // Wait a bit for the catch block to execute
            await new Promise(resolve => setTimeout(resolve, 50));

            // Error should be logged but not thrown
            expect(consoleErrorSpy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });
    });

    describe('Parameter Passing', () => {
        test('should pass writeAddress from mapping to _executeActivationSequence', async () => {
            const mockExecute = jest.fn().mockResolvedValue(undefined);
            rackSensorService._executeActivationSequence = mockExecute;

            await rackSensorService.activateRackSensor('S1-R05', 'SKU-TEST', 200);

            // S1-R05 has writeAddress 23
            expect(mockExecute).toHaveBeenCalledWith(23, 'S1-R05', 'SKU-TEST', 200);
        });

        test('should pass all parameters correctly to _executeActivationSequence', async () => {
            const mockExecute = jest.fn().mockResolvedValue(undefined);
            rackSensorService._executeActivationSequence = mockExecute;

            const rackName = 'S1-R12';
            const skuCode = 'SKU-SPECIAL';
            const quantity = 500;

            await rackSensorService.activateRackSensor(rackName, skuCode, quantity);

            // S1-R12 has writeAddress 27
            expect(mockExecute).toHaveBeenCalledWith(27, rackName, skuCode, quantity);
            expect(mockExecute).toHaveBeenCalledTimes(1);
        });

        test('should handle shared rack correctly', async () => {
            const mockExecute = jest.fn().mockResolvedValue(undefined);
            rackSensorService._executeActivationSequence = mockExecute;

            await rackSensorService.activateRackSensor('S1-R09', 'SKU-SHARED', 150);

            // S1-R09 (shared) has writeAddress 26
            expect(mockExecute).toHaveBeenCalledWith(26, 'S1-R09', 'SKU-SHARED', 150);
        });
    });
});
