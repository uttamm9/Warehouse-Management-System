/**
 * rename-racks.js — One-time migration to update rack names
 * 
 * Naming Convention:
 *   Room1 (Shed 1): S1-R01 … S1-R20
 *   Room2 (Shed 2): S2-R01 … S2-R20
 *   Cabin:          C1-R01 … C1-R05
 *
 * Uses a two-phase rename to avoid unique constraint violations:
 *   Phase 1: rename to temporary names  (e.g., "__TEMP_S1-R01")
 *   Phase 2: rename from temp to final  (e.g., "S1-R01")
 *
 * Run:  node desktop/rename-racks.js
 */
const { PrismaClient } = require('./prisma');
const prisma = new PrismaClient();

const ROOM_PREFIX = {
    Room1: 'S1',
    Room2: 'S2',
    Cabin: 'C1',
};

async function main() {
    console.log('╔══════════════════════════════════════════╗');
    console.log('║   Rack Rename Migration                  ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log();

    // Fetch all racks ordered by room and current name
    const racks = await prisma.rack.findMany({
        orderBy: [{ room: 'asc' }, { name: 'asc' }],
    });

    console.log(`Found ${racks.length} racks total.\n`);

    // Group racks by room
    const grouped = {};
    for (const rack of racks) {
        if (!grouped[rack.room]) grouped[rack.room] = [];
        grouped[rack.room].push(rack);
    }

    // Build rename plan
    const renamePlan = []; // { id, oldName, tempName, newName }

    for (const [room, roomRacks] of Object.entries(grouped)) {
        const prefix = ROOM_PREFIX[room];
        if (!prefix) {
            console.warn(`⚠ Unknown room "${room}", skipping ${roomRacks.length} rack(s).`);
            continue;
        }

        roomRacks.forEach((rack, index) => {
            const seq = String(index + 1).padStart(2, '0');
            const newName = `${prefix}-R${seq}`;
            const tempName = `__TEMP_${newName}`;

            renamePlan.push({
                id: rack.id,
                oldName: rack.name,
                tempName,
                newName,
                skip: rack.name === newName, // Already correct
            });
        });
    }

    // Report
    const toRename = renamePlan.filter(r => !r.skip);
    const alreadyCorrect = renamePlan.filter(r => r.skip);

    console.log('Rename Plan:');
    console.log('─'.repeat(50));
    for (const entry of renamePlan) {
        const tag = entry.skip ? '  (already correct)' : '';
        console.log(`  ${entry.oldName.padEnd(16)} → ${entry.newName}${tag}`);
    }
    console.log('─'.repeat(50));
    console.log(`  ${toRename.length} rename(s) needed, ${alreadyCorrect.length} already correct.\n`);

    if (toRename.length === 0) {
        console.log('✓ Nothing to do — all racks already have the correct names.');
        return;
    }

    // Execute in a transaction with two phases
    await prisma.$transaction(async (tx) => {
        // Phase 1: Rename to temporary names
        console.log('Phase 1: Renaming to temporary names...');
        for (const entry of toRename) {
            await tx.rack.update({
                where: { id: entry.id },
                data: { name: entry.tempName },
            });
        }
        console.log(`  ✓ ${toRename.length} rack(s) renamed to temp names.\n`);

        // Phase 2: Rename to final names
        console.log('Phase 2: Applying final names...');
        for (const entry of toRename) {
            await tx.rack.update({
                where: { id: entry.id },
                data: { name: entry.newName },
            });
        }
        console.log(`  ✓ ${toRename.length} rack(s) renamed to final names.\n`);
    }, {
        maxWait: 30000,
        timeout: 120000
    });

    // Verify
    console.log('Verification:');
    const updatedRacks = await prisma.rack.findMany({
        orderBy: [{ room: 'asc' }, { name: 'asc' }],
        select: { name: true, room: true },
    });

    for (const rack of updatedRacks) {
        console.log(`  ${rack.room.padEnd(8)} ${rack.name}`);
    }

    // Check for duplicates
    const names = updatedRacks.map(r => r.name);
    const uniqueNames = new Set(names);
    if (uniqueNames.size !== names.length) {
        console.error('\n✗ DUPLICATE NAMES DETECTED! Something went wrong.');
        process.exit(1);
    }

    console.log(`\n✓ Migration complete. ${toRename.length} rack(s) renamed successfully.`);
}

main()
    .catch(e => {
        console.error('✗ Migration failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
