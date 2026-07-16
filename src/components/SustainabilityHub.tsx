import React, { useState } from "react";
import { Sparkles, Sprout, ShieldAlert, Cpu, Heart, Trees } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SustainabilityData, SustainabilityResponse } from "../types";

interface SustainabilityHubProps {
  initialData: SustainabilityData;
}

export default function SustainabilityHub({ initialData }: SustainabilityHubProps) {
  // Local form sliders state
  const [energy, setEnergy] = useState<number>(initialData.energyUsageKWh);
  const [water, setWater] = useState<number>(initialData.waterRecycledLiters);
  const [waste, setWaste] = useState<number>(initialData.wasteDivertedPercentage);
  const [carbon, setCarbon] = useState<number>(initialData.carbonOffsetTons);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sustainabilityResult, setSustainabilityResult] = useState<SustainabilityResponse | null>({
    ecoScore: 84,
    tips: [
      "Enable high-efficiency HVAC power-save settings during non-peak match hours.",
      "Run waste sorting inspection at concessions to raise landfill diversion past 85%.",
      "Harvest graywater from upper decks for pitch irrigation during overnight sessions."
    ],
    fanSlogan: "Green Pitch, Clean Planet! Join Estadio Azteca in recycling 100% of concessions plastics today! 🌎💚",
    greenMilestone: "Recycled water today is equivalent to filling 5,100 bathtubs."
  });

  // Call Gemini sustainability API
  const handleSustainabilityReview = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/gemini/sustainability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          energyUsageKWh: energy,
          waterRecycledLiters: water,
          wasteDivertedPercentage: waste,
          carbonOffsetTons: carbon
        })
      });

      if (!response.ok) {
        throw new Error("Sustainability service returned an error");
      }

      const data = await response.json();
      setSustainabilityResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze sustainability profile. Using offline environmental model.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 py-0 text-white font-sans">
      
      {/* LEFT COLUMN: Controls & Sliders (5/12 cols) */}
      <div className="lg:col-span-5 bg-black border-r border-white/10 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 text-emerald-500 font-display font-black tracking-widest text-[10px] uppercase mb-1.5">
            <Sprout className="h-3.5 w-3.5" />
            <span>ECO_SYSTEMS_SIMULATOR</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase leading-none text-white mb-2">
            GREEN AZTECA
          </h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Simulate dynamic environmental parameters of Estadio Azteca. Click 'Analyze Resource Profile' to invoke GenAI reviews.
          </p>

          <div className="space-y-6">
            
            {/* Energy Slider */}
            <div className="bg-zinc-950 p-4 border border-white/10 rounded-none">
              <div className="flex justify-between items-center text-xs mb-3 uppercase tracking-tight">
                <span className="text-zinc-300 font-bold flex items-center space-x-1.5 font-mono">
                  <Cpu className="h-3.5 w-3.5 text-amber-500" />
                  <span>Matchday Power Draw</span>
                </span>
                <span className="font-mono text-white font-black">{energy.toLocaleString()} kWh</span>
              </div>
              <input
                type="range"
                min="5000"
                max="25000"
                step="500"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-zinc-900 appearance-none h-2 cursor-pointer"
              />
              <span className="block text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-widest">NORMAL_PEAK: 14,200 kWh</span>
            </div>

            {/* Water Slider */}
            <div className="bg-zinc-950 p-4 border border-white/10 rounded-none">
              <div className="flex justify-between items-center text-xs mb-3 uppercase tracking-tight">
                <span className="text-zinc-300 font-bold flex items-center space-x-1.5 font-mono">
                  <Cpu className="h-3.5 w-3.5 text-sky-400" />
                  <span>Water Harvested</span>
                </span>
                <span className="font-mono text-white font-black">{water.toLocaleString()} Liters</span>
              </div>
              <input
                type="range"
                min="10000"
                max="250000"
                step="5000"
                value={water}
                onChange={(e) => setWater(Number(e.target.value))}
                className="w-full accent-sky-500 bg-zinc-900 appearance-none h-2 cursor-pointer"
              />
              <span className="block text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-widest">NORMAL_PEAK: 128,400 Liters</span>
            </div>

            {/* Solid Waste Slider */}
            <div className="bg-zinc-950 p-4 border border-white/10 rounded-none">
              <div className="flex justify-between items-center text-xs mb-3 uppercase tracking-tight">
                <span className="text-zinc-300 font-bold flex items-center space-x-1.5 font-mono">
                  <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Landfill Diversion</span>
                </span>
                <span className="font-mono text-white font-black">{waste}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="1"
                value={waste}
                onChange={(e) => setWaste(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-zinc-900 appearance-none h-2 cursor-pointer"
              />
              <span className="block text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-widest">TOURNAMENT_GOAL: 81%</span>
            </div>

            {/* Carbon Offset Slider */}
            <div className="bg-zinc-950 p-4 border border-white/10 rounded-none">
              <div className="flex justify-between items-center text-xs mb-3 uppercase tracking-tight">
                <span className="text-zinc-300 font-bold flex items-center space-x-1.5 font-mono">
                  <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Matchday Carbon Credits</span>
                </span>
                <span className="font-mono text-white font-black">{carbon} Tons</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={carbon}
                onChange={(e) => setCarbon(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-zinc-900 appearance-none h-2 cursor-pointer"
              />
              <span className="block text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-widest">GOAL: 50+ Tons per fixture</span>
            </div>

          </div>
        </div>

        <button
          onClick={handleSustainabilityReview}
          disabled={isAnalyzing}
          className="mt-8 flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 hover:text-slate-950 font-black text-xs uppercase tracking-widest py-4 rounded-none transition cursor-pointer disabled:opacity-50 w-full"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isAnalyzing ? "ANALYZING FOOTPRINT..." : "ANALYZE RESOURCE PROFILE"}</span>
        </button>
      </div>

      {/* RIGHT COLUMN: GenAI Optimization Output (7/12 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-0 bg-black">
        
        <AnimatePresence mode="wait">
          {sustainabilityResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-0"
            >
              
              {/* Top Summary Card */}
              <div className="border-b border-white/10 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Eco Score dial mockup */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-zinc-950 border border-white/10 rounded-none h-full">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        className="stroke-zinc-900 fill-none"
                        strokeWidth="8"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        className="stroke-emerald-500 fill-none transition-all duration-1000"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - sustainabilityResult.ecoScore / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-3xl font-black font-mono text-white">{sustainabilityResult.ecoScore}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-black mt-3 font-mono">ECO-SCORE_INDEX</span>
                </div>

                {/* Milestones explanation */}
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center space-x-1.5 text-blue-500 font-mono text-[10px] uppercase tracking-widest font-black">
                    <Trees className="h-4 w-4" />
                    <span>Resource Offset Metric</span>
                  </div>
                  <p className="text-base font-black text-white uppercase tracking-tight leading-none font-display">
                    ESTADIO AZTECA HARVEST SUMMARY
                  </p>
                  <p className="text-xs text-zinc-400 italic font-mono leading-relaxed">
                    🌎 {sustainabilityResult.greenMilestone}
                  </p>
                </div>

              </div>

              {/* Big Screen Digital Display Board Mockup */}
              <div className="bg-zinc-950 border-b border-white/10 p-6 sm:p-8 relative overflow-hidden cyber-grid">
                <div className="absolute top-4 left-4 bg-black text-[9px] text-emerald-400 font-mono font-black px-2.5 py-1 rounded-none uppercase border border-emerald-500/30">
                  LED_PROMOTIONAL_FEED
                </div>
                
                <div className="py-10 px-4 flex flex-col items-center justify-center text-center">
                  <p className="text-lg sm:text-2xl font-black font-display tracking-tight text-white uppercase italic leading-tight max-w-lg">
                    "{sustainabilityResult.fanSlogan}"
                  </p>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest mt-6 font-mono font-black">
                    BROADCASTING TO 87,523 FANS IN THE SECTORS
                  </span>
                </div>
              </div>

              {/* Eco tips list */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center space-x-2 text-blue-500 font-display font-black tracking-widest text-[10px] uppercase mb-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>AI_ECOLOGICAL_RECOMMENDATIONS</span>
                </div>
                <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">
                  GREEN BLUEPRINTS
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {sustainabilityResult.tips.map((tip, index) => (
                    <div 
                      key={index}
                      className="bg-zinc-950 border border-white/10 hover:border-white/20 transition rounded-none p-5 flex items-start space-x-4"
                    >
                      <div className="p-2 bg-black border border-white/10 text-emerald-400 rounded-none mt-0.5">
                        <Heart className="h-4 w-4" />
                      </div>
                      <p className="text-xs text-zinc-300 font-mono leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
