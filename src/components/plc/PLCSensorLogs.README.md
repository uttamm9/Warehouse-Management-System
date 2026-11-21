# PLC Sensor Logs Component

## Overview

The `PLCSensorLogs` component provides a comprehensive view of PLC sensor activation history with advanced filtering, pagination, and statistics.

## Features

### 1. Log Display
- Displays logs from the GET `/api/logs/plc` endpoint
- Shows timestamp, rack ID, operation, address, value, status, SKU, and details
- Real-time log updates with manual refresh

### 2. Filtering Capabilities
- **Rack ID Filter**: Filter logs by specific rack (S1-R01 through S1-R19)
- **Operation Filter**: Filter by operation type (SENSOR_ON, SENSOR_OFF, READ, WRITE)
- **Date Range Filter**: Filter by start date and end date
- **Clear Filters**: Reset all filters with one click

### 3. Pagination
- 50 logs per page (configurable)
- Previous/Next navigation
- Shows current page and total pages
- Displays total log count

### 4. Statistics Dashboard
- **Total Operations**: Count of all PLC operations
- **Success Rate**: Percentage of successful operations
- **Average Response Time**: Average PLC response time in milliseconds
- **Operation Breakdown**: Count by operation type
- **Errors by Rack**: Error count grouped by rack location

### 5. Export Functionality
- Export logs to CSV format
- Includes all visible columns
- Filename includes current date

## Usage

### Navigation
The component is accessible from the sidebar under "PLC Control" → "Sensor Logs" (🔍 icon).

### Filtering Workflow
1. Select a rack from the "Rack ID" dropdown to view logs for a specific rack
2. Choose an operation type to filter by sensor activation, deactivation, or other operations
3. Set date range to view logs within a specific time period
4. Click "Clear Filters" to reset all filters

### Pagination
- Use "Previous" and "Next" buttons to navigate through pages
- Buttons are disabled when at the first or last page
- Pagination resets when filters change

### Export
1. Click "📤 Export to CSV" button in the header
2. File will be downloaded as `plc-sensor-logs-YYYY-MM-DD.csv`
3. Export is disabled when no logs are displayed

## API Endpoints

### GET /api/logs/plc
Fetches PLC logs with filtering and pagination.

**Query Parameters:**
- `rackId`: Filter by rack identifier (optional)
- `operation`: Filter by PLC operation type (optional)
- `startDate`: ISO date string for start date (optional)
- `endDate`: ISO date string for end date (optional)
- `limit`: Number of logs per page (default: 50)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "logs": [...],
    "pagination": {
      "limit": 50,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

### GET /api/logs/plc/statistics
Fetches aggregated statistics for PLC logs.

**Query Parameters:**
- `startDate`: ISO date string for start date (optional)
- `endDate`: ISO date string for end date (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOperations": 1234,
    "successRate": 98.5,
    "averageResponseTime": 42,
    "errorsByRack": {
      "S1-R05": 2,
      "S1-R12": 1
    },
    "operationBreakdown": {
      "SENSOR_ON": 617,
      "SENSOR_OFF": 615,
      "errors": 2
    }
  }
}
```

## Styling

The component uses the existing PLC styling classes:
- `plc-page`: Main container
- `plc-card`: Card wrapper for sections
- `plc-table`: Table styling
- `plc-btn`: Button styles
- Status color classes: `text-green-400`, `text-red-400`, `text-yellow-400`

## Requirements Fulfilled

- **Requirement 4.6**: Query interface for retrieving logs filtered by date range, rack, SKU, or status
- **Requirement 12.3**: API endpoint for retrieving PLC logs with filters
- **Requirement 12.4**: API endpoint for retrieving PLC log statistics

## Future Enhancements

Potential improvements for the component:
- Real-time log updates via WebSocket
- Advanced search with multiple filters
- Custom date presets (Last 7 days, Last 30 days, etc.)
- Download statistics as PDF report
- Log detail modal with full information
- Chart visualizations for statistics
