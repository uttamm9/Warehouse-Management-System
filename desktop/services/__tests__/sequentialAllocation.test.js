const { describe, test, expect, beforeEach } = require('@jest/globals');

// Mock db.js first
jest.mock('../../db.js', () => {
  return {
    prisma: {
      rack: {
        findMany: jest.fn()
      },
      transaction: {
        findMany: jest.fn()
      },
      sKU: {
        findUnique: jest.fn()
      }
    }
  };
});

const { prisma } = require('../../db.js');
const allocationService = require('../../allocation.service.js');

describe('Sequential Rack Allocation Logic', () => {
  let mockSku;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSku = {
      id: 'mock-sku-id',
      skuCode: 'TEST-SKU',
      length: 10,
      width: 10,
      height: 10,
      weight: 10
    };
  });

  const createMockRack = (name, shelvesConfig) => {
    return {
      id: `rack-id-${name}`,
      name,
      room: 'Room1',
      shelves: shelvesConfig.map((occupied, idx) => ({
        id: `shelf-id-${name}-${idx}`,
        rackId: `rack-id-${name}`,
        level: String.fromCharCode(65 + idx), // A, B, C, D
        maxVolume: 100000,
        maxWeight: 1000,
        usedVolume: occupied ? 5000 : 0,
        usedWeight: occupied ? 50 : 0,
        inventories: occupied ? [{ id: 'inv-1', quantity: 1 }] : []
      }))
    };
  };

  test('should allocate sequentially in first pass starting from first empty shelf of first active rack', async () => {
    // Rack 1: occupied/full
    // Rack 2: empty (unused)
    // Rack 3: empty (unused)
    const rack1 = createMockRack('S1-R01', [true, true, true, true]);
    const rack2 = createMockRack('S1-R02', [false, false, false, false]);
    const rack3 = createMockRack('S1-R03', [false, false, false, false]);

    prisma.rack.findMany.mockResolvedValue([rack1, rack2, rack3]);
    prisma.transaction.findMany.mockResolvedValue([
      { rackLocation: 'S1-R01-LA' },
      { rackLocation: 'S1-R01-LB' },
      { rackLocation: 'S1-R01-LC' },
      { rackLocation: 'S1-R01-LD' }
    ]);

    const result = await allocationService.findSequentialShelves(mockSku, 1);
    
    // Expect it to allocate the first level of Rack 2
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('shelf-id-S1-R02-0');
    expect(result[0].level).toBe('A');
  });

  test('should bypass empty shelves in already used racks during the first pass', async () => {
    // Rack 1: was full, but shelf A became empty due to outbound
    // Rack 2: shelf A is occupied, B, C, D are empty
    // Rack 3: completely empty (unused)
    const rack1 = createMockRack('S1-R01', [false, true, true, true]); // A is empty
    const rack2 = createMockRack('S1-R02', [true, false, false, false]); // B, C, D are empty
    const rack3 = createMockRack('S1-R03', [false, false, false, false]);

    prisma.rack.findMany.mockResolvedValue([rack1, rack2, rack3]);
    prisma.transaction.findMany.mockResolvedValue([
      { rackLocation: 'S1-R01-LA' },
      { rackLocation: 'S1-R01-LB' },
      { rackLocation: 'S1-R01-LC' },
      { rackLocation: 'S1-R01-LD' },
      { rackLocation: 'S1-R02-LA' }
    ]);

    const result = await allocationService.findSequentialShelves(mockSku, 1);

    // Expect it to bypass Rack 1 Shelf A and allocate Rack 2 Shelf B
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('shelf-id-S1-R02-1');
    expect(result[0].level).toBe('B');
  });

  test('should reuse empty shelves in past racks if all racks have been used at least once', async () => {
    // Rack 1: was full, but shelf A became empty due to outbound
    // Rack 2: was full, but shelf B became empty due to outbound
    // Rack 3: occupied (used)
    const rack1 = createMockRack('S1-R01', [false, true, true, true]); // A is empty
    const rack2 = createMockRack('S1-R02', [true, false, true, true]); // B is empty
    const rack3 = createMockRack('S1-R03', [true, true, true, true]);

    prisma.rack.findMany.mockResolvedValue([rack1, rack2, rack3]);
    prisma.transaction.findMany.mockResolvedValue([
      { rackLocation: 'S1-R01-LA' },
      { rackLocation: 'S1-R02-LB' },
      { rackLocation: 'S1-R03-LA' }
    ]);

    const result = await allocationService.findSequentialShelves(mockSku, 2);

    // Expect it to find Rack 1 Shelf A and then Rack 2 Shelf B
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('shelf-id-S1-R01-0');
    expect(result[1].id).toBe('shelf-id-S1-R02-1');
  });

  test('should throw an error if no space is available', async () => {
    const rack1 = createMockRack('S1-R01', [true, true, true, true]);
    prisma.rack.findMany.mockResolvedValue([rack1]);
    prisma.transaction.findMany.mockResolvedValue([]);

    await expect(allocationService.findSequentialShelves(mockSku, 1))
      .rejects.toThrow("No available shelf space for this allocation");
  });
});
