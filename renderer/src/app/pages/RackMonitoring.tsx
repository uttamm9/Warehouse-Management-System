import { useState, useMemo } from "react";
import { Filter, X, Search } from "lucide-react";
import { motion } from "motion/react";
import { useWarehouse } from "../context/WarehouseContext";
import { type Rack, type Level, getZoneLabel, getContainerLabel } from "../data/mockData";
import { GlassCard } from "../components/GlassCard";

function getLevelBg(status: string) {
  if (status === "empty") return "bg-green/15 border-green/30";
  return "bg-red/15 border-red/30";
}

function getLevelDot(status: string) {
  if (status === "empty") return "bg-green";
  return "bg-red";
}

function getUtilPercent(rack: Rack) {
  const totalWeight = rack.levels.reduce((a, l) => a + l.weight, 0);
  const totalCap = rack.levels.reduce((a, l) => a + l.maxCapacity, 0);
  return totalCap > 0 ? Math.round((totalWeight / totalCap) * 100) : 0;
}

export function RackMonitoring() {
  /* Warehouse context for rack data */
  const { state } = useWarehouse();
  const [zoneFilter, setZoneFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gridSearch, setGridSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<{ rack: Rack; level: Level; } | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return state.racks.filter(r => {
      if (zoneFilter !== "all" && r.zone !== zoneFilter) return false;
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (statusFilter !== "all") {
        return r.levels.some(l => l.status === statusFilter);
      }
      if (gridSearch) {
        const q = gridSearch.toUpperCase();
        return r.gridId.includes(q) || r.label.toUpperCase().includes(q);
      }
      return true;
    });
  }, [state.racks, zoneFilter, typeFilter, statusFilter, gridSearch]);

  const totalPositions = state.racks.reduce((a, r) => a + r.levels.length, 0);
  const occupiedPositions = state.racks.reduce((a, r) => a + r.levels.filter(l => l.status !== "empty").length, 0);
  const fullPositions = state.racks.reduce((a, r) => a + r.levels.filter(l => l.status === "full").length, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground">Rack Monitoring</h1>
          <p className="text-[0.8125rem] text-muted-foreground">
            {state.racks.length} racks • {totalPositions} positions • {occupiedPositions} occupied • {fullPositions} full
          </p>
        </div>
        {/* View mode toggle */}
        <div className="flex items-center gap-1 border border-white/[0.06] rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded text-[0.75rem] transition-colors ${viewMode === "grid" ? "bg-blue/15 text-blue" : "text-muted-foreground hover:text-foreground"}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded text-[0.75rem] transition-colors ${viewMode === "list" ? "bg-blue/15 text-blue" : "text-muted-foreground hover:text-foreground"}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Empty", count: totalPositions - occupiedPositions, color: "text-green", bg: "bg-green/10 border-green/20", filter: "empty" },
          { label: "Full", count: fullPositions, color: "text-red", bg: "bg-red/10 border-red/20", filter: "full" },
          { label: "Total", count: totalPositions, color: "text-blue", bg: "bg-blue/10 border-blue/20", filter: "all" },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(statusFilter === s.filter ? "all" : s.filter)}
            className={`p-3 rounded-lg border transition-colors text-center touch-manipulation ${statusFilter === s.filter ? s.bg : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"}`}
          >
            <p className={`text-[1.125rem] ${s.color}`}>{s.count}</p>
            <p className="text-[0.6875rem] text-muted-foreground">{s.label} Levels</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap items-center gap-3">
        <Filter size={16} className="text-muted-foreground flex-shrink-0" />
        {/* Grid Search */}
        <div className="flex items-center gap-1.5 bg-secondary/50 rounded-lg px-2.5 py-1.5 border border-white/[0.06]">
          <Search size={13} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Grid ID (e.g. A1)..."
            value={gridSearch}
            onChange={e => setGridSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-[0.8125rem] text-foreground placeholder:text-muted-foreground/50 w-28"
          />
        </div>
        <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)} className="bg-secondary text-foreground text-[0.8125rem] rounded-lg px-3 py-2 border border-white/[0.06] touch-manipulation">
          <option value="all">All Zones</option>
          <option value="shed1">Shed 1 (A-D)</option>
          <option value="shed2">Shed 2 (E-H)</option>
          <option value="cabin">Cabin (I)</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-secondary text-foreground text-[0.8125rem] rounded-lg px-3 py-2 border border-white/[0.06] touch-manipulation">
          <option value="all">All Types</option>
          <option value="main">Main (A)</option>
          <option value="addon">Add-On (B)</option>
        </select>
        <span className="ml-auto text-[0.75rem] text-muted-foreground">{filtered.length} racks</span>
      </GlassCard>

      {/* Rack Grid / List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filtered.map((rack) => (
            <motion.div
              key={rack.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className="p-4">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.9375rem] text-blue">{rack?.gridId}</span>
                    <span className="text-[0.6875rem] text-muted-foreground">({rack?.label})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[0.5625rem] px-1.5 py-0.5 rounded bg-white/[0.06] text-muted-foreground">
                      {rack?.type === "main" ? "Main" : "Add-On"}
                    </span>
                    <span className="text-[0.5625rem] px-1.5 py-0.5 rounded bg-white/[0.06] text-muted-foreground">
                      {getZoneLabel(rack?.zone)}
                    </span>
                  </div>
                </div>

                {/* Utilization micro-bar */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getUtilPercent(rack) > 85 ? "bg-red" : getUtilPercent(rack) > 50 ? "bg-yellow" : "bg-green"}`}
                      style={{ width: `${getUtilPercent(rack)}%` }}
                    />
                  </div>
                  <span className={`text-[0.625rem] ${getUtilPercent(rack) > 85 ? "text-red" : getUtilPercent(rack) > 50 ? "text-yellow" : "text-green"}`}>{getUtilPercent(rack)}%</span>
                </div>

                {/* Level buttons */}
                <div className="space-y-1.5">
                  {[...rack.levels].sort((a, b) => a.level - b.level).map((level) => (
                    <button
                      key={level.level}
                      onClick={() => setSelectedLevel({ rack, level })}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-colors hover:bg-white/[0.04] touch-manipulation ${getLevelBg(level.status)}`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getLevelDot(level.status)}`} />
                      <span className="text-[0.8125rem] text-foreground">L{level.level}</span>
                      {level.containerType && (
                        <span className="text-[0.5rem] px-1 py-px rounded bg-cyan/10 text-cyan border border-cyan/20">{level.containerType}</span>
                      )}
                      <span className="ml-auto text-[0.6875rem] text-muted-foreground">
                        {level.status === "empty" ? "Empty" : `${level.weight}/${level.maxCapacity} kg`}
                      </span>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <GlassCard className="overflow-x-auto">
          <table className="w-full text-[0.8125rem]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Grid ID", "Rack", "Zone", "Type", "L1", "L2", "L3", "L4", "Util."].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(rack => (
                <tr key={rack.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-3 py-2.5 text-blue">{rack.gridId}</td>
                  <td className="px-3 py-2.5 text-foreground">{rack.label}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{getZoneLabel(rack.zone)}</td>
                  <td className="px-3 py-2.5"><span className="text-[0.6875rem] px-1.5 py-0.5 rounded bg-white/[0.06] text-muted-foreground">{rack.type === "main" ? "Main" : "Add"}</span></td>
                  {[...rack.levels].sort((a, b) => a.level - b.level).map(level => (
                    <td key={level.level} className="px-1.5 py-2.5">
                      <button
                        onClick={() => setSelectedLevel({ rack, level })}
                        className={`w-full px-2 py-1.5 rounded text-[0.625rem] text-center border touch-manipulation ${getLevelBg(level.status)}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full mx-auto mb-0.5 ${getLevelDot(level.status)}`} />
                        {level.status === "empty" ? "—" : `${level.weight} Kg`}
                        {level.containerType && <span className="block text-[0.4375rem] text-cyan mt-0.5">{level.containerType}</span>}
                      </button>
                    </td>
                  ))}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getUtilPercent(rack) > 85 ? "bg-red" : getUtilPercent(rack) > 50 ? "bg-yellow" : "bg-green"}`}
                          style={{ width: `${getUtilPercent(rack)}%` }}
                        />
                      </div>
                      <span className={`text-[0.625rem] ${getUtilPercent(rack) > 85 ? "text-red" : getUtilPercent(rack) > 50 ? "text-yellow" : "text-green"}`}>{getUtilPercent(rack)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-[0.8125rem]">No racks match filters</div>
          )}
        </GlassCard>
      )}

      {/* Level Detail Modal */}
      {selectedLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSelectedLevel(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-md mx-4 rounded-xl border border-white/[0.06] bg-card shadow-2xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-foreground">{selectedLevel.rack.gridId} — Level {selectedLevel.level.level}</h3>
                <p className="text-[0.6875rem] text-muted-foreground">{selectedLevel.rack.label} • {getZoneLabel(selectedLevel.rack.zone)}</p>
              </div>
              <button onClick={() => setSelectedLevel(null)} className="text-muted-foreground hover:text-foreground p-1"><X size={18} /></button>
            </div>

            {/* Status & basic info */}
            <div className="space-y-2 text-[0.8125rem] mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grid Position</span>
                <span className="text-blue">{selectedLevel.rack.gridId} (Col {selectedLevel.rack.gridCol}, Row {selectedLevel.rack.gridRow})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rack Type</span>
                <span className="text-foreground">{selectedLevel.rack.type === "main" ? "Main Unit" : "Add-On Unit"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[0.6875rem] ${selectedLevel.level.status === "empty" ? "bg-green/15 text-green" : "bg-red/15 text-red"}`}>
                  {selectedLevel.level.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Capacity</span>
                <span className="text-foreground">{selectedLevel.level.maxCapacity} kg</span>
              </div>
            </div>

            {selectedLevel.level.sku ? (
              <div className="space-y-2 text-[0.8125rem] border-t border-white/[0.06] pt-3">
                <div className="flex justify-between"><span className="text-muted-foreground">SKU</span><span className="text-blue">{selectedLevel.level.sku}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="text-foreground">{selectedLevel.level.productName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span className="text-foreground">{selectedLevel.level.quantity} units</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Load</span><span className="text-foreground">{selectedLevel.level.weight} / {selectedLevel.level.maxCapacity} kg</span></div>
                {selectedLevel?.level?.containerType && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Container</span>
                    <span className="px-2 py-0.5 rounded text-[0.6875rem] bg-cyan/10 text-cyan border border-cyan/20">{getContainerLabel(selectedLevel.level?.containerType)}</span>
                  </div>
                )}
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden mt-2">
                  <div className={`h-full rounded-full transition-all ${selectedLevel.level.weight / selectedLevel.level.maxCapacity > 0.85 ? "bg-red" : "bg-blue"}`} style={{ width: `${(selectedLevel.level.weight / selectedLevel.level.maxCapacity) * 100}%` }} />
                </div>
              </div>
            ) : (
              <div className="border-t border-white/[0.06] pt-3">
                <p className="text-muted-foreground text-[0.8125rem] text-center py-3">
                  Empty — {selectedLevel.level.maxCapacity} kg capacity available
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}