import { supabase } from "../db/supabase";
import { storage } from "../utils/storage";
import { getProgress } from "../utils/progress";
import { computeFitScore, getUpskillBaseScore } from "../utils/scoring";
import { slugify } from "../utils/utils";

/**
 * The Sync Engine pushes state from localStorage to Supabase asynchronously.
 * It is completely non-blocking to keep the UI fast.
 */
export async function syncToSupabase() {
  // Graceful degradation if Supabase is not configured
  if (!supabase) return;

  const email = storage.getEmail();
  if (!email) return;

  // 1. Gather all state
  const checkins = storage.getCheckins();
  const analysis = storage.getAnalysis();
  const profile = storage.getProfile();
  const resourcesProgress = getProgress();
  
  // Calculate resources done
  const resourcesDone = Object.values(resourcesProgress).reduce((a, b) => a + b.length, 0);

  // Calculate fit score and streak (transition and upskill use the same formula)
  let currentFitScore = 0;
  let currentStreak = 0;

  if (analysis?.mode === "transition" && analysis.transitionResult?.top5Matches?.[0]) {
    const topCareer = analysis.transitionResult.top5Matches[0].career;
    const slug = slugify(topCareer);
    const completedWeeks = storage.getCompletedWeeks(slug);
    const roadmap = storage.getRoadmap(slug) || [];
    const scoreData = computeFitScore(
      analysis.transitionResult.top5Matches[0].fitScore,
      completedWeeks,
      roadmap.length,
      checkins
    );
    currentFitScore = scoreData.currentScore;
    currentStreak = scoreData.streak;
  } else if (analysis?.mode === "upskill" && analysis.upskillResult) {
    const roleKey =
      profile?.u_role && profile.u_role.trim()
        ? slugify(profile.u_role)
        : "upskill";
    const completedWeeks = storage.getCompletedWeeks(roleKey);
    const roadmap = storage.getRoadmap(roleKey) || [];
    const scoreData = computeFitScore(
      getUpskillBaseScore(profile?.u_role || "upskill"),
      completedWeeks,
      roadmap.length,
      checkins
    );
    currentFitScore = scoreData.currentScore;
    currentStreak = scoreData.streak;
  }

  // Find last checkin time
  let lastCheckinAt = null;
  if (checkins.length > 0) {
    // Checkins are stored with 'date' string (YYYY-MM-DD), we'll just save the latest
    const latest = [...checkins].sort((a, b) => b.date.localeCompare(a.date))[0];
    lastCheckinAt = new Date(latest.date).toISOString();
  }

  // 2. Perform the Upsert into the new secure table
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn("Cannot sync: User not authenticated.");
      return;
    }

    await supabase.from("user_states").upsert(
      {
        user_id: user.id, // Securely ties data to Auth User
        state_json: {
          fit_score: currentFitScore,
          streak: currentStreak,
          resources_done: resourcesDone,
          last_checkin_at: lastCheckinAt,
          analysisMode: analysis?.mode,
          checkinsCount: checkins.length,
          completedRoadmapWeeks:
            analysis?.mode === "transition" && analysis.transitionResult?.top5Matches?.[0]
              ? storage.getCompletedWeeks(
                  slugify(analysis.transitionResult.top5Matches[0].career)
                ).length
              : analysis?.mode === "upskill"
                ? storage.getCompletedWeeks(
                    profile?.u_role?.trim() ? slugify(profile.u_role) : "upskill"
                  ).length
                : 0,
        },
      },
      { onConflict: "user_id" }
    );
  } catch (e) {
    console.error("Failed to sync to Supabase user_states:", e);
  }
}
