/**
 * plcLogger.js
 * Ring-buffer PLC communication logger.
 * Stores last 500 entries in memory, appends to plc-comm.log (JSON Lines), and persists to database.
 */

const fs = require('fs');
const path = require('path');
const { prisma } = require('../db');

const MAX_ENTRIES = 500;
const LOG_TYPES = Object.freeze({ READ: 'READ', WRITE: 'WRITE', CONNECT: 'CONNECT', DISCONNECT: 'DISCONNECT', ERROR: 'ERROR', INFO: 'INFO' });

let logBuffer = [];
let logFilePath = null;

function getLogFilePath() {
    if (logFilePath) return logFilePath;
    try {
        const { app } = require('electron');
        logFilePath = path.join(app.getPath('userData'), 'plc-comm.log');
    } catch {
        logFilePath = path.join(require('os').homedir(), '.warehouse-wms', 'plc-comm.log');
    }
    // Ensure directory exists
    const dir = path.dirname(logFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return logFilePath;
}

/**
 * Map PLC log types and operations to SystemLog LogAction enum
 */
function mapToLogAction(type, operation) {
    // Handle sensor-specific operations first
    if (operation === 'SENSOR_ON') return 'SensorActivated';
    if (operation === 'SENSOR_OFF') return 'SensorDeactivated';

    // Handle error types with PLC context
    if (type === LOG_TYPES.ERROR) {
        if (operation === 'ACTIVATE' || operation === 'SENSOR_ON') {
            return 'SensorActivationFailed';
        }
        if (operation === 'DEACTIVATE' || operation === 'SENSOR_OFF') {
            return 'SensorDeactivationFailed';
        }
        return 'PLCCommunicationError';
    }

    // Default fallback for non-sensor PLC operations
    if (type === LOG_TYPES.WRITE) return 'ConfigChanged';
    if (type === LOG_TYPES.READ) return 'ConfigChanged';

    return 'ConfigChanged'; // Default fallback
}

/**
 * Map PLC log type to SystemLog LogStatus enum
 */
function mapToLogStatus(type) {
    if (type === LOG_TYPES.ERROR) return 'error';
    if (type === LOG_TYPES.INFO) return 'info';
    return 'info'; // Default
}

/**
 * Persist log entry to SystemLog database table
 */
async function persistToDatabase(entry, type, details) {
    try {
        // Extract PLC-specific fields
        const plcOperation = details.operation || null;
        const plcAddress = details.address !== undefined ? details.address : null;
        const plcValue = details.value !== undefined ? String(details.value) : null;
        const rackId = details.rack || null;

        // Determine LogAction and LogStatus
        const action = mapToLogAction(type, plcOperation);
        const status = mapToLogStatus(type);

        // Determine item field - prioritize SKU, then rack, then generic identifier
        const item = details.sku || rackId || details.tag || 'PLC';

        // Build details JSON - include all context except what's in dedicated columns
        const detailsObj = { ...details };
        delete detailsObj.operation; // Stored in plcOperation
        delete detailsObj.address;   // Stored in plcAddress
        delete detailsObj.value;     // Stored in plcValue
        delete detailsObj.rack;      // Stored in rackId
        delete detailsObj.sku;       // Stored in item
        delete detailsObj.tag;       // Stored in item if used

        // Add message to details
        detailsObj.message = entry.message;

        // Create database entry
        await prisma.systemLog.create({
            data: {
                timestamp: new Date(entry.timestamp),
                user: 'System',
                action,
                item,
                details: JSON.stringify(detailsObj),
                status,
                plcOperation,
                plcAddress,
                plcValue,
                rackId
            }
        });
    } catch (dbError) {
        // Log database errors but don't fail the operation
        console.error('[plcLogger] Database persistence failed:', dbError.message);
    }
}

function addLog(type, message, details = {}) {
    const entry = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        type: type || LOG_TYPES.INFO,
        message: message || '',
        ...details   // address, value, tag, error
    };

    // Push to ring buffer
    logBuffer.push(entry);
    if (logBuffer.length > MAX_ENTRIES) {
        logBuffer = logBuffer.slice(logBuffer.length - MAX_ENTRIES);
    }

    // Append to file (async, fire-and-forget)
    try {
        const filePath = getLogFilePath();
        // Rotate if file exceeds 10 MB
        try {
            const stat = fs.statSync(filePath);
            if (stat.size >= 10 * 1024 * 1024) {
                const isoDate = new Date().toISOString().slice(0, 10);
                const rotatedPath = filePath.replace('plc-comm.log', `plc-comm-${isoDate}.log`);
                fs.renameSync(filePath, rotatedPath);
            }
        } catch (rotateErr) {
            // File may not exist yet — ignore stat/rename errors
        }
        fs.appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf-8');
    } catch (e) {
        // Don't crash on log write failure
    }

    // Persist to database (async, fire-and-forget)
    persistToDatabase(entry, type, details).catch(err => {
        // Silently ignore database errors to maintain backward compatibility
        // Error already logged in persistToDatabase
    });

    return entry;
}

function getLogs({ type, limit = 100, offset = 0 } = {}) {
    let results = [...logBuffer].reverse(); // Newest first
    if (type) results = results.filter(e => e.type === type);
    return {
        total: results.length,
        logs: results.slice(offset, offset + limit),
        types: Object.values(LOG_TYPES)
    };
}

function clearLogs() {
    logBuffer = [];
    try {
        const fp = getLogFilePath();
        if (fs.existsSync(fp)) fs.writeFileSync(fp, '', 'utf-8');
    } catch (e) { /* ignore */ }
    return { success: true };
}

// Convenience wrappers
const log = {
    read: (tag, address, value) => addLog(LOG_TYPES.READ, `Read ${tag}`, { tag, address, value }),
    write: (tag, address, value) => addLog(LOG_TYPES.WRITE, `Write ${tag}`, { tag, address, value }),
    connect: (port) => addLog(LOG_TYPES.CONNECT, `Connected: ${port}`, { port }),
    disconnect: (port, reason) => addLog(LOG_TYPES.DISCONNECT, `Disconnected: ${port}`, { port, reason }),
    error: (msg, details) => addLog(LOG_TYPES.ERROR, msg, details),
    info: (msg, details) => addLog(LOG_TYPES.INFO, msg, details),

    // Sensor-specific methods
    sensorActivate: (rack, sku, address, quantity) =>
        addLog(LOG_TYPES.WRITE, `Sensor ON: ${rack}`, { rack, sku, address, value: true, quantity, operation: 'SENSOR_ON' }),

    sensorDeactivate: (rack, address) =>
        addLog(LOG_TYPES.WRITE, `Sensor OFF: ${rack}`, { rack, address, value: false, operation: 'SENSOR_OFF' }),

    sensorError: (rack, operation, error, details = {}) =>
        addLog(LOG_TYPES.ERROR, `Sensor ${operation} failed: ${rack}`, { rack, operation, error, ...details })
};

module.exports = { log, getLogs, clearLogs, LOG_TYPES, addLog };
