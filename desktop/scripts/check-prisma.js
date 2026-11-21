/**
 * Check Prisma Client Generation
 * Run: node desktop/scripts/check-prisma.js
 */

const path = require('path');
require('dotenv').config();

async function check() {
    console.log('\n====== Prisma Client Check ======\n');

    // 1. Check Prisma imports
    console.log('1. Checking Prisma imports...');
    try {
        const prismaRequire = require('./prisma');
        console.log('   ✓ ./prisma imported');

        // Check if PrismaClient is available
        if (prismaRequire?.PrismaClient) {
            console.log('   ✓ PrismaClient class is available');
        } else {
            console.log('   ✗ PrismaClient class is NOT available');
            console.log('   ✗ Available exports:', Object.keys(prismaRequire));
        }
    } catch (err) {
        console.log('   ✗ Failed to import prisma:', err.message);
        console.log('   ✗ This means prisma files need to be generated');
    }

    // 2. Check db.js
    console.log('\n2. Checking db.js...');
    try {
        const db = require('./db.js');
        console.log('   ✓ ./db.js imported');
        console.log('   ✓ Exports:', Object.keys(db));

        if (db.prisma) {
            console.log('   ✓ prisma object available');
            console.log('   ✓ Prisma object keys:', Object.keys(db.prisma).slice(0, 10), '...');

            // Check if systemLog exists
            if (db.prisma.systemLog) {
                console.log('   ✓ db.prisma.systemLog is AVAILABLE ✓✓✓');
            } else {
                console.log('   ✗ db.prisma.systemLog is NOT available');
                console.log('   ✗ This means Prisma client needs to be regenerated');
            }
        } else {
            console.log('   ✗ prisma object NOT available');
        }
    } catch (err) {
        console.log('   ✗ Failed to import db.js:', err.message);
    }

    // 3. List prisma directory
    console.log('\n3. Checking prisma directory contents...');
    try {
        const fs = require('fs');
        const dir = './prisma';
        const files = fs.readdirSync(dir);
        console.log('   Files in ./prisma:', files);
    } catch (err) {
        console.log('   ✗ Error reading prisma directory:', err.message);
    }

    // 4. Check migration status
    console.log('\n4. Checking migrations...');
    try {
        const fs = require('fs');
        const migDir = './prisma/migrations';
        const migs = fs.readdirSync(migDir).filter(f => !f.startsWith('.'));
        console.log('   ✓ Migrations found:', migs);
    } catch (err) {
        console.log('   ✗ Error reading migrations:', err.message);
    }

    console.log('\n====== Next Steps ======\n');
    console.log('If systemLog is NOT available, run:\n');
    console.log('  1. npx prisma generate');
    console.log('  2. npx prisma migrate deploy');
    console.log('  3. Restart backend\n');

    process.exit(0);
}

check().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
