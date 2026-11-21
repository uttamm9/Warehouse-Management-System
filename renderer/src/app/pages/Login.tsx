import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, Warehouse, User, UserPlus, Eye, EyeOff, Minus, Square, X } from 'lucide-react';
import { api, isElectron } from '../utils/api';

export function Login({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [dbDiag, setDbDiag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = "http://localhost:3001";
  // On mount, check DB status so we can show the real error immediately
  useEffect(() => {
    const checkDb = async () => {
      try {
        const w = window as any;
        if (w?.electronAPI?.dbStatus) {
          const status = await w.electronAPI.dbStatus();
          if (!status.connected) {
            setDbDiag(`DB: ${status.dbUrl} | Error: ${status.error}`);
          }
        }
      } catch (_) { }
    };
    checkDb();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Please fill in both fields.');
        return;
      }
    }

    setError('');
    setIsLoading(true);

    try {
      let result;
      if (isSignup) {
        result = await api.signup({ name, email, password });
      } else {
        // result = await api.login({ email, password });

        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        result = await response.json();

      }

      if (result.success) {
        if (!isElectron()) console.warn('[AUTH] Running in browser mock mode');
        onLoginSuccess(result);
      } else {
        setError(result.message || 'Authentication failed.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden font-sans">
      {/* Window Controls */}
      <div className="app-drag-region absolute top-0 left-0 right-0 flex items-center z-50 pointer-events-none" style={{ height: 32 }}>
        <div className="flex-1 h-full" />
        <div className="app-no-drag flex items-stretch h-full pointer-events-auto">
          <button
            onClick={() => (window as any).electronAPI?.windowMinimize()}
            title="Minimize"
            style={{ width: 46 }}
            className="flex items-center justify-center h-full text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors"
          >
            <Minus size={10} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => (window as any).electronAPI?.windowMaximize()}
            title="Maximize"
            style={{ width: 46 }}
            className="flex items-center justify-center h-full text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors"
          >
            <Square size={9} strokeWidth={1.75} />
          </button>
          <button
            onClick={() => (window as any).electronAPI?.windowClose()}
            title="Close"
            style={{ width: 46 }}
            className="flex items-center justify-center h-full text-[#94a3b8] hover:text-white hover:bg-[#e81123] transition-colors"
          >
            <X size={11} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Dynamic Background Elements */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue/10 blur-[120px] rounded-full mix-blend-screen"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-sidebar/50 p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/[0.06]">
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-blue/10 rounded-2xl flex items-center justify-center mb-6"
            >
              <Warehouse className="w-8 h-8 text-blue" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span key={isSignup ? 'signup' : 'login'} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="block">
                  {isSignup ? "Create Account" : "Warehouse OS"}
                </motion.span>
              </AnimatePresence>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">{isSignup ? "Register to access the system" : "Log in to your command center"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">

              <AnimatePresence>
                {isSignup && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative group overflow-hidden">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-blue transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/[0.06] rounded-xl focus:border-blue focus:ring-1 focus:ring-blue text-[0.875rem] text-foreground placeholder:-muted-foreground transition-all outline-none"
                      placeholder="Jane Doe"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-blue transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/[0.06] rounded-xl focus:border-blue focus:ring-1 focus:ring-blue text-[0.875rem] text-foreground placeholder:-muted-foreground transition-all outline-none"
                  placeholder="admin@warehouse.com"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-blue transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-black/20 border border-white/[0.06] rounded-xl focus:border-blue focus:ring-1 focus:ring-blue text-[0.875rem] text-foreground placeholder:-muted-foreground transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <AnimatePresence>
                {isSignup && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative group overflow-hidden">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-blue transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-black/20 border border-white/[0.06] rounded-xl focus:border-blue focus:ring-1 focus:ring-blue text-[0.875rem] text-foreground placeholder:-muted-foreground transition-all outline-none"
                      placeholder="Confirm Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {dbDiag && (
              <div className="text-yellow-400 text-[0.75rem] font-mono text-left bg-yellow-400/10 p-2 rounded-lg border border-yellow-400/20 break-all">
                {dbDiag}
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red/90 text-[0.8125rem] font-medium text-center bg-red/10 py-2 rounded-lg border border-red/20"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full py-3 bg-blue hover:bg-blue/90 text-white rounded-xl font-medium shadow-lg transition-all flex justify-center items-center gap-2 overflow-hidden relative group text-[0.875rem]"
            >
              <div className="absolute inset-0 w-full h-full bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="relative z-10">{isSignup ? "Complete Registration" : "Access System"}</span>
                  {isSignup ? <UserPlus className="w-4 h-4 relative z-10" /> : <LogIn className="w-4 h-4 relative z-10" />}
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-[0.8125rem] text-muted-foreground flex flex-col items-center gap-2">
            {/* <p>
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <button onClick={() => { setIsSignup(!isSignup); setError(''); }} className="ml-2 text-blue hover:text-blue/80 font-medium transition-colors">
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p> */}
            <span className="text-[0.6875rem] text-muted-foreground/50">Secure connection via Desktop IPC</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
