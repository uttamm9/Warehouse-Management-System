-- CreateEnum
CREATE TYPE "LogUser" AS ENUM ('Admin', 'Manager', 'System', 'Operator1', 'Operator2');

-- CreateEnum
CREATE TYPE "LogAction" AS ENUM ('ConfigChanged', 'BackupCompleted', 'ScannedQRCode', 'StartedConveyor', 'UpdatedSKUDetails', 'PlacedOnRack', 'UserLogin', 'RemovedFromRack', 'GeneratedInvoice', 'RackCapacityWarning', 'StoppedConveyor', 'EmergencyStopActivated');

-- CreateEnum
CREATE TYPE "LogStatus" AS ENUM ('success', 'error', 'warning', 'info');

-- CreateTable
CREATE TABLE "SystemLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user" "LogUser" NOT NULL,
    "action" "LogAction" NOT NULL,
    "item" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "status" "LogStatus" NOT NULL DEFAULT 'info',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SystemLog_timestamp_idx" ON "SystemLog"("timestamp");

-- CreateIndex
CREATE INDEX "SystemLog_user_idx" ON "SystemLog"("user");

-- CreateIndex
CREATE INDEX "SystemLog_action_idx" ON "SystemLog"("action");

-- CreateIndex
CREATE INDEX "SystemLog_status_idx" ON "SystemLog"("status");
