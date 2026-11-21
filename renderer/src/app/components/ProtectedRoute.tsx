import { Navigate, Outlet } from "react-router";
import { useWarehouse } from "../context/WarehouseContext";

interface ProtectedRouteProps {
  module: string;
  action?: "canView" | "canCreate" | "canEdit" | "canDelete";
}

export function ProtectedRoute({ module, action = "canView" }: ProtectedRouteProps) {
  const { checkPermission, user } = useWarehouse();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (module === "Admin" && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  
  // Custom mapping for layout/racks logic
  if (module === "Conveyor") {
     if (user.role !== "ADMIN" && !checkPermission("Racks", "canView")) {
        return <Navigate to="/" replace />;
     }
  } else if (module !== "Admin" && !checkPermission(module, action)) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
}
