// desktop/services/log.service.js
const { createLog } = require('../controllers/logs.controller.js');

/**
 * Log Service for creating system logs across the application
 * Provides convenient methods for logging various warehouse operations
 */
class LogService {
    /**
     * Log a scan action
     */
    static async logScan(skuCode, details = '', status = 'success', user = 'System') {
        return createLog({
            user,
            action: 'Scanned QR Code',
            item: skuCode,
            details: details || `QR code scanned for ${skuCode}`,
            status
        });
    }

    /**
     * Log placing item on rack
     */
    static async logPlaceOnRack(skuCode, rackLocation, quantity = 1, user = 'Operator-1') {
        return createLog({
            user,
            action: 'Placed on Rack',
            item: skuCode,
            details: `${quantity} unit(s) placed on ${rackLocation}`,
            status: 'success'
        });
    }

    /**
     * Log removing item from rack
     */
    static async logRemoveFromRack(skuCode, rackLocation, quantity = 1, user = 'Operator-2') {
        return createLog({
            user,
            action: 'Removed from Rack',
            item: skuCode,
            details: `${quantity} unit(s) removed from ${rackLocation}`,
            status: 'success'
        });
    }

    /**
     * Log conveyor started
     */
    static async logConveyorStart(destination = '', user = 'System') {
        return createLog({
            user,
            action: 'Started Conveyor',
            item: 'CONVEYOR-SYSTEM',
            details: `Conveyor started${destination ? ` - destination: ${destination}` : ''}`,
            status: 'success'
        });
    }

    /**
     * Log conveyor stopped
     */
    static async logConveyorStop(reason = '', user = 'System') {
        return createLog({
            user,
            action: 'Stopped Conveyor',
            item: 'CONVEYOR-SYSTEM',
            details: `Conveyor stopped${reason ? ` - ${reason}` : ''}`,
            status: 'success'
        });
    }

    /**
     * Log emergency stop
     */
    static async logEmergencyStop(reason = 'Emergency detected', user = 'System') {
        return createLog({
            user,
            action: 'Emergency Stop Activated',
            item: 'CONVEYOR-SYSTEM',
            details: reason,
            status: 'error'
        });
    }

    /**
     * Log SKU update
     */
    static async logSKUUpdate(skuCode, changes = '', user = 'Admin') {
        return createLog({
            user,
            action: 'Updated SKU Details',
            item: skuCode,
            details: changes || `SKU ${skuCode} details updated`,
            status: 'success'
        });
    }

    /**
     * Log invoice generation
     */
    static async logGenerateInvoice(invoiceId, skuCode, user = 'System') {
        return createLog({
            user,
            action: 'Generated Invoice',
            item: skuCode,
            details: `Invoice ${invoiceId} generated`,
            status: 'success'
        });
    }

    /**
     * Log rack capacity warning
     */
    static async logRackWarning(rackLocation, occupancyPercent = 0) {
        return createLog({
            user: 'System',
            action: 'Rack Capacity Warning',
            item: rackLocation,
            details: `Rack ${rackLocation} reached ${occupancyPercent}% capacity`,
            status: 'warning'
        });
    }

    /**
     * Log user login
     */
    static async logUserLogin(userName, loginStatus = 'success') {
        return createLog({
            user: userName,
            action: 'User Login',
            item: userName,
            details: `User ${userName} logged in`,
            status: loginStatus === 'success' ? 'success' : 'error'
        });
    }

    /**
     * Log configuration change
     */
    static async logConfigChange(configName, changes = '', user = 'Admin') {
        return createLog({
            user,
            action: 'Config Changed',
            item: configName,
            details: changes || `Configuration ${configName} was updated`,
            status: 'info'
        });
    }

    /**
     * Log backup completion
     */
    static async logBackup(backupName = '', status = 'success', details = '') {
        return createLog({
            user: 'System',
            action: 'Backup Completed',
            item: backupName || 'SYSTEM-BACKUP',
            details: details || `Backup ${backupName} completed successfully`,
            status
        });
    }

    /**
     * Generic log method for custom logs
     */
    static async log(user, action, item, details, status = 'info') {
        return createLog({
            user,
            action,
            item,
            details,
            status
        });
    }

    /**
     * Log error
     */
    static async logError(action, item, error, user = 'System') {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return createLog({
            user,
            action,
            item,
            details: `Error: ${errorMessage}`,
            status: 'error'
        });
    }
}

module.exports = LogService;
