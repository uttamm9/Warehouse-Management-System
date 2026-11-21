import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { toast } from 'sonner';
import { plcAPI, usePLCStatus, usePLCTags } from '../utils/plcApi';

function RackButton({ n, isActive, isConnected, onSuccess }: { n: number; isActive: boolean; isConnected: boolean; onSuccess: (n: number) => void }) {
    const [pressing, setPressing] = useState(false);

    const handleClick = async () => {
        if (!isConnected || pressing) return;
        setPressing(true);
        try {
            const r: any = await plcAPI.writeTag(`Rack_${n}`, true);
            if (!r?.success) { toast.error('Failed to send rack command'); setPressing(false); return; }
            setTimeout(() => { plcAPI.writeTag(`Rack_${n}`, false); setPressing(false); onSuccess(n); }, 200);
        } catch { toast.error('Failed to send rack command'); setPressing(false); }
    };

    return (
        <button
            onClick={handleClick}
            disabled={!isConnected}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-lg border-2 text-xs font-bold transition-all
        ${isActive ? 'border-[#FF9800] bg-[#FF9800]/20 text-[#FF9800]'
                    : pressing ? 'border-blue/60 bg-blue/10 text-blue'
                        : 'border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:text-foreground'}
        disabled:opacity-40 disabled:cursor-not-allowed`}
            aria-label={`Rack ${n}`}
        >
            <span className="text-[0.6rem] opacity-60">R</span>
            <span className="text-sm leading-none">{n}</span>
        </button>
    );
}

function SensorIndicator({ k, value }: { k: number; value: any }) {
    const active = value === true;
    return (
        <div className="flex flex-col items-center gap-1" title={`Sensor ${k}: ${active ? 'Active' : 'Inactive'}`}>
            <div className={`w-3 h-3 rounded-full transition-all ${active ? 'bg-green shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-white/20'}`}
                role="status" aria-label={`Sensor ${k} ${active ? 'active' : 'inactive'}`} />
            <span className="text-[0.5rem] text-muted-foreground leading-none">S{k}</span>
        </div>
    );
}

export function Room1RackControl() {
    const { status } = usePLCStatus();
    const tags = usePLCTags();
    const [activeRack, setActiveRack] = useState<number | null>(null);
    const isConnected = status.connected === true;

    const renderRack = (n: number) => (
        <RackButton key={n} n={n} isActive={activeRack === n} isConnected={isConnected} onSuccess={setActiveRack} />
    );

    return (
        <div className="space-y-6 relative">

            {/* Disconnected overlay */}
            {!isConnected && (
                <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center" role="alert">
                    <div className="bg-card border border-red/30 rounded-xl px-8 py-6 text-center">
                        <p className="text-4xl mb-2">🔌</p>
                        <p className="text-foreground font-semibold">PLC Disconnected — Controls disabled</p>
                        <p className="text-muted-foreground text-sm mt-1">Connect to the PLC via PLC Settings first</p>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-foreground">Room 1 — Rack Control</h1>
                <p className="text-[0.8125rem] text-muted-foreground">Momentary-pulse rack commands and live sensor indicators</p>
            </div>

            {activeRack !== null && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF9800]/10 border border-[#FF9800]/30 text-[#FF9800] text-sm">
                    🎯 Last command sent to <strong className="ml-1">Rack {activeRack}</strong>
                </div>
            )}

            {/* Rack Layout */}
            <GlassCard className="p-5 space-y-5">
                <h3 className="text-foreground text-sm">Rack Layout</h3>

                {/* Racks 1–8: top row */}
                <div>
                    <p className="text-[0.6875rem] text-muted-foreground mb-2 uppercase tracking-wider">Top Row (1–8)</p>
                    <div className="flex flex-wrap gap-2">{[1, 2, 3, 4, 5, 6, 7, 8].map(renderRack)}</div>
                </div>

                {/* Lower area */}
                <div className="flex flex-wrap gap-6">
                    <div>
                        <p className="text-[0.6875rem] text-muted-foreground mb-2 uppercase tracking-wider">Left Wing (9–11)</p>
                        <div className="flex flex-col gap-2">{[9, 10, 11].map(renderRack)}</div>
                    </div>
                    <div>
                        <p className="text-[0.6875rem] text-muted-foreground mb-2 uppercase tracking-wider">Mid Zone A (12–15)</p>
                        <div className="grid grid-cols-2 gap-2">{[12, 13, 14, 15].map(renderRack)}</div>
                    </div>
                    <div>
                        <p className="text-[0.6875rem] text-muted-foreground mb-2 uppercase tracking-wider">Mid Zone B (16–19)</p>
                        <div className="grid grid-cols-2 gap-2">{[16, 17, 18, 19].map(renderRack)}</div>
                    </div>
                </div>
            </GlassCard>

            {/* Sensor Indicators */}
            <GlassCard className="p-5">
                <h3 className="text-foreground text-sm mb-3">Sensor Indicators (1–16)</h3>
                <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green inline-block" />Active</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" />Inactive</span>
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-16 gap-3">
                    {Array.from({ length: 16 }, (_, i) => i + 1).map(k => (
                        <SensorIndicator key={k} k={k} value={tags[`Sensor_${k}`]} />
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
