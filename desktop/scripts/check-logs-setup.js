/**
 * System Logs Diagnostics Script
 * 
 * Run this from: node desktop/scripts/check-logs-setup.js
 * 
 * This script checks:
 * - Database connection
 * - SystemLog table existence
 * - Migration status
 * - Prisma generate status
 */

const path = require('path');
require('dotenv').config();

async function runDiagnostics() {
    console.log('\n====================================');
    console.log('System Logs Setup Diagnostics');
    console.log('====================================\n');

    // 1. Check environment
    console.log('1. Checking environment...');
    console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ NOT SET');
    console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');

    // 2. Check Prisma client
    console.log('\n2. Checking Prisma client...');
    try {
        const { prisma } = require('./db.js');
        console.log('   ✓ Prisma client imported successfully');

        // Test connection
        try {
            await prisma.$queryRaw`SELECT 1`;
            console.log('   ✓ Database connection successful');
        } catch (err) {
            console.log('   ✗ Database connection failed:', err.message);
            return;
        }
    } catch (err) {
        console.log('   ✗ Failed to import Prisma client:', err.message);
        return;
    }

    // 3. Check SystemLog table
    console.log('\n3. Checking SystemLog table...');
    try {
        const { prisma } = require('./db.js');

        const result = await prisma.systemLog.findFirst().catch(err => {
            if (err.code === 'P3007') {
                return null; // Table doesn't exist
            }
            throw err;
        });

        if (result === null && result !== undefined) {
            console.log('   ✗ SystemLog table does NOT exist');
            console.log('   → Run: npx prisma migrate deploy');
        } else {
            const count = await prisma.systemLog.count();
            console.log('   ✓ SystemLog table exists');
            console.log('   ✓ Current log count:', count);
        }
    } catch (err) {
        if (err.message.includes('does not exist') || err.code === 'P3007') {
            console.log('   ✗ SystemLog table does NOT exist');
            console.log('   → Run: npx prisma migrate deploy');
        } else {
            console.log('   ✗ Error checking table:', err.message);
        }
    }

    // 4. Check logs controller
    console.log('\n4. Checking Logs Controller...');
    try {
        const logsController = require('./controllers/logs.controller.js');
        console.log('   ✓ logs.controller.js imported successfully');
        console.log('   ✓ Functions available:', Object.keys(logsController).join(', '));
    } catch (err) {
        console.log('   ✗ Failed to import logs controller:', err.message);
    }

    // 5. Test creating a log
    console.log('\n5. Testing log creation...');
    try {
        const { createLog } = require('./controllers/logs.controller.js');
        const result = await createLog({
            user: 'System',
            action: 'ConfigChanged',
            item: 'TEST-001',
            details: 'Diagnostic test log',
            status: 'info'
        });

        if (result.success) {
            console.log('   ✓ Successfully created test log');
            console.log('   ✓ Log ID:', result.data.id);
        } else {
            console.log('   ✗ Failed to create log:', result.message);
        }
    } catch (err) {
        console.log('   ✗ Error creating log:', err.message);
    }

    // 6. Test fetching logs
    console.log('\n6. Testing log fetch...');
    try {
        const { getLogs } = require('./controllers/logs.controller.js');
        const result = await getLogs({ page: 1, limit: 5 });

        if (result.success) {
            console.log('   ✓ Successfully fetched logs');
            console.log('   ✓ Total logs:', result.data.pagination.totalCount);
            console.log('   ✓ Returned logs:', result.data.logs.length);
        } else {
            console.log('   ✗ Failed to fetch logs:', result.message);
        }
    } catch (err) {
        console.log('   ✗ Error fetching logs:', err.message);
    }

    console.log('\n====================================');
    console.log('Diagnostics Complete');
    console.log('====================================\n');
}

runDiagnostics().catch(console.error);
