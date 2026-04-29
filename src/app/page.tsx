"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Target, Map, BookOpen, Clock, Flame, Zap, Users,
  ArrowRight, Brain, BarChart2, Star, CheckCircle2, ExternalLink, Briefcase
} from "lucide-react";

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const dur = 1800;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: "fit-score",
    year: "2024",
    tag: "Core Intelligence",
    title: "AI Fit Score Analyzer",
    desc: "Drop your background. Get a precise percentage showing how ready you already are — broken down by skill overlap, portfolio strength, and market timing.",
    href: "/onboard",
    accent: "var(--primary)",
    wide: true,
    icon: <Target size={22} />,
    preview: (
      <div style={{ padding: "20px 0 0", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
          <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="40" cy="40" r="32" stroke="#e5e5e5" strokeWidth="6" fill="none"/>
            <circle cx="40" cy="40" r="32" stroke="var(--primary)" strokeWidth="6" fill="none"
              strokeDasharray="201" strokeDashoffset="50" strokeLinecap="round"/>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--primary)", fontFamily: "JetBrains Mono, monospace" }}>75%</span>
          </div>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Frontend Developer</p>
          <p style={{ fontSize: 12, color: "#888" }}>Est. 3 months to transition</p>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {["React", "CSS", "JS"].map(s => (
              <span key={s} style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "var(--primary)20", color: "var(--primary)", border: "1px solid var(--primary)30" }}>{s} ✓</span>
            ))}
            {["TypeScript", "Testing"].map(s => (
              <span key={s} style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "var(--bg-elevated)", color: "#888", border: "1px solid #ddd" }}>+ {s}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "roadmaps",
    year: "2024",
    tag: "Curriculum",
    title: "26 Career Roadmaps",
    desc: "From Frontend to Blockchain, each path has week-by-week milestones, curated resources, and a live progress tracker that moves as you learn.",
    href: "/roadmaps",
    accent: "#047857",
    wide: false,
    icon: <Map size={22} />,
    preview: null,
  },

  {
    id: "resources",
    year: "2024",
    tag: "Library",
    title: "Curated Resources",
    desc: "Hand-picked books, courses, videos, and practice platforms for every career. No filler — only the resources seniors actually use.",
    href: "/resources",
    accent: "#8d6e63",
    wide: false,
    icon: <BookOpen size={22} />,
    preview: null,
  },
  {
    id: "checkin",
    year: "2024",
    tag: "Daily Habit",
    title: "Daily Check-in",
    desc: "10 seconds a day. Answer one question, keep your streak alive, and watch your fit score climb every week.",
    href: "/checkin",
    accent: "var(--accent-amber)",
    wide: false,
    icon: <Flame size={22} />,
    preview: null,
  },
];

const TESTIMONIALS = [
  {
    quote: "I was shocked — I was already 74% ready to switch to UX. I thought I'd need years of prep. CareerLens showed me the 3 exact skills I was missing. I started applying after 4 months.",
    name: "Priya S.",
    role: "Marketing Manager",
    company: "→ UX Designer at Razorpay",
    rotate: "-2deg",
  },
  {
    quote: "Seeing '68% ready' with a 5-month roadmap was the push I needed. The roadmap page kept me accountable every single week. Now I'm a junior PM at a Series B startup.",
    name: "Rohan M.",
    role: "QA Engineer",
    company: "→ Product Manager",
    rotate: "1.5deg",
  },
  {
    quote: "Every other platform gave me generic 'learn Python' advice. CareerLens told me I was missing 4 specific skills. I learned them in 3 months. The specificity is what's different.",
    name: "Ananya K.",
    role: "School Teacher",
    company: "→ Data Analyst at Flipkart",
    rotate: "-1deg",
  },
];

const TOOLS = [
  { name: "AI Analysis", sub: "xAI Grok", icon: <Brain size={24} color="var(--primary)" />, color: "var(--primary)" },
  { name: "Roadmaps", sub: "26 Paths", icon: <Map size={24} color="#047857" />, color: "#047857" },
  { name: "Resources", sub: "100+ curated", icon: <BookOpen size={24} color="#b45309" />, color: "#b45309" },
  { name: "Dashboard", sub: "Progress hub", icon: <BarChart2 size={24} color="#8d6e63" />, color: "#8d6e63" },
  { name: "Streak Tracker", sub: "Daily habits", icon: <Flame size={24} color="#fb923c" />, color: "#fb923c" },
  { name: "Skill Gap", sub: "Gap analysis", icon: <Zap size={24} color="#4ade80" />, color: "#4ade80" },
];

// ─── Styles (ossai-inspired light theme) ─────────────────────────────────────
const S = {
  page: {
    background: "var(--bg-base)",
    minHeight: "100vh",
    fontFamily: "var(--font-body)",
    color: "var(--text-primary)",
    overflowX: "hidden" as const,
  },
  grid: {
    position: "fixed" as const,
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(78, 52, 46, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(78, 52, 46, 0.04) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    opacity: 0.45,
    pointerEvents: "none" as const,
    zIndex: 0,
  },
  vignette: {
    position: "fixed" as const,
    inset: 0,
    boxShadow: "inset 0 0 140px rgba(78, 52, 46, 0.04)",
    pointerEvents: "none" as const,
    zIndex: 1,
  },
  section: {
    position: "relative" as const,
    zIndex: 2,
    maxWidth: 1160,
    margin: "0 auto",
    padding: "0 clamp(16px, 4vw, 40px)",
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    overflow: "hidden" as const,
    border: "1px solid rgba(78, 52, 46, 0.08)",
    boxShadow: "0 8px 32px rgba(78, 52, 46, 0.03)",
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "#999",
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
  },
};

function AnimatedLens() {
  const word1 = "Career".split("");
  const word2 = "Lens".split("");

  return (
    <div style={{ marginBottom: 40, display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
      {/* Label pill */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(78,52,46,0.06)",
          border: "1px solid rgba(78,52,46,0.15)",
          borderRadius: 999,
          padding: "4px 12px 4px 8px",
          marginBottom: 14,
        }}
      >
        {/* Live pulse dot */}
        <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 8, height: 8 }}>
          <motion.span
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", width: 8, height: 8,
              borderRadius: "50%", backgroundColor: "var(--primary)", opacity: 0.3
            }}
          />
          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--primary)", display: "block" }} />
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "JetBrains Mono, monospace" }}>
          Career Intelligence
        </span>
      </motion.div>

      {/* Wordmark — staggered letters */}
      <div
        style={{
          display: "flex", alignItems: "baseline", gap: 0,
          fontFamily: "var(--font-display)",
          fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1,
          fontSize: "clamp(3.5rem, 6.5vw, 5.5rem)", // larger for serif to stand out
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* "Career" in dark */}
        <div style={{ display: "flex" }}>
          {word1.map((char, i) => (
            <motion.span
              key={`c-${i}`}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "block", color: "var(--text-primary)" }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* "Lens" in indigo */}
        <div style={{ display: "flex" }}>
          {word2.map((char, i) => (
            <motion.span
              key={`l-${i}`}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.37 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "block", color: "var(--primary)" }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Animated underline scan */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute", bottom: -4, left: 0, right: 0,
            height: 2,
            background: "linear-gradient(90deg, var(--primary) 0%, rgba(78,52,46,0.2) 100%)",
            transformOrigin: "left",
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}

// ─── Cloud Guide Widget ────────────────────────────────────────────────────────
function InteractiveCloudGuide() {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "The Operating Protocol",
      content: (
        <>
          <p style={{ marginBottom: 12 }}>Career transition is an engineering problem. You have a current state (your baseline skills) and a target state (market requirements).</p>
          <p>CareerLens is an integrated ecosystem designed to bridge that gap definitively. Everything connects. Execute the pipeline systematically.</p>
        </>
      ),
      author: "— The CareerLens Framework"
    },
    {
      title: "1. Assessment & Dashboard",
      content: (
        <>
          <p style={{ marginBottom: 12 }}>First, establish your baseline. Run the <strong>Assessment</strong>. Do not mask your weaknesses.</p>
          <p>The system anchors this data onto your <strong>Dashboard</strong>—a numerical representation of your exact gap-to-market. This is your ground truth.</p>
        </>
      )
    },
    {
      title: "2. Research Lens & Resume Analysis",
      content: (
        <>
          <p style={{ marginBottom: 12 }}>Strategic capability scaling requires sequential execution. First, invoke the <strong>Resume Analysis</strong> engine to deterministically isolate the semantic gaps between your current professional topology and algorithmic market thresholds.</p>
          <p>With vulnerabilities mapped, engage the <strong>Research Lens</strong>. By studying the seminal architectural papers of your discipline, you construct a rigorous theoretical framework—grasping the science—before proceeding to practical implementation.</p>
        </>
      )
    },
    {
      title: "3. Roadmaps & Resources",
      content: (
        <>
          <p style={{ marginBottom: 12 }}>Intensity without direction leads to burnout. Follow your customized <strong>Roadmap</strong> sequentially.</p>
          <p>Do not waste time searching for generic tutorials. Rely on the curated <strong>Resources</strong> provided for each specific milestone of your roadmap.</p>
        </>
      )
    },
    {
      title: "4. CareerBro & Check-in",
      content: (
        <>
          <p style={{ marginBottom: 12 }}>Knowledge acquisition requires friction. Use <strong>CareerBro</strong> as your study engine to stress-test your understanding and simulate technical interviews.</p>
          <p>Finally, anchor your progress with the <strong>Daily Check-in</strong>. Intelligence is a habit, not an event.</p>
        </>
      )
    }
  ];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Morphing Cloud Background */}
      <motion.div
        animate={{
          borderRadius: [
            "30% 70% 70% 30% / 30% 30% 70% 70%",
            "58% 42% 75% 25% / 76% 46% 54% 24%",
            "50% 50% 33% 67% / 55% 27% 73% 45%",
            "33% 67% 58% 42% / 63% 68% 32% 37%",
            "30% 70% 70% 30% / 30% 30% 70% 70%"
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: -10,
          background: "linear-gradient(135deg, rgba(78, 52, 46, 0.03) 0%, rgba(139, 92, 219, 0.04) 100%)",
          border: "1px solid rgba(78, 52, 46, 0.08)",
          boxShadow: "inset 0 0 40px rgba(255,255,255,0.6)",
          zIndex: 1,
          backdropFilter: "blur(4px)",
          minHeight: 320
        }}
      />
      
      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, padding: "40px", width: "100%", maxWidth: 360, margin: "0 auto", textAlign: "center" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16, letterSpacing: "-0.01em" }}>
              {slides[step].title}
            </h3>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {slides[step].content}
            </div>
            {slides[step].author && (
              <div style={{ marginTop: 20, fontSize: 13, fontWeight: 600, fontStyle: "italic", color: "var(--primary)" }}>
                {slides[step].author}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, marginTop: 32, alignItems: "center", justifyContent: "center" }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: step === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: step === i ? "var(--primary)" : "rgba(78, 52, 46, 0.15)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            />
          ))}
          <div style={{ width: 16 }} /> {/* simple spacer */}
          <button
            onClick={() => setStep(s => (s + 1) % slides.length)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            {step === slides.length - 1 ? "Restart" : "Next"} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  // Parallax configuration for liquid depth feel
  const { scrollY } = useScroll();
  const gridY = useTransform(scrollY, [0, 2000], [0, 300]); // grid falls slower
  const vignetteY = useTransform(scrollY, [0, 2000], [0, -150]); // vignette rises slightly
  const heroY = useTransform(scrollY, [0, 800], [0, 180]); // hero text falls gently out of view
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    // Hide loader after a perfect delay to be appreciated but not annoying
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={S.page}>
      {/* ═══════════════════ L O A D E R ═══════════════════ */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              background: "var(--text-primary)", // Changed to dark for a dramatic logo reveal
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Subtle grid on dark bg */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 2 }}
            >
              <span style={{ 
                fontSize: 16, 
                fontWeight: 800, 
                letterSpacing: "0.15em", 
                color: "#fff", 
                fontFamily: "var(--font-body)" 
              }}>
                Career<span style={{ color: "var(--primary)" }}>Lens</span>
              </span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 14, height: 14,
                  border: "2px solid rgba(255,255,255,0.1)",
                  borderTopColor: "var(--primary)",
                  borderRadius: "50%",
                  marginTop: 2
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed grid bg with Parallax */}
      <motion.div style={{ ...S.grid, y: gridY }} />
      {/* Blue-purple vignette with Parallax */}
      <motion.div style={{ ...S.vignette, y: vignetteY }} />

      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <motion.section 
        style={{
          position: "relative", zIndex: 2, maxWidth: 1160, margin: "0 auto",
          padding: "clamp(24px, 5vw, 48px) clamp(16px, 4vw, 40px) clamp(40px, 6vw, 80px)",
          y: heroY, opacity: heroOpacity,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "center" }}>
          
          {/* LEFT: Main Hero Text (shrinked font) */}
          <div style={{ flex: "1 1 520px" }}>
            {/* Animated Custom UI Lens Component */}
            <AnimatedLens />

            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 3.8vw, 3.2rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                maxWidth: 860,
                marginBottom: 20,
                color: "var(--text-primary)",
              }}
            >
              <span style={{ color: "var(--text-primary)" }}>The fastest path</span>{" "}
              <span style={{ color: "var(--text-muted)" }}>to your next career isn't a job board.</span>{" "}
              <span style={{ color: "var(--primary)" }}>It's knowing your fit.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25, type: "spring", bounce: 0.3 }}
              style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 32, fontStyle: "italic" }}
            >
              Some people call us the Career GPS.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.35, type: "spring", damping: 20, stiffness: 100 }}
              style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 36, flexWrap: "wrap" }}
            >
              <Magnetic>
                <Link href="/onboard" className="btn-saas" style={{ padding: "16px 32px", fontSize: 15 }}>
                  Get My Fit Score <ArrowRight size={16} />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/dashboard" style={{
                  background: "transparent", color: "var(--text-secondary)", padding: "16px 32px",
                  borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: "none",
                  border: "1px solid var(--border-bright)",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  transition: "border-color 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--text-secondary)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-bright)")}
                >
                  View Dashboard
                </Link>
              </Magnetic>
            </motion.div>

            {/* Quick-links row — hidden on mobile (links are in hamburger menu) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="hero-quicklinks"
              style={{ display: "flex", gap: 24, alignItems: "center" }}
            >
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Roadmaps", href: "/roadmaps" },
                { label: "Resources", href: "/resources" },
                { label: "Check-in", href: "/checkin" },
              ].map((l, i) => (
                <Link key={l.label} href={l.href} style={{
                  fontSize: 13, color: "#aaa", textDecoration: "none",
                  fontWeight: 500, letterSpacing: "0.01em",
                  transition: "color 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
                >{l.label}</Link>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Cloud Widget Guide */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ flex: "1 1 380px", position: "relative", minHeight: 340 }}
          >
             <InteractiveCloudGuide />
          </motion.div>

        </div>
      </motion.section>

      {/* ═══════════════════ 2. STATS TICKER ═══════════════════ */}
      <section style={{ ...S.section, marginBottom: 0, paddingBottom: 60 }}>
        <div style={{ display: "flex", gap: 48, borderTop: "1px solid var(--border-bright)", paddingTop: 48, flexWrap: "wrap" }}>
          {/* Staggered container for premium smooth entry */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            style={{ display: "flex", gap: "clamp(40px, 8vw, 80px)", width: "100%", flexWrap: "wrap" }}
          >
            {[
              { val: 12000, suffix: "+", label: "Fit scores generated" },
              { val: 78, suffix: "%", label: "Avg. fit score on first try" },
              { val: 4, suffix: " mo", label: "Avg. months to switch career" },
              { val: 26, suffix: "", label: "Career paths with full roadmaps" },
            ].map((s, i) => (
              <motion.div 
                key={s.label}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 120 } }
                }}
              >
                <div style={{ fontSize: "clamp(3rem, 5vw, 4.2rem)", fontWeight: 400, color: "var(--primary)", letterSpacing: "-0.01em", lineHeight: 1.1, fontFamily: "var(--font-display)" }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 12, fontWeight: 500 }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 3. FEATURES GRID (ossai "Craft") ═══════════════════ */}
      <section style={{ ...S.section, paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ marginBottom: 40 }}>
          <p style={S.label}>Selected Features</p>
          <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", marginTop: 8 }}>
            Tools built with precision.
          </h2>
          <p style={{ color: "#888", fontSize: 15, marginTop: 8 }}>Every feature exists to close one gap between you and your next role.</p>
        </div>

        {/* Staggered grid — ossai style */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: 20 }}>

          {/* Wide card — Fit Score */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ ...S.card, gridColumn: "span 2", padding: "40px 44px", display: "flex", justifyContent: "space-between", gap: 40, alignItems: "flex-start", flexWrap: "wrap" as const }}
          >
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ ...S.label, color: "var(--primary)" }}>Core Intelligence</div>
                <span style={{ ...S.label }}>2024</span>
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 12 }}>AI Fit Score Analyzer</h3>
              <p style={{ color: "#777", fontSize: 15, lineHeight: 1.7, maxWidth: 420, marginBottom: 20 }}>
                Drop your background. Get a precise percentage showing how ready you already are — broken down by skill overlap, portfolio strength, and market timing.
              </p>
              <Link href="/onboard" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}>
                Try it free <ArrowRight size={14} />
              </Link>
            </div>
            {/* Preview widget */}
            <div style={{ background: "rgba(78, 52, 46, 0.03)", borderRadius: 16, border: "1px solid rgba(78, 52, 46, 0.08)", padding: "24px 28px", minWidth: 280, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                  <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="36" cy="36" r="28" stroke="rgba(78, 52, 46, 0.08)" strokeWidth="6" fill="none"/>
                    <circle cx="36" cy="36" r="28" stroke="var(--primary)" strokeWidth="6" fill="none"
                      strokeDasharray="176" strokeDashoffset="44" strokeLinecap="round"/>
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "var(--primary)", fontFamily: "monospace" }}>75%</span>
                  </div>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 15 }}>Frontend Developer</p>
                  <p style={{ color: "#999", fontSize: 12, marginTop: 2 }}>~3 months to transition</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                {["React ✓", "CSS ✓", "JS ✓"].map(s => (
                  <span key={s} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "var(--primary)15", color: "var(--primary)", border: "1px solid var(--primary)25" }}>{s}</span>
                ))}
                {["+ TypeScript", "+ Testing"].map(s => (
                  <span key={s} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "var(--bg-elevated)", color: "#999", border: "1px solid #e5e5e5" }}>{s}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Grid of 4 feature cards */}
          {[
            { tag: "Curriculum", year: "2024", title: "26 Career Roadmaps", desc: "Week-by-week structured paths from beginner to job-ready, with live milestone tracking.", href: "/roadmaps", accent: "#047857" },

            { tag: "Library", year: "2024", title: "Resources Library", desc: "100+ hand-picked books, courses, and videos for every career path.", href: "/resources", accent: "#8d6e63" },
            { tag: "Daily Habit", year: "2024", title: "Daily Check-in", desc: "10 seconds a day. One question, one answer — your fit score moves every time.", href: "/checkin", accent: "var(--accent-amber)" },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link href={card.href} style={{ ...S.card, display: "block", padding: "32px", textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(78, 52, 46, 0.05)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                  <span style={{ ...S.label, color: card.accent }}>{card.tag}</span>
                  <span style={S.label}>{card.year}</span>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: card.accent + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  {card.tag === "Curriculum" ? <Map size={20} color={card.accent} /> : card.tag === "Daily Habit" ? <Flame size={20} color={card.accent} /> : card.tag === "Library" ? <BookOpen size={20} color={card.accent} /> : <Zap size={20} color={card.accent} />}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 10 }}>{card.title}</h3>
                <p style={{ color: "#888", fontSize: 14, lineHeight: 1.65 }}>{card.desc}</p>
                <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: card.accent }}>
                  Explore <ArrowRight size={13} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ 4. HOW IT WORKS ("Some var(--font-body)actions") ═══════════════════ */}
      <section style={{ ...S.section, paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ marginBottom: 40 }}>
          <p style={S.label}>How It Works</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", marginTop: 8 }}>
            Three steps. One number that changes everything.
          </h2>
          <p style={{ color: "#888", fontSize: 14, marginTop: 6 }}>Built with clarity, driven by data.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { step: "01", title: "Tell us who you are", detail: "3 focused questions. Under 2 minutes. Your background, what feels stuck, and what your dream role looks like.", color: "var(--primary)", icon: <Users size={28} color="var(--primary)" /> },
            { step: "02", title: "Get your Fit Score", detail: "Our AI extracts every skill you already have — including ones you didn't know counted — and matches you to careers with precision.", color: "#047857", icon: <Target size={28} color="#047857" /> },
            { step: "03", title: "Follow your roadmap", detail: "A personalised week-by-week plan with real resources, real milestones, and a score that moves as you learn.", color: "#b45309", icon: <Map size={28} color="#b45309" /> },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              style={{ ...S.card, padding: "32px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>{s.icon}</div>
                <span style={{ fontSize: 48, fontWeight: 800, color: "var(--bg-base)", fontFamily: "monospace", lineHeight: 1 }}>{s.step}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10, letterSpacing: "-0.02em" }}>{s.title}</h3>
              <p style={{ color: "#888", fontSize: 14, lineHeight: 1.7 }}>{s.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* "Want to see more?" CTA card at bottom right — ossai style */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            marginTop: 20,
            ...S.card,
            padding: "28px 36px",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e8e0d5' fill-opacity='0.8'%3E%3Cpath d='M0 0h1v40H0zm40 0h1v40H0zm0 0v1H0V0zm0 40v1H0v-1z'/%3E%3C/g%3E%3C/svg%3E\")",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 16,
          }}
        >
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Want to start your analysis?</p>
            <p style={{ fontSize: 13, color: "#999", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>FREE · 2 MINUTES · NO SIGNUP</p>
          </div>
          <Link href="/onboard" className="btn-saas" style={{ padding: "14px 28px", fontSize: 13, flexShrink: 0 }}>
            GET STARTED <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>

      {/* ═══════════════════ 5. TESTIMONIALS (tilted cards) ═══════════════════ */}
      <section style={{
        position: "relative", zIndex: 2,
        background: "var(--bg-base)",
        backgroundImage: "linear-gradient(rgba(78, 52, 46, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(78, 52, 46, 0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        padding: "80px 40px",
        marginBottom: 0,
      }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <p style={{ ...S.label, marginBottom: 8 }}>FROM THE USERS</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: 48 }}>
            Real transitions. Real numbers.
          </h2>

          {/* Editorial minimalist testimonial cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, alignItems: "start" }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                style={{
                  background: "transparent",
                  borderLeft: "2px solid rgba(78, 52, 46, 0.1)",
                  padding: "12px 24px 20px",
                }}
              >
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="var(--primary)" color="var(--primary)" />)}
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: 20, fontStyle: "italic", letterSpacing: "-0.01em" }}>
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(78, 52, 46, 0.05)", border: "1px solid rgba(78, 52, 46, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, fontWeight: 700, color: "var(--primary)" }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-primary)" }}>{t.name}</p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{t.role} · <span style={{ color: "var(--primary)", fontWeight: 500 }}>{t.company}</span></p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 6. INTELLIGENCE STACK ("Jutsu Arsenal") ═══════════════════ */}
      <section style={{ ...S.section, paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ ...S.label, fontFamily: "serif", fontSize: 13, color: "#bbb", marginBottom: 6 }}>私たちの聖なる道具</p>
          <p style={{ ...S.label, marginBottom: 8 }}>The Intelligence Stack</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            Everything we built to get you hired.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {TOOLS.map((tool, i) => {
            const isWide = i === 0 || i === 5;
            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className={isWide ? "md:col-span-2" : "col-span-1"}
                style={{
                  ...S.card,
                  padding: isWide ? "36px 40px" : "24px 28px",
                  display: "flex",
                  flexDirection: isWide ? "row" : "column",
                  alignItems: isWide ? "center" : "flex-start",
                  justifyContent: "space-between",
                  gap: 20,
                  cursor: "default",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(78, 52, 46, 0.05)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = S.card.boxShadow as string;
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                    <div style={{ color: "var(--text-primary)" }}>{tool.icon}</div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{tool.name}</h3>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {tool.sub}
                  </p>
                </div>
                {/* Visual filler for wide cards */}
                {isWide && (
                  <div style={{ alignSelf: "stretch", width: 100, borderLeft: "2px dashed rgba(78, 52, 46, 0.08)", background: "linear-gradient(90deg, rgba(78, 52, 46, 0.02), transparent)", borderRadius: "0 12px 12px 0" }} />
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════ 7. FOOTER CTA (ossai large card style) ═══════════════════ */}
      <section style={{ ...S.section, paddingBottom: 80 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            ...S.card,
            padding: "64px 48px",
            textAlign: "center",
            background: "var(--text-primary)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle grid overlay on dark card */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ ...S.label, color: "#555", marginBottom: 16 }}>REACH OUT AND FIND YOUR PATH</p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", marginBottom: 16 }}>
              Find out how close<br />you already are.
            </h2>
            <p style={{ fontSize: 16, color: "#777", marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
              2 minutes. No signup required. Your fit score, your roadmap, your fastest path — free.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const }}>
              <Magnetic>
                <Link href="/onboard" style={{
                  padding: "16px 32px", fontSize: 16, fontWeight: 700,
                  background: "#fff", color: "#111", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  borderRadius: "var(--radius-sm)", border: "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.2), inset 0 -2px 0 rgba(0,0,0,0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,255,255,0.15), inset 0 -2px 0 rgba(0,0,0,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.2), inset 0 -2px 0 rgba(0,0,0,0.1)";
                }}
                >
                  Get My Fit Score — Free <ArrowRight size={16} />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/dashboard" style={{
                  background: "transparent", color: "#555", padding: "16px 28px",
                  borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: "none",
                  border: "1.5px solid #333",
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}>
                  View Dashboard
                </Link>
              </Magnetic>
            </div>
          </div>
        </motion.div>

        {/* Footer bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 32, flexWrap: "wrap" as const, gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Target size={20} color="var(--text-primary)" strokeWidth={2.5} />
            <span style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: 15, letterSpacing: "-0.03em" }}>CareerLens.</span>
          </div>
          <p style={{ fontSize: 13, color: "#aaa" }}>Find the fastest path from who you are to who you want to become.</p>
          <div style={{ display: "flex", gap: 20 }}>
            {["/roadmaps", "/resources", "/dashboard"].map(h => (
              <Link key={h} href={h} style={{ fontSize: 13, color: "#aaa", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
              >{h.replace("/", "").charAt(0).toUpperCase() + h.replace("/", "").slice(1)}</Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
