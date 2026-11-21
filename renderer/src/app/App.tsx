import { useState, useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { WarehouseProvider } from "./context/WarehouseContext";
import { Toaster } from "sonner";
import { Login } from "./pages/Login";

const toasterStyle = {
  background: "#1e293b",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#e2e8f0",
  fontSize: "0.8125rem",
};

const SESSION_KEY = "wsms_session";

export default function App() {
  const [session, setSession] = useState<{ user: any; permissions: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) setSession(JSON.parse(saved));
    } catch (_) { }
    setLoading(false);
  }, []);

  function handleLoginSuccess(result: any) {
    const newSession = { user: result.user, permissions: result.permissions || [] };
    console.log("newSession", newSession);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  if (loading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!session) {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" toastOptions={{ style: toasterStyle }} />
      </>
    );
  }

  return (
    <WarehouseProvider user={session.user} permissions={session.permissions} onLogout={handleLogout}>
      <RouterProvider router={router} />
      <Toaster position="top-right" toastOptions={{ style: toasterStyle }} />
    </WarehouseProvider>
  );
}
