import React from "react";
import { Package, Box, Grid3X3, CheckSquare, Cpu, ArrowUpDown, ScanLine, Activity, QrCode, MapPin, Truck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { MetricCard } from "../components/MetricCard";
import { GlassCard } from "../components/GlassCard";
import { StatusIndicator } from "../components/StatusIndicator";
import { useWarehouse } from "../context/WarehouseContext";
import { getRackStats, getZoneLabel } from "../data/mockData";
import { useNavigate } from "react-router";

const iconMap: Record<string, React.ReactNode> = {
  scan: <QrCode size={14} className="text-cyan" />,
  placement: <MapPin size={14} className="text-green" />,
  dispatch: <Truck size={14} className="text-yellow" />,
};

export function Dashboard() {
  const { state } = useWarehouse();
  const navigate = useNavigate();
  const stats = getRackStats(state.racks);

  const [metrics, setMetrics] = React.useState({
    totalSkus: 0,
    inventoryUnits: 0,
    activityFeed: [] as { id: string | number, type: string, message: string, time: string }[],
    inboundOutboundData: [] as any[],
    dailyActivityData: [] as any[]
  });

  React.useEffect(() => {
    let mounted = true;
    async function loadMetrics() {
      try {
        if ((window as any).electronAPI?.getDashboardMetrics) {
          const res = await (window as any).electronAPI.getDashboardMetrics();
          if (res?.success && mounted) {
            setMetrics(res.data);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      }
    }
    loadMetrics();
    const interval = setInterval(loadMetrics, 60000); // refresh every minute
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const conveyorStatus = state.conveyorState === "running" ? "active" as const : state.conveyorState === "emergency" ? "offline" as const : "idle" as const;

  // Zone utilization for bar chart
  const zoneData = (["shed1", "shed2", "cabin"] as const).map(zone => {
    const zoneRacks = state.racks.filter(r => r.zone === zone);
    const totalLevels = zoneRacks.reduce((a, r) => a + r.levels.length, 0);
    const usedLevels = zoneRacks.reduce((a, r) => a + r.levels.filter(l => l.status !== "empty").length, 0);
    return {
      name: getZoneLabel(zone),
      utilized: totalLevels > 0 ? Math.round((usedLevels / totalLevels) * 100) : 0,
      available: totalLevels > 0 ? Math.round(((totalLevels - usedLevels) / totalLevels) * 100) : 0,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground">Operations Dashboard</h1>
          <p className="text-[0.8125rem] text-muted-foreground">Real-time warehouse monitoring — 45 racks, 180 positions</p>
        </div>
        <div className="text-[0.75rem] text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div onClick={() => navigate("/sku-management")} className="cursor-pointer">
          <MetricCard title="Total SKUs" value={metrics.totalSkus} icon={Package} trend={`${metrics.totalSkus} products`} trendUp color="text-blue" />
        </div>
        <div onClick={() => navigate("/sku-management")} className="cursor-pointer">
          <MetricCard title="Inventory Units" value={metrics.inventoryUnits.toLocaleString()} icon={Box} trend="Real-time count" trendUp color="text-green" />
        </div>
        <div onClick={() => navigate("/rack-monitoring")} className="cursor-pointer">
          <MetricCard title="Available Positions" value={stats.available} icon={Grid3X3} color="text-cyan" />
        </div>
        <div onClick={() => navigate("/rack-monitoring")} className="cursor-pointer">
          <MetricCard title="Occupied Positions" value={stats.occupied} icon={CheckSquare} color="text-yellow" />
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "PLC Status", status: "online" as const, icon: Cpu },
          { label: "Conveyor Status", status: conveyorStatus, icon: ArrowUpDown },
          { label: "Scanner Status", status: "online" as const, icon: ScanLine },
          { label: "System Health", status: "online" as const, icon: Activity },
        ].map((s) => (
          <GlassCard key={s.label} className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/[0.04]">
              <s.icon size={18} className="text-muted-foreground" />
            </div>
            <StatusIndicator status={s.status} label={s.label} />
          </GlassCard>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <h3 className="text-foreground mb-4">Zone Utilization</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={zoneData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} unit="%" />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: 12 }} />
              <Bar dataKey="utilized" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Utilized %" />
              <Bar dataKey="available" fill="#10b981" radius={[3, 3, 0, 0]} name="Available %" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-foreground mb-4">Inbound vs Out-bound</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={metrics.inboundOutboundData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: 12 }} />
              <Area type="monotone" dataKey="inbound" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="Inbound" />
              <Area type="monotone" dataKey="outbound" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} name="Outbound" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <GlassCard className="p-5 xl:col-span-2">
          <h3 className="text-foreground mb-4">Daily Activity Timeline</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={metrics.dailyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: 12 }} />
              <Line type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={2} dot={false} name="Scans" />
              <Line type="monotone" dataKey="placements" stroke="#10b981" strokeWidth={2} dot={false} name="Placements" />
              <Line type="monotone" dataKey="dispatches" stroke="#f59e0b" strokeWidth={2} dot={false} name="Dispatches" />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Live Activity Feed */}
        <GlassCard className="p-5">
          <h3 className="text-foreground mb-4">Live Activity</h3>
          <div className="space-y-1 overflow-y-auto max-h-[220px]">
            {metrics.activityFeed.map((item) => (
              <div key={item.id} className="flex items-start gap-2.5 py-2 border-b border-white/[0.04] last:border-0">
                <div className="mt-0.5">{iconMap[item.type]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.8125rem] text-foreground truncate">{item.message}</p>
                  <p className="text-[0.6875rem] text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}