const { PrismaClient } = require("./desktop/prisma/index.js");
const prisma = new PrismaClient();

async function test() {
  try {
    const totalSkus = await prisma.sKU.count();
    
    // Inventory total stock
    const skus = await prisma.sKU.findMany({ select: { stock: true } });
    const inventoryUnits = skus.reduce((acc, sku) => acc + sku.stock, 0);

    // Get last 8 logs for activity feed
    const recentLogs = await prisma.systemLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 8
    });

    const activityFeed = recentLogs.map((log) => {
      let type = "scan";
      const acts = log.action.toLowerCase();
      if (acts.includes("place")) type = "placement";
      else if (acts.includes("remove") || acts.includes("dispatch")) type = "dispatch";
      
      const timeDiffMs = Date.now() - new Date(log.timestamp).getTime();
      const minutes = Math.max(1, Math.floor(timeDiffMs / 60000));
      
      return {
        id: log.id,
        type,
        message: log.details || `${log.action} - ${log.item}`,
        time: `${minutes} min ago`
      };
    });

    // Inbound/Outbound AreaChart (Grouped by day for last 7 days)
    const txs = await prisma.transaction.findMany({
      where: {
        timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const inboundOutboundData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      inboundOutboundData.push({
        day: days[d.getDay()],
        inbound: 0,
        outbound: 0,
        _dateString: d.toDateString() // for matching
      });
    }

    txs.forEach(tx => {
      const d = new Date(tx.timestamp);
      const row = inboundOutboundData.find(r => r._dateString === d.toDateString());
      if (row) {
        if (tx.type === 'INWARD') row.inbound += tx.quantity;
        else row.outbound += tx.quantity;
      }
    });

    // Daily Activity Timeline (Grouped by 2-hour slots for today)
    const todayLogs = await prisma.systemLog.findMany({
      where: {
        timestamp: { gte: new Date(new Date().setHours(0,0,0,0)) }
      }
    });

    const timelineMap = {
      "06:00": { time: "06:00", scans: 0, placements: 0, dispatches: 0 },
      "08:00": { time: "08:00", scans: 0, placements: 0, dispatches: 0 },
      "10:00": { time: "10:00", scans: 0, placements: 0, dispatches: 0 },
      "12:00": { time: "12:00", scans: 0, placements: 0, dispatches: 0 },
      "14:00": { time: "14:00", scans: 0, placements: 0, dispatches: 0 },
      "16:00": { time: "16:00", scans: 0, placements: 0, dispatches: 0 },
      "18:00": { time: "18:00", scans: 0, placements: 0, dispatches: 0 },
      "20:00": { time: "20:00", scans: 0, placements: 0, dispatches: 0 },
    };

    todayLogs.forEach(log => {
      const h = new Date(log.timestamp).getHours();
      let bucket = "06:00";
      if (h >= 20) bucket = "20:00";
      else if (h >= 18) bucket = "18:00";
      else if (h >= 16) bucket = "16:00";
      else if (h >= 14) bucket = "14:00";
      else if (h >= 12) bucket = "12:00";
      else if (h >= 10) bucket = "10:00";
      else if (h >= 8) bucket = "08:00";
      
      const acts = log.action.toLowerCase();
      if (acts.includes("place")) timelineMap[bucket].placements++;
      else if (acts.includes("remove") || acts.includes("dispatch")) timelineMap[bucket].dispatches++;
      else timelineMap[bucket].scans++;
    });

    console.log(JSON.stringify({
      totalSkus,
      inventoryUnits,
      activityFeed,
      inboundOutboundData,
      dailyActivityData: Object.values(timelineMap)
    }, null, 2));

  } catch (e) {
    console.error("Test error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
