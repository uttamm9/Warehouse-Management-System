const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const allocationService = require('./allocation.service.js');
const { prisma } = require('./db.js');
const { getLogs, createLog, getAvailableActions, getAvailableUsers, getPLCLogs, getPLCStatistics } = require('./controllers/logs.controller.js');
const { getRackMonitoring, getAllRacks, getSensorMapping, testRackSensor } = require('./controllers/rack.controller.js');
const {
  getInboundReport,
  getOutboundReport,
  getStockReport,
  getRackUtilizationReport,
  getGraphsData,
  getSummaryReport
} = require('./controllers/reports.controller.js');
const { uploadBillingCsv, saveBulkBilling, upload } = require('./controllers/billing.controller.js');
const { getTransactionHistory } = require('./controllers/transaction.controller.js');

// ── PLC Service ───────────────────────────────────────────────────────────────
const plcService = require('./plc/plcService.js');
const plcConfig = require('./plc/plcConfig.js');
const plcLogger = require('./plc/plcLogger.js');

const app = express();
app.use(cors())
app.use(express.json());

// RBAC Middleware that blocks unauthorized HTTP requests
const rbacMiddleware = (moduleName, action) => {
  return async (req, res, next) => {
    try {
      const role = req.headers['x-user-role'];
      if (!role) {
        return res.status(403).json({ success: false, message: 'Forbidden: No role provided in headers.' });
      }

      if (role === 'ADMIN') {
        return next();
      }

      const perm = await prisma.permission.findFirst({
        where: { role: { name: role }, module: { name: moduleName } },
      });

      if (!perm || perm[action] !== true) {
        console.warn(`[RBAC] Rejected ${req.method} ${req.url}: Role ${role} missing ${action} on ${moduleName}`);
        return res.status(403).json({ success: false, message: `Forbidden: Missing ${action} permission on ${moduleName}` });
      }

      next();
    } catch (e) {
      console.error('[RBAC Error]', e);
      res.status(500).json({ success: false, message: 'Server auth error' });
    }
  };
};

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('[Socket] Client connected:', socket.id);

  // Send current PLC status immediately on connect
  socket.emit('plc:status', { ...plcService.getStatus(), timestamp: new Date().toISOString() });

  socket.on('disconnect', () => {
    console.log('[Socket] Client disconnected:', socket.id);
  });
});

// ── Wire PLC service events → Socket.IO ───────────────────────────────────────
plcService.on('connected', (data) => {
  console.log('[PLC] Connected:', data.port);
  io.emit('plc:status', { ...plcService.getStatus(), event: 'connected', timestamp: new Date().toISOString() });
});

plcService.on('disconnected', (data) => {
  console.log('[PLC] Disconnected:', data.reason);
  io.emit('plc:status', { ...plcService.getStatus(), event: 'disconnected', reason: data.reason, timestamp: new Date().toISOString() });
});

plcService.on('error', (data) => {
  console.error('[PLC] Error:', data.message);
  io.emit('plc:status', { ...plcService.getStatus(), event: 'error', error: data.message, timestamp: new Date().toISOString() });
});

plcService.on('poll', (payload) => {
  const eventName = (payload.type === 'D' || payload.type === 'T' || payload.type === 'C')
    ? 'plc:register_update'
    : 'plc:coil_update';
  io.emit(eventName, payload);
});

plcService.on('fault', (data) => {
  io.emit('plc:fault', data);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Logs health check
app.get('/logs/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const count = await prisma.systemLog.count().catch(() => -1);
    res.json({
      success: true,
      message: 'Logs service is healthy',
      database: 'connected',
      logsTableExists: count >= 0,
      logCount: count >= 0 ? count : 'unknown'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { role: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Account Not Found' });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or passwordd' });
    }

    const permissions = await prisma.permission.findMany({
      where: { roleId: user.roleId },
      include: { module: true, role: true }
    });

    return res.json({
      success: true,
      message: "Login done",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.name || 'GUEST'
      },
      permissions
    });

  } catch (error) {
    console.error('[LOGIN API ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /sku/:skuCode (accepts both SKU code and barcode)
app.get('/sku/:skuCode', async (req, res) => {
  try {
    const sku = await allocationService.getSkuByCode(req.params.skuCode);
    if (!sku) {
      return res.status(404).json({ success: false, message: 'SKU not found' });
    }
    // Return formatted SKU with barcode information
    res.json({
      success: true,
      data: {
        skuCode: sku.skuCode,
        barcode: sku.barcode,
        barcodeFormat: sku.barcodeFormat || 'CODE128',
        productName: sku.productName,
        dimensions: `${sku.length}×${sku.width}×${sku.height}`,
        weight: sku.weight,
        category: sku.category.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/scan/:barcode
app.get('/api/scan/:barcode', rbacMiddleware('Scan Page Access', 'canView'), async (req, res) => {
  try {
    const { barcode } = req.params;

    // Use allocationService to find SKU by code or barcode
    const sku = await allocationService.getSkuByCode(barcode);

    if (!sku) {
      return res.status(404).json({ success: false, message: 'Barcode or SKU not found' });
    }

    res.json({
      success: true,
      data: {
        skuCode: sku.skuCode,
        productName: sku.productName,
        category: sku.category?.name || 'N/A',
        subCategory: sku.subCategory?.name || 'N/A',
        quantity: sku.stock,
        rackLocation: sku.rackLocation || 'Not Assigned',
        barcode: sku.barcode || sku.skuCode,
        weight: sku.weight,
        dimensions: `${sku.length}×${sku.width}×${sku.height}`,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /inventory/preview-allocation
app.post('/inventory/preview-allocation', async (req, res) => {
  try {
    const { skuCode, quantity } = req.body;
    if (!skuCode || !quantity) {
      return res.status(400).json({ success: false, message: 'Missing skuCode or quantity' });
    }

    // Convert to number
    const qty = parseInt(quantity, 10);
    const allocation = await allocationService.previewAllocation(skuCode, qty);

    res.json({
      success: true,
      data: {
        // Include shelfIds and a primary shelfId so the client can populate selection
        shelfIds: allocation.shelfIds,
        shelfId: allocation.shelfId,
        rackId: allocation.rackId,
        rackName: allocation.rackName,
        shelfLevel: allocation.shelfLevel,
        freeSpace: allocation.freeSpace,
        usedSpace: allocation.usedSpace,
        occupancyPercent: allocation.occupancyPercent
      }
    });
  } catch (error) {
    if (error.message.includes('No available shelf space')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /inventory/inward
app.post('/inventory/inward', rbacMiddleware('Inventory', 'canCreate'), async (req, res) => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         POST /inventory/inward - ENDPOINT HIT              ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));

  try {
    const { skuCode, quantity, overrideShelfId } = req.body;

    if (!skuCode || !quantity) {
      console.error('❌ Missing required fields: skuCode or quantity');
      return res.status(400).json({ success: false, message: 'Missing skuCode or quantity' });
    }

    const qty = parseInt(quantity, 10);

    console.log('\n➡️  Calling allocationService.confirmInward()...');
    console.log(`   SKU: ${skuCode}`);
    console.log(`   Quantity: ${qty}`);
    console.log(`   Override Shelf: ${overrideShelfId || 'None (Auto-allocate)'}`);
    console.log('');

    const result = await allocationService.confirmInward(skuCode, qty, overrideShelfId);

    console.log('\n✅ Allocation Service Result:');
    console.log(`   Success: ${result.success}`);
    console.log(`   Rack: ${result.allocation?.rackName}`);
    console.log(`   Shelf Level: ${result.allocation?.shelfLevel}`);
    console.log('');

    // emit WebSocket event
    io.emit('inward_update', {
      skuCode,
      quantity: qty,
      rackName: result.allocation.rackName,
      shelfLevel: result.allocation.shelfLevel,
      timestamp: new Date().toISOString()
    });

    console.log('✅ WebSocket event emitted: inward_update');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    res.json({
      success: true,
      message: 'Inventory added successfully',
      data: {
        qrData: result.data.qrData,
        rackLocation: `${result.allocation.rackName}-${result.allocation.shelfLevel}`,
        updatedSpace: {
          usedSpace: result.data.shelf.usedVolume,
          freeSpace: result.data.shelf.maxVolume - result.data.shelf.usedVolume,
          occupancyPercent: Math.round(((result.data.shelf.usedVolume) / result.data.shelf.maxVolume) * 100)
        }
      }
    });
  } catch (error) {
    console.error('\n❌ ERROR in /inventory/inward endpoint:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    res.status(400).json({ success: false, message: error.message });
  }
});

// Helper: Generate a unique short barcode number (BC-YYYYMMDD-XXXXX)
async function generateUniqueBarcodeNumber(tx) {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const barcodeNumber = `BC-${dateStr}-${randomSuffix}`;

    // Check uniqueness within the transaction context
    const existing = await tx.transaction.findUnique({
      where: { barcodeNumber },
      select: { id: true }
    }).catch(() => null);

    if (!existing) {
      return barcodeNumber;
    }
    attempts++;
  }

  // Fallback: timestamp-based
  return `BC-${Date.now()}`;
}

// POST /inventory/inward-batch — multi-level placement in a single operation
app.post('/inventory/inward-batch', rbacMiddleware('Inventory', 'canCreate'), async (req, res) => {
  try {
    const { skuCode, shelfIds } = req.body;
    if (!skuCode || !Array.isArray(shelfIds) || shelfIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing skuCode or shelfIds array' });
    }

    const invalidShelfIds = shelfIds.filter(id => typeof id !== 'string' || !id?.trim());
    if (invalidShelfIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid shelfIds provided: ${invalidShelfIds.map(id => String(id)).join(', ')}`
      });
    }

    // Lookup SKU and compute per-unit volume/weight, then process each shelf in a single DB transaction
    const sku = await allocationService.getSkuByCode(skuCode);
    if (!sku) {
      return res.status(404).json({ success: false, message: `SKU ${skuCode} not found` });
    }

    const unitVolume = sku.length * sku.width * sku.height;
    const unitWeight = sku.weight;

    // Process each shelf in a single DB transaction
    const results = await prisma.$transaction(async (tx) => {
      const placementResults = [];

      for (const shelfId of shelfIds) {
        const shelf = await tx.shelf.findUnique({
          where: { id: shelfId },
          include: { rack: true, inventories: true }
        });

        if (!shelf) {
          throw new Error(`Shelf ${shelfId} not found`);
        }

        const isOccupied = shelf.inventories.some(inv => inv.quantity > 0);
        if (isOccupied) {
          throw new Error(`Shelf ${shelf.rack.name}-L${shelf.level} is already occupied`);
        }

        if (shelf.maxVolume - shelf.usedVolume < unitVolume || shelf.maxWeight - shelf.usedWeight < unitWeight) {
          throw new Error(`Insufficient capacity on ${shelf.rack.name}-L${shelf.level}`);
        }

        // Update shelf
        const updatedShelf = await tx.shelf.update({
          where: { id: shelfId },
          data: {
            usedVolume: { increment: unitVolume },
            usedWeight: { increment: unitWeight }
          }
        });

        // Generate unique barcode identifiers
        const barcodeNumber = await generateUniqueBarcodeNumber(tx);
        const barcodeValue = `BC-${sku.skuCode}-${shelf.rack.name}-L${shelf.level}-${Date.now()}`;
        const qrData = `QR-${sku.skuCode}-${shelf.rack.name}-L${shelf.level}-${Date.now()}`;

        // Create inventory record (1 unit per shelf)
        const inv = await tx.inventory.create({
          data: {
            skuId: sku.id,
            shelfId: shelfId,
            quantity: 1,
            qrCode: qrData
          }
        });

        // Create transaction record WITH barcode data
        const transactionRecord = await tx.transaction.create({
          data: {
            type: 'INWARD',
            skuId: sku.id,
            quantity: 1,
            rackLocation: `${shelf.rack.name}-L${shelf.level}`,
            status: 'success',
            barcodeValue: barcodeValue,
            barcodeNumber: barcodeNumber,
            barcodeImageData: null // Will be populated client-side if needed
          }
        });

        placementResults.push({
          shelfId,
          rackName: shelf.rack.name,
          level: shelf.level,
          rackLocation: `${shelf.rack.name}-L${shelf.level}`,
          barcodeId: barcodeNumber,
          barcodeValue,
          barcodeNumber,
          inventoryId: inv.id,
          transactionId: transactionRecord.id
        });
      }

      // Update total SKU stock
      await tx.sKU.update({
        where: { id: sku.id },
        data: { stock: { increment: shelfIds.length } }
      });

      return placementResults;
    });

    // Activate rack sensors for each placement (fire-and-forget)
    console.log('\n🎯 [Inward Batch] Activating rack sensors...');
    const rackSensorService = require('./services/rackSensor.service');

    for (const placement of results) {
      try {
        const sensorResult = await rackSensorService.activateRackSensor(
          placement.rackName,
          skuCode,
          1 // quantity per placement
        );

        if (sensorResult.success) {
          console.log(`✅ Rack sensor activated for ${placement.rackName}`);
        } else {
          console.warn(`⚠️  Rack sensor activation failed for ${placement.rackName}: ${sensorResult.message}`);
        }
      } catch (error) {
        // Log error but don't block the response - sensor failures should never break inventory operations
        console.error(`❌ Rack sensor error for ${placement.rackName}:`, error.message);
      }
    }

    // Emit WebSocket event
    io.emit('inward_update', {
      skuCode,
      quantity: shelfIds.length,
      rackName: results[0]?.rackName || '',
      shelfLevel: results.map(r => r.level).join(', '),
      timestamp: new Date().toISOString()
    });

    // Build label data for each placement
    const labels = results.map(p => ({
      barcodeId: p.barcodeNumber,
      barcodeValue: p.barcodeValue,
      barcodeNumber: p.barcodeNumber,
      skuCode: sku.skuCode,
      productName: sku.productName,
      rackName: p.rackName,
      level: p.level,
      rackLocation: p.rackLocation,
      transactionId: p.transactionId,
      createdAt: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: `${shelfIds.length} unit(s) placed successfully`,
      data: {
        totalPlaced: shelfIds.length,
        placements: results,
        labels
      }
    });
  } catch (error) {
    console.error('[Inward Batch] Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST /inventory/outward — record an outbound (dispatch) transaction
app.post('/inventory/outward', rbacMiddleware('Inventory', 'canCreate'), async (req, res) => {
  try {
    const { skuCode, quantity, rackLocation } = req.body;
    if (!skuCode || !quantity) {
      return res.status(400).json({ success: false, message: 'Missing skuCode or quantity' });
    }

    const qty = parseInt(quantity, 10);

    const result = await allocationService.confirmOutward(skuCode, qty, rackLocation);
    const transactionRecord = result.data.transaction;

    // Activate outbound confirmation PLC signal (value=49, status=true)
    console.log('\n🚚 [Outward] Activating outbound confirmation...');
    const rackSensorService = require('./services/rackSensor.service');

    try {
      const outboundResult = await rackSensorService.activateOutboundConfirmation(
        skuCode,
        qty,
        rackLocation
      );

      if (outboundResult.success) {
        console.log(`✅ Outbound confirmation activated for ${skuCode}`);
      } else {
        console.warn(`⚠️  Outbound confirmation failed for ${skuCode}: ${outboundResult.message}`);
      }
    } catch (error) {
      // Log error but don't block the response - PLC failures should never break inventory operations
      console.error(`❌ Outbound confirmation error for ${skuCode}:`, error.message);
    }

    // emit WebSocket event
    io.emit('outward_update', {
      skuCode,
      quantity: qty,
      rackLocation: rackLocation || 'N/A',
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Outward transaction recorded successfully',
      data: {
        transactionId: transactionRecord.id,
        skuCode,
        quantity: qty,
        rackLocation: rackLocation || 'N/A'
      }
    });
  } catch (error) {
    console.error('[Outward API] Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /racks - Fetch all racks with levels for Inbound Inventory dynamic selection
app.get('/racks', rbacMiddleware('Racks', 'canView'), async (req, res) => {
  try {
    const result = await getAllRacks();
    if (!result.success) {
      return res.status(500).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================
// Rack Sensor API Routes
// =====================

// GET /api/racks/sensor-mapping/:rackName - Get sensor mapping for a rack
app.get('/api/racks/sensor-mapping/:rackName', getSensorMapping);

// POST /api/racks/test-sensor - Test a rack sensor
app.post('/api/racks/test-sensor', testRackSensor);

// =====================
// System Logs API Routes
// =====================

// GET /logs - Fetch logs with filters, search, and pagination
app.get('/logs', rbacMiddleware('Admin', 'canView'), async (req, res) => {
  try {
    console.log('[Logs API] =====================================');
    console.log('[Logs API] Request received');
    console.log('[Logs API] Query params:', req.query);

    const result = await getLogs({
      search: req.query.search || '',
      user: req.query.user || null,
      action: req.query.action || null,
      status: req.query.status || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
      page: req.query.page || 1,
      limit: req.query.limit || 20
    });

    console.log('[Logs API] Controller returned:');
    console.log('[Logs API]   success:', result.success);
    console.log('[Logs API]   message:', result?.message);
    if (result.data) {
      console.log('[Logs API]   totalCount:', result.data.pagination?.totalCount);
      console.log('[Logs API]   logsCount:', result.data.logs?.length);
    }

    if (!result.success) {
      console.error('[Logs API] Controller error:', result.message);
      console.error('[Logs API] Error code:', result.code);
      console.error('[Logs API] Stack:', result.error);
      return res.status(500).json(result);
    }

    console.log('[Logs API] ✓ Success');
    console.log('[Logs API] =====================================');
    res.json(result);
  } catch (error) {
    console.error('[Logs API] ❌ EXCEPTION in route handler');
    console.error('[Logs API] Error name:', error.name);
    console.error('[Logs API] Error message:', error.message);
    console.error('[Logs API] Error stack:', error.stack);

    res.status(500).json({
      success: false,
      message: error.message,
      code: error.code || 'UNKNOWN'
    });
  }
});

// POST /logs - Create a new log entry
app.post('/logs', rbacMiddleware('Admin', 'canCreate'), async (req, res) => {
  try {
    const { user, action, item, details, status } = req.body;

    const result = await createLog({
      user,
      action,
      item,
      details,
      status
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('[Logs API] Error creating log:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /logs/metadata - Get available filters
app.get('/logs/metadata', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        actions: getAvailableActions(),
        users: getAvailableUsers()
      }
    });
  } catch (error) {
    console.error('[Logs API] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/logs/plc - Get PLC logs with filters
app.get('/api/logs/plc', async (req, res) => {
  try {
    const result = await getPLCLogs({
      rackId: req.query.rackId || null,
      operation: req.query.operation || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
      limit: req.query.limit || 50,
      offset: req.query.offset || 0
    });

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('[Logs API] Error fetching PLC logs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/logs/plc/statistics - Get PLC log statistics
app.get('/api/logs/plc/statistics', async (req, res) => {
  try {
    const result = await getPLCStatistics({
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null
    });

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('[Logs API] Error calculating PLC statistics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================
// Reports API Routes
// =====================

app.get('/api/reports/inbound', rbacMiddleware('Reports', 'canView'), getInboundReport);
app.get('/api/reports/outbound', rbacMiddleware('Reports', 'canView'), getOutboundReport);
app.get('/api/reports/stock', rbacMiddleware('Reports', 'canView'), getStockReport);
app.get('/api/reports/rack-utilization', rbacMiddleware('Reports', 'canView'), getRackUtilizationReport);
app.get('/api/reports/graphs', rbacMiddleware('Reports', 'canView'), getGraphsData);
app.get('/api/reports/summary', rbacMiddleware('Reports', 'canView'), getSummaryReport);

// =====================
// Transaction History API Routes
// =====================
app.get('/api/transactions/history', rbacMiddleware('Inventory', 'canView'), getTransactionHistory);

// =====================
// Billing API Routes
// =====================
app.post('/api/billing/upload-csv', upload.single('file'), uploadBillingCsv);
app.post('/api/billing/bulk-insert', saveBulkBilling);

// =====================================================================
// PLC API Routes
// =====================================================================

// GET /api/plc/status
app.get('/api/plc/status', (req, res) => {
  res.json({ success: true, data: plcService.getStatus() });
});

// POST /api/plc/connect
app.post('/api/plc/connect', async (req, res) => {
  try {
    const result = await plcService.connect(req.body || null);
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message, ...(process.env.NODE_ENV === 'development' && { stack: e.stack }) });
  }
});

// POST /api/plc/disconnect
app.post('/api/plc/disconnect', async (req, res) => {
  try {
    const result = await plcService.disconnect();
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message, ...(process.env.NODE_ENV === 'development' && { stack: e.stack }) });
  }
});

// GET /api/plc/read/coil?type=M&address=10&count=1
app.get('/api/plc/read/coil', async (req, res) => {
  try {
    const { type = 'M', address, count = 1 } = req.query;
    if (address === undefined) return res.status(400).json({ success: false, message: 'address required' });
    const result = await plcService.readCoil(type, parseInt(address), parseInt(count));
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message, ...(process.env.NODE_ENV === 'development' && { stack: e.stack }) });
  }
});

// POST /api/plc/read-coil - POST version for consistency with frontend
app.post('/api/plc/read-coil', async (req, res) => {
  try {
    const { type = 'M', address, count = 1 } = req.body;
    if (address === undefined) return res.status(400).json({ success: false, message: 'address required' });
    const result = await plcService.readCoil(type, parseInt(address), parseInt(count));
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message, ...(process.env.NODE_ENV === 'development' && { stack: e.stack }) });
  }
});

// POST /api/plc/write/coil  { type, address, value }
app.post('/api/plc/write/coil', async (req, res) => {
  try {
    const { type = 'M', address, value } = req.body;
    if (address === undefined || value === undefined) return res.status(400).json({ success: false, message: 'address and value required' });
    const result = await plcService.writeCoil(type, parseInt(address), value);
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message, ...(process.env.NODE_ENV === 'development' && { stack: e.stack }) });
  }
});

// POST /api/plc/write-coil - Alternative endpoint name for consistency
app.post('/api/plc/write-coil', async (req, res) => {
  try {
    const { type = 'M', address, value } = req.body;
    if (address === undefined || value === undefined) return res.status(400).json({ success: false, message: 'address and value required' });
    const result = await plcService.writeCoil(type, parseInt(address), value);
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message, ...(process.env.NODE_ENV === 'development' && { stack: e.stack }) });
  }
});

// GET /api/plc/read/register?type=D&address=0&count=1
app.get('/api/plc/read/register', async (req, res) => {
  try {
    const { type = 'D', address, count = 1 } = req.query;
    if (address === undefined) return res.status(400).json({ success: false, message: 'address required' });
    const result = await plcService.readRegister(type, parseInt(address), parseInt(count));
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message, ...(process.env.NODE_ENV === 'development' && { stack: e.stack }) });
  }
});

// POST /api/plc/write/register  { type, address, value }
app.post('/api/plc/write/register', async (req, res) => {
  try {
    const { type = 'D', address, value } = req.body;
    if (address === undefined || value === undefined) return res.status(400).json({ success: false, message: 'address and value required' });
    const result = await plcService.writeRegister(type, parseInt(address), parseInt(value));
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message, ...(process.env.NODE_ENV === 'development' && { stack: e.stack }) });
  }
});

// POST /api/plc/write/tag  { tagName, value }
app.post('/api/plc/write/tag', async (req, res) => {
  try {
    const { tagName, value } = req.body;
    if (!tagName || value === undefined) return res.status(400).json({ success: false, message: 'tagName and value required' });
    const result = await plcService.writeTag(tagName, value);
    // Emit real-time update to all clients
    io.emit('plc:tag_write', { tagName, value, timestamp: new Date().toISOString(), ...result });
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message, ...(process.env.NODE_ENV === 'development' && { stack: e.stack }) });
  }
});

// GET /api/plc/read/tag?tagName=Conveyor_Running
app.get('/api/plc/read/tag', async (req, res) => {
  try {
    const { tagName } = req.query;
    if (!tagName) return res.status(400).json({ success: false, message: 'tagName required' });
    const result = await plcService.readTag(tagName);
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message, ...(process.env.NODE_ENV === 'development' && { stack: e.stack }) });
  }
});

// GET /api/plc/settings
app.get('/api/plc/settings', (req, res) => {
  res.json({ success: true, settings: plcConfig.loadSettings() });
});

// POST /api/plc/settings
app.post('/api/plc/settings', (req, res) => {
  const result = plcConfig.saveSettings(req.body);
  res.json(result);
});

// GET /api/plc/tags
app.get('/api/plc/tags', (req, res) => {
  res.json({ success: true, tags: plcConfig.loadTags() });
});

// POST /api/plc/tags
app.post('/api/plc/tags', (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ success: false, message: 'Body must be an array of tags' });
  const result = plcConfig.saveTags(req.body);
  res.json(result);
});

// GET /api/plc/logs?type=ERROR&limit=100
app.get('/api/plc/logs', (req, res) => {
  const { type, limit = 100, offset = 0 } = req.query;
  const result = plcLogger.getLogs({ type, limit: parseInt(limit), offset: parseInt(offset) });
  res.json({ success: true, ...result });
});

// DELETE /api/plc/logs
app.delete('/api/plc/logs', (req, res) => {
  res.json(plcLogger.clearLogs());
});

// GET /api/plc/ports
app.get('/api/plc/ports', async (req, res) => {
  try {
    const { SerialPort } = require('serialport');
    const portList = await SerialPort.list();
    const ports = portList.map(p => p.path);
    res.json({ success: true, ports });
  } catch (e) {
    // Graceful fallback — return empty array, not an error
    res.json({ success: true, ports: [] });
  }
});

// Auto-connect on startup if setting is enabled
setTimeout(() => {
  const settings = plcConfig.loadSettings();
  if (settings.autoConnect) {
    console.log('[PLC] Auto-connecting to', settings.port);
    plcService.connect().catch(e => console.error('[PLC] Auto-connect failed:', e.message));
  }
}, 2000);

// Start the server
const PORT = 3001;
function startExpressServer() {
  console.log('[Express] Registered routes:');
  console.log('[Express]   GET  /health');
  console.log('[Express]   GET  /logs/health');
  console.log('[Express]   GET  /logs, POST /logs, GET /logs/metadata');
  console.log('[Express]   GET  /api/logs/plc, GET /api/logs/plc/statistics');
  console.log('[Express]   GET  /sku/:skuCode');
  console.log('[Express]   POST /inventory/preview-allocation');
  console.log('[Express]   POST /inventory/inward, /inward-batch, /outward');
  console.log('[Express]   GET  /racks');
  console.log('[Express]   GET  /api/racks/sensor-mapping/:rackName');
  console.log('[Express]   POST /api/racks/test-sensor');
  console.log('[Express]   GET  /api/transactions/history');
  console.log('[Express]   PLC  /api/plc/* (status|connect|disconnect|read|write|settings|tags|logs)');
  const API_SERVER = `http://localhost:${PORT}`;

  httpServer.listen(PORT, () => {
    console.log(`[Express] Backend API running on port ${PORT}`);
    console.log(`[Express] Try: ${API_SERVER}/health`);
    console.log(`[Express] PLC: ${API_SERVER}/api/plc/status`);
  });
}

module.exports = { app, startExpressServer, io };
