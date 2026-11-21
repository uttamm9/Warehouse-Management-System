/**
 * plcConfig.js
 * Manages PLC connection settings and tag mappings stored as JSON files
 * in the Electron userData directory (persists across app updates).
 */

const fs = require('fs');
const path = require('path');

// Resolve userData path — works in both Electron main process and standalone Node
function getUserDataPath() {
    try {
        const { app } = require('electron');
        return app.getPath('userData');
    } catch {
        // Fallback for testing outside Electron
        return path.join(require('os').homedir(), '.warehouse-wms');
    }
}

const SETTINGS_FILE = () => path.join(getUserDataPath(), 'plc-settings.json');
const TAGS_FILE = () => path.join(getUserDataPath(), 'plc-tags.json');

// ── Default PLC connection settings ──────────────────────────────────────────
// Settings matching exact currentConfig from Modbus testing project
const DEFAULT_SETTINGS = {
    // Connection settings (exact from currentConfig)
    port: 'COM3',                    // comPort from currentConfig
    baudRate: 19200,                 // baudRate from currentConfig
    dataBits: 8,                     // dataBits from currentConfig
    stopBits: 1,                     // stopBits from currentConfig
    parity: 'even',                  // parityBits from currentConfig (Even)
    slaveId: 1,                      // plcStationId from currentConfig

    // Interface and manufacturer info
    interfaceType: 'RS485',          // interfaceType from currentConfig
    manufacturer: 'Delta',           // manufacturer from currentConfig
    seriesType: 'DOPSoft / Modbus RTU-TCP',  // seriesType from currentConfig

    // Connection control
    autoConnect: true,               // ✅ Auto-connect on startup (changed from false)
    mockMode: true,                  // ✅ Enable mock mode for testing without hardware (change to false for real PLC)

    // Timing settings (exact from currentConfig)
    communicationDelay: 100,         // communicationDelay from currentConfig
    connectionTimeout: 100,          // connectionTimeout from currentConfig (100 not 1000)
    connectRetries: 3,               // connectRetries from currentConfig

    // Polling settings
    pollInterval: 400,
    enablePolling: false,            // Polling disabled to minimize PLC communication
    reconnectDelay: 5000,

    // Sensor activation settings
    sensorActivationDelay: 3000,     // 3 seconds (matching Modbus testing auto-off)
    sensorTimeout: 5000
};

// ── Default tag mappings (user-editable via UI) ───────────────────────────────
// Simplified tag map per updated requirements:
// - READ Tags (Sensors): M0-M15 (addresses 0-15)
// - WRITE Tags (Rack Commands): M19-M35 (addresses 19-35)
const DEFAULT_TAGS = [
    // ── Sensor Tags (Read) — Addresses 0-15 ─────────────────────────────────
    { id: 1, name: 'Sensor_1', address: 0, type: 'M', direction: 'Read', description: 'Sensor 1 feedback (M0)' },
    { id: 2, name: 'Sensor_2', address: 1, type: 'M', direction: 'Read', description: 'Sensor 2 feedback (M1)' },
    { id: 3, name: 'Sensor_3', address: 2, type: 'M', direction: 'Read', description: 'Sensor 3 feedback (M2)' },
    { id: 4, name: 'Sensor_4', address: 3, type: 'M', direction: 'Read', description: 'Sensor 4 feedback (M3)' },
    { id: 5, name: 'Sensor_5', address: 4, type: 'M', direction: 'Read', description: 'Sensor 5 feedback (M4)' },
    { id: 6, name: 'Sensor_6', address: 5, type: 'M', direction: 'Read', description: 'Sensor 6 feedback (M5)' },
    { id: 7, name: 'Sensor_7', address: 6, type: 'M', direction: 'Read', description: 'Sensor 7 feedback (M6)' },
    { id: 8, name: 'Sensor_8', address: 7, type: 'M', direction: 'Read', description: 'Sensor 8 feedback (M7)' },
    { id: 9, name: 'Sensor_9', address: 8, type: 'M', direction: 'Read', description: 'Sensor 9 feedback (M8)' },
    { id: 10, name: 'Sensor_10', address: 9, type: 'M', direction: 'Read', description: 'Sensor 10 feedback (M9)' },
    { id: 11, name: 'Sensor_11', address: 10, type: 'M', direction: 'Read', description: 'Sensor 11 feedback (M10)' },
    { id: 12, name: 'Sensor_12', address: 11, type: 'M', direction: 'Read', description: 'Sensor 12 feedback (M11)' },
    { id: 13, name: 'Sensor_13', address: 12, type: 'M', direction: 'Read', description: 'Sensor 13 feedback (M12)' },
    { id: 14, name: 'Sensor_14', address: 13, type: 'M', direction: 'Read', description: 'Sensor 14 feedback (M13)' },
    { id: 15, name: 'Sensor_15', address: 14, type: 'M', direction: 'Read', description: 'Sensor 15 feedback (M14)' },
    { id: 16, name: 'Sensor_16', address: 15, type: 'M', direction: 'Read', description: 'Sensor 16 feedback (M15)' },

    // ── Rack Command Tags (Write) — Addresses 19-35 ──────────────────────────
    // NOTE: Names match database format (S1-R01, S1-R02, etc.) for consistency
    { id: 17, name: 'S1-R01', address: 19, type: 'M', direction: 'Write', description: 'Rack 1 command bit (M19)' },
    { id: 18, name: 'S1-R02', address: 20, type: 'M', direction: 'Write', description: 'Rack 2 command bit (M20)' },
    { id: 19, name: 'S1-R03', address: 21, type: 'M', direction: 'Write', description: 'Rack 3 command bit (M21)' },
    { id: 20, name: 'S1-R04', address: 22, type: 'M', direction: 'Write', description: 'Rack 4 command bit (M22)' },
    { id: 21, name: 'S1-R05', address: 23, type: 'M', direction: 'Write', description: 'Rack 5 command bit (M23)' },
    { id: 22, name: 'S1-R06', address: 24, type: 'M', direction: 'Write', description: 'Rack 6 command bit (M24)' },
    { id: 23, name: 'S1-R07', address: 25, type: 'M', direction: 'Write', description: 'Rack 7 command bit (M25)' },
    { id: 24, name: 'S1-R08', address: 26, type: 'M', direction: 'Write', description: 'Rack 8 command bit (M26)' },
    { id: 25, name: 'S1-R09', address: 26, type: 'M', direction: 'Write', description: 'Rack 9 command bit (M26)' },
    { id: 26, name: 'S1-R10', address: 26, type: 'M', direction: 'Write', description: 'Rack 10 command bit (M26)' },
    { id: 27, name: 'S1-R11', address: 26, type: 'M', direction: 'Write', description: 'Rack 11 command bit (M26)' },
    { id: 28, name: 'S1-R12', address: 27, type: 'M', direction: 'Write', description: 'Rack 12 command bit (M27)' },
    { id: 29, name: 'S1-R13', address: 28, type: 'M', direction: 'Write', description: 'Rack 13 command bit (M28)' },
    { id: 30, name: 'S1-R14', address: 29, type: 'M', direction: 'Write', description: 'Rack 14 command bit (M29)' },
    { id: 31, name: 'S1-R15', address: 30, type: 'M', direction: 'Write', description: 'Rack 15 command bit (M30)' },
    { id: 32, name: 'S1-R16', address: 31, type: 'M', direction: 'Write', description: 'Rack 16 command bit (M31)' },
    { id: 33, name: 'S1-R17', address: 32, type: 'M', direction: 'Write', description: 'Rack 17 command bit (M32)' },
    { id: 34, name: 'S1-R18', address: 33, type: 'M', direction: 'Write', description: 'Rack 18 command bit (M33)' },
    { id: 35, name: 'S1-R19', address: 34, type: 'M', direction: 'Write', description: 'Rack 19 command bit (M34)' }
];

// ── Settings API ─────────────────────────────────────────────────────────────

function loadSettings() {
    const filePath = SETTINGS_FILE();
    try {
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf-8');
            return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
        }
    } catch (e) {
        console.error('[PLCConfig] Failed to load settings:', e.message);
    }
    return { ...DEFAULT_SETTINGS };
}

function saveSettings(settings) {
    const filePath = SETTINGS_FILE();
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const merged = { ...loadSettings(), ...settings };
        fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');
        return { success: true, settings: merged };
    } catch (e) {
        console.error('[PLCConfig] Failed to save settings:', e.message);
        return { success: false, message: e.message };
    }
}

// ── Tag Map API ───────────────────────────────────────────────────────────────

function loadTags() {
    const filePath = TAGS_FILE();
    console.log("rawrawrawrawrawrawraw", filePath);
    try {
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf-8');

            return JSON.parse(raw);
        }
    } catch (e) {
        console.error('[PLCConfig] Failed to load tags:', e.message);
    }
    return [...DEFAULT_TAGS];
}

function saveTags(tags) {
    const filePath = TAGS_FILE();
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(tags, null, 2), 'utf-8');
        return { success: true, tags };
    } catch (e) {
        console.error('[PLCConfig] Failed to save tags:', e.message);
        return { success: false, message: e.message };
    }
}

function getTagByName(name) {
    const tags = loadTags();
    return tags.find(t => t.name === name) || null;
}

/**
 * Validates a tag object against business rules.
 * @param {{ name: string, address: number, type: string, direction: string }} tag
 * @param {Array<{ name: string }>} existingTags - Tags already in the map (excluding the one being edited)
 * @returns {{ valid: true } | { valid: false, message: string }}
 */
function validateTag(tag, existingTags = []) {
    const { name, address, type, direction } = tag;

    // Name: non-empty and at most 100 characters
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return { valid: false, message: 'Tag name is required' };
    }
    if (name.length > 100) {
        return { valid: false, message: 'Tag name must be 100 characters or fewer' };
    }

    // Address: integer in range 0–65535
    if (!Number.isInteger(address) || address < 0 || address > 65535) {
        return { valid: false, message: 'Address must be an integer between 0 and 65535' };
    }

    // Type: one of M, D, X, Y
    const VALID_TYPES = ['M', 'D', 'X', 'Y'];
    if (!VALID_TYPES.includes(type)) {
        return { valid: false, message: `Type must be one of: ${VALID_TYPES.join(', ')}` };
    }

    // Direction: one of Read, Write, Read+Write
    const VALID_DIRECTIONS = ['Read', 'Write', 'Read+Write'];
    if (!VALID_DIRECTIONS.includes(direction)) {
        return { valid: false, message: `Direction must be one of: ${VALID_DIRECTIONS.join(', ')}` };
    }

    // Duplicate name check
    if (existingTags.some(t => t.name === name)) {
        return { valid: false, message: 'Tag name already exists' };
    }

    return { valid: true };
}

// ── Sensor Configuration Helpers ──────────────────────────────────────────────

/**
 * Get the configured sensor activation delay (duration sensor stays ON)
 * @returns {number} Delay in milliseconds (default: 1000ms)
 */
function getSensorDelay() {
    const settings = loadSettings();
    return settings.sensorActivationDelay != null ? settings.sensorActivationDelay : 1000;
}

/**
 * Get the configured PLC timeout for sensor commands
 * @returns {number} Timeout in milliseconds (default: 3000ms)
 */
function getSensorTimeout() {
    const settings = loadSettings();
    return settings.sensorTimeout != null ? settings.sensorTimeout : 3000;
}

// ── Delta DVP Address Helpers ─────────────────────────────────────────────────
// Delta DVP uses a non-linear coil address space for M, X, Y registers.

function deltaAddressToModbus(type, address) {
    const upperType = type.toUpperCase();

    // Validate address is non-negative for all types
    if (address < 0) {
        throw new Error(`Address ${address} out of range for type ${upperType}`);
    }

    switch (upperType) {
        case 'M': {
            // M0-M499: Modbus coils 0x0000-0x01F3
            // M500-M999: Modbus coils 0x0200–0x03E7
            // M1000-M4095: Modbus coils 0x0400–0x13FF
            if (address >= 0 && address <= 499) return address;
            if (address >= 500 && address <= 999) return 0x0200 + (address - 500);
            if (address >= 1000 && address <= 4095) return 0x0400 + (address - 1000);
            throw new Error(`Address ${address} out of range for type M`);
        }
        case 'X': {
            // X0–X17 (octal) = Modbus coil 0x0400+
            return 0x0400 + address;
        }
        case 'Y': {
            // Y0–Y17 (octal) = Modbus coil 0x0500+
            return 0x0500 + address;
        }
        case 'D': {
            // D-registers map directly to holding registers (0-based)
            return address;
        }
        case 'T': return 0x0600 + address; // Timer
        case 'C': return 0x0700 + address; // Counter
        default:
            throw new Error(`Unsupported PLC address type: ${type}`);
    }
}

module.exports = {
    loadSettings,
    saveSettings,
    loadTags,
    saveTags,
    getTagByName,
    validateTag,
    deltaAddressToModbus,
    getSensorDelay,
    getSensorTimeout,
    DEFAULT_SETTINGS,
    DEFAULT_TAGS
};
