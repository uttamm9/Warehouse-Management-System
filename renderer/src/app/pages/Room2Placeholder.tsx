import { GlassCard } from '../components/GlassCard';
import { Construction } from 'lucide-react';

export function Room2Placeholder() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-foreground">Room 2 — Coming Soon</h1>
                <p className="text-[0.8125rem] text-muted-foreground">Room 2 conveyor integration is planned for a future release</p>
            </div>
            <GlassCard className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-5 rounded-2xl bg-yellow/10 border border-yellow/20">
                    <Construction size={48} className="text-yellow" />
                </div>
                <h2 className="text-foreground text-xl font-semibold">Room 2 — Not Yet Available</h2>
                <p className="text-muted-foreground text-sm max-w-md">
                    The Room 2 conveyor integration with the Delta DVP PLC is planned for a future release.
                    This screen will provide rack-selection controls, live sensor indicators, and real-time
                    belt visualisation once implementation is complete.
                </p>
                <div className="mt-4 flex flex-col gap-2 text-left">
                    {['Rack selection & momentary-pulse commands', 'Live sensor indicator panel', 'Real-time belt animation via Modbus registers', 'Emergency Stop and conveyor control buttons', 'Routing engine integration'].map(f => (
                        <div key={f} className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                            {f}
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
