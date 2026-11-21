const { PrismaClient } = require('./prisma');
require("dotenv").config()

// Create a singleton instance of Prisma Client
let prisma = null;
let restorePromise = null;
let isRestoring = false;

async function checkAndRestorePermissions(db) {
  if (isRestoring) return;
  if (!restorePromise) {
    restorePromise = (async () => {
      isRestoring = true;
      try {
        const MODULE_NAMES = [
          'Dashboard',
          'Scan Barcode',
          'Warehouse Layout',
          'Rack Monitoring',
          'Inbound Inventory',
          'Outbound Inventory',
          'SKU Management',
          'Conveyor Control',
          'Reports',
          'Billing',
          'System Logs',
          'Settings',
          'Roles & Permissions',
          'User Management'
        ];
        const existingCount = await db.module.count();
        if (existingCount !== MODULE_NAMES.length) {
          console.log('[DB] Modules count mismatch (found ' + existingCount + ', expected ' + MODULE_NAMES.length + '). Auto-restoring default permissions...');
          
          await db.permission.deleteMany({});
          await db.module.deleteMany({});
          
          const moduleCache = {};
          for (const name of MODULE_NAMES) {
            const mod = await db.module.create({ data: { name } });
            moduleCache[name] = mod.id;
          }
          
          const roleNames = ['ADMIN', 'MANAGER', 'STAFF'];
          const roleCache = {};
          for (const name of roleNames) {
            let role = await db.role.findUnique({ where: { name } });
            if (!role) {
              role = await db.role.create({ data: { name } });
            }
            roleCache[name] = role.id;
          }
          
          // ADMIN permissions
          for (const m of MODULE_NAMES) {
            await db.permission.create({
              data: {
                roleId: roleCache['ADMIN'],
                moduleId: moduleCache[m],
                canView: true, canCreate: true, canEdit: true, canDelete: true
              }
            });
          }
          
          // MANAGER permissions
          const managerWrite = ['Dashboard', 'Warehouse Layout', 'Rack Monitoring', 'Conveyor Control', 'Inbound Inventory', 'Outbound Inventory', 'SKU Management'];
          const managerRead = ['Scan Barcode', 'Reports'];
          for (const m of MODULE_NAMES) {
            await db.permission.create({
              data: {
                roleId: roleCache['MANAGER'],
                moduleId: moduleCache[m],
                canView: managerWrite.includes(m) || managerRead.includes(m),
                canCreate: managerWrite.includes(m),
                canEdit: managerWrite.includes(m),
                canDelete: false
              }
            });
          }
          
          // STAFF permissions
          const staffWrite = ['Dashboard', 'Inbound Inventory', 'Outbound Inventory', 'SKU Management', 'Scan Barcode'];
          for (const m of MODULE_NAMES) {
            await db.permission.create({
              data: {
                roleId: roleCache['STAFF'],
                moduleId: moduleCache[m],
                canView: staffWrite.includes(m),
                canCreate: staffWrite.includes(m),
                canEdit: false,
                canDelete: false
              }
            });
          }
          console.log('[DB] Permissions and modules restored successfully!');
        }
      } catch (err) {
        console.error('[DB] Auto-restore permissions failed:', err.message);
        restorePromise = null; // Allow retry
      } finally {
        isRestoring = false;
      }
    })();
  }
  return restorePromise;
}

function getPrismaClient() {
  if (!prisma) {
    const isDev = process.env.NODE_ENV === 'development';

    console.log('[DB] Creating new PrismaClient instance...');
    prisma = new PrismaClient({
      log: isDev ? ['warn', 'error'] : ['error'],
      errorFormat: 'pretty',
    });

    console.log('[DB] PrismaClient created successfully');

    // Register query middleware
    prisma.$use(async (params, next) => {
      await checkAndRestorePermissions(prisma);
      return next(params);
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('[DB] SIGINT received, disconnecting...');
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('[DB] SIGTERM received, disconnecting...');
      await prisma.$disconnect();
      process.exit(0);
    });
  }
  return prisma;
}

async function initializeDatabase() {
  try {
    const db = getPrismaClient();

    // Test connection
    console.log('[DB] Testing database connection...');
    await db.$queryRaw`SELECT 1`;
    console.log('[DB] ✓ Database connection successful');

    await checkAndRestorePermissions(db);

    // For SQLite, ensure database file exists and is accessible
    const dbUrl = process.env.DATABASE_URL || '';
    if (dbUrl.startsWith('file:')) {
      const dbPath = dbUrl.replace('file:', '').split('?')[0];

      // Check if database file exists
      if (fs.existsSync(dbPath)) {
        console.log('[DB] Database file found:', dbPath);
      } else {
        console.warn('[DB] Database file not found, Prisma will create it:', dbPath);
      }

      // Verify file permissions
      try {
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          console.log('[DB] Created database directory:', dir);
        }

        // Test write access
        fs.accessSync(dir, fs.constants.W_OK);
        console.log('[DB] ✓ Database directory is writable');
      } catch (err) {
        console.error('[DB] Database directory permission error:', err.message);
        throw new Error(`Database directory is not writable: ${dir}`);
      }
    }

    return db;
  } catch (error) {
    console.error('[DB] Database initialization failed:', {
      message: error?.message,
      code: error?.code,
      database_url: process.env.DATABASE_URL ? 'set' : 'not set'
    });
    throw error;
  }
}

async function ensureDatabaseReady() {
  try {
    const db = getPrismaClient();

    // Run a simple query to ensure database is responsive
    await db.$queryRaw`SELECT 1`;
    console.log('[DB] Database is ready');

    return true;
  } catch (error) {
    console.error('[DB] Database not ready:', error?.message);
    return false;
  }
}

// Graceful disconnect
async function disconnectDatabase() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    console.log('[DB] Database disconnected');
  }
}

module.exports = {
  prisma: getPrismaClient(),
  initializeDatabase,
  ensureDatabaseReady,
  disconnectDatabase,
};
