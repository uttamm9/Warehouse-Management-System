import { useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { StatusIndicator } from "../components/StatusIndicator";
import { Play, Square, OctagonX, Cpu, ArrowUpDown, ScanLine, Settings, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useWarehouse } from "../context/WarehouseContext";
import { getZoneLabel } from "../data/mockData";
import { toast } from "sonner";

export function ConveyorControl() {
  const { state, dispatch, addLog, addNotification } = useWarehouse();
  const [speed, setSpeed] = useState(state.conveyorSpeed);

  const running = state.conveyorState === "running";
  const emergency = state.conveyorState === "emergency";
  const stopped = state.conveyorState === "stopped";

  function handleStart() {
    dispatch({ type: "SET_CONVEYOR_STATE", payload: "running" });
    dispatch({ type: "SET_CONVEYOR_SPEED", payload: speed });
    toast.success("Conveyor started");
    addLog("Operator-1", "Started Conveyor", "Conveyor-A", `Speed: ${speed} m/s`, "success");
    addNotification("Conveyor system started", "success");
  }

  function handleStop() {
    dispatch({ type: "SET_CONVEYOR_STATE", payload: "stopped" });
    toast.info("Conveyor stopped");
    addLog("Operator-1", "Stopped Conveyor", "Conveyor-A", "Normal stop", "info");
  }

  function handleEmergency() {
    dispatch({ type: "SET_CONVEYOR_STATE", payload: "emergency" });
    toast.error("EMERGENCY STOP ACTIVATED!");
    addLog("Operator-1", "Emergency Stop Activated", "Conveyor-A", "Emergency stop — all operations halted", "error");
    addNotification("EMERGENCY STOP — Conveyor halted", "error");
  }

  function handleResetEmergency() {
    dispatch({ type: "SET_CONVEYOR_STATE", payload: "stopped" });
    toast.info("Emergency stop reset — system ready");
    addLog("Operator-1", "Reset Emergency Stop", "Conveyor-A", "E-Stop cleared, system ready to start", "info");
  }

  function handleSpeedChange(newSpeed: number) {
    setSpeed(newSpeed);
    if (running) {
      dispatch({ type: "SET_CONVEYOR_SPEED", payload: newSpeed });
      toast.info(`Speed updated: ${newSpeed} m/s`);
    }
  }

  const destRack = state.conveyorDestRack;
  const destLevel = state.conveyorDestLevel;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground">Conveyor Control</h1>
        <p className="text-[0.8125rem] text-muted-foreground">Industrial conveyor system management</p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Cpu, label: "PLC Connection", status: "online" as const,
            detail: `${state.settings.plcIp}:${state.settings.plcPort} • ${state.settings.plcProtocol}`,
          },
          {
            icon: ArrowUpDown, label: "Conveyor System",
            status: running ? "active" as const : emergency ? "offline" as const : "idle" as const,
            detail: running ? `Running at ${state.conveyorSpeed} m/s` : emergency ? "EMERGENCY STOP" : "Stopped",
          },
          {
            icon: ScanLine, label: "QR Scanner", status: "online" as const,
            detail: "Cognex DataMan 370 • Active",
          },
        ].map((s) => (
          <GlassCard key={s.label} className="p-5">
            <div className="flex items-start gap-3">
              <div className={`p-3 rounded-xl ${s.status === "online" || s.status === "active" ? "bg-green/10" : s.status === "offline" ? "bg-red/10" : "bg-muted"}`}>
                <s.icon size={22} className={s.status === "online" || s.status === "active" ? "text-green" : s.status === "offline" ? "text-red" : "text-muted-foreground"} />
              </div>
              <div>
                <StatusIndicator status={s.status} label={s.label} size="lg" />
                <p className="text-[0.75rem] text-muted-foreground mt-1">{s.detail}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <GlassCard className="p-6">
          <h3 className="text-foreground mb-5">Conveyor Controls</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <button
              onClick={handleStart}
              disabled={running}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${running ? "border-green/30 bg-green/5 text-green" : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:border-green/30 hover:text-green"}`}
            >
              <Play size={28} />
              <span className="text-[0.8125rem]">Start</span>
            </button>
            <button
              onClick={handleStop}
              disabled={!running}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${stopped ? "border-yellow/30 bg-yellow/5 text-yellow" : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:border-yellow/30 hover:text-yellow"}`}
            >
              <Square size={28} />
              <span className="text-[0.8125rem]">Stop</span>
            </button>
            <button
              onClick={handleEmergency}
              disabled={emergency}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${emergency ? "border-red bg-red/20 text-red animate-pulse" : "border-red/30 bg-red/5 text-red hover:bg-red/10"}`}
            >
              <OctagonX size={28} />
              <span className="text-[0.8125rem]">E-Stop</span>
            </button>
          </div>

          {emergency && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="p-3 rounded-lg bg-red/10 border border-red/30 text-red text-[0.8125rem] text-center">
                EMERGENCY STOP ACTIVATED — System halted
              </div>
              <button
                onClick={handleResetEmergency}
                className="w-full py-3 rounded-lg bg-yellow/10 border border-yellow/30 text-yellow text-[0.8125rem] flex items-center justify-center gap-2 hover:bg-yellow/20"
              >
                <RotateCcw size={16} /> Reset Emergency Stop
              </button>
            </motion.div>
          )}

          {/* Speed Control */}
          <div className="mt-4">
            <label className="text-[0.75rem] text-muted-foreground block mb-2">Belt Speed: {speed} m/s</label>
            <input
              type="range"
              min={0.5}
              max={2.5}
              step={0.1}
              value={speed}
              onChange={e => handleSpeedChange(Number(e.target.value))}
              className="w-full accent-blue"
            />
            <div className="flex justify-between text-[0.6875rem] text-muted-foreground mt-1">
              <span>0.5 m/s</span>
              <span>2.5 m/s</span>
            </div>
          </div>
        </GlassCard>

        {/* Routing Config */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Settings size={18} className="text-blue" />
            <h3 className="text-foreground">Routing Configuration</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[0.75rem] text-muted-foreground block mb-1">Destination Rack</label>
              <select
                value={destRack}
                onChange={e => dispatch({ type: "SET_CONVEYOR_DEST", payload: { rack: Number(e.target.value), level: destLevel } })}
                className="w-full bg-secondary border border-white/[0.06] rounded-lg px-4 py-3 text-foreground text-[0.8125rem]"
              >
                {state.racks.map(r => (
                  <option key={r.id} value={r.id}>{r.label} — {getZoneLabel(r.zone)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[0.75rem] text-muted-foreground block mb-1">Destination Level</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(l => (
                  <button
                    key={l}
                    onClick={() => dispatch({ type: "SET_CONVEYOR_DEST", payload: { rack: destRack, level: l } })}
                    className={`py-3 rounded-lg text-[0.8125rem] border-2 transition-colors ${destLevel === l ? "border-blue bg-blue/10 text-blue" : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:text-foreground"}`}
                  >
                    L{l}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue/5 border border-blue/20 text-[0.75rem] text-muted-foreground">
              Route: Gate A → Junction {destRack <= 20 ? "1" : destRack <= 40 ? "2" : "3"} → R{destRack}-L{destLevel}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Belt Visualization */}
      <GlassCard className="p-6">
        <h3 className="text-foreground mb-4">Conveyor Belt Visualization</h3>
        <div className="relative h-28 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          {/* Belt track */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-4 rounded-full bg-white/[0.04] border border-white/[0.06]">
            {/* Hash marks on belt */}
            {running && Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-white/10"
                style={{ left: `${(i / 12) * 100}%` }}
                animate={{ left: [`${(i / 12) * 100}%`, `${((i + 1) / 12) * 100}%`] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ))}
            {running && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue/80 shadow-[0_0_16px_rgba(59,130,246,0.6)] flex items-center justify-center text-[0.5rem] text-white"
                animate={{ left: ["0%", "90%"] }}
                transition={{ duration: 3 / speed, repeat: Infinity, ease: "linear" }}
              >
                PKG
              </motion.div>
            )}
          </div>
          {/* Endpoints */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg bg-green/10 border border-green/30 flex items-center justify-center text-[0.625rem] text-green">IN</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg bg-blue/10 border border-blue/30 flex items-center justify-center text-[0.625rem] text-blue">R{destRack}</div>
          {/* Status */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[0.6875rem]">
            <span className="text-muted-foreground">Speed: {running ? `${speed} m/s` : "0 m/s"}</span>
            <span className={`px-2 py-0.5 rounded-full ${running ? "bg-green/15 text-green" : emergency ? "bg-red/15 text-red" : "bg-yellow/15 text-yellow"}`}>
              {running ? "RUNNING" : emergency ? "E-STOP" : "STOPPED"}
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
