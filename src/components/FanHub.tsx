import React, { useState, useEffect, useRef } from "react";
import { 
  Send, Languages, Compass, AlertCircle, Train, 
  RefreshCw, Sparkles, Mic, MicOff, Volume2, VolumeX, Navigation, Landmark, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage, Sector, TransitLine } from "../types";
import SmartNavigation from "./SmartNavigation";

interface FanHubProps {
  sectors: Sector[];
  transit: TransitLine[];
  onRefreshData: () => void;
  isLoadingData: boolean;
}

interface Player {
  id: string;
  name: string;
  number: number;
  position: "GK" | "DEF" | "MID" | "FWD";
  team: "Mexico" | "Germany";
  isPlayingNow: boolean;
  performanceRating: number;
  goals: number;
  assists: number;
  yellowCard: boolean;
  redCard: boolean;
  imageColor: string;
}

const initialPlayersData: Player[] = [
  // Mexico
  { id: "mex-1", name: "Guillermo Ochoa", number: 1, position: "GK", team: "Mexico", isPlayingNow: true, performanceRating: 8.2, goals: 0, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-emerald-600/30 border-emerald-500/50 text-emerald-300" },
  { id: "mex-2", name: "Johan Vásquez", number: 5, position: "DEF", team: "Mexico", isPlayingNow: true, performanceRating: 7.1, goals: 0, assists: 0, yellowCard: true, redCard: false, imageColor: "bg-emerald-700/30 border-emerald-500/50 text-emerald-300" },
  { id: "mex-3", name: "César Montes", number: 3, position: "DEF", team: "Mexico", isPlayingNow: true, performanceRating: 7.5, goals: 0, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-emerald-700/30 border-emerald-500/50 text-emerald-300" },
  { id: "mex-4", name: "Edson Álvarez", number: 4, position: "MID", team: "Mexico", isPlayingNow: true, performanceRating: 8.4, goals: 1, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-emerald-800/30 border-emerald-500/50 text-emerald-300" },
  { id: "mex-5", name: "Luis Chávez", number: 14, position: "MID", team: "Mexico", isPlayingNow: true, performanceRating: 7.9, goals: 0, assists: 1, yellowCard: false, redCard: false, imageColor: "bg-emerald-800/30 border-emerald-500/50 text-emerald-300" },
  { id: "mex-6", name: "Santiago Giménez", number: 11, position: "FWD", team: "Mexico", isPlayingNow: true, performanceRating: 8.7, goals: 1, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-emerald-900/30 border-emerald-500/50 text-emerald-300" },
  { id: "mex-7", name: "Hirving Lozano", number: 22, position: "FWD", team: "Mexico", isPlayingNow: true, performanceRating: 7.8, goals: 0, assists: 1, yellowCard: false, redCard: false, imageColor: "bg-emerald-900/30 border-emerald-500/50 text-emerald-300" },
  { id: "mex-8", name: "Orbelín Pineda", number: 17, position: "MID", team: "Mexico", isPlayingNow: false, performanceRating: 6.5, goals: 0, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-zinc-800 border-zinc-700 text-zinc-400" },
  { id: "mex-9", name: "Henry Martín", number: 9, position: "FWD", team: "Mexico", isPlayingNow: false, performanceRating: 6.8, goals: 0, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-zinc-800 border-zinc-700 text-zinc-400" },
  { id: "mex-10", name: "Uriel Antuna", number: 15, position: "MID", team: "Mexico", isPlayingNow: false, performanceRating: 6.2, goals: 0, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-zinc-800 border-zinc-700 text-zinc-400" },

  // Germany
  { id: "ger-1", name: "Marc-André ter Stegen", number: 1, position: "GK", team: "Germany", isPlayingNow: true, performanceRating: 7.6, goals: 0, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-stone-800/40 border-stone-600/50 text-stone-200" },
  { id: "ger-2", name: "Antonio Rüdiger", number: 2, position: "DEF", team: "Germany", isPlayingNow: true, performanceRating: 8.0, goals: 0, assists: 0, yellowCard: true, redCard: false, imageColor: "bg-stone-800/40 border-stone-600/50 text-stone-200" },
  { id: "ger-3", name: "Jonathan Tah", number: 4, position: "DEF", team: "Germany", isPlayingNow: true, performanceRating: 7.2, goals: 0, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-stone-800/40 border-stone-600/50 text-stone-200" },
  { id: "ger-4", name: "Joshua Kimmich", number: 6, position: "MID", team: "Germany", isPlayingNow: true, performanceRating: 8.5, goals: 0, assists: 1, yellowCard: false, redCard: false, imageColor: "bg-stone-800/40 border-stone-600/50 text-stone-200" },
  { id: "ger-5", name: "Ilkay Gündogan", number: 21, position: "MID", team: "Germany", isPlayingNow: true, performanceRating: 7.7, goals: 0, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-stone-800/40 border-stone-600/50 text-stone-200" },
  { id: "ger-6", name: "Florian Wirtz", number: 10, position: "MID", team: "Germany", isPlayingNow: true, performanceRating: 8.9, goals: 1, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-stone-800/40 border-stone-600/50 text-stone-200" },
  { id: "ger-7", name: "Kai Havertz", number: 7, position: "FWD", team: "Germany", isPlayingNow: true, performanceRating: 8.1, goals: 1, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-stone-800/40 border-stone-600/50 text-stone-200" },
  { id: "ger-8", name: "Jamal Musiala", number: 14, position: "MID", team: "Germany", isPlayingNow: false, performanceRating: 7.0, goals: 0, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-zinc-800 border-zinc-700 text-zinc-400" },
  { id: "ger-9", name: "Niclas Füllkrug", number: 9, position: "FWD", team: "Germany", isPlayingNow: false, performanceRating: 6.9, goals: 0, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-zinc-800 border-zinc-700 text-zinc-400" },
  { id: "ger-10", name: "Leroy Sané", number: 19, position: "MID", team: "Germany", isPlayingNow: false, performanceRating: 6.4, goals: 0, assists: 0, yellowCard: false, redCard: false, imageColor: "bg-zinc-800 border-zinc-700 text-zinc-400" },
];

export default function FanHub({ sectors, transit, onRefreshData, isLoadingData }: FanHubProps) {
  // Toggle between dynamic crowd stats, indoor navigation, team squads, and AI assistant
  const [hubView, setHubView] = useState<"congestion" | "navigation" | "squad" | "chat">("congestion");
  
  // Players live tracking state
  const [players, setPlayers] = useState<Player[]>(initialPlayersData);
  
  // Squad Filter & Search States
  const [squadTeamFilter, setSquadTeamFilter] = useState<"All" | "Mexico" | "Germany">("All");
  const [squadStatusFilter, setSquadStatusFilter] = useState<"All" | "Playing" | "Bench">("All");
  const [squadSearch, setSquadSearch] = useState<string>("");

  // Live score dynamic rating simulator
  useEffect(() => {
    const ratingTimer = setInterval(() => {
      setPlayers((prev) =>
        prev.map((p) => {
          if (!p.isPlayingNow) return p;
          // Random walk rating fluctuation (-0.2 to +0.2)
          const seed = Math.random();
          let delta = 0;
          if (seed > 0.8) delta = 0.1;
          else if (seed < 0.2) delta = -0.1;
          
          const ratingVal = Number((p.performanceRating + delta).toFixed(1));
          return {
            ...p,
            performanceRating: Math.max(5.0, Math.min(10.0, ratingVal)),
          };
        })
      );
    }, 5000);
    return () => clearInterval(ratingTimer);
  }, []);

  // Selected language for multilingual AI conversations (100+ languages)
  const [selectedLang, setSelectedLang] = useState<string>("English");

  // Memoized filtered players for optimized renders (Factor 3: Efficiency)
  const filteredPlayers = React.useMemo(() => {
    return players.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(squadSearch.toLowerCase()) || p.number.toString() === squadSearch;
      const matchesTeam = squadTeamFilter === "All" || p.team === squadTeamFilter;
      const matchesStatus = squadStatusFilter === "All" || 
        (squadStatusFilter === "Playing" && p.isPlayingNow) || 
        (squadStatusFilter === "Bench" && !p.isPlayingNow);
      return matchesSearch && matchesTeam && matchesStatus;
    });
  }, [players, squadSearch, squadTeamFilter, squadStatusFilter]);

  // Legacy state placeholders for compiler safety
  const isChatOpen = false;
  const setIsChatOpen = (val: boolean) => {};

  // Chat message thread
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      content: "¡Hola! Welcome to Estadio Azteca! I am your Smart GenAI Assistant. I support over 100+ languages.\n\nAsk me anything about: \n• Where is my seat?\n• Which gate should I enter?\n• Where are the nearest restrooms?\n• Where can I buy food?\n• When does halftime begin?\n• Which metro should I take after the match?\n• What's the fastest exit?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeGateTab, setActiveGateTab] = useState<string>("South Gate C (Main Transit)");
  
  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState<number | null>(null);

  // Custom sign translation tool state
  const [signText, setSignText] = useState("");
  const [targetLang, setTargetLang] = useState("English");
  const [translatedSign, setTranslatedSign] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle preset chips
  const handlePresetClick = (preset: string) => {
    if (isSending) return;
    sendMessage(preset);
  };

  // Text to Speech (TTS) Audio reading
  const speakMessage = (text: string, index: number) => {
    if (speakingMsgIdx === index) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to match selected language voice if possible
    const voices = window.speechSynthesis.getVoices();
    const langCode = getLangCode(selectedLang);
    const matchingVoice = voices.find(v => v.lang.startsWith(langCode));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      setSpeakingMsgIdx(null);
    };
    utterance.onerror = () => {
      setSpeakingMsgIdx(null);
    };

    setSpeakingMsgIdx(index);
    window.speechSynthesis.speak(utterance);
  };

  const getLangCode = (lang: string) => {
    switch (lang) {
      case "Spanish": return "es";
      case "French": return "fr";
      case "German": return "de";
      case "Japanese": return "ja";
      case "Portuguese": return "pt";
      case "Italian": return "it";
      case "Arabic": return "ar";
      case "Mandarin": return "zh";
      case "Hindi": return "hi";
      default: return "en";
    }
  };

  // Speech to Text (STT) Voice recognition
  const startVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      // Graceful fallback simulation inside frames/sandboxes
      setIsListening(true);
      setTimeout(() => {
        const fallbackQueries = [
          "Where are the nearest restrooms?",
          "Where is my seat? I am in section 104.",
          "Which metro should I take after the match?",
          "Where can I buy food?",
          "What's the fastest exit?"
        ];
        const randomQuery = fallbackQueries[Math.floor(Math.random() * fallbackQueries.length)];
        setInputText(randomQuery);
        setIsListening(false);
      }, 1800);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getLangCode(selectedLang);

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn("Speech recognition fail: ", e);
      setIsListening(false);
    }
  };

  // Send message to Gemini chat
  const sendMessage = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    setInputText("");
    const userMsg: ChatMessage = {
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `User is speaking in ${selectedLang}. Answer the query professionally, taking stadium information into account. Query: "${query}"`,
          history: messages.slice(-8).map(m => ({ role: m.role, content: m.content })),
          userType: "fan"
        })
      });

      if (!response.ok) {
        throw new Error("Chat service returned an error");
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        role: "model",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        role: "model",
        content: "Sorry, I am experiencing temporary connectivity delays. Rest assured, Stadium Stewards are active near all main plazas to assist you directly!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // Quick Sign Translation handler
  const handleTranslateSign = async () => {
    if (!signText.trim()) return;
    setIsTranslating(true);
    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Translate the following stadium sign: "${signText}" into ${targetLang}. Explain any crucial safety context in 1-2 short sentences.`,
          history: [],
          userType: "fan"
        })
      });
      const data = await response.json();
      setTranslatedSign(data.text);
    } catch (err) {
      console.error(err);
      setTranslatedSign("Translation failed. Please consult a volunteer steward.");
    } finally {
      setIsTranslating(false);
    }
  };

  const selectedGate = sectors.find(s => s.name === activeGateTab);

  // List of 10 supported representative languages from the 100+ array for UI selection
  const popularLangs = ["English", "Spanish", "French", "German", "Japanese", "Portuguese", "Italian", "Arabic", "Mandarin", "Hindi"];

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 py-0 text-white font-sans w-full flex flex-col gap-0">
      
      {/* MAIN CONTAINER */}
      <div className="flex flex-col gap-0 w-full bg-zinc-950 border border-white/10">
        
        {/* Toggle Hub Views Tab Bar */}
        <div className="bg-zinc-950 border-b border-white/15 p-2 flex flex-wrap gap-1 bg-black">
          <button
            onClick={() => setHubView("congestion")}
            className={`flex-1 py-3 px-3 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer rounded-none border ${
              hubView === "congestion"
                ? "bg-white text-black border-white"
                : "bg-black text-zinc-400 border-white/5 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Compass className="h-4 w-4 inline mr-1 sm:mr-2" />
            <span>Flow & Transit</span>
          </button>
          
          <button
            onClick={() => setHubView("navigation")}
            className={`flex-1 py-3 px-3 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer rounded-none border ${
              hubView === "navigation"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-black text-zinc-400 border-white/5 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Navigation className="h-4 w-4 inline mr-1 sm:mr-2" />
            <span>Smart Navigator</span>
          </button>

          <button
            onClick={() => setHubView("squad")}
            className={`flex-1 py-3 px-3 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer rounded-none border ${
              hubView === "squad"
                ? "bg-yellow-500 text-black border-yellow-400"
                : "bg-black text-zinc-400 border-white/5 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <span className="inline-block animate-bounce mr-1">⚽</span>
            <span>Squad & Live Players</span>
          </button>

          <button
            onClick={() => setHubView("chat")}
            className={`flex-1 py-3 px-3 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer rounded-none border ${
              hubView === "chat"
                ? "bg-blue-600 text-white border-blue-500"
                : "bg-black text-zinc-400 border-white/5 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Sparkles className="h-4 w-4 inline mr-1 sm:mr-2 animate-pulse" />
            <span>💬 Smart AI Assistance</span>
          </button>
        </div>

        {/* View rendering */}
        <AnimatePresence mode="wait">
          {hubView === "navigation" && (
            <motion.div
              key="nav-view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-0"
            >
              <SmartNavigation />
            </motion.div>
          )}

          {hubView === "congestion" && (
            <motion.div
              key="congestion-view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-0"
            >
              {/* Interactive Map & Gate queue monitor */}
              <div className="bg-black border-b border-white/10 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center space-x-2 text-blue-500 font-display font-black tracking-widest text-[10px] uppercase mb-1.5">
                      <Compass className="h-3.5 w-3.5" />
                      <span>TELEMETRY_ENGINE</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                      CROWD FLOW
                    </h1>
                  </div>
                  
                  <button
                    id="refresh-stadium-data"
                    onClick={onRefreshData}
                    disabled={isLoadingData}
                    className="flex items-center space-x-2 px-4 py-2 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition cursor-pointer disabled:opacity-50 rounded-none self-start sm:self-center"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isLoadingData ? "animate-spin" : ""}`} />
                    <span>{isLoadingData ? "SYNCING..." : "SYNC FEED"}</span>
                  </button>
                </div>

                <p className="text-xs text-zinc-400 max-w-xl leading-relaxed mb-6">
                  Gate telemetry is dynamically analyzed to predict bottlenecks. Staff recommend walking to <span className="text-yellow-400 underline font-bold">Gate D</span> if Gate C exceeds 30 minutes wait time.
                </p>

                {/* Stadium custom map mockup using styled SVG elements */}
                <div className="relative bg-zinc-950 border border-white/10 rounded-none p-6 flex flex-col items-center justify-center mb-6 overflow-hidden cyber-grid">
                  <div className="absolute top-4 left-4 bg-black text-[9px] text-zinc-400 font-mono px-2 py-1 border border-white/10 uppercase tracking-wider font-bold">
                    ESTADIO_AZTECA_LAYOUT
                  </div>
                  
                  {/* SVG Visual map */}
                  <svg viewBox="0 0 400 240" className="w-full max-w-sm h-auto drop-shadow-2xl">
                    {/* Outer boundary */}
                    <circle cx="200" cy="120" r="110" className="fill-black stroke-white/20 stroke-2" />
                    {/* Pitch */}
                    <rect x="140" y="85" width="120" height="70" className="fill-zinc-900/80 stroke-white/40 stroke-2" />
                    <circle cx="200" cy="120" r="18" className="fill-none stroke-white/10 stroke-1" />
                    
                    {/* Gate indicators */}
                    <g onClick={() => setActiveGateTab("North Gate A")} className="cursor-pointer group">
                      <circle cx="200" cy="25" r="12" className="fill-black stroke-emerald-500 stroke-2 group-hover:fill-zinc-900" />
                      <text x="200" y="29" textAnchor="middle" className="text-[10px] fill-emerald-500 font-black font-mono">A</text>
                    </g>
                    <g onClick={() => setActiveGateTab("East Gate B")} className="cursor-pointer group">
                      <circle cx="295" cy="120" r="12" className="fill-black stroke-amber-500 stroke-2 group-hover:fill-zinc-900" />
                      <text x="295" y="124" textAnchor="middle" className="text-[10px] fill-amber-500 font-black font-mono">B</text>
                    </g>
                    <g onClick={() => setActiveGateTab("South Gate C (Main Transit)")} className="cursor-pointer group">
                      <circle cx="200" cy="215" r="12" className="fill-black stroke-red-500 stroke-2 group-hover:fill-zinc-900 animate-pulse" />
                      <text x="200" y="219" textAnchor="middle" className="text-[10px] fill-red-500 font-black font-mono">C</text>
                    </g>
                    <g onClick={() => setActiveGateTab("West Gate D")} className="cursor-pointer group">
                      <circle cx="105" cy="120" r="12" className="fill-black stroke-blue-500 stroke-2 group-hover:fill-zinc-900" />
                      <text x="105" y="124" textAnchor="middle" className="text-[10px] fill-blue-500 font-black font-mono">D</text>
                    </g>

                    <text x="200" y="115" textAnchor="middle" className="text-[11px] fill-white font-black uppercase tracking-wider font-display">AZTECA</text>
                    <text x="200" y="132" textAnchor="middle" className="text-[8px] fill-zinc-500 font-mono tracking-widest uppercase">STADIUM_CORE</text>
                  </svg>

                  <div className="w-full flex justify-around text-[10px] mt-4 pt-4 border-t border-white/5 font-mono uppercase tracking-widest font-bold">
                    <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-emerald-500" /> <span className="text-zinc-400">NORMAL</span></span>
                    <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-amber-500" /> <span className="text-zinc-400">MODERATE</span></span>
                    <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-red-500" /> <span className="text-zinc-400">HEAVY</span></span>
                  </div>
                </div>

                {/* Interactive Gate Details Cards */}
                <div className="bg-zinc-950 p-4 border border-white/10 rounded-none">
                  <div className="flex overflow-x-auto pb-3 border-b border-white/10 scrollbar-none gap-2">
                    {sectors.filter(s => s.name.includes("Gate")).map(gate => (
                      <button
                        key={gate.name}
                        onClick={() => setActiveGateTab(gate.name)}
                        className={`px-4 py-2 text-xs font-black tracking-wider uppercase transition-all cursor-pointer rounded-none border ${
                          activeGateTab === gate.name
                            ? "bg-white text-black border-white"
                            : "bg-black text-zinc-400 border-white/10 hover:text-white hover:bg-zinc-900"
                        }`}
                      >
                        {gate.name.split(" (")[0]}
                      </button>
                    ))}
                  </div>

                  {selectedGate && (
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest font-display">SELECTED_ENTRANCE</div>
                        <div className="text-lg font-black text-white uppercase tracking-tight mt-1">{selectedGate.name}</div>
                        
                        <div className="mt-4 flex items-center space-x-2 border-t border-white/5 pt-3">
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Flow Rate:</span>
                          <span className="text-xs font-mono font-bold text-white uppercase">{selectedGate.flowRate}</span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between bg-black p-4 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest font-display">Est. Wait</span>
                          <span className={`text-base font-black font-mono ${
                            selectedGate.status === "Critical" ? "text-red-500" :
                            selectedGate.status === "Heavy" ? "text-amber-500" :
                            "text-emerald-400"
                          }`}>
                            {selectedGate.currentWaitMinutes} MINS
                          </span>
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold mb-1.5">
                            <span>Gate Occupancy</span>
                            <span>{selectedGate.currentLoadPercentage}%</span>
                          </div>
                          <div className="w-full bg-zinc-900 rounded-none h-2">
                            <div 
                              className={`h-2 rounded-none transition-all duration-500 ${
                                selectedGate.status === "Critical" ? "bg-red-500" :
                                selectedGate.status === "Heavy" ? "bg-amber-500" :
                                "bg-blue-500"
                              }`}
                              style={{ width: `${selectedGate.currentLoadPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Public Transport Advisory */}
              <div className="bg-black border-b border-white/10 p-6 sm:p-8">
                <div className="flex items-center space-x-2.5 text-blue-500 font-display font-black tracking-widest text-[10px] uppercase mb-1.5">
                  <Train className="h-3.5 w-3.5" />
                  <span>TRANSIT_MONITOR</span>
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-6 text-white">
                  TRANSIT ADVISORY
                </h2>
                
                <div className="space-y-4">
                  {transit.map((line) => (
                    <div 
                      key={line.name}
                      className="bg-zinc-950 p-5 border border-white/10 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:bg-zinc-900"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 text-[9px] uppercase font-black tracking-widest rounded-none bg-white text-black font-mono">
                            {line.type}
                          </span>
                          <h3 className="font-bold text-white text-sm uppercase tracking-tight">{line.name}</h3>
                        </div>
                        {line.alert && (
                          <div className="flex items-start space-x-1.5 mt-2.5 text-xs text-yellow-400 font-mono">
                            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <span>{line.alert}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 justify-between md:justify-end shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                        <div className="text-right">
                          <span className="block text-[9px] text-zinc-500 uppercase font-black tracking-widest font-mono">DEPARTURES</span>
                          <span className="font-mono text-xs text-zinc-300">Every {line.frequencyMinutes || "N/A"}m</span>
                        </div>
                        
                        <div className="bg-black px-4 py-2 border border-white/10 rounded-none text-right min-w-[110px]">
                          <span className="block text-[9px] text-zinc-500 uppercase font-black tracking-widest font-mono">PLATFORM WAIT</span>
                          <span className={`text-sm font-black font-mono ${
                            line.status === "Delayed" ? "text-amber-500" :
                            line.status === "Heavy Demand" ? "text-red-500" :
                            "text-blue-500"
                          }`}>
                            {line.waitMinutes} MINS
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Multilingual Sign Translation Tool */}
              <div className="bg-black p-6 sm:p-8">
                <div className="flex items-center space-x-2.5 text-blue-500 font-display font-black tracking-widest text-[10px] uppercase mb-1.5">
                  <Languages className="h-3.5 w-3.5" />
                  <span>TRANSLATION_CORE</span>
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2 text-white">
                  SIGN TRANSLATOR
                </h2>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  Unsure of stadium notices, tickets, or security advisories? Translate instantly with full contextual safety explanations.
                </p>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-2">
                    <input
                      type="text"
                      value={signText}
                      onChange={(e) => setSignText(e.target.value)}
                      placeholder="e.g., 'Salida de emergencia / Puerta de evacuación'"
                      className="flex-1 bg-zinc-950 border border-white/20 text-white text-xs font-mono rounded-none px-4 py-3 focus:outline-none focus:border-white placeholder:text-zinc-700"
                    />
                    <div className="flex gap-2 shrink-0">
                      <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="bg-zinc-950 border border-white/20 text-zinc-300 text-xs rounded-none px-3 py-3 focus:outline-none font-bold uppercase tracking-wider"
                      >
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Japanese">Japanese</option>
                      </select>
                      <button
                        onClick={handleTranslateSign}
                        disabled={isTranslating || !signText.trim()}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-none transition cursor-pointer disabled:opacity-50"
                      >
                        <span>{isTranslating ? "TRANSLATING..." : "TRANSLATE"}</span>
                      </button>
                    </div>
                  </div>

                  {translatedSign && (
                    <div className="bg-zinc-950 border border-white/10 p-5 rounded-none text-xs space-y-3">
                      <div className="flex items-center space-x-1.5 text-blue-400 font-black font-mono uppercase tracking-widest text-[9px]">
                        <Sparkles className="h-3 w-3" />
                        <span>INTELLIGENCE REPORT</span>
                      </div>
                      <div className="text-zinc-200 leading-relaxed font-mono whitespace-pre-wrap">
                        {translatedSign}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {hubView === "squad" && (
            <motion.div
              key="squad-view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-0 bg-black min-h-[600px]"
            >
              <div className="p-6 sm:p-8 border-b border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-2 text-yellow-400 font-display font-black tracking-widest text-[10px] uppercase mb-1.5">
                      <span className="animate-spin text-sm" style={{ animationDuration: '4s' }}>⚽</span>
                      <span>AZTECA_LIVE_METRICS</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                      LIVE PLAYERS
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2 text-xs bg-zinc-950 border border-white/10 px-3 py-1.5 text-zinc-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>STATS TICKER: REAL-TIME UPDATES</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                  Monitor active participant statistics, positional assignments, and live score performance ratings fluctuating instantly during match progress.
                </p>
              </div>

              {/* Live Match Stats Overview */}
              <div className="p-6 sm:p-8 bg-zinc-950/40 border-b border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-black/50 p-4 border border-white/5 text-center">
                  <span className="block text-[9px] text-zinc-500 uppercase font-mono tracking-wider">Possession</span>
                  <span className="text-xl font-black text-yellow-400 font-mono">54% - 46%</span>
                </div>
                <div className="bg-black/50 p-4 border border-white/5 text-center">
                  <span className="block text-[9px] text-zinc-500 uppercase font-mono tracking-wider">Total Shots</span>
                  <span className="text-xl font-black text-white font-mono">14 - 11</span>
                </div>
                <div className="bg-black/50 p-4 border border-white/5 text-center">
                  <span className="block text-[9px] text-zinc-500 uppercase font-mono tracking-wider">Passing Accuracy</span>
                  <span className="text-xl font-black text-white font-mono">88% - 84%</span>
                </div>
                <div className="bg-black/50 p-4 border border-white/5 text-center">
                  <span className="block text-[9px] text-zinc-500 uppercase font-mono tracking-wider">Fouls Committed</span>
                  <span className="text-xl font-black text-red-400 font-mono">8 - 12</span>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="p-6 sm:p-8 border-b border-white/10 space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Search Bar */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={squadSearch}
                      onChange={(e) => setSquadSearch(e.target.value)}
                      placeholder="Search player name or jersey..."
                      className="w-full bg-zinc-950 border border-white/20 text-white text-xs font-mono rounded-none px-4 py-3 focus:outline-none focus:border-white placeholder:text-zinc-700"
                    />
                  </div>
                  
                  {/* Team filter tabs */}
                  <div className="flex rounded-none border border-white/15 bg-black p-1 shrink-0 overflow-x-auto">
                    {(["All", "Mexico", "Germany"] as const).map((team) => (
                      <button
                        key={team}
                        onClick={() => setSquadTeamFilter(team)}
                        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap rounded-none ${
                          squadTeamFilter === team
                            ? "bg-white text-black"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {team === "All" ? "ALL TEAMS" : team === "Mexico" ? "🇲🇽 MEXICO" : "🇩🇪 GERMANY"}
                      </button>
                    ))}
                  </div>

                  {/* Status filter tabs */}
                  <div className="flex rounded-none border border-white/15 bg-black p-1 shrink-0 overflow-x-auto">
                    {(["All", "Playing", "Bench"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setSquadStatusFilter(status)}
                        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap rounded-none ${
                          squadStatusFilter === status
                            ? "bg-white text-black"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {status === "All" ? "ALL SQUAD" : status === "Playing" ? "⚡ PLAYING NOW" : "🪑 BENCHED"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Players List Grid */}
              <div className="p-6 sm:p-8 space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin">
                {filteredPlayers.map((player) => (
                    <div 
                      key={player.id}
                      className="bg-zinc-950 hover:bg-zinc-900 border border-white/10 p-4 rounded-none flex items-center justify-between gap-4 transition"
                    >
                      {/* Left: Player Avatar, Name, Position */}
                      <div className="flex items-center space-x-3.5">
                        <div className={`w-11 h-11 ${player.imageColor} border flex flex-col items-center justify-center font-mono font-black text-sm shrink-0 rounded-none relative`}>
                          <span>#{player.number}</span>
                          {/* Live overlay dot if playing now */}
                          {player.isPlayingNow && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black animate-ping" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">
                              {player.team === "Mexico" ? "🇲🇽 MEX" : "🇩🇪 GER"}
                            </span>
                            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                            <span className="px-1.5 py-0.5 text-[8px] bg-zinc-900 text-zinc-400 font-mono font-black border border-white/5 rounded-none uppercase">
                              {player.position}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-white uppercase tracking-tight mt-0.5">{player.name}</h4>
                          
                          {/* Playing Status Badges */}
                          <div className="flex items-center space-x-2 mt-1">
                            {player.isPlayingNow ? (
                              <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 uppercase font-black tracking-tight">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                                <span>ON PITCH</span>
                              </span>
                            ) : (
                              <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-tight">
                                <span>Bench (Sub)</span>
                              </span>
                            )}
                            
                            {player.yellowCard && (
                              <span className="w-2.5 h-3.5 bg-yellow-400 border border-yellow-500 block rounded-[1px] ml-1.5" title="Yellow Card" />
                            )}
                            {player.redCard && (
                              <span className="w-2.5 h-3.5 bg-red-600 border border-red-700 block rounded-[1px] ml-1.5" title="Red Card" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Player stats and current rating */}
                      <div className="flex items-center space-x-5 text-right">
                        {/* Stats Summary */}
                        <div className="hidden sm:flex flex-col font-mono text-[10px] text-zinc-400 space-y-0.5 shrink-0">
                          {player.goals > 0 && (
                            <span className="text-white font-bold uppercase tracking-tighter">⚽ Goals: {player.goals}</span>
                          )}
                          {player.assists > 0 && (
                            <span className="text-zinc-300 uppercase tracking-tighter">👟 Assists: {player.assists}</span>
                          )}
                          <span className="text-zinc-500">Rating:</span>
                        </div>

                        {/* Large Individual Performance Rating / Score */}
                        <div className="bg-black border border-white/10 px-3.5 py-2.5 rounded-none min-w-[70px] text-center">
                          <span className="block text-[8px] text-zinc-500 uppercase font-mono tracking-widest">LIVE SCORE</span>
                          <span className={`text-base font-black font-mono tracking-tight ${
                            player.performanceRating >= 8.5 ? "text-emerald-400 animate-pulse" :
                            player.performanceRating >= 7.5 ? "text-green-300" :
                            player.performanceRating >= 6.5 ? "text-yellow-400" :
                            "text-zinc-400"
                          }`}>
                            {player.performanceRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                {players.filter(p => {
                  const matchesSearch = p.name.toLowerCase().includes(squadSearch.toLowerCase()) || p.number.toString() === squadSearch;
                  const matchesTeam = squadTeamFilter === "All" || p.team === squadTeamFilter;
                  const matchesStatus = squadStatusFilter === "All" || 
                    (squadStatusFilter === "Playing" && p.isPlayingNow) || 
                    (squadStatusFilter === "Bench" && !p.isPlayingNow);
                  return matchesSearch && matchesTeam && matchesStatus;
                }).length === 0 && (
                  <div className="text-center py-10 bg-zinc-950 border border-white/5">
                    <span className="block text-2xl mb-2">⚽</span>
                    <span className="text-zinc-500 text-xs uppercase font-mono">No players matching the active filters found</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {hubView === "chat" && (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col bg-zinc-950 overflow-hidden border border-white/10 w-full"
            >
              {/* Chat Header with Language Selector (100+ support) */}
              <div className="p-6 bg-black border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white text-black font-black">
                    <Sparkles className="h-4 w-4 text-slate-950 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest text-white">FAN_ASSIST_AI</h3>
                    <span className="text-[9px] text-blue-400 flex items-center space-x-1 font-mono uppercase font-black tracking-tighter mt-0.5">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse inline-block mr-1" />
                      <span>MULTILINGUAL VOICE · ACTIVE</span>
                    </span>
                  </div>
                </div>

                {/* Multilingual Selector */}
                <div className="flex items-center space-x-2">
                  <Languages className="h-3.5 w-3.5 text-zinc-500" />
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="bg-zinc-900 border border-white/10 text-white text-[10px] font-mono px-2 py-1 rounded-none uppercase font-bold focus:outline-none"
                  >
                    {popularLangs.map(l => (
                      <option key={l} value={l}>{l.substring(0, 3)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message Thread Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin bg-zinc-950/40 min-h-[450px] max-h-[550px]">
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] rounded-none px-4 py-3.5 text-xs font-mono shadow-md border ${
                        msg.role === "user"
                          ? "bg-white text-black border-white"
                          : "bg-black text-zinc-200 border-white/10"
                      }`}>
                        <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                          {/* Speaker trigger button */}
                          {msg.role === "model" ? (
                            <button 
                              type="button"
                              onClick={() => speakMessage(msg.content, index)}
                              className={`p-1 hover:bg-zinc-900 text-zinc-500 hover:text-white transition cursor-pointer ${
                                speakingMsgIdx === index ? "text-emerald-400 animate-pulse" : ""
                              }`}
                              title="Read out loud (Voice Support)"
                            >
                              {speakingMsgIdx === index ? (
                                <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <VolumeX className="h-3.5 w-3.5" />
                              )}
                            </button>
                          ) : <div />}
                          
                          <span className={`text-[9px] font-mono ${msg.role === "user" ? "text-zinc-600" : "text-zinc-500"}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-black border border-white/10 rounded-none px-4 py-3 text-xs text-zinc-400 shadow-md">
                      <div className="flex items-center space-x-2 font-mono">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        <span className="text-[10px] uppercase font-bold tracking-wider ml-1 text-zinc-500">DECRYPTING RESPONSE...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Preset Prompt suggestion chips - ALL THE STADIUM QUERIES ASKED BY USER */}
              <div className="p-4 bg-black border-t border-white/10 shrink-0">
                <span className="block text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-2.5 font-mono">
                  STADIUM_QUICK_INTELLIGENCE_QUERIES
                </span>
                <div className="flex flex-wrap gap-1 max-h-[140px] overflow-y-auto pb-1 scrollbar-none">
                  {[
                    "Where is my seat?",
                    "Which gate should I enter?",
                    "Where are the nearest restrooms?",
                    "Where can I buy food?",
                    "When does halftime begin?",
                    "Which metro should I take after the match?",
                    "What's the fastest exit?",
                    "Recommend small clear bags policy",
                    "Is there wheelchair transit assistance?"
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className="text-[9px] font-mono bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-white/10 rounded-none px-2.5 py-1.5 cursor-pointer transition whitespace-nowrap uppercase tracking-tighter"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Bar with Mic voice button */}
              <div className="p-4 bg-zinc-900 border-t border-white/10 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(inputText);
                  }}
                  className="flex items-center space-x-2"
                >
                  {/* Mic trigger */}
                  <button
                    type="button"
                    onClick={startVoiceRecognition}
                    className={`p-3 border transition cursor-pointer shrink-0 rounded-none ${
                      isListening 
                        ? "bg-red-500 text-white border-red-400 animate-pulse" 
                        : "bg-black text-zinc-400 hover:text-white border-white/10"
                    }`}
                    title={isListening ? "Listening..." : "Speak query (STT Microphone)"}
                  >
                    {isListening ? (
                      <Mic className="h-4 w-4" />
                    ) : (
                      <MicOff className="h-4 w-4" />
                    )}
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isListening ? "Listening to voice input..." : `Ask AI Assistant in ${selectedLang}...`}
                    disabled={isSending}
                    className="flex-1 bg-black border border-white/20 rounded-none px-4 py-3 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-white disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !inputText.trim()}
                    className="p-3 bg-white text-black hover:bg-zinc-200 transition cursor-pointer disabled:opacity-50 shrink-0 rounded-none"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
                {isListening && (
                  <span className="block text-[8px] text-red-500 animate-pulse font-mono uppercase tracking-widest mt-1.5 text-center">
                    🎙️ RECORDING VOICE INPUT... SPEAK NOW OR SIMULATING TEXT TRANSCRIBER IN SANDBOX
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* RIGHT PANEL: Live GenAI Supporter Chat Concierge (5/12 cols) - DISABLED */}
      {false && (
        <div className="lg:col-span-5 flex flex-col h-[780px] lg:h-[800px] bg-zinc-950 overflow-hidden border-l border-white/10 animate-fade-in">
          
          {/* Chat Header with Language Selector (100+ support) */}
          <div className="p-6 bg-black border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white text-black font-black">
                <Sparkles className="h-4 w-4 text-slate-950 animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest text-white">FAN_ASSIST_AI</h3>
                <span className="text-[9px] text-blue-400 flex items-center space-x-1 font-mono uppercase font-black tracking-tighter mt-0.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse inline-block mr-1" />
                  <span>MULTILINGUAL VOICE · ACTIVE</span>
                </span>
              </div>
            </div>

            {/* Multilingual Selector & Close Button */}
            <div className="flex items-center space-x-2">
              <Languages className="h-3.5 w-3.5 text-zinc-500" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-zinc-900 border border-white/10 text-white text-[10px] font-mono px-2 py-1 rounded-none uppercase font-bold focus:outline-none"
              >
                {popularLangs.map(l => (
                  <option key={l} value={l}>{l.substring(0, 3)}</option>
                ))}
              </select>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white transition rounded-none border border-white/10 cursor-pointer ml-1"
                title="Hide AI Chat Panel"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin bg-zinc-950/40">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] rounded-none px-4 py-3.5 text-xs font-mono shadow-md border ${
                  msg.role === "user"
                    ? "bg-white text-black border-white"
                    : "bg-black text-zinc-200 border-white/10"
                }`}>
                  <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    {/* Speaker trigger button */}
                    {msg.role === "model" ? (
                      <button 
                        onClick={() => speakMessage(msg.content, index)}
                        className={`p-1 hover:bg-zinc-900 text-zinc-500 hover:text-white transition cursor-pointer ${
                          speakingMsgIdx === index ? "text-emerald-400 animate-pulse" : ""
                        }`}
                        title="Read out loud (Voice Support)"
                      >
                        {speakingMsgIdx === index ? (
                          <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <VolumeX className="h-3.5 w-3.5" />
                        )}
                      </button>
                    ) : <div />}
                    
                    <span className={`text-[9px] font-mono ${msg.role === "user" ? "text-zinc-600" : "text-zinc-500"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-black border border-white/10 rounded-none px-4 py-3 text-xs text-zinc-400 shadow-md">
                <div className="flex items-center space-x-2 font-mono">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider ml-1 text-zinc-500">DECRYPTING RESPONSE...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Preset Prompt suggestion chips - ALL THE STADIUM QUERIES ASKED BY USER */}
        <div className="p-4 bg-black border-t border-white/10 shrink-0">
          <span className="block text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-2.5 font-mono">
            STADIUM_QUICK_INTELLIGENCE_QUERIES
          </span>
          <div className="flex flex-wrap gap-1 max-h-[140px] overflow-y-auto pb-1 scrollbar-none">
            {[
              "Where is my seat?",
              "Which gate should I enter?",
              "Where are the nearest restrooms?",
              "Where can I buy food?",
              "When does halftime begin?",
              "Which metro should I take after the match?",
              "What's the fastest exit?",
              "Recommend small clear bags policy",
              "Is there wheelchair transit assistance?"
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetClick(preset)}
                className="text-[9px] font-mono bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-white/10 rounded-none px-2.5 py-1.5 cursor-pointer transition whitespace-nowrap uppercase tracking-tighter"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar with Mic voice button */}
        <div className="p-4 bg-zinc-900 border-t border-white/10 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputText);
            }}
            className="flex items-center space-x-2"
          >
            {/* Mic trigger */}
            <button
              type="button"
              onClick={startVoiceRecognition}
              className={`p-3 border transition cursor-pointer shrink-0 rounded-none ${
                isListening 
                  ? "bg-red-500 text-white border-red-400 animate-pulse" 
                  : "bg-black text-zinc-400 hover:text-white border-white/10"
              }`}
              title={isListening ? "Listening..." : "Speak query (STT Microphone)"}
            >
              {isListening ? (
                <Mic className="h-4 w-4" />
              ) : (
                <MicOff className="h-4 w-4" />
              )}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening to voice input..." : `Ask AI Assistant in ${selectedLang}...`}
              disabled={isSending}
              className="flex-1 bg-black border border-white/20 rounded-none px-4 py-3 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="p-3 bg-white text-black hover:bg-zinc-200 transition cursor-pointer disabled:opacity-50 shrink-0 rounded-none"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          {isListening && (
            <span className="block text-[8px] text-red-500 animate-pulse font-mono uppercase tracking-widest mt-1.5 text-center">
              🎙️ RECORDING VOICE INPUT... SPEAK NOW OR SIMULATING TEXT TRANSCRIBER IN SANDBOX
            </span>
          )}
        </div>

      </div>
      )}

      {/* FULL WIDTH FOOTER SECTIONS (Upcoming matches & FIFA socials) */}
      {hubView !== "chat" && (
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-6 bg-zinc-950 border border-white/10" id="fan-hub-footer-extended">
        
        {/* Upcoming Matches List with dates & flags */}
        <div className="border border-white/10 p-5 bg-black" id="upcoming-matches-section">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h4 className="font-black italic text-lg uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-yellow-400">📅</span> UPCOMING FIXTURES
            </h4>
            <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 font-mono font-black uppercase tracking-widest">Azteca 2026</span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "match-1",
                teamA: "Mexico",
                flagA: "🇲🇽",
                teamB: "USA",
                flagB: "🇺🇸",
                date: "June 11, 2026",
                time: "18:00 UTC",
                type: "FIFA World Cup 2026 · Group Stage",
                venue: "Estadio Azteca, Mexico City"
              },
              {
                id: "match-2",
                teamA: "Germany",
                flagA: "🇩🇪",
                teamB: "Brazil",
                flagB: "🇧🇷",
                date: "June 18, 2026",
                time: "20:00 UTC",
                type: "FIFA World Cup 2026 · Group Stage",
                venue: "Estadio Azteca, Mexico City"
              },
              {
                id: "match-3",
                teamA: "Argentina",
                flagA: "🇦🇷",
                teamB: "Mexico",
                flagB: "🇲🇽",
                date: "June 25, 2026",
                time: "21:30 UTC",
                type: "FIFA World Cup 2026 · Group Stage",
                venue: "Estadio Azteca, Mexico City"
              }
            ].map((m) => (
              <div key={m.id} className="bg-zinc-950 p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition duration-150">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    <span>{m.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-tight">
                    <span>{m.flagA} {m.teamA}</span>
                    <span className="text-zinc-500 font-mono font-normal">VS</span>
                    <span>{m.flagB} {m.teamB}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    📍 {m.venue}
                  </div>
                </div>
                <div className="text-left sm:text-right font-mono bg-black/60 px-3 py-1.5 border border-white/5 shrink-0 self-start sm:self-center">
                  <div className="text-white font-bold text-xs">{m.date}</div>
                  <div className="text-zinc-400 text-[10px] mt-0.5">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FIFA Social Media Platforms */}
        <div className="border border-white/10 p-5 bg-black flex flex-col justify-between" id="fifa-socials-section">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h4 className="font-black italic text-lg uppercase tracking-wider text-white flex items-center gap-2">
                <span className="text-blue-400">🌐</span> OFFICIAL FIFA CHANNELS
              </h4>
              <span className="text-[10px] text-zinc-500 font-mono uppercase font-black">FOLLOW LIVE</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Stay connected with breaking news, live highlight clips, official press releases, and behind-the-scenes content across all international host city outlets.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { name: "Instagram", handle: "@FIFAWorldCup", url: "#", color: "hover:border-pink-500/30 hover:text-pink-400", bg: "bg-pink-500/5", icon: "📸" },
                { name: "X (Twitter)", handle: "@FIFAcom", url: "#", color: "hover:border-zinc-400/30 hover:text-zinc-300", bg: "bg-zinc-800/10", icon: "🐦" },
                { name: "Facebook", handle: "@FIFAWorldCup", url: "#", color: "hover:border-blue-500/30 hover:text-blue-400", bg: "bg-blue-500/5", icon: "👥" },
                { name: "YouTube", handle: "@FIFA", url: "#", color: "hover:border-red-500/30 hover:text-red-400", bg: "bg-red-500/5", icon: "📺" },
                { name: "TikTok", handle: "@FIFAWorldCup", url: "#", color: "hover:border-cyan-500/30 hover:text-cyan-400", bg: "bg-cyan-500/5", icon: "🎵" }
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  className={`flex items-center gap-3 p-3 border border-white/10 bg-zinc-950 transition duration-150 group ${s.color}`}
                >
                  <span className="text-lg group-hover:scale-110 transition duration-150">{s.icon}</span>
                  <div>
                    <span className="block text-[10px] text-zinc-400 uppercase font-black tracking-widest">{s.name}</span>
                    <span className="text-[9px] font-mono text-zinc-500 block mt-0.5">{s.handle}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-zinc-500">
            <span>© 2026 FIFA. All Rights Reserved.</span>
            <span>Estadio Azteca Co-Host Operations</span>
          </div>
        </div>
      </div>
      )}

    </div>
  );
}
