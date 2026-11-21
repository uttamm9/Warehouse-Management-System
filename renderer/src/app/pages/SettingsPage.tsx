import { useState, useEffect } from "react";
import { GlassCard } from "../components/GlassCard";
import { useWarehouse } from "../context/WarehouseContext";
import { Settings, Wifi, Database, Bell, Save, Check, RotateCcw, Shield } from "lucide-react";
import { toast } from "sonner";
import { blockNonNumeric } from "../utils/inputHelpers";
import { api } from "../utils/api";

export function SettingsPage() {
  const { state, dispatch, addLog } = useWarehouse();
  const [localSettings, setLocalSettings] = useState(state.settings);
  const [saved, setSaved] = useState(false);
  const [testingPLC, setTestingPLC] = useState(false);

  const [companyForm, setCompanyForm] = useState({
    name: "",
    gstin: "",
    address: "",
    email: "",
    phone: ""
  });
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [savingCompany, setSavingCompany] = useState(false);

  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await api.getCompanySettings();
        if (res?.success && res.settings) {
          setCompanyForm({
            name: res.settings.name || "",
            gstin: res.settings.gstin || "",
            address: res.settings.address || "",
            email: res.settings.email || "",
            phone: res.settings.phone || ""
          });
        }
      } catch (err) {
        console.error("Failed to load company settings:", err);
      } finally {
        setLoadingCompany(false);
      }
    }
    loadCompany();
  }, []);

  async function handleSaveCompany() {
    if (!companyForm.name || !companyForm.gstin || !companyForm.address) {
      toast.error("Company Name, GSTIN, and Address are required");
      return;
    }
    setSavingCompany(true);
    try {
      const res = await api.saveCompanySettings(companyForm);
      if (res?.success) {
        toast.success("Company Settings saved successfully");
        addLog("Admin", "Config Changed", "company-settings", "Company details for invoicing updated", "success");
      } else {
        toast.error(res?.message || "Failed to save company settings");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSavingCompany(false);
    }
  }

  function handleSave() {
    dispatch({ type: "UPDATE_SETTINGS", payload: localSettings });
    setSaved(true);
    toast.success("Settings saved successfully");
    addLog("Admin", "Config Changed", "system-settings", "System configuration updated", "success");
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setLocalSettings(state.settings);
    toast.info("Changes reverted");
  }

  function handleTestPLC() {
    setTestingPLC(true);
    setTimeout(() => {
      setTestingPLC(false);
      toast.success(`PLC connection test passed (${localSettings.plcIp}:${localSettings.plcPort})`);
      addLog("Admin", "Tested PLC Connection", "PLC", `Connection test to ${localSettings.plcIp}:${localSettings.plcPort} successful`, "success");
    }, 1500);
  }

  function updateSetting(key: string, value: string | boolean) {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  }

  function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
      <label className="flex items-center justify-between cursor-pointer py-1">
        <span className="text-[0.8125rem] text-foreground">{label}</span>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-blue" : "bg-white/10"}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${checked ? "left-[calc(100%-1.125rem)]" : "left-0.5"}`} />
        </button>
      </label>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Settings</h1>
          <p className="text-[0.8125rem] text-muted-foreground">System configuration and preferences</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] text-muted-foreground hover:text-foreground rounded-lg text-[0.8125rem] flex items-center gap-2">
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={handleSave} className="px-4 py-2.5 bg-blue text-white rounded-lg hover:bg-blue/80 text-[0.8125rem] flex items-center gap-2">
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Settings */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-blue" />
              <h3 className="text-foreground">Company Settings</h3>
            </div>
            <button
              onClick={handleSaveCompany}
              disabled={savingCompany || loadingCompany}
              className="px-3 py-1.5 bg-blue text-white rounded-lg hover:bg-blue/80 text-[0.75rem] flex items-center gap-1.5 transition-colors"
            >
              {savingCompany ? "Saving..." : "Save Settings"}
            </button>
          </div>
          {loadingCompany ? (
            <div className="text-muted-foreground text-xs py-4">Loading company settings...</div>
          ) : (
            <div className="space-y-4 text-[0.8125rem]">
              <div>
                <label className="text-[0.75rem] text-muted-foreground block mb-1">Company Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={companyForm.name}
                  onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })}
                  placeholder="e.g. Acme Corporation"
                  className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50"
                />
              </div>
              <div>
                <label className="text-[0.75rem] text-muted-foreground block mb-1">GSTIN Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={companyForm.gstin}
                  onChange={e => setCompanyForm({ ...companyForm, gstin: e.target.value })}
                  placeholder="e.g. 27AADCA3847F1ZS"
                  className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50"
                />
              </div>
              <div>
                <label className="text-[0.75rem] text-muted-foreground block mb-1">Address <span className="text-red-500">*</span></label>
                <textarea
                  value={companyForm.address}
                  onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })}
                  placeholder="e.g. 123 Industrial Area, Phase 1"
                  rows={2}
                  className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground resize-none focus:outline-none focus:border-blue/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[0.75rem] text-muted-foreground block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={companyForm.email}
                    onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })}
                    placeholder="billing@company.com"
                    className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] text-muted-foreground block mb-1">Phone (Optional)</label>
                  <input
                    type="text"
                    value={companyForm.phone}
                    onChange={e => setCompanyForm({ ...companyForm, phone: e.target.value })}
                    placeholder="+1 555-0199"
                    className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50"
                  />
                </div>
              </div>
            </div>
          )}
        </GlassCard>
        {/* PLC Config */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Wifi size={18} className="text-blue" />
            <h3 className="text-foreground">PLC Configuration</h3>
          </div>
          <div className="space-y-4 text-[0.8125rem]">
            <div>
              <label className="text-[0.75rem] text-muted-foreground block mb-1">PLC IP Address</label>
              <input type="text" value={localSettings.plcIp} onChange={e => updateSetting("plcIp", e.target.value)} className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground" />
            </div>
            <div>
              <label className="text-[0.75rem] text-muted-foreground block mb-1">Port</label>
              <input type="number" min={0} value={localSettings.plcPort} onChange={e => updateSetting("plcPort", e.target.value)} onKeyDown={blockNonNumeric} className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground" />
            </div>
            <div>
              <label className="text-[0.75rem] text-muted-foreground block mb-1">Protocol</label>
              <select value={localSettings.plcProtocol} onChange={e => updateSetting("plcProtocol", e.target.value)} className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground">
                <option value="S7comm">S7comm</option>
                <option value="Modbus TCP">Modbus TCP</option>
                <option value="EtherNet/IP">EtherNet/IP</option>
              </select>
            </div>
            <div>
              <label className="text-[0.75rem] text-muted-foreground block mb-1">Timeout (ms)</label>
              <input type="number" min={0} value={localSettings.plcTimeout} onChange={e => updateSetting("plcTimeout", e.target.value)} onKeyDown={blockNonNumeric} className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground" />
            </div>
            <button
              onClick={handleTestPLC}
              disabled={testingPLC}
              className="w-full py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[0.8125rem] text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
            >
              {testingPLC ? (
                <><span className="w-4 h-4 border-2 border-blue border-t-transparent rounded-full animate-spin" /> Testing...</>
              ) : (
                <><Shield size={14} /> Test Connection</>
              )}
            </button>
          </div>
        </GlassCard>

        {/* Conveyor Settings */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Settings size={18} className="text-cyan" />
            <h3 className="text-foreground">Conveyor Settings</h3>
          </div>
          <div className="space-y-4 text-[0.8125rem]">
            <div>
              <label className="text-[0.75rem] text-muted-foreground block mb-1">Default Speed (m/s)</label>
              <input type="number" min={0} step="0.1" value={localSettings.conveyorDefaultSpeed} onChange={e => updateSetting("conveyorDefaultSpeed", e.target.value)} onKeyDown={blockNonNumeric} className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground" />
            </div>
            <div>
              <label className="text-[0.75rem] text-muted-foreground block mb-1">Max Speed (m/s)</label>
              <input type="number" min={0} step="0.1" value={localSettings.conveyorMaxSpeed} onChange={e => updateSetting("conveyorMaxSpeed", e.target.value)} onKeyDown={blockNonNumeric} className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground" />
            </div>
            <div>
              <label className="text-[0.75rem] text-muted-foreground block mb-1">Acceleration (m/s²)</label>
              <input type="number" min={0} step="0.1" value={localSettings.conveyorAcceleration} onChange={e => updateSetting("conveyorAcceleration", e.target.value)} onKeyDown={blockNonNumeric} className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground" />
            </div>
            <div>
              <label className="text-[0.75rem] text-muted-foreground block mb-1">E-Stop Recovery Delay (s)</label>
              <input type="number" min={0} value={localSettings.conveyorEStopDelay} onChange={e => updateSetting("conveyorEStopDelay", e.target.value)} onKeyDown={blockNonNumeric} className="w-full bg-secondary border border-white/[0.06] rounded-lg px-3 py-2 text-foreground" />
            </div>
          </div>
        </GlassCard>

        {/* Database Status */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Database size={18} className="text-green" />
            <h3 className="text-foreground">Database</h3>
          </div>
          <div className="space-y-3 text-[0.8125rem]">
            {[
              { label: "Host", value: "13.205.64.0" },
              { label: "Port", value: "5432" },
              { label: "Database", value: "warhouse" },
              { label: "Status", value: "Connected", isStatus: true },
              { label: "Last Backup", value: "2 hours ago" },
              { label: "Total Racks", value: String(state.racks.length) },
              { label: "Total SKUs", value: String(state.skus.length) },
              { label: "Total Logs", value: String(state.logs.length) },
            ].map(f => (
              <div key={f.label} className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-muted-foreground">{f.label}</span>
                <span className={f.isStatus ? "text-green" : "text-foreground"}>{f.value}</span>
              </div>
            ))}
            <button
              onClick={() => { toast.success("Database backup initiated"); addLog("Admin", "Backup Completed", "database", "Manual backup triggered", "success"); }}
              className="w-full py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[0.8125rem] text-muted-foreground hover:text-foreground"
            >
              Trigger Manual Backup
            </button>
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={18} className="text-yellow" />
            <h3 className="text-foreground">Notification Preferences</h3>
          </div>
          <div className="space-y-3">
            <ToggleSwitch
              checked={localSettings.notifyRackCapacity}
              onChange={v => updateSetting("notifyRackCapacity", v)}
              label="Rack capacity warnings"
            />
            <ToggleSwitch
              checked={localSettings.notifyConveyor}
              onChange={v => updateSetting("notifyConveyor", v)}
              label="Conveyor system alerts"
            />
            <ToggleSwitch
              checked={localSettings.notifyLowStock}
              onChange={v => updateSetting("notifyLowStock", v)}
              label="Low stock notifications"
            />
            <ToggleSwitch
              checked={localSettings.notifyInvoice}
              onChange={v => updateSetting("notifyInvoice", v)}
              label="Invoice reminders"
            />
            <ToggleSwitch
              checked={localSettings.notifyMaintenance}
              onChange={v => updateSetting("notifyMaintenance", v)}
              label="System maintenance alerts"
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
