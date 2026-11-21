import { useState, useEffect, useRef } from "react";
import { GlassCard } from "../components/GlassCard";
import { ScanLine, Check, ArrowRight, Package, Server as ServerIcon, Zap, Archive, Printer, Loader2, Radio } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { blockNonNumeric } from "../utils/inputHelpers";
import { useWarehouse } from "../context/WarehouseContext";
import { InventoryHistoryTable } from "../components/InventoryHistoryTable";
import JsBarcode from "jsbarcode";


const API_SERVER = 'http://localhost:3001';

interface SkuData {
  skuCode: string;
  productName: string;
  dimensions: string;
  weight: number;
  category: string;
}

interface Shelf {
  shelfId: string;
  level: number;
  levelLabel: string;
  maxVolume: number;
  usedVolume: number;
  freeVolume: number;
  occupancyPercent: number;
  status: 'empty' | 'full';
}

interface RackData {
  rackId: string;
  rackName: string;
  rackLabel: string;
  shelves: Shelf[];
}

interface AllocationData {
  rackId: string;
  rackName: string;
  shelfLevel: string;
  freeSpace: number;
  usedSpace: number;
  occupancyPercent: number;
}

interface PlacementLabel {
  barcodeId: string;
  skuCode: string;
  productName: string;
  rackName: string;
  level: string;
  rackLocation: string;
}

export function InboundInventory() {
  const { user } = useWarehouse();
  console.log("user>>>", user)
  const [currentStep, setCurrentStep] = useState(1);
  const [scanValue, setScanValue] = useState("");
  const [skuData, setSkuData] = useState<SkuData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [allocationData, setAllocationData] = useState<AllocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inwardResult, setInwardResult] = useState<any>(null);

  // Sequential allocation state
  const [availableRacks, setAvailableRacks] = useState<RackData[]>([]);
  const [selectedShelfIds, setSelectedShelfIds] = useState<string[]>([]);
  const [historyKey, setHistoryKey] = useState(0);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Barcode labels after placement
  const [inwardLabels, setInwardLabels] = useState<PlacementLabel[]>([]);
  const barcodeCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  // Sensor activation status
  const [sensorActivating, setSensorActivating] = useState(false);
  const [activatedRackName, setActivatedRackName] = useState<string>("");

  const steps = ["Scan QR/Barcode", "Review & Assign", "Confirm Placement", "Complete"];

  // Fetch all racks on component mount to track total empty shelf count
  useEffect(() => {
    const fetchAvailableRacks = async () => {
      try {
        const res = await fetch(`${API_SERVER}/racks`, {
          headers: { 'x-user-role': user?.role || 'UNKNOWN' }
        });
        const json = await res.json();
        if (json.success && json.data) {
          setAvailableRacks(json.data);
        }
      } catch (err) {
        console.error('Error fetching racks:', err);
      }
    };
    fetchAvailableRacks();
  }, [user?.role]);

  const handleScan = async () => {
    const val = scanValue.trim();
    if (!val) {
      toast.error('Please enter a valid SKU');
      return;
    }

    setIsLoading(true);
    setSelectedShelfIds([]);
    setQuantity(1);
    try {
      const res = await fetch(`${API_SERVER}/sku/${val}`, {
        headers: {
          'x-user-role': user?.role || 'UNKNOWN'
        }
      });
      console.log('Scan response status:', res);
      const json = await res.json();

      if (json.success) {
        setSkuData(json.data);
        setCurrentStep(2);
        toast.success(`Product identified: ${json.data.productName}`);

        // Log to system logs
        await createSystemLog('ScannedQRCode', val, `Product ${val} scanned (SKU/Barcode) - ${json.data.productName}`);
      } else {
        toast.error(json.message || 'SKU not found');
      }
    } catch (err) {
      toast.error('Network failure connecting to backend API');
    } finally {
      setIsLoading(false);
    }
  };

  const createSystemLog = async (action: string, item: string, details: string) => {
    try {
      console.log('[InboundInventory] Creating log:', { action, item, details });
      const toProperCase = (str: string): string => {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };
      const response = await fetch(`${API_SERVER}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user?.role || 'UNKNOWN'
        },
        body: JSON.stringify({
          user: toProperCase(user?.role),
          action,
          item,
          details,
          status: 'success'
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('[InboundInventory] Log creation failed:', response.status, errorData);
        return;
      }

      const result = await response.json();
      console.log('[InboundInventory] Log created successfully:', result);
    } catch (error) {
      console.error('[InboundInventory] Error creating system log:', error);
    }
  };

  // Computed: total empty shelves in warehouse
  const totalEmptyShelves = availableRacks.reduce((acc, rack) => {
    const emptyInRack = rack.shelves.filter(s => s.status === 'empty').length;
    return acc + emptyInRack;
  }, 0);
  const maxQuantity = totalEmptyShelves;
  const selectedRackName = allocationData?.rackName ?? "";

  // Auto-select first N empty shelves sequentially using preview API
  useEffect(() => {
    if (!skuData || quantity <= 0) {
      setSelectedShelfIds([]);
      setAllocationData(null);
      setPreviewError(null);
      return;
    }

    const fetchPreview = async () => {
      try {
        const res = await fetch(`${API_SERVER}/inventory/preview-allocation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': user?.role || 'UNKNOWN'
          },
          body: JSON.stringify({ skuCode: skuData.skuCode, quantity })
        });
        const json = await res.json();
        if (json.success && json.data) {
          setAllocationData({
            rackId: json.data.rackId,
            rackName: json.data.rackName,
            shelfLevel: json.data.shelfLevel,
            freeSpace: json.data.freeSpace,
            usedSpace: json.data.usedSpace,
            occupancyPercent: json.data.occupancyPercent
          });
          setSelectedShelfIds(json.data.shelfIds || [json.data.shelfId]);
          setPreviewError(null);
        } else {
          setPreviewError(json.message || 'No available shelf space');
          setSelectedShelfIds([]);
          setAllocationData(null);
        }
      } catch (err) {
        setPreviewError('Failed to fetch allocation preview');
        setSelectedShelfIds([]);
        setAllocationData(null);
      }
    };

    fetchPreview();
  }, [skuData, quantity, user?.role]);

  // Render barcodes after labels are set
  useEffect(() => {
    if (inwardLabels.length === 0) return;
    const timer = setTimeout(() => {
      inwardLabels.forEach((label, i) => {
        const canvas = barcodeCanvasRefs.current[i];
        if (canvas) {
          try { JsBarcode(canvas, label.barcodeId, { format: "CODE128", width: 1.5, height: 60, displayValue: true, fontSize: 10, margin: 5 }); } catch (e) { console.error('Barcode error:', e); }
        }
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [inwardLabels]);

  const handleAssignRack = async () => {
    if (selectedShelfIds.length === 0 || !skuData || !allocationData) {
      toast.error('Please verify quantity and allocation');
      return;
    }
    if (skuData?.weight > 300) {
      toast.error('Weight exceeds shelf capacity');
      return;
    }

    setCurrentStep(3);
    toast.success(`${quantity} level(s) assigned: ${allocationData.shelfLevel}`);
    await createSystemLog('PlacedOnRack', skuData.skuCode, `${quantity} unit(s) assigned to ${allocationData.rackName} levels ${allocationData.shelfLevel}`);
  };

  const handleConfirmInward = async () => {
    if (!skuData || selectedShelfIds.length === 0) return;
    setIsLoading(true);

    // Set sensor activation status
    setSensorActivating(true);
    setActivatedRackName(selectedRackName);
    console.log("selectedRackName", selectedRackName);

    try {
      const res = await fetch(`${API_SERVER}/inventory/inward-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': user?.role || 'UNKNOWN' },
        body: JSON.stringify({ skuCode: skuData.skuCode, shelfIds: selectedShelfIds })
      });
      const json = await res.json();
      if (json.success) {
        setInwardResult(json.data);
        setInwardLabels(json.data.labels || []);
        setCurrentStep(4);
        toast.success(`${json.data.totalPlaced} unit(s) placed successfully!`);
        await createSystemLog('StartedConveyor', skuData.skuCode, `${json.data.totalPlaced} unit(s) confirmed`);
        setHistoryKey(prev => prev + 1);

        // Keep sensor status visible for a moment, then clear it
        setTimeout(() => {
          setSensorActivating(false);
        }, 2000);
      } else {
        toast.error(json.message || 'Failed to confirm placement');
        setSensorActivating(false);
      }
    } catch (error) {
      toast.error('Network failure confirming placement');
      // Show warning about sensor operation (non-blocking)
      toast.warning('Sensor activation status unknown - check PLC connection', {
        duration: 5000,
      });
      setSensorActivating(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintLabels = () => {
    if (inwardLabels.length === 0) return;
    const labelsHtml = inwardLabels.map((label, i) => {
      const canvas = barcodeCanvasRefs.current[i];
      const imgSrc = canvas ? canvas.toDataURL("image/png") : "";
      return `<div class="label"><div class="sku">${label.skuCode}</div><div class="name">${label.productName}</div><div class="rack">${label.rackLocation}</div><img src="${imgSrc}" /><div class="bid">${label.barcodeId}</div></div>`;
    }).join('<div class="page-break"></div>');

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;right:-10000px;bottom:-10000px";
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><title>Print Labels</title><style>
      @page{size:auto;margin:5mm}body{font-family:Arial,sans-serif;margin:0;background:#fff;color:#000}
      .label{text-align:center;padding:15px;border:2px dashed #ccc;border-radius:8px;max-width:350px;margin:10px auto;page-break-after:always}
      .sku{font-size:22px;font-weight:bold;margin-bottom:3px}.name{font-size:14px;color:#444;margin-bottom:5px}
      .rack{font-size:16px;font-weight:bold;color:#1a73e8;margin-bottom:10px}
      img{max-width:100%;height:auto}.bid{font-size:9px;color:#888;margin-top:5px}
      .page-break{page-break-after:always}
      @media print{.label{border:none;padding:5px}}
    </style></head><body>${labelsHtml}<script>window.onload=()=>setTimeout(()=>window.print(),200);</script></body></html>`);
    doc.close();
    setTimeout(() => { if (document.body.contains(iframe)) document.body.removeChild(iframe); }, 15000);
    toast.success(`${inwardLabels.length} label(s) sent to printer`);
  };

  const handleReset = () => {
    setScanValue(""); setSkuData(null); setAllocationData(null);
    setQuantity(1); setInwardResult(null); setInwardLabels([]);
    setSelectedShelfIds([]); setCurrentStep(1);
    setSensorActivating(false); setActivatedRackName(""); setPreviewError(null);
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground">Inbound Inventory</h1>
        <p className="text-[0.8125rem] text-muted-foreground">Receive, auto-allocate, and systematically store new inventory directly connected to backend systems.</p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const active = currentStep === stepNumber;
          const done = currentStep > stepNumber;
          return (
            <div key={step} className="contents">
              {index > 0 && <ArrowRight size={14} className="text-muted-foreground/40 shrink-0" />}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[0.8125rem] shrink-0 transition-colors ${active ? "bg-blue/15 text-blue border border-blue/30" :
                done ? "bg-green/10 text-green border border-green/30" :
                  "bg-white/3 text-muted-foreground border border-white/6"
                }`}>
                {done && <Check size={14} />}
                <span>{stepNumber}. {step}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* Scanner - Always Visible */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ScanLine size={20} className="text-blue" />
                <h3 className="text-foreground">Scan Barcode / SKU Code</h3>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Scan barcode or enter SKU code (e.g., SKU-1001 or BC-20260328-ABC12)"
                  value={scanValue}
                  onChange={e => setScanValue(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleScan()}
                  className="flex-1 bg-secondary border border-white/6 rounded-lg px-4 py-3 text-[0.8125rem] text-foreground placeholder:text-muted-foreground/50 focus:border-blue/50 focus:ring-1 focus:ring-blue/30 transition-all outline-none"
                  autoFocus
                />
                <button
                  onClick={handleScan}
                  disabled={isLoading}
                  style={{ cursor: "pointer" }}
                  className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue/80 transition-colors text-[0.8125rem] disabled:opacity-50 font-medium"
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
              <p className="mt-4 text-[0.75rem] text-muted-foreground flex items-center gap-2">
                <ServerIcon size={14} /> Resolves live via API
              </p>
            </GlassCard>
          </motion.div>

          {/* Assign Storage Location - After Scan, Hidden in Success */}
          {skuData && currentStep >= 2 && currentStep < 4 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Archive size={20} className="text-cyan" />
                  <h3 className="text-foreground">Assign Storage Location</h3>
                </div>
                <div className="space-y-4">
                  {/* Quantity Input - enabled, max = total empty shelves */}
                  <div>
                    <label className="text-[0.75rem] text-muted-foreground block mb-2">
                      Quantity to Assign <span className="text-cyan">(1 SKU per shelf level)</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={maxQuantity}
                      value={quantity}
                      onChange={e => setQuantity(Math.min(maxQuantity, Math.max(1, Number(e.target.value))))}
                      onKeyDown={blockNonNumeric}
                      disabled={currentStep > 3 || maxQuantity === 0}
                      className="w-full bg-secondary border border-white/6 rounded-lg px-4 py-3 text-[0.8125rem] text-foreground disabled:opacity-50"
                    />
                    {maxQuantity > 0 ? (
                      <p className="text-[0.7rem] text-muted-foreground mt-2">
                        Total empty shelves in warehouse: <span className="text-foreground font-medium">{maxQuantity}</span>
                      </p>
                    ) : (
                      <p className="text-[0.7rem] text-red mt-2">No empty shelves available in the entire warehouse</p>
                    )}
                  </div>

                  {/* Automatically Allocated Location Preview */}
                  {allocationData && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue/10 border border-blue/20 rounded-lg p-4 space-y-2"
                    >
                      <p className="text-[0.8125rem] text-foreground font-semibold">Sequential Auto-Allocation:</p>
                      <div className="flex justify-between text-[0.75rem]">
                        <span className="text-muted-foreground">Target Rack(s):</span>
                        <span className="text-blue font-semibold">{allocationData.rackName}</span>
                      </div>
                      <div className="flex justify-between text-[0.75rem]">
                        <span className="text-muted-foreground">Shelf Levels:</span>
                        <span className="text-blue font-semibold">{allocationData.shelfLevel}</span>
                      </div>
                    </motion.div>
                  )}

                  {previewError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red/10 border border-red/20 rounded-lg p-4"
                    >
                      <p className="text-[0.75rem] text-red font-medium">{previewError}</p>
                    </motion.div>
                  )}

                  {/* Assign Storage Location Button */}
                  <button
                    onClick={handleAssignRack}
                    disabled={selectedShelfIds.length === 0 || !!previewError || isLoading || currentStep > 3}
                    className="w-full py-3 bg-blue text-white rounded-lg hover:bg-blue/80 transition-colors text-[0.8125rem] disabled:opacity-50 font-medium cursor-pointer"
                  >
                    {isLoading ? "Assigning..." : `Assign ${quantity} Level${quantity > 1 ? 's' : ''}`}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Product Details */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package size={20} className="text-cyan" />
              <h3 className="text-foreground">Product Details</h3>
            </div>
            {skuData ? (
              <div className="space-y-3">
                {[
                  { label: "SKU", value: skuData.skuCode },
                  { label: "Product", value: skuData.productName },
                  { label: "Category", value: skuData.category },
                  { label: "Dimensions", value: skuData.dimensions + " mm" },
                  { label: "Weight/Unit", value: skuData.weight + " kg" },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex justify-between border-b border-white/4 py-2"
                  >
                    <span className="text-[0.8125rem] text-muted-foreground">{item.label}</span>
                    <span className="text-[0.8125rem] text-foreground font-medium">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground/40 text-center">
                <ScanLine size={32} className="mb-3 opacity-50" />
                <p className="text-[0.8125rem]">Awaiting Item Scan...</p>
              </div>
            )}
          </GlassCard>

          {/* Conveyor Routing - Hidden in Success State */}
          {currentStep < 4 && (
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={20} className="text-cyan" />
                <h3 className="text-foreground">Conveyor Routing</h3>
              </div>

              {currentStep < 3 ? (
                <div className="py-8 flex flex-col items-center justify-center text-muted-foreground/50">
                  <p className="text-[0.8125rem]">Assign a rack first to configure routing</p>
                </div>
              ) : allocationData ? (
                <div className="space-y-4">
                  <div className="bg-secondary/50 border border-white/6 rounded-lg p-4">
                    <style>{`
                      @keyframes dotTravel {
                        0% { left: 0%; }
                        50% { left: 100%; }
                        100% { left: 0%; }
                      }
                      .animated-dot {
                        animation: dotTravel 3s infinite ease-in-out;
                      }
                    `}</style>
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="text-center flex-1">
                        <div className="px-3 py-1.5 border border-cyan/50 rounded-lg bg-cyan/10 inline-block">
                          <p className="text-[0.7rem] text-cyan font-semibold">Gate A</p>
                        </div>
                      </div>
                      <div className="flex-1 relative h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="absolute h-full w-1 bg-blue rounded-full animated-dot" />
                      </div>
                      <div className="text-center flex-1">
                        <div className="px-3 py-1.5 border border-blue/50 rounded-lg bg-blue/10 inline-block">
                          <p className="text-[0.7rem] text-blue font-semibold">{allocationData.rackName}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-[0.7rem] text-center text-muted-foreground mt-2">Route: Gate A → {allocationData.rackName} → Levels: {allocationData.shelfLevel}</p>
                  </div>

                  <div className="space-y-2 text-[0.8125rem]">
                    <p className="text-muted-foreground">Placing <span className="text-foreground font-medium">{quantity} unit(s)</span> of <span className="text-foreground font-medium">{skuData?.productName}</span></p>
                    <p className="text-muted-foreground">Levels: <span className="text-cyan font-medium">{allocationData.shelfLevel}</span></p>
                    <p className="text-muted-foreground">Total Weight: <span className="text-foreground font-medium">{(skuData?.weight ?? 0) * quantity} kg</span></p>
                  </div>

                  {/* Sensor Activation Status Indicator */}
                  <AnimatePresence>
                    {sensorActivating && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue/10 border border-blue/30 rounded-lg p-3 overflow-hidden"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="relative">
                            <Radio size={16} className="text-blue" />
                            <motion.div
                              className="absolute inset-0"
                              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Radio size={16} className="text-blue" />
                            </motion.div>
                          </div>
                          <div className="flex-1">
                            <p className="text-[0.75rem] text-blue font-medium">Activating rack sensor</p>
                            <p className="text-[0.7rem] text-muted-foreground">
                              {activatedRackName} indicator light active
                            </p>
                          </div>
                          <Loader2 size={14} className="text-blue animate-spin shrink-0" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={handleConfirmInward}
                    disabled={isLoading}
                    className="w-full py-3 rounded-lg bg-green text-white hover:bg-green/80 transition-colors text-[0.8125rem] disabled:opacity-50 font-medium cursor-pointer"
                  >
                    {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Confirming...</span> : `Confirm ${quantity} Placement${quantity > 1 ? 's' : ''}`}
                  </button>
                </div>
              ) : null}
            </GlassCard>
          )}

          {/* Success State */}
          {currentStep === 4 && inwardResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Success Message Banner */}
              <GlassCard className="p-4 bg-green/5 border-green/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Check size={20} className="text-green shrink-0" />
                    <div className="flex-1">
                      <p className="text-[0.8125rem] text-green font-semibold">{inwardResult.totalPlaced} unit(s) successfully stored!</p>
                      <p className="text-[0.75rem] text-muted-foreground">{skuData?.skuCode} — {inwardResult.totalPlaced} level(s)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrintLabels}
                      className="px-4 py-2 bg-blue/15 border border-blue/30 rounded-lg text-[0.75rem] text-blue hover:bg-blue/25 transition-colors shrink-0 font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer size={14} /> Print {inwardLabels.length} Label{inwardLabels.length > 1 ? 's' : ''}
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-[0.75rem] text-foreground hover:bg-white/20 transition-colors shrink-0 font-medium cursor-pointer"
                    >
                      New Scan
                    </button>
                  </div>
                </div>
              </GlassCard>

              {/* Barcode Labels */}
              {inwardLabels.length > 0 && (
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-foreground text-[0.875rem] font-semibold">Generated Barcode Labels</h3>
                    <span className="text-[0.7rem] text-cyan bg-cyan/10 px-2 py-0.5 rounded-full">{inwardLabels.length} label{inwardLabels.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {inwardLabels.map((label, i) => (
                      <motion.div
                        key={label.barcodeId}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white rounded-lg p-4 flex items-center gap-4"
                      >
                        <canvas ref={el => { barcodeCanvasRefs.current[i] = el; }} style={{ height: 60 }} />
                        <div className="text-left flex-1">
                          <p className="text-[0.8125rem] font-bold text-gray-900">{label.skuCode}</p>
                          <p className="text-[0.7rem] text-gray-600">{label.productName}</p>
                          <p className="text-[0.75rem] font-semibold text-blue-700 mt-1">{label.rackLocation}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Status Tiles */}
              <div className="grid grid-cols-3 gap-3">
                <GlassCard className="p-4 text-center border-green/30 bg-green/5">
                  <p className="text-[0.8125rem] text-green font-semibold">Rack Space</p>
                  <p className="text-[0.75rem] text-green mt-2">Updated ✓</p>
                </GlassCard>
                <GlassCard className="p-4 text-center border-blue/30 bg-blue/5">
                  <p className="text-[0.8125rem] text-blue font-semibold">Inventory</p>
                  <p className="text-[0.75rem] text-blue mt-2">{inwardResult.totalPlaced} Record{inwardResult.totalPlaced > 1 ? 's' : ''} ✓</p>
                </GlassCard>
                <GlassCard className="p-4 text-center border-cyan/30 bg-cyan/5">
                  <p className="text-[0.8125rem] text-cyan font-semibold">Labels</p>
                  <p className="text-[0.75rem] text-cyan mt-2">{inwardLabels.length} Generated ✓</p>
                </GlassCard>
              </div>
            </motion.div>
          )}

        </div>

      </div>

      {/* History Section */}
      <InventoryHistoryTable transactionType="INWARD" accentColor="text-blue" refreshKey={historyKey} externalRackFilter={selectedRackName} />
    </div>
  );
}