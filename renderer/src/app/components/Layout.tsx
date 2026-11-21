import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  Map,
  Grid3X3,
  PackagePlus,
  PackageMinus,
  Tags,
  Cog,
  FileText,
  Receipt,
  ScrollText,
  Settings,
  Bell,
  Search,
  User,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Warehouse,
  Check,
  Shield,
  Users,
  LogOut,
  Layers,
  Package,
  Minus,
  Square,
  ScanLine,
} from "lucide-react";
import { StatusIndicator } from "./StatusIndicator";
import { useWarehouse } from "../context/WarehouseContext";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard, module: "Dashboard" },
  { path: "/scan", label: "Scan Barcode", icon: ScanLine, module: "Scan Page Access" },
  { path: "/warehouse-map", label: "Warehouse Layout", icon: Map, module: "Racks" },
  { path: "/rack-monitoring", label: "Rack Monitoring", icon: Grid3X3, module: "Racks" },
  { path: "/inbound", label: "Inbound Inventory", icon: PackagePlus, module: "Inventory" },
  { path: "/outbound", label: "Outbound Inventory", icon: PackageMinus, module: "Inventory" },
  {
    id: "sku-management",
    path: "inventory-group",
    label: "SKU Management",
    icon: Tags,
    module: "Inventory",
    subItems: [
      { path: "/sku-management", label: "SKU Details", icon: Package },
      { path: "/categories", label: "Category Management", icon: Layers },
    ],
  },
  {
    path: "/conveyor-control", label: "Conveyor Control", icon: Cog, module: "Racks",
    id: "conveyor-group",
    subItems: [
      { path: "/conveyor-control", label: "Conveyor Control", icon: Cog },
      { path: "/plc-settings", label: "PLC Settings", icon: Settings },
      { path: "/plc-tags", label: "Tag Mapping", icon: Tags },
      { path: "/plc-room1", label: "Room 1 — Rack Control", icon: Grid3X3 },
      { path: "/plc-monitor", label: "PLC Monitor", icon: LayoutDashboard },
      { path: "/plc-logs", label: "PLC Logs", icon: ScrollText },
      { path: "/plc-room2", label: "Room 2 — Coming Soon", icon: Map },
    ],
  },
  { path: "/reports", label: "Reports", icon: FileText, module: "Reports" },
  { path: "/billing", label: "Billing", icon: Receipt, module: "Billing" },
  { path: "/system-logs", label: "System Logs", icon: ScrollText, module: "Admin" },
  { path: "/settings", label: "Settings", icon: Settings, module: "Admin", isStrictAdmin: true },
  {
    path: "/role-management",
    label: "Roles & Permissions",
    icon: Shield,
    module: "Admin",
    isStrictAdmin: true,
  },
  {
    path: "/user-management",
    label: "User Management",
    icon: Users,
    module: "Users",
    isStrictAdmin: true,
  },
];

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch, user, checkPermission, logout } = useWarehouse();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = state.notifications.filter((n) => !n.read).length;
  const conveyorStatus =
    state.conveyorState === "running"
      ? ("active" as const)
      : state.conveyorState === "emergency"
        ? ("offline" as const)
        : ("idle" as const);

  // Auto-expand menus based on current path
  useEffect(() => {
    const newOpenMenus = { ...openMenus };
    let changed = false;
    navItems.forEach((item) => {
      if (item.subItems) {
        if (item.subItems.some((sub) => location.pathname === sub.path)) {
          if (!newOpenMenus[item.id!]) {
            newOpenMenus[item.id!] = true;
            changed = true;
          }
        }
      }
    });
    if (changed) setOpenMenus(newOpenMenus);
  }, [location.pathname]);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotificationsOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchFocused(false);
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      )
        setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Search results
  const searchResults = state.searchQuery.trim()
    ? [
      ...state.skus
        .filter(
          (s) =>
            s.id.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            s.name.toLowerCase().includes(state.searchQuery.toLowerCase()),
        )
        .slice(0, 4)
        .map((s) => ({
          type: "SKU",
          label: `${s.id} — ${s.name}`,
          path: "/sku-management",
        })),
      ...state.racks
        .filter((r) =>
          r.label.toLowerCase().includes(state.searchQuery.toLowerCase()),
        )
        .slice(0, 3)
        .map((r) => ({
          type: "Rack",
          label: `${r.label} — ${r.zone === "shed1" ? "Shed 1" : r.zone === "shed2" ? "Shed 2" : "Cabin Room"}`,
          path: "/rack-monitoring",
        })),
      ...state.invoices
        .filter(
          (i) =>
            i.id.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            i.orderId.toLowerCase().includes(state.searchQuery.toLowerCase()),
        )
        .slice(0, 3)
        .map((i) => ({
          type: "Invoice",
          label: `${i.id} — ${i.orderId}`,
          path: "/billing",
        })),
    ]
    : [];

  const api = (window as any).electronAPI;

  return (
    <div className="flex flex-col w-screen overflow-hidden bg-background">
      <div className="app-drag-region flex-shrink-0 flex items-center w-full bg-sidebar border-b border-white/20" style={{ height: 32 }} >
        {/* ── Title Bar: 32px, full width ── */}
        {/* <div
        className="app-drag-region fixed top-0 left-0 w-full shrink-0 flex items-center bg-sidebar border-b border-white/20 z-400"
        style={{ height: 32 }}
      > */}
        {/* App label */}
        {/* <div className="app-no-drag flex items-center gap-2 px-3 select-none">
          <div className="p-[3px] rounded bg-blue/20 text-blue">
            <Warehouse size={12} />
          </div>
          <span className="text-[0.6875rem] text-foreground/60 tracking-wide">WSMS — Warehouse Management</span>
        </div> */}

        {/* Drag spacer */}
        <div className="flex-1 h-full" />

        {/* Window controls */}
        <div className="app-no-drag flex items-stretch h-full ">
          <button
            onClick={() => api?.windowMinimize()}
            title="Minimize"
            style={{ width: 46 }}
            className="flex items-center justify-center h-full text-[#94a3b8] hover:text-white hover:bg-white/20 transition-colors"
          >
            <Minus size={10} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => api?.windowMaximize()}
            title="Maximize"
            style={{ width: 46 }}
            className="flex items-center justify-center h-full text-[#94a3b8] hover:text-white hover:bg-white/20 transition-colors"
          >
            <Square size={9} strokeWidth={1.75} />
          </button>
          <button
            onClick={() => api?.windowClose()}
            title="Close"
            style={{ width: 46 }}
            className="flex items-center justify-center h-full text-[#94a3b8] hover:text-white hover:bg-[#e81123] transition-colors"
          >
            <X size={11} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ── App body ── */}
      <div className="flex flex-1 min-h-0 mt-10 overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-55 flex flex-col overflow-hidden
    border-r border-white/[0.06] bg-sidebar transition-transform duration-300
    h-screen lg:h-screen
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          {/* ── Header (fixed) ── */}
          <div className="flex-none flex items-center gap-2.5 px-4 h-14 border-b border-white/[0.06]">
            <div className="p-1.5 rounded-lg bg-blue/20 text-blue">
              <Warehouse size={15} />
            </div>
            <div>
              <p className="text-[0.8125rem] font-medium text-foreground leading-tight">
                WSMS
              </p>
              <p className="text-[0.625rem] text-muted-foreground leading-tight">
                Warehouse System
              </p>
            </div>
            <button
              className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Nav (scrollable) ── */}
          <nav className="flex-1 overflow-y-auto min-h-0 py-2 px-2 space-y-0.5">

            {navItems.map((item) => {
              // 1. Strict Restriction Check: Manager and Staff should NEVER see these
              if (item.isStrictAdmin && user?.role !== "ADMIN") return null;

              // 2. Permission Check: Check if user has view permission for the module
              if (item.module && !checkPermission(item.module, "canView")) return null;

              if (item?.subItems) {
                const isSubActive = item.subItems.some(
                  (sub) => location.pathname === sub.path
                );
                const isOpen = openMenus[item.id!];
                return (
                  <div key={item.id} className="w-full flex flex-col gap-0.5">
                    <button
                      onClick={() => toggleMenu(item.id!)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-[0.4375rem] rounded-md text-[0.8125rem] transition-colors ${isSubActive && !isOpen
                        ? "bg-blue/10 text-blue"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                        }`}
                    >
                      <item.icon size={16} className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {isOpen ? (
                        <ChevronDown size={12} className="ml-auto shrink-0 opacity-50" />
                      ) : (
                        <ChevronRight size={12} className="ml-auto shrink-0 opacity-50" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="flex flex-col gap-0.5 pl-[1.625rem] mt-0.5">
                        {item.subItems.map((subItem) => {
                          const subActive = location.pathname === subItem.path;
                          return (
                            <button
                              key={subItem.path}
                              onClick={() => {
                                navigate(subItem.path);
                                setSidebarOpen(false);
                                setRefreshKey(prev => prev + 1);
                              }}
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[0.8125rem] transition-colors ${subActive
                                ? "bg-blue/10 text-blue"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                                }`}
                            >
                              <subItem.icon size={13} className="shrink-0" />
                              <span className="truncate">{subItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path!);
                    setSidebarOpen(false);
                    setRefreshKey(prev => prev + 1);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-[0.4375rem] rounded-md text-[0.8125rem] transition-colors ${active
                    ? "bg-blue/10 text-blue"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                    }`}
                >
                  <item.icon size={16} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {active && (
                    <ChevronRight size={12} className="ml-auto shrink-0 opacity-60" />
                  )}
                </button>
              );
            })}

          </nav>

          {/* ── Footer / Status (fixed) ── */}
          <div className="flex-none px-4.5 py-3 border-t border-white/[0.06] space-y-2">
            <StatusIndicator status="online" label="PLC Connected" size="sm" />
            <StatusIndicator
              status={conveyorStatus}
              label={`Conveyor ${state.conveyorState === "running"
                ? "Active"
                : state.conveyorState === "emergency"
                  ? "E-STOP"
                  : "Stopped"
                }`}
              size="sm"
            />
            <StatusIndicator status="online" label="Scanner Online" size="sm" />
          </div>
        </aside>

        {/* Main content column */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-auto w-full lg:max-w-[calc(100%-220px)]" >
          {/* Navbar */}
          <header className="app-drag-region shrink-0 h-11 flex items-center px-4 border-b border-white/6 bg-sidebar/50 backdrop-blur-xl z-10">
            <button
              className="app-no-drag lg:hidden mr-3 text-muted-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>

            {/* Search */}
            <div
              ref={searchRef}
              className="app-no-drag relative flex items-center gap-2 flex-1 max-w-sm"
            >
              <Search
                size={14}
                className="text-muted-foreground shrink-0"
              />
              <input
                type="text"
                placeholder="Search SKU, rack, order..."
                value={state.searchQuery}
                onChange={(e) =>
                  dispatch({ type: "SET_SEARCH", payload: e.target.value })
                }
                onFocus={() => setSearchFocused(true)}
                className="bg-transparent border-none outline-none text-[0.8125rem] placeholder:text-muted-foreground/50 w-full"
              />
              {searchFocused && searchResults.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-full rounded-xl border border-white/6 bg-card shadow-2xl z-50 overflow-hidden">
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        navigate(r.path);
                        dispatch({ type: "SET_SEARCH", payload: "" });
                        setSearchFocused(false);
                        setRefreshKey(prev => prev + 1);
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-white/4 border-b border-white/4 last:border-0"
                    >
                      <span className="text-[0.6875rem] px-1.5 py-0.5 rounded bg-blue/15 text-blue">
                        {r.type}
                      </span>
                      <span className="text-[0.8125rem] text-foreground truncate">
                        {r.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right actions */}
            <div className="app-no-drag ml-auto flex items-center gap-1.5">
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green/10 text-green text-[0.6875rem] mr-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                System Online
              </div>

              {/* Notifications */}
              <div ref={notifRef} className="relative">
                <button
                  className="relative w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/6 transition-colors"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-red text-[0.5rem] text-white flex items-center justify-center leading-none">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-white/6 bg-card shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-white/6 flex items-center justify-between">
                      <p className="text-[0.8125rem] text-foreground">
                        Notifications
                      </p>
                      {state.notifications.length > 0 && (
                        <button
                          onClick={() =>
                            dispatch({ type: "CLEAR_NOTIFICATIONS" })
                          }
                          className="text-[0.6875rem] text-muted-foreground hover:text-foreground"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    {state.notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-[0.8125rem] text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {state.notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`px-3 py-2.5 border-b border-white/4 hover:bg-white/2 flex items-start gap-2 ${!n.read ? "bg-white/2" : ""
                              }`}
                          >
                            <span
                              className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.type === "warning"
                                ? "bg-yellow"
                                : n.type === "error"
                                  ? "bg-red"
                                  : n.type === "success"
                                    ? "bg-green"
                                    : "bg-blue"
                                }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[0.8125rem] text-foreground">
                                {n.text}
                              </p>
                              <p className="text-[0.6875rem] text-muted-foreground">
                                {n.time}
                              </p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              {!n.read && (
                                <button
                                  onClick={() =>
                                    dispatch({
                                      type: "MARK_NOTIFICATION_READ",
                                      payload: n.id,
                                    })
                                  }
                                  className="p-1 rounded hover:bg-white/6 text-muted-foreground hover:text-green"
                                  title="Mark read"
                                >
                                  <Check size={12} />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  dispatch({
                                    type: "DISMISS_NOTIFICATION",
                                    payload: n.id,
                                  })
                                }
                                className="p-1 rounded hover:bg-white/6 text-muted-foreground hover:text-red"
                                title="Dismiss"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User avatar */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-8 h-8 rounded-full bg-blue/20 flex items-center justify-center text-blue hover:bg-blue/30 transition-colors"
                >
                  <User size={14} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/6 bg-card shadow-2xl z-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/6 bg-white/2">
                      <p className="text-[0.8125rem] text-foreground font-medium truncate">
                        {user?.name}
                      </p>
                      <p className="text-[0.6875rem] text-muted-foreground truncate">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[0.625rem] font-medium bg-blue/15 text-blue">
                        {user?.role}
                      </span>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-2.5 text-[0.8125rem] text-muted-foreground hover:text-foreground hover:bg-white/4 transition-colors"
                      >
                        <User size={14} />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-2.5 text-[0.8125rem] text-red/80 hover:text-red hover:bg-red/5 transition-colors"
                      >
                        <LogOut size={14} />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <Outlet key={`${location.pathname}-${refreshKey}`} />
          </main>
        </div>
      </div>
    </div>
  );
}
