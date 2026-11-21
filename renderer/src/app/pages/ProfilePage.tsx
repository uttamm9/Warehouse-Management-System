import { useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { useWarehouse } from "../context/WarehouseContext";
import { User, Mail, Shield, Save, RefreshCw, Check, Key, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { api } from "../utils/api";

export function ProfilePage() {
  const { user, logout } = useWarehouse();

  // Profile form
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const roleBadge: Record<string, string> = {
    ADMIN: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    MANAGER: "bg-blue/15 text-blue border-blue/20",
    STAFF: "bg-cyan/15 text-cyan border-cyan/20",
  };

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    setSavingProfile(true);
    try {
      const result = await api.updateProfile({
        userId: user?.id,
        name: name.trim(),
        email: email.trim(),
      });
      if (result.success) {
        toast.success("Profile updated successfully");
        // Update will be reflected on next login or refresh
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      const result = await api.resetPassword({
        userId: user?.id,
        oldPassword,
        newPassword,
      });
      if (result.success) {
        toast.success("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.message || "Failed to change password");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSavingPassword(false);
    }
  }

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Title */}
      <div>
        <h1 className="text-foreground">My Profile</h1>
        <p className="text-[0.8125rem] text-muted-foreground">Manage your account information and security</p>
      </div>

      {/* Profile Card */}
      <GlassCard className="p-0 overflow-hidden">
        {/* Profile Header */}
        <div className="p-6 border-b border-white/[0.06] bg-gradient-to-r from-blue/5 to-purple-500/5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue/15 flex items-center justify-center text-blue">
            <User size={28} />
          </div>
          <div>
            <h2 className="text-foreground font-semibold text-lg">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[0.6875rem] font-medium border ${roleBadge[user?.role] || "bg-white/10 text-foreground border-white/10"}`}>
                {user?.role}
              </span>
              <span className="text-[0.75rem] text-muted-foreground">• Joined {joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleProfileSave} className="p-6 space-y-5">
          <div>
            <label className="text-[0.75rem] text-muted-foreground block mb-1.5 flex items-center gap-1.5">
              <User size={12} /> Full Name
            </label>
            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-[0.8125rem] text-foreground outline-none focus:border-blue transition-colors"
            />
          </div>

          <div>
            <label className="text-[0.75rem] text-muted-foreground block mb-1.5 flex items-center gap-1.5">
              <Mail size={12} /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-[0.8125rem] text-foreground outline-none focus:border-blue transition-colors"
            />
          </div>

          <div>
            <label className="text-[0.75rem] text-muted-foreground block mb-1.5 flex items-center gap-1.5">
              <Shield size={12} /> Role
            </label>
            <div className="w-full bg-black/20 border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-[0.8125rem] text-muted-foreground cursor-not-allowed">
              {user?.role} <span className="text-[0.6875rem]">(cannot be changed here)</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="px-5 py-2.5 bg-blue text-white rounded-lg hover:bg-blue/90 text-[0.8125rem] flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {savingProfile ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </GlassCard>

      {/* Change Password Card */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] bg-black/20 flex items-center gap-2">
          <Key size={16} className="text-yellow" />
          <h3 className="text-[0.875rem] font-medium text-foreground">Change Password</h3>
        </div>

        <form onSubmit={handlePasswordReset} className="p-6 space-y-5">
          <div className="relative">
            <label className="text-[0.75rem] text-muted-foreground block mb-1.5 flex items-center gap-1.5">
              <Lock size={12} /> Current Password
            </label>
            <input
              type={showOld ? "text" : "password"}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full bg-black/20 border border-white/[0.06] rounded-lg px-3.5 py-2.5 pr-10 text-[0.8125rem] text-foreground outline-none focus:border-blue transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-[2.1rem] text-muted-foreground hover:text-foreground"
            >
              {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <div className="relative">
            <label className="text-[0.75rem] text-muted-foreground block mb-1.5 flex items-center gap-1.5">
              <Lock size={12} /> New Password
            </label>
            <input
              type={showNew ? "text" : "password"}
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full bg-black/20 border border-white/[0.06] rounded-lg px-3.5 py-2.5 pr-10 text-[0.8125rem] text-foreground outline-none focus:border-blue transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-[2.1rem] text-muted-foreground hover:text-foreground"
            >
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <div>
            <label className="text-[0.75rem] text-muted-foreground block mb-1.5 flex items-center gap-1.5">
              <Check size={12} /> Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className={`w-full bg-black/20 border rounded-lg px-3.5 py-2.5 text-[0.8125rem] text-foreground outline-none transition-colors ${
                confirmPassword && confirmPassword !== newPassword
                  ? "border-red/50 focus:border-red"
                  : "border-white/[0.06] focus:border-blue"
              }`}
            />
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-[0.75rem] text-red mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={savingPassword || (!!confirmPassword && confirmPassword !== newPassword)}
            className="px-5 py-2.5 bg-yellow/90 text-black rounded-lg hover:bg-yellow text-[0.8125rem] flex items-center gap-2 transition-all disabled:opacity-50 font-medium"
          >
            {savingPassword ? <RefreshCw size={15} className="animate-spin" /> : <Key size={15} />}
            {savingPassword ? "Changing..." : "Change Password"}
          </button>
        </form>
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard className="p-5 border-red/20">
        <h3 className="text-[0.875rem] font-medium text-foreground mb-2">Session</h3>
        <p className="text-[0.8125rem] text-muted-foreground mb-4">
          Log out from this device. You will need to re-enter your credentials.
        </p>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red/15 text-red border border-red/20 rounded-lg hover:bg-red/25 text-[0.8125rem] transition-colors"
        >
          Log Out
        </button>
      </GlassCard>
    </div>
  );
}
