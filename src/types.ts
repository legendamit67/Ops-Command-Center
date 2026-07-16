export interface Match {
  id: string;
  title: string;
  stage: string;
  datetime: string;
  status: string;
  attendance: number;
}

export interface Sector {
  name: string;
  currentWaitMinutes: number;
  status: "Normal" | "Moderate" | "Heavy" | "Critical";
  flowRate: string;
  currentLoadPercentage: number;
}

export interface TransitLine {
  name: string;
  type: string;
  frequencyMinutes: number;
  waitMinutes: number;
  status: string;
  alert?: string;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface Incident {
  type: string;
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

export interface IncidentResponse {
  actionPlan: string[];
  staffBroadcast: string;
  fanAnnouncements: {
    en: string;
    es: string;
    fr: string;
  };
  crowdSafetyLevel: "SAFE" | "MONITOR" | "INTERVENE" | "EVACUATE";
  recommendedStaffCount: number;
}

export interface SustainabilityData {
  energyUsageKWh: number;
  energySource: string;
  waterRecycledLiters: number;
  wasteDivertedPercentage: number;
  carbonOffsetTons: number;
}

export interface SustainabilityResponse {
  ecoScore: number;
  tips: string[];
  fanSlogan: string;
  greenMilestone: string;
}

export interface LiveScore {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  matchMinute: number;
  status: "Live" | "Halftime" | "Finished" | "Warmup";
  recentEvents: { minute: number; type: "goal" | "card" | "substitution" | "info"; text: string }[];
}

export interface SOSTicket {
  emergencyType: string;
  location: string;
  urgency: "high" | "critical";
  status: string;
}

export interface SOSResponse {
  instruction: string;
  notice: string;
  safetyAlert: string;
  evacuationRoute: string;
  nearestStewardZone: string;
  estimatedStaffArrivalMins: number;
}

