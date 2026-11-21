import { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { RefreshCw, Search } from 'lucide-react';
import { plcAPI, usePLCStatus, usePLCTags } from '../utils/plcApi';

export function PLCMonitor() {
    const { status } = usePLCStatus();
    const liveValues = usePLCTags();
    const [tagsList, setTagsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        plcAPI.getTags().then((r: any) => { if (r?.success) setTagsList(r.tags || []); }).finally(() => setLoading(false));
    }, []);

    const filtered = tagsList.filter((t: any) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="text-muted-foreground p-8 flex items-center gap-2"><RefreshCw size={16} className="animate-spin" />Loading monitor…</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-foreground">PLC Live Monitor</h1>
                    <p className="text-[0.8125rem] text-muted-foreground">Real-time tag values from the PLC</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.connected ? 'bg-green/15 text-green' : 'bg-red/15 text-red'}`}>
                    <span className={`w-2 h-2 rounded-full ${status.connected ? 'bg-green animate-pulse' : 'bg-red'}`} />
                    {status.connected ? `PLC Online${status.mockMode ? ' (Mock)' : ''}` : 'PLC Offline'}
                </div>
            </div>

            <GlassCard className="p-4">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Search tags or descriptions…" value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full bg-secondary border border-white/[0.06] rounded-lg pl-8 pr-3 py-2 text-[0.8125rem] text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-blue/40" />
                </div>
            </GlassCard>

            <GlassCard className="p-0 overflow-hidden">
                <table className="w-full text-[0.8125rem]">
                    <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                            {['Tag Name', 'Type', 'Address', 'Direction', 'Live Value', 'Status'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((tag: any) => {
                            const val = liveValues[tag.name];
                            const hasVal = status.connected && val !== undefined;
                            let valEl = <span className="text-muted-foreground">—</span>;
                            if (hasVal) {
                                if (['M', 'X', 'Y'].includes(tag.type))
                                    valEl = <span className={`font-mono px-2 py-0.5 rounded text-xs ${val ? 'bg-green/15 text-green' : 'bg-white/[0.06] text-muted-foreground'}`}>{val ? 'ON' : 'OFF'}</span>;
                                else
                                    valEl = <span className="font-mono text-blue">{val}</span>;
                            }
                            const statusColor = !status.connected ? 'text-muted-foreground' : val === undefined ? 'text-yellow' : tag.name === 'Conveyor_Fault' && val ? 'text-red' : 'text-green';
                            const statusText = !status.connected ? 'OFFLINE' : val === undefined ? 'WAITING' : tag.name === 'Conveyor_Fault' && val ? 'FAULT' : 'OK';
                            return (
                                <tr key={tag.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-2.5 font-medium text-blue">{tag.name}</td>
                                    <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded text-xs bg-white/[0.06] text-muted-foreground">{tag.type}</span></td>
                                    <td className="px-4 py-2.5 text-muted-foreground">{tag.address}</td>
                                    <td className="px-4 py-2.5 text-muted-foreground">{tag.direction}</td>
                                    <td className="px-4 py-2.5">{valEl}</td>
                                    <td className="px-4 py-2.5"><span className={`text-xs font-semibold ${statusColor}`}>{statusText}</span></td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No tags match the search criteria.</td></tr>
                        )}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}
