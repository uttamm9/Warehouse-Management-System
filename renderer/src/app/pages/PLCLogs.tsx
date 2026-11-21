import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { RefreshCw, Download, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { plcAPI, usePLCLogs } from '../utils/plcApi';

const LOG_TYPES = ['READ', 'WRITE', 'CONNECT', 'DISCONNECT', 'ERROR', 'INFO'];
const TYPE_COLORS: Record<string, string> = {
    READ: 'bg-blue/15 text-blue', WRITE: 'bg-green/15 text-green',
    CONNECT: 'bg-purple/15 text-purple', DISCONNECT: 'bg-yellow/15 text-yellow',
    ERROR: 'bg-red/15 text-red', INFO: 'bg-white/[0.06] text-muted-foreground',
};

export function PLCLogs() {
    const [filterType, setFilterType] = useState('');
    const [searchText, setSearchText] = useState('');
    const [limit, setLimit] = useState(100);
    const { logs, total, loading, refresh } = usePLCLogs(limit);
    const [busy, setBusy] = useState(false);

    const filtered = logs.filter((l: any) => {
        const typeMatch = !filterType || l.type === filterType;
        const searchMatch = !searchText || (l.message || '').toLowerCase().includes(searchText.toLowerCase());
        return typeMatch && searchMatch;
    });

    const handleClear = async () => {
        if (!window.confirm('Clear all PLC logs?')) return;
        setBusy(true);
        const r: any = await plcAPI.clearLogs().catch(() => ({ success: false }));
        if (r?.success) { refresh(); toast.success('Logs cleared'); }
        else toast.error('Failed to clear logs');
        setBusy(false);
    };

    const handleExport = () => {
        if (filtered.length === 0) return;
        const date = new Date().toISOString().slice(0, 10);
        const esc = (v: any) => { const s = String(v ?? ''); return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s; };
        const csv = [['id', 'timestamp', 'type', 'message', 'tag', 'address', 'value'],
        ...filtered.map((l: any) => [l.id, l.timestamp, l.type, l.message, l.tag || '', l.address ?? '', l.value ?? ''])
        ].map(r => r.map(esc).join(',')).join('\r\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = `plc-log-${date}.csv`;
        a.click(); URL.revokeObjectURL(a.href);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-foreground">PLC Communication Logs</h1>
                    <p className="text-[0.8125rem] text-muted-foreground">Trace all PLC reads, writes, connections, and errors</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleExport} disabled={filtered.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.06] text-muted-foreground text-[0.8125rem] hover:text-foreground disabled:opacity-40">
                        <Download size={14} />Export CSV
                    </button>
                    <button onClick={handleClear} disabled={busy}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red/10 border border-red/30 text-red text-[0.8125rem] hover:bg-red/20 disabled:opacity-40">
                        <Trash2 size={14} />Clear
                    </button>
                </div>
            </div>

            <GlassCard className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[0.75rem] text-muted-foreground">Type:</span>
                        <select value={filterType} onChange={e => setFilterType(e.target.value)}
                            className="bg-secondary border border-white/[0.06] rounded-lg px-2 py-1.5 text-[0.8125rem] text-foreground">
                            <option value="">All</option>
                            {LOG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[0.75rem] text-muted-foreground">Limit:</span>
                        <select value={limit} onChange={e => setLimit(+e.target.value)}
                            className="bg-secondary border border-white/[0.06] rounded-lg px-2 py-1.5 text-[0.8125rem] text-foreground">
                            {[50, 100, 200, 500].map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div className="relative flex-1 min-w-40">
                        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" placeholder="Search messages…" value={searchText} onChange={e => setSearchText(e.target.value)}
                            className="w-full bg-secondary border border-white/[0.06] rounded-lg pl-7 pr-3 py-1.5 text-[0.8125rem] text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-blue/40" />
                    </div>
                    <span className="text-[0.75rem] text-muted-foreground ml-auto">{filtered.length} / {total} entries</span>
                    <button onClick={refresh} disabled={loading}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/[0.06] text-muted-foreground hover:text-foreground text-[0.8125rem]">
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </GlassCard>

            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-y-auto max-h-[500px]">
                    <table className="w-full text-[0.8125rem]">
                        <thead className="sticky top-0 bg-card z-10">
                            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                {['Timestamp', 'Type', 'Tag / Address', 'Value', 'Message'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((l: any) => (
                                <tr key={l.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">{new Date(l.timestamp).toLocaleString()}</td>
                                    <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${TYPE_COLORS[l.type] || 'bg-white/[0.06] text-muted-foreground'}`}>{l.type}</span></td>
                                    <td className="px-4 py-2.5 text-blue font-medium">{l.tag || (l.address !== undefined ? `Addr ${l.address}` : '—')}</td>
                                    <td className="px-4 py-2.5 font-mono text-muted-foreground">{l.value !== undefined ? String(l.value) : '—'}</td>
                                    <td className="px-4 py-2.5 text-foreground text-xs max-w-xs break-words">{l.message}</td>
                                </tr>
                            ))}
                            {filtered.length === 0 && !loading && (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No log entries found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
