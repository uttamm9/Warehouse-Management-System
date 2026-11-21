/*
  Warnings:

  - The values [ScannedProductCode] on the enum `LogAction` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `rackId` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `SKU` table. All the data in the column will be lost.
  - You are about to drop the column `dimensions` on the `SKU` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SKU` table. All the data in the column will be lost.
  - You are about to drop the column `capacity` on the `Shelf` table. All the data in the column will be lost.
  - You are about to drop the column `occupiedSpace` on the `Shelf` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceId]` on the table `Billing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[qrCode]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Rack` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[skuCode]` on the table `SKU` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barcodeNumber]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceId` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rackCharges` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rackHistory` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weightCharges` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Rack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `SKU` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `SKU` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skuCode` to the `SKU` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryId` to the `SKU` table without a default value. This is not possible if the table is not empty.
  - Made the column `barcodeFormat` on table `SKU` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `maxVolume` to the `Shelf` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxWeight` to the `Shelf` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LogAction_new" AS ENUM ('ConfigChanged', 'BackupCompleted', 'ScannedQRCode', 'StartedConveyor', 'UpdatedSKUDetails', 'PlacedOnRack', 'UserLogin', 'RemovedFromRack', 'GeneratedInvoice', 'RackCapacityWarning', 'StoppedConveyor', 'EmergencyStopActivated', 'SensorActivated', 'SensorDeactivated', 'SensorActivationFailed', 'SensorDeactivationFailed', 'PLCCommunicationError');
ALTER TABLE "SystemLog" ALTER COLUMN "action" TYPE "LogAction_new" USING ("action"::text::"LogAction_new");
ALTER TYPE "LogAction" RENAME TO "LogAction_old";
ALTER TYPE "LogAction_new" RENAME TO "LogAction";
DROP TYPE "LogAction_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_rackId_fkey";

-- DropIndex
DROP INDEX "SKU_barcode_idx";

-- AlterTable
ALTER TABLE "Billing" ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "invoiceId" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "rackCharges" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rackHistory" TEXT NOT NULL,
ADD COLUMN     "weightCharges" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "rackId",
ADD COLUMN     "qrCode" TEXT;

-- AlterTable
ALTER TABLE "Rack" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SKU" DROP COLUMN "category",
DROP COLUMN "dimensions",
DROP COLUMN "name",
ADD COLUMN     "categoryId" UUID NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "length" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "skuCode" TEXT NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subCategoryId" UUID NOT NULL,
ADD COLUMN     "width" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "weight" SET DEFAULT 0,
ALTER COLUMN "barcodeFormat" SET NOT NULL;

-- AlterTable
ALTER TABLE "Shelf" DROP COLUMN "capacity",
DROP COLUMN "occupiedSpace",
ADD COLUMN     "maxVolume" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maxWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "usedVolume" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "usedWeight" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SystemLog" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "barcodeImageData" TEXT,
ADD COLUMN     "barcodeNumber" TEXT,
ADD COLUMN     "barcodeValue" TEXT,
ADD COLUMN     "rackLocation" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'success',
ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "roleId" UUID NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "moduleId" UUID NOT NULL,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canCreate" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_roleId_moduleId_key" ON "Permission"("roleId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Billing_invoiceId_key" ON "Billing"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_qrCode_key" ON "Inventory"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "Rack_name_key" ON "Rack"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SKU_skuCode_key" ON "SKU"("skuCode");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_barcodeNumber_key" ON "Transaction"("barcodeNumber");

-- CreateIndex
CREATE INDEX "Transaction_timestamp_idx" ON "Transaction"("timestamp");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_barcodeNumber_idx" ON "Transaction"("barcodeNumber");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SKU" ADD CONSTRAINT "SKU_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SKU" ADD CONSTRAINT "SKU_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
