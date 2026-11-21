// src/controllers/rack.controller.js
const { PrismaClient } = require('../../desktop/prisma');
const prisma = new PrismaClient();

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
            }
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

module.exports = { getRackMonitoring };
