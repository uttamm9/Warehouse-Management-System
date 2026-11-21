// desktop/controllers/logs.controller.js
const { prisma } = require('../db.js');

/**
 * Get all system logs with filtering, searching, and pagination
 * 
 * Query Params:
 * - search: Search in item(SKU) and details
 * - user: Filter by user enum
 * - action: Filter by action enum
 * - status: Filter by status (success, warning, error, info)
 * - startDate: Filter logs after this date (ISO format)
 * - endDate: Filter logs before this date (ISO format)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 */
async function getLogs(filters = {}) {
    try {
        console.log('[Logs Controller] getLogs called with filters:', filters);

        const {
            search = '',
            user = null,
            action = null,
            status = null,
            startDate = null,
            endDate = null,
            page = 1,
            limit = 20
        } = filters;

        // Validate pagination params
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
        const skip = (pageNum - 1) * limitNum;

        // Build where clause for filtering
        const where = {};

        // Date range filter
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) {
                where.timestamp.gte = new Date(startDate);
            }
            if (endDate) {
                where.timestamp.lte = new Date(endDate);
            }
        }

        // User filter
        if (user && user !== 'All Users') {
            where.user = formatUserEnum(user);
        }

        // Action filter
        if (action && action !== 'All Actions') {
            where.action = formatActionEnum(action);
        }

        // Status filter
        if (status && status !== 'all') {
            where.status = status;
        }

        // Search filter (item and details)
        if (search.trim()) {
            where.OR = [
                { item: { contains: search, mode: 'insensitive' } },
                { details: { contains: search, mode: 'insensitive' } }
            ];
        }

        console.log('[Logs Controller] Query where:', JSON.stringify(where, null, 2));

        // Test connection
        try {
            console.log('[Logs Controller] Testing database connection...');
            await prisma.$queryRaw`SELECT 1`;
            console.log('[Logs Controller] Database connection OK ✓');
        } catch (dbErr) {
            console.error('[Logs Controller] Database connection failed:', dbErr.message);
            throw new Error('Database connection failed: ' + dbErr.message);
        }

        // Ensure the generated Prisma client includes the SystemLog model
        if (!prisma || !prisma.systemLog) {
            console.error('[Logs Controller] Prisma client does not expose `systemLog` model.');
            console.error('[Logs Controller] prisma object keys:', Object.keys(prisma || {}));
            throw new Error('Prisma client missing model "SystemLog". Run `npx prisma generate` and `npx prisma migrate deploy`, then restart the server.');
        }

        // Check if SystemLog table exists
        console.log('[Logs Controller] Checking SystemLog table...');
        let tableExists = false;
        try {
            // Try a count on empty where to test table access
            const testCount = await prisma.systemLog.count({ where: {} });
            tableExists = true;
            console.log('[Logs Controller] SystemLog table exists ✓ (test count: ' + testCount + ')');
        } catch (tableErr) {
            console.error('[Logs Controller] Error accessing SystemLog table:', tableErr.code, tableErr.message);
            if (tableErr.code === 'P3007') {
                throw new Error('SystemLog table does not exist. Run: npx prisma migrate deploy');
            }
            throw tableErr;
        }

        // Execute count query for total
        console.log('[Logs Controller] Counting total logs with where clause...');
        let totalCount = 0;
        try {
            console.log('[Logs Controller] Building count query...', JSON.stringify(where, null, 2));
            totalCount = await prisma.systemLog.count({ where });
            console.log('[Logs Controller] Total count: ' + totalCount + ' ✓');
        } catch (countErr) {
            console.error('[Logs Controller] Error counting logs:', countErr.code, countErr.message);
            console.error('[Logs Controller] Count error details:', countErr);
            throw new Error(`Failed to count logs: ${countErr.message} (${countErr.code})`);
        }

        // Execute main query with pagination
        console.log('[Logs Controller] Fetching logs with pagination...');
        let logs = [];
        try {
            console.log('[Logs Controller] Query: findMany with skip=' + skip + ', take=' + limitNum);
            logs = await prisma.systemLog.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                skip,
                take: limitNum,
                select: {
                    id: true,
                    timestamp: true,
                    user: true,
                    action: true,
                    item: true,
                    details: true,
                    status: true
                }
            });
            console.log('[Logs Controller] Found logs: ' + logs.length + ' ✓');
        } catch (findErr) {
            console.error('[Logs Controller] Error fetching logs:', findErr.code, findErr.message);
            console.error('[Logs Controller] Find error details:', findErr);
            throw new Error(`Failed to fetch logs: ${findErr.message} (${findErr.code})`);
        }

        // Get summary counts (all statuses across entire dataset)
        console.log('[Logs Controller] Counting by status...');
        let successCount = 0, warningCount = 0, errorCount = 0, infoCount = 0;
        try {
            console.log('[Logs Controller] Counting: success');
            const sc = await prisma.systemLog.count({ where: { ...where, status: 'success' } });
            console.log('[Logs Controller] Counting: warning');
            const wc = await prisma.systemLog.count({ where: { ...where, status: 'warning' } });
            console.log('[Logs Controller] Counting: error');
            const ec = await prisma.systemLog.count({ where: { ...where, status: 'error' } });
            console.log('[Logs Controller] Counting: info');
            const ic = await prisma.systemLog.count({ where: { ...where, status: 'info' } });

            successCount = sc;
            warningCount = wc;
            errorCount = ec;
            infoCount = ic;

            console.log('[Logs Controller] Status counts:', { successCount, warningCount, errorCount, infoCount }, '✓');
        } catch (statusErr) {
            console.error('[Logs Controller] Error counting status groups:', statusErr.message);
            console.error('[Logs Controller] Status error details:', statusErr);
            // Don't throw - use zero counts as fallback
            console.log('[Logs Controller] Using fallback status counts (all zeros)');
        }

        // Format response
        console.log('[Logs Controller] Formatting response...');
        try {
            const formattedLogs = logs.map((log, idx) => {
                try {
                    return {
                        id: log.id,
                        timestamp: log.timestamp.toISOString(),
                        user: formatUserDisplay(log.user),
                        action: formatActionDisplay(log.action),
                        item: log.item,
                        details: log.details,
                        status: log.status
                    };
                } catch (mapErr) {
                    console.error('[Logs Controller] Error formatting log #' + idx + ':', mapErr.message);
                    console.error('[Logs Controller] Raw log:', log);
                    throw mapErr;
                }
            });

            const response = {
                success: true,
                data: {
                    logs: formattedLogs,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        totalCount,
                        totalPages: Math.ceil(totalCount / limitNum)
                    },
                    summaryCounts: {
                        success: successCount,
                        warning: warningCount,
                        error: errorCount,
                        info: infoCount
                    }
                }
            };

            console.log('[Logs Controller] Response ready ✓');
            return response;
        } catch (formatErr) {
            console.error('[Logs Controller] Error formatting response:', formatErr.message);
            throw formatErr;
        }
    } catch (error) {
        console.error('[Logs Controller] ❌ EXCEPTION CAUGHT');
        console.error('[Logs Controller] Error name:', error.name);
        console.error('[Logs Controller] Error message:', error?.message);
        console.error('[Logs Controller] Error code:', error.code);
        console.error('[Logs Controller] Error meta:', error.meta);
        console.error('[Logs Controller] Error stack:', error.stack);

        return {
            success: false,
            message: error?.message || 'Failed to fetch logs',
            code: error.code || 'UNKNOWN',
            meta: error.meta || undefined,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }
}

/**
 * Create a new system log entry
 */
async function createLog(data) {
    try {
        const {
            user = 'System',
            action,
            item = '',
            details = '',
            status = 'info'
        } = data;

        if (!action) {
            throw new Error('Action is required');
        }

        const log = await prisma.systemLog.create({
            data: {
                user: formatUserEnum(user),
                action: formatActionEnum(action),
                item,
                details,
                status
            }
        });

        return {
            success: true,
            data: {
                id: log.id,
                timestamp: log.timestamp.toISOString(),
                user: formatUserDisplay(log.user),
                action: formatActionDisplay(log.action),
                item: log.item,
                details: log.details,
                status: log.status
            }
        };
    } catch (error) {
        console.error('[Logs Controller] Error creating log:', error);
        return {
            success: false,
            message: error?.message || 'Failed to create log'
        };
    }
}

/**
 * Helper function to convert display user name to enum format
 * Admin -> Admin, Operator-1 -> Operator1, etc.
 */
function formatUserEnum(userDisplay) {
    if (!userDisplay) return 'System';
    return userDisplay.toString().replace('-', '');
}

/**
 * Helper function to convert enum user to display format
 * Admin -> Admin, Operator1 -> Operator-1, etc.
 */
function formatUserDisplay(userEnum) {
    if (!userEnum) return 'System';
    if (userEnum === 'Operator1') return 'Operator-1';
    if (userEnum === 'Operator2') return 'Operator-2';
    return userEnum;
}

/**
 * Helper function to convert display action name to enum format
 * "Config Changed" -> "ConfigChanged", "Scanned QR Code" -> "ScannedQRCode", etc.
 */
function formatActionEnum(actionDisplay) {
    if (!actionDisplay) return 'ConfigChanged';

    const actionMap = {
        'Config Changed': 'ConfigChanged',
        'Backup Completed': 'BackupCompleted',
        'Scanned QR Code': 'ScannedQRCode',
        'Started Conveyor': 'StartedConveyor',
        'Updated SKU Details': 'UpdatedSKUDetails',
        'Placed on Rack': 'PlacedOnRack',
        'User Login': 'UserLogin',
        'Removed from Rack': 'RemovedFromRack',
        'Generated Invoice': 'GeneratedInvoice',
        'Rack Capacity Warning': 'RackCapacityWarning',
        'Stopped Conveyor': 'StoppedConveyor',
        'Emergency Stop Activated': 'EmergencyStopActivated'
    };

    return actionMap[actionDisplay] || actionDisplay;
}

/**
 * Helper function to convert enum action to display format
 * "ConfigChanged" -> "Config Changed", "ScannedQRCode" -> "Scanned QR Code", etc.
 */
function formatActionDisplay(actionEnum) {
    if (!actionEnum) return 'Config Changed';

    const actionMap = {
        'ConfigChanged': 'Config Changed',
        'BackupCompleted': 'Backup Completed',
        'ScannedQRCode': 'Scanned QR Code',
        'StartedConveyor': 'Started Conveyor',
        'UpdatedSKUDetails': 'Updated SKU Details',
        'PlacedOnRack': 'Placed on Rack',
        'UserLogin': 'User Login',
        'RemovedFromRack': 'Removed from Rack',
        'GeneratedInvoice': 'Generated Invoice',
        'RackCapacityWarning': 'Rack Capacity Warning',
        'StoppedConveyor': 'Stopped Conveyor',
        'EmergencyStopActivated': 'Emergency Stop Activated'
    };

    return actionMap[actionEnum] || actionEnum;
}

/**
 * Get all available actions for filter dropdowns
 */
function getAvailableActions() {
    return [
        'Config Changed',
        'Backup Completed',
        'Scanned QR Code',
        'Started Conveyor',
        'Updated SKU Details',
        'Placed on Rack',
        'User Login',
        'Removed from Rack',
        'Generated Invoice',
        'Rack Capacity Warning',
        'Stopped Conveyor',
        'Emergency Stop Activated'
    ];
}

/**
 * Get all available users for filter dropdowns
 */
function getAvailableUsers() {
    return ['Admin', 'Manager', 'System', 'Operator-1', 'Operator-2'];
}

/**
 * Get PLC logs with filtering and pagination
 * 
 * Query Params:
 * - rackId: Filter by rack identifier (e.g., "S1-R01")
 * - operation: Filter by PLC operation (e.g., "SENSOR_ON", "SENSOR_OFF")
 * - startDate: Filter logs after this date (ISO format)
 * - endDate: Filter logs before this date (ISO format)
 * - limit: Items per page (default: 50, max: 500)
 * - offset: Offset for pagination (default: 0)
 */
async function getPLCLogs(filters = {}) {
    try {
        const {
            rackId = null,
            operation = null,
            startDate = null,
            endDate = null,
            limit = 50,
            offset = 0
        } = filters;

        // Validate pagination params
        const limitNum = Math.min(500, Math.max(1, parseInt(limit) || 50));
        const offsetNum = Math.max(0, parseInt(offset) || 0);

        // Build where clause - only PLC-related logs
        const where = {
            plcOperation: { not: null }  // Only logs with PLC operation
        };

        // Date range filter
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) {
                where.timestamp.gte = new Date(startDate);
            }
            if (endDate) {
                where.timestamp.lte = new Date(endDate);
            }
        }

        // Rack ID filter
        if (rackId) {
            where.rackId = rackId;
        }

        // Operation filter
        if (operation) {
            where.plcOperation = operation;
        }

        // Get total count
        const totalCount = await prisma.systemLog.count({ where });

        // Fetch logs
        const logs = await prisma.systemLog.findMany({
            where,
            orderBy: { timestamp: 'desc' },
            skip: offsetNum,
            take: limitNum,
            select: {
                id: true,
                timestamp: true,
                user: true,
                action: true,
                item: true,
                details: true,
                status: true,
                plcOperation: true,
                plcAddress: true,
                plcValue: true,
                rackId: true
            }
        });

        // Format response
        const formattedLogs = logs.map(log => ({
            id: log.id,
            timestamp: log.timestamp.toISOString(),
            action: formatActionDisplay(log.action),
            item: log.item,
            rackId: log.rackId,
            plcOperation: log.plcOperation,
            plcAddress: log.plcAddress,
            plcValue: log.plcValue,
            status: log.status,
            details: log.details
        }));

        return {
            success: true,
            data: {
                total: totalCount,
                logs: formattedLogs,
                pagination: {
                    limit: limitNum,
                    offset: offsetNum,
                    hasMore: (offsetNum + limitNum) < totalCount
                }
            }
        };
    } catch (error) {
        console.error('[Logs Controller] Error fetching PLC logs:', error);
        return {
            success: false,
            message: error?.message || 'Failed to fetch PLC logs',
            code: error.code || 'UNKNOWN',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }
}

/**
 * Get PLC log statistics
 * 
 * Query Params:
 * - startDate: Filter logs after this date (ISO format)
 * - endDate: Filter logs before this date (ISO format)
 */
async function getPLCStatistics(filters = {}) {
    try {
        const {
            startDate = null,
            endDate = null
        } = filters;

        // Build base where clause for PLC logs
        const where = {
            plcOperation: { not: null }
        };

        // Date range filter
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) {
                where.timestamp.gte = new Date(startDate);
            }
            if (endDate) {
                where.timestamp.lte = new Date(endDate);
            }
        }

        // Get total operations
        const totalOperations = await prisma.systemLog.count({ where });

        // Count success vs error
        const successCount = await prisma.systemLog.count({
            where: { ...where, status: 'success' }
        });

        const errorCount = await prisma.systemLog.count({
            where: { ...where, status: 'error' }
        });

        // Calculate success rate
        const successRate = totalOperations > 0
            ? parseFloat(((successCount / totalOperations) * 100).toFixed(2))
            : 0;

        // Get errors by rack
        const errorLogs = await prisma.systemLog.findMany({
            where: {
                ...where,
                status: 'error',
                rackId: { not: null }
            },
            select: { rackId: true }
        });

        const errorsByRack = errorLogs.reduce((acc, log) => {
            acc[log.rackId] = (acc[log.rackId] || 0) + 1;
            return acc;
        }, {});

        // Get operation breakdown
        const operationLogs = await prisma.systemLog.findMany({
            where,
            select: { plcOperation: true, status: true }
        });

        const operationBreakdown = operationLogs.reduce((acc, log) => {
            if (log.plcOperation) {
                acc[log.plcOperation] = (acc[log.plcOperation] || 0) + 1;
            }
            return acc;
        }, {});

        // Add error count to breakdown
        operationBreakdown.errors = errorCount;

        // Calculate average response time if available in details
        let averageResponseTime = null;
        try {
            const logsWithDetails = await prisma.systemLog.findMany({
                where: {
                    ...where,
                    details: { not: null }
                },
                select: { details: true }
            });

            const responseTimes = logsWithDetails
                .map(log => {
                    try {
                        const details = JSON.parse(log.details);
                        return details.responseTime || details.duration || null;
                    } catch {
                        return null;
                    }
                })
                .filter(time => time !== null && typeof time === 'number');

            if (responseTimes.length > 0) {
                const sum = responseTimes.reduce((a, b) => a + b, 0);
                averageResponseTime = Math.round(sum / responseTimes.length);
            }
        } catch (error) {
            console.warn('[Logs Controller] Could not calculate average response time:', error.message);
        }

        return {
            success: true,
            data: {
                totalOperations,
                successRate,
                averageResponseTime,
                errorsByRack,
                operationBreakdown
            }
        };
    } catch (error) {
        console.error('[Logs Controller] Error calculating PLC statistics:', error);
        return {
            success: false,
            message: error?.message || 'Failed to calculate PLC statistics',
            code: error.code || 'UNKNOWN',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }
}

module.exports = {
    getLogs,
    createLog,
    getPLCLogs,
    getPLCStatistics,
    formatUserEnum,
    formatUserDisplay,
    formatActionEnum,
    formatActionDisplay,
    getAvailableActions,
    getAvailableUsers
};
