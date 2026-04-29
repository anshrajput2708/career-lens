"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { storage, type CheckInEntry, type AnalysisResult } from "@/lib/utils/storage";
import { todayStr } from "@/lib/utils/scoring";
import {
  resolveFitScoreBreakdown,
  resolveRoadmapHref,
  scoreFallbackBase,
} from "@/lib/services/dashboardMetrics";
import { getScoreLabel } from "@/lib/utils/utils";
import { Flame, Target, ArrowRight, Star } from "lucide-react";

const PAGE: React.CSSProperties = {
  minHeight: "100vh",
  background: "var(--bg-base)",
  backgroundImage: "linear-gradient(rgba(78, 52, 46, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(78, 52, 46, 0.05) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
  fontFamily: "var(--font-body), sans-serif",
  paddingTop: 88,
  paddingBottom: 80,
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const VIGNETTE: React.CSSProperties = {
  position: "fixed", inset: 0,
  boxShadow: "inset 0 0 140px rgba(78,52,46,0.06)",
  pointerEvents: "none", zIndex: 0,
};
const CARD: React.CSSProperties = {
  background: "#fff",
  borderRadius: 24,
  boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
  border: "1px solid rgba(0,0,0,0.06)",
};

const QUESTIONS = [
  "Did you spend any time on your learning roadmap today?",
  "Did you watch a course video or read something related to your target career today?",
  "Did you practice or work on a skill-building project today?",
  "Did you connect with anyone in your target field today?",
  "Did you apply for anything or update your portfolio today?",
];
const MICRO_TASKS = [
  "Watch one 8-minute YouTube video about your target role",
  "Read one article about someone who made this career switch",
  "Spend 15 minutes on your portfolio or a project",
  "Message one person in your target field on LinkedIn",
  "Write down 3 things you learned this week",
  "Review your roadmap — just look at it",
];

export default function CheckinPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [checkins, setCheckins]     = useState<CheckInEntry[]>([]);
  const [answered, setAnswered]     = useState(false);
  const [answeredYes, setAnsweredYes] = useState(false);
  const [question]  = useState(() => QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]);
  const [microTask] = useState(() => MICRO_TASKS[Math.floor(Math.random() * MICRO_TASKS.length)]);

  useEffect(() => {
    const a   = storage.getAnalysis();
    setAnalysis(a);
    const all = storage.getCheckins();
    setCheckins(all);
    // Pre-fill answered state if user already checked in today
    const todayEntry = all.find((c) => c.date === todayStr());
    if (todayEntry) { setAnswered(true); setAnsweredYes(todayEntry.didStudy); }
  }, []);

  function getScoreBreakdown(currentCheckins: CheckInEntry[]) {
    if (!analysis) return null;
    return resolveFitScoreBreakdown(analysis, currentCheckins);
  }

  function respond(yes: boolean) {
    if (!analysis) return;

    // Record check-in with a placeholder score; we recompute after adding
    const tempEntry: CheckInEntry = {
      date: todayStr(),
      didStudy: yes,
      minutesSpent: yes ? 20 : 0,
      fitScoreAtTime: 0,      // filled in below after recompute
      completedSkills: [],
    };

    const nextCheckins = [...checkins, tempEntry];

    // Compute the real score with the new entry included
    const breakdown = getScoreBreakdown(nextCheckins);
    tempEntry.fitScoreAtTime = breakdown?.currentScore ?? scoreFallbackBase(analysis);

    storage.addCheckin(tempEntry);
    setCheckins(nextCheckins);
    setAnswered(true);
    setAnsweredYes(yes);
  }

  const breakdown    = getScoreBreakdown(checkins);
  const fitScore     = breakdown?.currentScore ?? null;
  const streak       = breakdown?.streak ?? 0;
  const weekHistory  = [...checkins].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);

  return (
    <div style={PAGE}>
      <div style={VIGNETTE} />
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 560, padding: "0 20px" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 999, background: "var(--primary)10", border: "1px solid var(--primary)25", marginBottom: 14 }}>
            <Target size={13} color="var(--primary)" />
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--primary)" }}>Daily Check-in</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 800, color: "#111", letterSpacing: "-0.03em", marginBottom: 8 }}>One question. 10 seconds.</h1>
          <p style={{ fontSize: 15, color: "#888" }}>The only habit that moves your fit score forward.</p>
        </motion.div>

        {/* Stat strip without boxes */}
        {(streak > 0 || checkins.length > 0) && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 64 }}>
            {[
              { label: "Streak",    val: streak,              suffix: "d",  color: "#f59e0b" },
              { label: "Check-ins", val: checkins.length,     suffix: "",   color: "var(--primary)" },
              { label: "Fit Score", val: fitScore ?? "—",     suffix: fitScore != null ? "%" : "", color: "#22c55e" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" as const }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 6 }}>{s.val}{s.suffix}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Main Immersive Area */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ width: "100%", maxWidth: 800 }}>
          <AnimatePresence mode="wait">
            {!answered ? (
              <motion.div key="q" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}
                style={{ textAlign: "center" as const, padding: "0" }}>
                
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, color: "var(--text-primary)", textAlign: "center" as const, marginBottom: 48, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  {question}
                </h2>
                <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => respond(true)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 32px", borderRadius: 16, border: "0", background: "var(--text-primary)", color: "#fff", fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body), sans-serif", boxShadow: "0 12px 32px rgba(0,0,0,0.15)" }}>
                    <span style={{ fontSize: 13, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 6, fontWeight: 800 }}>Y</span> Yes, I did
                  </motion.button>
                  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => respond(false)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 32px", borderRadius: 16, border: "1px solid rgba(78,52,46,0.15)", background: "transparent", color: "var(--text-secondary)", fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body), sans-serif" }}>
                    <span style={{ fontSize: 13, background: "rgba(78,52,46,0.06)", padding: "2px 8px", borderRadius: 6, fontWeight: 800 }}>N</span> Not today
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                style={{ textAlign: "center" as const }}>
                {answeredYes ? (
                  <>
                    <h2 style={{ fontSize: "clamp(2.5rem,5vw,3.5rem)", fontWeight: 400, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 16 }}>Well done.</h2>
                    {fitScore !== null && (
                      <div style={{ marginBottom: 32 }}>
                        <span style={{ fontSize: 72, fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.04em", lineHeight: 1 }}>{fitScore}%</span>
                        <p style={{ fontSize: 16, color: "var(--text-primary)", fontWeight: 600, marginTop: 12 }}>{getScoreLabel(fitScore)}</p>
                        {breakdown && (
                          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6, fontWeight: 500 }}>
                            Base: {breakdown.baseScore} • Roadmap: <span style={{color:"#047857"}}>+{breakdown.roadmapBonus.toFixed(1)}</span> • Streak: <span style={{color:"#f59e0b"}}>+{breakdown.consistencyBonus.toFixed(1)}</span>
                          </p>
                        )}
                      </div>
                    )}
                    <Link href={analysis ? resolveRoadmapHref(analysis) : "/roadmaps"} className="btn-saas" style={{ padding: "16px 32px", borderRadius: 14, fontSize: 15, fontWeight: 700 }}>
                      Continue Roadmap <ArrowRight size={15} />
                    </Link>
                  </>
                ) : (
                  <>
                    <h2 style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 400, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 24 }}>The smallest step forward today:</h2>
                    <div style={{ padding: "24px 32px", borderRadius: 16, background: "rgba(78,52,46,0.03)", border: "1px solid rgba(78,52,46,0.08)", marginBottom: 32, display: "inline-block" }}>
                      <p style={{ fontSize: 16, fontWeight: 600, color: "var(--primary)", lineHeight: 1.6 }}>{microTask}</p>
                    </div>
                    <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
                      <Link href={analysis ? resolveRoadmapHref(analysis) : "/roadmaps"} className="btn-saas" style={{ padding: "14px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700 }}>
                        Open Roadmap
                      </Link>
                      <button onClick={() => setAnswered(false)} className="btn-secondary" style={{ padding: "14px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700 }}>
                        Check in anyway
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 7-day history */}
        {weekHistory.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ marginTop: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#bbb", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>Last 7 days</p>
            <div style={{ display: "flex", gap: 8 }}>
              {weekHistory.map((e, i) => (
                <div key={i} title={`${e.date} — ${e.didStudy ? "✓" : "—"}`} style={{ flex: 1, height: 36, borderRadius: 8, background: e.didStudy ? "#22c55e" : "#e8e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                  {e.didStudy ? <Flame size={14} color="#fff" /> : <Star size={12} color="#bbb" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No analysis prompt */}
        {!analysis && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 24, ...CARD, padding: "28px 32px", textAlign: "center" as const }}>
            <p style={{ color: "#888", marginBottom: 16, fontSize: 14 }}>Get your fit score first to track progress here.</p>
            <Link href="/onboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "#111", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
              Get my fit score <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
