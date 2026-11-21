// =============================================
// WSMS Mock Data - Warehouse Storage Management
// =============================================

export type RackType = "main" | "addon";
export type RackZone = "shed1" | "shed2" | "cabin";
export type ShelfStatus = "empty" | "full";
export type InvoiceStatus = "pending" | "paid";
export type LogStatus = "success" | "warning" | "error" | "info";
export type ConveyorState = "running" | "stopped" | "emergency";

export interface Level {
  id: string; // e.g. "R1-L1"
  level: number; // 1-5
  sku: string | null;
  productName: string | null;
  quantity: number;
  weight: number; // current kg
  maxCapacity: number; // 300 or 200
  status: ShelfStatus;
  containerType?: string | null;
}

export interface Rack {
  id: number;
  label: string; // "R1", "R2", etc.
  gridId: string; // e.g. "A1", "B5", etc.
  gridCol: string;
  gridRow: number;
  type: RackType;
  zone: RackZone;
  height: number; // mm
  length: number; // mm
  depth: number; // mm
  levels: Level[];
}

export interface SKU {
  id: string;
  name: string;
  category: string;
  weight: number;
  dimensions: string;
  rackAssignment: string | null; // e.g. "R7-L3"
  currentStock: number;
  reorderThreshold: number;
  description: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  sku: string;
  productName: string;
  storageDuration: number;
  weightCharges: number;
  rackCharges: number;
  totalAmount: number;
  status: InvoiceStatus;
  date: string;
  rackHistory: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  item: string;
  details: string;
  status: LogStatus;
}

export function getContainerLabel(ct: string | null): string {
  if (ct === "BIN-50") return "BIN-50";
  if (ct === "CCL") return "CCL Crate";
  return "—";
}

export interface Notification {
  id: number;
  text: string;
  type: "warning" | "info" | "error" | "success";
  time: string;
  read: boolean;
}

// ==================
// Product Data
// ==================

const productNames = [
  "Industrial Bearings", "Steel Plates", "Circuit Boards", "Hydraulic Pumps",
  "LED Panels", "Motor Assemblies", "Sensor Modules", "Cable Harness",
  "Gear Sets", "Control Valves", "Heat Sinks", "Power Supplies",
  "Mounting Brackets", "Pneumatic Cylinders", "Relay Modules", "Filter Units",
  "Servo Motors", "Copper Wiring", "Thermal Paste Tubes", "Rubber Gaskets",
];
const categories = ["Mechanical", "Electrical", "Electronic", "Hydraulic", "Pneumatic"];

// ==================
// Generate Racks
// ==================

/** Build display name for a rack: shed1→S1-R01, shed2→S2-R01, cabin→C1-R01 */
function rackLabel(zone: RackZone, seqNum: number): string {
  const prefix = zone === "shed1" ? "S1" : zone === "shed2" ? "S2" : "C1";
  return `${prefix}-R${String(seqNum).padStart(2, "0")}`;
}

function createLevel(label: string, levelNum: number, maxCap: number): Level {
  const id = `${label}-L${levelNum}`;
  const r = Math.random();
  if (r < 0.2) {
    return { id, level: levelNum, sku: null, productName: null, quantity: 0, weight: 0, maxCapacity: maxCap, status: "empty", containerType: null };
  }
  const weight = Math.round(Math.random() * (maxCap * 0.95) + maxCap * 0.05);
  const status: ShelfStatus = weight > 0 ? "full" : "empty";
  const idx = Math.floor(Math.random() * productNames.length);
  const containerTypes = ["BIN-50", "CCL", null];
  const containerType = containerTypes[Math.floor(Math.random() * containerTypes.length)];
  return {
    id,
    level: levelNum,
    sku: `SKU-${String(1000 + Math.floor(Math.random() * 9000))}`,
    productName: productNames[idx],
    quantity: Math.floor(Math.random() * 80) + 1,
    weight,
    maxCapacity: maxCap,
    status,
    containerType,
  };
}

function createRack(id: number, seqNum: number, type: RackType, zone: RackZone): Rack {
  const isCabin = zone === "cabin";
  const maxCap = isCabin ? 200 : 300;
  const label = rackLabel(zone, seqNum);

  // Generate grid coordinates
  let gridId = "";
  let gridCol = "";
  let gridRow = 1;

  if (zone === "shed1") {
    const cols = ["A", "B", "C", "D"];
    const zeroIndexed = seqNum - 1;
    gridCol = cols[Math.floor(zeroIndexed / 5)];
    gridRow = (zeroIndexed % 5) + 1;
  } else if (zone === "shed2") {
    const cols = ["E", "F", "G", "H"];
    const zeroIndexed = seqNum - 1;
    gridCol = cols[Math.floor(zeroIndexed / 5)];
    gridRow = (zeroIndexed % 5) + 1;
  } else {
    gridCol = "I";
    gridRow = seqNum;
  }
  gridId = `${gridCol}${gridRow}`;

  return {
    id,
    label,
    gridId,
    gridCol,
    gridRow,
    type,
    zone,
    height: 2500,
    length: isCabin ? 900 : 1500,
    depth: 450,
    levels: Array.from({ length: 5 }, (_, i) => createLevel(label, i + 1, maxCap)),
  };
}

export function generateRacks(): Rack[] {
  const racks: Rack[] = [];
  let globalId = 1;
  // Shed 1: 20 racks (S1-R01 to S1-R20)
  for (let i = 1; i <= 9; i++) racks.push(createRack(globalId++, i, "main", "shed1"));
  for (let i = 10; i <= 20; i++) racks.push(createRack(globalId++, i, "addon", "shed1"));
  // Shed 2: 20 racks (S2-R01 to S2-R20)
  for (let i = 1; i <= 20; i++) racks.push(createRack(globalId++, i, "addon", "shed2"));
  // Cabin Room: 5 racks (C1-R01 to C1-R05)
  racks.push(createRack(globalId++, 1, "main", "cabin"));
  for (let i = 2; i <= 5; i++) racks.push(createRack(globalId++, i, "addon", "cabin"));
  return racks;
}

// ==================
// Generate SKUs
// ==================

export function generateSKUs(): SKU[] {
  return productNames.map((name, i) => ({
    id: `SKU-${1001 + i}`,
    name,
    category: categories[i % categories.length],
    weight: Math.round(Math.random() * 20 + 1),
    dimensions: `${Math.round(Math.random() * 50 + 10)}x${Math.round(Math.random() * 50 + 10)}x${Math.round(Math.random() * 30 + 5)} mm`,
    rackAssignment: i < 15 ? `S1-R${String(i + 1).padStart(2, "0")}-L${(i % 5) + 1}` : null,
    currentStock: Math.floor(Math.random() * 200) + 10,
    reorderThreshold: Math.floor(Math.random() * 30) + 5,
    description: `High-quality ${name.toLowerCase()} for industrial applications.`,
  }));
}

// ==================
// Generate Invoices
// ==================

export function generateInvoices(skuList: SKU[]): Invoice[] {
  return Array.from({ length: 20 }, (_, i) => {
    const sku = skuList[i % skuList.length];
    const storageDuration = Math.floor(Math.random() * 30) + 1;
    const weightCharges = Math.round(Math.random() * 500 + 50);
    const rackCharges = Math.round(storageDuration * 15);
    return {
      id: `INV-${2026001 + i}`,
      orderId: `ORD-${5001 + i}`,
      sku: sku.id,
      productName: sku.name,
      storageDuration,
      weightCharges,
      rackCharges,
      totalAmount: weightCharges + rackCharges,
      status: Math.random() > 0.4 ? "paid" as const : "pending" as const,
      date: `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      rackHistory: `S${Math.random() > 0.5 ? "1" : "2"}-R${String(Math.floor(Math.random() * 20) + 1).padStart(2, "0")}-L${Math.floor(Math.random() * 5) + 1}`,
    };
  });
}

// ==================
// Generate Logs
// ==================

const users = ["Admin", "Operator-1", "Operator-2", "Manager", "System"];
const logActions = [
  "Scanned QR Code", "Placed on Rack", "Removed from Rack", "Generated Invoice",
  "Updated SKU Details", "Started Conveyor", "Stopped Conveyor", "Emergency Stop Activated",
  "User Login", "Config Changed", "Backup Completed", "Rack Capacity Warning",
];

export function generateLogs(): LogEntry[] {
  return Array.from({ length: 60 }, (_, i) => ({
    id: `LOG-${10001 + i}`,
    timestamp: new Date(Date.now() - i * 1000 * 60 * Math.floor(Math.random() * 30 + 1)).toISOString(),
    user: users[Math.floor(Math.random() * users.length)],
    action: logActions[Math.floor(Math.random() * logActions.length)],
    item: `SKU-${1001 + Math.floor(Math.random() * 20)}`,
    details: `Operation completed on Rack S${Math.random() > 0.5 ? "1" : "2"}-R${String(Math.floor(Math.random() * 20) + 1).padStart(2, "0")}`,
    status: (["success", "warning", "error", "info"] as const)[Math.floor(Math.random() * 4)],
  }));
}

// ==================
// Chart Data
// ==================

export const rackUtilizationData = [
  { name: "Shed 1", utilized: 72, available: 28 },
  { name: "Shed 2", utilized: 65, available: 35 },
  { name: "Cabin", utilized: 58, available: 42 },
];

export const inboundOutboundData = [
  { day: "Mon", inbound: 45, outbound: 32 },
  { day: "Tue", inbound: 52, outbound: 41 },
  { day: "Wed", inbound: 38, outbound: 55 },
  { day: "Thu", inbound: 67, outbound: 48 },
  { day: "Fri", inbound: 43, outbound: 62 },
  { day: "Sat", inbound: 28, outbound: 18 },
  { day: "Sun", inbound: 12, outbound: 8 },
];

export const dailyActivityData = [
  { time: "06:00", scans: 12, placements: 8, dispatches: 3 },
  { time: "08:00", scans: 45, placements: 32, dispatches: 18 },
  { time: "10:00", scans: 67, placements: 48, dispatches: 35 },
  { time: "12:00", scans: 34, placements: 22, dispatches: 15 },
  { time: "14:00", scans: 78, placements: 55, dispatches: 42 },
  { time: "16:00", scans: 56, placements: 41, dispatches: 38 },
  { time: "18:00", scans: 23, placements: 15, dispatches: 12 },
  { time: "20:00", scans: 8, placements: 4, dispatches: 2 },
];

export const billingAnalytics = [
  { month: "Oct", revenue: 24500, invoices: 42 },
  { month: "Nov", revenue: 28700, invoices: 51 },
  { month: "Dec", revenue: 31200, invoices: 48 },
  { month: "Jan", revenue: 27800, invoices: 45 },
  { month: "Feb", revenue: 35400, invoices: 58 },
  { month: "Mar", revenue: 32100, invoices: 53 },
];

export const inventoryTrendsData = [
  { week: "W1", totalUnits: 4200, inbound: 320, outbound: 280 },
  { week: "W2", totalUnits: 4240, inbound: 350, outbound: 310 },
  { week: "W3", totalUnits: 4280, inbound: 290, outbound: 250 },
  { week: "W4", totalUnits: 4320, inbound: 380, outbound: 340 },
  { week: "W5", totalUnits: 4360, inbound: 310, outbound: 270 },
  { week: "W6", totalUnits: 4400, inbound: 340, outbound: 300 },
];

export const activityFeed = [
  { id: 1, type: "scan" as const, message: "QR Scanned: SKU-1005 at Gate A", time: "2 min ago" },
  { id: 2, type: "placement" as const, message: "SKU-1012 placed on S1-R07-L3", time: "5 min ago" },
  { id: 3, type: "dispatch" as const, message: "ORD-5023 dispatched from S1-R14-L2", time: "8 min ago" },
  { id: 4, type: "scan" as const, message: "QR Scanned: SKU-1001 at Gate B", time: "12 min ago" },
  { id: 5, type: "placement" as const, message: "SKU-1008 placed on S1-R03-L5", time: "15 min ago" },
  { id: 6, type: "dispatch" as const, message: "ORD-5024 dispatched from S1-R09-L1", time: "18 min ago" },
  { id: 7, type: "scan" as const, message: "QR Scanned: SKU-1015 at Gate A", time: "22 min ago" },
  { id: 8, type: "placement" as const, message: "SKU-1003 placed on S2-R11-L4", time: "25 min ago" },
];

// ==================
// Helper Functions
// ==================

export function getRackStats(racks: Rack[]) {
  const totalPositions = racks.reduce((a, r) => a + r.levels.length, 0);
  const occupied = racks.reduce((a, r) => a + r.levels.filter(l => l.status !== "empty").length, 0);
  const available = totalPositions - occupied;
  return { totalPositions, occupied, available };
}

export function getZoneLabel(zone: RackZone): string {
  switch (zone) {
    case "shed1": return "Shed 1";
    case "shed2": return "Shed 2";
    case "cabin": return "Cabin Room";
  }
}
