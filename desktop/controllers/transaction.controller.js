const { prisma } = require('../db.js');

/**
 * Get transaction history with pagination, filtering, search, and sorting.
 * 
 * Query params:
 *   page       - Page number (default: 1)
 *   limit      - Items per page (default: 10, options: 10/25/50)
 *   type       - Transaction type filter: INWARD | OUTWARD | null (all)
 *   search     - Search by SKU code or product name
 *   rack       - Filter by rack location (partial match)
 *   fromDate   - Start date filter (ISO string)
 *   toDate     - End date filter (ISO string)
 *   sortBy     - Sort field (default: timestamp)
 *   sortOrder  - Sort direction: asc | desc (default: desc)
 */
async function getTransactionHistory(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      type = null,
      search = '',
      rack = '',
      fromDate = null,
      toDate = null,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};

    // Type filter
    if (type && (type === 'INWARD' || type === 'OUTWARD')) {
      where.type = type;
    }

    // Date range filter
    if (fromDate || toDate) {
      where.timestamp = {};
      if (fromDate) {
        where.timestamp.gte = new Date(fromDate);
      }
      if (toDate) {
        // Set to end of day
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        where.timestamp.lte = endDate;
      }
    }

    // Rack location filter (partial match)
    if (rack && rack.trim()) {
      where.rackLocation = {
        contains: rack.trim(),
        mode: 'insensitive'
      };
    }

    // Search by SKU code or product name
    if (search && search.trim()) {
      where.sku = {
        OR: [
          { skuCode: { contains: search.trim(), mode: 'insensitive' } },
          { productName: { contains: search.trim(), mode: 'insensitive' } }
        ]
      };
    }

    // Determine sort config
    const validSortFields = ['timestamp', 'quantity'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'timestamp';
    const order = sortOrder === 'asc' ? 'asc' : 'desc';

    // Execute query with count
    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          sku: {
            select: {
              skuCode: true,
              productName: true,
              barcode: true,
              category: {
                select: { name: true }
              }
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { [sortField]: order },
        skip,
        take: limitNum
      }),
      prisma.transaction.count({ where })
    ]);

    // Format response
    const formattedTransactions = transactions.map(tx => ({
      id: tx.id,
      dateTime: tx.timestamp,
      skuCode: tx.sku.skuCode,
      productName: tx.sku.productName,
      category: tx.sku.category?.name || 'N/A',
      quantity: tx.quantity,
      rackLocation: tx.rackLocation || 'N/A',
      operator: tx.user?.name || 'Operator',
      status: tx.status || 'success',
      actionType: tx.type,
      barcodeValue: tx.barcodeValue || null,
      barcodeNumber: tx.barcodeNumber || null,
      skuBarcode: tx.sku.barcode || null
    }));

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        transactions: formattedTransactions,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('[Transactions API] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = { getTransactionHistory };
