// src/services/allocation.service.js
const { PrismaClient } = require('../../desktop/prisma');
const prisma = new PrismaClient();

async function allocateShelf(skuCode, quantity) {
    const sku = await prisma.sKU.findUnique({ where: { skuCode } });
    if (!sku) throw new Error(`SKU ${skuCode} not found in database.`);

    const unitVolume = sku.length * sku.width * sku.height;
    const totalVolume = unitVolume * quantity;
    const totalWeight = sku.weight * quantity;

    // Fetch shelves with their current occupancy
    const shelves = await prisma.shelf.findMany({ include: { rack: true } });

    // Filter for valid capacities
    const validShelves = shelves.filter(shelf => {
        const freeVolume = shelf.maxVolume - shelf.usedVolume;
        const freeWeight = shelf.maxWeight - shelf.usedWeight;
        return freeVolume >= totalVolume && freeWeight >= totalWeight;
    });

    if (validShelves.length === 0) {
        throw new Error(`Allocation Failed: Insufficient space or weight capacity for ${quantity}x ${skuCode}. Required Volume: ${totalVolume}mm³, Required Weight: ${totalWeight}kg.`);
    }

    // Sort by Least Occupied (Optimization Strategy)
    validShelves.sort((a, b) => (a.usedVolume / a.maxVolume) - (b.usedVolume / b.maxVolume));

    const bestShelf = validShelves[0];
    return {
        shelf: bestShelf,
        sku,
        requiredVolume: totalVolume,
        requiredWeight: totalWeight
    };
}

module.exports = { allocateShelf };
