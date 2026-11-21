import { useState, useEffect } from "react";
import { GlassCard } from "../components/GlassCard";
import { useWarehouse } from "../context/WarehouseContext";
import { Shield, Save, Check, RefreshCw, AlertTriangle, Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "../utils/api";

export function RoleManagement() {
    const { user, addLog, refreshPermissions } = useWarehouse();
    
    // Roles state
    const [roles, setRoles] = useState<{id: string, name: string}[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>("");
    
    // Modals state
    const [showRoleModal, setShowRoleModal] = useState<"CREATE" | "EDIT" | null>(null);
    const [roleInputName, setRoleInputName] = useState("");
    const [roleActionLoading, setRoleActionLoading] = useState(false);
    
    // Permissions state
    const [permissions, setPermissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        if (selectedRole) {
            fetchPermissions();
        }
    }, [selectedRole]);

    async function fetchRoles() {
        try {
            const res = await api.getRoles();
            if (res.success) {
                setRoles(res.roles);
                if (!selectedRole && res.roles.length > 0) {
                    const defaultRole = res.roles.find((r: any) => r.name === 'ADMIN') || res.roles[0];
                    setSelectedRole(defaultRole.name);
                }
            } else {
                toast.error("Failed to load roles");
            }
        } catch (err) {
            toast.error("Error loading roles");
        }
    }

    async function fetchPermissions() {
        setLoading(true);
        try {
            const data = await api.getPermissions(selectedRole);
            setPermissions(data || []);
        } catch (err) {
            toast.error("Failed to load permissions");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateRole() {
        if (!roleInputName.trim()) return toast.error("Role name is required");
        setRoleActionLoading(true);
        try {
            const res = await api.createRole({ name: roleInputName, callerRole: user?.role as string });
            if (res.success) {
                toast.success("Role created successfully");
                addLog(user?.name || "Admin", "Create Role", "Role Management", `Created role ${roleInputName}`, "success");
                await fetchRoles();
                setSelectedRole(res.role.name);
                setShowRoleModal(null);
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error("Failed to create role");
        } finally {
            setRoleActionLoading(false);
        }
    }

    async function handleUpdateRole() {
        if (!roleInputName.trim()) return toast.error("Role name is required");
        const roleToEdit = roles.find(r => r.name === selectedRole);
        if (!roleToEdit) return;

        setRoleActionLoading(true);
        try {
            const res = await api.updateRole({ roleId: roleToEdit.id, name: roleInputName, callerRole: user?.role as string });
            if (res.success) {
                toast.success("Role updated successfully");
                addLog(user?.name || "Admin", "Update Role", "Role Management", `Renamed role to ${roleInputName}`, "success");
                await fetchRoles();
                setSelectedRole(res.role.name);
                setShowRoleModal(null);
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error("Failed to update role");
        } finally {
            setRoleActionLoading(false);
        }
    }

    async function handleDeleteRole() {
        const roleToDelete = roles.find(r => r.name === selectedRole);
        if (!roleToDelete) return;
        
        if (!window.confirm(`Are you sure you want to delete the ${selectedRole} role? This action cannot be undone.`)) return;

        setRoleActionLoading(true);
        try {
            const res = await api.deleteRole({ roleId: roleToDelete.id, callerRole: user?.role as string });
            if (res.success) {
                toast.success("Role deleted successfully");
                addLog(user?.name || "Admin", "Delete Role", "Role Management", `Deleted role ${selectedRole}`, "warning");
                setSelectedRole("");
                await fetchRoles();
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error("Failed to delete role");
        } finally {
            setRoleActionLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            const result = await api.updatePermissions(permissions);
            if (result.success) {
                toast.success(`Updated permissions for ${selectedRole}`);
                addLog(user?.name || "Admin", "Update RBAC", "Role Management", `Modified permissions for ${selectedRole}`, "success");
                // Refresh current user's permissions so changes are live
                await refreshPermissions();
            } else {
                toast.error(result.message || "Failed to update permissions");
            }
        } catch (err) {
            toast.error("Error occurred while saving permissions.");
        } finally {
            setTimeout(() => setSaving(false), 500);
        }
    }

    function handleToggle(id: string, field: "canView" | "canCreate" | "canEdit" | "canDelete", value: boolean) {
        setPermissions(prev => prev.map(p => {
            if (p.id === id) {
                const next = { ...p, [field]: value };
                // Logic constraint: If view is disabled, others must be disabled
                if (field === "canView" && !value) {
                    next.canCreate = false;
                    next.canEdit = false;
                    next.canDelete = false;
                }
                // Logic constraint: If any action is enabled, view must be enabled
                if ((field === "canCreate" || field === "canEdit" || field === "canDelete") && value) {
                    next.canView = true;
                }
                return next;
            }
            return p;
        }));
    }

    if (user?.role !== "ADMIN") {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red/10 text-red flex items-center justify-center mb-2">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-xl text-foreground font-semibold">Access Denied</h2>
                <p className="text-muted-foreground max-w-sm">
                    You do not have the required administrative privileges to view or modify role-based access controls.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-foreground">Role & Permission Management</h1>
                    <p className="text-[0.8125rem] text-muted-foreground">Configure module access levels for internal roles</p>
                </div>
                <div className="flex flex-wrap gap-2 relative items-center">
                    <div className="relative">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="appearance-none bg-secondary border border-white/[0.06] text-foreground text-[0.8125rem] rounded-lg pl-4 pr-10 py-2.5 outline-none cursor-pointer min-w-[150px]"
                        >
                            {roles.map(r => (
                                <option key={r.id} value={r.name}>{r.name} Role</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                            <Shield size={14} />
                        </div>
                    </div>
                    
                    <div className="flex gap-1 ml-1 mr-4 border-r border-white/10 pr-4">
                        <button
                            onClick={() => { setRoleInputName(""); setShowRoleModal("CREATE"); }}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                            title="Create New Role"
                        >
                            <Plus size={16} />
                        </button>
                        <button
                            onClick={() => { setRoleInputName(selectedRole); setShowRoleModal("EDIT"); }}
                            disabled={selectedRole === 'ADMIN'}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-blue transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={selectedRole === 'ADMIN' ? "Admin role cannot be renamed" : "Rename Role"}
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={handleDeleteRole}
                            disabled={selectedRole === 'ADMIN'}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={selectedRole === 'ADMIN' ? "Admin role cannot be deleted" : "Delete Role"}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving || loading || !selectedRole}
                        className="px-4 py-2.5 bg-blue text-white rounded-lg hover:bg-blue/90 text-[0.8125rem] flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="p-4 border-b border-white/[0.06] bg-black/20 flex items-center gap-2">
                    <Shield size={16} className="text-purple-400" />
                    <h3 className="text-[0.875rem] font-medium text-foreground">Global Access Matrix: {selectedRole}</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.06] text-[0.75rem] text-muted-foreground bg-white/[0.02]">
                                <th className="py-3 px-6 font-medium">Module Name</th>
                                <th className="py-3 px-6 text-center font-medium">View</th>
                                <th className="py-3 px-6 text-center font-medium">Create</th>
                                <th className="py-3 px-6 text-center font-medium">Edit</th>
                                <th className="py-3 px-6 text-center font-medium">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="text-[0.8125rem]">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                                        <RefreshCw size={24} className="animate-spin mx-auto text-blue opacity-50" />
                                    </td>
                                </tr>
                            ) : permissions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                                        No permissions found for this role.
                                    </td>
                                </tr>
                            ) : (
                                permissions.map((p) => (
                                    <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 px-6 text-foreground font-medium">
                                            {p.module.name}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <CheckboxToggle
                                                checked={p.canView}
                                                onChange={(v) => handleToggle(p.id, "canView", v)}
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <CheckboxToggle
                                                checked={p.canCreate}
                                                onChange={(v) => handleToggle(p.id, "canCreate", v)}
                                                disabled={!p.canView}
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <CheckboxToggle
                                                checked={p.canEdit}
                                                onChange={(v) => handleToggle(p.id, "canEdit", v)}
                                                disabled={!p.canView}
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <CheckboxToggle
                                                checked={p.canDelete}
                                                onChange={(v) => handleToggle(p.id, "canDelete", v)}
                                                disabled={!p.canView}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Role Create/Edit Modal */}
            {showRoleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-sidebar border border-white/[0.06] rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                            <h3 className="text-foreground font-semibold text-[0.9375rem]">
                                {showRoleModal === "CREATE" ? "Create New Role" : "Rename Role"}
                            </h3>
                            <button onClick={() => setShowRoleModal(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="text-[0.75rem] text-muted-foreground block mb-1.5">Role Name</label>
                                <input
                                    type="text"
                                    value={roleInputName}
                                    onChange={(e) => setRoleInputName(e.target.value.toUpperCase())}
                                    placeholder="e.g. SUPERVISOR"
                                    className="w-full bg-black/20 border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-[0.8125rem] text-foreground outline-none focus:border-blue transition-colors uppercase"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRoleModal(null)}
                                    className="flex-1 py-2.5 rounded-lg border border-white/[0.06] text-muted-foreground hover:text-foreground text-[0.8125rem] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={showRoleModal === "CREATE" ? handleCreateRole : handleUpdateRole}
                                    disabled={roleActionLoading || !roleInputName.trim()}
                                    className="flex-1 py-2.5 rounded-lg bg-blue text-white hover:bg-blue/90 text-[0.8125rem] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {roleActionLoading ? <RefreshCw size={15} className="animate-spin" /> : <Check size={15} />}
                                    {showRoleModal === "CREATE" ? "Create" : "Update"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple internal component for custom checkbox toggle look
function CheckboxToggle({ checked, onChange, disabled = false }: { checked: boolean, onChange: (v: boolean) => void, disabled?: boolean }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`mx-auto w-5 h-5 rounded border flex items-center justify-center transition-all ${disabled ? 'opacity-30 cursor-not-allowed border-white/10 bg-transparent' :
                checked ? 'bg-blue border-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-transparent border-white/20 hover:border-white/40'
                }`}
        >
            {checked && <Check size={14} strokeWidth={3} />}
        </button>
    );
}
