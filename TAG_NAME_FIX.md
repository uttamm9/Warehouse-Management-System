# Tag Name Fix - DEFAULT_TAGS Consistency

## Problem Identified

### Before Fix:
- **DEFAULT_TAGS** had inconsistent naming:
  - `Rack_1`, `Rack_2`, `Rack_3` (underscore format)
  - `S1-R04` (one rack had correct format)
  - `Rack_5`, `Rack_6`, ... etc. (back to underscore)

- **Database** rack names:
  - `S1-R01`, `S1-R02`, `S1-R03`, `S1-R04`, ... (hyphen format)

- **RACK_SENSOR_MAPPING** (in rackSensor.service.js):
  - `S1-R01`, `S1-R02`, `S1-R03`, ... (hyphen format)

### Mismatch:
```
DEFAULT_TAGS:          Rack_1, Rack_2, Rack_3, S1-R04, Rack_5, ...
Database:              S1-R01, S1-R02, S1-R03, S1-R04, S1-R05, ...
RACK_SENSOR_MAPPING:   S1-R01, S1-R02, S1-R03, S1-R04, S1-R05, ...
```

**Result:** Confusion and inconsistency!

---

## Fix Applied

### After Fix:
All rack names now use **consistent format: `S1-R01`, `S1-R02`, etc.**

**File:** `desktop/plc/plcConfig.js`

```javascript
const DEFAULT_TAGS = [
    // ── Sensor Tags (Read) — M0-M15 ──
    { id: 1, name: 'Sensor_1', address: 0, type: 'M', direction: 'Read', ... },
    { id: 2, name: 'Sensor_2', address: 1, type: 'M', direction: 'Read', ... },
    // ... up to Sensor_16
    
    // ── Rack Command Tags (Write) — M19-M35 ──
    // ✅ NOW ALL USE S1-R## FORMAT
    { id: 17, name: 'S1-R01', address: 19, type: 'M', direction: 'Write', description: 'Rack 1 command bit (M19)' },
    { id: 18, name: 'S1-R02', address: 20, type: 'M', direction: 'Write', description: 'Rack 2 command bit (M20)' },
    { id: 19, name: 'S1-R03', address: 21, type: 'M', direction: 'Write', description: 'Rack 3 command bit (M21)' },
    { id: 20, name: 'S1-R04', address: 22, type: 'M', direction: 'Write', description: 'Rack 4 command bit (M22)' },
    { id: 21, name: 'S1-R05', address: 23, type: 'M', direction: 'Write', description: 'Rack 5 command bit (M23)' },
    { id: 22, name: 'S1-R06', address: 24, type: 'M', direction: 'Write', description: 'Rack 6 command bit (M24)' },
    { id: 23, name: 'S1-R07', address: 25, type: 'M', direction: 'Write', description: 'Rack 7 command bit (M25)' },
    { id: 24, name: 'S1-R08', address: 26, type: 'M', direction: 'Write', description: 'Rack 8 command bit (M26)' },
    { id: 25, name: 'S1-R09', address: 27, type: 'M', direction: 'Write', description: 'Rack 9 command bit (M27)' },
    { id: 26, name: 'S1-R10', address: 28, type: 'M', direction: 'Write', description: 'Rack 10 command bit (M28)' },
    { id: 27, name: 'S1-R11', address: 29, type: 'M', direction: 'Write', description: 'Rack 11 command bit (M29)' },
    { id: 28, name: 'S1-R12', address: 30, type: 'M', direction: 'Write', description: 'Rack 12 command bit (M30)' },
    { id: 29, name: 'S1-R13', address: 31, type: 'M', direction: 'Write', description: 'Rack 13 command bit (M31)' },
    { id: 30, name: 'S1-R14', address: 32, type: 'M', direction: 'Write', description: 'Rack 14 command bit (M32)' },
    { id: 31, name: 'S1-R15', address: 33, type: 'M', direction: 'Write', description: 'Rack 15 command bit (M33)' },
    { id: 32, name: 'S1-R16', address: 34, type: 'M', direction: 'Write', description: 'Rack 16 command bit (M34)' },
    { id: 33, name: 'S1-R17', address: 35, type: 'M', direction: 'Write', description: 'Rack 17 command bit (M35)' }
];
```

---

## Consistency Achieved

### All Systems Now Match:

| System | Format | Example |
|--------|--------|---------|
| **DEFAULT_TAGS** | `S1-R##` | S1-R01, S1-R02, S1-R03 |
| **Database Racks** | `S1-R##` | S1-R01, S1-R02, S1-R03 |
| **RACK_SENSOR_MAPPING** | `S1-R##` | S1-R01, S1-R02, S1-R03 |
| **PLC Logs** | `S1-R##` | S1-R01, S1-R02, S1-R03 |
| **Console Output** | `S1-R##` | S1-R01, S1-R02, S1-R03 |

✅ **100% Consistent!**

---

## Complete Rack Mapping Reference

| Rack Name | Tag ID | Address | Modbus | Description |
|-----------|--------|---------|--------|-------------|
| **S1-R01** | 17 | 19 | M19 | Rack 1 command bit |
| **S1-R02** | 18 | 20 | M20 | Rack 2 command bit |
| **S1-R03** | 19 | 21 | M21 | Rack 3 command bit |
| **S1-R04** | 20 | 22 | M22 | Rack 4 command bit |
| **S1-R05** | 21 | 23 | M23 | Rack 5 command bit |
| **S1-R06** | 22 | 24 | M24 | Rack 6 command bit |
| **S1-R07** | 23 | 25 | M25 | Rack 7 command bit |
| **S1-R08** | 24 | 26 | M26 | Rack 8 command bit |
| **S1-R09** | 25 | 27 | M27 | Rack 9 command bit |
| **S1-R10** | 26 | 28 | M28 | Rack 10 command bit |
| **S1-R11** | 27 | 29 | M29 | Rack 11 command bit |
| **S1-R12** | 28 | 30 | M30 | Rack 12 command bit |
| **S1-R13** | 29 | 31 | M31 | Rack 13 command bit |
| **S1-R14** | 30 | 32 | M32 | Rack 14 command bit |
| **S1-R15** | 31 | 33 | M33 | Rack 15 command bit |
| **S1-R16** | 32 | 34 | M34 | Rack 16 command bit |
| **S1-R17** | 33 | 35 | M35 | Rack 17 command bit |

---

## Important Notes

### 1. DEFAULT_TAGS is Reference Only

DEFAULT_TAGS in `plcConfig.js` is primarily for:
- ✅ Tag management UI
- ✅ Tag editor reference
- ✅ Documentation
- ⚠️ **NOT directly used** for PLC communication

### 2. Actual PLC Communication Uses

**File:** `desktop/services/rackSensor.service.js`

```javascript
const RACK_SENSOR_MAPPING = {
    'S1-R01': { writeAddress: 19, readAddress: 0, sensor: 1 },
    'S1-R02': { writeAddress: 20, readAddress: 1, sensor: 2 },
    // ... etc.
};
```

This mapping is what's actually used when:
- Allocating racks in inbound
- Activating sensors
- Sending PLC write commands

### 3. Database Must Match

Ensure your database rack names are:
```sql
-- Correct format:
S1-R01, S1-R02, S1-R03, S1-R04, ...

-- NOT:
Rack_1, Rack 1, R01, etc.
```

---

## Benefits of Consistency

### ✅ Before (Mixed Naming):
```
Console Log: "Activating rack Rack_1"
Database: "S1-R01"
Mapping: "S1-R01"
Result: Confusion! Which is which?
```

### ✅ After (Consistent Naming):
```
Console Log: "Activating rack S1-R01"
Database: "S1-R01"
Mapping: "S1-R01"
DEFAULT_TAGS: "S1-R01"
Result: Crystal clear! Everything matches.
```

---

## Verification Steps

### ✅ Step 1: Check DEFAULT_TAGS

Open `desktop/plc/plcConfig.js` and verify all rack tags use `S1-R##` format:
```javascript
{ id: 17, name: 'S1-R01', address: 19, ... },
{ id: 18, name: 'S1-R02', address: 20, ... },
// etc.
```

### ✅ Step 2: Check Database

Query database to verify rack names:
```sql
SELECT name FROM Rack ORDER BY name;
-- Should return: S1-R01, S1-R02, S1-R03, ...
```

### ✅ Step 3: Check Console Logs

When allocating rack, console should show:
```
🎯 Allocated Rack: S1-R02
║     RACK SENSOR ACTIVATION START - S1-R02              ║
✅ Rack mapping found:
   - Write Address: M20
```

All should use same `S1-R02` format.

---

## Summary

✅ **Fix Applied:** All DEFAULT_TAGS now use `S1-R##` format

✅ **Consistency:** Matches database, RACK_SENSOR_MAPPING, and console logs

✅ **No Breaking Changes:** Actual PLC communication logic unchanged

✅ **Better Clarity:** Easier to read and debug

✅ **17 Racks Supported:** S1-R01 through S1-R17 with addresses M19-M35

**Rack naming is now 100% consistent across the entire system!** 🎯
