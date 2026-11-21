import { createHashRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { WarehouseMap } from "./pages/WarehouseMap";
import { RackMonitoring } from "./pages/RackMonitoring";
import { InboundInventory } from "./pages/InboundInventory";
import { OutboundInventory } from "./pages/OutboundInventory";
import { SKUManagement } from "./pages/SKUManagement";
import { CategoryManagement } from "./pages/CategoryManagement";
import { ConveyorControl } from "./pages/ConveyorControl";
import { Reports } from "./pages/Reports";
import { Billing } from "./pages/Billing";
import { SystemLogs } from "./pages/SystemLogs";
import { SettingsPage } from "./pages/SettingsPage";
import { RoleManagement } from "./pages/RoleManagement";
import { UserManagement } from "./pages/UserManagement";
import { ProfilePage } from "./pages/ProfilePage";
import { Scan } from "./pages/Scan";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PLCSettings } from "./pages/PLCSettings";
import { PLCTagMapping } from "./pages/PLCTagMapping";
import { Room1RackControl } from "./pages/Room1RackControl";
import { PLCMonitor } from "./pages/PLCMonitor";
import { PLCLogs } from "./pages/PLCLogs";
import { Room2Placeholder } from "./pages/Room2Placeholder";
import { PLCErrorBoundary } from "./components/PLCErrorBoundary";

// Pre-create stable bounded components (must be outside router definition)
const PLCSettingsBounded = () => <PLCErrorBoundary><PLCSettings /></PLCErrorBoundary>;
const PLCTagMappingBounded = () => <PLCErrorBoundary><PLCTagMapping /></PLCErrorBoundary>;
const Room1RackControlBounded = () => <PLCErrorBoundary><Room1RackControl /></PLCErrorBoundary>;
const PLCMonitorBounded = () => <PLCErrorBoundary><PLCMonitor /></PLCErrorBoundary>;
const PLCLogsBounded = () => <PLCErrorBoundary><PLCLogs /></PLCErrorBoundary>;
const Room2PlaceholderBounded = () => <PLCErrorBoundary><Room2Placeholder /></PLCErrorBoundary>;
const ConveyorControlBounded = () => <PLCErrorBoundary><ConveyorControl /></PLCErrorBoundary>;

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "profile", Component: ProfilePage },
      {
        element: <ProtectedRoute module="Scan Page Access" />,
        children: [
          { path: "scan", Component: Scan },
        ]
      },
      {
        element: <ProtectedRoute module="Inventory" />,
        children: [
          { path: "inbound", Component: InboundInventory },
          { path: "outbound", Component: OutboundInventory },
          { path: "sku-management", Component: SKUManagement },
          { path: "categories", Component: CategoryManagement },
        ]
      },
      {
        element: <ProtectedRoute module="Racks" />,
        children: [
          { path: "warehouse-map", Component: WarehouseMap },
          { path: "rack-monitoring", Component: RackMonitoring },
        ]
      },
      {
        element: <ProtectedRoute module="Conveyor" />, // Custom mapped
        children: [
          { path: "conveyor-control", Component: ConveyorControlBounded },
          { path: "plc-settings", Component: PLCSettingsBounded },
          { path: "plc-tags", Component: PLCTagMappingBounded },
          { path: "plc-room1", Component: Room1RackControlBounded },
          { path: "plc-monitor", Component: PLCMonitorBounded },
          { path: "plc-logs", Component: PLCLogsBounded },
          { path: "plc-room2", Component: Room2PlaceholderBounded },
        ]
      },
      {
        element: <ProtectedRoute module="Reports" />,
        children: [
          { path: "reports", Component: Reports },
          { path: "system-logs", Component: SystemLogs },
        ]
      },
      {
        element: <ProtectedRoute module="Billing" />,
        children: [
          { path: "billing", Component: Billing },
        ]
      },
      {
        element: <ProtectedRoute module="Admin" />,
        children: [
          { path: "settings", Component: SettingsPage },
          { path: "role-management", Component: RoleManagement },
          { path: "user-management", Component: UserManagement },
        ]
      }
    ],
  },
]);
