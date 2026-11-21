// src/controllers/reports.controller.js
const { PrismaClient } = require('../../desktop/prisma');
const prisma = new PrismaClient();

// 1. GET /reports/inward
async function getInwardReports(req, res) {
    try {
        const { startDate, endDate, skuCode, rackId } = req.query;

        const filters = { type: 'INWARD' };
        if (startDate && endDate) {
            filters.timestamp = { gte: new Date(startDate), lte: new Date(endDate) };
        }
        if (skuCode) filters.sku = { skuCode: skuCode };

        const transactions = await prisma.transaction.findMany({
            where: filters,
            include: {
                sku: {
                    include: {
                        inventories: { include: { shelf: { include: { rack: true } } } }
                    }
                }
            },
            orderBy: { timestamp: 'desc' }
        });

        const report = transactions.map(tx => {
            // Find where this SKU is sitting currently (simplified)
            const loc = tx.sku.inventories[0];

            return {
                date: tx.timestamp,
                sku: tx.sku.skuCode,
                quantity: tx.quantity,
                dimensions: `${tx.sku.length}x${tx.sku.width}x${tx.sku.height}mm`,
                location: loc ? `${loc.shelf.rack.name} - ${loc.shelf.level}` : 'Unallocated',
                qrCode: loc ? loc.qrCode : null
            };
        });

        res.json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// 2. GET /reports/stock-status
async function getStockStatus(req, res) {
    try {
        const skus = await prisma.sKU.findMany({
            include: {
                inventories: { include: { shelf: { include: { rack: true } } } }
            }
        });

        const report = skus.map(sku => ({
            sku: sku.skuCode,
            productName: sku.productName,
            currentStock: sku.stock,
            locations: sku.inventories.map(inv => ({
                rack: inv.shelf.rack.name,
                level: inv.shelf.level,
                freeVolume: inv.shelf.maxVolume - inv.shelf.usedVolume,
                quantityInShelf: inv.quantity
            }))
        }));

        res.json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// 3. GET /reports/rack-utilization
async function getRackUtilization(req, res) {
    try {
        const racks = await prisma.rack.findMany({
            include: { shelves: true }
        });

        const report = racks.map(rack => {
            return {
                rackId: rack.id,
                rackName: rack.name,
                room: rack.room,
                shelves: rack.shelves.map(shelf => ({
                    level: shelf.level,
                    usedSpace: shelf.usedVolume,
                    totalSpace: shelf.maxVolume,
                    occupancyPercent: parseFloat(((shelf.usedVolume / shelf.maxVolume) * 100).toFixed(2))
                }))
            };
        });

        res.json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { getInwardReports, getStockStatus, getRackUtilization };
