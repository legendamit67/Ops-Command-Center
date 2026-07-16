import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, Users, Landmark, Clock, Activity, Sprout, AlertOctagon, Trophy, Sun, Moon } from "lucide-react";
import { LiveScore } from "../types";

interface HeaderProps {
  currentRole: "fan" | "staff" | "sustainability";
  setRole: (role: "fan" | "staff" | "sustainability") => void;
  stadiumName: string;
  liveScore: LiveScore | null;
  isSOSActive: boolean;
  onOpenSOS: () => void;
  theme?: "dark" | "light";
  setTheme?: (theme: "dark" | "light") => void;
}

export default function Header({ 
  currentRole, 
  setRole, 
  stadiumName,
  liveScore,
  isSOSActive,
  onOpenSOS,
  theme = "dark",
  setTheme
}: HeaderProps) {
  const [time, setTime] = useState<string>("10:55:37 PM");
  const [countdown, setCountdown] = useState<string>("04:04:23");

  // Simulate a live countdown clock for Matchday
  useEffect(() => {
    let secs = 4 * 3600 + 4 * 60 + 23;
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      
      if (secs > 0) {
        secs -= 1;
        const h = Math.floor(secs / 3600).toString().padStart(2, "0");
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        setCountdown(`${h}:${m}:${s}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-white/20 flex flex-col lg:flex-row items-stretch lg:items-center justify-between bg-zinc-950 text-white font-sans">
      
      {/* Brand logo block */}
      <div className="flex items-center gap-4 px-6 py-4 border-b lg:border-b-0 lg:border-r border-white/10 bg-zinc-900 shrink-0">
        <div className="bg-zinc-950 border border-white/15 text-white font-black text-2xl px-3 py-1 italic tracking-tighter uppercase select-none font-display flex items-center gap-1.5">
          <span>FIFA</span>
          <span className="text-yellow-400 font-black">26</span>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="inline-block text-lg origin-center cursor-default"
          >
            ⚽
          </motion.span>
        </div>
        <div className="h-6 w-[1px] bg-white/20 hidden sm:block"></div>
        <div className="text-xs uppercase tracking-[0.2em] font-black text-zinc-300 hidden sm:block font-display">
          Ops Command Center
        </div>
      </div>

      {/* Real-time Match Status & Live Score - Monospace/Display values */}
      <div className="flex flex-wrap items-center gap-6 px-6 py-4 lg:py-0 text-xs flex-1">
        
        <div className="flex items-center space-x-2 border-r border-white/10 pr-6 shrink-0">
          <Clock className="h-4 w-4 text-blue-400" />
          <div>
            <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest font-display">AZTECA_TIME</div>
            <div className="font-mono text-white font-bold text-sm tracking-tight">{time}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 border-r border-white/10 pr-6 shrink-0">
          <Trophy className="h-4 w-4 text-amber-400 animate-bounce" style={{ animationDuration: '3s' }} />
          <div>
            <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest font-display">
              {liveScore ? `MATCH_MINUTE: ${liveScore.matchMinute}'` : "ACTIVE_MATCH"}
            </div>
            <div className="font-sans text-zinc-200 font-bold tracking-tight text-sm">
              {liveScore ? (
                <div className="flex items-center gap-2">
                  <span className="text-white font-black flex items-center gap-1">🇲🇽 {liveScore.homeTeam}</span>
                  <span className="bg-zinc-800 text-yellow-400 px-1.5 py-0.5 font-mono text-xs font-black rounded">
                    {liveScore.homeScore} - {liveScore.awayScore}
                  </span>
                  <span className="text-white font-black flex items-center gap-1">{liveScore.awayTeam} 🇩🇪</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-white font-black">🇲🇽 MEX</span>
                  <span className="bg-zinc-800 text-yellow-400 px-1.5 py-0.5 font-mono text-xs font-black rounded">1 - 1</span>
                  <span className="text-white font-black">GER 🇩🇪</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live event ticker */}
        {liveScore && liveScore.recentEvents && liveScore.recentEvents.length > 0 && (
          <div className="hidden xl:flex items-center space-x-2 border-r border-white/10 pr-6 flex-1 max-w-md">
            <span className="text-[8px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded-none uppercase animate-pulse">LATEST</span>
            <div className="text-zinc-400 text-[10px] truncate uppercase font-mono tracking-tight">
              {liveScore.recentEvents[0].minute}' {liveScore.recentEvents[0].text}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <div>
            <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest font-display">GATES_OPEN</div>
            <div className="font-mono text-red-500 font-black text-sm tracking-tighter">{countdown}</div>
          </div>
        </div>

      </div>

      {/* SOS Button and Perspective Selector */}
      <div className="flex flex-col sm:flex-row bg-black border-t lg:border-t-0 lg:border-l border-white/20 p-2 gap-1.5 shrink-0 items-stretch sm:items-center">
        
        {/* GLOBAL RED SOS BUTTON */}
        <button
          onClick={onOpenSOS}
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-none text-xs uppercase tracking-widest font-black transition-all cursor-pointer border ${
            isSOSActive
              ? "bg-red-600 border-red-500 text-white animate-pulse"
              : "bg-red-950/40 border-red-800/60 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-500"
          }`}
        >
          <AlertOctagon className={`h-4 w-4 ${isSOSActive ? "animate-spin" : ""}`} />
          <span>{isSOSActive ? "🚨 DISPATCH_ACTIVE" : "🚨 EMERGENCY SOS"}</span>
        </button>

        {/* Theme Toggle Button */}
        {setTheme && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center p-3 text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-all cursor-pointer rounded-none border border-white/10"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400 animate-pulse" />
            ) : (
              <Moon className="h-4 w-4 text-blue-500" />
            )}
          </button>
        )}

        <div className="h-full w-[1px] bg-white/10 hidden sm:block mx-1"></div>

        <button
          id="role-switch-fan"
          onClick={() => setRole("fan")}
          className={`flex items-center space-x-2 px-4 py-3 rounded-none text-xs uppercase tracking-widest font-black transition-all cursor-pointer ${
            currentRole === "fan"
              ? "bg-white text-black shadow-none"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>FAN_HUB</span>
        </button>

        <button
          id="role-switch-staff"
          onClick={() => setRole("staff")}
          className={`flex items-center space-x-2 px-4 py-3 rounded-none text-xs uppercase tracking-widest font-black transition-all cursor-pointer border ${
            currentRole === "staff"
              ? "bg-blue-600 text-white border-blue-500"
              : "text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900/50"
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          <span>OPS_PORTAL</span>
        </button>

        <button
          id="role-switch-sustainability"
          onClick={() => setRole("sustainability")}
          className={`flex items-center space-x-2 px-4 py-3 rounded-none text-xs uppercase tracking-widest font-black transition-all cursor-pointer border ${
            currentRole === "sustainability"
              ? "bg-emerald-600 text-white border-emerald-500"
              : "text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900/50"
          }`}
        >
          <Sprout className="h-3.5 w-3.5" />
          <span>SUSTAINABILITY</span>
        </button>
      </div>

    </header>
  );
}
