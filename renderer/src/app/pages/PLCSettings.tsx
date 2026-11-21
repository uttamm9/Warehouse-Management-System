import { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Wifi, WifiOff, AlertTriangle, RefreshCw, Save, Plug, PlugZap } from 'lucide-react';
import { toast } from 'sonner';
import { plcAPI, usePLCStatus } from '../utils/plcApi';

const BAUD_RATES = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200];
const PARITIES = ['none', 'even', 'odd'];
const DATA_BITS = [7, 8];
const STOP_BITS = [1, 2];

function ConnectionBadge({ status }: { status: any }) {
    const lastEventRef = useRef<string | null>(null);
    useEffect(() => {
        if (status.event) lastEventRef.current = status.event;
        if (status.connected || status.reconnecting) lastEventRef.current = null;
    }, [status]);

    if (status.connected)
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green/15 border border-green/30 text-green text-xs font-semibold"><span className="w-2 h-2 rounded-full bg-green animate-pulse" />Connected</span>;
    if (status.reconnecting)
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow/15 border border-yellow/30 text-yellow text-xs font-semibold"><span className="w-2 h-2 rounded-full bg-yellow animate-pulse" />Reconnecting…</span>;
    if (lastEventRef.current === 'error')
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red/15 border border-red/30 text-red text-xs font-semibold"><span className="w-2 h-2 rounded-full bg-red" />Communication Error</span>;
    return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/[0.06] text-muted-foreground text-xs font-semibold"><span className="w-2 h-2 rounded-full bg-muted-foreground" />Disconnected</span>;
}

export function PLCSettings() {
    const { status, connect, disconnect } = usePLCStatus();
    const [form, setForm] = useState<any>(null);
    const [ports, setPorts] = useState<string[]>([]);
    const [portsLoaded, setPortsLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        plcAPI.getSettings().then((r: any) => {
            if (r?.success) setForm(r.settings);
            else toast.error('Failed to load settings');
        }).catch(() => toast.error('Failed to load settings'));

        plcAPI.getPorts().then((r: any) => {
            setPorts(r?.ports || []);
        }).catch(() => setPorts([])).finally(() => setPortsLoaded(true));
    }, []);

    if (!form) return <div className="flex items-center gap-2 text-muted-foreground p-8"><RefreshCw size={16} className="animate-spin" /> Loading settings…</div>;

    const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));
    const noPorts = portsLoaded && ports.length === 0;

    const handleSave = async () => {
        setSaving(true);
        const r = await plcAPI.saveSettings(form).catch(() => ({ success: false, message: 'Network error' }));
        setSaving(false);
        r?.success ? toast.success('Settings saved') : toast.error(r?.message || 'Failed to save settings');
    };

    const handleConnect = async () => {
        setBusy(true);
        const r: any = await connect(form).catch(() => ({ success: false, message: 'Network error' }));
        setBusy(false);
        r?.success ? toast.success(`Connected to ${r.port || form.port}`) : toast.error(r?.message || 'Connection failed');
    };

    const handleDisconnect = async () => {
        setBusy(true);
        await disconnect().catch(() => { });
        setBusy(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-foreground">PLC Settings</h1>
                    <p className="text-[0.8125rem] text-muted-foreground">Configure Modbus RTU / RS485 connection to Delta DVP PLC</p>
                </div>
                <ConnectionBadge status={status} />
            </div>

            {status.mockMode && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-yellow/10 border border-yellow/30 text-yellow text-sm">
                    <AlertTriangle size={16} /> MOCK MODE — No physical PLC connected
                </div>
            )}

            <GlassCard className="p-6 space-y-5">
                <h3 className="text-foreground">Serial Port Configuration</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-[0.75rem] text-muted-foreground">
                        COM Port
                        {noPorts ? (
                            <select disabled className="bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-muted-foreground text-[0.8125rem] opacity-50">
                                <option>No ports available</option>
                            </select>
                        ) : (
                            <select value={form.port || ''} onChange={e => set('port', e.target.value)}
                                className="bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground text-[0.8125rem]">
                                {form.port && !ports.includes(form.port) && <option value={form.port}>{form.port} (saved)</option>}
                                {ports.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        )}
                    </label>

                    <label className="flex flex-col gap-1.5 text-[0.75rem] text-muted-foreground">
                        Slave ID
                        <input type="number" min={1} max={247} value={form.slaveId}
                            onChange={e => set('slaveId', +e.target.value)}
                            className="bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground text-[0.8125rem]" />
                    </label>

                    <label className="flex flex-col gap-1.5 text-[0.75rem] text-muted-foreground">
                        Baud Rate
                        <select value={form.baudRate} onChange={e => set('baudRate', +e.target.value)}
                            className="bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground text-[0.8125rem]">
                            {BAUD_RATES.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1.5 text-[0.75rem] text-muted-foreground">
                        Data Bits
                        <select value={form.dataBits} onChange={e => set('dataBits', +e.target.value)}
                            className="bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground text-[0.8125rem]">
                            {DATA_BITS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1.5 text-[0.75rem] text-muted-foreground">
                        Stop Bits
                        <select value={form.stopBits} onChange={e => set('stopBits', +e.target.value)}
                            className="bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground text-[0.8125rem]">
                            {STOP_BITS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1.5 text-[0.75rem] text-muted-foreground">
                        Parity
                        <select value={form.parity} onChange={e => set('parity', e.target.value)}
                            className="bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground text-[0.8125rem]">
                            {PARITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1.5 text-[0.75rem] text-muted-foreground">
                        Poll Interval (ms)
                        <input type="number" min={100} max={60000} step={100} value={form.pollInterval}
                            onChange={e => set('pollInterval', +e.target.value)}
                            className="bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground text-[0.8125rem]" />
                    </label>

                    <label className="flex flex-col gap-1.5 text-[0.75rem] text-muted-foreground">
                        Reconnect Delay (ms)
                        <input type="number" min={1000} max={300000} step={1000} value={form.reconnectDelay}
                            onChange={e => set('reconnectDelay', +e.target.value)}
                            className="bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground text-[0.8125rem]" />
                    </label>
                </div>

                <div className="flex items-center gap-6 pt-2">
                    {[{ key: 'autoConnect', label: 'Auto Connect on Startup' }, { key: 'mockMode', label: 'Mock Mode (No Hardware)' }].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2.5 cursor-pointer select-none">
                            <div onClick={() => set(key, !form[key])}
                                className={`w-9 h-5 rounded-full transition-colors ${form[key] ? 'bg-blue' : 'bg-white/10'} relative`}>
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form[key] ? 'translate-x-4' : ''}`} />
                            </div>
                            <span className="text-[0.8125rem] text-muted-foreground">{label}</span>
                        </label>
                    ))}
                </div>
            </GlassCard>

            <div className="flex items-center gap-3">
                <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.06] text-foreground text-[0.8125rem] hover:bg-white/10 disabled:opacity-50">
                    <Save size={14} />{saving ? 'Saving…' : 'Save Settings'}
                </button>
                {status.connected ? (
                    <button onClick={handleDisconnect} disabled={busy}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red/10 border border-red/30 text-red text-[0.8125rem] hover:bg-red/20 disabled:opacity-50">
                        <WifiOff size={14} />{busy ? 'Disconnecting…' : 'Disconnect'}
                    </button>
                ) : (
                    <button onClick={handleConnect} disabled={busy || status.connecting || noPorts}
                        title={noPorts ? 'No COM ports available' : undefined}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue/10 border border-blue/30 text-blue text-[0.8125rem] hover:bg-blue/20 disabled:opacity-50">
                        <PlugZap size={14} />{busy || status.connecting ? 'Connecting…' : 'Connect to PLC'}
                    </button>
                )}
            </div>

            {noPorts && !status.connected && (
                <p className="text-[0.75rem] text-muted-foreground">
                    No serial COM ports detected. Plug in the RS485 adapter or enable Mock Mode.
                </p>
            )}
        </div>
    );
}
