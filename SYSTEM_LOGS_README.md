# System Logs Module - Implementation Guide

## Overview

The System Logs module is a production-ready audit logging system for warehouse operations. It provides:

- Real-time tracking of all warehouse operations
- Searchable and filterable log history
- Server-side pagination for performance
- CSV export functionality
- Role-based visibility (using existing RBAC)

## Database Schema

**Table: SystemLog**

- `id` (UUID): Primary key, auto-generated
- `timestamp` (DateTime): When the log was created
- `user` (Enum): Admin, Manager, System, Operator-1, Operator-2
- `action` (Enum): 12 predefined warehouse actions
- `item` (String): SKU code or system identifier
- `details` (String): Additional context/description
- `status` (Enum): success, error, warning, info
- `createdAt` (DateTime): Record creation timestamp

**Indexes:**

- `timestamp`, `user`, `action`, `status` for fast queries

## API Endpoints

### GET /logs

Fetch logs with filtering, searching, and pagination.

**Query Parameters:**

```
- search (string): Search in item (SKU) and details
- user (string): Filter by user (e.g., "Admin", "Operator-1")
- action (string): Filter by action
- status (string): Filter by status (success, warning, error, info)
- startDate (ISO string): Filter logs after this date
- endDate (ISO string): Filter logs before this date
- page (number): Page number (default: 1)
- limit (number): Items per page (default: 20, max: 100)
```

**Response:**

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "timestamp": "2026-03-27T10:30:00Z",
        "user": "Operator-1",
        "action": "Scanned QR Code",
        "item": "SKU-1001",
        "details": "QR code scanned on conveyor",
        "status": "success"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalCount": 152,
      "totalPages": 8
    },
    "summaryCounts": {
      "success": 120,
      "warning": 18,
      "error": 8,
      "info": 6
    }
  }
}
```

### POST /logs

Create a new system log entry.

**Request Body:**

```json
{
  "user": "Operator-1",
  "action": "Placed on Rack",
  "item": "SKU-1005",
  "details": "Item placed on Rack R5-L2",
  "status": "success"
}
```

### GET /logs/metadata

Get available filter options (actions and users).

**Response:**

```json
{
  "success": true,
  "data": {
    "actions": [
      "Config Changed",
      "Backup Completed",
      "Scanned QR Code",
      "Started Conveyor",
      "Updated SKU Details",
      "Placed on Rack",
      "User Login",
      "Removed from Rack",
      "Generated Invoice",
      "Rack Capacity Warning",
      "Stopped Conveyor",
      "Emergency Stop Activated"
    ],
    "users": ["Admin", "Manager", "System", "Operator-1", "Operator-2"]
  }
}
```

## Backend Implementation

### Using LogService

The `LogService` class in `desktop/services/log.service.js` provides convenient methods for logging:

```javascript
const LogService = require("./services/log.service");

// Log a scan
await LogService.logScan(
  "SKU-1001",
  "QR code scanned manually",
  "success",
  "Operator-1",
);

// Log placing item on rack
await LogService.logPlaceOnRack("SKU-1001", "R5-L2", 1, "Operator-1");

// Log removing item
await LogService.logRemoveFromRack("SKU-1001", "R5-L2", 1, "Operator-2");

// Log conveyor operations
await LogService.logConveyorStart("R5-L2", "System");
await LogService.logConveyorStop("Manual stop", "System");
await LogService.logEmergencyStop("Emergency button pressed", "System");

// Log SKU updates
await LogService.logSKUUpdate("SKU-1001", "Updated weight to 25kg", "Admin");

// Log invoice generation
await LogService.logGenerateInvoice("INV-2026001", "SKU-1001", "System");

// Log rack warnings
await LogService.logRackWarning("R5-L2", 95);

// Log user login
await LogService.logUserLogin("john@warehouse.com", "success");

// Log configuration changes
await LogService.logConfigChange(
  "PLC-Settings",
  "Updated IP to 192.168.1.100",
  "Admin",
);

// Log backup
await LogService.logBackup(
  "system-backup-27032026",
  "success",
  "Database backup completed",
);

// Generic log
await LogService.log(
  "Admin",
  "Custom Action",
  "ITEM-123",
  "Custom log entry",
  "info",
);

// Log error
await LogService.logError(
  "PlaceOnRack",
  "SKU-1001",
  new Error("Shelf capacity exceeded"),
  "System",
);
```

### Integrating with Existing Systems

**Location: In your action handlers (allocation.service.js, etc.)**

```javascript
const LogService = require("./services/log.service");

// Example: In inventory inward confirmation
async function confirmInward(skuCode, quantity, overrideShelfId) {
  try {
    // ... existing allocation logic ...

    // Log the successful operation
    await LogService.logPlaceOnRack(
      skuCode,
      `${allocation.rackName}-${allocation.shelfLevel}`,
      quantity,
      "System",
    );

    return result;
  } catch (error) {
    // Log the error
    await LogService.logError("InboundInventory", skuCode, error, "System");
    throw error;
  }
}
```

## Frontend Implementation

### Using the SystemLogs Component

The SystemLogs page is already fully implemented and fetches data from the API:

```tsx
import { SystemLogs } from "./pages/SystemLogs";

// Use in your router or directly
<SystemLogs />;
```

### Using LogService from Frontend

To log events from the frontend, use the `addLogToAPI` hook in WarehouseContext:

```tsx
import { useWarehouse } from "../context/WarehouseContext";

export function MyComponent() {
  const { addLogToAPI } = useWarehouse();

  const handleAction = async () => {
    try {
      // Do something
      await addLogToAPI(
        "Operator-1",
        "Custom Action",
        "SKU-1001",
        "User performed custom action",
        "success",
      );
    } catch (error) {
      await addLogToAPI(
        "Operator-1",
        "Custom Action",
        "SKU-1001",
        `Error: ${error.message}`,
        "error",
      );
    }
  };

  return <button onClick={handleAction}>Perform Action</button>;
}
```

## Features

### Dynamic Statistics

The top row shows real-time counts for each status:

- **Success** (green): Successful operations
- **Warning** (yellow): Operations with warnings
- **Error** (red): Failed operations
- **Info** (blue): Informational logs

Click on any status card to filter logs by that status.

### Advanced Search

Search logs by:

- SKU code (e.g., "SKU-1001")
- Details (e.g., "Rack R5")
- Partial matches supported

### Filtering

Multiple filter options:

- **User Filter**: Show logs from specific users
- **Action Filter**: Show specific types of actions
- **Status Filter**: (via status cards)
- **Combined Filters**: Apply multiple filters simultaneously

All filters work together and reset the pagination to page 1.

### Pagination

- Server-side pagination (efficient)
- Configurable page size (20 by default)
- Shows current page and total pages
- Remembers position when filtering

### CSV Export

Export filtered logs as CSV:

- Includes all visible columns
- Exports only logs matching current filters
- Timestamp format: Local user timezone
- Filename: `system-logs-YYYY-MM-DD.csv`

### Loading & Error States

- Loading skeleton shows while fetching
- Empty state when no logs match filters
- Error message display if API fails
- Toast notifications for user feedback

## Migration Steps

To deploy this module to your environment:

### 1. Database Migration

```bash
cd electron-react-app
npx prisma migrate deploy
```

This will execute the migration at:

```
prisma/migrations/20260327_add_system_logs/migration.sql
```

### 2. Restart Backend

```bash
# Terminal where Express server runs
# Kill and restart the server to reload changes
```

### 3. Verify in UI

- Navigate to System Logs page
- Should see empty state initially
- API endpoints should respond

## Integration Checklist

To fully integrate logging throughout the WCS:

- [ ] Add LogService calls to `inventory.service.js` for inbound/outbound events
- [ ] Add LogService calls to `allocation.service.js` for rack placement
- [ ] Add LogService calls to conveyor control endpoints
- [ ] Add LogService calls to SKU update endpoints
- [ ] Add LogService calls to invoice generation
- [ ] Add LogService calls to rack capacity warning triggers
- [ ] Add LogService calls to PLC communication handlers
- [ ] Test all log types appear correctly in System Logs UI
- [ ] Verify filters work correctly
- [ ] Test CSV export with large datasets
- [ ] Configure log retention policy (optional)

## Performance Considerations

- Indexes on frequently filtered columns
- Server-side pagination reduces payload
- Efficient query filtering
- Limit of 100 items per page (configurable)
- Consider archiving logs older than N days for large installations

## Security

- Logs inherit RBAC from existing permissions system
- Set `Reports.canView` permission to control log access
- Set `Reports.canCreate` permission to control export access
- Logs are read-only (no delete function exposed)
- All API endpoints support user context (set user from auth)

## Future Enhancements

- [ ] Log rotation/archival policy
- [ ] Advanced analytics dashboard
- [ ] Real-time log streaming via WebSocket
- [ ] Log visualization charts (actions by hour, etc.)
- [ ] Automated alerts based on log patterns
- [ ] Log retention configuration per role
- [ ] Batch operations logging
- [ ] Integration with external audit systems
