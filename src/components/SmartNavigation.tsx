import React, { useState, useEffect } from "react";
import { 
  Compass, Navigation, MapPin, ShieldAlert, Footprints, 
  Flame, Sparkles, Accessibility, Info, RefreshCw, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Facility location coordinates on our SVG stage (400x240)
interface LocationNode {
  id: string;
  name: string;
  type: "gate" | "seat" | "facility" | "exit";
  x: number;
  y: number;
  icon: string;
  category: "Gate" | "Seat" | "Washroom" | "Food" | "Merch" | "First Aid" | "Charging" | "Prayer" | "Wheelchair" | "Emergency Exit";
}

const NAV_LOCATIONS: LocationNode[] = [
  { id: "gate-a", name: "Gate A (North Entrance)", type: "gate", x: 200, y: 35, icon: "🚪", category: "Gate" },
  { id: "gate-b", name: "Gate B (East Entrance)", type: "gate", x: 330, y: 120, icon: "🚪", category: "Gate" },
  { id: "gate-c", name: "Gate C (South Entrance)", type: "gate", x: 200, y: 205, icon: "🚪", category: "Gate" },
  { id: "gate-d", name: "Gate D (West Entrance)", type: "gate", x: 70, y: 120, icon: "🚪", category: "Gate" },
  
  { id: "seat-104", name: "Section 104 (Row G Seat 42)", type: "seat", x: 140, y: 80, icon: "💺", category: "Seat" },
  { id: "seat-112", name: "Section 112 (Row B Seat 12)", type: "seat", x: 260, y: 80, icon: "💺", category: "Seat" },
  { id: "seat-204", name: "Section 204 (Upper Deck)", type: "seat", x: 130, y: 160, icon: "💺", category: "Seat" },
  
  { id: "washroom-n", name: "North Restrooms", type: "facility", x: 170, y: 55, icon: "🚻", category: "Washroom" },
  { id: "washroom-s", name: "South Restrooms", type: "facility", x: 230, y: 185, icon: "🚻", category: "Washroom" },
  
  { id: "food-1", name: "Azteca Taco Plaza (Concessions)", type: "facility", x: 280, y: 150, icon: "🌮", category: "Food" },
  { id: "food-2", name: "Halftime Burger Stall", type: "facility", x: 110, y: 140, icon: "🍔", category: "Food" },
  
  { id: "merch-1", name: "Official FIFA Merch Megastore", type: "facility", x: 200, y: 100, icon: "👕", category: "Merch" },
  { id: "firstaid-alpha", name: "Medical Dispatch Post Alpha", type: "facility", x: 110, y: 90, icon: "🚨", category: "First Aid" },
  { id: "charging-west", name: "West Concourse Power Hub", type: "facility", x: 100, y: 170, icon: "⚡", category: "Charging" },
  { id: "prayer-north", name: "Multifaith Meditation & Prayer Room", type: "facility", x: 230, y: 55, icon: "🙏", category: "Prayer" },
  
  { id: "wheelchair-ramp", name: "West Sector Wheelchair Lift", type: "facility", x: 80, y: 145, icon: "♿", category: "Wheelchair" },
  { id: "emergency-exit-1", name: "North-West Evacuation Hatch 1", type: "exit", x: 95, y: 55, icon: "🏃", category: "Emergency Exit" },
  { id: "emergency-exit-2", name: "South-East Evacuation Hatch 2", type: "exit", x: 305, y: 185, icon: "🏃", category: "Emergency Exit" },
];

export default function SmartNavigation() {
  const [startPoint, setStartPoint] = useState<string>("gate-c");
  const [endPoint, setEndPoint] = useState<string>("seat-104");

  // Generate high-fidelity seating blocks aligned with Category colors
  const seatingBlocks = React.useMemo(() => {
    const blocks: any[] = [];
    const cx = 200;
    const cy = 120;
    
    // Ring 1 (Inner, 100s Level): rx=80, ry=52, 16 blocks
    for (let i = 0; i < 16; i++) {
      const angle = (i * 2 * Math.PI) / 16;
      const rx = 80;
      const ry = 52;
      const x = cx + rx * Math.cos(angle);
      const y = cy + ry * Math.sin(angle);
      const angleDeg = (angle * 180) / Math.PI;
      
      // Category 1 (Gold) on East/West sides (near cos = 1 or -1)
      const cosVal = Math.abs(Math.cos(angle));
      const category = cosVal > 0.45 ? 1 : 2; // Cat 1 = Gold, Cat 2 = Red
      const sectionNum = 101 + i;
      
      // Four corner accessible seating areas
      const isAccessible = (i % 4 === 1);
      
      blocks.push({
        id: `seat-104`, // maps to NAV_LOCATIONS node for direct routing
        actualId: `sec-${sectionNum}`,
        label: `${sectionNum}`,
        category,
        x,
        y,
        angle: angleDeg,
        isAccessible,
        ring: "inner"
      });
    }
    
    // Ring 2 (Outer, 200s Level): rx=110, ry=78, 22 blocks
    for (let i = 0; i < 22; i++) {
      const angle = (i * 2 * Math.PI) / 22;
      const rx = 110;
      const ry = 78;
      const x = cx + rx * Math.cos(angle);
      const y = cy + ry * Math.sin(angle);
      const angleDeg = (angle * 180) / Math.PI;
      
      // Category 3 (Blue) on East/West sides, Category 4 (Green) on North/South ends
      const cosVal = Math.abs(Math.cos(angle));
      const category = cosVal > 0.45 ? 3 : 4; // Cat 3 = Blue, Cat 4 = Green
      const sectionNum = 201 + i;
      
      blocks.push({
        id: `seat-204`, // maps to NAV_LOCATIONS node for direct routing
        actualId: `sec-${sectionNum}`,
        label: `${sectionNum}`,
        category,
        x,
        y,
        angle: angleDeg,
        isAccessible: false,
        ring: "outer"
      });
    }
    
    return blocks;
  }, []);
  
  // Simulated map conditions
  const [isHallwayCrowded, setIsHallwayCrowded] = useState<boolean>(false);
  const [isGateCClosed, setIsGateCClosed] = useState<boolean>(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);

  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Rerouting logic triggers updates to path
  const [pathCoordinates, setPathCoordinates] = useState<{ x: number; y: number }[]>([]);
  const [pathMessage, setPathMessage] = useState<string>("");
  const [routeSteps, setRouteSteps] = useState<string[]>([]);
  const [isRerouting, setIsRerouting] = useState<boolean>(false);

  // Filtered locations shown as points of interest
  const categories = ["All", "Gate", "Seat", "Washroom", "Food", "Merch", "First Aid", "Charging", "Prayer", "Wheelchair", "Emergency Exit"];

  // Run path planning calculation whenever nodes or map conditions change
  useEffect(() => {
    setIsRerouting(true);
    const timer = setTimeout(() => {
      calculateRoute();
      setIsRerouting(false);
    }, 400); // simulation calculation delay
    return () => clearTimeout(timer);
  }, [startPoint, endPoint, isHallwayCrowded, isGateCClosed, isEmergencyActive]);

  // Adjust startPoint if Gate C closes
  useEffect(() => {
    if (isGateCClosed && startPoint === "gate-c") {
      setStartPoint("gate-d"); // Fall back to Gate D
    }
  }, [isGateCClosed]);

  const calculateRoute = () => {
    const startNode = NAV_LOCATIONS.find(n => n.id === startPoint);
    const endNode = NAV_LOCATIONS.find(n => n.id === endPoint);
    
    if (!startNode || !endNode) return;

    let coords: { x: number; y: number }[] = [];
    let steps: string[] = [];
    let message = "AI dynamic route active. Enjoy your safe journey!";

    // Base coordinate plotting
    coords.push({ x: startNode.x, y: startNode.y });

    // Middle routing points depending on map conditions
    if (isEmergencyActive) {
      // In emergency, completely avoid the central corridor and Section 104 first-aid perimeter
      coords.push({ x: 310, y: 60 }); // reroute via North-East Outer Corridor
      coords.push({ x: 250, y: 150 });
      message = "⚠️ EMERGENCY ROUTE ACTIVATED! Core concourse closed. Guided via North-East secure fireway escape route.";
      steps = [
        `Exit ${startNode.name} and bypass the core stadium escalators.`,
        "Follow neon green evacuation banners along the North-East outer ring walkway.",
        "Check-in at the crowd marshal point near Sector 200.",
        `Proceed carefully to your destination: ${endNode.name}.`
      ];
    } else if (isGateCClosed && (startPoint === "gate-c" || endPoint === "gate-c")) {
      message = "⚠️ South Gate C is CLOSED for ingress controls. Automatically rerouted to West Gate D.";
      // Change path starting from Gate D coordinates
      const fallbackStart = NAV_LOCATIONS.find(n => n.id === "gate-d")!;
      coords = [{ x: fallbackStart.x, y: fallbackStart.y }];
      coords.push({ x: 120, y: 160 });
      coords.push({ x: endNode.x, y: endNode.y });
      steps = [
        "Primary Entrance Gate C Closed. Access through West Gate D.",
        "Move through the low-density West ramp structures (Wheelchair accessible).",
        "Merge into the Inner Ring Concourse.",
        `Arrive at destination: ${endNode.name}.`
      ];
    } else if (isHallwayCrowded) {
      // If primary central walkway is congested, route via outer ring perimeter
      coords.push({ x: 320, y: 70 }); // bypass central sector
      coords.push({ x: endNode.x, y: endNode.y });
      message = "⚠️ AI REROUTING: High congestion detected along the main Central Corridor. Diverting via North-East Low-Density corridor (+2 mins).";
      steps = [
        `Depart ${startNode.name} following the green low-congestion signs.`,
        "Pivot away from the main Concourse food courts to avoid queue backups.",
        "Pass through the quiet North-East walkway (near Prayer Room).",
        `Arrive comfortably at: ${endNode.name}.`
      ];
    } else {
      // Standard path
      // Draw intermediate steps
      const midX = (startNode.x + endNode.x) / 2;
      const midY = (startNode.y + endNode.y) / 2;
      
      // Add subtle curve point
      coords.push({ x: midX, y: midY + 15 });
      coords.push({ x: endNode.x, y: endNode.y });
      message = "Optimal direct route calculated. Clear corridors ahead.";
      steps = [
        `Begin walking from ${startNode.name} toward the stadium inner plaza.`,
        "Take the nearest escalator to Level 1 Concourse.",
        "Pass by the Official FIFA Merchandise Store.",
        `Your destination: ${endNode.name} is on your immediate left.`
      ];
    }

    setPathCoordinates(coords);
    setPathMessage(message);
    setRouteSteps(steps);
  };

  const filteredLocations = NAV_LOCATIONS.filter(loc => 
    activeCategory === "All" || loc.category === activeCategory
  );

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-none p-6 sm:p-8" id="smart-indoor-nav-panel">
      
      {/* Title & Stats Grid */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-500 font-mono text-[10px] uppercase tracking-widest font-black mb-1.5">
            <Navigation className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            <span>AI_INDOOR_NAVIGATION_SYSTEM</span>
          </div>
          <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">
            AZTECA INDOOR MAP
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-1 rounded-none border border-emerald-500/20 text-[10px]">
              <MapPin className="h-3.5 w-3.5" />
              <span>ESTADIO AZTECA · COYOACÁN, CDMX, MEXICO (19.3029° N, 99.1505° W)</span>
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 max-w-xl leading-relaxed">
            Real-time visual route guidance inside Estadio Azteca, located at Calz. de Tlalpan 3465, Santa Úrsula Coapa. Avoid bottlenecks with live pathfinding alerts.
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-[9px] font-mono font-black border px-2 py-1 rounded-none uppercase ${
            isEmergencyActive 
              ? "bg-red-500/10 text-red-500 border-red-500/30 animate-pulse" 
              : "bg-zinc-900 text-zinc-500 border-white/10"
          }`}>
            🚨 EMERGENCY_STATUS: {isEmergencyActive ? "ACTIVE EVAC" : "SECURE"}
          </span>
          <span className={`text-[9px] font-mono font-black border px-2 py-1 rounded-none uppercase ${
            isHallwayCrowded 
              ? "bg-amber-500/10 text-amber-500 border-amber-500/30" 
              : "bg-zinc-900 text-zinc-500 border-white/10"
          }`}>
            ⚠️ CORRIDOR_LOAD: {isHallwayCrowded ? "CRITICAL" : "OPTIMAL"}
          </span>
        </div>
      </div>

      {/* Rerouting Toggles Simulation Board */}
      <div className="bg-black border border-white/10 p-4 mb-6">
        <span className="block text-[9px] text-zinc-500 font-mono font-black uppercase tracking-widest mb-3">
          SIMULATED CONSTRAINTS (MUTATE THE MAP LAYOUT & WATCH DYNAMIC REROUTING)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <button
            onClick={() => setIsHallwayCrowded(!isHallwayCrowded)}
            className={`px-4 py-2.5 text-xs font-mono font-bold tracking-tight rounded-none uppercase border transition-all cursor-pointer flex items-center justify-between ${
              isHallwayCrowded
                ? "bg-amber-500 text-black border-amber-400"
                : "bg-zinc-950 text-zinc-400 border-white/5 hover:border-white/10"
            }`}
          >
            <span>🚶 HALWAY CROWDING</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-black/10 text-current">
              {isHallwayCrowded ? "ON" : "OFF"}
            </span>
          </button>

          <button
            onClick={() => setIsGateCClosed(!isGateCClosed)}
            className={`px-4 py-2.5 text-xs font-mono font-bold tracking-tight rounded-none uppercase border transition-all cursor-pointer flex items-center justify-between ${
              isGateCClosed
                ? "bg-red-500 text-white border-red-400"
                : "bg-zinc-950 text-zinc-400 border-white/5 hover:border-white/10"
            }`}
          >
            <span>🚪 CLOSE GATE C</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-black/10 text-current">
              {isGateCClosed ? "CLOSED" : "OPEN"}
            </span>
          </button>

          <button
            onClick={() => setIsEmergencyActive(!isEmergencyActive)}
            className={`px-4 py-2.5 text-xs font-mono font-bold tracking-tight rounded-none uppercase border transition-all cursor-pointer flex items-center justify-between ${
              isEmergencyActive
                ? "bg-red-600 text-white border-red-500 animate-pulse"
                : "bg-zinc-950 text-zinc-400 border-white/5 hover:border-white/10"
            }`}
          >
            <span>🔥 EVAC EMERGENCY</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-black/10 text-current">
              {isEmergencyActive ? "ACTIVE" : "STANDBY"}
            </span>
          </button>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG NAV MAP (7/12 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Facility quick filter bar */}
          <div className="flex overflow-x-auto pb-2 scrollbar-none gap-1 bg-black p-1 border border-white/5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-tight rounded-none cursor-pointer transition whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-emerald-500 text-slate-950 font-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Map canvas visualizer */}
          <div className="relative bg-black border border-white/10 rounded-none p-4 flex flex-col items-center justify-center min-h-[300px] overflow-hidden cyber-grid">
            
            <div className="absolute top-3 left-3 bg-zinc-950 text-[9px] text-zinc-500 border border-white/5 font-mono px-2 py-0.5 uppercase">
              GRID: STADIUM_LEVEL_1_CONCOURSE
            </div>

            {/* Rerouting overlay banner */}
            <AnimatePresence>
              {isRerouting && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 font-mono text-xs uppercase text-emerald-400 tracking-widest font-black"
                >
                  <RefreshCw className="h-5 w-5 animate-spin mr-3 text-emerald-400" />
                  <span>AI RECALCULATING ROUTE SAFEWAYS...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <svg viewBox="0 0 400 240" className="w-full h-auto drop-shadow-2xl select-none z-0">
              
              {/* Outer boundary circular wall representation of Aztec */}
              <ellipse cx="200" cy="120" rx="150" ry="105" className="fill-none stroke-white/10 stroke-1" />
              <ellipse cx="200" cy="120" rx="140" ry="95" className="fill-none stroke-white/5 stroke-1" />
              
              {/* Concourse Walkways representation */}
              <ellipse cx="200" cy="120" rx="115" ry="75" className="fill-none stroke-white/10 stroke-[0.5px]" strokeDasharray="3,3" />
              <ellipse cx="200" cy="120" rx="90" ry="55" className="fill-none stroke-white/5 stroke-[0.5px]" />

              {/* Pitch Area with detailed lines */}
              <rect x="150" y="90" width="100" height="60" rx="3" fill="#166534" stroke="#ffffff" strokeWidth="0.8" className="opacity-90" />
              <line x1="200" y1="90" x2="200" y2="150" stroke="#ffffff" strokeWidth="0.8" />
              <circle cx="200" cy="120" r="12" fill="none" stroke="#ffffff" strokeWidth="0.8" />
              <circle cx="200" cy="120" r="1.5" fill="#ffffff" />
              
              {/* Penalty boxes */}
              <rect x="150" y="102" width="12" height="36" fill="none" stroke="#ffffff" strokeWidth="0.8" />
              <rect x="238" y="102" width="12" height="36" fill="none" stroke="#ffffff" strokeWidth="0.8" />
              
              {/* Goal Area */}
              <rect x="150" y="110" width="4" height="20" fill="none" stroke="#ffffff" strokeWidth="0.6" />
              <rect x="246" y="110" width="4" height="20" fill="none" stroke="#ffffff" strokeWidth="0.6" />
              
              <text x="200" y="145" textAnchor="middle" className="text-[6px] fill-white/40 font-mono tracking-widest uppercase font-black">PITCH_ZONE</text>

              {/* High-fidelity color-coded seating blocks */}
              {seatingBlocks.map((b) => {
                const isSelected = endPoint === b.id;
                return (
                  <g 
                    key={b.actualId} 
                    transform={`translate(${b.x}, ${b.y}) rotate(${b.angle + 90})`} 
                    className="cursor-pointer group/block"
                    onClick={() => {
                      setEndPoint(b.id);
                    }}
                  >
                    <title>Section {b.label} - Category {b.category}</title>
                    <rect
                      x="-6"
                      y="-4"
                      width="12"
                      height="8"
                      rx="0.5"
                      fill={
                        b.category === 1 ? "#fbbf24" : // Gold
                        b.category === 2 ? "#ef4444" : // Red
                        b.category === 3 ? "#3b82f6" : // Blue
                        "#22c55e"                      // Green
                      }
                      className={`stroke-black/30 group-hover/block:stroke-white transition duration-200 stroke-[0.5px] ${
                        isSelected ? "stroke-white stroke-[1.2px]" : ""
                      }`}
                    />
                    <text
                      x="0"
                      y="1.5"
                      textAnchor="middle"
                      fontSize="3.8px"
                      fill="#000000"
                      fontWeight="black"
                      className="select-none pointer-events-none"
                    >
                      {b.label}
                    </text>
                    {b.isAccessible && (
                      <text x="0" y="-5.5" textAnchor="middle" fontSize="6px" fill="#3b82f6" fontWeight="bold">♿</text>
                    )}
                  </g>
                );
              })}

              {/* Congested area indicator */}
              {isHallwayCrowded && (
                <g>
                  <circle cx="280" cy="100" r="24" className="fill-amber-500/10 stroke-amber-500/20 stroke-1 animate-pulse" />
                  <text x="280" y="96" textAnchor="middle" className="text-[7px] fill-amber-500 font-mono uppercase font-black">HEAVY_LOAD</text>
                  <text x="280" y="104" textAnchor="middle" className="text-[6px] fill-amber-500/70 font-mono">STANDS_ENTRY</text>
                </g>
              )}

              {/* Emergency indicator */}
              {isEmergencyActive && (
                <g>
                  <circle cx="140" cy="80" r="30" className="fill-red-500/20 stroke-red-500/30 stroke-1 animate-ping" />
                  <text x="140" y="74" textAnchor="middle" className="text-[8px] fill-red-500 font-mono uppercase font-black tracking-wide">⚠️ EMERGENCY</text>
                  <text x="140" y="84" textAnchor="middle" className="text-[6px] fill-red-400 font-mono uppercase">SEC-104 CLOSED</text>
                </g>
              )}

              {/* Gate C closed overlay */}
              {isGateCClosed && (
                <g>
                  <line x1="180" y1="205" x2="220" y2="205" className="stroke-red-500 stroke-2" />
                  <text x="200" y="218" textAnchor="middle" className="text-[7px] fill-red-500 font-mono uppercase font-bold">GATE C CLOSED</text>
                </g>
              )}

              {/* Draw AI Calculated routing path lines */}
              {pathCoordinates.length >= 2 && (
                <g>
                  {/* Glowing background line */}
                  <path
                    d={`M ${pathCoordinates.map(c => `${c.x},${c.y}`).join(" L ")}`}
                    className="fill-none stroke-emerald-500/40 stroke-[4px] stroke-linecap-round"
                  />
                  {/* Animated dash line */}
                  <path
                    d={`M ${pathCoordinates.map(c => `${c.x},${c.y}`).join(" L ")}`}
                    className="fill-none stroke-emerald-400 stroke-[2px] stroke-linecap-round animate-dash"
                    strokeDasharray="8,8"
                  />
                </g>
              )}

              {/* Plot Facilities/Nodes */}
              {NAV_LOCATIONS.map((loc) => {
                const isSelectedStart = loc.id === startPoint;
                const isSelectedEnd = loc.id === endPoint;
                const isFiltered = activeCategory === "All" || loc.category === activeCategory;
                
                // Hide nodes that aren't filtered to keep map tidy, unless selected
                if (!isFiltered && !isSelectedStart && !isSelectedEnd) return null;

                return (
                  <g key={loc.id} className="cursor-pointer group">
                    {/* Hover tooltip representation in SVG */}
                    <title>{loc.name} ({loc.category})</title>
                    
                    {/* Pulsing highlights for start/end selection */}
                    {isSelectedStart && (
                      <circle cx={loc.x} cy={loc.y} r="14" className="fill-blue-500/20 stroke-blue-500 stroke-1 animate-ping" />
                    )}
                    {isSelectedEnd && (
                      <circle cx={loc.x} cy={loc.y} r="14" className="fill-emerald-500/20 stroke-emerald-500 stroke-1 animate-ping" />
                    )}

                    {/* Node Dot */}
                    <circle 
                      cx={loc.x} 
                      cy={loc.y} 
                      r={isSelectedStart || isSelectedEnd ? "7" : "5"} 
                      className={`transition-all duration-300 ${
                        isSelectedStart ? "fill-blue-500 stroke-white stroke-2" :
                        isSelectedEnd ? "fill-emerald-500 stroke-white stroke-2" :
                        loc.type === "gate" ? "fill-zinc-800 stroke-yellow-500 stroke-1" :
                        loc.type === "exit" ? "fill-red-950 stroke-red-500 stroke-1" :
                        "fill-zinc-900 stroke-zinc-700 stroke-1 group-hover:stroke-white"
                      }`} 
                    />
                    
                    {/* Mini Icon indicator above dot */}
                    <text 
                      x={loc.x} 
                      y={loc.y - 8} 
                      textAnchor="middle" 
                      className="text-[10px] select-none"
                    >
                      {isSelectedStart ? "🔵" : isSelectedEnd ? "🟢" : loc.icon}
                    </text>

                    {/* Label */}
                    {(isSelectedStart || isSelectedEnd || activeCategory !== "All") && (
                      <text 
                        x={loc.x} 
                        y={loc.y + 12} 
                        textAnchor="middle" 
                        className={`text-[7px] font-mono font-bold tracking-tight uppercase ${
                          isSelectedStart ? "fill-blue-400" :
                          isSelectedEnd ? "fill-emerald-400" :
                          "fill-zinc-400"
                        }`}
                      >
                        {loc.name.split(" (")[0].substring(0, 15)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Seating Category Legend */}
            <div className="w-full mt-4 border-t border-white/10 pt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-2.5 bg-[#fbbf24] border border-black/20 block rounded-sm" />
                <span className="text-zinc-400 font-bold">CATEGORY 1 (GOLD)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-2.5 bg-[#ef4444] border border-black/20 block rounded-sm" />
                <span className="text-zinc-400 font-bold">CATEGORY 2 (RED)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-2.5 bg-[#3b82f6] border border-black/20 block rounded-sm" />
                <span className="text-zinc-400 font-bold">CATEGORY 3 (BLUE)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-2.5 bg-[#22c55e] border border-black/20 block rounded-sm" />
                <span className="text-zinc-400 font-bold">CATEGORY 4 (GREEN)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-blue-400 font-extrabold text-[12px]">♿</span>
                <span className="text-zinc-400 font-bold">ACCESSIBLE SEATING</span>
              </span>
            </div>
          </div>
        </div>

        {/* CONTROLS & DIRECTIONS (5/12 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-900 border border-white/5 p-5">
          
          {/* Pickers Form */}
          <div className="space-y-4">
            
            <div className="flex items-center space-x-1.5 text-blue-500 font-mono text-[9px] uppercase tracking-widest font-black">
              <Compass className="h-3.5 w-3.5" />
              <span>ROUTING_COORDINATES</span>
            </div>

            {/* Start point Selector */}
            <div>
              <label className="block text-[9px] font-mono font-black text-zinc-500 uppercase tracking-wider mb-1.5">
                Start point (Where are you?)
              </label>
              <select
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                disabled={isEmergencyActive}
                className="w-full bg-black border border-white/10 text-white text-xs font-mono rounded-none px-3 py-2.5 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              >
                {NAV_LOCATIONS.filter(l => l.type === "gate" || l.type === "facility").map((loc) => (
                  <option 
                    key={loc.id} 
                    value={loc.id}
                    disabled={isGateCClosed && loc.id === "gate-c"}
                  >
                    {loc.icon} {loc.name} {isGateCClosed && loc.id === "gate-c" ? "(CLOSED)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* End point Selector */}
            <div>
              <label className="block text-[9px] font-mono font-black text-zinc-500 uppercase tracking-wider mb-1.5">
                Destination (What do you need?)
              </label>
              <select
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                className="w-full bg-black border border-white/10 text-white text-xs font-mono rounded-none px-3 py-2.5 focus:outline-none focus:border-emerald-500"
              >
                {/* Categorize destination items */}
                <optgroup label="My Matchday Seats" className="bg-black text-zinc-400 font-mono">
                  {NAV_LOCATIONS.filter(l => l.type === "seat").map(loc => (
                    <option key={loc.id} value={loc.id} className="text-white">{loc.icon} {loc.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Vital Support Facilities" className="bg-black text-zinc-400 font-mono">
                  {NAV_LOCATIONS.filter(l => l.type === "facility" && l.id !== "wheelchair-ramp").map(loc => (
                    <option key={loc.id} value={loc.id} className="text-white">{loc.icon} {loc.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Accessibility & Escape Outlets" className="bg-black text-zinc-400 font-mono">
                  {NAV_LOCATIONS.filter(l => l.type === "exit" || l.id === "wheelchair-ramp").map(loc => (
                    <option key={loc.id} value={loc.id} className="text-white">{loc.icon} {loc.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Dynamic AI Banner */}
            <div className={`p-3.5 border text-xs font-mono leading-relaxed mt-2 ${
              isEmergencyActive 
                ? "bg-red-500/10 border-red-500/30 text-red-400" 
                : isHallwayCrowded || isGateCClosed
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-black border-white/10 text-zinc-300"
            }`}>
              <div className="flex items-start space-x-2">
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-current animate-pulse" />
                <span>{pathMessage}</span>
              </div>
            </div>

          </div>

          {/* Render Route Instructions Steps */}
          <div className="mt-6 border-t border-white/10 pt-4 space-y-3">
            <span className="block text-[9px] text-zinc-500 font-mono font-black uppercase tracking-widest flex items-center">
              <Footprints className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
              STRIKE_PATH_DIRECTIONS
            </span>

            <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-thin pr-1">
              {routeSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-2 text-[11px] font-mono">
                  <span className="text-emerald-400 shrink-0 font-black">{index + 1}.</span>
                  <span className="text-zinc-300 leading-normal">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
