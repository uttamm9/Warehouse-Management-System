# System Logs - Troubleshooting Guide

## Error: "Failed to fetch logs: Not Found"

This error indicates the backend API endpoint cannot be reached or hasn't been properly initialized.

---

## Quick Diagnostics Checklist

### 1. **Run Health Check Endpoints** (while backend is running)

```bash
# In a browser or using curl:
http://localhost:3001/health
http://localhost:3001/logs/health
http://localhost:3001/logs
```

Expected responses:

- `/health` → `{ success: true, message: "Server is running" }`
- `/logs/health` → Shows database connection status
- `/logs` → Returns logs array (may be empty)

---

## Step-by-Step Resolution

### Step 1: Verify Backend is Running

Check your Express server terminal for:

```
[Express] Backend API running on port 3001
[Express] Registered routes:
  GET  /logs
  POST /logs
  GET  /logs/metadata
```

**If not visible:**

- Kill the current backend process
- Restart the backend server
- Look for errors in the terminal

---

### Step 2: Run Prisma Migration (CRITICAL)

If you haven't already, the SystemLog table doesn't exist:

```bash
cd electron-react-app
npx prisma migrate deploy
```

Expected output:

```
4 migrations already applied...
1 new migration applied
✓ Generated Prisma Client
```

**If you get errors:**

```bash
# Reset migrations (CAREFUL - clears all data)
npx prisma migrate reset

# Or view migration status
npx prisma migrate status
```

---

### Step 3: Run Diagnostics Script

```bash
cd electron-react-app
node desktop/scripts/check-logs-setup.js
```

This will check:

- ✓ Database connection
- ✓ SystemLog table existence
- ✓ Logs controller import
- ✓ Log creation
- ✓ Log retrieval

---

### Step 4: Check Express Server Logs

Look for these console messages:

```
[Logs API] Request received: { query: { page: '1', limit: '20' } }
[Logs Controller] getLogs called with filters...
[Logs Controller] Database connection OK
[Logs Controller] Found logs: 0
```

**If you see connection errors:**

```
[Logs Controller] Database connection failed: ...
```

→ Database connection is broken (check DATABASE_URL)

---

### Step 5: Verify Database Connection

Check your `.env` file has `DATABASE_URL`:

```
DATABASE_URL="postgresql://user:password@host:port/database"
```

Test the connection:

```bash
npx prisma db execute
# Type: SELECT 1;
# Should return: Query succeeded
```

---

### Step 6: Regenerate Prisma Client

```bash
cd electron-react-app
npx prisma generate
```

Then restart the backend server.

---

## Common Causes & Solutions

| Error                            | Cause                              | Solution                                    |
| -------------------------------- | ---------------------------------- | ------------------------------------------- |
| "Not Found"                      | Backend routes not registered      | Restart backend after code changes          |
| "Not Found"                      | Migration not applied              | Run `npx prisma migrate deploy`             |
| "Database connection failed"     | Wrong DATABASE_URL                 | Check .env file                             |
| "SystemLog table does not exist" | Prisma schema out of sync          | Run `npx prisma generate && migrate deploy` |
| CORS error                       | Frontend running on different port | Check localhost:3001 access                 |
| TimeoutError in Prisma           | Database unreachable               | Verify DATABASE_URL points to correct host  |

---

## Testing the API Manually

### Using curl:

```bash
# Get all logs
curl "http://localhost:3001/logs"

# Get logs with pagination
curl "http://localhost:3001/logs?page=1&limit=10"

# Search logs
curl "http://localhost:3001/logs?search=SKU"

# Filter by user
curl "http://localhost:3001/logs?user=Admin"

# Get available filters
curl "http://localhost:3001/logs/metadata"

# Create a test log
curl -X POST "http://localhost:3001/logs" \
  -H "Content-Type: application/json" \
  -d '{
    "user": "Admin",
    "action": "ConfigChanged",
    "item": "TEST-001",
    "details": "Test log from curl",
    "status": "info"
  }'
```

---

## Database Schema Verification

To verify the SystemLog table exists:

```bash
cd electron-react-app

# Using Prisma studio (interactive)
npx prisma studio

# Then navigate to SystemLog model

# Or use psql (if PostgreSQL)
psql -d warehouse_new -U postgres -c "\d \"SystemLog\""
```

Expected output shows columns: id, timestamp, user, action, item, details, status, createdAt

---

## Frontend Console Check

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for error messages
4. Check **Network** tab:
   - Click on the failed request
   - Check **Status** (should be 200, not 404)
   - Check **Response** tab for error message
   - Check **Headers** for CORS issues

---

## Complete Reset (Last Resort)

If everything fails:

```bash
cd electron-react-app

# 1. Clear Prisma cache
rm -rf node_modules/.prisma
rm prisma/prisma-client/index.js  # if exists

# 2. Regenerate
npx prisma generate

# 3. Reset database (WARNING: DELETES DATA)
npx prisma migrate reset

# 4. Run migrations
npx prisma migrate deploy

# 5. Restart backend
# Kill terminal and restart
```

---

## Enable Debug Logging

To see even more details:

```bash
# In terminal running backend
export DEBUG=prisma:*
# Then restart backend
```

---

## Still Having Issues?

Collect this information and check:

1. **Backend logs**: Screenshot of terminal output
2. **Frontend logs**: DevTools Console tab
3. **Diagnostics output**: `node desktop/scripts/check-logs-setup.js` result
4. **Database status**: `npx prisma db execute` with `SELECT 1;`
5. **curl response**: `curl http://localhost:3001/health`

---

## Next Steps

After fix:

1. Clear browser cache (Ctrl+Shift+Del)
2. Refresh System Logs page (F5)
3. Should see health check endpoint logs in backend terminal
4. Should see data load in frontend
