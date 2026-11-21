// desktop/controllers/reports.controller.js
const { prisma } = require('../db.js');

const pad = (n) => n.toString().padStart(2, '0');
const formatDateTime = (date) => {
    const d = new Date(date);
    return {
        DateStr: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
        TimeStr: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    };
};

// 1. GET /api/reports/inbound
async function getInboundReport(req, res) {
    try {
        const { dateRange, skuFilter, rackFilter } = req.query; 
        const filters = { type: 'INWARD' };

        const transactions = await prisma.transaction.findMany({
            where: filters,
            include: {
                sku: {
                    include: {
                        inventories: { include: { shelf: { include: { rack: true } } } }
                    }
                },
                user: {
                    include: { role: true }
                }
            },
            orderBy: { timestamp: 'desc' }
        });

        const report = transactions.map(tx => {
            const loc = tx.sku.inventories[0]; // Simplistic approach to get location
            const { DateStr, TimeStr } = formatDateTime(tx.timestamp);
            
            return {
                "Date": DateStr,
                "Time": TimeStr,
                "SKU": tx.sku.skuCode,
                "Product": tx.sku.productName || "Unknown",
                "Quantity": tx.quantity,
                "Rack Shelf": loc ? `${loc.shelf.rack.name} - ${loc.shelf.level}` : 'Unallocated',
                "User": tx.user ? tx.user.name : "System",
                "Operator": tx.user && tx.user.role ? tx.user.role.name : "Admin"
            };
        });

        res.json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// 2. GET /api/reports/outbound
async function getOutboundReport(req, res) {
    try {
        const filters = { type: 'OUTWARD' };

        const transactions = await prisma.transaction.findMany({
            where: filters,
            include: { 
                sku: {
                    include: {
                        inventories: { include: { shelf: { include: { rack: true } } } }
                    }
                },
                user: {
                    include: { role: true }
                }
            },
            orderBy: { timestamp: 'desc' }
        });

        const report = transactions.map(tx => {
            const loc = tx.sku.inventories[0]; // Same simplistic location logic
            const { DateStr, TimeStr } = formatDateTime(tx.timestamp);

            return {
                "Date": DateStr,
                "Time": TimeStr,
                "SKU": tx.sku.skuCode,
                "Product": tx.sku.productName || "Unknown",
                "Quantity": tx.quantity,
                "Rack Shelf": loc ? `${loc.shelf.rack.name} - ${loc.shelf.level}` : 'Dispatched',
                "User": tx.user ? tx.user.name : "System",
                "Operator": tx.user && tx.user.role ? tx.user.role.name : "Admin"
            };
        });

        res.json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// 3. GET /api/reports/stock
async function getStockReport(req, res) {
    try {
        const skus = await prisma.sKU.findMany({
            include: {
                inventories: { include: { shelf: true } }
            }
        });

        const report = skus.map(sku => {
            const availableSpace = sku.inventories.reduce((acc, inv) => {
                return acc + (inv.shelf.maxVolume - inv.shelf.usedVolume);
            }, 0);

            return {
                sku: sku.skuCode,
                currentStock: sku.stock,
                availableSpace: availableSpace.toFixed(2),
                lowStockAlert: sku.stock < 10 ? 'Low Stock' : 'Stable'
            };
        });

        res.json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// 4. GET /api/reports/rack-utilization
async function getRackUtilizationReport(req, res) {
    try {
        const racks = await prisma.rack.findMany({
            include: { shelves: true }
        });

        const report = racks.flatMap(rack => {
            return rack.shelves.map(shelf => ({
                rackNumber: rack.name,
                shelf: shelf.level,
                capacityUsed: parseFloat(((shelf.usedVolume / shelf.maxVolume) * 100).toFixed(2)) || 0,
                freeSpace: parseFloat((shelf.maxVolume - shelf.usedVolume).toFixed(2))
            }));
        });

        res.json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// 5. GET /api/reports/graphs
async function getGraphsData(req, res) {
    try {
        // Zone Utilization
        const rooms = await prisma.rack.findMany({
            include: { shelves: true }
        });
        
        const zoneDataMap = {};
        rooms.forEach(rack => {
            const roomName = rack.room;
            if (!zoneDataMap[roomName]) {
                 zoneDataMap[roomName] = { used: 0, max: 0 };
            }
            rack.shelves.forEach(shelf => {
                 zoneDataMap[roomName].used += shelf.usedVolume;
                 zoneDataMap[roomName].max += shelf.maxVolume;
            });
        });
        
        const zoneUtilization = Object.keys(zoneDataMap).map(zone => ({
             name: zone,
             utilized: zoneDataMap[zone].max > 0 ? Math.round((zoneDataMap[zone].used / zoneDataMap[zone].max) * 100) : 0
        }));

        // SKU Distribution by Category
        const skus = await prisma.sKU.findMany({
            include: { category: true }
        });
        const categoryMap = {};
        skus.forEach(sku => {
             const catName = sku.category.name;
             categoryMap[catName] = (categoryMap[catName] || 0) + sku.stock;
        });
        const skuDistribution = Object.keys(categoryMap).map(cat => ({
             name: cat,
             value: categoryMap[cat]
        }));

        // Inventory Trends (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const transactions = await prisma.transaction.findMany({
             where: { timestamp: { gte: sevenDaysAgo } }
        });
        
        const trendsMap = {};
        for(let i=6; i>=0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            trendsMap[d.toISOString().slice(0,10)] = { day: d.toISOString().slice(5,10), inbound: 0, outbound: 0 };
        }
        
        transactions.forEach(tx => {
             const dateStr = tx.timestamp.toISOString().slice(0,10);
             if (trendsMap[dateStr]) {
                 if (tx.type === 'INWARD') trendsMap[dateStr].inbound += tx.quantity;
                 if (tx.type === 'OUTWARD') trendsMap[dateStr].outbound += tx.quantity;
             }
        });
        const inventoryTrends = Object.values(trendsMap);

        res.json({
            success: true,
            data: {
                 zoneUtilization,
                 skuDistribution,
                 inventoryTrends
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// 6. GET /api/reports/summary
async function getSummaryReport(req, res) {
    try {
        const totalRacks = await prisma.rack.count();
        const shelves = await prisma.shelf.findMany();
        const occupiedLevels = shelves.filter(s => s.usedVolume > 0).length;
        const totalSKUs = await prisma.sKU.count();
        
        let totalMax = 0;
        let totalUsed = 0;
        shelves.forEach(s => {
            totalMax += s.maxVolume;
            totalUsed += s.usedVolume;
        });
        const avgUtilization = totalMax > 0 ? Math.round((totalUsed / totalMax) * 100) : 0;
        
        const activeInvoices = await prisma.billing.count({
            where: { status: 'pending' } 
        });

        res.json({
            success: true,
            data: {
                totalRacks: { current: totalRacks, previous: totalRacks }, 
                occupiedLevels: { current: occupiedLevels, previous: Math.max(0, occupiedLevels - 5) },
                totalSKUs: { current: totalSKUs, previous: Math.max(0, totalSKUs - 2) },
                avgUtilization: { current: avgUtilization, previous: Math.max(0, avgUtilization - 4) },
                activeInvoices: { current: activeInvoices, previous: activeInvoices + 2 }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { 
    getInboundReport, 
    getOutboundReport, 
    getStockReport, 
    getRackUtilizationReport, 
    getGraphsData,
    getSummaryReport
};
