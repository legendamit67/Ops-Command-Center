import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, AlertTriangle, ShieldAlert, Sparkles, HelpCircle, 
  ChevronRight, Phone, HeartHandshake, Ambulance, MapPin, Map, Clock
} from "lucide-react";
import { SOSResponse } from "../types";

interface AIAlertPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: "notice" | "instruction" | "emergency";
  title: string;
  initialContent?: string;
  onActivateSOS?: (emergencyType: string, location: string) => void;
  isSubmittingSOS?: boolean;
  activeSOSResponse?: SOSResponse | null;
}

export default function AIAlertPopup({
  isOpen,
  onClose,
  type,
  title,
  initialContent = "",
  onActivateSOS,
  isSubmittingSOS = false,
  activeSOSResponse = null
}: AIAlertPopupProps) {
  const [selectedEmergencyType, setSelectedEmergencyType] = useState("Medical Assistance");
  const [spectatorLocation, setSpectatorLocation] = useState("Section 104, Row G, Seat 42");
  const [urgency, setUrgency] = useState<"high" | "critical">("critical");

  const popularEmergencies = [
    { label: "Medical Aid", value: "Medical Assistance" },
    { label: "Crowd Crush", value: "Crowd Congestion Hazard" },
    { label: "Security Risk", value: "Security / Altercation" },
    { label: "Fire / Smoke", value: "Fire Indicator" },
    { label: "Lost Minor", value: "Lost Child / Person" },
    { label: "Physical Blockage", value: "Locked Emergency Exit" }
  ];

  if (type !== "emergency") {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            className="relative w-full max-w-lg bg-zinc-950 border text-white p-6 shadow-2xl rounded-none overflow-hidden z-10 border-red-500/50"
          >
            {/* Theme Accents */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600 animate-pulse" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <ShieldAlert className="h-5 w-5 text-red-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest font-mono text-red-500">
                  AI_GENERATED_EMERGENCY
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-1 text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight mb-3">
              {title}
            </h3>

            {/* Body depending on type */}
            <div className="space-y-4 text-xs font-mono">
              
              {/* EMERGENCY REPORTING FORM OR REPORT ACTIVE STATE */}
              <div>
                {!activeSOSResponse ? (
                  <div className="space-y-4">
                    <p className="text-zinc-400 leading-relaxed text-xs">
                      Triggering a local SOS sends satellite coordinates, active location seat mapping, and launches customized AI safety plans for first responders.
                    </p>

                    {/* Select Emergency Type */}
                    <div className="space-y-2">
                      <label className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                        Select Emergency Category
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {popularEmergencies.map((e) => (
                          <button
                            key={e.value}
                            type="button"
                            onClick={() => setSelectedEmergencyType(e.value)}
                            className={`p-2 text-left text-[10px] border transition cursor-pointer font-black uppercase rounded-none ${
                              selectedEmergencyType === e.value
                                ? "bg-red-600 border-red-500 text-white"
                                : "bg-black border-white/10 text-zinc-400 hover:border-white/30"
                            }`}
                          >
                            {e.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Seat Map Location info */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
                          Your Live Location
                        </label>
                        <input
                          type="text"
                          value={spectatorLocation}
                          onChange={(e) => setSpectatorLocation(e.target.value)}
                          className="w-full bg-black border border-white/20 px-2 py-2 text-[11px] focus:outline-none focus:border-white text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
                          Urgency Severity
                        </label>
                        <select
                          value={urgency}
                          onChange={(e) => setUrgency(e.target.value as any)}
                          className="w-full bg-black border border-white/20 px-2 py-2 text-[11px] focus:outline-none focus:border-white text-white uppercase font-bold"
                        >
                          <option value="high">HIGH - DELAYED</option>
                          <option value="critical">CRITICAL - LIFE HAZARD</option>
                        </select>
                      </div>
                    </div>

                    {/* Trigger Actions */}
                    <div className="pt-3 border-t border-white/5 flex gap-2">
                      <button
                        onClick={onClose}
                        className="flex-1 py-3 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-900 font-black uppercase tracking-wider cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => onActivateSOS && onActivateSOS(selectedEmergencyType, spectatorLocation)}
                        disabled={isSubmittingSOS}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-wider cursor-pointer animate-pulse disabled:opacity-50"
                      >
                        {isSubmittingSOS ? "ACTIVATING SOS..." : "🚨 ACTIVATE SOS 🚨"}
                      </button>
                    </div>
                  </div>
                ) : (
                  // SOS IS ACTIVE - SHOW THE GENERATED AI INSTRUCTIONS
                  <div className="space-y-4 bg-red-950/20 border border-red-500/20 p-4">
                    
                    {/* Safety Alerts / Warning Banner */}
                    <div className="bg-red-600 text-white p-3 font-bold uppercase flex items-start gap-2.5">
                      <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] tracking-wider font-black">AI EMERGENCY SAFETY DISPATCH ACTIVE</div>
                        <p className="text-[9px] leading-tight font-normal mt-1">{activeSOSResponse.safetyAlert}</p>
                      </div>
                    </div>

                    {/* Dispatch Status */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <div>
                          <div className="text-[8px] text-zinc-500 uppercase font-black">TARGETED_ZONE</div>
                          <div className="text-[11px] font-bold text-white">{spectatorLocation}</div>
                        </div>
                      </div>

                      <div className="bg-red-950 px-3 py-1.5 border border-red-500/30 text-right">
                        <div className="text-[8px] text-red-400 uppercase font-black">EST. ARRIVAL</div>
                        <div className="text-xs font-black text-white flex items-center justify-end gap-1 font-mono">
                          <Clock className="h-3.5 w-3.5 animate-spin" />
                          <span>{activeSOSResponse.estimatedStaffArrivalMins} MINS</span>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-1 bg-black/60 p-3 border border-white/5">
                      <span className="text-[8px] text-blue-400 font-bold uppercase tracking-widest block">PERSONAL_AI_INSTRUCTIONS</span>
                      <p className="text-zinc-200 leading-relaxed text-xs">
                        {activeSOSResponse.instruction}
                      </p>
                    </div>

                    {/* Dispatch Notice details */}
                    <div className="space-y-1 bg-black/60 p-3 border border-white/5">
                      <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest block">DISPATCH_OPERATIONAL_NOTICE</span>
                      <p className="text-zinc-300 leading-relaxed text-xs">
                        {activeSOSResponse.notice}
                      </p>
                    </div>

                    {/* Evacuation Route */}
                    <div className="space-y-1 bg-black/60 p-3 border border-white/5">
                      <span className="text-[8px] text-yellow-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Map className="h-3.5 w-3.5" />
                        <span>EVACUATION_OUTWARD_PATH</span>
                      </span>
                      <p className="text-zinc-300 leading-relaxed text-xs">
                        {activeSOSResponse.evacuationRoute}
                      </p>
                    </div>

                    {/* Nearest Help desk */}
                    <div className="flex justify-between items-center bg-black/40 p-2 text-[10px] text-zinc-400">
                      <span>NEAREST_SAFEZONE: {activeSOSResponse.nearestStewardZone}</span>
                      <span className="text-[8px] bg-white/10 text-white px-2 py-0.5">MAP_GRID</span>
                    </div>

                    {/* Cancel Emergency action */}
                    <div className="pt-2">
                      <button
                        onClick={onClose}
                        className="w-full py-3 bg-white text-black font-black uppercase text-xs tracking-wider hover:bg-zinc-200 cursor-pointer transition text-center"
                      >
                        Acknowledge & Monitor Safe Zones
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
