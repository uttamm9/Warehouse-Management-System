import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
} from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import {
  generateRacks,
  generateSKUs,
  generateInvoices,
  generateLogs,
  type Rack,
  type SKU,
  type Invoice,
  type LogEntry,
  type Notification,
  type ConveyorState,
  type Level,
} from "../data/mockData";

// ==================
// State Shape
// ==================

interface WarehouseState {
  racks: Rack[];
  skus: SKU[];
  invoices: Invoice[];
  logs: LogEntry[];
  notifications: Notification[];
  conveyorState: ConveyorState;
  conveyorSpeed: number;
  conveyorDestRack: number;
  conveyorDestLevel: number;
  searchQuery: string;
  settings: {
    plcIp: string;
    plcPort: string;
    plcProtocol: string;
    plcTimeout: string;
    conveyorDefaultSpeed: string;
    conveyorMaxSpeed: string;
    conveyorAcceleration: string;
    conveyorEStopDelay: string;
    notifyRackCapacity: boolean;
    notifyConveyor: boolean;
    notifyLowStock: boolean;
    notifyInvoice: boolean;
    notifyMaintenance: boolean;
  };
}

// ==================
// Actions
// ==================

type Action =
  | { type: "ADD_SKU"; payload: SKU }
  | { type: "UPDATE_SKU"; payload: SKU }
  | { type: "DELETE_SKU"; payload: string }
  | { type: "ADD_INVOICE"; payload: Invoice }
  | { type: "MARK_INVOICE_PAID"; payload: string }
  | { type: "ADD_LOG"; payload: LogEntry }
  | {
    type: "UPDATE_RACK_LEVEL";
    payload: { rackId: number; levelNum: number; level: Partial<Level> };
  }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "DISMISS_NOTIFICATION"; payload: number }
  | { type: "MARK_NOTIFICATION_READ"; payload: number }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "SET_CONVEYOR_STATE"; payload: ConveyorState }
  | { type: "SET_CONVEYOR_SPEED"; payload: number }
  | { type: "SET_CONVEYOR_DEST"; payload: { rack: number; level: number } }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "UPDATE_SETTINGS"; payload: Partial<WarehouseState["settings"]> }
  | { type: "SET_RACKS"; payload: Rack[] }
  | {
    type: "PLACE_ITEM";
    payload: {
      rackId: number;
      levelNum: number;
      sku: string;
      productName: string;
      quantity: number;
      weight: number;
    };
  }
  | {
    type: "REMOVE_ITEM";
    payload: { rackId: number; levelNum: number; quantity: number };
  };

function reducer(state: WarehouseState, action: Action): WarehouseState {
  switch (action.type) {
    case "ADD_SKU":
      return { ...state, skus: [...state.skus, action.payload] };
    case "UPDATE_SKU":
      return {
        ...state,
        skus: state.skus.map((s) =>
          s.id === action.payload.id ? action.payload : s,
        ),
      };
    case "DELETE_SKU":
      return {
        ...state,
        skus: state.skus.filter((s) => s.id !== action.payload),
      };
    case "ADD_INVOICE":
      return { ...state, invoices: [action.payload, ...state.invoices] };
    case "MARK_INVOICE_PAID":
      return {
        ...state,
        invoices: state.invoices.map((i) =>
          i.id === action.payload ? { ...i, status: "paid" as const } : i,
        ),
      };

    case "ADD_LOG":
      return { ...state, logs: [action.payload, ...state.logs] };

    case "SET_RACKS":
      return { ...state, racks: action.payload };

    case "UPDATE_RACK_LEVEL":
      return {
        ...state,
        racks: state.racks.map((r) =>
          r.id === action.payload.rackId
            ? {
              ...r,
              levels: r.levels.map((l) =>
                l.level === action.payload.levelNum
                  ? { ...l, ...action.payload.level }
                  : l,
              ),
            }
            : r,
        ),
      };

    case "PLACE_ITEM": {
      const { rackId, levelNum, sku, productName, quantity, weight } =
        action.payload;
      return {
        ...state,
        racks: state.racks.map((r) =>
          r.id === rackId
            ? {
              ...r,
              levels: r.levels.map((l) => {
                if (l.level !== levelNum) return l;
                const newWeight = l.weight + weight;
                const newQty = l.quantity + quantity;
                const status = newQty > 0 ? ("full" as const) : ("empty" as const);
                return {
                  ...l,
                  sku,
                  productName,
                  quantity: newQty,
                  weight: Math.min(newWeight, l.maxCapacity),
                  status,
                };
              }),
            }
            : r,
        ),
      };
    }

    case "REMOVE_ITEM": {
      const { rackId, levelNum, quantity } = action.payload;
      return {
        ...state,
        racks: state.racks.map((r) =>
          r.id === rackId
            ? {
              ...r,
              levels: r.levels.map((l) => {
                if (l.level !== levelNum) return l;
                const newQty = Math.max(0, l.quantity - quantity);
                if (newQty <= 0) {
                  return {
                    ...l,
                    sku: null,
                    productName: null,
                    quantity: 0,
                    weight: 0,
                    status: "empty" as const,
                  };
                }
                const weightRatio = newQty / (l.quantity || 1);
                const newWeight = Math.round(l.weight * weightRatio);
                const status =
                  newWeight > 0 ? ("full" as const) : ("empty" as const);
                return { ...l, quantity: newQty, weight: newWeight, status };
              }),
            }
            : r,
        ),
      };
    }

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case "DISMISS_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload,
        ),
      };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n,
        ),
      };
    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: [] };

    case "SET_CONVEYOR_STATE":
      return { ...state, conveyorState: action.payload };
    case "SET_CONVEYOR_SPEED":
      return { ...state, conveyorSpeed: action.payload };
    case "SET_CONVEYOR_DEST":
      return {
        ...state,
        conveyorDestRack: action.payload.rack,
        conveyorDestLevel: action.payload.level,
      };

    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };

    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };

    default:
      return state;
  }
}

// ==================
// Initial State
// ==================

const initialSKUs = generateSKUs();
const initialRacks = generateRacks();

const initialState: WarehouseState = {
  racks: initialRacks,
  skus: initialSKUs,
  invoices: generateInvoices(initialSKUs),
  logs: generateLogs(),
  notifications: [
    {
      id: 1,
      text: "Rack R15 at 96% capacity",
      type: "warning",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      text: "Conveyor Belt A maintenance due in 3 days",
      type: "info",
      time: "1 hr ago",
      read: false,
    },
    {
      id: 3,
      text: "SKU-1003 below reorder threshold",
      type: "warning",
      time: "2 hr ago",
      read: false,
    },
    {
      id: 4,
      text: "System backup completed successfully",
      type: "success",
      time: "4 hr ago",
      read: true,
    },
  ],
  conveyorState: "running",
  conveyorSpeed: 1.2,
  conveyorDestRack: 7,
  conveyorDestLevel: 3,
  searchQuery: "",
  settings: {
    plcIp: "192.168.1.100",
    plcPort: "102",
    plcProtocol: "S7comm",
    plcTimeout: "5000",
    conveyorDefaultSpeed: "1.2",
    conveyorMaxSpeed: "2.5",
    conveyorAcceleration: "0.5",
    conveyorEStopDelay: "10",
    notifyRackCapacity: true,
    notifyConveyor: true,
    notifyLowStock: true,
    notifyInvoice: false,
    notifyMaintenance: true,
  },
};

// ==================
// Context
// ==================

interface WarehouseContextType {
  state: WarehouseState;
  dispatch: Dispatch<Action>;
  addLog: (
    user: string,
    action: string,
    item: string,
    details: string,
    status: LogEntry["status"],
  ) => void;
  addLogToAPI: (
    user: string,
    action: string,
    item: string,
    details: string,
    status: LogEntry["status"],
  ) => Promise<void>;
  addNotification: (text: string, type: Notification["type"]) => void;
  user: any;
  permissions: any[];
  checkPermission: (
    moduleName: string,
    action: "canView" | "canCreate" | "canEdit" | "canDelete",
  ) => boolean;
  refreshPermissions: () => Promise<void>;
  fetchRacks: () => Promise<void>;
  logout: () => void;
}

const WarehouseContext = createContext<WarehouseContextType | null>(null);

export function WarehouseProvider({
  children,
  user,
  permissions: initialPermissions,
  onLogout,
}: {
  children: ReactNode;
  user: any;
  permissions: any[];
  onLogout: () => void;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [permissions, setPermissions] = useState<any[]>(initialPermissions);

  // Live-refresh permissions from DB (not cached from login)
  const refreshPermissions = useCallback(async () => {
    if (!user?.role) return;
    try {
      const { api } = await import("../utils/api");
      const fresh = await api.getPermissions(user.role);
      if (Array.isArray(fresh)) {
        setPermissions(fresh);
        console.log(
          `%c[RBAC] %cPermissions refreshed for ${user.role} — ${fresh.length} modules`,
          "color: #a78bfa; font-weight: bold",
          "color: #34d399",
        );
      }
    } catch (err) {
      console.error("[RBAC] Failed to refresh permissions:", err);
    }
  }, [user?.role]);

  // Auto-refresh permissions every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshPermissions, 30_000);
    return () => clearInterval(interval);
  }, [refreshPermissions]);

  // Load Real Data from DB
  // Load Real Data from DB
  const fetchRacks = useCallback(async () => {
    try {
      if (!(window as any).electronAPI) return;
      const res = await (window as any).electronAPI.getRackMonitoring();
      console.log("[DB] Fetched Rack Data:", res);
      if (res?.success && res.data) {
        const formattedRacks: Rack[] = [];
        let idCounter = 1;
        res.data.forEach((roomGrp: any) => {
          roomGrp.racks.forEach((rack: any) => {
            const formattedLevels = rack.shelves.map((shelf: any) => {
              const levelNum =
                shelf.level === "A"
                  ? 1
                  : shelf.level === "B"
                    ? 2
                    : shelf.level === "C"
                      ? 3
                      : 4;
              const mainSku = shelf.skus && shelf.skus.length > 0 && shelf.skus[0].quantity > 0 ? shelf.skus[0] : null;
              const hasInventory = (mainSku && mainSku.quantity > 0) || shelf.usedWeight > 0 || shelf.usedVolume > 0;
              const status = hasInventory ? "full" : "empty";

              return {
                level: levelNum,
                maxCapacity: shelf.maxWeight,
                weight: shelf.usedWeight,
                status: status,
                quantity: mainSku ? mainSku.quantity : 0,
                sku: mainSku ? mainSku.skuCode : null,
                productName: mainSku ? mainSku.productName : null,
              };
            });

            // 45 racks total.
            // Shed 1: 1-20 -> Cols A,B,C,D; Rows 1-5
            // Shed 2: 21-40 -> Cols E,F,G,H; Rows 1-5
            // Cabin: 41-45 -> Col I; Rows 1-5

            let gridId = "";
            let gridCol = "";
            let gridRow = 1;

            if (idCounter <= 20) {
              const cols = ["A", "B", "C", "D"];
              const zeroIndexed = idCounter - 1;
              gridCol = cols[Math.floor(zeroIndexed / 5)];
              gridRow = (zeroIndexed % 5) + 1;
            } else if (idCounter <= 40) {
              const cols = ["E", "F", "G", "H"];
              const zeroIndexed = idCounter - 21;
              gridCol = cols[Math.floor(zeroIndexed / 5)];
              gridRow = (zeroIndexed % 5) + 1;
            } else {
              gridCol = "I";
              const zeroIndexed = idCounter - 41;
              gridRow = (zeroIndexed % 5) + 1;
            }
            gridId = `${gridCol}${gridRow}`;

            formattedRacks.push({
              id: idCounter,
              gridId,
              gridCol,
              gridRow,
              label: rack.rackName,
              type: rack.rackName.endsWith("R1") || rack.rackName.endsWith("-1") ? "main" : "addon",
              zone: roomGrp.room === "Room1" ? "shed1" : roomGrp.room === "Cabin" ? "cabin" : "shed2",
              levels: formattedLevels,
              height: roomGrp.room === "Cabin" ? 2500 : 2400,
              length: roomGrp.room === "Cabin" ? 900 : 1500,
              depth: 450,
            });

            idCounter++;
          });
        });
        dispatch({ type: "SET_RACKS", payload: formattedRacks });
        console.log("[DB] Synchronized Racks from PostgeSQL Database!");
      }
    } catch (e) {
      console.error("[DB Sync Error]", e);
    }
  }, []);

  useEffect(() => {
    fetchRacks();
  }, [fetchRacks]);

  const API_SERVER = "http://localhost:3001"

  // Global socket listener for real-time inventory updates
  useEffect(() => {
    const socket = io(API_SERVER);

    socket.on('connect', () => {
      console.log('[WarehouseContext] Connected to realtime events');
    });

    socket.on('inward_update', (data) => {
      toast.success(`Realtime: ${data.quantity} units of ${data.skuCode} placed at ${data.rackName}-${data.shelfLevel}`);
      fetchRacks(); // Automatically refresh racks when inward occurs!
    });

    socket.on('outward_update', (data) => {
      toast.success(`Realtime: ${data.quantity} units of ${data.skuCode} dispatched from ${data.rackLocation}`);
      fetchRacks(); // Automatically refresh racks when outward occurs!
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchRacks]);

  // Also sync when initialPermissions prop changes
  useEffect(() => {
    setPermissions(initialPermissions);
  }, [initialPermissions]);

  const checkPermission = useCallback(
    (
      moduleName: string,
      action: "canView" | "canCreate" | "canEdit" | "canDelete",
    ) => {
      if (user?.role === "ADMIN") {
        console.log(
          `%c[RBAC] %c✓ ADMIN override %c→ ${moduleName}.${action}`,
          "color: #a78bfa; font-weight: bold",
          "color: #34d399",
          "color: #94a3b8",
        );
        return true;
      }

      // Map the old module check names to new granular modules
      let mappedNames: string[] = [moduleName];
      if (moduleName === "Scan Page Access") {
        mappedNames = ["Scan Barcode"];
      } else if (moduleName === "Inventory") {
        if (action === "canView") {
          mappedNames = ["SKU Management", "Inbound Inventory", "Outbound Inventory"];
        } else {
          mappedNames = ["SKU Management"];
        }
      } else if (moduleName === "Racks") {
        mappedNames = ["Warehouse Layout", "Rack Monitoring", "Conveyor Control"];
      } else if (moduleName === "Reports") {
        mappedNames = ["Reports", "System Logs"];
      } else if (moduleName === "Admin") {
        mappedNames = ["Settings", "Roles & Permissions", "System Logs"];
      } else if (moduleName === "Users") {
        mappedNames = ["User Management"];
      }

      // Check if permission is allowed for any of the mapped modules
      const allowed = mappedNames.some((name) => {
        const perm = permissions.find((p: any) => p.module?.name === name);
        return perm ? !!perm[action] : false;
      });

      console.log(
        `%c[RBAC] %c${allowed ? "✓" : "✗"} ${user?.role} %c→ ${moduleName} [mapped: ${mappedNames.join(", ")}].${action} = ${allowed}`,
        "color: #a78bfa; font-weight: bold",
        allowed ? "color: #34d399" : "color: #f87171",
        "color: #94a3b8",
      );
      return allowed;
    },
    [permissions, user],
  );

  const addLog = useCallback(
    (
      user: string,
      action: string,
      item: string,
      details: string,
      status: LogEntry["status"],
    ) => {
      dispatch({
        type: "ADD_LOG",
        payload: {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user,
          action,
          item,
          details,
          status,
        },
      });
    },
    [],
  );

  const addLogToAPI = useCallback(
    async (
      logUser: string,
      action: string,
      item: string,
      details: string,
      status: LogEntry["status"],
    ) => {
      try {
        const response = await fetch(`${API_SERVER}/logs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': user?.role || 'UNKNOWN'
          },
          body: JSON.stringify({
            user: logUser,
            action,
            item,
            details,
            status,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to log to API');
        }

        console.log('[WarehouseContext] Log sent to API:', { user, action, item });
      } catch (err) {
        console.error('[WarehouseContext] Error logging to API:', err);
      }
    },
    [],
  );

  const addNotification = useCallback(
    (text: string, type: Notification["type"]) => {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: { id: Date.now(), text, type, time: "Just now", read: false },
      });
    },
    [],
  );

  return (
    <WarehouseContext.Provider
      value={{
        state,
        dispatch,
        addLog,
        addLogToAPI,
        addNotification,
        user,
        permissions,
        checkPermission,
        refreshPermissions,
        fetchRacks,
        logout: onLogout,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  const ctx = useContext(WarehouseContext);
  if (!ctx)
    throw new Error("useWarehouse must be used within WarehouseProvider");
  return ctx;
}
