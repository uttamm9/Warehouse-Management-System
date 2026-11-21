/**
 * Unit and Property-Based Tests for rackSensor.service.js
 * 
 * Tests the getSensorMapping method to ensure correct mapping retrieval
 * for valid and invalid rack names.
 */

const { describe, test, expect } = require('@jest/globals');
const fc = require('fast-check');
const { getSensorMapping, RACK_SENSOR_MAPPING } = require('../rackSensor.service.js');

describe('RackSensorService - getSensorMapping', () => {
    describe('Unit Tests - Valid Rack Names', () => {
        test('should return mapping for S1-R01', () => {
            const result = getSensorMapping('S1-R01');
            expect(result).toEqual({
                writeAddress: 19,
                readAddress: 0,
                sensor: 1
            });
        });

        test('should return mapping for S1-R19', () => {
            const result = getSensorMapping('S1-R19');
            expect(result).toEqual({
                writeAddress: 34,
                readAddress: 15,
                sensor: 16
            });
        });

        test('should return mapping with shared flag for S1-R08', () => {
            const result = getSensorMapping('S1-R08');
            expect(result).toEqual({
                writeAddress: 26,
                readAddress: 7,
                sensor: 8,
                shared: true
            });
        });

        test('should return mapping with shared flag for S1-R09', () => {
            const result = getSensorMapping('S1-R09');
            expect(result).toEqual({
                writeAddress: 26,
                readAddress: 7,
                sensor: 8,
                shared: true
            });
        });

        test('should return mapping with shared flag for S1-R10', () => {
            const result = getSensorMapping('S1-R10');
            expect(result).toEqual({
                writeAddress: 26,
                readAddress: 7,
                sensor: 8,
                shared: true
            });
        });

        test('should return mapping with shared flag for S1-R11', () => {
            const result = getSensorMapping('S1-R11');
            expect(result).toEqual({
                writeAddress: 26,
                readAddress: 7,
                sensor: 8,
                shared: true
            });
        });

        test('should return a copy of the mapping object (not the original)', () => {
            const result1 = getSensorMapping('S1-R05');
            const result2 = getSensorMapping('S1-R05');

            // Mutate result1
            result1.writeAddress = 999;

            // result2 should be unaffected
            expect(result2.writeAddress).toBe(23);

            // Original mapping should be unaffected
            expect(RACK_SENSOR_MAPPING['S1-R05'].writeAddress).toBe(23);
        });
    });

    describe('Unit Tests - Invalid Rack Names', () => {
        test('should return null for non-existent rack S1-R20', () => {
            const result = getSensorMapping('S1-R20');
            expect(result).toBeNull();
        });

        test('should return null for non-existent rack S1-R00', () => {
            const result = getSensorMapping('S1-R00');
            expect(result).toBeNull();
        });

        test('should return null for invalid rack name format', () => {
            const result = getSensorMapping('INVALID');
            expect(result).toBeNull();
        });

        test('should return null for empty string', () => {
            const result = getSensorMapping('');
            expect(result).toBeNull();
        });

        test('should return null for null input', () => {
            const result = getSensorMapping(null);
            expect(result).toBeNull();
        });

        test('should return null for undefined input', () => {
            const result = getSensorMapping(undefined);
            expect(result).toBeNull();
        });

        test('should return null for numeric input', () => {
            const result = getSensorMapping(123);
            expect(result).toBeNull();
        });

        test('should return null for object input', () => {
            const result = getSensorMapping({ rack: 'S1-R01' });
            expect(result).toBeNull();
        });
    });

    describe('Unit Tests - Mapping Structure', () => {
        test('all valid racks should have writeAddress between 19 and 34', () => {
            const validRacks = Object.keys(RACK_SENSOR_MAPPING);

            validRacks.forEach(rackName => {
                const mapping = getSensorMapping(rackName);
                expect(mapping.writeAddress).toBeGreaterThanOrEqual(19);
                expect(mapping.writeAddress).toBeLessThanOrEqual(34);
            });
        });

        test('all valid racks should have readAddress between 0 and 15', () => {
            const validRacks = Object.keys(RACK_SENSOR_MAPPING);

            validRacks.forEach(rackName => {
                const mapping = getSensorMapping(rackName);
                expect(mapping.readAddress).toBeGreaterThanOrEqual(0);
                expect(mapping.readAddress).toBeLessThanOrEqual(15);
            });
        });

        test('all valid racks should have sensor number between 1 and 16', () => {
            const validRacks = Object.keys(RACK_SENSOR_MAPPING);

            validRacks.forEach(rackName => {
                const mapping = getSensorMapping(rackName);
                expect(mapping.sensor).toBeGreaterThanOrEqual(1);
                expect(mapping.sensor).toBeLessThanOrEqual(16);
            });
        });

        test('shared racks (S1-R08 through S1-R11) should all have same addresses', () => {
            const sharedRacks = ['S1-R08', 'S1-R09', 'S1-R10', 'S1-R11'];
            const mappings = sharedRacks.map(rack => getSensorMapping(rack));

            // All should have same write address
            expect(mappings[0].writeAddress).toBe(26);
            expect(mappings[1].writeAddress).toBe(26);
            expect(mappings[2].writeAddress).toBe(26);
            expect(mappings[3].writeAddress).toBe(26);

            // All should have same read address
            expect(mappings[0].readAddress).toBe(7);
            expect(mappings[1].readAddress).toBe(7);
            expect(mappings[2].readAddress).toBe(7);
            expect(mappings[3].readAddress).toBe(7);

            // All should have shared flag
            expect(mappings[0].shared).toBe(true);
            expect(mappings[1].shared).toBe(true);
            expect(mappings[2].shared).toBe(true);
            expect(mappings[3].shared).toBe(true);
        });

        test('non-shared racks should not have shared flag', () => {
            const nonSharedRacks = ['S1-R01', 'S1-R05', 'S1-R12', 'S1-R19'];

            nonSharedRacks.forEach(rackName => {
                const mapping = getSensorMapping(rackName);
                expect(mapping.shared).toBeUndefined();
            });
        });
    });

    describe('Property-Based Tests', () => {
        /**
         * Property 1: Mapping Completeness
         * **Validates: Requirements 1.1, 1.2, 1.3**
         * 
         * For all rack identifiers from S1-R01 through S1-R19, 
         * the sensor mapping SHALL contain exactly one entry with 
         * a valid write address and read address.
         */
        test('property 1: mapping completeness - all racks S1-R01 through S1-R19 have exactly one valid mapping', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 19 }),
                    (rackNumber) => {
                        const rackName = `S1-R${rackNumber.toString().padStart(2, '0')}`;

                        // The mapping SHALL contain exactly one entry
                        const mapping = getSensorMapping(rackName);
                        expect(mapping).not.toBeNull();
                        expect(typeof mapping).toBe('object');

                        // WITH a valid write address (range 19-34)
                        expect(mapping).toHaveProperty('writeAddress');
                        expect(typeof mapping.writeAddress).toBe('number');
                        expect(mapping.writeAddress).toBeGreaterThanOrEqual(19);
                        expect(mapping.writeAddress).toBeLessThanOrEqual(34);

                        // AND a valid read address (range 0-15)
                        expect(mapping).toHaveProperty('readAddress');
                        expect(typeof mapping.readAddress).toBe('number');
                        expect(mapping.readAddress).toBeGreaterThanOrEqual(0);
                        expect(mapping.readAddress).toBeLessThanOrEqual(15);

                        // Verify the mapping exists in RACK_SENSOR_MAPPING
                        expect(RACK_SENSOR_MAPPING).toHaveProperty(rackName);

                        // Verify exactly one entry (no duplicates)
                        const allKeys = Object.keys(RACK_SENSOR_MAPPING);
                        const matchingKeys = allKeys.filter(key => key === rackName);
                        expect(matchingKeys).toHaveLength(1);
                    }
                ),
                { numRuns: 100 }
            );
        });

        /**
         * **Validates: Requirements 11.2, 11.6**
         * 
         * Property: For all valid rack names (S1-R01 through S1-R19),
         * getSensorMapping SHALL return a non-null object with valid
         * writeAddress, readAddress, and sensor number.
         */
        test('property: all valid rack names return valid mappings', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 19 }),
                    (rackNumber) => {
                        const rackName = `S1-R${rackNumber.toString().padStart(2, '0')}`;
                        const mapping = getSensorMapping(rackName);

                        // Should return non-null object
                        expect(mapping).not.toBeNull();
                        expect(typeof mapping).toBe('object');

                        // Should have required properties
                        expect(mapping).toHaveProperty('writeAddress');
                        expect(mapping).toHaveProperty('readAddress');
                        expect(mapping).toHaveProperty('sensor');

                        // Should have valid address ranges
                        expect(mapping.writeAddress).toBeGreaterThanOrEqual(19);
                        expect(mapping.writeAddress).toBeLessThanOrEqual(34);
                        expect(mapping.readAddress).toBeGreaterThanOrEqual(0);
                        expect(mapping.readAddress).toBeLessThanOrEqual(15);
                        expect(mapping.sensor).toBeGreaterThanOrEqual(1);
                        expect(mapping.sensor).toBeLessThanOrEqual(16);
                    }
                ),
                { numRuns: 100 }
            );
        });

        /**
         * **Validates: Requirements 11.2, 11.6**
         * 
         * Property: For all invalid rack names (not matching S1-R01 through S1-R19),
         * getSensorMapping SHALL return null.
         */
        test('property: invalid rack names return null', () => {
            fc.assert(
                fc.property(
                    fc.string(),
                    (invalidRackName) => {
                        // Skip valid rack names
                        const isValidRackName = /^S1-R(0[1-9]|1[0-9])$/.test(invalidRackName);
                        fc.pre(!isValidRackName);

                        const result = getSensorMapping(invalidRackName);
                        expect(result).toBeNull();
                    }
                ),
                { numRuns: 100 }
            );
        });

        /**
         * **Validates: Requirements 11.2, 11.6**
         * 
         * Property: getSensorMapping should return a new object each time
         * (not a reference to the internal mapping), ensuring immutability.
         */
        test('property: returned mapping is immutable (returns copy)', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 19 }),
                    (rackNumber) => {
                        const rackName = `S1-R${rackNumber.toString().padStart(2, '0')}`;

                        const mapping1 = getSensorMapping(rackName);
                        const mapping2 = getSensorMapping(rackName);

                        // Should be equal in value
                        expect(mapping1).toEqual(mapping2);

                        // Should be different objects
                        expect(mapping1).not.toBe(mapping2);

                        // Mutating one should not affect the other
                        mapping1.writeAddress = -1;
                        expect(mapping2.writeAddress).not.toBe(-1);

                        // Original mapping should be unchanged
                        const mapping3 = getSensorMapping(rackName);
                        expect(mapping3.writeAddress).toBe(mapping2.writeAddress);
                    }
                ),
                { numRuns: 50 }
            );
        });

        /**
         * **Validates: Requirements 11.2, 11.6**
         * 
         * Property: For non-string inputs, getSensorMapping SHALL return null.
         */
        test('property: non-string inputs return null', () => {
            fc.assert(
                fc.property(
                    fc.oneof(
                        fc.integer(),
                        fc.boolean(),
                        fc.constant(null),
                        fc.constant(undefined),
                        fc.object(),
                        fc.array(fc.anything())
                    ),
                    (invalidInput) => {
                        const result = getSensorMapping(invalidInput);
                        expect(result).toBeNull();
                    }
                ),
                { numRuns: 100 }
            );
        });

        /**
         * **Validates: Requirements 11.2, 11.6**
         * 
         * Property: The mapping for shared racks (S1-R08 through S1-R11)
         * should always include the shared flag set to true.
         */
        test('property: shared racks always have shared flag', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 8, max: 11 }),
                    (rackNumber) => {
                        const rackName = `S1-R${rackNumber.toString().padStart(2, '0')}`;
                        const mapping = getSensorMapping(rackName);

                        expect(mapping.shared).toBe(true);
                        expect(mapping.writeAddress).toBe(26);
                        expect(mapping.readAddress).toBe(7);
                        expect(mapping.sensor).toBe(8);
                    }
                ),
                { numRuns: 50 }
            );
        });
    });
});
