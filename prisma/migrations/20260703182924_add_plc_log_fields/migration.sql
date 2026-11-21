-- AlterTable: Add optional PLC-specific columns to SystemLog
ALTER TABLE "SystemLog" ADD COLUMN "plcOperation" TEXT;
ALTER TABLE "SystemLog" ADD COLUMN "plcAddress" INTEGER;
ALTER TABLE "SystemLog" ADD COLUMN "plcValue" TEXT;
ALTER TABLE "SystemLog" ADD COLUMN "rackId" TEXT;

-- AlterEnum: Add new LogAction enum values for sensor operations
ALTER TYPE "LogAction" ADD VALUE 'SensorActivated';
ALTER TYPE "LogAction" ADD VALUE 'SensorDeactivated';
ALTER TYPE "LogAction" ADD VALUE 'SensorActivationFailed';
ALTER TYPE "LogAction" ADD VALUE 'SensorDeactivationFailed';
ALTER TYPE "LogAction" ADD VALUE 'PLCCommunicationError';

-- CreateIndex: Add index on rackId for efficient filtering by rack
CREATE INDEX "SystemLog_rackId_idx" ON "SystemLog"("rackId");

-- CreateIndex: Add index on plcOperation for efficient filtering by PLC operation type
CREATE INDEX "SystemLog_plcOperation_idx" ON "SystemLog"("plcOperation");
