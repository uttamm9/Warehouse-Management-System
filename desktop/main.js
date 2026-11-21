const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost';

// ========================
// Load .env for Production (dotenv not auto-loaded in packaged app)
// ========================
function loadEnv() {
    if (!isDev) {
        // In production, .env is placed in resources/ via extraResources
        const envPath = path.join(process.resourcesPath, '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            envContent.split('\n').forEach(line => {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) return;
                const eqIdx = trimmed.indexOf('=');
                if (eqIdx === -1) return;
                const key = trimmed.substring(0, eqIdx).trim();
                const val = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
                if (key && !process.env[key]) {
                    process.env[key] = val;
                }
            });
            console.log('[ENV] Loaded .env from resources');
        } else {
            console.warn('[ENV] .env not found at:', envPath);
        }
    }
}

// ========================
// Set up Prisma Query Engine for Production
// ========================
if (!isDev) {
    // Primary: engine bundled alongside the generated prisma client in desktop/prisma
    const engineInDesktop = path.join(
        process.resourcesPath,
        "app.asar.unpacked",
        "desktop/prisma/query_engine-windows.dll.node"
    );
    // Fallback: engine from @prisma/engines package
    const engineInPrismaEngines = path.join(
        process.resourcesPath,
        "app.asar.unpacked",
        "node_modules/@prisma/engines/query_engine-windows.dll.node"
    );

    if (fs.existsSync(engineInDesktop)) {
        process.env.PRISMA_QUERY_ENGINE_LIBRARY = engineInDesktop;
        console.log('[PRISMA] Using engine from desktop/prisma');
    } else if (fs.existsSync(engineInPrismaEngines)) {
        process.env.PRISMA_QUERY_ENGINE_LIBRARY = engineInPrismaEngines;
        console.log('[PRISMA] Using engine from @prisma/engines');
    } else {
        console.error('[PRISMA] Query engine not found at either path!');
        console.error('[PRISMA] Tried:', engineInDesktop);
        console.error('[PRISMA] Tried:', engineInPrismaEngines);
    }
}

// Load env vars BEFORE requiring db.js
loadEnv();

const { prisma, initializeDatabase } = require('./db.js');
const { getRackMonitoring } = require('./controllers/rack.controller.js')
const { startExpressServer } = require('./expressServer.js');
const barcodeService = require('./barcode.service.js');

// ── PLC Service (loaded after other modules) ──────────────────────────────────
const plcService = require('./plc/plcService.js');
const plcConfig = require('./plc/plcConfig.js');
const plcLogger = require('./plc/plcLogger.js');

let dbInitError = null;

async function setupDB() {
    try {
        await initializeDatabase();
        console.log('[APP] Database initialized successfully');
    } catch (error) {
        dbInitError = error.message;
        console.error('[APP] Failed to initialize database:', error.message);
    }
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    mainWindow.maximize();

    if (isDev) {
        console.log("API Base URL:", API_BASE_URL);
        // mainWindow.loadURL('http://192.168.1.36:5173');
        mainWindow.loadURL(`http://localhost:5173`);
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(async () => {
    await setupDB();

    // Start Express API Server for Inbound Flow
    startExpressServer();

    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Setup IPC handlers
ipcMain.on('ping', () => console.log('pong'));

// Window controls
ipcMain.on('window-minimize', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.minimize();
});
ipcMain.on('window-maximize', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.isMaximized() ? win.unmaximize() : win.maximize();
});
ipcMain.on('window-close', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.close();
});

// Diagnostic: returns DB connection status and any startup error
ipcMain.handle('db-status', async () => {
    if (dbInitError) {
        return { connected: false, error: dbInitError, dbUrl: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@') : 'NOT SET' };
    }
    try {
        await prisma.$queryRaw`SELECT 1`;
        return { connected: true, dbUrl: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@') : 'NOT SET' };
    } catch (e) {
        return { connected: false, error: e.message, dbUrl: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@') : 'NOT SET' };
    }
});

ipcMain.handle('login', async (event, { email, password }) => {
    try {
        console.log('[LOGIN] Attempting login for:', email);

        // Validate inputs
        if (!email || !password) {
            return { success: false, message: 'Email and password are required' };
        }

        // Find user by email
        let user = null;
        try {
            user = await prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() },
                include: { role: true }
            });
        } catch (dbError) {
            console.error('[LOGIN] Database query error:', {
                message: dbError?.message,
                code: dbError?.code
            });
            return { success: false, message: `DB Error: ${dbError?.message || dbError?.code || 'Unknown error'}` };
        }

        // User not found
        if (!user) {
            console.log('[LOGIN] User not found:', email);
            return { success: false, message: 'Invalid email or password' };
        }

        // Check password
        let passwordValid = false;
        try {
            passwordValid = await bcrypt.compare(password, user.password);
        } catch (bcryptError) {
            console.error('[LOGIN] Password comparison error:', bcryptError?.message);
            return { success: false, message: 'Authentication failed. Please try again.' };
        }

        if (!passwordValid) {
            console.log('[LOGIN] Invalid password for:', email);
            return { success: false, message: 'Invalid email or password' };
        }

        // Fetch user permissions
        let permissions = [];
        try {
            permissions = await prisma.permission.findMany({
                where: { roleId: user.roleId },
                include: { module: true, role: true }
            });
        } catch (permError) {
            console.error('[LOGIN] Error fetching permissions:', permError?.message);
            // Don't fail login if permissions can't be fetched, just log warning
            console.warn('[LOGIN] Proceeding without permissions data');
        }

        console.log('[LOGIN] ✓ Login successful for:', email);
        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role?.name || 'GUEST'
            },
            permissions: permissions || []
        };
    } catch (error) {
        console.error('[LOGIN] ⚠️ Unexpected authentication error:', {
            message: error?.message,
            code: error?.code,
            email: email,
            stack: error?.stack
        });
        return { success: false, message: 'An error occurred during authentication' };
    }
});

// RBAC IPC Handlers
ipcMain.handle('get-modules', async () => {
    return await prisma.module.findMany({ orderBy: { name: 'asc' } });
});

ipcMain.handle('get-permissions', async (event, roleName) => {
    try {
        const role = await prisma.role.findUnique({ where: { name: roleName } });
        if (!role) return [];

        return await prisma.permission.findMany({
            where: { roleId: role.id },
            include: { module: true, role: true },
            orderBy: { module: { name: 'asc' } }
        });
    } catch (error) {
        console.error('Error fetching permissions:', error);
        return [];
    }
});

ipcMain.handle('update-permissions', async (event, permissionsData) => {
    try {
        // Array of { id, canView, canCreate, canEdit, canDelete }
        for (const p of permissionsData) {
            await prisma.permission.update({
                where: { id: p.id },
                data: {
                    canView: p.canView,
                    canCreate: p.canCreate,
                    canEdit: p.canEdit,
                    canDelete: p.canDelete
                }
            });
        }
        return { success: true };
    } catch (error) {
        console.error('Error updating permissions:', error);
        return { success: false, message: error.message };
    }
});

// ========================
// Role Management Handlers
// ========================

ipcMain.handle('get-roles', async () => {
    try {
        const roles = await prisma.role.findMany({ orderBy: { name: 'asc' } });
        return { success: true, roles };
    } catch (error) {
        console.error('Error fetching roles:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('create-role', async (event, { name, callerRole }) => {
    try {
        if (callerRole !== 'ADMIN') return { success: false, message: 'Only administrators can create roles' };
        if (!name || name.trim().length < 2) return { success: false, message: 'Role name must be at least 2 characters' };

        const roleName = name.trim().toUpperCase();
        const existing = await prisma.role.findUnique({ where: { name: roleName } });
        if (existing) return { success: false, message: 'Role already exists' };

        const role = await prisma.$transaction(async (tx) => {
            const newRole = await tx.role.create({ data: { name: roleName } });
            const modules = await tx.module.findMany();
            for (const m of modules) {
                await tx.permission.create({
                    data: {
                        roleId: newRole.id,
                        moduleId: m.id,
                        canView: false, canCreate: false, canEdit: false, canDelete: false
                    }
                });
            }
            return newRole;
        });
        return { success: true, role };
    } catch (error) {
        console.error('Error creating role:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('update-role', async (event, { roleId, name, callerRole }) => {
    try {
        if (callerRole !== 'ADMIN') return { success: false, message: 'Only administrators can update roles' };
        if (!name || name.trim().length < 2) return { success: false, message: 'Role name must be at least 2 characters' };

        const role = await prisma.role.findUnique({ where: { id: roleId } });
        if (!role) return { success: false, message: 'Role not found' };
        if (role.name === 'ADMIN') return { success: false, message: 'Cannot rename default ADMIN role' };

        const roleName = name.trim().toUpperCase();
        const existing = await prisma.role.findFirst({ where: { name: roleName, NOT: { id: roleId } } });
        if (existing) return { success: false, message: 'Role name already in use' };

        const updatedRole = await prisma.role.update({
            where: { id: roleId },
            data: { name: roleName }
        });
        return { success: true, role: updatedRole };
    } catch (error) {
        console.error('Error updating role:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('delete-role', async (event, { roleId, callerRole }) => {
    try {
        if (callerRole !== 'ADMIN') return { success: false, message: 'Only administrators can delete roles' };
        const role = await prisma.role.findUnique({ where: { id: roleId }, include: { _count: { select: { users: true } } } });
        if (!role) return { success: false, message: 'Role not found' };
        if (role.name === 'ADMIN') return { success: false, message: 'Default ADMIN role cannot be deleted' };
        if (role._count.users > 0) return { success: false, message: 'Cannot delete role because it is assigned to users' };

        await prisma.$transaction(async (tx) => {
            await tx.permission.deleteMany({ where: { roleId } });
            await tx.role.delete({ where: { id: roleId } });
        });
        return { success: true };
    } catch (error) {
        console.error('Error deleting role:', error);
        return { success: false, message: error.message };
    }
});

// ========================
// User Management Handlers
// ========================

ipcMain.handle('get-users', async () => {
    try {
        const rawUsers = await prisma.user.findMany({
            include: { role: true },
            orderBy: { createdAt: 'desc' }
        });
        const users = rawUsers.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role.name, createdAt: u.createdAt }));
        return { success: true, users };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('get-user', async (event, userId) => {
    try {
        const rawUser = await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true }
        });
        if (!rawUser) return { success: false, message: 'User not found' };
        const user = { id: rawUser.id, name: rawUser.name, email: rawUser.email, role: rawUser.role.name, createdAt: rawUser.createdAt };
        return { success: true, user };
    } catch (error) {
        console.error('Error fetching user:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('create-user', async (event, { name, email, password, role, callerRole }) => {
    try {
        // Authorization: only ADMIN can create users
        if (callerRole !== 'ADMIN') {
            return { success: false, message: 'Only administrators can create users' };
        }

        // Validation
        if (!name || name.trim().length < 2) {
            return { success: false, message: 'Name must be at least 2 characters' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return { success: false, message: 'Please provide a valid email address' };
        }
        if (!password || password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        // Check duplicate email
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return { success: false, message: 'A user with this email already exists' };
        }

        const targetRole = await prisma.role.findUnique({ where: { name: role } });
        if (!targetRole) return { success: false, message: 'Invalid role specified' };

        const hashedPassword = await bcrypt.hash(password, 10);
        const rawUser = await prisma.user.create({
            data: { name: name.trim(), email: email.toLowerCase().trim(), password: hashedPassword, roleId: targetRole.id },
            include: { role: true }
        });

        const user = { id: rawUser.id, name: rawUser.name, email: rawUser.email, role: rawUser.role.name, createdAt: rawUser.createdAt };
        return { success: true, user };
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('update-user', async (event, { userId, name, role, callerRole }) => {
    try {
        if (callerRole !== 'ADMIN') {
            return { success: false, message: 'Only administrators can update users' };
        }

        const targetRole = await prisma.role.findUnique({ where: { name: role } });
        if (!targetRole) return { success: false, message: 'Invalid role specified' };

        const rawUser = await prisma.user.update({
            where: { id: userId },
            data: { name: name.trim(), roleId: targetRole.id },
            include: { role: true }
        });
        const user = { id: rawUser.id, name: rawUser.name, email: rawUser.email, role: rawUser.role.name, createdAt: rawUser.createdAt };
        return { success: true, user };
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('delete-user', async (event, { userId, callerRole }) => {
    try {
        if (callerRole !== 'ADMIN') {
            return { success: false, message: 'Only administrators can delete users' };
        }
        await prisma.user.delete({ where: { id: userId } });
        return { success: true };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: error.message };
    }
});

// ========================
// Signup Handler
// ========================

ipcMain.handle('signup', async (event, { name, email, password }) => {
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return { success: false, message: 'Email already registered' };

        let defaultRole = await prisma.role.findFirst({ where: { name: 'ADMIN' } });
        if (!defaultRole) {
            defaultRole = await prisma.role.findFirst();
        }

        if (!defaultRole) {
            return { success: false, message: 'System error: No roles configured in the database.' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roleId: defaultRole.id
            },
            include: { role: true }
        });

        // Automatically load permissions so they are instantly logged into their new session
        const permissions = await prisma.permission.findMany({
            where: { roleId: user.roleId },
            include: { module: true, role: true }
        });

        return {
            success: true,
            user: { id: user.id, name: user.name, email: user.email, role: user.role.name },
            permissions
        };
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, message: 'An error occurred during account creation.' };
    }
});

// ========================
// Profile & Auth Handlers
// ========================

ipcMain.handle('get-me', async (event, { userId }) => {
    try {
        const rawUser = await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true }
        });
        if (!rawUser) return { success: false, message: 'User not found' };
        const user = { id: rawUser.id, name: rawUser.name, email: rawUser.email, role: rawUser.role.name, createdAt: rawUser.createdAt };
        return { success: true, user };
    } catch (error) {
        console.error('Error fetching profile:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('update-profile', async (event, { userId, name, email }) => {
    try {
        // Validation
        if (!name || name.trim().length < 2) {
            return { success: false, message: 'Name must be at least 2 characters' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return { success: false, message: 'Please provide a valid email address' };
        }

        // Check duplicate email (excluding current user)
        const existing = await prisma.user.findFirst({
            where: { email: email.toLowerCase().trim(), NOT: { id: userId } }
        });
        if (existing) {
            return { success: false, message: 'Email is already in use by another account' };
        }

        const rawUser = await prisma.user.update({
            where: { id: userId },
            data: { name: name.trim(), email: email.toLowerCase().trim() },
            include: { role: true }
        });

        const user = { id: rawUser.id, name: rawUser.name, email: rawUser.email, role: rawUser.role.name, createdAt: rawUser.createdAt };
        console.log(`[PROFILE] User ${userId} updated profile: name="${name}", email="${email}"`);
        return { success: true, user };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('reset-password', async (event, { userId, oldPassword, newPassword }) => {
    try {
        // Validation
        if (!oldPassword || !newPassword) {
            return { success: false, message: 'Both old and new passwords are required' };
        }
        if (newPassword.length < 6) {
            return { success: false, message: 'New password must be at least 6 characters' };
        }

        // Fetch user with password
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return { success: false, message: 'User not found' };

        // Verify old password
        const valid = await bcrypt.compare(oldPassword, user.password);
        if (!valid) {
            return { success: false, message: 'Current password is incorrect' };
        }

        // Hash and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        console.log(`[AUTH] User ${userId} reset their password`);
        return { success: true };
    } catch (error) {
        console.error('Error resetting password:', error);
        return { success: false, message: error.message };
    }
});

// ========================
// SKU & Inventory Handlers
// ========================

ipcMain.handle('get-rack-monitoring', async () => {
    return await getRackMonitoring();
});

ipcMain.handle('get-categories', async () => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, categories };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('create-category', async (event, { name }) => {
    try {
        if (!name || name.trim().length === 0) {
            return { success: false, message: 'Category name is required' };
        }
        const category = await prisma.category.create({
            data: { name: name.trim() }
        });
        return { success: true, category };
    } catch (error) {
        console.error('Error creating category:', error);
        if (error.code === 'P2002') return { success: false, message: 'Category already exists' };
        return { success: false, message: error.message };
    }
});

ipcMain.handle('update-category', async (event, { id, name, isActive }) => {
    try {
        if (!id) return { success: false, message: 'Category ID is required' };

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (isActive !== undefined) updateData.isActive = isActive;

        const category = await prisma.$transaction(async (tx) => {
            const updatedCat = await tx.category.update({
                where: { id },
                data: updateData
            });

            // Synchronize subcategories if category is marked inactive
            if (isActive === false) {
                await tx.subCategory.updateMany({
                    where: { categoryId: id },
                    data: { isActive: false }
                });
            }
            return updatedCat;
        });

        return { success: true, category };
    } catch (error) {
        console.error('Error updating category:', error);
        if (error.code === 'P2002') return { success: false, message: 'Category name already exists' };
        return { success: false, message: error.message };
    }
});

ipcMain.handle('get-subcategories', async (event, categoryId) => {
    try {
        const whereClause = categoryId ? { categoryId } : {};
        const subcategories = await prisma.subCategory.findMany({
            where: whereClause,
            include: { category: true },
            orderBy: { name: 'asc' }
        });
        return { success: true, subcategories };
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('create-subcategory', async (event, { name, categoryId }) => {
    try {
        if (!name || !categoryId) {
            return { success: false, message: 'Name and Category are required' };
        }

        const parentCat = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!parentCat) {
            return { success: false, message: 'Parent category not found' };
        }
        if (!parentCat.isActive) {
            return { success: false, message: 'Cannot create a subcategory under an inactive category' };
        }

        const subCategory = await prisma.subCategory.create({
            data: {
                name: name.trim(),
                categoryId
            },
            include: { category: true }
        });
        return { success: true, subCategory };
    } catch (error) {
        console.error('Error creating subcategory:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('update-subcategory', async (event, { id, name, categoryId, isActive }) => {
    try {
        if (!id) return { success: false, message: 'Subcategory ID is required' };

        // If activating, ensure parent category is active
        if (isActive === true) {
            const currentSub = await prisma.subCategory.findUnique({ where: { id }, select: { categoryId: true } });
            const currentCatId = categoryId || currentSub.categoryId;
            const parentCat = await prisma.category.findUnique({ where: { id: currentCatId } });
            if (!parentCat.isActive) {
                return { success: false, message: 'Cannot activate subcategory because its parent category is inactive' };
            }
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (categoryId !== undefined) updateData.categoryId = categoryId;
        if (isActive !== undefined) updateData.isActive = isActive;

        const subCategory = await prisma.subCategory.update({
            where: { id },
            data: updateData,
            include: { category: true }
        });

        return { success: true, subCategory };
    } catch (error) {
        console.error('Error updating subcategory:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('get-skus', async () => {
    try {
        const skus = await prisma.sKU.findMany({
            include: { category: true, subCategory: true },
            orderBy: { createdAt: 'desc' }
        });
        // Format response to match frontend expectations
        const formattedSkus = skus.map(s => ({
            ...s,
            categoryName: s.category.name,
            subCategoryName: s.subCategory.name,
            dimensions: `${s.length}*${s.width}*${s.height}`,
            rackLocation: s.rackLocation || null
        }));
        return { success: true, skus: formattedSkus };
    } catch (error) {
        console.error('Error fetching SKUs:', error);
        return { success: false, message: error.message };
    }
});

// Auto-generate SKU Code helper
async function generateNextSkuCode() {
    const lastSku = await prisma.sKU.findFirst({
        orderBy: { createdAt: 'desc' },
    });
    if (!lastSku || !lastSku.skuCode) return 'SKU-1001';

    const match = lastSku.skuCode.match(/SKU-(\d+)/);
    if (match) {
        const nextNum = parseInt(match[1], 10) + 1;
        return `SKU-${nextNum}`;
    }
    return `SKU-${Math.floor(Math.random() * 10000)}`;
}

ipcMain.handle('create-sku', async (event, { productName, categoryId, subCategoryId, weight, dimensions, stock }) => {
    try {
        // Basic validation
        if (!productName || !categoryId || !subCategoryId || !weight || !dimensions) {
            return { success: false, message: 'Missing required fields' };
        }

        // Validate category and subcategory
        const category = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!category || !category.isActive) {
            return { success: false, message: 'Selected category is invalid or inactive' };
        }

        const subCategory = await prisma.subCategory.findUnique({ where: { id: subCategoryId } });
        if (!subCategory || !subCategory.isActive || subCategory.categoryId !== categoryId) {
            return { success: false, message: 'Selected subcategory is invalid or inactive' };
        }

        const skuCode = await generateNextSkuCode();

        // Generate unique barcode
        const barcode = await barcodeService.generateUniqueBarcode();

        let l = 0, w = 0, h = 0;
        if (dimensions) {
            const parts = dimensions.split('*').map(Number);
            l = parts[0] || 0;
            w = parts[1] || 0;
            h = parts[2] || 0;
        }

        const sku = await prisma.sKU.create({
            data: {
                skuCode,
                barcode,
                barcodeFormat: 'CODE128',
                productName: productName.trim(),
                categoryId,
                subCategoryId,
                weight: parseFloat(weight) || 0,
                length: l,
                width: w,
                height: h,
                stock: parseInt(stock, 10) || 0
            },
            include: { category: true, subCategory: true }
        });

        console.log(`[INVENTORY] Created SKU: ${sku.skuCode} - ${sku.productName} with Barcode: ${sku.barcode}`);
        return { success: true, sku };
    } catch (error) {
        console.error('Error creating SKU:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('update-sku', async (event, { id, productName, categoryId, subCategoryId, weight, dimensions, stock }) => {
    try {
        const dataToUpdate = {
            productName: productName?.trim(),
            weight: weight !== undefined ? parseFloat(weight) : undefined,
            stock: stock !== undefined ? parseInt(stock, 10) : undefined
        };

        // Prisma requires nested connect syntax for relation fields in update
        if (categoryId) {
            const category = await prisma.category.findUnique({ where: { id: categoryId } });
            if (!category || !category.isActive) {
                return { success: false, message: 'Selected category is invalid or inactive' };
            }
            dataToUpdate.category = { connect: { id: categoryId } };
        }

        if (subCategoryId) {
            const subCategory = await prisma.subCategory.findUnique({ where: { id: subCategoryId } });
            if (!subCategory || !subCategory.isActive) {
                return { success: false, message: 'Selected subcategory is invalid or inactive' };
            }
            dataToUpdate.subCategory = { connect: { id: subCategoryId } };
        }

        if (dimensions) {
            const parts = dimensions.split('*').map(Number);
            dataToUpdate.length = parts[0] || 0;
            dataToUpdate.width = parts[1] || 0;
            dataToUpdate.height = parts[2] || 0;
        }

        const sku = await prisma.sKU.update({
            where: { id },
            data: dataToUpdate,
            include: { category: true, subCategory: true }
        });

        console.log(`[INVENTORY] Updated SKU: ${sku.skuCode}`);
        return { success: true, sku };
    } catch (error) {
        console.error('Error updating SKU:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('delete-sku', async (event, { id }) => {
    try {
        // Check if SKU is currently stored in any rack/shelf
        const inventoryRecords = await prisma.inventory.findMany({
            where: { skuId: id },
            include: {
                shelf: {
                    include: { rack: true }
                }
            }
        });

        if (inventoryRecords.length > 0) {
            // Build a descriptive list of locations where the SKU is stored
            const locations = inventoryRecords.map(inv => {
                const rackName = inv.shelf?.rack?.name || 'Unknown Rack';
                const level = inv.shelf?.level || '?';
                return `${rackName} - Level ${level} (Qty: ${inv.quantity})`;
            });

            const locationList = locations.join(', ');
            console.log(`[INVENTORY] Delete blocked for SKU ID: ${id} — found in ${inventoryRecords.length} location(s): ${locationList}`);
            return {
                success: false,
                message: `Cannot delete this SKU because it is currently stored in ${inventoryRecords.length} inventory location(s): ${locationList}. Please remove the SKU from all racks before deleting.`
            };
        }

        await prisma.$transaction([
            prisma.transaction.deleteMany({ where: { skuId: id } }),
            prisma.billing.deleteMany({ where: { skuId: id } }),
            prisma.sKU.delete({ where: { id } })
        ]);
        console.log(`[INVENTORY] Deleted SKU ID: ${id}`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting SKU:', error);
        return { success: false, message: 'Failed to delete SKU. Please try again.' };
    }
});

// ========================
// Company Settings & Customer Management Handlers
// ========================

ipcMain.handle('get-company-settings', async () => {
    try {
        const settings = await prisma.companySetting.findFirst();
        return { success: true, settings };
    } catch (error) {
        console.error('Error fetching company settings:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('save-company-settings', async (event, data) => {
    try {
        const { name, gstin, address, email, phone } = data;
        if (!name || !gstin || !address) {
            return { success: false, message: 'Company Name, GSTIN, and Address are required.' };
        }

        const existing = await prisma.companySetting.findFirst();
        let settings;
        if (existing) {
            settings = await prisma.companySetting.update({
                where: { id: existing.id },
                data: { name, gstin, address, email, phone }
            });
        } else {
            settings = await prisma.companySetting.create({
                data: { name, gstin, address, email, phone }
            });
        }

        return { success: true, settings };
    } catch (error) {
        console.error('Error saving company settings:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('get-customers', async () => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, customers };
    } catch (error) {
        console.error('Error fetching customers:', error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('create-customer', async (event, data) => {
    try {
        const { name, gstNumber, address, email, phone } = data;
        if (!name || !address) {
            return { success: false, message: 'Customer Name and Address are required.' };
        }

        const existing = await prisma.customer.findUnique({
            where: { name }
        });
        if (existing) {
            return { success: false, message: 'Customer with this name already exists.' };
        }

        const customer = await prisma.customer.create({
            data: { name, gstNumber, address, email, phone }
        });

        return { success: true, customer };
    } catch (error) {
        console.error('Error creating customer:', error);
        return { success: false, message: error.message };
    }
});

// ========================
// Billing Handlers
// ========================

ipcMain.handle('create-billing', async (event, req) => {
    try {
        const { orderId, sku, productName, rackHistory, duration, weightCharges, rackCharges, amount, status, date, gstPercent, customerId } = req;

        const company = await prisma.companySetting.findFirst();
        if (!company) {
            return { success: false, message: 'Please configure Company Settings in Settings Page first.' };
        }

        if (!customerId) {
            return { success: false, message: 'Please select a Customer.' };
        }

        const customer = await prisma.customer.findUnique({
            where: { id: customerId }
        });
        if (!customer) {
            return { success: false, message: 'Selected Customer not found.' };
        }

        // Auto-generate invoiceId
        const lastInvoice = await prisma.billing.findFirst({
            orderBy: { invoiceId: 'desc' }
        });

        let nextId = parseInt(`${new Date().getFullYear()}001`, 10);
        if (lastInvoice && lastInvoice.invoiceId && lastInvoice.invoiceId.startsWith('INV-')) {
            const parts = lastInvoice.invoiceId.split('-');
            if (parts.length > 1) {
                const parsed = parseInt(parts[1], 10);
                if (!isNaN(parsed) && parsed >= nextId) nextId = parsed + 1;
            }
        }
        const invoiceId = `INV-${nextId}`;

        // Find SKU ID based on the entered string code
        let actualSkuId = null;
        const skuRecord = await prisma.sKU.findFirst({
            where: {
                skuCode: sku
            }
        });

        if (skuRecord) {
            actualSkuId = skuRecord.id;
        } else {
            return { success: false, message: 'SKU not found in database. Please enter a valid SKU Code.' };
        }

        const billing = await prisma.billing.create({
            data: {
                invoiceId,
                orderId,
                skuId: actualSkuId,
                productName,
                rackHistory,
                duration: parseInt(duration, 10),
                weightCharges: parseFloat(weightCharges),
                rackCharges: parseFloat(rackCharges),
                amount: parseFloat(amount),
                status,
                date,
                gstPercent: parseFloat(gstPercent || 0),
                companyName: company.name,
                companyGst: company.gstin,
                companyAddr: company.address,
                companyEmail: company.email,
                companyPhone: company.phone,
                customerName: customer.name,
                customerGst: customer.gstNumber,
                customerAddr: customer.address,
                customerEmail: customer.email,
                customerPhone: customer.phone,
                customerId: customer.id
            }
        });

        console.log(`[BILLING] Created Invoice: ${billing.invoiceId}`);
        return { success: true, billing };
    } catch (error) {
        console.error('Error creating billing record:', error);
        return { success: false, message: error.message };
    }
});

// ========================
// Billing Dashboard APIs
// ========================

ipcMain.handle('get-invoices', async () => {
    try {
        const rawInvoices = await prisma.billing.findMany({
            orderBy: { date: 'desc' },
            include: {
                sku: true
            }
        });
        // Format to match old Invoice model for UI backward compatibility
        const invoices = rawInvoices.map(inv => ({
            id: inv.invoiceId,
            orderId: inv.orderId,
            sku: inv.skuId, // The mock used sku code, but this works
            skuName: inv.sku?.skuCode || inv.skuId,
            productName: inv.productName,
            storageDuration: inv.duration,
            weightCharges: inv.weightCharges,
            rackCharges: inv.rackCharges,
            totalAmount: inv.amount,
            status: inv.status,
            date: inv.date,
            rackHistory: inv.rackHistory,
            gstPercent: inv.gstPercent || 0,
            companyName: inv.companyName || "",
            companyGst: inv.companyGst || "",
            companyAddr: inv.companyAddr || "",
            companyEmail: inv.companyEmail || "",
            companyPhone: inv.companyPhone || "",
            customerName: inv.customerName || "",
            customerGst: inv.customerGst || "",
            customerAddr: inv.customerAddr || "",
            customerEmail: inv.customerEmail || "",
            customerPhone: inv.customerPhone || ""
        }));
        return { success: true, invoices };
    } catch (error) {
        return { success: false, message: error.message };
    }
});

ipcMain.handle('get-invoices-summary', async () => {
    try {
        const invoices = await prisma.billing.findMany();
        const totalInvoices = invoices.length;
        let paidInvoices = 0;
        let pendingInvoices = 0;
        let totalRevenue = 0;

        invoices.forEach(inv => {
            if (inv.status.toLowerCase() === 'paid') {
                paidInvoices++;
                totalRevenue += inv.amount;
            } else {
                pendingInvoices++;
            }
        });

        return {
            success: true,
            summary: { totalRevenue, totalInvoices, paidInvoices, pendingInvoices }
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
});

ipcMain.handle('get-invoices-monthly-revenue', async () => {
    try {
        const invoices = await prisma.billing.findMany({
            where: { status: { equals: 'paid', mode: 'insensitive' } },
            orderBy: { date: 'asc' }
        });

        // Default empty array if no invoices
        if (!invoices.length) return { success: true, data: [] };

        const monthlyMap = new Map();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        invoices.forEach(inv => {
            const d = new Date(inv.date);
            if (!isNaN(d.getTime())) {
                const monthKey = months[d.getMonth()];
                monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + inv.amount);
            }
        });

        const data = Array.from(monthlyMap.entries()).map(([month, revenue]) => ({ month, revenue }));
        return { success: true, data };
    } catch (error) {
        return { success: false, message: error.message };
    }
});

ipcMain.handle('get-invoices-monthly-volume', async () => {
    try {
        const invoices = await prisma.billing.findMany({
            orderBy: { date: 'asc' }
        });

        if (!invoices.length) return { success: true, data: [] };

        const monthlyMap = new Map();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        invoices.forEach(inv => {
            const d = new Date(inv.date);
            if (!isNaN(d.getTime())) {
                const monthKey = months[d.getMonth()];
                monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
            }
        });

        const data = Array.from(monthlyMap.entries()).map(([month, count]) => ({ month, count }));
        return { success: true, data };
    } catch (error) {
        return { success: false, message: error.message };
    }
});

ipcMain.handle('update-invoice-status', async (event, { id, status }) => {
    try {
        const billing = await prisma.billing.update({
            where: { invoiceId: id },
            data: { status }
        });
        return { success: true, billing };
    } catch (error) {
        return { success: false, message: error.message };
    }
});

// ========================
// Dashboard Analytics APIs
// ========================

ipcMain.handle('get-dashboard-metrics', async () => {
    try {
        const totalSkus = await prisma.sKU.count();

        // Inventory total stock
        const skus = await prisma.sKU.findMany({ select: { stock: true } });
        const inventoryUnits = skus.reduce((acc, sku) => acc + sku.stock, 0);

        // Get last 8 logs for activity feed
        const recentLogs = await prisma.systemLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 8
        });

        const activityFeed = recentLogs.map((log) => {
            let type = "scan";
            const acts = log.action.toLowerCase();
            if (acts.includes("place")) type = "placement";
            else if (acts.includes("remove") || acts.includes("dispatch")) type = "dispatch";

            const timeDiffMs = Date.now() - new Date(log.timestamp).getTime();
            const minutes = Math.max(1, Math.floor(timeDiffMs / 60000));

            return {
                id: log.id,
                type,
                message: log.details || `${log.action} - ${log.item}`,
                time: `${minutes} min ago`
            };
        });

        // Inbound/Outbound AreaChart (Grouped by day for last 7 days)
        const txs = await prisma.transaction.findMany({
            where: {
                timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }
        });

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const inboundOutboundData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            inboundOutboundData.push({
                day: days[d.getDay()],
                inbound: 0,
                outbound: 0,
                _dateString: d.toDateString() // for matching
            });
        }

        txs.forEach(tx => {
            const d = new Date(tx.timestamp);
            const row = inboundOutboundData.find(r => r._dateString === d.toDateString());
            if (row) {
                if (tx.type === 'INWARD') row.inbound += tx.quantity;
                else row.outbound += tx.quantity;
            }
        });

        // Daily Activity Timeline (Grouped by 2-hour slots for today)
        const todayLogs = await prisma.systemLog.findMany({
            where: {
                timestamp: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
            }
        });

        const timelineMap = {
            "06:00": { time: "06:00", scans: 0, placements: 0, dispatches: 0 },
            "08:00": { time: "08:00", scans: 0, placements: 0, dispatches: 0 },
            "10:00": { time: "10:00", scans: 0, placements: 0, dispatches: 0 },
            "12:00": { time: "12:00", scans: 0, placements: 0, dispatches: 0 },
            "14:00": { time: "14:00", scans: 0, placements: 0, dispatches: 0 },
            "16:00": { time: "16:00", scans: 0, placements: 0, dispatches: 0 },
            "18:00": { time: "18:00", scans: 0, placements: 0, dispatches: 0 },
            "20:00": { time: "20:00", scans: 0, placements: 0, dispatches: 0 },
        };

        todayLogs.forEach(log => {
            const h = new Date(log.timestamp).getHours();
            let bucket = "06:00";
            if (h >= 20) bucket = "20:00";
            else if (h >= 18) bucket = "18:00";
            else if (h >= 16) bucket = "16:00";
            else if (h >= 14) bucket = "14:00";
            else if (h >= 12) bucket = "12:00";
            else if (h >= 10) bucket = "10:00";
            else if (h >= 8) bucket = "08:00";

            const acts = log.action.toLowerCase();
            if (acts.includes("place")) timelineMap[bucket].placements++;
            else if (acts.includes("remove") || acts.includes("dispatch")) timelineMap[bucket].dispatches++;
            else timelineMap[bucket].scans++;
        });

        return {
            success: true,
            data: {
                totalSkus,
                inventoryUnits,
                activityFeed,
                inboundOutboundData,
                dailyActivityData: Object.values(timelineMap)
            }
        };
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        return { success: false, message: error.message };
    }
});

// ============================================================
// PLC IPC Handlers
// ============================================================

ipcMain.handle('plc-status', () => {
    return plcService.getStatus();
});

ipcMain.handle('plc-connect', async (event, cfg) => {
    return await plcService.connect(cfg || null);
});

ipcMain.handle('plc-disconnect', async () => {
    return await plcService.disconnect();
});

ipcMain.handle('plc-write-tag', async (event, { tagName, value }) => {
    return await plcService.writeTag(tagName, value);
});

ipcMain.handle('plc-read-tag', async (event, { tagName }) => {
    return await plcService.readTag(tagName);
});

ipcMain.handle('plc-write-coil', async (event, { type, address, value }) => {
    return await plcService.writeCoil(type, address, value);
});

ipcMain.handle('plc-read-coil', async (event, { type, address, count }) => {
    return await plcService.readCoil(type, address, count);
});

ipcMain.handle('plc-write-register', async (event, { type, address, value }) => {
    return await plcService.writeRegister(type, address, value);
});

ipcMain.handle('plc-read-register', async (event, { type, address, count }) => {
    return await plcService.readRegister(type, address, count);
});

ipcMain.handle('plc-get-settings', () => {
    return { success: true, settings: plcConfig.loadSettings() };
});

ipcMain.handle('plc-save-settings', (event, cfg) => {
    return plcConfig.saveSettings(cfg);
});

ipcMain.handle('plc-get-tags', () => {
    return { success: true, tags: plcConfig.loadTags() };
});

ipcMain.handle('plc-save-tags', (event, tags) => {
    return plcConfig.saveTags(tags);
});

ipcMain.handle('plc-get-logs', (event, opts = {}) => {
    return plcLogger.getLogs(opts);
});

ipcMain.handle('plc-clear-logs', () => {
    return plcLogger.clearLogs();
});
