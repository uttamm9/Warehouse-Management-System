-- Add barcode support to SKU table
ALTER TABLE "SKU" ADD COLUMN "barcode" TEXT UNIQUE;
ALTER TABLE "SKU" ADD COLUMN "barcodeFormat" TEXT DEFAULT 'CODE128';

-- Create index for faster barcode lookups
CREATE INDEX "SKU_barcode_idx" ON "SKU"("barcode");
