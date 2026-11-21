/**
 * API Utility Layer — Safe Electron/Browser Dual-Mode Support
 * 
 * All IPC calls go through this module. In Electron, it uses IPC.
 * In browser dev mode, it falls back to mock data so the UI doesn't crash.
 */

// =====================
// Environment Detection
// =====================

export function isElectron(): boolean {
    // @ts-ignore
    return typeof window !== 'undefined' && !!window.electronAPI;
    // return true;
}

// =====================
// Debug Logger
// =====================

function logAccess(action: string, detail: string, result: any) {
    console.log(
        `%c[RBAC] %c${action} %c→ ${detail}`,
        'color: #a78bfa; font-weight: bold',
        'color: #60a5fa',
        'color: #94a3b8',
        result
    );
}

// =====================
// IPC Wrapper (safe)
// =====================

async function ipc<T = any>(method: string, ...args: any[]): Promise<T> {
    if (isElectron()) {
        // @ts-ignore
        const fn = window.electronAPI[method];
        if (typeof fn === 'function') {
            const result = await fn(...args);
            logAccess('IPC', `${method}(${args.map(a => JSON.stringify(a)).join(', ')})`, result);
            return result;
        }
        console.warn(`[API] Method "${method}" not found on electronAPI`);
    }

    console.warn(`[API] Electron not available — using fallback for "${method}"`);
    return getFallback(method, ...args) as T;
}

// =====================
// Browser-Mode Fallbacks
// =====================

const MOCK_ADMIN = {
    id: 'mock-admin-001',
    name: 'Dev Admin',
    email: 'admin@warehouse.com',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
};

const MOCK_MODULES = [
    { id: 'm1', name: 'Dashboard' },
    { id: 'm2', name: 'Scan Barcode' },
    { id: 'm3', name: 'Warehouse Layout' },
    { id: 'm4', name: 'Rack Monitoring' },
    { id: 'm5', name: 'Inbound Inventory' },
    { id: 'm6', name: 'Outbound Inventory' },
    { id: 'm7', name: 'SKU Management' },
    { id: 'm8', name: 'Conveyor Control' },
    { id: 'm9', name: 'Reports' },
    { id: 'm10', name: 'Billing' },
    { id: 'm11', name: 'System Logs' },
    { id: 'm12', name: 'Settings' },
    { id: 'm13', name: 'Roles & Permissions' },
    { id: 'm14', name: 'User Management' },
];

function makeMockPermissions(role: string) {
    return MOCK_MODULES.map((m, i) => ({
        id: `perm-${role}-${i}`,
        role,
        moduleId: m.id,
        module: m,
        canView: true,
        canCreate: role === 'ADMIN',
        canEdit: role === 'ADMIN',
        canDelete: role === 'ADMIN',
    }));
}

function getFallback(method: string, ...args: any[]): any {
    switch (method) {
        case 'login':
            return {
                success: true,
                user: MOCK_ADMIN,
                permissions: makeMockPermissions('ADMIN'),
            };
        case 'signup':
            return {
                success: true,
                user: { ...MOCK_ADMIN, ...args[0], id: `mock-${Date.now()}` },
                permissions: makeMockPermissions('ADMIN'),
            };
        case 'getModules':
            return MOCK_MODULES;
        case 'getPermissions':
            return makeMockPermissions(args[0] || 'STAFF');
        case 'updatePermissions':
            return { success: true };
        case 'getUsers':
            return { success: true, users: [MOCK_ADMIN] };
        case 'getUser':
            return { success: true, user: MOCK_ADMIN };
        case 'createUser':
            return { success: true, user: { ...MOCK_ADMIN, id: `mock-${Date.now()}`, ...args[0] } };
        case 'updateUser':
            return { success: true, user: MOCK_ADMIN };
        case 'deleteUser':
            return { success: true };
        case 'getMe':
            return { success: true, user: MOCK_ADMIN };
        case 'updateProfile':
            return { success: true, user: { ...MOCK_ADMIN, ...args[0] } };
        case 'resetPassword':
            return { success: true };
        case 'getCategories':
            return { success: true, categories: [] };
        case 'getSubCategories':
            return { success: true, subcategories: [] };
        case 'getSkus':
            return { success: true, skus: [] };
        case 'createSku':
            return { success: true, sku: { id: `mock-sku-${Date.now()}`, skuCode: 'SKU-0000', ...args[0] } };
        case 'updateSku':
            return { success: true, sku: { id: args[0].id, ...args[0] } };
        case 'deleteSku':
            return { success: true };
        case 'createBilling':
            return { success: true, billing: { id: `mock-inv-${Date.now()}`, invoiceId: `INV-MOCK`, ...args[0] } };
        case 'getInvoices': return { success: true, invoices: [] };
        case 'getInvoicesSummary': return { success: true, summary: { totalRevenue: 0, totalInvoices: 0, paidInvoices: 0, pendingInvoices: 0 } };
        case 'getInvoicesMonthlyRevenue': return { success: true, data: [] };
        case 'getInvoicesMonthlyVolume': return { success: true, data: [] };
        case 'updateInvoiceStatus': return { success: true };
        case 'get-roles': return { success: true, roles: [{ id: '1', name: 'ADMIN' }, { id: '2', name: 'MANAGER' }] };
        case 'create-role': return { success: true, role: { id: `mock-role-${Date.now()}`, name: args[0].name } };
        case 'update-role': return { success: true, role: { id: args[0].roleId, name: args[0].name } };
        case 'delete-role': return { success: true };
        default:
            return { success: false, message: `No fallback for "${method}"` };
    }
}

// =====================
// Typed Public API
// =====================

export const api = {
    // Auth
    login: (credentials: { email: string; password: string }) =>
        ipc('login', credentials),
    signup: (credentials: { name: string; email: string; password: string }) =>
        ipc('signup', credentials),

    // RBAC
    getModules: () => ipc('getModules'),
    getPermissions: (role: string) => ipc('getPermissions', role),
    updatePermissions: (permissions: any[]) => ipc('updatePermissions', permissions),

    // User CRUD
    getUsers: () => ipc('getUsers'),
    getUser: (userId: string) => ipc('getUser', userId),
    createUser: (data: any) => ipc('createUser', data),
    updateUser: (data: any) => ipc('updateUser', data),
    deleteUser: (data: any) => ipc('deleteUser', data),

    // Profile & Auth
    getMe: (data: { userId: string }) => ipc('getMe', data),
    updateProfile: (data: { userId: string; name: string; email: string }) => ipc('updateProfile', data),
    resetPassword: (data: { userId: string; oldPassword: string; newPassword: string }) => ipc('resetPassword', data),

    // SKU & Categories
    getCategories: () => ipc('getCategories'),
    getSubCategories: (categoryId?: string) => ipc('getSubCategories', categoryId),
    getSkus: () => ipc('getSkus'),
    createSku: (data: any) => ipc('createSku', data),
    updateSku: (data: any) => ipc('updateSku', data),
    deleteSku: (data: any) => ipc('deleteSku', data),
    createBilling: (data: any) => ipc('createBilling', data),
    getInvoices: () => ipc('getInvoices'),
    getInvoicesSummary: () => ipc('getInvoicesSummary'),
    getInvoicesMonthlyRevenue: () => ipc('getInvoicesMonthlyRevenue'),
    getInvoicesMonthlyVolume: () => ipc('getInvoicesMonthlyVolume'),
    updateInvoiceStatus: (data: { id: string; status: string }) => ipc('updateInvoiceStatus', data),
    getCompanySettings: () => ipc('getCompanySettings'),
    saveCompanySettings: (data: any) => ipc('saveCompanySettings', data),
    getCustomers: () => ipc('getCustomers'),
    createCustomer: (data: any) => ipc('createCustomer', data),

    // Roles
    getRoles: () => ipc('get-roles'),
    createRole: (data: { name: string; callerRole: string }) => ipc('create-role', data),
    updateRole: (data: { roleId: string; name: string; callerRole: string }) => ipc('update-role', data),
    deleteRole: (data: { roleId: string; callerRole: string }) => ipc('delete-role', data),
};
