import { useState, useMemo } from "react";
import { GlassCard } from "../components/GlassCard";
import { ScanLine, Check, X, Package, MapPin, Truck, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useWarehouse } from "../context/WarehouseContext";
import { toast } from "sonner";
import { blockNonNumeric } from "../utils/inputHelpers";
import { InventoryHistoryTable } from "../components/InventoryHistoryTable";

const API_SERVER = 'http://localhost:3001';

export function OutboundInventory() {
  const { state, dispatch, addLog, addNotification, user } = useWarehouse();
  const [scanValue, setScanValue] = useState("");
  const [scannedItem, setScannedItem] = useState<{ rackId: number; levelNum: number; sku: string; productName: string; quantity: number; rackLabel: string } | null>(null);
  const [availableLocations, setAvailableLocations] = useState<any[]>([]);
  const [removeQty, setRemoveQty] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [historyKey, setHistoryKey] = useState(0); // Forces history table to re-fetch
  const [selectedRackName, setSelectedRackName] = useState("");

  // Find all occupied levels
  const occupiedLevels = useMemo(() => {
    return state.racks.flatMap(r =>
      r.levels.filter(l => l.sku && l.quantity > 0).map(l => ({
        rackId: r.id,
        rackLabel: r.label,
        levelNum: l.level,
        sku: l.sku!,
        productName: l.productName!,
        quantity: l.quantity,
        weight: l.weight,
      }))
    );
  }, [state.racks]);

  const currentStep = (!scannedItem && availableLocations.length === 0) ? 0
    : (!scannedItem && availableLocations.length > 0) ? 1
      : !confirmed ? 2 : 3;
  const steps = ["Scan Product", "Select Location", "Confirm Removal", "Complete"];

  function handleScan() {
    const val = scanValue.trim().toUpperCase();
    if (!val) return;
    // Try to find product on a rack
    console.log("Occupied Levels:", occupiedLevels);
    console.log("Scan Value:", val);
    const found = occupiedLevels.filter(l =>
      l.sku.toUpperCase() === val ||
      l.productName.toUpperCase().includes(val) ||
      l.rackLabel.toUpperCase() === val
    );

    if (found.length > 0) {
      if (found.length === 1) {
        // Auto-select if only one location exists
        setScannedItem(found[0]);
        setAvailableLocations([]);
        setRemoveQty(Math.min(found[0].quantity, 1));
        setSelectedRackName(found[0].rackLabel);
        toast.success(`Found: ${found[0].productName} at ${found[0].rackLabel}-L${found[0].levelNum}`);
        addLog("Operator-1", "Scanned for Dispatch", found[0].sku, `Located at ${found[0].rackLabel}-L${found[0].levelNum}`, "success");
      } else {
        // Show selection UI for multiple locations
        setAvailableLocations(found);
        setScannedItem(null);
        toast.info(`Found ${found.length} locations for ${found[0].productName}. Please select one.`);
        addLog("Operator-1", "Scanned for Dispatch", found[0].sku, `Multiple locations found`, "info");
      }
    } else {
      toast.error("No active inventory locations found for this SKU");
    }
    setConfirmed(false);
  }

  async function handleConfirm() {
    if (!scannedItem) return;

    const rackLocationStr = `${scannedItem.rackLabel}-L${scannedItem.levelNum}`;

    // Create OUTWARD transaction record in the database
    try {
      const res = await fetch(`${API_SERVER}/inventory/outward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user?.role || 'ADMIN'
        },
        body: JSON.stringify({
          skuCode: scannedItem.sku,
          quantity: removeQty,
          rackLocation: rackLocationStr
        })
      });
      const json = await res.json();

      if (!json.success) {
        toast.error(json.message || 'Failed to record outbound transaction');
        return;
      }
    } catch (err) {
      console.error('[OutboundInventory] API error:', err);
      toast.error('Network error recording outbound transaction');
      return;
    }

    // Update local state
    dispatch({
      type: "REMOVE_ITEM",
      payload: { rackId: scannedItem.rackId, levelNum: scannedItem.levelNum, quantity: removeQty },
    });
    setConfirmed(true);
    toast.success("Dispatch confirmed!");
    addLog("Operator-1", "Removed from Rack", scannedItem.sku, `Removed ${removeQty} units from ${rackLocationStr}`, "success");
    addNotification(`${scannedItem.sku} dispatched from ${rackLocationStr}`, "success");

    // Auto-generate an invoice
    dispatch({
      type: "ADD_INVOICE",
      payload: {
        id: `INV-${Date.now()}`,
        orderId: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        sku: scannedItem.sku,
        productName: scannedItem.productName,
        storageDuration: Math.floor(Math.random() * 30) + 1,
        weightCharges: Math.round(removeQty * 25),
        rackCharges: Math.round(Math.random() * 200 + 50),
        totalAmount: Math.round(removeQty * 25 + Math.random() * 200 + 50),
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        rackHistory: rackLocationStr,
      },
    });

    // Trigger history table refresh
    setHistoryKey(prev => prev + 1);
  }

  function handleReset() {
    setScanValue("");
    setScannedItem(null);
    setAvailableLocations([]);
    setRemoveQty(1);
    setSelectedRackName("");
    setConfirmed(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground">Outbound Inventory</h1>
        <p className="text-[0.8125rem] text-muted-foreground">Product dispatch and removal workflow</p>
      </div>

      {/* Workflow Steps */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((step, i) => {
          const active = i === currentStep;
          const done = i < currentStep;
          return (
            <div key={step} className="contents">
              {i > 0 && <ArrowRight size={14} className="text-muted-foreground/40 flex-shrink-0" />}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[0.8125rem] flex-shrink-0 ${active ? "bg-yellow/15 text-yellow border border-yellow/30" : done ? "bg-green/10 text-green border border-green/30" : "bg-white/[0.03] text-muted-foreground border border-white/[0.06]"}`}>
                {done && <Check size={14} />}
                <span>{step}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ScanLine size={20} className="text-yellow" />
            <h3 className="text-foreground">Scan Product for Dispatch</h3>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Scan barcode or enter SKU (e.g., BC-20260328-ABC12 or SKU-1001)..."
              value={scanValue}
              onChange={e => setScanValue(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleScan()}
              className="flex-1 bg-secondary border border-white/[0.06] rounded-lg px-4 py-3 text-[0.8125rem] text-foreground placeholder:text-muted-foreground/50 focus:border-yellow/50 focus:ring-1 focus:ring-yellow/30"
            />
            <button onClick={handleScan} className="px-6 py-3 bg-yellow text-black rounded-lg hover:bg-yellow/80 transition-colors text-[0.8125rem] cursor-pointer">
              Submit
            </button>
          </div>
        </GlassCard>

        {/* Dispatch Details */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck size={20} className="text-cyan" />
            <h3 className="text-foreground">Dispatch Details</h3>
          </div>
          {scannedItem ? (
            <div className="space-y-2.5 text-[0.8125rem]">
              {[
                { k: "SKU", v: scannedItem.sku, icon: <Package size={14} className="text-blue" /> },
                { k: "Product", v: scannedItem.productName },
                { k: "Location", v: `${scannedItem.rackLabel}, Level ${scannedItem.levelNum}`, icon: <MapPin size={14} className="text-green" /> },
                { k: "Available Qty", v: `${scannedItem.quantity} units` },
              ].map(item => (
                <div key={item.k} className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {item.icon}
                    <span>{item.k}</span>
                  </div>
                  <span className="text-foreground">{item.v}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/40">
              <ScanLine size={40} className="mb-2" />
              <p className="text-[0.8125rem]">Scan a product to view dispatch details</p>
            </div>
          )}
        </GlassCard>

        {/* Location Selection Options */}
        {availableLocations.length > 0 && !scannedItem && (
          <GlassCard className="p-6 col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-yellow" />
              <h3 className="text-foreground">Available Locations for {availableLocations[0].sku}</h3>
              <span className="ml-auto text-[0.75rem] bg-yellow/10 text-yellow px-2 py-1 rounded">FIFO Recommended First</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableLocations.map((loc, idx) => (
                <div key={`${loc.rackLabel}-${loc.levelNum}`} className={`p-4 rounded-xl border transition-colors ${idx === 0 ? "bg-yellow/5 border-yellow/30" : "bg-secondary border-white/[0.06] hover:bg-white/[0.02]"}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-foreground font-medium">{loc.rackLabel} / Level {loc.levelNum}</h4>
                      <p className="text-[0.75rem] text-muted-foreground mt-0.5">Available: {loc.quantity} units</p>
                    </div>
                    {idx === 0 && <span className="text-[0.7rem] bg-green/10 text-green px-1.5 py-0.5 rounded">Recommended</span>}
                  </div>
                  <button
                    onClick={() => {
                      setScannedItem(loc);
                      setRemoveQty(Math.min(loc.quantity, 1));
                      setSelectedRackName(loc.rackLabel);
                      toast.success(`Selected: ${loc.productName} at ${loc.rackLabel}-L${loc.levelNum}`);
                    }}
                    className="w-full py-2 bg-white/[0.04] hover:bg-yellow hover:text-black border border-white/[0.06] hover:border-yellow rounded-lg text-[0.8125rem] transition-colors cursor-pointer"
                  >
                    Select Location
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>

      {scannedItem && !confirmed && (
        <GlassCard className="p-6">
          <h3 className="text-foreground mb-4">Confirm Removal</h3>
          <div className="flex items-end gap-4 mb-4">
            <div className="flex-1">
              <label className="text-[0.75rem] text-muted-foreground block mb-1">Quantity to Remove</label>
              <input
                type="number"
                min={1}
                max={scannedItem.quantity}
                value={removeQty}
                onChange={e => setRemoveQty(Math.min(scannedItem.quantity, Math.max(1, Number(e.target.value))))}
                onKeyDown={blockNonNumeric}
                className="w-full bg-secondary border border-white/[0.06] rounded-lg px-4 py-3 text-[0.8125rem] text-foreground"
              />
            </div>
            <p className="text-[0.8125rem] text-muted-foreground pb-3">
              of <span className="text-foreground">{scannedItem.quantity}</span> available
            </p>
          </div>
          <p className="text-[0.8125rem] text-muted-foreground mb-4">
            Removing <span className="text-foreground">{removeQty} units</span> of <span className="text-foreground">{scannedItem.productName}</span> from <span className="text-foreground">{scannedItem.rackLabel}-L{scannedItem.levelNum}</span>.
          </p>
          <div className="flex gap-3">
            <button onClick={handleConfirm} className="flex-1 py-3 bg-green text-white rounded-lg hover:bg-green/80 transition-colors text-[0.8125rem] flex items-center justify-center gap-2 cursor-pointer">
              <Check size={16} /> Confirm Removal
            </button>
            <button onClick={handleReset} className="flex-1 py-3 bg-white/[0.04] border border-white/[0.06] rounded-lg text-muted-foreground hover:text-foreground text-[0.8125rem] flex items-center justify-center gap-2 cursor-pointer">
              <X size={16} /> Cancel
            </button>
          </div>
        </GlassCard>
      )}

      {confirmed && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="p-4 rounded-xl bg-green/10 border border-green/30 flex items-center gap-3">
            <div className="p-2 rounded-full bg-green/20"><Check size={20} className="text-green" /></div>
            <div className="flex-1">
              <p className="text-[0.8125rem] text-green">Dispatch confirmed successfully!</p>
              <p className="text-[0.75rem] text-muted-foreground">Rack space updated • Inventory updated • Invoice generated</p>
            </div>
            <button onClick={handleReset} className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[0.8125rem] text-muted-foreground hover:text-foreground">
              New Scan
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Rack Space", detail: "Freed ✓", color: "text-green" },
              { label: "Inventory", detail: "Updated ✓", color: "text-blue" },
              { label: "Billing", detail: "Invoice Created ✓", color: "text-yellow" },
            ].map(u => (
              <GlassCard key={u.label} className="p-4 text-center">
                <p className={`text-[0.8125rem] ${u.color}`}>{u.label}</p>
                <p className="text-[0.75rem] text-muted-foreground">{u.detail}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      )}

      {/* History Section */}
      <InventoryHistoryTable transactionType="OUTBOUND" accentColor="text-yellow" refreshKey={historyKey} externalRackFilter={selectedRackName} />
    </div>
  );
}
