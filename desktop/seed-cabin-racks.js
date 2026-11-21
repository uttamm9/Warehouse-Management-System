const { PrismaClient } = require('./prisma');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Cabin Room racks...');

    // Need 5 racks: C1-R01 to C1-R05
    // 1 Main, 4 Add-On - this is a physical distinction but data-wise they might just be Racks.
    // Dimensions: Height: 2500 mm, Length: 900 mm, Depth: 450 mm
    // Load Capacity: 200 KG per level
    // Volume per level: 900 * 450 * (2500 / 4) roughly, wait, standard is just maxVolume / maxWeight.
    // For Shed 1 & 2 racks, volume was 1500 * 450 * 2400 or something (Wait, the schema says: 1500 * 450 * 2400 (mm^3) just as an example).
    // Let's use 900 * 450 * (2500 / 4) for level maxVolume = 900 * 450 * 625 = 253,125,000 mm^3.
    // Or let's just make it big enough maybe 253125000.
    
    for (let i = 1; i <= 5; i++) {
        const rackName = `C1-R${String(i).padStart(2, '0')}`;
        
        // Remove existing if any (for idempotency)
        const existingRack = await prisma.rack.findUnique({ where: { name: rackName } });
        if (existingRack) {
            console.log(`Rack ${rackName} already exists, skipping...`);
            continue;
        }

        const newRack = await prisma.rack.create({
            data: {
                name: rackName,
                room: 'Cabin'
            }
        });

        // Add 4 shelves (levels A, B, C, D)
        const levels = ['A', 'B', 'C', 'D'];
        for (const level of levels) {
            await prisma.shelf.create({
                data: {
                    rackId: newRack.id,
                    level: level,
                    maxVolume: 900 * 450 * 625, // 253125000
                    maxWeight: 200 // 200 KG
                }
            });
        }
        
        console.log(`Created Rack ${rackName} with 4 levels (200KG each).`);
    }

    console.log('Seed complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
