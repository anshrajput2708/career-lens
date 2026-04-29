/**
 * Pure dashboard derivations from local storage shapes.
 * Keeps /dashboard free of scattered math and documents intent in one place.
 */

import type { AnalysisResult, CheckInEntry, RoadmapWeek, ResearchPaperProgress } from "@/lib/utils/storage";
import { storage } from "@/lib/utils/storage";
import {
  computeFitScore,
  computeStreak,
  todayStr,
  getUpskillBaseScore,
  type ScoreBreakdown,
} from "@/lib/utils/scoring";
import { getProgress } from "@/lib/utils/progress";
import { slugify } from "@/lib/utils/utils";

export type DashboardMode = "transition" | "upskill" | "none";

export interface RoadmapSprintTask {
  id: string;
  label: string;
  done: boolean;
}

export interface DashboardMetrics {
  mode: DashboardMode;
  headline: string;
  subline: string;
  score: ReturnType<typeof computeFitScore> | null;
  streak: number;
  activeLast7: number;
  activityMask: boolean[];
  /** Last 30 calendar days, forward-filled from check-ins (0–100). */
  momentum30: number[];
  roadmapWeeksDone: number;
  roadmapWeeksTotal: number;
  sprintWeekLabel: string;
  sprintTasks: RoadmapSprintTask[];
  resourcesDone: number;
  resourceDomains: number;
  researchCompleted: number;
  researchInProgress: number;
  insights: string[];
  primaryLink: { href: string; label: string };
  // New Unified Dashboard Fields
  userSummary?: any;
  currentSkills?: any[];
  recommendations?: any[];
  transitionPlan?: any[];
}

/**
 * Single scoring path for check-in + dashboard: transition (AI base) or upskill (anchor base).
 */
export function resolveFitScoreBreakdown(
  analysis: AnalysisResult,
  checkins: CheckInEntry[]
): ScoreBreakdown | null {
  const profile = storage.getProfile();
  
  if (analysis.mode === "transition") {
    if (analysis.user_summary) {
      const role = analysis.user_summary.target_role || "Career Transition";
      const slug = slugify(role);
      const completed = storage.getCompletedWeeks(slug);
      let roadLength = analysis.transition_plan ? analysis.transition_plan.length : 0;
      if (roadLength === 0) roadLength = storage.getRoadmap(slug)?.length || 0;
      const fitScore = analysis.user_summary.targetRoleAnalysis?.matchPercentage || 70;
      return computeFitScore(fitScore, completed, roadLength, checkins);
    } else if (analysis.transitionResult?.top5Matches?.[0]) {
      const top = analysis.transitionResult.top5Matches[0];
      const slug = slugify(top.career);
      const road = storage.getRoadmap(slug) || [];
      const completed = storage.getCompletedWeeks(slug);
      return computeFitScore(top.fitScore, completed, road.length, checkins);
    }
  }

  if (analysis.mode === "upskill") {
    const roleKey = profile?.u_role?.trim() ? slugify(profile.u_role) : "upskill";
    const completed = storage.getCompletedWeeks(roleKey);
    let roadLength = analysis.transition_plan ? analysis.transition_plan.length : 0;
    if (roadLength === 0) roadLength = storage.getRoadmap(roleKey)?.length || 0;
    return computeFitScore(getUpskillBaseScore(profile?.u_role || ""), completed, roadLength, checkins);
  }
  return null;
}

export function resolveRoadmapHref(analysis: AnalysisResult): string {
  const profile = storage.getProfile();
  if (analysis.mode === "transition") {
    if (analysis.user_summary?.target_role) {
      return `/roadmap/${slugify(analysis.user_summary.target_role)}`;
    }
    if (analysis.transitionResult?.top5Matches?.[0]) {
      return `/roadmap/${slugify(analysis.transitionResult.top5Matches[0].career)}`;
    }
  }
  if (analysis.mode === "upskill") {
    const roleKey = profile?.u_role?.trim() ? slugify(profile.u_role) : "upskill";
    return `/roadmap/${roleKey}`;
  }
  return "/roadmaps";
}

/** Base score stored on check-in when breakdown cannot be computed. */
export function scoreFallbackBase(analysis: AnalysisResult): number {
  if (analysis.mode === "transition") {
    if (analysis.user_summary?.targetRoleAnalysis?.matchPercentage) {
      return analysis.user_summary.targetRoleAnalysis.matchPercentage;
    }
    if (analysis.transitionResult?.top5Matches?.[0]) {
      return analysis.transitionResult.top5Matches[0].fitScore;
    }
  }
  if (analysis.mode === "upskill") {
    const profile = storage.getProfile();
    return getUpskillBaseScore(profile?.u_role || "");
  }
  return 0;
}

/** Context for `/api/roadmap` built from persisted analysis (not legacy careerMatches). */
export interface RoadmapApiContext {
  careerName: string;
  fitScore: number;
  missingSkills: string[];
  currentSkills: string[];
}

export type RoadmapResolveResult =
  | { ok: true; data: RoadmapApiContext }
  | { ok: false; redirectTo: string };

export function resolveRoadmapFetchContext(
  analysis: AnalysisResult,
  careerSlug: string
): RoadmapResolveResult {
  const profile = storage.getProfile();

  if (analysis.mode === "transition") {
    if (analysis.user_summary) {
      const unifiedCareer = analysis.user_summary.target_role || "Career Transition";
      const key = slugify(unifiedCareer);
      if (careerSlug !== key) return { ok: false, redirectTo: `/roadmap/${key}` };
      
      const missing = analysis.user_summary.targetRoleAnalysis?.missingSkills?.map((s: any) => s.skill) || ["Role-critical gaps"];
      const transferable = analysis.user_summary.targetRoleAnalysis?.transferableSkills || ["Your foundational skills"];
      return {
        ok: true,
        data: {
          careerName: unifiedCareer,
          fitScore: analysis.user_summary.targetRoleAnalysis?.matchPercentage || 70,
          missingSkills: missing,
          currentSkills: transferable,
        },
      };
    } else if (analysis.transitionResult?.top5Matches?.length) {
      const list = analysis.transitionResult.top5Matches;
      const m = list.find((c) => slugify(c.career) === careerSlug);
      if (!m) return { ok: false, redirectTo: `/roadmap/${slugify(list[0]!.career)}` };
      return {
        ok: true,
        data: {
          careerName: m.career,
          fitScore: m.fitScore,
          missingSkills: m.hardestChallenge ? [m.hardestChallenge] : ["Role-critical gaps"],
          currentSkills: m.whyFit ? [m.whyFit.slice(0, 280)] : ["Strengths from your transition analysis"],
        },
      };
    }
  }

  if (analysis.mode === "upskill") {
    const roleKey = profile?.u_role?.trim() ? slugify(profile.u_role) : "upskill";
    if (careerSlug !== roleKey) return { ok: false, redirectTo: `/roadmap/${roleKey}` };
    
    if (analysis.user_summary) {
      return {
        ok: true,
        data: {
          careerName: profile?.u_role?.trim() || "Your upskill path",
          fitScore: getUpskillBaseScore(profile?.u_role || ""),
          missingSkills: ["Skill gaps from your upskill diagnosis"],
          currentSkills: [analysis.user_summary.diagnosis || "Your current profile summary"],
        },
      };
    } else if (analysis.upskillResult) {
      const ur = analysis.upskillResult;
      return {
        ok: true,
        data: {
          careerName: profile?.u_role?.trim() || "Your upskill path",
          fitScore: getUpskillBaseScore(profile?.u_role || ""),
          missingSkills: [ur.gapAnalysis?.slice(0, 280) || "Skill gaps from your upskill diagnosis"],
          currentSkills: [ur.diagnosisSummary?.slice(0, 280) || "Your current profile summary"],
        },
      };
    }
  }

  return { ok: false, redirectTo: "/onboard" };
}

function addDays(iso: string, delta: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + delta);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * First roadmap week (in plan order) not marked in `completed`.
 * `completed` stores API week ids (`RoadmapWeek.week`), same as the roadmap page.
 */
export function firstIncompleteRoadmapWeek(road: RoadmapWeek[], completed: number[]): RoadmapWeek | null {
  for (const w of road) {
    if (!completed.includes(w.week)) return w;
  }
  return null;
}

function weekActivityMask(checkins: CheckInEntry[]): boolean[] {
  const studied = new Set(checkins.filter((c) => c.didStudy).map((c) => c.date));
  const mask: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    mask.push(studied.has(addDays(todayStr(), -i)));
  }
  return mask;
}

/** Best same-day snapshot: max fitScoreAtTime per date (handles multiple entries). */
function scoreByDate(checkins: CheckInEntry[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const c of checkins) {
    if (c.fitScoreAtTime <= 0) continue;
    const prev = m.get(c.date);
    if (prev == null || c.fitScoreAtTime > prev) m.set(c.date, c.fitScoreAtTime);
  }
  return m;
}

/**
 * For each of the last `days` days (ending today), forward-filled readiness from check-ins.
 * When a day has a snapshot, it updates the carry; otherwise the previous value is kept.
 */
export function momentumScores(checkins: CheckInEntry[], days: number, fallback: number): number[] {
  const byDate = scoreByDate(checkins);
  const out: number[] = [];
  let carry = fallback;
  for (let i = days - 1; i >= 0; i--) {
    const day = addDays(todayStr(), -i);
    const v = byDate.get(day);
    if (v != null) carry = v;
    out.push(Math.min(100, Math.max(0, Math.round(carry))));
  }
  return out;
}

function buildSprintFromRoadmap(
  road: RoadmapWeek[],
  completed: number[]
): { label: string; tasks: RoadmapSprintTask[] } {
  const total = road.length;
  if (total === 0) return { label: "No roadmap yet", tasks: [] };
  const focus = firstIncompleteRoadmapWeek(road, completed);
  const allComplete = focus === null;
  const week = allComplete ? road[total - 1] : focus;
  const weekDone = allComplete || completed.includes(week.week);
  const label = allComplete ? "Roadmap complete" : `Week ${week.week}: ${week.title}`;
  const tasks: RoadmapSprintTask[] = (week.resources || []).map((r, i) => ({
    id: `wk${week.week}_r${i}`,
    label: `${r.type} — ${r.title}`,
    done: weekDone,
  }));
  tasks.push({
    id: `wk${week.week}_m`,
    label: `Milestone: ${week.milestone}`,
    done: weekDone,
  });
  return { label, tasks };
}

function researchCounts(entries: ResearchPaperProgress[]) {
  let completed = 0;
  let reading = 0;
  for (const e of entries) {
    if (e.status === "completed") completed++;
    else if (e.status === "reading") reading++;
  }
  return { completed, reading };
}

function resourceTotals() {
  const p = getProgress();
  const keys = Object.keys(p);
  const done = keys.reduce((acc, k) => acc + (p[k]?.length ?? 0), 0);
  const domains = keys.filter((k) => (p[k]?.length ?? 0) > 0).length;
  return { done, domains };
}

export function loadDashboardMetrics(customAnalysis?: AnalysisResult | null): DashboardMetrics {
  const analysis = customAnalysis !== undefined ? customAnalysis : storage.getAnalysis();
  const checkins = storage.getCheckins();
  const profile = storage.getProfile();
  const research = storage.getResearchProgress();
  const { done: resourcesDone, domains: resourceDomains } = resourceTotals();
  const { completed: researchCompleted, reading: researchInProgress } = researchCounts(research);
  const activityMask = weekActivityMask(checkins);
  const activeLast7 = activityMask.filter(Boolean).length;

  // The legacy logic that injected fake data strings has been completely removed.
  // The system will now gracefully drop incomplete schemas and force users to re-run onboard.

  if (!analysis) {
    return {
      mode: "none",
      headline: "Career dashboard",
      subline: "Run an analysis to unlock your real fit score, streak, and learning telemetry.",
      score: null,
      streak: computeStreak(checkins),
      activeLast7,
      activityMask,
      momentum30: momentumScores(checkins, 30, 0),
      roadmapWeeksDone: 0,
      roadmapWeeksTotal: 0,
      sprintWeekLabel: "",
      sprintTasks: [],
      resourcesDone,
      resourceDomains,
      researchCompleted,
      researchInProgress,
      insights: [
        "Complete onboarding to generate a calibrated baseline score.",
        activeLast7 > 0
          ? `${activeLast7} active day(s) this week — carry that rhythm after you analyze.`
          : "Even one short study block today starts a check-in streak.",
      ],
      primaryLink: { href: "/onboard", label: "Start analysis" },
      userSummary: undefined,
      currentSkills: [],
      recommendations: [],
      transitionPlan: [],
    };
  }

  if (analysis.mode === "transition" && analysis.transitionResult?.top5Matches?.[0]) {
    const top = analysis.transitionResult.top5Matches[0];
    const slug = slugify(top.career);
    const road = storage.getRoadmap(slug) || [];
    const completed = storage.getCompletedWeeks(slug);
    const score = computeFitScore(top.fitScore, completed, road.length, checkins);
    const { label: sprintWeekLabel, tasks: sprintTasks } = buildSprintFromRoadmap(road, completed);
    const momentum30 = momentumScores(checkins, 30, score.currentScore);

    const insights: string[] = [];
    if (score.streak >= 5) {
      insights.push(`${score.streak}-day streak — consistency is applying the full +${score.consistencyBonus.toFixed(1)} streak bonus.`);
    } else if (score.streak === 0 && checkins.some((c) => c.didStudy)) {
      insights.push("Streak is at zero; a small session today restarts the consistency bonus clock.");
    } else {
      insights.push(`Roadmap adds up to +${score.roadmapBonus.toFixed(1)} / 20 points at ${completed.length}/${road.length || 1} weeks logged.`);
    }
    insights.push(`Top target: ${top.career} — base AI fit ${top.fitScore} before bonuses.`);
    if (top.hardestChallenge) {
      insights.push(`Hardest gap called out in your plan: ${top.hardestChallenge}`);
    }

    return {
      mode: "transition",
      headline: `${top.career}`,
      subline: `Readiness ${score.currentScore}% · ${completed.length} of ${road.length || 0} roadmap weeks · ${activeLast7}/7 active days`,
      score,
      streak: score.streak,
      activeLast7,
      activityMask,
      momentum30,
      roadmapWeeksDone: completed.length,
      roadmapWeeksTotal: road.length,
      sprintWeekLabel,
      sprintTasks,
      resourcesDone,
      resourceDomains,
      researchCompleted,
      researchInProgress,
      insights: insights.slice(0, 4),
      primaryLink: { href: `/roadmap/${slug}`, label: "Open roadmap" },
      userSummary: analysis.user_summary,
      currentSkills: analysis.current_skills || [],
      recommendations: analysis.recommendations || [],
      transitionPlan: analysis.transition_plan || [],
    };
  }

  if (analysis.mode === "upskill" && analysis.upskillResult) {
    const roleKey =
      profile?.u_role && profile.u_role.trim()
        ? slugify(profile.u_role)
        : "upskill";
    const road = storage.getRoadmap(roleKey) || [];
    const completed = storage.getCompletedWeeks(roleKey);
    const baseObjScore = getUpskillBaseScore(profile?.u_role || "");
    const score = computeFitScore(baseObjScore, completed, road.length, checkins);
    const { label: sprintWeekLabel, tasks: sprintTasks } = buildSprintFromRoadmap(road, completed);
    const momentum30 = momentumScores(checkins, 30, score.currentScore);
    const q = analysis.upskillResult.quarters;
    const insights: string[] = [
      `Upskill baseline evaluated to ${baseObjScore} based on current role transition physics (+${score.roadmapBonus.toFixed(1)} roadmap, +${score.consistencyBonus.toFixed(1)} streak).`,
    ];
    if (analysis.upskillResult.keystoneSkill) {
      insights.push(`Keystone skill: ${analysis.upskillResult.keystoneSkill}`);
    }
    if (q?.q1?.skills) {
      insights.push(`Q1 focus: ${q.q1.skills}`);
    }

    return {
      mode: "upskill",
      headline: profile?.u_role?.trim() || "Upskill plan",
      subline: `Readiness ${score.currentScore}% · ${completed.length} of ${road.length || 0} tracked weeks · ${activeLast7}/7 active days`,
      score,
      streak: score.streak,
      activeLast7,
      activityMask,
      momentum30,
      roadmapWeeksDone: completed.length,
      roadmapWeeksTotal: road.length,
      sprintWeekLabel: sprintWeekLabel || "Quarterly priorities",
      sprintTasks:
        sprintTasks.length > 0
          ? sprintTasks
          : [
              { id: "q1s", label: q?.q1?.skills || "Define Q1 skills", done: false },
              { id: "q1c", label: q?.q1?.checkpoint || "Set a checkpoint", done: false },
            ],
      resourcesDone,
      resourceDomains,
      researchCompleted,
      researchInProgress,
      insights: insights.slice(0, 4),
      primaryLink: { href: "/results", label: "Review upskill plan" },
      userSummary: analysis.user_summary,
      currentSkills: analysis.current_skills || [],
      recommendations: analysis.recommendations || [],
      transitionPlan: analysis.transition_plan || [],
    };
  }

  // Handle Unified model directly
  if (analysis.user_summary || analysis.current_skills) {
    const isTransition = analysis.mode === "transition";
    const headline = isTransition 
      ? (analysis.user_summary?.target_role || "Career Transition")
      : (profile?.u_role?.trim() || "Engineering Upskill");
    
    const slug = slugify(headline);
    const completed = storage.getCompletedWeeks(slug);
    
    const baseObjScore = isTransition 
      ? (analysis.user_summary?.targetRoleAnalysis?.matchPercentage || 70)
      : getUpskillBaseScore(profile?.u_role || "upskill");
      
    // Roadmap mapping
    const tPlan = analysis.transition_plan || [];
    const roadLength = tPlan.length;
    const completedLength = Math.min(completed.length, roadLength);
    const score = computeFitScore(baseObjScore, completed, roadLength, checkins);
    
    let sprintWeekLabel = "Current Focus";
    let sprintTasks: RoadmapSprintTask[] = [];
    
    if (roadLength > 0) {
      // Find first uncompleted phase
      let activeIdx = 0;
      for (let i = 0; i < roadLength; i++) {
        if (!completed.includes(i + 1)) {
          activeIdx = i;
          break;
        }
        if (i === roadLength - 1) activeIdx = i; // All done
      }
      
      const activePhase = tPlan[activeIdx];
      const isDone = completed.includes(activeIdx + 1);
      sprintWeekLabel = activePhase.phase || `Phase ${activeIdx + 1}`;
      
      sprintTasks = [
        {
          id: `phase_${activeIdx}_skills`,
          label: `Skills: ${activePhase.skills}`,
          done: isDone
        },
        {
          id: `phase_${activeIdx}_milestone`,
          label: `Milestone: ${activePhase.milestone}`,
          done: isDone
        }
      ];
    } else if (!isTransition && analysis.recommendations?.[0]) {
      // Upskill fallback to recommendations
      const rec = analysis.recommendations[0];
      sprintWeekLabel = "Primary Recommendation";
      sprintTasks = [
        { id: "u_rec", label: rec.title, done: false },
        { id: "u_rec_out", label: rec.outcome, done: false }
      ];
    }
    
    return {
      mode: analysis.mode,
      headline,
      subline: `Readiness ${score.currentScore}% · ${activeLast7}/7 active days`,
      score,
      streak: score.streak,
      activeLast7,
      activityMask,
      momentum30: momentumScores(checkins, 30, score.currentScore),
      roadmapWeeksDone: completedLength,
      roadmapWeeksTotal: roadLength,
      sprintWeekLabel,
      sprintTasks,
      resourcesDone,
      resourceDomains,
      researchCompleted,
      researchInProgress,
      insights: [analysis.user_summary?.diagnosis || "Unified Dashboard Active"],
      primaryLink: { href: `/roadmap/${slug}`, label: "View Roadmaps" },
      userSummary: analysis.user_summary,
      currentSkills: analysis.current_skills || [],
      recommendations: analysis.recommendations || [],
      transitionPlan: tPlan
    };
  }

  return {
    mode: "none",
    headline: "Career dashboard",
    subline: "Analysis record is incomplete — try re-running onboarding.",
    score: null,
    streak: computeStreak(checkins),
    activeLast7,
    activityMask,
    momentum30: momentumScores(checkins, 30, 0),
    roadmapWeeksDone: 0,
    roadmapWeeksTotal: 0,
    sprintWeekLabel: "",
    sprintTasks: [],
    resourcesDone,
    resourceDomains,
    researchCompleted,
    researchInProgress,
    insights: ["Open results or onboard again to restore a valid analysis payload."],
    primaryLink: { href: "/onboard", label: "Go to onboarding" },
    userSummary: undefined,
    currentSkills: [],
    recommendations: [],
    transitionPlan: [],
  };
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
