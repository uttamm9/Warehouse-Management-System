/**
 * Barcode Service
 * Handles barcode generation, validation, and formatting
 */

const { prisma } = require('./db.js');

class BarcodeService {
    /**
     * Generate a unique barcode value
     * Format: BARCODE-YYYYMMDD-XXXXX (36 chars total for uniqueness)
     * @returns {Promise<string>} Generated barcode value
     */
    async generateUniqueBarcode() {
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

        let barcode;
        let attempts = 0;
        const maxAttempts = 100;

        while (attempts < maxAttempts) {
            const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
            barcode = `BC-${dateStr}-${randomSuffix}`;

            // Check if barcode already exists
            const existing = await prisma.sKU.findUnique({
                where: { barcode },
                select: { id: true }
            }).catch(() => null);

            if (!existing) {
                return barcode;
            }
            attempts++;
        }

        // Fallback: use timestamp-based approach
        const timestamp = Date.now();
        return `BC-${timestamp}`;
    }

    /**
     * Generate barcode from SKU code
     * Alternative: Use SKU code as basis for barcode (deterministic)
     * @param {string} skuCode - The SKU code (e.g., 'SKU-1001')
     * @returns {string} Generated barcode
     */
    generateBarcodeFromSkuCode(skuCode) {
        // Extract numeric portion and pad with timestamp for uniqueness
        const match = skuCode.match(/(\d+)/);
        const numericPart = match ? match[1].padStart(8, '0') : '00000000';
        const timestamp = Date.now().toString().slice(-6);
        return `${numericPart}${timestamp}`;
    }

    /**
     * Validate barcode format (should be 12-15 digits for standard barcodes)
     * @param {string} barcode - Barcode value to validate
     * @returns {boolean} True if valid
     */
    validateBarcodeFormat(barcode) {
        if (!barcode || typeof barcode !== 'string') return false;
        // Allow alphanumeric barcodes (our format is alphanumeric)
        return /^[A-Z0-9-]+$/.test(barcode) && barcode.length >= 8;
    }

    /**
     * Check if barcode is unique in the system
     * @param {string} barcode - Barcode to check
     * @param {string} excludeSkuId - SKU ID to exclude (for updates)
     * @returns {Promise<boolean>} True if unique
     */
    async isBarcodeUnique(barcode, excludeSkuId = null) {
        const existing = await prisma.sKU.findUnique({
            where: { barcode },
            select: { id: true }
        }).catch(() => null);

        if (!existing) return true;
        if (excludeSkuId && existing.id === excludeSkuId) return true;
        return false;
    }

    /**
     * Generate barcode data object with metadata
     * @param {string} skuCode - SKU code
     * @param {string} productName - Product name
     * @param {string} barcode - Barcode value
     * @returns {object} Barcode data for printing/display
     */
    generateBarcodeData(skuCode, productName, barcode) {
        return {
            value: barcode,
            format: 'CODE128',
            width: 2,
            height: 100,
            displayValue: true,
            fontSize: 14,
            margin: 10,
            metadata: {
                skuCode,
                productName,
                generatedAt: new Date().toISOString()
            }
        };
    }

    /**
     * Generate printable label format for barcode
     * @param {object} sku - SKU object
     * @returns {object} Label data for printing
     */
    generateLabelFormat(sku) {
        return {
            barcode: sku.barcode,
            skuCode: sku.skuCode,
            productName: sku.productName,
            weight: `${sku.weight} kg`,
            dimensions: `${sku.length}×${sku.width}×${sku.height} mm`,
            generatedDate: new Date().toLocaleDateString(),
            format: 'CODE128'
        };
    }
}

module.exports = new BarcodeService();
