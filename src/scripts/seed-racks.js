// src/scripts/seed-racks.js
const { PrismaClient } = require('../../desktop/prisma');
const prisma = new PrismaClient();

const ROOMS = ['Room1', 'Room2'];
const SHELF_LEVELS = ['A', 'B', 'C', 'D'];

// Shelf Constraints
const SHELF_WIDTH = 1500; // mm
const SHELF_DEPTH = 450;  // mm
const SHELF_HEIGHT = 2100; // mm
const MAX_VOLUME = SHELF_WIDTH * SHELF_DEPTH * SHELF_HEIGHT; // mm^3
const MAX_WEIGHT = 100; // kg UDL

const ROOM_PREFIX = { Room1: 'S1', Room2: 'S2' };

async function seedRacks() {
    console.log('Seeding Racks & Shelves...');

    for (const room of ROOMS) {
        const prefix = ROOM_PREFIX[room];
        for (let i = 1; i <= 10; i++) { // 10 racks per room = 20 total
            const rackName = `${prefix}-R${String(i).padStart(2, '0')}`;

            const rack = await prisma.rack.create({
                data: {
                    name: rackName,
                    room: room,
                    shelves: {
                        create: SHELF_LEVELS.map(level => ({
                            level: level,
                            maxVolume: MAX_VOLUME,
                            maxWeight: MAX_WEIGHT,
                            usedVolume: 0,
                            usedWeight: 0
                        }))
                    }
                }
            });
            console.log(`Created ${rackName} in ${room} with 4 shelves.`);
        }
    }
    console.log('Racks seeding complete.');
}

seedRacks()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
