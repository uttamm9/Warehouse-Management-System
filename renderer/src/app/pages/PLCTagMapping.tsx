import { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Plus, Pencil, Trash2, Download, Upload, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { plcAPI } from '../utils/plcApi';

const VALID_TYPES = ['M', 'X', 'Y', 'D', 'T', 'C'];
const VALID_DIRS = ['Read', 'Write', 'Read+Write'];

function validateTag(tag: any, existing: any[], editingId?: number) {
    if (!tag.name?.trim()) return 'Tag name is required';
    if (tag.name.length > 100) return 'Tag name must be ≤100 characters';
    if (!Number.isInteger(+tag.address) || +tag.address < 0 || +tag.address > 65535)
        return 'Address must be an integer 0–65535';
    if (!VALID_TYPES.includes(tag.type)) return 'Type must be M, D, X, Y, T, or C';
    if (!VALID_DIRS.includes(tag.direction)) return 'Direction must be Read, Write, or Read+Write';
    if (existing.some((t: any) => t.name === tag.name.trim() && t.id !== editingId))
        return 'Tag name already exists';
    return null;
}

export function PLCTagMapping() {
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [showAdd, setShowAdd] = useState(false);
    const [newTag, setNewTag] = useState({ name: '', address: 0, type: 'M', direction: 'Read', description: '' });

    useEffect(() => {
        plcAPI.getTags().then((r: any) => { if (r?.success) setTags(r.tags || []); }).finally(() => setLoading(false));
    }, []);

    const saveAll = async (updated: any[]) => {
        const r: any = await plcAPI.saveTags(updated).catch(() => ({ success: false }));
        if (r?.success) { setTags(r.tags ?? updated); toast.success('Tags saved'); }
        else toast.error('Failed to save tags');
    };

    const handleAdd = () => {
        const err = validateTag(newTag, tags);
        if (err) { toast.error(err); return; }
        const nextId = tags.reduce((m: number, t: any) => Math.max(m, t.id), 0) + 1;
        const updated = [...tags, { ...newTag, id: nextId, address: +newTag.address }];
        setTags(updated); saveAll(updated);
        setNewTag({ name: '', address: 0, type: 'M', direction: 'Read', description: '' });
        setShowAdd(false);
    };

    const handleDelete = (id: number) => {
        if (!window.confirm('Delete this tag?')) return;
        const updated = tags.filter((t: any) => t.id !== id);
        setTags(updated); saveAll(updated);
    };

    const handleSaveEdit = () => {
        const err = validateTag(editForm, tags, editingId!);
        if (err) { toast.error(err); return; }
        const updated = tags.map((t: any) => t.id === editingId ? { ...editForm, address: +editForm.address } : t);
        setTags(updated); saveAll(updated); setEditingId(null);
    };

    const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const text = (ev.target?.result as string) || '';
            const lines = text.trim().split(/\r?\n/);
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            const nameIdx = headers.indexOf('tagname') >= 0 ? headers.indexOf('tagname') : headers.indexOf('name');
            const addrIdx = headers.indexOf('address');
            const typeIdx = headers.indexOf('type');
            const dirIdx = headers.indexOf('direction');
            const descIdx = headers.indexOf('description');
            let valid: any[] = [], skipped = 0;
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
                const name = cols[nameIdx] || '';
                const address = parseInt(cols[addrIdx]);
                const type = (cols[typeIdx] || '').toUpperCase();
                const direction = cols[dirIdx] || '';
                const description = descIdx >= 0 ? cols[descIdx] : '';
                if (!name || isNaN(address) || !VALID_TYPES.includes(type) || !VALID_DIRS.includes(direction)) { skipped++; continue; }
                valid.push({ name, address, type, direction, description });
            }
            const withIds = valid.map((t, i) => ({ ...t, id: i + 1 }));
            setTags(withIds);
            toast.info(`Imported ${withIds.length} tags, skipped ${skipped} invalid rows. Review then save.`);
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleExportCSV = () => {
        const date = new Date().toISOString().slice(0, 10);
        const rows = [['id', 'name', 'address', 'type', 'direction', 'description'],
        ...tags.map((t: any) => [t.id, t.name, t.address, t.type, t.direction, t.description || ''])];
        const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = `plc-tags-${date}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    if (loading) return <div className="text-muted-foreground p-8">Loading tags…</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-foreground">PLC Tag Mapping</h1>
                    <p className="text-[0.8125rem] text-muted-foreground">Configure Modbus address assignments for all PLC tags</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => setShowAdd(!showAdd)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue/10 border border-blue/30 text-blue text-[0.8125rem] hover:bg-blue/20">
                        <Plus size={14} />{showAdd ? 'Cancel' : 'Add Tag'}
                    </button>
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.06] text-muted-foreground text-[0.8125rem] hover:text-foreground cursor-pointer">
                        <Upload size={14} />Import CSV
                        <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
                    </label>
                    <button onClick={handleExportCSV}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.06] text-muted-foreground text-[0.8125rem] hover:text-foreground">
                        <Download size={14} />Export CSV
                    </button>
                </div>
            </div>

            {showAdd && (
                <GlassCard className="p-4">
                    <h3 className="text-foreground text-sm mb-3">Add New Tag</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[
                            { key: 'name', label: 'Tag Name', type: 'text' },
                            { key: 'address', label: 'Address', type: 'number' },
                        ].map(f => (
                            <label key={f.key} className="flex flex-col gap-1 text-[0.75rem] text-muted-foreground col-span-1">
                                {f.label}
                                <input type={f.type} value={(newTag as any)[f.key]} onChange={e => setNewTag(p => ({ ...p, [f.key]: e.target.value }))}
                                    className="bg-secondary border border-white/[0.06] rounded-lg px-2 py-1.5 text-foreground text-[0.8125rem]" />
                            </label>
                        ))}
                        {[
                            { key: 'type', label: 'Type', opts: VALID_TYPES },
                            { key: 'direction', label: 'Direction', opts: VALID_DIRS },
                        ].map(f => (
                            <label key={f.key} className="flex flex-col gap-1 text-[0.75rem] text-muted-foreground">
                                {f.label}
                                <select value={(newTag as any)[f.key]} onChange={e => setNewTag(p => ({ ...p, [f.key]: e.target.value }))}
                                    className="bg-secondary border border-white/[0.06] rounded-lg px-2 py-1.5 text-foreground text-[0.8125rem]">
                                    {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </label>
                        ))}
                        <label className="flex flex-col gap-1 text-[0.75rem] text-muted-foreground col-span-2">
                            Description
                            <input value={newTag.description} onChange={e => setNewTag(p => ({ ...p, description: e.target.value }))}
                                className="bg-secondary border border-white/[0.06] rounded-lg px-2 py-1.5 text-foreground text-[0.8125rem]" />
                        </label>
                    </div>
                    <button onClick={handleAdd} className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green/10 border border-green/30 text-green text-[0.8125rem] hover:bg-green/20">
                        <Check size={14} />Save Tag
                    </button>
                </GlassCard>
            )}

            <GlassCard className="p-0 overflow-hidden">
                <table className="w-full text-[0.8125rem]">
                    <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                            {['Tag Name', 'Type', 'Address', 'Direction', 'Description', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tags.map((tag: any) => {
                            if (editingId === tag.id) return (
                                <tr key={tag.id} className="border-b border-white/[0.04] bg-blue/5">
                                    <td className="px-3 py-2"><input value={editForm.name} onChange={e => setEditForm((p: any) => ({ ...p, name: e.target.value }))} className="bg-secondary border border-white/[0.06] rounded px-2 py-1 w-full text-[0.8125rem]" /></td>
                                    <td className="px-3 py-2"><select value={editForm.type} onChange={e => setEditForm((p: any) => ({ ...p, type: e.target.value }))} className="bg-secondary border border-white/[0.06] rounded px-2 py-1 text-[0.8125rem]">{VALID_TYPES.map(t => <option key={t}>{t}</option>)}</select></td>
                                    <td className="px-3 py-2"><input type="number" value={editForm.address} onChange={e => setEditForm((p: any) => ({ ...p, address: e.target.value }))} className="bg-secondary border border-white/[0.06] rounded px-2 py-1 w-20 text-[0.8125rem]" /></td>
                                    <td className="px-3 py-2"><select value={editForm.direction} onChange={e => setEditForm((p: any) => ({ ...p, direction: e.target.value }))} className="bg-secondary border border-white/[0.06] rounded px-2 py-1 text-[0.8125rem]">{VALID_DIRS.map(d => <option key={d}>{d}</option>)}</select></td>
                                    <td className="px-3 py-2"><input value={editForm.description} onChange={e => setEditForm((p: any) => ({ ...p, description: e.target.value }))} className="bg-secondary border border-white/[0.06] rounded px-2 py-1 w-full text-[0.8125rem]" /></td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <button onClick={handleSaveEdit} className="p-1.5 rounded hover:bg-green/10 text-green mr-1"><Check size={13} /></button>
                                        <button onClick={() => setEditingId(null)} className="p-1.5 rounded hover:bg-red/10 text-red"><X size={13} /></button>
                                    </td>
                                </tr>
                            );
                            return (
                                <tr key={tag.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-2.5 font-medium text-blue">{tag.name}</td>
                                    <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded text-xs bg-white/[0.06] text-muted-foreground">{tag.type}</span></td>
                                    <td className="px-4 py-2.5 text-muted-foreground">{tag.address}</td>
                                    <td className="px-4 py-2.5 text-muted-foreground">{tag.direction}</td>
                                    <td className="px-4 py-2.5 text-muted-foreground text-xs max-w-xs truncate" title={tag.description}>{tag.description || '—'}</td>
                                    <td className="px-4 py-2.5 whitespace-nowrap">
                                        <button onClick={() => { setEditingId(tag.id); setEditForm({ ...tag }); }} className="p-1.5 rounded hover:bg-blue/10 text-muted-foreground hover:text-blue mr-1"><Pencil size={13} /></button>
                                        <button onClick={() => handleDelete(tag.id)} className="p-1.5 rounded hover:bg-red/10 text-muted-foreground hover:text-red"><Trash2 size={13} /></button>
                                    </td>
                                </tr>
                            );
                        })}
                        {tags.length === 0 && (
                            <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-[0.8125rem]">No tags configured. Click "Add Tag" or import a CSV.</td></tr>
                        )}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}
