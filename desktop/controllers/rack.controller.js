// desktop/controllers/rack.controller.js
const { prisma } = require('../db.js');

async function getRackMonitoring() {
    try {
        const racks = await prisma.rack.findMany({
            include: {
                shelves: {
                    include: {
                        inventories: {
                            include: { sku: true }
                        }
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        // Restructure Data by Room
        const roomsMap = { Room1: [], Room2: [], Cabin: [] };

        racks.forEach(rack => {
            const mappedShelves = rack.shelves.map(shelf => {
                const freeVolume = shelf.maxVolume - shelf.usedVolume;
                const occupancyPercent = ((shelf.usedVolume / shelf.maxVolume) * 100).toFixed(2);

                return {
                    id: shelf.id,
                    level: shelf.level,
                    maxVolume: shelf.maxVolume,
                    usedVolume: shelf.usedVolume,
                    freeVolume: freeVolume,
                    occupancyPercent: parseFloat(occupancyPercent),
                    maxWeight: shelf.maxWeight,
                    usedWeight: shelf.usedWeight,
                    skus: shelf.inventories.map(inv => ({
                        id: inv.id,
                        skuCode: inv.sku.skuCode,
                        productName: inv.sku.productName,
                        quantity: inv.quantity
                    }))
                };
            });

            roomsMap[rack.room].push({
                rackId: rack.id,
                rackName: rack.name,
                shelves: mappedShelves
            });
        });

        const responseTemplate = Object.keys(roomsMap).map(roomName => ({
            room: roomName,
            racks: roomsMap[roomName]
        }));

        return { success: true, data: responseTemplate };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Server error' };
    }
}

/**
 * Get all racks with levels for dropdown in Inbound Inventory
 * Used for dynamic rack selection and level display
 */
async function getAllRacks() {
    try {
        const racks = await prisma.rack.findMany({
            include: {
                shelves: true
            },
            orderBy: { name: 'asc' }
        });

        const formattedRacks = racks.map(rack => ({
            rackId: rack.id,
            rackName: rack.name,
            rackLabel: `${rack.name} — ${rack.room === 'Room1' ? 'Shed 1 (Main)' : rack.room === 'Room2' ? 'Shed 2' : 'Cabin Room'}`,
            shelves: rack.shelves.map(shelf => {
                const freeVolume = shelf.maxVolume - shelf.usedVolume;
                const occupancyPercent = ((shelf.usedVolume / shelf.maxVolume) * 100).toFixed(2);
                const occupancyPercentNum = parseFloat(occupancyPercent);

                // Determine status: Empty (no volume/weight used), Full (some volume/weight used)
                let status = 'empty';
                if (shelf.usedVolume > 0 || shelf.usedWeight > 0) {
                    status = 'full';
                }

                return {
                    shelfId: shelf.id,
                    level: shelf.level,
                    levelLabel: `L${shelf.level}`,
                    maxVolume: shelf.maxVolume,
                    usedVolume: shelf.usedVolume,
                    freeVolume: freeVolume,
                    occupancyPercent: occupancyPercentNum,
                    status: status
                };
            })
        }));

        return { success: true, data: formattedRacks };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Server error fetching racks' };
    }
}

/**
 * Get sensor mapping for a specific rack
 * GET /api/racks/sensor-mapping/:rackName
 */
async function getSensorMapping(req, res) {
    try {
        const { rackName } = req.params;
        const rackSensorService = require('../services/rackSensor.service.js');

        const mapping = rackSensorService.getSensorMapping(rackName);

        if (!mapping) {
            return res.status(404).json({
                success: false,
                message: `Rack ${rackName} not found in sensor mapping`
            });
        }

        res.json({
            success: true,
            data: {
                rackName,
                ...mapping
            }
        });
    } catch (error) {
        console.error('[Rack Controller] Get sensor mapping error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Test a rack sensor
 * POST /api/racks/test-sensor
 * Body: { rackName: string }
 */
async function testRackSensor(req, res) {
    try {
        const { rackName } = req.body;

        if (!rackName) {
            return res.status(400).json({
                success: false,
                message: 'rackName is required'
            });
        }

        const rackSensorService = require('../services/rackSensor.service.js');

        const result = await rackSensorService.testRackSensor(rackName);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('[Rack Controller] Test sensor error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { getRackMonitoring, getAllRacks, getSensorMapping, testRackSensor };
