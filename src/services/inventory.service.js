// src/services/inventory.service.js
const { PrismaClient } = require('../../desktop/prisma');
const QRCode = require('qrcode');
const { allocateShelf } = require('./allocation.service');
const { getIo } = require('../socket');
const prisma = new PrismaClient();

async function processInward(skuCode, quantity) {
    // Use sequential transaction isolation to prevent race conditions on shelf capacities
    return await prisma.$transaction(async (tx) => {

        // 1. Validation & Allocation
        const { shelf, sku, requiredVolume, requiredWeight } = await allocateShelf(skuCode, quantity);

        // 2. Generate QR Code Payload
        const qrData = JSON.stringify({ skuCode, rack: shelf.rack.name, shelf: shelf.level });
        const qrCodeImage = await QRCode.toDataURL(qrData);

        // 3. Upsert Inventory Record
        const existingInventory = await tx.inventory.findFirst({
            where: { skuId: sku.id, shelfId: shelf.id }
        });

        let inventoryRec;
        if (existingInventory) {
            inventoryRec = await tx.inventory.update({
                where: { id: existingInventory.id },
                data: { quantity: { increment: quantity }, qrCode: qrCodeImage }
            });
        } else {
            inventoryRec = await tx.inventory.create({
                data: { skuId: sku.id, shelfId: shelf.id, quantity, qrCode: qrCodeImage }
            });
        }

        // 4. Update Shelf Free/Used Space
        const updatedShelf = await tx.shelf.update({
            where: { id: shelf.id },
            data: {
                usedVolume: { increment: requiredVolume },
                usedWeight: { increment: requiredWeight }
            }
        });

        // 5. Create Audit Transaction 
        const transaction = await tx.transaction.create({
            data: {
                type: 'INWARD',
                skuId: sku.id,
                quantity: quantity,
            }
        });

        // 6. Update Master SKU Stock
        await tx.sKU.update({
            where: { id: sku.id },
            data: { stock: { increment: quantity } }
        });

        // 7. Emit Real-Time WebSocket Event
        const io = getIo();
        if (io) {
            io.emit("inward_update", {
                skuCode,
                rackName: shelf.rack.name,
                shelfId: shelf.id,
                level: shelf.level,
                updatedSpace: {
                    usedVolume: updatedShelf.usedVolume,
                    freeVolume: updatedShelf.maxVolume - updatedShelf.usedVolume
                }
            });
        }

        return {
            success: true,
            transactionId: transaction.id,
            rackName: shelf.rack.name,
            shelfLevel: shelf.level,
            qrCode: qrCodeImage
        };
    });
}

module.exports = { processInward };
