import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, KeyRound, UserCheck, AlertCircle, ArrowRight, Eye, EyeOff, Terminal, Sparkles } from "lucide-react";

interface StaffLoginProps {
  onLoginSuccess: () => void;
}

export default function StaffLogin({ onLoginSuccess }: StaffLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Hardcoded demo credentials for showcase, in addition to the Skip bypass
  const DEMO_STAFF_ID = "STAFF-9582";
  const DEMO_PASSWORD = "azteca2026";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setIsLoading(true);

    // Simulate network authentication delay
    setTimeout(() => {
      if (
        (username.trim() === DEMO_STAFF_ID && password === DEMO_PASSWORD) ||
        (username.trim().toLowerCase() === "staff" && password === "12345")
      ) {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError("AUTHENTICATION FAILED: Invalid Staff ID or Security Passcode.");
      }
    }, 1200);
  };

  const handleSkip = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-950 border border-white/10 p-6 sm:p-8 relative"
      >
        {/* Futuristic Laser Border Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-500 animate-pulse" />

        {/* Top telemetry identifier */}
        <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
          <span>PORTAL_GATEWAY: AZT_OPS_01</span>
          <span className="text-blue-400">● SECURE SSL</span>
        </div>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 mb-3">
            <Shield className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-xl font-black uppercase italic tracking-tight text-white font-display">
            FIFA 2026 STADIUM OPERATIONS
          </h2>
          <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-wider mt-1">
            Authorized Personnel Command Portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-950/30 border border-red-500/30 p-3 flex items-start gap-2 text-red-400 font-mono text-[10px] uppercase leading-tight"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Staff ID Input */}
          <div className="space-y-1.5">
            <label className="block text-[9px] text-zinc-400 font-bold uppercase tracking-widest font-mono">
              Staff Operator ID
            </label>
            <div className="relative">
              <input
                id="staff-username"
                type="text"
                placeholder="e.g. STAFF-9582"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full bg-black border border-white/20 hover:border-white/40 focus:border-blue-500 focus:outline-none text-white px-3 py-2.5 text-xs font-mono transition-colors rounded-none placeholder-zinc-700"
              />
            </div>
          </div>

          {/* Passcode Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest font-mono">
                Security Passcode
              </label>
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="text-[9px] text-zinc-500 hover:text-zinc-300 font-mono underline"
              >
                {showHelp ? "Hide Hints" : "Show Demo Credentials"}
              </button>
            </div>
            <div className="relative">
              <input
                id="staff-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-black border border-white/20 hover:border-white/40 focus:border-blue-500 focus:outline-none text-white pl-3 pr-10 py-2.5 text-xs font-mono transition-colors rounded-none placeholder-zinc-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Help / Demo Credentials hint */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-zinc-900/60 border border-white/5 p-3 text-[10px] font-mono text-zinc-400 space-y-1 mt-2">
                  <div className="text-blue-400 font-bold uppercase">🔐 DEMO CREDENTIALS:</div>
                  <div>• Operator ID: <span className="text-white font-bold">{DEMO_STAFF_ID}</span></div>
                  <div>• Passcode: <span className="text-white font-bold">{DEMO_PASSWORD}</span></div>
                  <div className="text-[9px] text-zinc-500 pt-1 italic">
                    Or simply use the developer bypass button below to skip signing in.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Action */}
          <button
            id="staff-login-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-zinc-400 text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer font-mono rounded-none flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent" />
                <span>CONNECTING CORE SERVER...</span>
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                <span>SIGN IN TO OPS_PORTAL</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative bg-zinc-950 px-3 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
            Prototype / Developer Testing Only
          </span>
        </div>

        {/* Developer Skip / Bypass Button */}
        <button
          id="staff-login-skip"
          onClick={handleSkip}
          disabled={isLoading}
          className="w-full py-3 bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white border border-dashed border-white/20 hover:border-white/40 transition-all font-mono font-black uppercase text-xs tracking-wider cursor-pointer rounded-none flex items-center justify-center space-x-2.5"
        >
          <Terminal className="h-4 w-4 text-amber-500" />
          <span>Skip & Bypass Sign-In</span>
          <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
        </button>

        {/* Footer Security Notice */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-[8px] font-mono text-zinc-600 uppercase leading-snug">
            Security audit log #世界杯2026 active. Unauthorized attempts will be logged with physical security stewards.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
