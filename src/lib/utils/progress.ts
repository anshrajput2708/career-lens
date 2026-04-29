// ── Progress helpers (localStorage) ──────────────────────────────────────────
const PROGRESS_KEY = "careerlens_resource_progress";

export interface ProgressData {
  [career: string]: string[]; // array of completed resource names
}

export function getProgress(): ProgressData {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch { return {}; }
}

export function toggleResourceDone(career: string, resourceName: string): ProgressData {
  const progress = getProgress();
  if (!progress[career]) progress[career] = [];
  const idx = progress[career].indexOf(resourceName);
  if (idx >= 0) progress[career].splice(idx, 1);
  else progress[career].push(resourceName);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  if (typeof window !== "undefined") {
    import("../services/syncEngine").then((m) => m.syncToSupabase().catch(console.error));
  }
  return { ...progress };
}

export function getCareerProgress(career: string): string[] {
  return getProgress()[career] || [];
}

export function getTotalProgress(): { done: number; total: number; careers: number } {
  const p = getProgress();
  const careers = Object.keys(p).filter(k => p[k].length > 0).length;
  const done = Object.values(p).reduce((a, b) => a + b.length, 0);
  return { done, total: 0, careers }; // total filled in by caller
}
