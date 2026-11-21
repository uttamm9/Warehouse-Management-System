const { prisma } = require('./db.js');
const rackSensorService = require('./services/rackSensor.service.js');

class AllocationService {
  async getSkuByCode(skuCode) {
    // First try to find by SKU code, then by barcode
    let sku = await prisma.sKU.findUnique({
      where: { skuCode },
      include: { category: true, subCategory: true }
    });

    if (!sku) {
      // Try to find by barcode
      sku = await prisma.sKU.findUnique({
        where: { barcode: skuCode },
        include: { category: true, subCategory: true }
      });
    }

    return sku;
  }

  async findSequentialShelves(sku, quantity) {
    const unitVolume = sku.length * sku.width * sku.height;
    const unitWeight = sku.weight;

    // Retrieve all racks from the database sorted by name ascending
    const racks = await prisma.rack.findMany({
      include: {
        shelves: {
          include: {
            inventories: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Sort shelves in each rack by level ascending
    for (const rack of racks) {
      rack.shelves.sort((a, b) => String(a.level).localeCompare(String(b.level)));
    }

    const isShelfOccupied = (shelf) => {
      return shelf.inventories.some(inv => inv.quantity > 0);
    };

    const canShelfAccommodate = (shelf) => {
      const freeVolume = shelf.maxVolume - shelf.usedVolume;
      const freeWeight = shelf.maxWeight - shelf.usedWeight;
      return freeVolume >= unitVolume && freeWeight >= unitWeight;
    };

    const isRackComplete = (rack) => {
      return rack.shelves.every(shelf => isShelfOccupied(shelf));
    };

    const getRackNameFromLocation = (location) => {
      if (!location) return null;
      const idx = location.lastIndexOf('-L');
      if (idx === -1) return null;
      return location.substring(0, idx);
    };

    const usedRackNames = new Set();
    
    // Check currently occupied shelves
    for (const rack of racks) {
      const hasOccupied = rack.shelves.some(shelf => isShelfOccupied(shelf));
      if (hasOccupied) {
        usedRackNames.add(rack.name);
      }
    }

    // Check transaction history for successful INWARD transactions
    const inwardTransactions = await prisma.transaction.findMany({
      where: { type: 'INWARD', status: 'success' },
      select: { rackLocation: true }
    });
    for (const tx of inwardTransactions) {
      const rackName = getRackNameFromLocation(tx.rackLocation);
      if (rackName) {
        usedRackNames.add(rackName);
      }
    }

    const allRacksUsed = racks.every(rack => usedRackNames.has(rack.name));
    const allocatedShelves = [];

    if (!allRacksUsed) {
      // FIRST PASS: Sequential allocation of never-used racks
      // Find the last used rack in the sequence
      let lastUsedIdx = -1;
      for (let i = racks.length - 1; i >= 0; i--) {
        if (usedRackNames.has(racks[i].name)) {
          lastUsedIdx = i;
          break;
        }
      }

      let startRackIdx = 0;
      if (lastUsedIdx !== -1) {
        const lastUsedRack = racks[lastUsedIdx];
        if (isRackComplete(lastUsedRack)) {
          startRackIdx = lastUsedIdx + 1;
        } else {
          startRackIdx = lastUsedIdx;
        }
      }

      let rackIdx = startRackIdx;
      while (allocatedShelves.length < quantity && rackIdx < racks.length) {
        const rack = racks[rackIdx];
        for (const shelf of rack.shelves) {
          if (!isShelfOccupied(shelf) && canShelfAccommodate(shelf)) {
            allocatedShelves.push({ ...shelf, rackName: rack.name });
            if (allocatedShelves.length === quantity) {
              break;
            }
          }
        }
        rackIdx++;
      }
    } else {
      // REUSING EMPTY SHELVES PASS: All racks have been used at least once.
      // Search from the beginning of the rack sequence.
      let rackIdx = 0;
      while (allocatedShelves.length < quantity && rackIdx < racks.length) {
        const rack = racks[rackIdx];
        for (const shelf of rack.shelves) {
          if (!isShelfOccupied(shelf) && canShelfAccommodate(shelf)) {
            allocatedShelves.push({ ...shelf, rackName: rack.name });
            if (allocatedShelves.length === quantity) {
              break;
            }
          }
        }
        rackIdx++;
      }
    }

    if (allocatedShelves.length < quantity) {
      throw new Error("No available shelf space for this allocation");
    }

    return allocatedShelves;
  }

  async previewAllocation(skuCode, quantity) {
    const sku = await this.getSkuByCode(skuCode);
    if (!sku) {
      throw new Error(`SKU ${skuCode} not found`);
    }

    const allocatedShelves = await this.findSequentialShelves(sku, quantity);
    const shelfIds = allocatedShelves.map(s => s.id);
    const rackNames = [...new Set(allocatedShelves.map(s => s.rackName))].join(', ');
    const shelfLevels = allocatedShelves.map(s => s.level).join(', ');

    const firstShelf = allocatedShelves[0];
    const unitVolume = sku.length * sku.width * sku.height;
    const totalVolume = unitVolume * quantity;
    const totalWeight = sku.weight * quantity;

    return {
      shelfIds,
      shelfId: firstShelf.id,
      rackId: firstShelf.rackId,
      rackName: rackNames,
      shelfLevel: shelfLevels,
      usedSpace: firstShelf.usedVolume,
      freeSpace: firstShelf.maxVolume - firstShelf.usedVolume,
      occupancyPercent: Math.round(((firstShelf.usedVolume + totalVolume) / firstShelf.maxVolume) * 100),
      requiredVolume: totalVolume,
      requiredWeight: totalWeight
    };
  }

  async confirmInward(skuCode, quantity, overrideShelfId = null) {
    const sku = await this.getSkuByCode(skuCode);
    if (!sku) throw new Error("Invalid SKU");

    let allocation;
    if (overrideShelfId) {
      // Manual override checking
      const shelf = await prisma.shelf.findUnique({
        where: { id: overrideShelfId },
        include: { rack: true, inventories: true }
      });
      if (!shelf) throw new Error("Invalid Shelf");

      const isOccupied = shelf.inventories.some(inv => inv.quantity > 0);
      if (isOccupied) {
        throw new Error("Shelf is already occupied. A shelf can only store a single entry at a time.");
      }

      const unitVolume = sku.length * sku.width * sku.height;
      const totalVolume = unitVolume * quantity;
      const totalWeight = sku.weight * quantity;

      if (shelf.maxVolume - shelf.usedVolume < totalVolume || shelf.maxWeight - shelf.usedWeight < totalWeight) {
        throw new Error("Insufficient space or weight capacity on overridden shelf");
      }

      allocation = {
        shelfId: shelf.id,
        rackId: shelf.rack.id,
        rackName: shelf.rack.name,
        shelfLevel: shelf.level,
        usedSpace: shelf.usedVolume,
        freeSpace: shelf.maxVolume - shelf.usedVolume,
        occupancyPercent: Math.round(((shelf.usedVolume + totalVolume) / shelf.maxVolume) * 100),
        requiredVolume: totalVolume,
        requiredWeight: totalWeight
      };
    } else {
      // Auto allocation
      allocation = await this.previewAllocation(skuCode, quantity);
    }

    // Transaction to update inventory safely
    const result = await prisma.$transaction(async (tx) => {
      // Update shelf volume/weight
      const updatedShelf = await tx.shelf.update({
        where: { id: allocation.shelfId },
        data: {
          usedVolume: { increment: allocation.requiredVolume },
          usedWeight: { increment: allocation.requiredWeight }
        }
      });

      // Update inventory record (add to existing if same SKU on same shelf)
      let inv = await tx.inventory.findFirst({
        where: { skuId: sku.id, shelfId: allocation.shelfId }
      });

      const qrData = `QR-${sku.skuCode}-${Date.now()}`;

      if (inv) {
        inv = await tx.inventory.update({
          where: { id: inv.id },
          data: { quantity: { increment: quantity } }
        });
      } else {
        inv = await tx.inventory.create({
          data: {
            skuId: sku.id,
            shelfId: allocation.shelfId,
            quantity: quantity,
            qrCode: qrData
          }
        });
      }

      // Record transaction
      const transactionRecord = await tx.transaction.create({
        data: {
          type: 'INWARD',
          skuId: sku.id,
          quantity: quantity,
          rackLocation: `${allocation.rackName}-L${allocation.shelfLevel}`,
          status: 'success'
        }
      });

      // Update SKU stock
      await tx.sKU.update({
        where: { id: sku.id },
        data: { stock: { increment: quantity } }
      });

      return {
        inventory: inv,
        transaction: transactionRecord,
        shelf: updatedShelf,
        qrData
      };
    });

    // Fire-and-forget sensor activation after successful transaction
    console.log(`\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║     ALLOCATION COMPLETE - TRIGGERING SENSOR                ║`);
    console.log(`╚════════════════════════════════════════════════════════════╝`);
    console.log(`📦 SKU: ${skuCode}`);
    console.log(`📊 Quantity: ${quantity}`);
    console.log(`🎯 Allocated Rack: ${allocation.rackName}`);
    console.log(`📍 Shelf Level: ${allocation.shelfLevel}`);
    console.log(`\n➡️  Calling rackSensorService.activateRackSensor()...`);
    console.log(`    This will send PLC commands to activate rack sensor.`);
    console.log('');
    
    rackSensorService.activateRackSensor(allocation.rackName, skuCode, quantity)
      .then((result) => {
        if (result.success) {
          console.log(`✅ [Allocation] Sensor activation initiated successfully`);
        } else {
          console.error(`❌ [Allocation] Sensor activation failed: ${result.message}`);
        }
      })
      .catch(err => {
        // Log but don't propagate—sensor failure shouldn't break inbound
        console.error(`❌ [Allocation] Sensor activation EXCEPTION:`);
        console.error(`   Error: ${err.message}`);
        console.error(`   Stack: ${err.stack}`);
      });

    return {
      success: true,
      data: result,
      allocation
    };
  }

  async confirmOutward(skuCode, quantity, rackLocation) {
    const sku = await this.getSkuByCode(skuCode);
    if (!sku) throw new Error(`SKU ${skuCode} not found`);

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      throw new Error('Invalid quantity');
    }

    if (!rackLocation) {
      throw new Error('rackLocation is required for outbound operations');
    }

    // Parse rackLocation (e.g. "S1-R11-L3")
    const parsed = this.parseRackLocation(rackLocation);
    if (!parsed) {
      throw new Error(`Invalid rack location format: ${rackLocation}`);
    }

    const { rackName, level } = parsed;

    // Find the shelf in the database
    const shelf = await prisma.shelf.findFirst({
      where: {
        rack: { name: rackName },
        level: level
      },
      include: {
        inventories: true
      }
    });

    if (!shelf) {
      throw new Error(`Shelf not found for location: ${rackLocation}`);
    }

    // Find the inventory record for this SKU on this shelf
    const inventory = await prisma.inventory.findFirst({
      where: {
        skuId: sku.id,
        shelfId: shelf.id
      }
    });

    if (!inventory) {
      throw new Error(`Inventory not found for SKU ${skuCode} at location ${rackLocation}`);
    }

    if (inventory.quantity < qty) {
      throw new Error(`Insufficient inventory for SKU ${skuCode} at location ${rackLocation}. Available: ${inventory.quantity}, Requested: ${qty}`);
    }

    const unitVolume = sku.length * sku.width * sku.height;
    const removedVolume = unitVolume * qty;
    const removedWeight = sku.weight * qty;

    const newQuantity = Math.max(0, inventory.quantity - qty);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Decrement stock on the SKU
      const updatedSku = await tx.sKU.update({
        where: { id: sku.id },
        data: { stock: { decrement: qty } }
      });

      let updatedShelf;
      let inventoryResult;

      if (newQuantity === 0) {
        // Reset shelf capacity to empty
        updatedShelf = await tx.shelf.update({
          where: { id: shelf.id },
          data: {
            usedVolume: 0,
            usedWeight: 0
          }
        });

        // Delete inventory record
        inventoryResult = await tx.inventory.delete({
          where: { id: inventory.id }
        });
      } else {
        // Decrement shelf capacity safely
        const targetVolume = Math.max(0, shelf.usedVolume - removedVolume);
        const targetWeight = Math.max(0, shelf.usedWeight - removedWeight);

        updatedShelf = await tx.shelf.update({
          where: { id: shelf.id },
          data: {
            usedVolume: targetVolume,
            usedWeight: targetWeight
          }
        });

        // Update inventory record quantity
        inventoryResult = await tx.inventory.update({
          where: { id: inventory.id },
          data: {
            quantity: newQuantity
          }
        });
      }

      // 2. Create the OUTWARD transaction record
      const transactionRecord = await tx.transaction.create({
        data: {
          type: 'OUTWARD',
          skuId: sku.id,
          quantity: qty,
          rackLocation: rackLocation || null,
          status: 'success'
        }
      });

      return {
        sku: updatedSku,
        shelf: updatedShelf,
        inventory: inventoryResult,
        transaction: transactionRecord,
        newQuantity
      };
    });

    return {
      success: true,
      data: result
    };
  }

  parseRackLocation(location) {
    if (!location) return null;
    const idx = location.lastIndexOf('-L');
    if (idx === -1) return null;
    const rackName = location.substring(0, idx);
    const levelStr = location.substring(idx + 2);
    let level;
    if (levelStr === '1' || levelStr === 'A') level = 'A';
    else if (levelStr === '2' || levelStr === 'B') level = 'B';
    else if (levelStr === '3' || levelStr === 'C') level = 'C';
    else if (levelStr === '4' || levelStr === 'D') level = 'D';
    else return null;
    return { rackName, level };
  }
}

module.exports = new AllocationService();
