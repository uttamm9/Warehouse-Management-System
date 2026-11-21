/**
 * Quick Test - Verify System Logs Setup
 * Run from: node desktop/scripts/test-logs.js
 */

const path = require('path');
require('dotenv').config();

async function test() {
    console.log('\n==== System Logs Test ====\n');

    // 1. Test Prisma connection
    console.log('1. Testing Prisma connection...');
    let prisma;
    try {
        const db = require('./db.js');
        prisma = db.prisma;

        await prisma.$queryRaw`SELECT 1`;
        console.log('   ✓ Prisma connected\n');
    } catch (err) {
        console.log('   ✗ Prisma test failed:', err.message, '\n');
        process.exit(1);
    }

    // 2. Check if table exists by trying to query it
    console.log('2. Checking if SystemLog table exists...');
    try {
        const count = await prisma.systemLog.count();
        console.log('   ✓ SystemLog table exists');
        console.log('   ✓ Current log count:', count, '\n');
    } catch (err) {
        if (err.code === 'P3007' || err.message.includes('does not exist')) {
            console.log('   ✗ SystemLog table DOES NOT EXIST');
            console.log('\n   SOLUTION: Run this command:');
            console.log('   → npx prisma migrate deploy\n');
        } else {
            console.log('   ✗ Error:', err.message);
            console.log('   ✗ Error code:', err.code, '\n');
        }
        process.exit(1);
    }

    // 3. Test creating a log
    console.log('3. Testing log creation...');
    try {
        const log = await prisma.systemLog.create({
            data: {
                user: 'System',
                action: 'ConfigChanged',
                item: 'TEST-001',
                details: 'Test log',
                status: 'info'
            }
        });
        console.log('   ✓ Created test log');
        console.log('   ✓ Log ID:', log.id, '\n');
    } catch (err) {
        console.log('   ✗ Error:', err.message);
        console.log('   ✗ Error code:', err.code, '\n');
    }

    // 4. Test fetching logs
    console.log('4. Testing log fetch...');
    try {
        const logs = await prisma.systemLog.findMany({ take: 5 });
        console.log('   ✓ Fetched logs:', logs.length);
        console.log('   ✓ Sample:', logs[0] ? { id: logs[0].id, user: logs[0].user } : 'none', '\n');
    } catch (err) {
        console.log('   ✗ Error:', err.message, '\n');
    }

    // 5. Test logs controller
    console.log('5. Testing logs controller...');
    try {
        const { getLogs } = require('./controllers/logs.controller.js');
        console.log('   Calling getLogs({ page: 1, limit: 5 })...');
        const result = await getLogs({ page: 1, limit: 5 });

        console.log('   Response received:');
        console.log('   - success:', result.success);
        console.log('   - message:', result.message);
        console.log('   - code:', result.code);

        if (result.success) {
            console.log('   ✓ getLogs returned success');
            console.log('   ✓ Total logs:', result.data.pagination.totalCount);
            console.log('   ✓ Status counts:', result.data.summaryCounts, '\n');
        } else {
            console.log('   ✗ getLogs error:', result.message);
            console.log('   ✗ Full response:', JSON.stringify(result, null, 2), '\n');
        }
    } catch (err) {
        console.log('   ✗ Exception thrown:', err.message);
        console.log('   ✗ Stack:', err.stack, '\n');
    }

    console.log('==== Test Complete ====\n');
    process.exit(0);
}

test().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
