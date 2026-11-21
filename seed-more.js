const { PrismaClient } = require('./desktop/prisma');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding racks S1-R11..R20 and S2-R11..R20...');

    // Shed 1 (Room1): Adding S1-R11 to S1-R20
    for (let i = 11; i <= 20; i++) {
        const rackName = `S1-R${i}`;
        
        const existingRack = await prisma.rack.findUnique({ where: { name: rackName } });
        if (existingRack) {
            console.log(`Rack ${rackName} already exists, skipping...`);
            continue;
        }

        const newRack = await prisma.rack.create({
            data: {
                name: rackName,
                room: 'Room1'
            }
        });

        // Add 4 shelves (levels A, B, C, D)
        const levels = ['A', 'B', 'C', 'D'];
        for (const level of levels) {
            await prisma.shelf.create({
                data: {
                    rackId: newRack.id,
                    level: level,
                    maxVolume: 1500 * 450 * 600, // standard volume
                    maxWeight: 300 // 300 KG per level
                }
            });
        }
        console.log(`Created Rack ${rackName} with 4 levels (300KG each).`);
    }

    // Shed 2 (Room2): Adding S2-R11 to S2-R20
    for (let i = 11; i <= 20; i++) {
        const rackName = `S2-R${i}`;
        
        const existingRack = await prisma.rack.findUnique({ where: { name: rackName } });
        if (existingRack) {
            console.log(`Rack ${rackName} already exists, skipping...`);
            continue;
        }

        const newRack = await prisma.rack.create({
            data: {
                name: rackName,
                room: 'Room2'
            }
        });

        // Add 4 shelves (levels A, B, C, D)
        const levels = ['A', 'B', 'C', 'D'];
        for (const level of levels) {
            await prisma.shelf.create({
                data: {
                    rackId: newRack.id,
                    level: level,
                    maxVolume: 1500 * 450 * 600, // standard volume
                    maxWeight: 300 // 300 KG per level
                }
            });
        }
        console.log(`Created Rack ${rackName} with 4 levels (300KG each).`);
    }

    console.log('Seed more racks complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
