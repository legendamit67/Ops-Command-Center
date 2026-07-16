import React, { useState } from "react";
import { 
  Shield, AlertTriangle, Radio, Megaphone, Users, Sparkles, 
  CheckSquare, ClipboardList, TrendingUp, BarChart2, ShieldCheck,
  Clock, Video, Zap, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Sector, Incident, IncidentResponse } from "../types";
import CrowdPredictor from "./CrowdPredictor";

interface CommandCenterProps {
  sectors: Sector[];
  onTriggerDensitySimulation: () => void;
}

export default function CommandCenter({ sectors, onTriggerDensitySimulation }: CommandCenterProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    // Auto-clear after 4s
    const timer = setTimeout(() => {
      setToastMessage((curr) => curr === msg ? null : curr);
    }, 4000);
  };

  // Toggle between Tactical Incidents, AI Predictive Sensors, and Live Operations Control Center
  const [consoleView, setConsoleView] = useState<"tactical" | "predictive" | "operations">("tactical");

  // Venue interactive commands states
  const [lightsMode, setLightsMode] = useState<"Auto" | "Max Power" | "Eco" | "Flashing">("Auto");
  const [paStatus, setPaStatus] = useState<"Normal" | "Muted" | "Evacuation Loop Active">("Normal");
  const [gateCLock, setGateCLock] = useState<boolean>(false);
  const [scannersSpeed, setScannersSpeed] = useState<"Normal" | "Bypass (Express)" | "Halted">("Normal");
  const [droneFeed, setDroneFeed] = useState<boolean>(true);

  // Security Alert feeds state
  const [securityAlerts, setSecurityAlerts] = useState([
    { id: "sec-alert-1", time: "14:32", sector: "Concourse West Gate D", category: "Unlicensed Vendor", priority: "Low", msg: "Unauthorized merchandiser setup blocking emergency door exit clearance." },
    { id: "sec-alert-2", time: "14:35", sector: "VIP Presidential Box Corridor", category: "Tailgating Attempt", priority: "High", msg: "Credential mis-match near secure zone door A-3. Stewards dispatched." },
    { id: "sec-alert-3", time: "14:39", sector: "Upper Deck Sector 104", category: "Slippery Walkway", priority: "Medium", msg: "Spilled soft drinks on stairs causing slip hazard near Row G." }
  ]);

  // Active Alerts feeds state
  const [activeAlerts, setActiveAlerts] = useState([
    { id: "active-1", level: "CRITICAL", title: "CROWD PRESSURE - GATE C", details: "Density index exceeds 0.85 fans/sqm. Gates 11 & 12 locked for ingress pressure control.", timestamp: "14:40" },
    { id: "active-2", level: "WARNING", title: "METRO TRAIN BACKUP", details: "Constituyentes Line 3 delayed by 12 mins. Platforms heavily congested.", timestamp: "14:38" }
  ]);

  // Pre-configured typical matchday incidents for quick testing
  const presetIncidents: Incident[] = [
    {
      type: "Crowd Bottleneck",
      location: "South Gate C Entrance Plaza",
      severity: "critical",
      description: "Severe crowd congestion near the primary Metro walkway due to 2 failed ticket scanners. Estimated 8,000 fans backed up."
    },
    {
      type: "Medical Emergency",
      location: "Lower Concourse Section 104",
      severity: "high",
      description: "Two spectators exhibiting symptoms of heat exhaustion. Volunteer responders require quick medical dispatch clearways."
    },
    {
      type: "Severe Weather Pre-Warning",
      location: "Open Upper Decks - East Stands",
      severity: "medium",
      description: "Sudden thunder and lightning warning within 10km. Need to advise upper deck spectators of safety structures."
    },
    {
      type: "Pyrotechnics Ignited",
      location: "North Stand Row K Sector 202",
      severity: "high",
      description: "Supporters ignited 3 flares in the stands. Heavy smoke interfering with overhead camera visual tracking."
    }
  ];

  // Selected or custom incident form state
  const [incidentType, setIncidentType] = useState<string>("Crowd Bottleneck");
  const [incidentLocation, setIncidentLocation] = useState<string>("South Gate C Entrance Plaza");
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | "critical">("critical");
  const [description, setDescription] = useState<string>(
    "Severe crowd congestion near the primary Metro walkway due to 2 failed ticket scanners. Estimated 8,000 fans backed up."
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [incidentResult, setIncidentResult] = useState<IncidentResponse | null>({
    actionPlan: [
      "Secure the immediate area around South Gate C Entrance Plaza and establish a safety cordon.",
      "Instruct nearest stewards to facilitate peaceful fan re-routing towards West Gate D.",
      "Inform the zone commander and dispatch localized volunteer translators to assist.",
      "Coordinate with local first responders if any medical issues occur."
    ],
    staffBroadcast: "[CRITICAL ALERT - CRITICAL] Incident reported: Crowd Bottleneck at South Gate C Entrance Plaza. All nearby stewards, please converge and monitor crowd flows. Direct fans towards alternative pathways.",
    fanAnnouncements: {
      en: "Attention fans at South Gate C Entrance Plaza. To ensure your comfort and safety, please follow the directions of stadium stewards and move calmly towards alternative exits. Thank you.",
      es: "Atención aficionados en South Gate C Entrance Plaza. Para garantizar su comodidad y seguridad, sigan las instrucciones de los oficiales del estadio y desplácense con calma. Gracias.",
      fr: "Attention aux supporters situés à South Gate C Entrance Plaza. Pour votre sécurité, veuillez suivre les consignes des agents du stade et vous diriger calmement vers les sorties secondaires."
    },
    crowdSafetyLevel: "INTERVENE",
    recommendedStaffCount: 15
  });

  // Handle preset selector
  const selectPreset = (preset: Incident) => {
    setIncidentType(preset.type);
    setIncidentLocation(preset.location);
    setSeverity(preset.severity);
    setDescription(preset.description);
  };

  // Submit to GenAI Incident Analyzer
  const handleAnalyzeIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await fetch("/api/gemini/incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: incidentType,
          location: incidentLocation,
          severity,
          description
        })
      });

      if (!response.ok) {
        throw new Error("Incident analyzer returned an error");
      }

      const data = await response.json();
      setIncidentResult(data);
    } catch (err) {
      console.error(err);
      triggerToast("Failed to analyze incident with GenAI. Using fail-safe fallback plan.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulated Volunteer & Staff squads
  const volunteerSquads = [
    { id: "v1", name: "Alpha Steward Team (North)", lead: "Marta Gomez", members: 12, status: "Active", zone: "Gate A" },
    { id: "v2", name: "Bravo Translation Squad", lead: "Jean-Paul", members: 8, status: "Standby", zone: "Gate C Plaza" },
    { id: "v3", name: "Delta Logistics / Water Point", lead: "Kenji Sato", members: 15, status: "Active", zone: "Concourse West" },
    { id: "v4", name: "Sigma First Aid Stewards", lead: "Dr. Sarah Al-Fayed", members: 6, status: "Active", zone: "Section 104" }
  ];

  // Professional Operational Staff Roster
  const opsStaff = [
    { code: "EMP-AZT-041", name: "Ingrid Vance", designation: "Chief Security Coordinator", position: "Command Central Room", status: "On Duty", statusColor: "bg-emerald-500" },
    { code: "EMP-AZT-115", name: "Carlos Santana", designation: "Crowd Flow Lead Warden", position: "South Gate C Gateways", status: "On Duty", statusColor: "bg-emerald-500" },
    { code: "EMP-AZT-903", name: "Hassan Al-Jamil", designation: "Technical Comms Engineer", position: "Upper Deck Sector 104", status: "In Dispatch", statusColor: "bg-yellow-500" },
    { code: "EMP-AZT-381", name: "Yuki Tanaka", designation: "Incident Response Marshal", position: "West Gate D Escalators", status: "On Duty", statusColor: "bg-emerald-500" },
    { code: "EMP-AZT-562", name: "Marcus Dupree", designation: "Egress Safety Supervisor", position: "North Gate A Main Concourse", status: "Break Room", statusColor: "bg-zinc-600" },
  ];

  const [staffTab, setStaffTab] = useState<"squads" | "staff">("squads");

  return (
    <div className="flex flex-col max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 py-0 text-white font-sans">
      
      {/* Sub tabs for CommandCenter */}
      <div className="bg-zinc-950 border-b border-white/15 p-2 flex flex-col sm:flex-row gap-1 bg-black">
        <button
          onClick={() => setConsoleView("tactical")}
          className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider transition-all cursor-pointer rounded-none border ${
            consoleView === "tactical"
              ? "bg-blue-600 text-white border-blue-500"
              : "bg-black text-zinc-400 border-white/5 hover:text-white hover:bg-zinc-900"
          }`}
        >
          <ShieldCheck className="h-4.5 w-4.5 inline mr-2" />
          <span>Tactical Incident Command</span>
        </button>
        
        <button
          onClick={() => setConsoleView("predictive")}
          className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider transition-all cursor-pointer rounded-none border ${
            consoleView === "predictive"
              ? "bg-white text-black border-white"
              : "bg-black text-zinc-400 border-white/5 hover:text-white hover:bg-zinc-900"
          }`}
        >
          <TrendingUp className="h-4.5 w-4.5 inline mr-2" />
          <span>AI Predictive Analytics (CCTV/IoT/WiFi)</span>
        </button>

        <button
          onClick={() => setConsoleView("operations")}
          className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider transition-all cursor-pointer rounded-none border ${
            consoleView === "operations"
              ? "bg-rose-600 text-white border-rose-500"
              : "bg-black text-zinc-400 border-white/5 hover:text-white hover:bg-zinc-900"
          }`}
        >
          <Zap className="h-4.5 w-4.5 inline mr-2 text-yellow-400" />
          <span>Operations & Commands</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {consoleView === "predictive" ? (
          <motion.div
            key="predictive-analytics"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-0"
          >
            <CrowdPredictor />
          </motion.div>
        ) : consoleView === "operations" ? (
          <motion.div
            key="operations-control"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 sm:p-8 bg-black grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left 7 columns: Schedules, Broadcast Sync, and Venue Commands */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Module 1: Broadcast Sync */}
              <div className="bg-zinc-950 border border-white/10 p-5 rounded-none" id="ops-broadcast-sync">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center space-x-2 text-indigo-400 font-mono text-[10px] uppercase tracking-wider font-black">
                    <Video className="h-4 w-4 text-indigo-400 animate-pulse" />
                    <span>BROADCAST_SYNC_CORE</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 border border-indigo-500/20 uppercase rounded-none">
                    📡 SATELLITE FEED ALIGNED
                  </span>
                </div>
                
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Monitor and sync real-time latency offset between international live video streams, VAR replay servers, and matchday pitch commentators.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { feed: "MAIN PITCH FEED A", latency: "0.14s", status: "STABLE", rate: "59.94 FPS", quality: "4K UHD" },
                    { feed: "VAR REPLAY CORE", latency: "0.08s", status: "STABLE", rate: "120.0 FPS", quality: "1080p" },
                    { feed: "STADIUM JUMBOTRON", latency: "0.01s", status: "SYNCED", rate: "60.0 FPS", quality: "1080p" }
                  ].map((f, i) => (
                    <div key={i} className="bg-black border border-white/5 p-3.5 flex flex-col justify-between">
                      <div>
                        <span className="block text-[10px] text-zinc-400 font-black uppercase tracking-tight">{f.feed}</span>
                        <div className="flex items-baseline space-x-1.5 mt-2">
                          <span className="text-lg font-black font-mono text-white">{f.latency}</span>
                          <span className="text-[8px] font-mono text-zinc-500">LATENCY</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono">
                        <span className="text-zinc-500">{f.quality} @ {f.rate}</span>
                        <span className="text-emerald-400 font-bold">{f.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-zinc-900 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-none">
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span>All commentary audio track feeds synced via SMPTE 2110 matrix.</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => triggerToast("Re-syncing timecode clocks... Done.")}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[9px] font-black uppercase tracking-wider px-3 py-1.5 border border-white/10 rounded-none transition"
                  >
                    🔄 FORCE TIMECODE RESYNC
                  </button>
                </div>
              </div>

              {/* Module 2: Event Schedule */}
              <div className="bg-zinc-950 border border-white/10 p-5 rounded-none" id="ops-event-schedule">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center space-x-2 text-yellow-400 font-mono text-[10px] uppercase tracking-wider font-black">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <span>EVENT_TIMELINE_SCHEDULE</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">MATCHDAY TIMELINE</span>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "ev-1", time: "11:00", event: "Outer gates unlocked & security perimeter sweep", state: "COMPLETED", color: "text-zinc-500 line-through" },
                    { id: "ev-2", time: "12:30", event: "Ingress turnstiles active / Ticket scanning live", state: "COMPLETED", color: "text-zinc-500 line-through" },
                    { id: "ev-3", time: "13:15", event: "VIP Arrivals & presidential zone corridor access lockout", state: "COMPLETED", color: "text-zinc-500 line-through" },
                    { id: "ev-4", time: "14:15", event: "National anthems of MEX and GER & team greetings", state: "COMPLETED", color: "text-zinc-500 line-through" },
                    { id: "ev-5", time: "14:30", event: "First half Kickoff (Estadio Azteca matchday start)", state: "IN PROGRESS", color: "text-yellow-400 font-bold" },
                    { id: "ev-6", time: "15:15", event: "Halftime protocol, show preparations, and media sync", state: "UPCOMING", color: "text-zinc-400" },
                    { id: "ev-7", time: "16:15", event: "Final whistle & high-density egress plan activation", state: "UPCOMING", color: "text-zinc-400" }
                  ].map((e) => (
                    <div key={e.id} className="bg-black/60 border border-white/5 p-3 flex items-start justify-between gap-4 hover:border-white/10 transition">
                      <div className="flex items-start space-x-3">
                        <span className="font-mono text-xs font-black text-yellow-400 w-12 shrink-0">{e.time}</span>
                        <p className={`text-xs ${e.color} font-mono leading-tight`}>{e.event}</p>
                      </div>
                      <span className={`text-[8px] font-mono font-bold px-2 py-0.5 border rounded-none uppercase shrink-0 ${
                        e.state === "COMPLETED" ? "bg-zinc-900 text-zinc-500 border-zinc-800" :
                        e.state === "IN PROGRESS" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse" :
                        "bg-zinc-950 text-zinc-600 border-white/5"
                      }`}>
                        {e.state}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module 3: Venue Commands */}
              <div className="bg-zinc-950 border border-white/10 p-5 rounded-none" id="ops-venue-commands">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center space-x-2 text-rose-500 font-mono text-[10px] uppercase tracking-wider font-black">
                    <Zap className="h-4 w-4 text-rose-500" />
                    <span>VENUE_COMMANDS_CONSOLE</span>
                  </div>
                  <span className="text-[9px] font-mono bg-rose-500/10 text-rose-400 px-2 py-0.5 border border-rose-500/20 font-bold uppercase rounded-none">
                    ⚠️ SYSADMIN CONTROLS
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Direct stadium system integrations. Trigger immediate automated responses across the Aztec physical infrastructure layer.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Lights Mode Command */}
                  <div className="bg-black p-4 border border-white/5 flex flex-col justify-between">
                    <div>
                      <span className="block text-[10px] text-zinc-500 uppercase font-mono font-bold">Stadium Floodlights Mode</span>
                      <span className="text-xs font-mono font-bold text-white uppercase block mt-1">ACTIVE: {lightsMode}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mt-3">
                      {(["Auto", "Max Power", "Eco", "Flashing"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setLightsMode(mode)}
                          className={`py-1 px-2 text-[9px] font-mono font-bold uppercase border cursor-pointer transition ${
                            lightsMode === mode ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-400 border-white/5 hover:text-white"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Public Address loop */}
                  <div className="bg-black p-4 border border-white/5 flex flex-col justify-between">
                    <div>
                      <span className="block text-[10px] text-zinc-500 uppercase font-mono font-bold">Audio PA Evacuation override</span>
                      <span className={`text-xs font-mono font-bold block mt-1 uppercase ${paStatus.includes("Active") ? "text-red-500 animate-pulse font-black" : "text-white"}`}>
                        STATUS: {paStatus}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mt-3">
                      <button
                        type="button"
                        onClick={() => setPaStatus(paStatus === "Evacuation Loop Active" ? "Normal" : "Evacuation Loop Active")}
                        className={`py-1.5 px-2 text-[9px] font-mono font-bold uppercase border cursor-pointer transition ${
                          paStatus === "Evacuation Loop Active" ? "bg-red-600 text-white border-red-500 animate-pulse" : "bg-zinc-900 text-red-400 border-red-500/20 hover:bg-red-500/10"
                        }`}
                      >
                        🚨 TOGGLE ALARM
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaStatus(paStatus === "Muted" ? "Normal" : "Muted")}
                        className={`py-1.5 px-2 text-[9px] font-mono font-bold uppercase border cursor-pointer transition ${
                          paStatus === "Muted" ? "bg-zinc-400 text-black border-white" : "bg-zinc-900 text-zinc-400 border-white/5"
                        }`}
                      >
                        🔇 MUTE SPEAKER
                      </button>
                    </div>
                  </div>

                  {/* Gate C Ingress Switch */}
                  <div className="bg-black p-4 border border-white/5 flex flex-col justify-between">
                    <div>
                      <span className="block text-[10px] text-zinc-500 uppercase font-mono font-bold">Gate C Physical Ingress Lock</span>
                      <span className="text-xs font-mono font-bold text-white uppercase block mt-1">
                        STATE: <strong className={gateCLock ? "text-red-500" : "text-emerald-400"}>{gateCLock ? "LOCKED & SECURED" : "UNLOCKED (FLOW ACTIVE)"}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGateCLock(!gateCLock)}
                      className={`w-full py-2 px-3 text-[10px] font-mono font-bold uppercase border cursor-pointer transition mt-3 ${
                        gateCLock ? "bg-red-600 text-white border-red-500" : "bg-emerald-600/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-600/20"
                      }`}
                    >
                      {gateCLock ? "🔓 UNLOCK SOUTH GATE C" : "🔒 LOCK SOUTH GATE C"}
                    </button>
                  </div>

                  {/* Turnstile Scanners Mode */}
                  <div className="bg-black p-4 border border-white/5 flex flex-col justify-between">
                    <div>
                      <span className="block text-[10px] text-zinc-500 uppercase font-mono font-bold">RFID Turnstile Scan Rate</span>
                      <span className="text-xs font-mono font-bold text-white uppercase block mt-1">MODE: {scannersSpeed}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 mt-3">
                      {(["Normal", "Bypass (Express)", "Halted"] as const).map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={() => setScannersSpeed(spd)}
                          className={`py-1 text-[8px] font-mono font-bold uppercase border cursor-pointer transition ${
                            scannersSpeed === spd ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-400 border-white/5 hover:text-white"
                          }`}
                        >
                          {spd.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Right 5 columns: Security Alerts & Active Alerts */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Module 4: Security Alerts */}
              <div className="bg-zinc-950 border border-white/10 p-5 rounded-none" id="ops-security-alerts">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center space-x-2 text-rose-500 font-mono text-[10px] uppercase tracking-wider font-black">
                    <Shield className="h-4 w-4 text-rose-500" />
                    <span>SECURITY_ALERTS_ROUTINE</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">LIVE FEED</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Real-time reporting feed of minor and major security anomalies logged across the concourses by stewards.
                </p>

                <div className="space-y-3">
                  {securityAlerts.map((alertItem) => (
                    <div key={alertItem.id} className="bg-black border border-white/5 p-4 flex flex-col justify-between hover:border-white/20 transition">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-zinc-500 font-mono font-bold">{alertItem.time} · {alertItem.sector}</span>
                          <span className={`text-[9px] font-mono font-black border px-1.5 py-0.5 uppercase ${
                            alertItem.priority === "High" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                            alertItem.priority === "Medium" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                            "bg-zinc-900 text-zinc-400 border-white/5"
                          }`}>
                            {alertItem.priority}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-white uppercase tracking-tight mt-1.5">{alertItem.category}</h4>
                        <p className="text-xs text-zinc-400 font-mono leading-relaxed mt-1">{alertItem.msg}</p>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-white/5 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setSecurityAlerts(prev => prev.filter(a => a.id !== alertItem.id));
                          }}
                          className="bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 border border-white/10 rounded-none transition"
                        >
                          ✓ ACKNOWLEDGE & DISMISS
                        </button>
                      </div>
                    </div>
                  ))}

                  {securityAlerts.length === 0 && (
                    <div className="text-center py-8 bg-black border border-white/5 text-zinc-500 text-xs font-mono uppercase">
                      🎉 No security warnings active. Estadio Azteca is secure.
                    </div>
                  )}
                </div>
              </div>

              {/* Module 5: Active Alerts */}
              <div className="bg-zinc-950 border border-white/10 p-5 rounded-none" id="ops-active-alerts">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center space-x-2 text-rose-500 font-mono text-[10px] uppercase tracking-wider font-black">
                    <Bell className="h-4 w-4 text-rose-500 animate-bounce" />
                    <span>ACTIVE_STADIUM_ALERTS</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">ALARM TRIGGER</span>
                </div>

                <div className="space-y-3">
                  {activeAlerts.map((act) => (
                    <div 
                      key={act.id} 
                      className={`p-4 border rounded-none ${
                        act.level === "CRITICAL" 
                          ? "bg-red-950/40 border-red-500/30 text-red-200" 
                          : "bg-amber-950/20 border-amber-500/30 text-amber-200"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className={`text-[9px] font-black font-mono uppercase tracking-widest ${act.level === "CRITICAL" ? "text-red-500" : "text-amber-500"}`}>
                          ⚠️ {act.level} LEVEL ALERT
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono">{act.timestamp}</span>
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-tight mt-2 text-white">{act.title}</h4>
                      <p className="text-xs mt-1 leading-relaxed font-mono text-zinc-300">{act.details}</p>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setActiveAlerts(prev => prev.filter(a => a.id !== act.id));
                        }}
                        className="mt-3 text-[9px] font-mono uppercase tracking-wider font-black text-zinc-400 hover:text-white"
                      >
                        Dismiss hazard alert ×
                      </button>
                    </div>
                  ))}

                  {activeAlerts.length === 0 && (
                    <div className="text-center py-8 bg-black border border-white/5 text-zinc-500 text-xs font-mono uppercase">
                      🎉 All active warnings cleared.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </motion.div>
        ) : (
          <motion.div
            key="tactical-command"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            {/* LEFT COLUMN: Sector Density & Volunteer Dispatch Panels (5/12 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-0 border-r border-white/10">
              
              {/* Crowd Density panel */}
              <div className="bg-black border-b border-white/10 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center space-x-2 text-blue-500 font-display font-black tracking-widest text-[10px] uppercase mb-1.5">
                      <Users className="h-3.5 w-3.5" />
                      <span>CROWD_TELEMETRY</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                      LOAD METRICS
                    </h2>
                  </div>
                  
                  <button
                    id="simulate-crowd-density"
                    onClick={onTriggerDensitySimulation}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition cursor-pointer rounded-none self-start sm:self-center"
                  >
                    <span>TRIGGER_PEAK</span>
                  </button>
                </div>

                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  Real-time feed aggregating gate scans, concession queue counters, and stadium perimeter heat indicators.
                </p>

                <div className="space-y-4">
                  {sectors.map((sec) => (
                    <div key={sec.name} className="bg-zinc-950 p-4 border border-white/10 rounded-none">
                      <div className="flex justify-between text-xs mb-2 font-bold uppercase tracking-tight">
                        <span className="text-white">{sec.name}</span>
                        <span className={`font-mono ${
                          sec.status === "Critical" ? "text-red-500" :
                          sec.status === "Heavy" ? "text-amber-500" :
                          "text-emerald-400"
                        }`}>
                          {sec.currentLoadPercentage}% ({sec.currentWaitMinutes}M WAIT)
                        </span>
                      </div>
                      
                      <div className="w-full bg-zinc-900 rounded-none h-2">
                        <div 
                          className={`h-2 rounded-none transition-all duration-700 ${
                            sec.status === "Critical" ? "bg-red-500" :
                            sec.status === "Heavy" ? "bg-amber-500" :
                            "bg-blue-500"
                          }`}
                          style={{ width: `${sec.currentLoadPercentage}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-2.5 font-mono">
                        <span>FLOW: {sec.flowRate.toUpperCase()}</span>
                        <span className={`uppercase text-[9px] px-2 py-0.5 rounded-none border font-black ${
                          sec.status === "Critical" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                          sec.status === "Heavy" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          "bg-zinc-900 text-zinc-400 border-white/10"
                        }`}>
                          {sec.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Volunteer Squad & Steward Manager / Professional Staff Roster */}
              <div className="bg-black p-6 sm:p-8">
                <div className="flex items-center space-x-2 text-blue-500 font-display font-black tracking-widest text-[10px] uppercase mb-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  <span>DISPATCH_SYSTEM</span>
                </div>
                
                {/* Header and Toggle Button Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">
                    {staffTab === "squads" ? "STEWARD SQUADS" : "OPERATIONS STAFF"}
                  </h2>
                  
                  {/* Selector Tabs */}
                  <div className="flex bg-zinc-950 border border-white/10 p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setStaffTab("squads")}
                      className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                        staffTab === "squads"
                          ? "bg-white text-black"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      SQUADS ({volunteerSquads.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStaffTab("staff")}
                      className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                        staffTab === "staff"
                          ? "bg-white text-black"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      STAFF ({opsStaff.length})
                    </button>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  {staffTab === "squads" 
                    ? "Active volunteer support divisions stationed across sectors. Real-time tactical coordination is updated dynamically."
                    : "Stadium duty register mapping credentialed personnel, unique employee codes, live assigned positions, and designations."}
                </p>

                {staffTab === "squads" ? (
                  <div className="space-y-3">
                    {volunteerSquads.map((squad) => (
                      <div 
                        key={squad.id}
                        className="bg-zinc-950 border border-white/10 rounded-none p-4 flex items-center justify-between hover:bg-zinc-900 transition"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 bg-green-500" />
                            <h4 className="text-xs font-black text-white uppercase tracking-tight">{squad.name}</h4>
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-1 font-mono">
                            LEAD: {squad.lead.toUpperCase()} · <strong className="text-zinc-300">{squad.members} MEMBERS</strong>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="block text-[9px] text-blue-400 font-black font-mono bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-none uppercase">
                            {squad.zone}
                          </span>
                          <span className="text-[9px] text-zinc-600 block mt-1.5 font-mono uppercase">
                            STATUS: {squad.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 animate-fade-in">
                    {opsStaff.map((staff) => (
                      <div 
                        key={staff.code}
                        className="bg-zinc-950 border border-white/10 rounded-none p-4 flex flex-col sm:flex-row sm:items-stretch justify-between gap-4 hover:bg-zinc-900 transition"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`w-2.5 h-2.5 ${staff.statusColor} rounded-full`} />
                            <h4 className="text-xs font-black text-white uppercase tracking-tight">{staff.name}</h4>
                            <span className="text-[9px] font-mono text-yellow-400 font-black border border-yellow-400/30 px-1.5 py-0.5 rounded-none bg-yellow-400/5 select-all">
                              {staff.code}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-1.5 font-mono uppercase tracking-tight">
                            ROLE: <strong className="text-zinc-100">{staff.designation}</strong>
                          </div>
                        </div>

                        <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5 flex flex-col justify-center">
                          <span className="block text-[9px] text-zinc-500 uppercase font-black tracking-widest font-mono">LIVE DUTY POSITION</span>
                          <span className="text-xs font-bold text-white uppercase tracking-tight">{staff.position}</span>
                          <span className="block text-[8px] text-zinc-600 font-mono uppercase mt-1">STATUS: {staff.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: GenAI Real-time Incident Decision Support (7/12 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-0 bg-black">
              
              {/* Incident Trigger Card */}
              <div className="border-b border-white/10 p-6 sm:p-8">
                <div className="flex items-center space-x-2 text-yellow-500 font-display font-black tracking-widest text-[10px] uppercase mb-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>INCIDENT_INTELLIGENCE</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase leading-none text-white mb-2">
                  DECISION ENGINE
                </h2>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  Configure matchday crowd incidents. The stadium's neural decision grid immediately drafts custom response protocols and translations.
                </p>

                {/* Quick preset triggers */}
                <div className="mb-6">
                  <span className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-3 font-mono">
                    PRESET_MUTATION_TRIGGERS
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {presetIncidents.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectPreset(p)}
                        className="bg-zinc-950 hover:bg-zinc-900 border border-white/10 hover:border-white/30 rounded-none p-3.5 text-left transition cursor-pointer flex flex-col justify-between h-24"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-black text-white uppercase tracking-tight">{p.type}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-none font-mono font-black uppercase ${
                            p.severity === "critical" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                            p.severity === "high" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                            "bg-zinc-900 text-zinc-400"
                          }`}>
                            {p.severity}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter line-clamp-1">{p.location}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Core Custom Incident Form */}
                <form onSubmit={handleAnalyzeIncident} className="space-y-4 border-t border-white/10 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">INCIDENT_CATEGORY</label>
                      <input
                        type="text"
                        value={incidentType}
                        onChange={(e) => setIncidentType(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/20 rounded-none px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">VENUE_ZONE</label>
                      <input
                        type="text"
                        value={incidentLocation}
                        onChange={(e) => setIncidentLocation(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/20 rounded-none px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">SEVERITY_LEVEL</label>
                      <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as any)}
                        className="w-full bg-zinc-950 border border-white/20 rounded-none px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white uppercase tracking-wider font-bold"
                      >
                        <option value="low">LOW - MONITOR</option>
                        <option value="medium">MEDIUM - STANDBY</option>
                        <option value="high">HIGH - DEPLOY</option>
                        <option value="critical">CRITICAL - EMERGENCY</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">METRIC_ANOMALY_DESCRIPTION</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Details raw feeds..."
                      className="w-full bg-zinc-950 border border-white/20 rounded-none px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      id="submit-incident-analysis"
                      disabled={isProcessing}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-none transition cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{isProcessing ? "FORMULATING STRATEGY..." : "FORMULATE STRATEGY"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Incident Results Panel */}
              <AnimatePresence mode="wait">
                {incidentResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-6 sm:p-8 flex flex-col gap-6"
                  >
                    
                    {/* Result Title row */}
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                      <div className="flex items-center space-x-2">
                        <ClipboardList className="h-5 w-5 text-blue-500" />
                        <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white">TACTICAL PROTOCOL</h3>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-black font-mono px-3 py-1 rounded-none uppercase border ${
                          incidentResult.crowdSafetyLevel === "EVACUATE" || incidentResult.crowdSafetyLevel === "INTERVENE"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}>
                          ACTION: {incidentResult.crowdSafetyLevel}
                        </span>

                        <span className="text-[10px] bg-zinc-950 border border-white/10 text-zinc-300 px-3 py-1 rounded-none font-mono uppercase tracking-wider font-bold">
                          UNITS: {incidentResult.recommendedStaffCount} OFFICERS
                        </span>
                      </div>
                    </div>

                    {/* Step-by-Step Steward Checklist */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center space-x-1.5 font-mono">
                        <CheckSquare className="h-4 w-4 text-emerald-400" />
                        <span>Immediate Safety Directives</span>
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {incidentResult.actionPlan.map((step, idx) => (
                          <div 
                            key={idx}
                            className="bg-zinc-950 border border-white/10 rounded-none p-4 flex items-start space-x-3"
                          >
                            <span className="flex items-center justify-center bg-black text-white text-xs font-mono font-black h-6 w-6 border border-white/20 shrink-0 mt-0.5 rounded-none">
                              {idx + 1}
                            </span>
                            <p className="text-xs text-zinc-300 leading-relaxed font-mono">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Staff Radio Broadcast */}
                    <div className="space-y-3 bg-zinc-950 border border-white/10 p-5 rounded-none">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center space-x-1.5 font-mono">
                        <Radio className="h-4 w-4 text-indigo-400" />
                        <span>Stewards Radio Transmission Code</span>
                      </h4>
                      <p className="text-xs font-mono text-zinc-200 bg-black border border-white/10 p-4 rounded-none leading-relaxed select-all">
                        {incidentResult.staffBroadcast}
                      </p>
                      <span className="block text-[9px] text-zinc-500 font-mono uppercase tracking-widest">
                        *INSTRUCTION: BROADCAST RAW TELEMETRY BLOCK ACROSS DIGITAL COMM CHANNELS.
                      </span>
                    </div>

                    {/* Multilingual PA Announcements */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center space-x-1.5 font-mono">
                        <Megaphone className="h-4 w-4 text-sky-400" />
                        <span>Public Safety Translation Matrix</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-zinc-950 p-4 border border-white/10 rounded-none flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] uppercase font-black tracking-widest text-zinc-400 font-mono border-b border-white/10 pb-1 block">EN_US / ENGLISH</span>
                            <p className="text-xs text-zinc-300 mt-3 font-mono italic leading-relaxed">
                              "{incidentResult.fanAnnouncements.en}"
                            </p>
                          </div>
                        </div>
                        <div className="bg-zinc-950 p-4 border border-white/10 rounded-none flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] uppercase font-black tracking-widest text-zinc-400 font-mono border-b border-white/10 pb-1 block">ES_MX / ESPAÑOL</span>
                            <p className="text-xs text-zinc-300 mt-3 font-mono italic leading-relaxed">
                              "{incidentResult.fanAnnouncements.es}"
                            </p>
                          </div>
                        </div>
                        <div className="bg-zinc-950 p-4 border border-white/10 rounded-none flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] uppercase font-black tracking-widest text-zinc-400 font-mono border-b border-white/10 pb-1 block">FR_FR / FRANÇAIS</span>
                            <p className="text-xs text-zinc-300 mt-3 font-mono italic leading-relaxed">
                              "{incidentResult.fanAnnouncements.fr}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Non-blocking toast message display */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-zinc-900 border-2 border-yellow-500 text-white font-mono text-xs p-4 shadow-2xl uppercase tracking-wider flex items-center space-x-3 rounded-none"
          >
            <span className="text-yellow-500 font-bold">⚠️ SYSTEM_UPDATE:</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
