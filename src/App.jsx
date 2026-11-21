import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import Login from './components/Login';
import CategoryManager from './components/CategoryManager';
import PLCSettings from './components/plc/PLCSettings';
import PLCTagMapping from './components/plc/PLCTagMapping';
import ConveyorControl from './components/plc/ConveyorControl';
import Room1RackControl from './components/plc/Room1RackControl';
import PLCMonitor from './components/plc/PLCMonitor';
import PLCLogs from './components/plc/PLCLogs';
import PLCSensorLogs from './components/plc/PLCSensorLogs';
import Room2Placeholder from './components/plc/Room2Placeholder';
import { usePLCFault } from './services/plcService';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  // Global fault notification — Req 8.6, 10.6
  const { fault, clearFault } = usePLCFault();

  // Show a dismissable sonner toast whenever a new fault arrives (Req 8.6)
  useEffect(() => {
    if (fault) {
      const faultTime = fault.timestamp
        ? new Date(fault.timestamp).toLocaleTimeString()
        : new Date().toLocaleTimeString();
      toast.error(`⚠️ PLC Fault: ${fault.message}`, {
        description: `Detected at ${faultTime}`,
        duration: Infinity,         // Stays until dismissed
        onDismiss: () => clearFault(),
        onAutoClose: () => clearFault(),
      });
    }
  }, [fault]);

  const handlePing = () => {
    if (window.electronAPI) {
      window.electronAPI.ping();
      console.log('Ping sent to main process!');
    } else {
      console.warn('Electron API not found in this environment.');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div className="h-screen bg-slate-950 text-slate-100 font-sans flex text-white relative">
      {/* Global sonner toast container — Req 8.6, 10.6 */}
      <Toaster position="top-right" richColors closeButton />

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col z-20 shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <span className="font-bold text-xl">W</span>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white truncate">Warehouse</h1>
            <p className="text-xs text-blue-300/70 truncate">{user.role} View</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2">Core Modules</div>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${currentView === 'dashboard' ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <svg className="w-4 h-4 text-current opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </button>

          <button
            onClick={() => setCurrentView('categories')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${currentView === 'categories' ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <svg className="w-4 h-4 text-current opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            Categories
          </button>

          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 pt-4 mb-2">PLC Control</div>

          <button
            onClick={() => setCurrentView('plc-settings')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${currentView === 'plc-settings' ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <span>🔌</span>
            PLC Settings
          </button>

          <button
            onClick={() => setCurrentView('plc-tags')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${currentView === 'plc-tags' ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <span>🏷️</span>
            Tag Mapping
          </button>

          <button
            onClick={() => setCurrentView('plc-conveyor')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${currentView === 'plc-conveyor' ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <span>🏭</span>
            Conveyor Control
          </button>

          <button
            onClick={() => setCurrentView('plc-room1')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${currentView === 'plc-room1' ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <span>🏗️</span>
            Room 1 - Rack Control
          </button>

          <button
            onClick={() => setCurrentView('plc-monitor')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${currentView === 'plc-monitor' ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <span>📊</span>
            PLC Monitor
          </button>

          <button
            onClick={() => setCurrentView('plc-logs')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${currentView === 'plc-logs' ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <span>📋</span>
            PLC Logs
          </button>

          <button
            onClick={() => setCurrentView('plc-sensor-logs')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${currentView === 'plc-sensor-logs' ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <span>🔍</span>
            Sensor Logs
          </button>

          <button
            onClick={() => setCurrentView('plc-room2')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${currentView === 'plc-room2' ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <span>🚧</span>
            Room 2 — Coming Soon
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="mb-4 text-xs text-slate-400 text-center">
            Logged in as <span className="font-semibold text-white block mt-1 text-sm">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors text-sm font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="px-8 py-5 border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between shadow-sm">
          <h2 className="text-xl font-semibold tracking-wide text-white">
            {currentView === 'dashboard' && 'Dashboard Overview'}
            {currentView === 'categories' && 'Manage Categories & Subcategories'}
            {currentView === 'plc-settings' && 'PLC Connection Settings'}
            {currentView === 'plc-tags' && 'PLC Tag Mapping Settings'}
            {currentView === 'plc-conveyor' && 'Conveyor Belt Automation Control'}
            {currentView === 'plc-room1' && 'Room 1 Automation & Routing'}
            {currentView === 'plc-monitor' && 'PLC Live Monitor'}
            {currentView === 'plc-logs' && 'PLC Communication Logs'}
            {currentView === 'plc-sensor-logs' && 'PLC Sensor Logs'}
            {currentView === 'plc-room2' && 'Room 2 — Coming Soon'}
          </h2>
          <div className="text-sm text-slate-400">
            System Online
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {currentView === 'dashboard' && (
            <div className="flex items-start justify-center pt-10">
              <section className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">System Online</h2>
                <p className="text-slate-400 mb-8">Admin module initialized and ready for command.</p>

                <div className="flex flex-col gap-4">
                  <button
                    className="w-full py-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-medium rounded-xl border border-blue-500/30 transition-all flex items-center justify-center gap-2 group"
                    onClick={handlePing}
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Ping Core Process</span>
                  </button>
                </div>

                <p className="mt-8 text-xs text-slate-500">
                  Your connection to the database is active.
                </p>
              </section>
            </div>
          )}
          {currentView === 'categories' && <CategoryManager />}
          {currentView === 'plc-settings' && <PLCSettings />}
          {currentView === 'plc-tags' && <PLCTagMapping />}
          {currentView === 'plc-conveyor' && <ConveyorControl />}
          {currentView === 'plc-room1' && <Room1RackControl />}
          {currentView === 'plc-monitor' && <PLCMonitor />}
          {currentView === 'plc-logs' && <PLCLogs />}
          {currentView === 'plc-sensor-logs' && <PLCSensorLogs />}
          {currentView === 'plc-room2' && <Room2Placeholder />}
        </main>
      </div>
    </div>
  );
}

export default App;
