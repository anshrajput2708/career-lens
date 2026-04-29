"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { storage, type AnalysisResult } from "@/lib/utils/storage";
import { ArrowRight, Cpu, RotateCcw } from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getScoreColor(score: number) {
  if (score >= 80) return "var(--accent-green)";
  if (score >= 65) return "var(--primary)";
  if (score >= 50) return "var(--accent-amber)";
  return "var(--accent-red)";
}

function getScoreLabel(score: number) {
  if (score >= 80) return "High Fit";
  if (score >= 65) return "Strong";
  if (score >= 50) return "Possible";
  return "Weak Fit";
}

// ── Score Number ───────────────────────────────────────────────────────────────

function AnimatedScore({ score }: { score: number }) {
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1400;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setAnim(Math.round(eased * score));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: getScoreColor(score) }}>
      {anim}%
    </span>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────────

function Divider({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      height: 1,
      background: "var(--border)",
      margin: "36px 0",
      ...style
    }} />
  );
}

// ── Section Label ──────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      fontFamily: "var(--font-mono)",
      marginBottom: 20,
    }}>
      {children}
    </div>
  );
}

// ── Transition View ────────────────────────────────────────────────────────────

function TransitionView({ data }: { data: NonNullable<AnalysisResult["transitionResult"]> }) {
  const topMatches = data.top5Matches || [];
  if (topMatches.length === 0) return <div>No matches found.</div>;
  const top = topMatches[0];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

      {/* ── Primary match hero ── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "var(--text-muted)",
          fontFamily: "var(--font-mono)", marginBottom: 16
        }}>
          Your Highest-Signal Match
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700,
            color: "var(--text-primary)", letterSpacing: "-0.04em",
            lineHeight: 1.1, fontFamily: "var(--font-display)", margin: 0
          }}>
            {top.career}
          </h1>
          <span style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700,
            fontFamily: "var(--font-mono)", color: getScoreColor(top.fitScore),
            letterSpacing: "-0.03em"
          }}>
            <AnimatedScore score={top.fitScore} /> fit
          </span>
        </div>

        <p style={{
          fontSize: 16, lineHeight: 1.75, color: "var(--text-secondary)",
          maxWidth: 640, margin: 0
        }}>
          {top.whyFit}
        </p>

        {top.salaryRange && (
          <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {top.salaryRange}
            </span>
            {top.targetCompanies && (
              <>
                <span style={{ color: "var(--border-bright)", fontSize: 12 }}>·</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{top.targetCompanies}</span>
              </>
            )}
          </div>
        )}

        {top.actionPlan && (
          <div style={{ marginTop: 20, paddingLeft: 16, borderLeft: "2px solid var(--primary)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 4 }}>Your First Move</div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{top.actionPlan}</p>
          </div>
        )}
      </div>

      <Divider />

      {/* ── Other matches ── */}
      {topMatches.length > 1 && (
        <div style={{ marginBottom: 0 }}>
          <SectionLabel>Other Strong Matches — click to open roadmap</SectionLabel>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {topMatches.slice(1).map((m, i) => (
              <Link
                key={i}
                href={`/roadmap/${slugify(m.career)}`}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "14px 0",
                  borderBottom: i < topMatches.length - 2 ? "1px solid var(--border)" : "none",
                  textDecoration: "none",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.65"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "baseline", minWidth: 0 }}>
                  <span style={{
                    fontSize: 11, color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)", flexShrink: 0
                  }}>
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <span style={{
                    fontSize: 15, fontWeight: 600, color: "var(--text-primary)",
                    fontFamily: "var(--font-body)", whiteSpace: "nowrap",
                    overflow: "hidden", textOverflow: "ellipsis"
                  }}>
                    {m.career}
                  </span>
                  {m.salaryRange && (
                    <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>{m.salaryRange}</span>
                  )}
                </div>
                <span style={{
                  fontFamily: "var(--font-mono)", fontWeight: 700,
                  fontSize: 13, color: getScoreColor(m.fitScore), flexShrink: 0
                }}>
                  {m.fitScore}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Only show first match's roadmap */}
      {(data.roadmap?.phase1 || data.roadmap?.phase2 || data.roadmap?.phase3) && (
        <>
          <Divider />
          <div>
            <SectionLabel>Transition Roadmap</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {[
                { label: "Phase 1 — Foundations", content: data.roadmap?.phase1 },
                { label: "Phase 2 — Build & Prove", content: data.roadmap?.phase2 },
                { label: "Phase 3 — Execution", content: data.roadmap?.phase3 },
              ].filter(p => p.content).map((phase, i) => (
                <div key={i} style={{ paddingLeft: 16, borderLeft: "2px solid var(--border)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 6 }}>
                    {phase.label}
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{phase.content}</p>
                </div>
              ))}
              
              {data.roadmap?.whyThisRoadmap && (
                <div style={{ paddingLeft: 16, borderLeft: "2px solid var(--accent-amber)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-amber)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 6 }}>
                    Resource Rationale & Validation
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{data.roadmap.whyThisRoadmap}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Hardest challenge from top match */}
      {top.hardestChallenge && (
        <>
          <Divider />
          <div>
            <SectionLabel>Biggest Challenge Ahead</SectionLabel>
            <p style={{ fontSize: 15, color: "var(--accent-red)", lineHeight: 1.7, margin: 0 }}>
              {top.hardestChallenge}
            </p>
          </div>
        </>
      )}

    </motion.div>
  );
}

// ── Upskill View ───────────────────────────────────────────────────────────────

function UpskillView({ data }: { data: NonNullable<AnalysisResult["upskillResult"]> }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

      {/* ── Hero ── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "var(--text-muted)",
          fontFamily: "var(--font-mono)", marginBottom: 16
        }}>
          Your Keystone Skill
        </div>
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700,
          color: "var(--text-primary)", letterSpacing: "-0.04em",
          lineHeight: 1.1, fontFamily: "var(--font-display)", margin: "0 0 16px"
        }}>
          {data.keystoneSkill}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--text-secondary)", maxWidth: 640, margin: "0 0 12px" }}>
          {data.diagnosisSummary}
        </p>
        <div style={{ paddingLeft: 16, borderLeft: "2px solid var(--primary)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 4 }}>Gap Analysis</div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{data.gapAnalysis}</p>
        </div>
      </div>

      <Divider />

      {/* ── Execution Plan ── */}
      {data.quarters && Object.keys(data.quarters).length > 0 && (
        <div style={{ marginBottom: 0 }}>
          <SectionLabel>12-Month Execution Plan</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {Object.entries(data.quarters).map(([qKey, phase], idx) => {
              const q = phase as any;
              return (
                <div key={qKey} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)",
                    color: "var(--text-muted)", letterSpacing: "0.06em",
                    textTransform: "uppercase", minWidth: 56, paddingTop: 2, flexShrink: 0
                  }}>
                    Q{idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 }}>
                      {q.skills}
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 8px" }}>
                      {q.checkpoint}
                    </p>
                    {q.resources && (
                      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                        Resources: {q.resources}
                      </p>
                    )}
                    {q.weeklyHours && (
                      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0", fontFamily: "var(--font-mono)" }}>
                        {q.weeklyHours} / week
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Timeline ── */}
      {data.timelineRealistic && (
        <>
          <Divider />
          <div>
            <SectionLabel>Honest Timeline</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ paddingLeft: 16, borderLeft: "2px solid var(--accent-green)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-green)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 4 }}>If you execute</div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{data.timelineRealistic}</p>
              </div>
              {data.timelineFailure && (
                <div style={{ paddingLeft: 16, borderLeft: "2px solid var(--accent-red)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-red)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 4 }}>If you drift</div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{data.timelineFailure}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Resources ── */}
      {(data.resourceStack?.courses?.length > 0 || data.resourceStack?.books?.length > 0) && (
        <>
          <Divider />
          <div>
            <SectionLabel>Resource Stack</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.resourceStack?.courses?.length > 0 && (
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Courses — </span>
                  {data.resourceStack.courses.join(", ")}
                </p>
              )}
              {data.resourceStack?.books?.length > 0 && (
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Books — </span>
                  {data.resourceStack.books.join(", ")}
                </p>
              )}
              {data.resourceStack?.repos?.length > 0 && (
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Repos — </span>
                  {data.resourceStack.repos.join(", ")}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Anti Patterns ── */}
      {data.antiPatterns?.length > 0 && (
        <>
          <Divider />
          <div>
            <SectionLabel>Anti-Patterns to Avoid</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.antiPatterns.map((ap, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", paddingTop: 2, flexShrink: 0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{ap}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [emailPromptOpen, setEmailPromptOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    const data = storage.getAnalysis();
    if (!data || (!data.transitionResult && !data.upskillResult)) {
      router.push("/onboard");
      return;
    }
    setAnalysis(data);

    if (!storage.getEmail()) {
      setTimeout(() => setEmailPromptOpen(true), 2500);
    }
  }, [router]);

  const handleSaveEmail = () => {
    if (emailInput.includes("@")) {
      storage.setEmail(emailInput);
      setEmailPromptOpen(false);
    }
  };

  if (!analysis) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
      <Cpu size={24} color="var(--primary)" style={{ animation: "spin 2s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", fontFamily: "var(--font-body)", paddingBottom: 100 }}>

      {/* ── EMAIL MODAL ── */}
      <AnimatePresence>
        {emailPromptOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <div
              style={{ position: "absolute", inset: 0, background: "rgba(41,37,36,0.45)", backdropFilter: "blur(8px)" }}
              onClick={() => setEmailPromptOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              style={{
                background: "var(--bg-surface)", border: "1px solid var(--border)",
                borderRadius: 20, position: "relative", zIndex: 1,
                width: "100%", maxWidth: 400, padding: 36, textAlign: "center",
                boxShadow: "0 24px 80px rgba(41,37,36,0.12)"
              }}
            >
              <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 8, fontFamily: "var(--font-display)" }}>
                Get your weekly update
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 20 }}>
                Save your diagnosis across devices and receive a weekly progress summary.
              </p>
              <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
                <input
                  type="email" placeholder="you@example.com"
                  value={emailInput} onChange={e => setEmailInput(e.target.value)} autoFocus
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 10,
                    border: "1.5px solid var(--border-bright)", fontSize: 14,
                    background: "var(--bg-elevated)", color: "var(--text-primary)",
                    outline: "none", fontFamily: "var(--font-body)"
                  }}
                  onKeyDown={e => e.key === "Enter" && handleSaveEmail()}
                />
                <button
                  onClick={handleSaveEmail}
                  style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "var(--primary)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  Enable Saves
                </button>
              </div>
              <button
                onClick={() => setEmailPromptOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 12, marginTop: 14, cursor: "pointer" }}
              >
                Skip for now
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>

        {/* Breadcrumb bar */}
        <div style={{ paddingTop: 28, paddingBottom: 36, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Results
            </span>
            <span style={{ color: "var(--border-bright)" }}>/</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {analysis.mode === "transition" ? "Career Transition" : "Engineering Upskill"}
            </span>
          </div>
          <Link
            href="/onboard"
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 12, fontWeight: 600, color: "var(--text-muted)",
              textDecoration: "none", transition: "color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--primary)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
          >
            <RotateCcw size={12} /> Start Over
          </Link>
        </div>

        {/* Main views */}
        {analysis.mode === "transition" && analysis.transitionResult && (
          <TransitionView data={analysis.transitionResult} />
        )}
        {analysis.mode === "upskill" && analysis.upskillResult && (
          <UpskillView data={analysis.upskillResult} />
        )}

        {/* Footer CTA */}
        <Divider style={{ marginTop: 48 }} />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/dashboard" className="btn-saas" style={{ padding: "11px 22px", fontSize: 13 }}>
            View Dashboard <ArrowRight size={13} />
          </Link>
          <Link href="/roadmaps" className="btn-secondary" style={{ padding: "11px 22px", fontSize: 13 }}>
            All Roadmaps
          </Link>
        </div>

      </div>
    </div>
  );
}
