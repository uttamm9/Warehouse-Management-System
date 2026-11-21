/**
 * SYSTEM LOGS - Integration Examples
 * 
 * This file shows HOW to integrate LogService throughout the warehouse system
 * to automatically log all major operations. Use these examples as a template
 * for integrating logging into existing service files.
 */

// ============================================================================
// EXAMPLE 1: Inventory Inbound Service Integration
// ============================================================================
// Location: desktop/allocation.service.js

const LogService = require('./services/log.service');

async function confirmInward(skuCode, quantity, overrideShelfId) {
    try {
        // ... existing allocation and inventory logic ...
        const result = await allocationService.previewAllocation(skuCode, quantity);

        // LOG THE OPERATION
        await LogService.logPlaceOnRack(
            skuCode,
            `${result.rackName}-${result.shelfLevel}`,
            quantity,
            'System' // Can be operator name from auth
        );

        return result;
    } catch (error) {
        // LOG THE ERROR
        await LogService.logError(
            'InboundInventory',
            skuCode,
            error,
            'System'
        );
        throw error;
    }
}

// ============================================================================
// EXAMPLE 2: Conveyor Control Integration
// ============================================================================
// Location: A conveyor control handler or controller

async function handleConveyorStart(req, res) {
    try {
        const { destination, speed } = req.body;
        const operatorName = req.user?.name || 'System';

        // ... Start conveyor logic ...

        // LOG THE ACTION
        await LogService.logConveyorStart(
            destination || 'Unknown',
            operatorName
        );

        res.json({ success: true, message: 'Conveyor started' });
    } catch (error) {
        // LOG ERROR
        await LogService.logError(
            'ConveyorStart',
            'CONVEYOR-SYSTEM',
            error,
            req.user?.name || 'System'
        );
        res.status(500).json({ success: false, message: error.message });
    }
}

async function handleConveyorEmergencyStop(req, res) {
    try {
        const operatorName = req.user?.name || 'System';

        // ... Emergency stop logic ...

        // LOG THE EMERGENCY STOP
        await LogService.logEmergencyStop(
            'Emergency stop activated by operator',
            operatorName
        );

        res.json({ success: true, message: 'Conveyor stopped' });
    } catch (error) {
        await LogService.logError(
            'ConveyorEmergencyStop',
            'CONVEYOR-SYSTEM',
            error,
            req.user?.name || 'System'
        );
        res.status(500).json({ success: false, message: error.message });
    }
}

// ============================================================================
// EXAMPLE 3: QR Code Scanning Integration
// ============================================================================

async function handleQRScan(req, res) {
    try {
        const { qrCode } = req.body;
        const operatorName = req.user?.name || 'Operator-1';

        // ... Process QR code ...
        const sku = parseQRCode(qrCode);

        // LOG THE SCAN
        await LogService.logScan(
            sku.code,
            `QR code scanned from conveyor ${sku.zone}`,
            'success',
            operatorName
        );

        res.json({ success: true, sku });
    } catch (error) {
        // LOG SCAN ERROR
        await LogService.logError(
            'QRScan',
            'SCAN-UNKNOWN',
            error,
            req.user?.name || 'Operator-1'
        );
        res.status(400).json({ success: false, message: error.message });
    }
}

// ============================================================================
// EXAMPLE 4: SKU Management - Update SKU Details
// ============================================================================
// Location: SKU controller or service

async function updateSKU(req, res) {
    try {
        const { skuCode } = req.params;
        const updates = req.body;
        const adminName = req.user?.name || 'Admin';

        // Get old values for audit trail
        const oldSKU = await prisma.sku.findUnique({ where: { skuCode } });

        // ... Update logic ...
        const updatedSKU = await prisma.sku.update({
            where: { skuCode },
            data: updates
        });

        // LOG THE UPDATE
        const changesSummary = Object.entries(updates)
            .map(([key, value]) => `${key}: ${oldSKU[key]} → ${value}`)
            .join(', ');

        await LogService.logSKUUpdate(
            skuCode,
            changesSummary,
            adminName
        );

        res.json({ success: true, data: updatedSKU });
    } catch (error) {
        await LogService.logError(
            'UpdateSKUDetails',
            req.params.skuCode,
            error,
            req.user?.name || 'Admin'
        );
        res.status(500).json({ success: false, message: error.message });
    }
}

// ============================================================================
// EXAMPLE 5: Rack Capacity Warning
// ============================================================================
// Location: Allocation service, when checking shelf capacity

function checkRackCapacity() {
    const racks = getAllRacks();

    racks.forEach(rack => {
        rack.shelves.forEach(shelf => {
            const occupancyPercent = (shelf.usedWeight / shelf.maxWeight) * 100;

            if (occupancyPercent >= 90) {
                // LOG RACK WARNING
                LogService.logRackWarning(
                    `${rack.name}-${shelf.level}`,
                    Math.round(occupancyPercent)
                );
            }
        });
    });
}

// ============================================================================
// EXAMPLE 6: Invoice Generation
// ============================================================================
// Location: Billing controller

async function generateInvoice(req, res) {
    try {
        const { orderId, skuCode } = req.body;

        // ... Generate invoice logic ...
        const invoice = await prisma.billing.create({
            data: {
                invoiceId: `INV-${Date.now()}`,
                orderId,
                skuCode,
                // ... other fields ...
            }
        });

        // LOG INVOICE GENERATION
        await LogService.logGenerateInvoice(
            invoice.invoiceId,
            skuCode,
            'System'
        );

        res.json({ success: true, data: invoice });
    } catch (error) {
        await LogService.logError(
            'GeneratedInvoice',
            req.body.skuCode,
            error,
            'System'
        );
        res.status(500).json({ success: false, message: error.message });
    }
}

// ============================================================================
// EXAMPLE 7: User Login Logging
// ============================================================================
// Location: Authentication controller

async function handleLogin(req, res) {
    try {
        const { email, password } = req.body;

        // ... Verify credentials ...
        const user = await authenticateUser(email, password);

        // LOG SUCCESSFUL LOGIN
        await LogService.logUserLogin(user.name, 'success');

        res.json({ success: true, user, token: generateToken(user) });
    } catch (error) {
        // LOG FAILED LOGIN
        await LogService.log(
            'System',
            'User Login',
            email,
            `Login failed: ${error.message}`,
            'error'
        );

        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
}

// ============================================================================
// EXAMPLE 8: Frontend Integration - Logging from React
// ============================================================================
// Location: Any React component

import { useWarehouse } from '../context/WarehouseContext';

export function InventoryForm() {
    const { addLogToAPI } = useWarehouse();

    const handleSubmit = async (data) => {
        try {
            // Submit inventory
            await submitInventory(data);

            // LOG FROM FRONTEND
            await addLogToAPI(
                'Admin', // Current user name
                'Placed on Rack',
                data.skuCode,
                `${data.quantity} units placed on ${data.rackLocation}`,
                'success'
            );
        } catch (error) {
            // LOG ERROR FROM FRONTEND
            await addLogToAPI(
                'Admin',
                'PlacedOnRack',
                data.skuCode,
                `Error: ${error.message}`,
                'error'
            );
        }
    };

    return <form onSubmit={handleSubmit}>/* ... */</form>;
}

// ============================================================================
// EXAMPLE 9: Configuration Changes
// ============================================================================
// Location: Settings/Configuration controller

async function updateConfiguration(req, res) {
    try {
        const { configKey, configValue } = req.body;
        const adminName = req.user?.name || 'Admin';

        // ... Update config logic ...
        const oldValue = getCurrentConfig(configKey);
        setConfiguration(configKey, configValue);

        // LOG CONFIG CHANGE
        await LogService.logConfigChange(
            configKey,
            `${configKey}: ${oldValue} → ${configValue}`,
            adminName
        );

        res.json({ success: true });
    } catch (error) {
        await LogService.logError(
            'ConfigChanged',
            req.body.configKey,
            error,
            req.user?.name || 'Admin'
        );
        res.status(500).json({ success: false, message: error.message });
    }
}

// ============================================================================
// EXAMPLE 10: System Backup
// ============================================================================
// Location: Backup service or scheduled job

async function createSystemBackup() {
    const timestamp = new Date().toISOString();
    const backupName = `backup-${timestamp}`;

    try {
        // ... Backup logic ...
        await dumpDatabase(backupName);
        await compressBackup(backupName);

        // LOG SUCCESSFUL BACKUP
        await LogService.logBackup(
            backupName,
            'success',
            `Database backup completed - ${new Date().toLocaleString()}`
        );

        return { success: true, backupName };
    } catch (error) {
        // LOG BACKUP ERROR
        await LogService.logBackup(
            backupName,
            'error',
            `Backup failed: ${error.message}`
        );

        throw error;
    }
}

// ============================================================================
// DEPLOYMENT CHECKLIST
// ============================================================================
/*
After integrating LogService:

✓ Run Prisma migration: npx prisma migrate deploy
✓ Import LogService in each service file
✓ Wrap key functions with try-catch and LogService calls
✓ Restart Express server
✓ Test System Logs page shows new entries
✓ Verify filters work with your test data
✓ Test CSV export includes your new logs
✓ Check dashboard stats update in real-time

*/
