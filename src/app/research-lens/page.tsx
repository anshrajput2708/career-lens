"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ExternalLink, Trophy, Star, Zap, Target, Brain, Cpu,
  Code2, Server, Database, Shield, Smartphone, Palette, BarChart2,
  GitBranch, Gamepad2, FileText, Layers, TestTube2, Bitcoin, ChevronDown,
} from "lucide-react";
import {
  CAREER_RESEARCH_JOURNEYS, HALL_OF_FAME_PAPERS, RESEARCH_PAPERS,
  RESEARCH_TRACKS, inferRecommendedTrack,
  type ResearchPaper, type ResearchTrack,
} from "@/lib/services/researchLens";
import { storage, type AnalysisResult, type UserProfile } from "@/lib/utils/storage";

// ─── Track Icons ──────────────────────────────────────────────────────────────
const TRACK_ICONS: Record<ResearchTrack, React.ReactNode> = {
  "Frontend Developer":    <Code2 size={14} />,
  "Backend Developer":     <Server size={14} />,
  "Full Stack Developer":  <Layers size={14} />,
  "DevOps Engineer":       <GitBranch size={14} />,
  "UX Designer":           <Palette size={14} />,
  "Data Analyst":          <BarChart2 size={14} />,
  "AI Engineer":           <Brain size={14} />,
  "Data Scientist":        <Cpu size={14} />,
  "Data Engineer":         <Database size={14} />,
  "Android Developer":     <Smartphone size={14} />,
  "iOS Developer":         <Smartphone size={14} />,
  "ML Engineer":           <Zap size={14} />,
  "QA Engineer":           <TestTube2 size={14} />,
  "Cyber Security":        <Shield size={14} />,
  "Product Manager":       <Target size={14} />,
  "Blockchain Developer":  <Bitcoin size={14} />,
  "Game Developer":        <Gamepad2 size={14} />,
  "Technical Writer":      <FileText size={14} />,
};

const DIFF_COLOR: Record<string, string> = {
  Beginner:     "var(--accent-green)",
  Intermediate: "var(--accent-amber)",
  Advanced:     "var(--accent-red)",
};

// ─── Paper Row (editorial, no card) ──────────────────────────────────────────
function PaperRow({ paper, index }: { paper: ResearchPaper; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
    >
      {/* Row */}
      <div
        onClick={() => setExpanded(p => !p)}
        style={{
          display: "flex", gap: 18, padding: "18px 0",
          borderBottom: "1px solid var(--border)",
          cursor: "pointer",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.75"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
      >
        {/* Index */}
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)",
          fontWeight: 600, letterSpacing: "0.04em", minWidth: 24, paddingTop: 2, flexShrink: 0,
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: DIFF_COLOR[paper.difficulty],
              fontFamily: "var(--font-mono)",
            }}>
              {paper.difficulty}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {paper.year}
            </span>
          </div>

          <h3 style={{
            fontSize: 15, fontWeight: 700, color: "var(--text-primary)",
            lineHeight: 1.35, margin: "0 0 3px", fontFamily: "var(--font-body)",
          }}>
            {paper.title}
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 8px", fontStyle: "italic" }}>
            {paper.authors}
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.55, fontStyle: "italic" }}>
            "{paper.legacyTagline}"
          </p>
        </div>

        {/* Expand icon */}
        <ChevronDown
          size={15}
          color="var(--text-muted)"
          style={{ flexShrink: 0, marginTop: 4, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}
        />
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingLeft: 42, paddingTop: 16, paddingBottom: 20, display: "flex", flexDirection: "column", gap: 14 }}>

              <div style={{ paddingLeft: 14, borderLeft: "2px solid var(--border)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 5 }}>
                  What it introduced
                </div>
                <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                  {paper.whatItIntroduced}
                </p>
              </div>

              <div style={{ paddingLeft: 14, borderLeft: "2px solid var(--primary)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary)", fontFamily: "var(--font-mono)", marginBottom: 5 }}>
                  Career Impact
                </div>
                <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                  {paper.careerImpact}
                </p>
              </div>

              <div style={{ paddingLeft: 14, borderLeft: "2px solid var(--accent-amber)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-amber)", fontFamily: "var(--font-mono)", marginBottom: 5 }}>
                  Why you must read it
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                  {paper.whyYouMustRead}
                </p>
              </div>

              <a
                href={paper.url} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 600, color: "var(--primary)",
                  textDecoration: "none", width: "fit-content",
                  borderBottom: "1px solid var(--primary)",
                  paddingBottom: 1,
                }}
              >
                <ExternalLink size={11} /> Read the Paper
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Hall of Fame Row ─────────────────────────────────────────────────────────
const HOF_MEDALS = ["🥇", "🥈", "🥉", "🏅", "⭐"];

function HofRow({ paper, index }: { paper: ResearchPaper; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
    >
      <div
        onClick={() => setExpanded(p => !p)}
        style={{
          display: "flex", gap: 18, padding: "20px 0",
          borderBottom: "1px solid var(--border)",
          cursor: "pointer", transition: "opacity 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.75"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
      >
        {/* Medal */}
        <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.2, paddingTop: 2 }}>
          {HOF_MEDALS[index]}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--accent-amber)",
              fontFamily: "var(--font-mono)",
            }}>
              Hall of Fame
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {paper.year}
            </span>
          </div>
          <h3 style={{
            fontSize: 16, fontWeight: 700, color: "var(--text-primary)",
            lineHeight: 1.35, margin: "0 0 3px", fontFamily: "var(--font-display)",
          }}>
            {paper.title}
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 8px", fontStyle: "italic" }}>
            {paper.authors}
          </p>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: 0, lineHeight: 1.55, fontStyle: "italic" }}>
            "{paper.legacyTagline}"
          </p>
        </div>

        <ChevronDown
          size={15} color="var(--text-muted)"
          style={{ flexShrink: 0, marginTop: 4, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}
        />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingLeft: 40, paddingTop: 16, paddingBottom: 20, display: "flex", flexDirection: "column", gap: 14 }}>

              <div style={{ paddingLeft: 14, borderLeft: "2px solid var(--accent-amber)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-amber)", fontFamily: "var(--font-mono)", marginBottom: 5 }}>
                  Industry Legacy
                </div>
                <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                  {paper.hallOfFameLegacy}
                </p>
              </div>

              <div style={{ paddingLeft: 14, borderLeft: "2px solid var(--border)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 5 }}>
                  Core Contribution
                </div>
                <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                  {paper.whatItIntroduced}
                </p>
              </div>

              <a
                href={paper.url} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 600, color: "var(--accent-amber)",
                  textDecoration: "none", width: "fit-content",
                  borderBottom: "1px solid var(--accent-amber)",
                  paddingBottom: 1,
                }}
              >
                <ExternalLink size={11} /> Read the Paper
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResearchLensPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"tracks" | "halloffame">("tracks");
  const [activeTrack, setActiveTrack] = useState<ResearchTrack | null>(null);

  useEffect(() => {
    const p = storage.getProfile();
    const a = storage.getAnalysis();
    setProfile(p);
    setAnalysis(a);
    setActiveTrack(inferRecommendedTrack(p, a));
  }, []);

  const trackPapers = useMemo(() => {
    if (!activeTrack) return [];
    return RESEARCH_PAPERS.filter(p => p.track === activeTrack);
  }, [activeTrack]);

  const activeJourney = useMemo(() => {
    if (!activeTrack) return null;
    return CAREER_RESEARCH_JOURNEYS.find(j => j.track === activeTrack) ?? null;
  }, [activeTrack]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", fontFamily: "var(--font-body)" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px" }}>

        {/* ─── Page Header ─── */}
        <div style={{ paddingTop: 48, paddingBottom: 40 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 14 }}>
            Research Lens
          </div>
          <h1 style={{
            fontSize: "clamp(1.9rem, 4vw, 3rem)", fontWeight: 700,
            color: "var(--text-primary)", letterSpacing: "-0.04em",
            lineHeight: 1.1, margin: "0 0 14px", fontFamily: "var(--font-display)",
          }}>
            90 Legendary Papers.<br />
            <span style={{ color: "var(--primary)" }}>18 Career Paths.</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 520, margin: 0, lineHeight: 1.7 }}>
            The papers that built the industry — and how each one changes what you do at work, today.
          </p>

          {/* ─── Pedagogical Intro ─── */}
          <div style={{ 
            marginTop: 36, maxWidth: 760, padding: "22px 28px", 
            background: "var(--bg-surface)", borderLeft: "3px solid var(--primary)", 
            borderRadius: "0 var(--radius-md) var(--radius-md) 0",
            boxShadow: "var(--shadow-card)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Brain size={17} color="var(--primary)" />
              <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-mono)" }}>
                Professor's Note: Why read these?
              </h3>
            </div>
            <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 12px" }}>
              "When you use a modern framework, it feels like magic. But magic is just engineering we don't understand yet. The great trap of the modern developer is memorizing <em>syntax</em> without ever studying the <em>science</em>." 
            </p>
            <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
              Tutorials teach you how to build a boat. The papers in this lens teach you the physics of water. If you want to transition from a coder who blindly glues APIs together into an <strong>Architect</strong> who builds generational systems, you must read the original blueprints of our industry. Don't rush. Pick one paper, and read it deeply.
            </p>
          </div>

        </div>

        {/* ─── Tab Bar ─── */}
        <div style={{ display: "flex", gap: 0, marginBottom: 40, borderBottom: "1px solid var(--border)" }}>
          {(["tracks", "halloffame"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)",
                borderBottom: activeTab === tab ? "2px solid var(--text-primary)" : "2px solid transparent",
                marginBottom: -1,
                display: "flex", alignItems: "center", gap: 7,
                transition: "color 0.15s",
                fontFamily: "var(--font-body)",
              }}
            >
              {tab === "halloffame" ? <><Trophy size={13} /> Hall of Fame</> : <><BookOpen size={13} /> Career Tracks</>}
            </button>
          ))}
        </div>

        {/* ─── Tabs ─── */}
        <AnimatePresence mode="wait">

          {/* Career Tracks */}
          {activeTab === "tracks" && (
            <motion.div
              key="tracks"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 40, paddingBottom: 80 }}
            >
              {/* Sidebar — plain text list */}
              <div style={{ position: "sticky", top: 96, height: "fit-content" }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)", marginBottom: 16,
                }}>
                  18 Tracks
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {RESEARCH_TRACKS.map(track => {
                    const isActive = activeTrack === track;
                    return (
                      <button
                        key={track}
                        onClick={() => setActiveTrack(track)}
                        style={{
                          width: "100%",
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "8px 0",
                          border: "none", background: "transparent",
                          cursor: "pointer", textAlign: "left",
                          borderLeft: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                          paddingLeft: isActive ? 10 : 12,
                          transition: "all 0.15s",
                        }}
                      >
                        <span style={{ color: isActive ? "var(--primary)" : "var(--text-muted)", flexShrink: 0 }}>
                          {TRACK_ICONS[track]}
                        </span>
                        <span style={{
                          fontSize: 13, fontWeight: isActive ? 700 : 500,
                          color: isActive ? "var(--primary)" : "var(--text-secondary)",
                          lineHeight: 1.3, fontFamily: "var(--font-body)",
                        }}>
                          {track}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main content — no boxes */}
              <div>
                {activeTrack && activeJourney && (
                  <motion.div
                    key={activeTrack}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    {/* Track header */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
                      <h2 style={{
                        fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700,
                        color: "var(--text-primary)", letterSpacing: "-0.03em",
                        margin: 0, fontFamily: "var(--font-display)",
                      }}>
                        {activeTrack}
                      </h2>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                        {trackPapers.length} papers
                      </span>
                    </div>

                    {/* Why read */}
                    <div style={{ marginBottom: 32 }}>
                      <ul style={{ margin: "0 0 10px", padding: "0 0 0 0", listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                        {activeJourney.whyRead.map((r, i) => (
                          <li key={i} style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.65, paddingLeft: 14, borderLeft: "2px solid var(--border)" }}>
                            {r}
                          </li>
                        ))}
                      </ul>
                      <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
                        <span style={{ fontWeight: 700, color: "var(--text-secondary)" }}>Reading order — </span>
                        {activeJourney.readOrderReason}
                      </p>
                    </div>

                    {/* Paper list — editorial rows */}
                    <div>
                      {/* Column headers */}
                      <div style={{
                        display: "flex", gap: 18, padding: "0 0 12px",
                        borderBottom: "1px solid var(--border-bright)",
                        marginBottom: 0,
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)", minWidth: 24 }}>#</span>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Paper</span>
                      </div>
                      {trackPapers.map((paper, i) => (
                        <PaperRow key={paper.id} paper={paper} index={i} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Hall of Fame */}
          {activeTab === "halloffame" && (
            <motion.div
              key="hof"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ paddingBottom: 80, maxWidth: 720 }}
            >
              {/* HOF header — text only */}
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent-amber)", fontFamily: "var(--font-mono)", marginBottom: 14 }}>
                  Hall of Fame
                </div>
                <h2 style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 700,
                  color: "var(--text-primary)", letterSpacing: "-0.04em",
                  margin: "0 0 12px", fontFamily: "var(--font-display)",
                }}>
                  5 papers every engineer must know.
                </h2>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: 0, lineHeight: 1.7, maxWidth: 560 }}>
                  These papers defined the entire industry — regardless of your career track, they changed how software is built.
                </p>
              </div>

              {/* Column headers */}
              <div style={{ display: "flex", gap: 18, padding: "0 0 12px", borderBottom: "1px solid var(--border-bright)", marginBottom: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)", minWidth: 22 }}>—</span>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Paper</span>
              </div>

              {HALL_OF_FAME_PAPERS.map((paper, i) => (
                <HofRow key={paper.id} paper={paper} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
