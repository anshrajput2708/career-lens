"use client";

import React, { useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Circle,
  FileSearch,
  LayoutDashboard,
  Map,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { storage, type RoadmapWeek } from "@/lib/utils/storage";
import { loadDashboardMetrics, isSupabaseConfigured, resolveRoadmapHref } from "@/lib/services/dashboardMetrics";
import { INDUSTRY_CAREERS } from "@/lib/config/constants";
import { EmailHub } from "@/app/dashboard/EmailHub";

function MomentumChart({ series }: { series: number[] }) {
  const w = 560;
  const h = 120;
  const pad = 8;
  if (series.length < 2) return null;
  const minY = 0;
  const maxY = 100;
  const step = (w - pad * 2) / (series.length - 1);
  const pts = series.map((v, i) => {
    const x = pad + i * step;
    const t = (v - minY) / (maxY - minY);
    const y = pad + (1 - t) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const d = `M ${pts.join(" L ")}`;
  const last = series[series.length - 1] ?? 0;
  const first = series[0] ?? last;
  const delta = last - first;

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          Readiness (30 days)
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>
          {delta >= 0 ? "+" : ""}
          {delta} pts window
        </span>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Fit score trend over the last thirty days"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <line
          x1={pad}
          y1={h / 2}
          x2={w - pad}
          y2={h / 2}
          stroke="var(--border)"
          strokeWidth={1}
        />
        <path
          d={d}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ── Roadmap Progress Widget ──────────────────────────────────────────────────
function RoadmapProgressWidget({ careerSlug, careerName, roadmapHref }: { careerSlug: string; careerName: string; roadmapHref: string }) {
  const [weeks, setWeeks] = React.useState<RoadmapWeek[]>([]);
  const [completed, setCompleted] = React.useState<number[]>([]);

  const reload = React.useCallback(() => {
    const road = storage.getRoadmap(careerSlug) || [];
    const done = storage.getCompletedWeeks(careerSlug);
    setWeeks(road);
    setCompleted(done);
  }, [careerSlug]);

  useEffect(() => {
    reload();
    // Re-read whenever tab regains focus (user comes back from roadmap page)
    window.addEventListener("focus", reload);
    return () => window.removeEventListener("focus", reload);
  }, [reload]);

  function toggleWeek(weekNum: number) {
    const next = completed.includes(weekNum)
      ? completed.filter((w) => w !== weekNum)
      : [...completed, weekNum];
    storage.setCompletedWeeks(careerSlug, next);
    setCompleted(next);
  }

  if (weeks.length === 0) {
    return (
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px 22px", marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>Roadmap Progress</p>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>No roadmap generated yet. <Link href={roadmapHref} style={{ color: "var(--primary)", fontWeight: 600 }}>Generate one →</Link></p>
      </div>
    );
  }

  const progress = weeks.length > 0 ? Math.round((completed.length / weeks.length) * 100) : 0;
  const nextWeek = weeks.find(w => !completed.includes(w.week));

  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px 22px", marginBottom: 20, boxShadow: "var(--shadow-card)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", margin: 0 }}>Roadmap Progress — {careerName}</p>
        <Link href={roadmapHref} style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          Full roadmap <ArrowRight size={12} />
        </Link>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{completed.length} of {weeks.length} weeks done</span>
          <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--primary)", fontWeight: 700 }}>{progress}%</span>
        </div>
        <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "var(--primary)", borderRadius: 3, transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* Week dots — click to toggle */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {weeks.map((w) => {
          const done = completed.includes(w.week);
          return (
            <button
              key={w.week}
              onClick={() => toggleWeek(w.week)}
              title={`Week ${w.week}: ${w.title} — click to ${done ? "unmark" : "mark complete"}`}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                border: done ? "2px solid var(--accent-green)" : "2px solid var(--border-bright)",
                background: done ? "var(--accent-green-soft)" : "var(--bg-elevated)",
                color: done ? "var(--accent-green)" : "var(--text-muted)",
                fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
                cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {done ? "✓" : w.week}
            </button>
          );
        })}
      </div>

      {/* Next up */}
      {nextWeek && (
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <TrendingUp size={14} color="var(--primary)" />
          <div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Up next — Week {nextWeek.week}</span>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: "2px 0 0" }}>{nextWeek.title}</p>
          </div>
        </div>
      )}
      {!nextWeek && weeks.length > 0 && (
        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--accent-green)", fontWeight: 600 }}>
          🎉 Roadmap complete! All {weeks.length} weeks done.
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTemp = searchParams.get("temp") === "true";
  const [m, setM] = React.useState<ReturnType<typeof loadDashboardMetrics> | null>(null);

  function reloadMetrics() {
    if (isTemp) {
      const tempAnalysis = storage.getTempAnalysis();
      if (!tempAnalysis) { router.replace("/dashboard"); return; }
      setM(loadDashboardMetrics(tempAnalysis));
    } else {
      setM(loadDashboardMetrics());
    }
  }

  useEffect(() => {
    reloadMetrics();
    // Re-read metrics on focus so roadmap progress changes are reflected instantly
    window.addEventListener("focus", reloadMetrics);
    return () => window.removeEventListener("focus", reloadMetrics);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTemp]);

  const cloud = useMemo(() => {
    if (!m) return { on: false, label: "" };
    const configured = isSupabaseConfigured();
    const email = storage.getEmail();
    if (!configured) return { on: false, label: "Cloud backup off (add Supabase env keys)." };
    if (!email) return { on: false, label: "Cloud ready — add your email in check-in to sync." };
    return { on: true, label: `Syncing progress to Supabase for ${email}.` };
  }, [m]);

  if (!m) return null;

  const score = m.score;

  // Derive roadmap slug + href for the progress widget
  const analysis = isTemp ? storage.getTempAnalysis() : storage.getAnalysis();
  const roadmapHref = analysis ? resolveRoadmapHref(analysis) : "/roadmaps";
  const careerSlug = roadmapHref.replace("/roadmap/", "");
  const hasRoadmap = roadmapHref.startsWith("/roadmap/") && careerSlug.length > 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        paddingTop: 88,
        paddingBottom: 72,
        fontFamily: "var(--font-body), system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "0 22px",
        }}
      >
        <header style={{ marginBottom: 36 }}>
          <div style={{ display: "block" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-bright)",
                background: "var(--bg-surface)",
                marginBottom: 14,
              }}
            >
              <LayoutDashboard size={14} color="var(--primary)" aria-hidden />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                }}
              >
                Dashboard
              </span>
            </div>
          </div>
          <div style={{ position: "relative", display: "inline-block" }}>
            {m.mode === "upskill" ? (
              <select
                value={m.headline}
                onChange={(e) => {
                  const p = storage.getProfile() || ({} as any);
                  p.u_role = e.target.value;
                  storage.setProfile(p);
                  setM(loadDashboardMetrics());
                }}
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  marginBottom: 10,
                  color: "var(--text-primary)",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none",
                  WebkitAppearance: "none",
                }}
                title="Change your target job role"
              >
                {!INDUSTRY_CAREERS.includes(m.headline) && <option value={m.headline} style={{ fontSize: 16, fontFamily: "var(--font-body), sans-serif", color: "#111", background: "#fff" }}>{m.headline}</option>}
                {INDUSTRY_CAREERS.map((cur) => (
                  <option key={cur} value={cur} style={{ fontSize: 16, fontFamily: "var(--font-body), sans-serif", color: "#111", background: "#fff" }}>
                    {cur}
                  </option>
                ))}
              </select>
            ) : (
              <h1
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  marginBottom: 10,
                  color: "var(--text-primary)",
                }}
              >
                {m.headline}
              </h1>
            )}
            {m.mode === "upskill" && (
              <span style={{ position: "absolute", right: -24, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}>
                ▼
              </span>
            )}
          </div>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.55, maxWidth: 52 * 16 }}>
            {m.subline}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
            <p
              style={{
                fontSize: 12,
                color: cloud.on ? "var(--accent-green)" : "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {cloud.label}
            </p>
            {m.mode === "none" && !isTemp ? (
               <Link href="/onboard" style={{
                 fontSize: 11, 
                 background: "var(--primary)", 
                 color: "var(--bg-surface)", 
                 border: "none", 
                 padding: "5px 12px", 
                 borderRadius: 4, 
                 cursor: "pointer",
                 textDecoration: "none",
                 fontWeight: 600
               }}>
                 Start Analysis
               </Link>
            ) : (
               <Link href="/onboard" style={{
                 fontSize: 11, 
                 background: "var(--primary)", 
                 color: "var(--bg-surface)", 
                 border: "none", 
                 padding: "5px 12px", 
                 borderRadius: 4, 
                 cursor: "pointer",
                 textDecoration: "none",
                 fontWeight: 600
               }}>
                 Retake Assessment
               </Link>
            )}
            <button
               onClick={() => {
                 if (window.confirm("WARNING: This will completely erase all your assessments, roadmap progress, streaks, and check-in history. This cannot be undone. Are you sure you want to reset the dashboard?")) {
                   storage.clearAll();
                   window.location.href = "/";
                 }
               }}
               style={{ 
                 fontSize: 11, 
                 background: "var(--bg-elevated)", 
                 color: "var(--text-secondary)", 
                 border: "1px solid var(--border)", 
                 padding: "4px 8px", 
                 borderRadius: 4, 
                 cursor: "pointer",
                 transition: "all 0.2s"
               }}
            >
               Reset Dashboard Data
            </button>
          </div>
        </header>

        {/* Primary score */}
        <section
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-card)",
            padding: "24px 22px",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
            <div style={{ position: "relative", width: 108, height: 108, flexShrink: 0 }}>
              <svg width={108} height={108} viewBox="0 0 108 108" style={{ transform: "rotate(-90deg)" }}>
                <circle cx={54} cy={54} r={44} fill="none" stroke="var(--border-bright)" strokeWidth={9} />
                <circle
                  cx={54}
                  cy={54}
                  r={44}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeDasharray={`${((score?.currentScore ?? 0) / 100) * 276} 276`}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.04em" }}>
                  {score?.currentScore ?? "—"}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/ 100</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                Score breakdown
              </p>
              {score ? (
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  Base {score.baseScore}
                  <span style={{ color: "var(--text-muted)" }}> · </span>
                  Roadmap +{score.roadmapBonus.toFixed(1)}
                  <span style={{ color: "var(--text-muted)" }}> · </span>
                  Streak +{score.consistencyBonus.toFixed(1)}
                </p>
              ) : (
                <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>No calibrated baseline yet.</p>
              )}
              <p style={{ marginTop: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                Streak <strong style={{ color: "var(--text-primary)" }}>{m.streak}</strong> days · This week{" "}
                <strong style={{ color: "var(--text-primary)" }}>{m.activeLast7}</strong>/7 with study logged
              </p>
              <Link
                href="/checkin"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 14,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--primary)",
                }}
              >
                Daily check-in <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Roadmap Progress Widget */}
        {hasRoadmap && m.mode !== "none" && (
          <RoadmapProgressWidget
            careerSlug={careerSlug}
            careerName={m.headline}
            roadmapHref={roadmapHref}
          />
        )}

        {/* Momentum */}
        {m.mode !== "none" && (
          <section
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-card)",
              padding: "22px 20px",
              marginBottom: 20,
            }}
          >
            <MomentumChart series={m.momentum30} />
          </section>
        )}

        {/* Activity + aggregates */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "20px 18px",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 12,
              }}
            >
              Week activity
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 8 }}>
              {m.activityMask.map((on, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const letter = ["S", "M", "T", "W", "T", "F", "S"][d.getDay()];
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: "100%",
                        height: 14,
                        borderRadius: 8,
                        background: on ? "var(--primary)" : "var(--bg-elevated)",
                        border: on ? "none" : "0.5px solid var(--border-bright)",
                        boxShadow: on ? "0 2px 4px rgba(0,0,0,0.1)" : "inset 0 1px 3px rgba(0,0,0,0.03)",
                        transition: "all 0.2s ease",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: on ? "var(--text-primary)" : "var(--text-muted)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {letter}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "24px 22px",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 16,
              }}
            >
              Learning totals
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 2 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Resources completed:</span> <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{m.resourcesDone}</strong>
                {m.resourceDomains > 0 ? <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 4 }}>across {m.resourceDomains} domain(s)</span> : null}
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Roadmap weeks:</span> <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{m.roadmapWeeksDone}</strong>
                {m.roadmapWeeksTotal > 0 ? <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 4 }}>/ {m.roadmapWeeksTotal}</span> : null}
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Research papers:</span> <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{m.researchCompleted} <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>done</span></strong>
                {m.researchInProgress > 0 ? <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 4 }}>· {m.researchInProgress} in progress</span> : null}
              </li>
            </ul>
          </div>
        </section>

        {/* -------------- UNIFIED DASHBOARD SECTIONS -------------- */}
        
        {m.userSummary && m.userSummary.diagnosis && (
          <section
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "22px 20px",
              marginBottom: 20,
              boxShadow: "var(--shadow-card)",
            }}
          >
            <p style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 12,
              }}>
              AI Diagnosis
            </p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{m.userSummary.diagnosis}</p>
            {m.userSummary.keystoneSkill && (
              <p style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: "var(--primary)" }}>
                Keystone Skill: <span style={{ color: "var(--text-primary)" }}>{m.userSummary.keystoneSkill}</span>
              </p>
            )}
          </section>
        )}

        {m.mode === "transition" && m.userSummary?.targetRoleAnalysis && (
          <section
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "22px 20px",
              marginBottom: 20,
              boxShadow: "var(--shadow-card)",
            }}
          >
             <p style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 12,
              }}>
              Target Role Analysis
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
               <div>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>Transferable Skills</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {(m.userSummary.targetRoleAnalysis.transferableSkills || []).map((s: string, idx: number) => (
                       <span key={idx} style={{ fontSize: 12, background: "var(--bg-elevated)", border: "1px solid var(--border)", padding: "4px 8px", borderRadius: 4 }}>{s}</span>
                    ))}
                  </div>
               </div>
               <div>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>Missing Skills</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {(m.userSummary.targetRoleAnalysis.missingSkills || []).map((ms: any, idx: number) => (
                       <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, background: "var(--bg-elevated)", border: "1px solid var(--border)", padding: "6px 8px", borderRadius: 4 }}>
                          <span>{ms.skill}</span>
                          <span style={{ 
                            fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                            background: ms.gapSeverity === "Critical" ? "rgba(239, 68, 68, 0.15)" : "var(--bg-base)",
                            color: ms.gapSeverity === "Critical" ? "rgb(239, 68, 68)" : "var(--text-secondary)"
                          }}>
                            {ms.gapSeverity}
                          </span>
                       </div>
                    ))}
                  </div>
               </div>
            </div>
          </section>
        )}

        {m.currentSkills && m.currentSkills.length > 0 && (
          <section
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "22px 20px",
              marginBottom: 20,
              boxShadow: "var(--shadow-card)",
            }}
          >
             <p style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 16,
              }}>
              Current Skills Mastery
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {m.currentSkills.map((s, idx) => (
                 <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                       <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{s.skill}</span>
                       <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.level} · {s.score}%</span>
                    </div>
                    <div style={{ width: "100%", height: 6, background: "var(--bg-elevated)", borderRadius: 3, overflow: "hidden" }}>
                       <div style={{ width: `${s.score}%`, height: "100%", background: s.score > 70 ? "var(--accent-green)" : "var(--primary)" }} />
                    </div>
                    {s.gap_severity !== "Low" && (
                       <p style={{ fontSize: 12, color: s.gap_severity === "Critical" ? "rgb(239, 68, 68)" : "var(--text-muted)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: 3, background: "currentColor" }}></span> 
                          Gap: {s.gap_severity} ({s.benchmark})
                       </p>
                    )}
                 </div>
              ))}
            </div>
          </section>
        )}

        {m.mode === "upskill" && m.recommendations && m.recommendations.length > 0 && (
          <section
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "22px 20px",
              marginBottom: 20,
              boxShadow: "var(--shadow-card)",
            }}
          >
             <p style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 16,
              }}>
              Top Upskill Recommendations
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {m.recommendations.map((rec, idx) => (
                 <div key={idx} style={{ padding: 14, borderRadius: 8, background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                       <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{rec.title}</h4>
                       <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", padding: "2px 6px", borderRadius: 4, background: "var(--bg-base)", color: rec.priority === "High" ? "var(--primary)" : "var(--text-secondary)" }}>{rec.priority} ROI</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>{rec.outcome}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 11, color: "var(--text-muted)" }}>
                       <span style={{ background: "var(--bg-base)", padding: "2px 8px", borderRadius: 4 }}>{rec.type}</span>
                       <span style={{ background: "var(--bg-base)", padding: "2px 8px", borderRadius: 4 }}>⏱ {rec.time}</span>
                       <span style={{ background: "var(--bg-base)", padding: "2px 8px", borderRadius: 4 }}>{rec.difficulty}</span>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-primary)" }}>
                      <strong>Resource:</strong> {rec.resource}
                    </div>
                 </div>
              ))}
            </div>
          </section>
        )}

        {m.mode === "transition" && m.transitionPlan && m.transitionPlan.length > 0 && (
          <section
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "22px 20px",
              marginBottom: 20,
              boxShadow: "var(--shadow-card)",
            }}
          >
             <p style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 16,
              }}>
              Transition Roadmap
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {m.transitionPlan.map((phase, idx) => (
                 <div key={idx} style={{ display: "flex", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                       <div style={{ width: 12, height: 12, borderRadius: 6, background: idx === 0 ? "var(--primary)" : "var(--bg-elevated)", border: idx === 0 ? "none" : "2px solid var(--border)" }} />
                       {idx !== m.transitionPlan!.length - 1 && <div style={{ flex: 1, width: 2, background: "var(--border)" }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 16 }}>
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{phase.phase}</h4>
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{phase.timeline}</span>
                       </div>
                       <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}><strong style={{ color: "var(--text-primary)" }}>Skills:</strong> {phase.skills}</p>
                       <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}><strong style={{ color: "var(--text-primary)" }}>Resource:</strong> {phase.resources}</p>
                       <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", padding: "8px 12px", borderRadius: 6, fontSize: 12, color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <Target size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
                          <span>{phase.milestone}</span>
                       </div>
                    </div>
                 </div>
              ))}
            </div>
          </section>
        )}

        <EmailHub
          summary={{
            headline: m.headline,
            fitScore: score?.currentScore ?? null,
            streak: m.streak,
            resourcesDone: m.resourcesDone,
          }}
        />

        {/* Nav links — compact */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { href: "/roadmaps", icon: Map, label: "Roadmaps" },
            { href: "/resume-analysis", icon: FileSearch, label: "Resume analysis" },
            { href: "/research-lens", icon: Brain, label: "Research lens" },
            { href: "/resources", icon: BookOpen, label: "Resources" },
            { href: "/onboard", icon: Target, label: "Re-run analysis" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                fontSize: 14,
                fontWeight: 600,
                boxShadow: "var(--shadow-card)",
              }}
            >
              <Icon size={18} color="var(--primary)" aria-hidden />
              <span style={{ flex: 1 }}>{label}</span>
              <ArrowRight size={16} color="var(--text-muted)" aria-hidden />
            </Link>
          ))}
          
          <button
            onClick={() => {
              // Standard client-side wrapper to invoke the server action
              import('@/app/login/actions').then(m => m.signout());
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <span style={{ flex: 1, color: "var(--text-secondary)" }}>Sign Out</span>
          </button>
        </nav>

        {m.mode === "upskill" && (
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <Link href={m.primaryLink.href} style={{ fontSize: 14, fontWeight: 600, color: "var(--primary)" }}>
              {m.primaryLink.label} <Star size={14} style={{ display: "inline", verticalAlign: "middle" }} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
