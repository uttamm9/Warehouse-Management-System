import React, { useState, useMemo } from "react";
import { GlassCard } from "../components/GlassCard";
import { useWarehouse } from "../context/WarehouseContext";
import { type Rack, type Level, getZoneLabel, getContainerLabel } from "../data/mockData";
import { X, Maximize2, ZoomIn, ZoomOut, Eye, EyeOff, ArrowDown, ArrowRight as ArrowR, ScanLine, Weight, Monitor, ShieldAlert, Box, Layers } from "lucide-react";
import { motion } from "motion/react";


// ==================
// Color helpers — consistent across system
// ==================
function getLevelColor(status: string) {
  if (status === "empty") return "bg-green/70";
  return "bg-red/70";
}
function getRackBorder(rack: Rack) {
  const full = rack.levels.filter(l => l.status === "full").length;
  const empty = rack.levels.filter(l => l.status === "empty").length;
  if (full >= 3) return "border-red/50 bg-red/5";
  if (empty >= 3) return "border-green/50 bg-green/5";
  return "border-yellow/50 bg-yellow/5";
}
function getRackDot(rack: Rack) {
  const full = rack.levels.filter(l => l.status === "full").length;
  const empty = rack.levels.filter(l => l.status === "empty").length;
  if (full >= 3) return "bg-red shadow-[0_0_6px_rgba(239,68,68,0.6)]";
  if (empty >= 3) return "bg-green shadow-[0_0_6px_rgba(16,185,129,0.6)]";
  return "bg-yellow shadow-[0_0_6px_rgba(245,158,11,0.6)]";
}
function getUtilPercent(rack: Rack) {
  const totalWeight = rack.levels.reduce((a, l) => a + l.weight, 0);
  const totalCap = rack.levels.reduce((a, l) => a + l.maxCapacity, 0);
  return totalCap > 0 ? Math.round((totalWeight / totalCap) * 100) : 0;
}

export function WarehouseMap() {
  const { state } = useWarehouse();
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<{ rack: Rack; level: Level } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [activeZone, setActiveZone] = useState<"all" | "shed1" | "shed2" | "cabin">("all");
  const [showFlowOverlay, setShowFlowOverlay] = useState(true);

  const shed1Racks = useMemo(() => state.racks.filter(r => r.zone === "shed1"), [state.racks]);
  const shed2Racks = useMemo(() => state.racks.filter(r => r.zone === "shed2"), [state.racks]);
  const cabinRacks = useMemo(() => state.racks.filter(r => r.zone === "cabin"), [state.racks]);

  // Grid columns for headers
  const shed1Cols = ["A", "B", "C", "D"];
  const shed2Cols = ["E", "F", "G", "H"];

  // Get racks for a specific zone arranged by row
  function getRacksByRow(racks: Rack[]) {
    const rows = new Map<number, Rack[]>();
    racks.forEach(r => {
      const row = r.gridRow ?? 0;
      if (!rows.has(row)) rows.set(row, []);
      rows.get(row)!.push(r);
    });
    // Sort each row by column
    rows.forEach(rowRacks => rowRacks.sort((a, b) => (a.gridCol || "").localeCompare(b.gridCol || "")));
    return Array.from(rows.entries()).sort(([a], [b]) => a - b);
  }

  // Enhanced Rack Card with vertical level stack and grid ID
  function RackCard({ rack }: { rack: Rack }) {
    const isSelected = selectedRack?.id === rack.id;
    const util = getUtilPercent(rack);
    return (
      <button
        onClick={() => { setSelectedRack(rack); setSelectedLevel(null); }}
        className={`relative flex w-full flex-col p-2 rounded-lg border-2 transition-all hover:scale-[1.03] active:scale-[0.98] min-w-[80px] touch-manipulation ${getRackBorder(rack)} ${isSelected ? "ring-2 ring-blue shadow-[0_0_12px_rgba(59,130,246,0.3)]" : ""}`}
      >
        {/* Header: Grid ID + status dot */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[0.6875rem] text-blue">{rack.gridId}</span>
          <span className="text-[0.6875rem] text-blue">{rack.label}</span>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getRackDot(rack)}`} />
        </div>

        {/* Vertical level stack (top = L5, bottom = L1) */}
        <div className="flex flex-col gap-px">
          {[...rack.levels].sort((a, b) => a.level - b.level).map((level) => (
            <div
              key={level.level}
              className={`h-3 rounded-[2px] ${getLevelColor(level.status)} flex items-center justify-center text-[0.4375rem] text-white/80 relative group`}
            >
              <span className="opacity-70">L{level.level}</span>
              {level.containerType && (
                <span className="absolute -right-0.5 -top-0.5 w-1.5 h-1.5 rounded-full bg-cyan/80" />
              )}
            </div>
          ))}
        </div>

        {/* Footer: type + utilization */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-[0.4375rem] text-muted-foreground">{rack.type === "main" ? "Main" : "Add"}</span>
          <span className={`text-[0.4375rem] ${util > 85 ? "text-red" : util > 50 ? "text-yellow" : "text-green"}`}>{util}%</span>
        </div>
      </button>
    );
  }

  // Zone marker component
  function ZoneMarker({ icon: Icon, label, color = "text-muted-foreground", bgColor = "bg-white/[0.03]" }: {
    icon: React.ComponentType<{ size: number; className?: string }>;
    label: string;
    color?: string;
    bgColor?: string;
  }) {
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] ${bgColor}`}>
        <Icon size={12} className={color} />
        <span className={`text-[0.625rem] ${color}`}>{label}</span>
      </div>
    );
  }

  // Flow Arrow
  function FlowArrow({ direction = "right", label }: { direction?: "right" | "down"; label?: string }) {
    return (
      <div className="flex items-center gap-1">
        {label && <span className="text-[0.5rem] text-blue/50">{label}</span>}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-blue/40"
        >
          {direction === "right" ? <ArrowR size={12} /> : <ArrowDown size={12} />}
        </motion.div>
      </div>
    );
  }

  // Grid header row
  function GridColHeaders({ cols }: { cols: string[] }) {
    return (
      <div className="flex gap-2 mb-1 pl-6">
        {cols.map(c => (
          <div key={c} className="flex-1 min-w-[80px] text-center">
            <span className="text-[0.5625rem] text-blue/60 px-1.5 py-0.5 rounded bg-blue/5">{c}</span>
          </div>
        ))}
      </div>
    );
  }

  // Grid layout with row labels
  function RackGridWithRows({ racks, cols }: { racks: Rack[]; cols: string[] }) {
    const rows = getRacksByRow(racks);
    return (
      <div>
        <GridColHeaders cols={cols} />
        <div className="space-y-1.5">
          {rows.map(([rowNum, rowRacks]) => (
            <div key={`row-${rowNum}`} className="flex items-center gap-2 justify-between w-full">
              {/* Row label */}
              <div className="w-4 flex-shrink-0 text-center">
                <span className="text-[0.5625rem] text-blue/60">{rowNum}</span>
              </div>
              {/* Racks in this row */}
              <div
                className={`flex justify-between w-full ${activeZone === "shed1" || activeZone === "shed2" ? "gap-4 mb-4" : "gap-2 mb-2"
                  }`}
              >
                {rowRacks.map(rack => (
                  <div key={rack.id} className="min-w-[80px] w-full">
                    <RackCard rack={rack} />
                  </div>
                ))}
              </div>
              {/* Aisle indicator (between rows) */}
              {/* {rowNum < 5 && (
                <div className="w-4 flex-shrink-0" />
              )} */}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground">Warehouse Layout</h1>
          <p className="text-[0.8125rem] text-muted-foreground">Interactive map — 45 racks across 3 zones (Shed 1 & 2: 40 racks, Cabin: 5)</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Legend */}
          <div className="flex items-center gap-3 text-[0.6875rem]">
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green/70" /> Empty</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red/70" /> Full</div>
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan/80" /> Container</div>
          </div>
          {/* Overlay toggle */}
          <button
            onClick={() => setShowFlowOverlay(!showFlowOverlay)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[0.6875rem] border transition-colors ${showFlowOverlay ? "bg-blue/10 text-blue border-blue/30" : "bg-white/[0.03] text-muted-foreground border-white/[0.06]"}`}
          >
            {showFlowOverlay ? <Eye size={12} /> : <EyeOff size={12} />}
            Flow
          </button>
          {/* Zoom */}
          <div className="flex items-center gap-1 border border-white/[0.06] rounded-lg">
            <button onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} className="p-1.5 hover:bg-white/[0.04] rounded"><ZoomOut size={14} className="text-muted-foreground" /></button>
            <span className="text-[0.625rem] text-muted-foreground px-1 w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-1.5 hover:bg-white/[0.04] rounded"><ZoomIn size={14} className="text-muted-foreground" /></button>
          </div>
        </div>
      </div>

      {/* Zone Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {([
          { key: "all" as const, label: "All Zones", count: 40 },
          { key: "shed1" as const, label: "Shed 1", count: 20 },
          { key: "shed2" as const, label: "Shed 2", count: 20 },
          { key: "cabin" as const, label: "Cabin Room", count: 5 },
        ]).map(z => (
          <button
            key={z.key}
            onClick={() => setActiveZone(z.key)}
            className={`px-3 py-2 rounded-lg text-[0.8125rem] transition-colors touch-manipulation ${activeZone === z.key ? "bg-blue/15 text-blue border border-blue/30" : "bg-white/[0.03] text-muted-foreground border border-white/[0.06] hover:text-foreground shed"}`}
          >
            {z.label} <span className="text-[0.625rem] opacity-60">({z.count})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-[1fr_340px] gap-5">
        {/* ===== MAIN MAP ===== */}
        <GlassCard className="p-5 overflow-auto">
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", transition: "transform 0.2s" }}>
            <div className="min-w-[700px] space-y-4">

              {/* ── ENTRY ZONE ── */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green/10 border border-green/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                  <span className="text-[0.75rem] text-green">Entry Point</span>
                </div>
                {showFlowOverlay && <FlowArrow direction="right" label="IN" />}
                <ZoneMarker icon={ScanLine} label="Scanner Station" color="text-cyan" bgColor="bg-cyan/5" />
                {showFlowOverlay && <FlowArrow direction="right" />}
                <ZoneMarker icon={Weight} label="Weighing Scale" color="text-purple" bgColor="bg-purple/5" />
                {showFlowOverlay && <FlowArrow direction="right" />}
                <div className="flex-1 border-t border-dashed border-blue/20" />
                <div className="px-3 py-2 rounded-lg bg-yellow/10 border border-yellow/30">
                  <span className="text-[0.75rem] text-yellow">Ramp ↑</span>
                </div>
              </div>

              {/* ── CONTROL ROOM BAR ── */}
              <div className="flex items-center gap-3">
                <ZoneMarker icon={Monitor} label="Control Room" color="text-blue" bgColor="bg-blue/5" />
                {showFlowOverlay && (
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 relative h-px bg-blue/15">
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue/40"
                        animate={{ left: ["0%", "100%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <span className="text-[0.5rem] text-blue/40">CONVEYOR ROUTE</span>
                    <div className="flex-1 relative h-px bg-blue/15">
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue/40"
                        animate={{ left: ["0%", "100%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── MAIN STORAGE AREA ── */}
              <div className="flex gap-5">
                {/* SHED 1 */}
                {(activeZone === "all" || activeZone === "shed1") && (
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 rounded-full bg-blue" />
                      <h3 className="text-foreground text-[0.875rem]">Existing Shed — 1</h3>
                      <span className="text-[0.5625rem] text-muted-foreground px-2 py-0.5 rounded bg-white/[0.04]">41 ft × 45 ft</span>
                      <span className="text-[0.5625rem] text-muted-foreground">8 Main + 12 Add-On</span>
                    </div>
                    <div className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
                      <RackGridWithRows racks={shed1Racks} cols={shed1Cols} />
                    </div>
                    {/* Aisle label */}
                    <div className="text-center mt-1">
                      <span className="text-[0.5rem] text-muted-foreground/40 tracking-[0.2em]">— AISLE —</span>
                    </div>
                  </div>
                )}

                {/* Vertical aisle divider + conveyor */}
                {activeZone === "all" && (
                  <div className="flex flex-col items-center w-8 py-4">
                    <div className="flex-1 w-px border-l-2 border-dashed border-blue/20 relative">
                      {showFlowOverlay && (
                        <motion.div
                          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue/50"
                          animate={{ top: ["0%", "95%"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </div>
                    <span className="text-[0.375rem] text-blue/40 rotate-90 whitespace-nowrap my-2">MAIN AISLE</span>
                    <div className="flex-1 w-px border-l-2 border-dashed border-blue/20" />
                  </div>
                )}

                {/* SHED 2 */}
                {(activeZone === "all" || activeZone === "shed2") && (
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 rounded-full bg-cyan" />
                      <h3 className="text-foreground text-[0.875rem]">Existing Shed — 2</h3>
                      <span className="text-[0.5625rem] text-muted-foreground px-2 py-0.5 rounded bg-white/[0.04]">61 ft × 26 ft</span>
                      <span className="text-[0.5625rem] text-muted-foreground">20 Add-On</span>
                    </div>
                    <div className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
                      <RackGridWithRows racks={shed2Racks} cols={shed2Cols} />
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-[0.5rem] text-muted-foreground/40 tracking-[0.2em]">— AISLE —</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── LOWER ZONES ── */}
              <div className="flex gap-5 items-start">
                {/* Cabin Room */}
                {(activeZone === "all" || activeZone === "cabin") && (
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 rounded-full bg-purple" />
                      <h3 className="text-foreground text-[0.875rem]">Cabin Room</h3>
                      <span className="text-[0.5625rem] text-muted-foreground px-2 py-0.5 rounded bg-white/[0.04]">200 kg/level</span>
                    </div>
                    <div className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01]">
                      <GridColHeaders cols={["I"]} />
                      <div className="space-y-1.5">
                        {cabinRacks.map(rack => (
                          <div key={rack.id} className="flex items-center gap-2">
                            <div className="w-4 flex-shrink-0 text-center">
                              <span className="text-[0.5625rem] text-blue/60">{rack.gridRow}</span>
                            </div>
                            <div className="w-[90px] w-full">
                              <RackCard rack={rack} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Auxiliary Zones */}
                {activeZone === "all" && (
                  <div className="flex flex-wrap gap-2 flex-1 items-start">
                    <div className="px-3 py-3 rounded-lg bg-red/[0.03] border border-red/10 text-center min-w-[100px]">
                      <ShieldAlert size={14} className="mx-auto text-red/60 mb-1" />
                      <p className="text-[0.6875rem] text-red/70">DGR Area</p>
                      <p className="text-[0.5rem] text-muted-foreground">Dangerous Goods</p>
                    </div>
                    <div className="px-3 py-3 rounded-lg bg-yellow/[0.03] border border-yellow/10 text-center min-w-[100px]">
                      <Layers size={14} className="mx-auto text-yellow/60 mb-1" />
                      <p className="text-[0.6875rem] text-yellow/70">Strong Room 1</p>
                      <p className="text-[0.5rem] text-muted-foreground">Secured Storage</p>
                    </div>
                    <div className="px-3 py-3 rounded-lg bg-yellow/[0.03] border border-yellow/10 text-center min-w-[100px]">
                      <Layers size={14} className="mx-auto text-yellow/60 mb-1" />
                      <p className="text-[0.6875rem] text-yellow/70">Strong Room 2</p>
                      <p className="text-[0.5rem] text-muted-foreground">Secured Storage</p>
                    </div>
                    <div className="px-3 py-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-center min-w-[100px]">
                      <Box size={14} className="mx-auto text-muted-foreground/60 mb-1" />
                      <p className="text-[0.6875rem] text-muted-foreground">Store Room</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── EXIT FLOW ── */}
              {showFlowOverlay && (activeZone === "all") && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 border-t border-dashed border-green/20" />
                  <FlowArrow direction="right" label="EXIT" />
                  <div className="px-3 py-2 rounded-lg bg-green/10 border border-green/30">
                    <span className="text-[0.75rem] text-green">Exit Point</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* ===== DETAIL PANEL ===== */}
        <div className="space-y-4">
          {selectedRack ? (
            <GlassCard className="p-5 sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-foreground">Rack {selectedRack.gridId}</h3>
                    <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-blue/10 text-blue">{selectedRack.label}</span>
                  </div>
                  <p className="text-[0.6875rem] text-muted-foreground mt-0.5">{getZoneLabel(selectedRack.zone)} • Col {selectedRack.gridCol} Row {selectedRack.gridRow}</p>
                </div>
                <button onClick={() => { setSelectedRack(null); setSelectedLevel(null); }} className="text-muted-foreground hover:text-foreground p-1">
                  <X size={18} />
                </button>
              </div>

              {/* Rack metadata */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4 text-[0.75rem]">
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="text-foreground">{selectedRack.type === "main" ? "Main (A)" : "Add-On (B)"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Grid</span><span className="text-blue">{selectedRack.gridId}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Height</span><span className="text-foreground">{selectedRack.height} mm</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">L × D</span><span className="text-foreground">{selectedRack.length}×{selectedRack.depth}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Capacity</span><span className="text-foreground">{selectedRack.levels[0]?.maxCapacity} kg/level</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Load</span><span className="text-foreground">{selectedRack.levels.reduce((a, l) => a + l.weight, 0)} kg</span></div>
              </div>

              {/* Utilization bar */}
              <div className="mb-4">
                <div className="flex justify-between text-[0.6875rem] mb-1">
                  <span className="text-muted-foreground">Overall Utilization</span>
                  <span className={`${getUtilPercent(selectedRack) > 85 ? "text-red" : getUtilPercent(selectedRack) > 50 ? "text-yellow" : "text-green"}`}>{getUtilPercent(selectedRack)}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getUtilPercent(selectedRack) > 85 ? "bg-red" : getUtilPercent(selectedRack) > 50 ? "bg-yellow" : "bg-green"}`}
                    style={{ width: `${getUtilPercent(selectedRack)}%` }}
                  />
                </div>
              </div>

              {/* Vertical level display (visual rack representation) */}
              <div className="mb-3">
                <p className="text-[0.6875rem] text-muted-foreground mb-2">Level Structure (top → bottom)</p>
                <div className="flex flex-col gap-1">
                  {[...selectedRack.levels].reverse().map((level) => {
                    const isLevelSelected = selectedLevel?.level.id === level.id;
                    return (
                      <button
                        key={level.level}
                        onClick={() => setSelectedLevel({ rack: selectedRack, level })}
                        className={`w-full p-2.5 rounded-lg border transition-all touch-manipulation ${isLevelSelected ? "ring-1 ring-blue border-blue/40 bg-blue/5" :
                          level.status === "empty" ? "border-green/20 bg-green/5 hover:bg-green/10" :
                            "border-red/20 bg-red/5 hover:bg-red/10"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[0.75rem] text-foreground w-6">L{level.level}</span>
                          <div className={`flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden`}>
                            <div
                              className={`h-full rounded-full transition-all ${level.status === "full" ? "bg-red" : "bg-green/30"}`}
                              style={{ width: `${level.maxCapacity > 0 ? (level.weight / level.maxCapacity) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-[0.625rem] text-muted-foreground w-16 text-right">{level.weight}/{level.maxCapacity} kg</span>
                          <span className={`text-[0.5625rem] px-1.5 py-0.5 rounded ${level.status === "empty" ? "bg-green/15 text-green" : "bg-red/15 text-red"}`}>
                            {level.status}
                          </span>
                          {level.containerType && (
                            <span className="text-[0.5625rem] px-1 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/20">{level.containerType}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Maximize2 size={32} className="text-muted-foreground/30 mb-3" />
              <p className="text-[0.8125rem] text-muted-foreground">Select a rack to view details</p>
              <p className="text-[0.6875rem] text-muted-foreground/50 mt-1">Click any rack card on the layout</p>
            </GlassCard>
          )}

          {/* Level Detail Panel (appears below rack detail) */}
          {selectedLevel && (
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-foreground text-[0.875rem]">{selectedLevel.rack.gridId} — Level {selectedLevel.level.level}</h4>
                <button onClick={() => setSelectedLevel(null)} className="text-muted-foreground hover:text-foreground p-1"><X size={16} /></button>
              </div>
              {selectedLevel.level.sku ? (
                <div className="space-y-2 text-[0.8125rem]">
                  <div className="flex justify-between border-b border-white/[0.04] pb-1.5"><span className="text-muted-foreground">SKU</span><span className="text-blue">{selectedLevel.level.sku}</span></div>
                  <div className="flex justify-between border-b border-white/[0.04] pb-1.5"><span className="text-muted-foreground">Product</span><span className="text-foreground">{selectedLevel.level.productName}</span></div>
                  <div className="flex justify-between border-b border-white/[0.04] pb-1.5"><span className="text-muted-foreground">Quantity</span><span className="text-foreground">{selectedLevel.level.quantity} units</span></div>
                  <div className="flex justify-between border-b border-white/[0.04] pb-1.5"><span className="text-muted-foreground">Load</span><span className="text-foreground">{selectedLevel.level.weight} / {selectedLevel.level.maxCapacity} kg</span></div>
                  {selectedLevel.level.containerType && (
                    <div className="flex justify-between border-b border-white/[0.04] pb-1.5"><span className="text-muted-foreground">Container</span><span className="text-cyan">{getContainerLabel(selectedLevel.level.containerType)}</span></div>
                  )}
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden mt-1">
                    <div className={`h-full rounded-full ${selectedLevel.level.weight / selectedLevel.level.maxCapacity > 0.85 ? "bg-red" : "bg-blue"}`} style={{ width: `${(selectedLevel.level.weight / selectedLevel.level.maxCapacity) * 100}%` }} />
                  </div>
                </div>
              ) : (
                <div className="text-[0.8125rem] text-muted-foreground py-4 text-center">
                  Empty — {selectedLevel.level.maxCapacity} kg available
                </div>
              )}
            </GlassCard>
          )}

          {/* Real-Time Status Mini Panel */}
          <GlassCard className="p-4">
            <h4 className="text-foreground text-[0.8125rem] mb-3">Real-Time Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[0.75rem]">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green animate-pulse" /><span className="text-muted-foreground">Scanner</span></div>
                <span className="text-green">Active</span>
              </div>
              <div className="flex items-center justify-between text-[0.75rem]">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green animate-pulse" /><span className="text-muted-foreground">Conveyor</span></div>
                <span className="text-green">Running</span>
              </div>
              <div className="flex items-center justify-between text-[0.75rem]">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green animate-pulse" /><span className="text-muted-foreground">PLC</span></div>
                <span className="text-green">Connected</span>
              </div>
              <div className="flex items-center justify-between text-[0.75rem]">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue" /><span className="text-muted-foreground">Occupancy</span></div>
                <span className="text-foreground">{state.racks.reduce((a, r) => a + r.levels.filter(l => l.status !== "empty").length, 0)} / {state.racks.length * 4}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}