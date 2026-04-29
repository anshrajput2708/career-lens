"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { storage } from "@/lib/utils/storage";
import { ArrowRight, Upload, ShieldCheck, Radar, FileSearch, ChevronDown, Search } from "lucide-react";

type ApiResult = {
  result: {
    targetRole: string;
    overall_score: number;
    overall_summary: string;
    percentile_estimate: string;
    sections: {
      experience: { score: number; summary: string; positives: string[]; negatives: string[] };
      projects: { score: number; summary: string; projects_reviewed: { name: string; score: number; issue: string }[] };
      skills: { score: number; present_skills: string[]; missing_critical: string[]; missing_nicetohave: string[]; bonus_skills: string[] };
      impact_metrics: { score: number; metrics_found: string[]; missing_metric_locations: string[] };
      ats_readability: { score: number; issues: string[]; passed_checks: string[] };
      keyword_match: { score: number; matched: string[]; missing: string[] };
    };
    strengths: string[];
    ats_issues: string[];
    missing_skills: { skill: string; severity: "HIGH" | "MEDIUM" | "LOW"; reason: string }[];
    improvement_plan: { priority: number; action: string; impact: string }[];
    rewrite_suggestions: { original: string; improved: string }[];
  };
  extractedTextPreview: string;
  extractionMethod: string;
  extractionWarning?: string | null;
  trustedResources: { title: string; provider: string; url: string; tags: string[] }[];
};

const card: React.CSSProperties = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-card)",
  padding: "22px 20px",
};

function scoreColor(score: number): string {
  if (score >= 80) return "var(--accent-green)";
  if (score >= 65) return "var(--primary)";
  if (score >= 45) return "var(--accent-amber)";
  return "var(--accent-red)";
}

import { INDUSTRY_CAREERS } from "@/lib/config/constants";

export default function ResumeAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [customRole, setCustomRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResult | null>(null);

  const dropdownRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [roleHint, setRoleHint] = useState("");
  const [roleOptions, setRoleOptions] = useState<string[]>(INDUSTRY_CAREERS);

  useEffect(() => {
    try {
      const analysis = storage.getAnalysis();
      const p = storage.getProfile();
      let hint = "";
      
      if (analysis?.mode === "transition" && analysis.transitionResult?.top5Matches?.[0]) {
        hint = analysis.transitionResult.top5Matches[0].career;
      } else if (p?.u_role) {
        hint = p.u_role;
      }
      setRoleHint(hint);

      const candidates =
        analysis?.mode === "transition"
          ? (analysis.transitionResult?.top5Matches || []).map((m) => m.career)
          : [];
      
      setRoleOptions(prevOptions => {
        const merged = [...candidates, hint, ...prevOptions].filter(Boolean) as string[];
        return [...new Set(merged)];
      });
      
      // Optionally auto-select the hint if it makes sense
      if (hint && selectedRole === "Software Engineer") {
        setSelectedRole(hint);
      }
    } catch(e) {}
  }, []);

  const effectiveTargetRole = selectedRole === "__other__" ? customRole.trim() : selectedRole;

  async function runAnalysis() {
    if (!file) {
      setError("Upload your resume first.");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const form = new FormData();
      form.append("resume", file);
      form.append("targetRole", effectiveTargetRole || "Software Engineer");
      const profile = storage.getProfile();
      const analysis = storage.getAnalysis();
      if (profile) form.append("profile", JSON.stringify(profile));
      if (analysis) form.append("analysis", JSON.stringify(analysis));

      const r = await fetch("/api/resume-analysis", { method: "POST", body: form });
      const j = (await r.json()) as ApiResult | { error?: string };
      if (!r.ok || !("result" in j)) {
        setError((j as { error?: string }).error || "Could not analyze resume.");
        return;
      }
      setData(j);
    } catch {
      setError("Network/server error while analyzing resume.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        paddingTop: 88,
        paddingBottom: 72,
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 22px" }}>
        <header style={{ marginBottom: 26 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid var(--border-bright)",
              borderRadius: "var(--radius-full)",
              padding: "4px 12px",
              background: "var(--bg-surface)",
              marginBottom: 10,
            }}
          >
            <FileSearch size={14} color="var(--primary)" />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Resume Analysis
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.4rem)", marginBottom: 8 }}>
            Is your resume ready for exactly what they want?
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 760 }}>
            Upload your resume to see if it survives the brutal reality of the modern hiring filter. We’ll score it against your target role, pinpoint exactly what skills you're missing, and give you the resources to fix it before you hit apply.
          </p>
        </header>

        <section style={{ ...card, marginBottom: 18 }}>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1.2fr 1fr auto" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Resume file
              </span>
              <input
                type="file"
                accept=".pdf,.txt,.md,.png,.jpg,.jpeg,.webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--bg-elevated)" }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, position: "relative" }} ref={dropdownRef}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Target role
              </span>
              
              {/* Custom Searchable Select trigger */}
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  padding: "10px 12px",
                  border: dropdownOpen ? "1px solid var(--primary)" : "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                {selectedRole === "__other__" ? "Other (Custom)" : selectedRole}
                <ChevronDown size={16} />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: 6,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-lg)",
                  zIndex: 50,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: 320
                }}>
                  <div style={{ padding: 10, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
                    <Search size={14} color="var(--text-muted)" />
                    <input 
                      autoFocus
                      placeholder="Search career paths..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", width: "100%", fontSize: 14
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "6px 0" }}>
                    {roleOptions.filter(r => r.toLowerCase().includes(searchQuery.toLowerCase())).map((r) => (
                      <div
                        key={r}
                        onClick={() => {
                          setSelectedRole(r);
                          setDropdownOpen(false);
                          setSearchQuery("");
                        }}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontSize: 14,
                          background: selectedRole === r ? "var(--bg-surface)" : "transparent",
                          color: selectedRole === r ? "var(--primary)" : "var(--text-primary)",
                          fontWeight: selectedRole === r ? 600 : 400
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = selectedRole === r ? "var(--bg-surface)" : "transparent")}
                      >
                        {r}
                      </div>
                    ))}
                    <div
                      onClick={() => {
                        setSelectedRole("__other__");
                        setDropdownOpen(false);
                        setCustomRole("");
                        setSearchQuery("");
                      }}
                      style={{ padding: "8px 12px", cursor: "pointer", fontSize: 14, borderTop: "1px solid var(--border)", color: "var(--text-muted)", marginTop: 4 }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      + Other (type manually)
                    </div>
                  </div>
                </div>
              )}
            </label>
            <button
              type="button"
              disabled={loading}
              onClick={runAnalysis}
              style={{
                alignSelf: "end",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 16px",
                borderRadius: "var(--radius-md)",
                background: "var(--primary)",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                cursor: loading ? "wait" : "pointer",
              }}
            >
              <Upload size={16} />
              {loading ? "Analyzing..." : "Analyze resume"}
            </button>
          </div>
          {selectedRole === "__other__" && (
            <div style={{ marginTop: 10 }}>
              <input
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder={roleHint || "Type your exact target role"}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          )}
          {file && <p style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>Selected: {file.name}</p>}
          {roleHint && (
            <p style={{ marginTop: 6, fontSize: 12, color: "var(--text-muted)" }}>
              Suggested from your profile: <strong style={{ color: "var(--text-secondary)" }}>{roleHint}</strong>
            </p>
          )}
          {error && <p style={{ marginTop: 10, color: "var(--accent-red)", fontFamily: "var(--font-mono)", fontSize: 13 }}>{error}</p>}
        </section>

        {data && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <section style={{ ...card, marginBottom: 14 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
                <div style={{ position: "relative", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", position: "absolute" }}>
                    <circle cx="50" cy="50" r="44" fill="none" stroke="var(--border)" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke={scoreColor(data.result.overall_score)}
                      strokeWidth="8"
                      strokeDasharray="276.46"
                      strokeDashoffset={276.46 - (276.46 * data.result.overall_score) / 100}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1s ease-out" }}
                    />
                  </svg>
                  <div style={{ fontSize: 24, fontWeight: 800, color: scoreColor(data.result.overall_score), letterSpacing: "-0.03em", zIndex: 1, marginTop: 4 }}>
                    {data.result.overall_score}
                  </div>
                </div>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", marginBottom: 4 }}>{data.result.targetRole}</h2>
                  <div style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 600 }}>{data.result.percentile_estimate}</div>
                </div>
              </div>
              <p style={{ marginTop: 10, color: "var(--text-secondary)", lineHeight: 1.6 }}>{data.result.overall_summary}</p>
              <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                Extraction: {data.extractionMethod}
              </div>
              {data.extractionWarning ? (
                <div style={{ marginTop: 8, fontSize: 12, color: "var(--accent-amber)", fontFamily: "var(--font-mono)" }}>
                  Note: {data.extractionWarning}
                </div>
              ) : null}
            </section>

            <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div style={card}>
                <h3 style={{ marginBottom: 10, fontSize: 15 }}>Deep Section Scores</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { section: "Experience", score: data.result.sections.experience.score, rationale: data.result.sections.experience.summary },
                    { section: "Projects", score: data.result.sections.projects.score, rationale: data.result.sections.projects.summary },
                    { section: "Skills", score: data.result.sections.skills.score, rationale: `Matched: ${data.result.sections.skills.present_skills.length} | Missing Critical: ${data.result.sections.skills.missing_critical.length}` },
                    { section: "Impact Metrics", score: data.result.sections.impact_metrics.score, rationale: `Found: ${data.result.sections.impact_metrics.metrics_found.length} metrics` },
                    { section: "ATS Readability", score: data.result.sections.ats_readability.score, rationale: `${data.result.sections.ats_readability.issues.length} issues detected` }
                  ].map((s, i) => (
                    <div key={`${s.section}-${i}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span>{s.section}</span>
                        <strong style={{ color: scoreColor(s.score) }}>{s.score}</strong>
                      </div>
                      <p style={{ marginTop: 2, fontSize: 12, color: "var(--text-muted)" }}>{s.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={card}>
                <h3 style={{ marginBottom: 10, fontSize: 15 }}>Strengths</h3>
                <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 14 }}>
                  {data.result.strengths.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
                <h3 style={{ margin: "14px 0 8px", fontSize: 15 }}>Fatal ATS Issues</h3>
                <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 14 }}>
                  {data.result.ats_issues.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section style={{ ...card, marginBottom: 14 }}>
              <h3 style={{ marginBottom: 10, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                <Radar size={16} color="var(--primary)" /> Missing Skills (Strict Analysis)
              </h3>
              <div style={{ display: "grid", gap: 10 }}>
                {data.result.missing_skills.map((g, i) => (
                  <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px 12px", background: "var(--bg-elevated)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <strong>{g.skill}</strong>
                      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: g.severity === "HIGH" ? "var(--accent-red)" : g.severity === "MEDIUM" ? "var(--accent-amber)" : "var(--text-muted)" }}>
                        {g.severity}
                      </span>
                    </div>
                    <p style={{ marginTop: 6, fontSize: 13, color: "var(--text-secondary)" }}>{g.reason}</p>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div style={card}>
                <h3 style={{ marginBottom: 10, fontSize: 15 }}>Surgical Rewrites</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {data.result.rewrite_suggestions.map((p, i) => (
                    <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px 12px" }}>
                      <p style={{ fontSize: 12, color: "var(--accent-red)", textDecoration: "line-through" }}>{p.original}</p>
                      <p style={{ marginTop: 6, fontSize: 13, color: "var(--accent-green)", fontWeight: 500 }}>{p.improved}</p>
                    </div>
                  ))}
                </div>
                {data.result.sections.projects.projects_reviewed.length > 0 && (
                  <>
                    <h3 style={{ margin: "14px 0 8px", fontSize: 15 }}>Projects Analysis</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {data.result.sections.projects.projects_reviewed.map((p, i) => (
                        <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px 12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <strong>{p.name}</strong>
                            <strong style={{ color: scoreColor(p.score) }}>{p.score}</strong>
                          </div>
                          <p style={{ marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>{p.issue}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div style={card}>
                <h3 style={{ marginBottom: 10, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                  <ShieldCheck size={16} color="var(--accent-green)" /> Strategic Action Plan
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {data.result.improvement_plan.map((i, idx) => (
                    <div key={idx} style={{ padding: "8px 12px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>Priority {i.priority}</div>
                      <p style={{ fontSize: 14, color: "var(--text-primary)" }}>{i.action}</p>
                      <p style={{ fontSize: 12, color: "var(--accent-green)", marginTop: 4 }}>{i.impact}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  {data.trustedResources.map((r) => (
                    <a
                      key={r.url}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        padding: "10px 12px",
                        display: "block",
                        background: "var(--bg-surface)",
                        textDecoration: "none",
                        color: "var(--text-primary)",
                      }}
                    >
                      <strong style={{ fontSize: 13 }}>{r.title}</strong>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{r.provider}</div>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            <section style={card}>
              <h3 style={{ marginBottom: 8, fontSize: 14 }}>Extracted resume preview (for QA)</h3>
              <pre
                style={{
                  margin: 0,
                  maxHeight: 220,
                  overflow: "auto",
                  whiteSpace: "pre-wrap",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 12px",
                }}
              >
                {data.extractedTextPreview}
              </pre>
            </section>
          </motion.div>
        )}

        <div style={{ marginTop: 20 }}>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--primary)", fontWeight: 700 }}>
            Back to dashboard <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
