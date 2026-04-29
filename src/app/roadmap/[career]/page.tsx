"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { storage, type RoadmapWeek } from "@/lib/utils/storage";
import { getScoreColor } from "@/lib/utils/utils";
import { resolveRoadmapFetchContext, type RoadmapApiContext } from "@/lib/services/dashboardMetrics";

import { Sun, Library, Play, GraduationCap, FileText, Settings, Target, ArrowRight, ArrowUpRight } from "lucide-react";

export function getResourceIcon(type: string, size: number = 18, color: string = "currentColor") {
  switch (type.toLowerCase()) {
    case "video": return <Play size={size} color={color} />;
    case "course": return <GraduationCap size={size} color={color} />;
    case "article": return <FileText size={size} color={color} />;
    case "project": return <Settings size={size} color={color} />;
    default: return <FileText size={size} color={color} />;
  }
}

const MOOD_COLORS: Record<string, string> = {
  energized: "var(--accent-green)",
  focused: "var(--primary)",
  draining: "var(--accent-red)",
  mixed: "var(--accent-amber)",
};

function WeekCard({
  week, completed, onToggle, index
}: { week: RoadmapWeek; completed: boolean; onToggle: () => void; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      style={{
        display: "flex", gap: 16,
        opacity: completed ? 0.6 : 1,
        transition: "opacity 0.3s",
      }}
    >
      {/* Timeline line & dot */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <button
          onClick={onToggle}
          title={completed ? "Mark incomplete" : "Mark complete"}
          style={{
            width: 32, height: 32, borderRadius: "50%",
            border: completed ? "2px solid var(--accent-green)" : "2px solid var(--border-bright)",
            background: completed ? "var(--accent-green-soft)" : "var(--bg-elevated)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s",
            color: completed ? "var(--accent-green)" : "var(--text-muted)",
            fontSize: 14,
          }}
        >
          {completed ? "✓" : <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{week.week}</span>}
        </button>
        {index < 11 && (
          <div style={{
            width: 2, flex: 1, minHeight: 24,
            background: completed ? "var(--accent-green)" : "var(--border)",
            margin: "4px 0",
            transition: "background 0.3s",
          }} />
        )}
      </div>

      {/* Card */}
      <div style={{
        flex: 1,
        background: "var(--bg-surface)",
        border: `1px solid ${completed ? "rgba(34,197,94,0.2)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        marginBottom: 12,
        overflow: "hidden",
        transition: "all 0.2s",
      }}>
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: "100%", padding: "18px 20px",
            display: "flex", alignItems: "center", gap: 12,
            background: "transparent", cursor: "pointer", textAlign: "left",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)",
              letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4,
            }}>
              Week {week.week}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
              {week.title}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {week.skills.slice(0, 2).map((s) => (
              <span key={s} className="badge badge-primary" style={{ fontSize: 11, display: "none" }}>{s}</span>
            ))}
            <span style={{ color: "var(--text-muted)", fontSize: 14, transition: "transform 0.2s", transform: expanded ? "rotate(90deg)" : "none" }}>›</span>
          </div>
        </button>

        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ padding: "0 20px 20px", borderTop: "1px solid var(--border)" }}
          >
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: "16px 0" }}>
              {week.description}
            </p>

            {/* Skills */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Skills you&apos;ll build
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {week.skills.map((s) => (
                  <span key={s} className="skill-tag matched" style={{ fontSize: 12 }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>
                Resources
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {week.resources.map((r) => (
                  <a
                    key={r.title}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 0",
                      borderBottom: "1px solid var(--border-bright)",
                      background: "transparent",
                      textDecoration: "none",
                      transition: "opacity 0.2s",
                      color: "var(--text-primary)",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    <span style={{ flexShrink: 0, color: "var(--text-muted)" }}>{getResourceIcon(r.type, 16)}</span>
                    <span style={{ fontSize: 14, flex: 1, fontWeight: 500 }}>{r.title}</span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>{r.type}</span>
                    <ArrowUpRight size={14} color="var(--text-muted)" />
                  </a>
                ))}
              </div>
            </div>

            {/* Milestone */}
            <div style={{
              paddingTop: 16,
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <span style={{ color: "var(--primary)", marginTop: 2 }}><Target size={18} /></span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-mono)", marginBottom: 6 }}>Milestone</div>
                <div style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.5 }}>{week.milestone}</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function RoadmapPage({ params }: { params: Promise<{ career: string }> }) {
  const { career: careerSlug } = use(params);
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);
  const [careerName, setCareerName] = useState("");
  const [roadmapCtx, setRoadmapCtx] = useState<RoadmapApiContext | null>(null);

  useEffect(() => {
    const a = storage.getAnalysis();
    if (!a) {
      router.push("/onboard");
      return;
    }

    const resolved = resolveRoadmapFetchContext(a, careerSlug);
    if (!resolved.ok) {
      router.replace(resolved.redirectTo);
      return;
    }

    setRoadmapCtx(resolved.data);
    setCareerName(resolved.data.careerName);

    const cached = storage.getRoadmap(careerSlug);
    const saved = storage.getCompletedWeeks(careerSlug);
    setCompletedWeeks(saved);

    if (cached) {
      setRoadmap(cached);
      setLoading(false);
      return;
    }

    const { careerName: career, missingSkills, currentSkills } = resolved.data;
    fetch("/api/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        career,
        missingSkills,
        currentSkills,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        const weeks = data.weeks || [];
        setRoadmap(weeks);
        storage.setRoadmap(careerSlug, weeks);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [careerSlug, router]);

  function toggleWeek(weekNum: number) {
    setCompletedWeeks((prev) => {
      const next = prev.includes(weekNum)
        ? prev.filter((w) => w !== weekNum)
        : [...prev, weekNum];
      storage.setCompletedWeeks(careerSlug, next);
      return next;
    });
  }

  const progress = roadmap.length > 0 ? (completedWeeks.length / roadmap.length) * 100 : 0;
  const baseFit = roadmapCtx?.fitScore ?? 0;
  const newScore = roadmapCtx ? Math.min(100, baseFit + Math.round(progress * 0.22)) : 0;
  const scoreColor = getScoreColor(newScore);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
        background: "rgba(7,7,15,0.85)",
      }}>
        <Link href="/results" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", fontSize: 14 }}>
          ← Back to results
        </Link>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "linear-gradient(135deg, var(--primary), var(--accent-violet))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontFamily: "var(--font-mono)", fontWeight: 700, color: "#fff",
          }}>C</div>
        </Link>
      </nav>

      <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 40 }}
        >
          <span className="badge badge-primary" style={{ marginBottom: 16 }}>Your learning roadmap</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: 12 }}>
            {careerName || "Your career"} — 12 weeks to ready
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 600 }}>
            Check off each week as you complete it. Your fit score updates in real time.
          </p>
        </motion.div>

        {/* Progress dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {[
            {
              label: "Current fit score",
              value: <span style={{ fontFamily: "var(--font-mono)", color: scoreColor }}>{newScore}%</span>,
              sub: `Started at ${baseFit}%`,
            },
            {
              label: "Weeks completed",
              value: <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-amber)" }}>{completedWeeks.length}/{roadmap.length}</span>,
              sub: "Mark weeks done as you go",
            },
            {
              label: "Roadmap progress",
              value: <span style={{ fontFamily: "var(--font-mono)", color: "var(--primary)" }}>{Math.round(progress)}%</span>,
              sub: `${roadmap.length - completedWeeks.length} weeks remaining`,
            },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "20px 24px",
            }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8, fontWeight: 500 }}>{stat.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{stat.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Overall progress bar */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Overall progress</span>
            <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center",
              padding: "60px 0",
              gap: 24,
              position: "relative"
            }}
          >
            {/* Glowing orb background */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), var(--accent-violet))",
                filter: "blur(12px)",
                position: "absolute",
                top: 55
              }}
            />
            {/* Core spinner */}
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--bg-elevated)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
              boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 0 20px rgba(139, 92, 246, 0.2)",
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ color: "var(--primary)", display: "flex" }}
              >
                <Settings size={28} />
              </motion.div>
            </div>
            
            {/* Text loading status */}
            <div style={{ textAlign: "center", zIndex: 1, marginTop: 8 }}>
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ 
                  margin: 0, 
                  fontSize: 18, 
                  fontWeight: 600, 
                  fontFamily: "var(--font-display)", 
                  background: "linear-gradient(to right, #fff, var(--text-secondary))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                AI is generating your roadmap
              </motion.div>
              <p style={{ margin: "8px 0 0", color: "var(--text-muted)", fontSize: 13, fontFamily: "var(--font-mono)" }}>
                Synthesizing skills & curriculum...
              </p>
            </div>
          </motion.div>
        )}

        {/* Timeline */}
        {!loading && (
          <div>
            {roadmap.map((week, i) => (
              <WeekCard
                key={week.week}
                week={week}
                index={i}
                completed={completedWeeks.includes(week.week)}
                onToggle={() => toggleWeek(week.week)}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}
          >
            <Link href={`/life/${careerSlug}`} className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 8 }}><Sun size={16} /> Day in the life</Link>
            <Link href="/resources" className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 8 }}><Library size={16} /> Browse resources</Link>
            <Link href="/checkin" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>Start daily check-in <ArrowRight size={16} /></Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
