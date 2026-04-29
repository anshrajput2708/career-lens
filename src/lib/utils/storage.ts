// localStorage helpers for Career Lens state

export interface UserProfile {
  // Mode selection
  intent: "transition" | "upskill" | "";

  // ── TRANSITION DIMENSIONS (12) ──
  t_drains: string;
  t_principles: string;
  t_math: string;
  t_abstraction: string;
  t_background: string;
  t_built: string;
  t_coding: string;
  t_constraints: string;
  t_goodWork: string;
  t_identity: string;
  t_salaryMeaning: string;
  t_motivation: string;

  // ── UPSKILL DIMENSIONS (8) ──
  u_role: string;
  u_stack: string[]; // Select all that apply
  u_goal: string;
  u_weakness: string;
  u_bandwidth: string;
  u_learning: string;
  u_blockers: string;
  u_success: string;
}

export interface TransitionCareerMatch {
  career: string;
  fitScore: number;
  whyFit: string;
  hardestChallenge: string;
  actionPlan: string;
  salaryRange: string;
  targetCompanies: string;
}

export interface TransitionReport {
  top5Matches: TransitionCareerMatch[];
  next10Matches: string[];
  hiddenGems: string[];
  mismatches: { career: string; explanation: string }[];
  roadmap: { phase1: string; phase2: string; phase3: string; whyThisRoadmap?: string };
  rawDiagnosis?: string;
}

export interface UpskillQuarter {
  skills: string;
  resources: string;
  weeklyHours: string;
  checkpoint: string;
}

export interface UpskillReport {
  diagnosisSummary: string;
  gapAnalysis: string;
  keystoneSkill: string;
  quarters: {
    q1: UpskillQuarter;
    q2: UpskillQuarter;
    q3: UpskillQuarter;
    q4: UpskillQuarter;
  };
  resourceStack: {
    courses: string[];
    books: string[];
    repos: string[];
    communities: string[];
  };
  antiPatterns: string[];
  timelineRealistic: string;
  timelineFailure: string;
}

export interface SkillData {
  skill: string;
  level: string;
  score: number;
  gap_severity: "Low" | "Medium" | "Critical";
  benchmark: string;
}

export interface Recommendation {
  title: string;
  type: string;
  resource: string;
  time: string;
  difficulty: string;
  outcome: string;
  priority: string;
}

export interface TransitionPhase {
  phase: string;
  skills: string;
  resources: string;
  timeline: string;
  milestone: string;
}

export interface AnalysisResult {
  mode: "transition" | "upskill";
  transitionResult?: TransitionReport;
  upskillResult?: UpskillReport;
  analysisDate: string;
  
  // Unified Data-Rich Fields
  user_summary?: any;
  current_skills?: SkillData[];
  recommendations?: Recommendation[];
  transition_plan?: TransitionPhase[];
  progress?: {
    overall_completion: number;
    next_action: string;
    estimated_job_ready_date: string;
  };
}

export interface RoadmapWeek {
  week: number;
  title: string;
  description: string;
  skills: string[];
  resources: { title: string; url: string; type: "video" | "course" | "article" | "project" }[];
  milestone: string;
  completed?: boolean;
}

export interface DayInLife {
  career: string;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  tools: string[];
  energyLevel: string;
  commonFrustrations: string[];
  bestParts: string[];
}

export interface DaySchedule {
  morning: string;
  afternoon: string;
  evening: string;
  mood: string;
}

export interface SalaryData {
  career: string;
  city: string;
  entry: { min: number; max: number };
  oneYear: { min: number; max: number };
  threeYears: { min: number; max: number };
  currency: string;
  insights: string[];
}

export interface CheckInEntry {
  date: string;
  didStudy: boolean;
  minutesSpent: number;
  fitScoreAtTime: number;
  completedSkills: string[];
}

export type ResearchPaperProgressStatus = "saved" | "reading" | "completed";

export interface ResearchPaperProgress {
  paperId: string;
  status: ResearchPaperProgressStatus;
  notes: string;
  updatedAt: string;
}

/** Preferences for future automated emails (stored locally until cron wiring). */
export interface EmailPrefs {
  weeklyRecap: boolean;
  streakSaver: boolean;
  milestoneAlerts: boolean;
}

const KEYS = {
  profile: "cl_profile",
  analysis: "cl_analysis",
  tempAnalysis: "cl_temp_analysis",
  roadmap: "cl_roadmap",
  dayInLife: "cl_day_in_life",
  salary: "cl_salary",
  checkins: "cl_checkins",
  completedWeeks: "cl_completed_weeks",
  researchProgress: "cl_research_progress",
  emailPrefs: "cl_email_prefs",
};

function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full
  }
}

export const storage = {
  getProfile: () => safeGet<UserProfile>(KEYS.profile),
  setProfile: (p: UserProfile) => safeSet(KEYS.profile, p),

  getAnalysis: () => safeGet<AnalysisResult>(KEYS.analysis),
  setAnalysis: (a: AnalysisResult) => {
    safeSet(KEYS.analysis, a);
    triggerSync();
  },

  getTempAnalysis: () => safeGet<AnalysisResult>(KEYS.tempAnalysis),
  setTempAnalysis: (a: AnalysisResult) => safeSet(KEYS.tempAnalysis, a),
  clearTempAnalysis: () => {
    if (typeof window !== "undefined") localStorage.removeItem(KEYS.tempAnalysis);
  },

  getRoadmap: (career: string) =>
    safeGet<RoadmapWeek[]>(`${KEYS.roadmap}_${career}`),
  setRoadmap: (career: string, r: RoadmapWeek[]) => {
    safeSet(`${KEYS.roadmap}_${career}`, r);
    triggerSync();
  },

  getDayInLife: (career: string) =>
    safeGet<DayInLife>(`${KEYS.dayInLife}_${career}`),
  setDayInLife: (career: string, d: DayInLife) =>
    safeSet(`${KEYS.dayInLife}_${career}`, d),

  getSalary: (career: string) =>
    safeGet<SalaryData>(`${KEYS.salary}_${career}`),
  setSalary: (career: string, s: SalaryData) =>
    safeSet(`${KEYS.salary}_${career}`, s),

  getCheckins: () => safeGet<CheckInEntry[]>(KEYS.checkins) || [],
  addCheckin: (entry: CheckInEntry) => {
    const existing = safeGet<CheckInEntry[]>(KEYS.checkins) || [];
    safeSet(KEYS.checkins, [...existing, entry]);
    triggerSync();
  },

  getCompletedWeeks: (career: string) =>
    safeGet<number[]>(`${KEYS.completedWeeks}_${career}`) || [],
  setCompletedWeeks: (career: string, weeks: number[]) => {
    safeSet(`${KEYS.completedWeeks}_${career}`, weeks);
    triggerSync();
  },

  getResearchProgress: () =>
    safeGet<ResearchPaperProgress[]>(KEYS.researchProgress) || [],
  upsertResearchProgress: (entry: ResearchPaperProgress) => {
    const existing = safeGet<ResearchPaperProgress[]>(KEYS.researchProgress) || [];
    const filtered = existing.filter((item) => item.paperId !== entry.paperId);
    safeSet(KEYS.researchProgress, [...filtered, entry]);
    triggerSync();
  },

  getEmail: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("cl_user_email");
  },
  setEmail: (email: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("cl_user_email", email);
    triggerSync();
  },

  getEmailPrefs: (): EmailPrefs => {
    const d = safeGet<EmailPrefs>(KEYS.emailPrefs);
    if (d && typeof d.weeklyRecap === "boolean" && typeof d.streakSaver === "boolean" && typeof d.milestoneAlerts === "boolean") {
      return d;
    }
    return { weeklyRecap: true, streakSaver: true, milestoneAlerts: false };
  },
  setEmailPrefs: (p: EmailPrefs) => safeSet(KEYS.emailPrefs, p),

  clearAll: () => {
    if (typeof window === "undefined") return;
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem("cl_user_email");
  },
};

// ── Background Sync Trigger ───────────────────────────────────────────────────
// We dynamically import syncToSupabase to prevent circular dependencies at boot time,
// since syncEngine.ts also imports storage.ts.
function triggerSync() {
  if (typeof window === "undefined") return;
  // Fire and forget (do not await) to keep UI instantly responsive
  import("../services/syncEngine").then((m) => m.syncToSupabase().catch(console.error));
}
