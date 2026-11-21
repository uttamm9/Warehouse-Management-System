import { useState, useEffect } from "react";
import { GlassCard } from "../components/GlassCard";
import { useWarehouse } from "../context/WarehouseContext";
import {
    Users, UserPlus, Pencil, Trash2, X, RefreshCw, AlertTriangle, Search, Check
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../utils/api";

interface UserRecord {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export function UserManagement() {
    const { user: currentUser, addLog } = useWarehouse();
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [roles, setRoles] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [formRole, setFormRole] = useState<string>("STAFF");
    const [submitting, setSubmitting] = useState(false);

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    async function fetchRoles() {
        try {
            const result = await api.getRoles();
            if (result.success) setRoles(result.roles);
        } catch {
            console.error('Failed to load roles');
        }
    }

    async function fetchUsers() {
        setLoading(true);
        try {
            const result = await api.getUsers();
            if (result.success) {
                setUsers(result.users);
            } else {
                toast.error(result.message || "Failed to load users");
            }
        } catch {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    }

    function openCreateForm() {
        setEditingUser(null);
        setFormName("");
        setFormEmail("");
        setFormPassword("");
        setFormRole("STAFF");
        setShowForm(true);
    }

    function openEditForm(u: UserRecord) {
        setEditingUser(u);
        setFormName(u.name);
        setFormEmail(u.email);
        setFormPassword("");
        setFormRole(u.role);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingUser(null);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingUser) {
                // Update user
                const result = await api.updateUser({
                    userId: editingUser.id,
                    name: formName,
                    role: formRole,
                    callerRole: currentUser?.role,
                });
                if (result.success) {
                    toast.success(`Updated user "${formName}"`);
                    addLog(currentUser?.name || "Admin", "Updated User", formName, `Role changed to ${formRole}`, "success");
                    closeForm();
                    fetchUsers();
                } else {
                    toast.error(result.message);
                }
            } else {
                // Create user
                const result = await api.createUser({
                    name: formName,
                    email: formEmail,
                    password: formPassword,
                    role: formRole,
                    callerRole: currentUser?.role,
                });
                if (result.success) {
                    toast.success(`Created user "${formName}"`);
                    addLog(currentUser?.name || "Admin", "Created User", formName, `New ${formRole} user created`, "success");
                    closeForm();
                    fetchUsers();
                } else {
                    toast.error(result.message);
                }
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        try {
            const result = await api.deleteUser({
                userId: deleteTarget.id,
                callerRole: currentUser?.role,
            });
            if (result.success) {
                toast.success(`Deleted user "${deleteTarget.name}"`);
                addLog(currentUser?.name || "Admin", "Deleted User", deleteTarget.name, "User removed from system", "warning");
                setDeleteTarget(null);
                fetchUsers();
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Failed to delete user");
        }
    }

    const filtered = users.filter((u) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q)
        );
    });

    const roleBadge: Record<string, string> = {
        ADMIN: "bg-purple-500/15 text-purple-400",
        MANAGER: "bg-blue/15 text-blue",
        STAFF: "bg-cyan/15 text-cyan",
    };

    // Access guard
    if (currentUser?.role !== "ADMIN") {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red/10 text-red flex items-center justify-center mb-2">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-xl text-foreground font-semibold">Access Denied</h2>
                <p className="text-muted-foreground max-w-sm">
                    Only administrators can manage users.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-foreground">User Management</h1>
                    <p className="text-[0.8125rem] text-muted-foreground">
                        {users.length} registered user{users.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={openCreateForm}
                    className="px-4 py-2.5 bg-blue text-white rounded-lg hover:bg-blue/90 text-[0.8125rem] flex items-center gap-2 transition-all w-fit"
                >
                    <UserPlus size={16} /> Add User
                </button>
            </div>

            {/* Search */}
            <GlassCard className="p-4 flex items-center gap-3">
                <Search size={16} className="text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by name, email, or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-[0.8125rem] text-foreground placeholder:text-muted-foreground/50 flex-1"
                />
                {search && (
                    <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground transition-colors" title="Clear search">
                        <X size={14} />
                    </button>
                )}
                <span className="text-[0.75rem] text-muted-foreground">{filtered.length} results</span>
            </GlassCard>

            {/* Users Table */}
            <GlassCard className="overflow-hidden">
                <div className="p-4 border-b border-white/[0.06] bg-black/20 flex items-center gap-2">
                    <Users size={16} className="text-blue" />
                    <h3 className="text-[0.875rem] font-medium text-foreground">System Users</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[0.8125rem]">
                        <thead>
                            <tr className="border-b border-white/[0.06] text-[0.75rem] text-muted-foreground bg-white/[0.02]">
                                <th className="py-3 px-6 font-medium">Name</th>
                                <th className="py-3 px-6 font-medium">Email</th>
                                <th className="py-3 px-6 font-medium">Role</th>
                                <th className="py-3 px-6 font-medium">Created</th>
                                <th className="py-3 px-6 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                                        <RefreshCw size={24} className="animate-spin mx-auto text-blue opacity-50" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((u) => (
                                    <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 px-6 text-foreground font-medium">{u.name}</td>
                                        <td className="py-4 px-6 text-muted-foreground">{u.email}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-[0.6875rem] font-medium ${roleBadge[u.role] || "bg-white/10 text-foreground"}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-muted-foreground">
                                            {new Date(u.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric", month: "short", day: "numeric",
                                            })}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => openEditForm(u)}
                                                    className="p-2 rounded-lg hover:bg-white/[0.06] text-muted-foreground hover:text-blue transition-colors"
                                                    title="Edit user"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(u)}
                                                    disabled={u.id === currentUser?.id}
                                                    className="p-2 rounded-lg hover:bg-red/10 text-muted-foreground hover:text-red transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                                                    title={u.id === currentUser?.id ? "Cannot delete yourself" : "Delete user"}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Create / Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-sidebar border border-white/[0.06] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                            <h3 className="text-foreground font-semibold text-[0.9375rem]">
                                {editingUser ? "Edit User" : "Create New User"}
                            </h3>
                            <button onClick={closeForm} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="text-[0.75rem] text-muted-foreground block mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    minLength={2}
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full bg-black/20 border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-[0.8125rem] text-foreground outline-none focus:border-blue transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-[0.75rem] text-muted-foreground block mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formEmail}
                                    onChange={(e) => setFormEmail(e.target.value)}
                                    disabled={!!editingUser}
                                    placeholder="user@warehouse.com"
                                    className="w-full bg-black/20 border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-[0.8125rem] text-foreground outline-none focus:border-blue transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                />
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="text-[0.75rem] text-muted-foreground block mb-1.5">Password</label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formPassword}
                                        onChange={(e) => setFormPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                        className="w-full bg-black/20 border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-[0.8125rem] text-foreground outline-none focus:border-blue transition-colors"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-[0.75rem] text-muted-foreground block mb-1.5">Role</label>
                                <select
                                    value={formRole}
                                    onChange={(e) => setFormRole(e.target.value)}
                                    className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-[0.8125rem] text-foreground outline-none focus:border-blue transition-colors cursor-pointer"
                                >
                                    {roles.map(r => (
                                        <option key={r.id} value={r.name}>{r.name}</option>
                                    ))}
                                    {roles.length === 0 && (
                                        <>
                                            <option value="ADMIN">Admin</option>
                                            <option value="MANAGER">Manager</option>
                                            <option value="STAFF">Staff</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="flex-1 py-2.5 rounded-lg border border-white/[0.06] text-muted-foreground hover:text-foreground text-[0.8125rem] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2.5 rounded-lg bg-blue text-white hover:bg-blue/90 text-[0.8125rem] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <RefreshCw size={15} className="animate-spin" />
                                    ) : (
                                        <Check size={15} />
                                    )}
                                    {editingUser ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-sidebar border border-white/[0.06] rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-red/10 text-red flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-foreground font-semibold text-[0.9375rem] mb-2">Delete User</h3>
                        <p className="text-muted-foreground text-[0.8125rem] mb-6">
                            Are you sure you want to delete <strong className="text-foreground">{deleteTarget.name}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 py-2.5 rounded-lg border border-white/[0.06] text-muted-foreground hover:text-foreground text-[0.8125rem] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2.5 rounded-lg bg-red text-white hover:bg-red/90 text-[0.8125rem] transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
