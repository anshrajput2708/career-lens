/**
 * scoring.ts — CareerLens fit score computation
 *
 * Formula (single source of truth):
 *
 *   currentFitScore = clamp(baseScore + roadmapBonus + consistencyBonus, 0, 100)
 *
 *   baseScore        = AI-assigned fitScore from the initial analysis (never mutated)
 *   roadmapBonus     = (completedWeeks / totalWeeks) * ROADMAP_WEIGHT   (max 20 pts)
 *   consistencyBonus = currentStreak * STREAK_WEIGHT                    (max 10 pts)
 *
 * Rules:
 *  - baseScore is read-only and never modified after analysis.
 *  - roadmapBonus is 0 when no roadmap exists.
 *  - consistencyBonus uses the *current* streak (consecutive days ending today or yesterday).
 *  - Total is always clamped to [0, 100].
 */

import type { CheckInEntry } from "@/lib/utils/storage";

// ── Weights (must sum to ≤ 30 so base AI score dominates) ───────────────────
const ROADMAP_WEIGHT   = 20; // max bonus for finishing the roadmap
const STREAK_WEIGHT    = 0.5; // pts per consecutive day
const STREAK_CAP       = 10; // maximum pts from streak

/**
 * Upskill analyses do not include an AI fit percentage. This anchor generates 
 * a consistent pseudo-random base score between 45 and 80 based on the role, 
 * keeping the formula comparable over time even when tracking changes.
 */
export function getUpskillBaseScore(role: string): number {
  if (!role) return 62;
  let hash = 0;
  for (let i = 0; i < role.length; i++) {
    hash = role.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 45 + (Math.abs(hash) % 36);
}

// ── Streak ───────────────────────────────────────────────────────────────────

/** Returns today's date string in YYYY-MM-DD (local time). */
export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Returns the date string for N days before the reference date. */
function offsetDate(isoDate: string, daysBefore: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() - daysBefore);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Calculates the current streak (consecutive days of studying ending today or yesterday).
 * A streak day requires `didStudy === true`.
 */
export function computeStreak(checkins: CheckInEntry[]): number {
  if (!checkins.length) return 0;

  // Build a Set of dates the user actually studied (O(n) lookup)
  const studiedDates = new Set(
    checkins.filter((c) => c.didStudy).map((c) => c.date)
  );

  const today = todayStr();
  let streak = 0;

  // Allow streak to be active if today has *not* been checked in yet (don't break streak)
  // Start counting from yesterday if today hasn't been logged, else from today.
  const startDay = studiedDates.has(today) ? today : offsetDate(today, 1);

  let cursor = startDay;
  while (studiedDates.has(cursor)) {
    streak++;
    cursor = offsetDate(cursor, 1); // move back one day
  }

  return streak;
}

// ── Roadmap bonus ─────────────────────────────────────────────────────────────

/**
 * Returns the roadmap bonus points.
 * @param completedWeeks - array of completed week indices
 * @param totalWeeks - total weeks in the roadmap (0 means no roadmap yet)
 */
export function computeRoadmapBonus(
  completedWeeks: number[],
  totalWeeks: number
): number {
  if (totalWeeks === 0) return 0;
  const progress = Math.min(completedWeeks.length, totalWeeks) / totalWeeks;
  return Math.round(progress * ROADMAP_WEIGHT * 10) / 10; // keep 1 decimal
}

// ── Consistency bonus ─────────────────────────────────────────────────────────

/**
 * Returns the streak bonus points, capped at STREAK_CAP.
 */
export function computeConsistencyBonus(streak: number): number {
  return Math.min(streak * STREAK_WEIGHT, STREAK_CAP);
}

// ── Master score ──────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  /** AI-assigned base score from initial analysis (never changes). */
  baseScore: number;
  /** Bonus earned from completing roadmap weeks (0 – 20). */
  roadmapBonus: number;
  /** Bonus earned from daily check-in streak (0 – 10). */
  consistencyBonus: number;
  /** Final clamped score shown to the user (0 – 100). */
  currentScore: number;
  /** Current streak in days. */
  streak: number;
}

/**
 * Single source of truth for the user's current fit score.
 *
 * @param baseScore       - original AI fitScore (0-100)
 * @param completedWeeks  - indices of completed roadmap weeks
 * @param totalWeeks      - total weeks in the roadmap (0 = none)
 * @param checkins        - all historical check-in entries
 */
export function computeFitScore(
  baseScore: number,
  completedWeeks: number[],
  totalWeeks: number,
  checkins: CheckInEntry[]
): ScoreBreakdown {
  const streak            = computeStreak(checkins);
  const roadmapBonus      = computeRoadmapBonus(completedWeeks, totalWeeks);
  const consistencyBonus  = computeConsistencyBonus(streak);

  const raw = baseScore + roadmapBonus + consistencyBonus;
  const currentScore = Math.min(100, Math.max(0, Math.round(raw)));

  return { baseScore, roadmapBonus, consistencyBonus, currentScore, streak };
}
