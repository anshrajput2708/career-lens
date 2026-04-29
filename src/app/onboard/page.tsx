"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { storage, type UserProfile } from "@/lib/utils/storage";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Target, ArrowUpRight, Shuffle, AlertCircle
} from "lucide-react";

// ─── Constants & Options ────────────────────────────────────────────────────────

const TRANSITION_DIMENSIONS = [
  {
    key: "t_background",
    title: "1. Current Background",
    desc: "Select all that honestly apply:",
    multi: true,
    options: [
      { id: "A", label: "Non-tech field (finance, marketing, ops, HR, teaching)" },
      { id: "B", label: "Semi-tech (Excel power user, analyst, basic scripting)" },
      { id: "C", label: "CS graduate but working in non-tech role" },
      { id: "D", label: "Self-taught coder — built projects but no formal background" },
      { id: "E", label: "Tech-adjacent (design, content, support, QA)" },
      { id: "F", label: "Currently in college — planning career switch" },
    ]
  },
  {
    key: "t_built",
    title: "2. What You Have Actually Built",
    desc: "Select all that honestly apply:",
    multi: true,
    options: [
      { id: "A", label: "Built a working website or app (even small)" },
      { id: "B", label: "Written scripts to automate something in my life/work" },
      { id: "C", label: "Analyzed a dataset and found something interesting" },
      { id: "D", label: "Designed UI/UX mockups or prototypes" },
      { id: "E", label: "Set up a server, cloud instance, or network" },
      { id: "F", label: "Participated in a CTF or found a security bug" },
      { id: "G", label: "Trained or fine-tuned an ML model" },
      { id: "H", label: "Built or programmed hardware (Arduino, Raspberry Pi etc)" },
      { id: "I", label: "None yet — I am at zero but committed to start" },
    ]
  },
  {
    key: "t_coding",
    title: "3. Honest Coding Level",
    desc: "Where are you right now?",
    multi: false,
    options: [
      { id: "A", label: "Can read code but can't write it independently" },
      { id: "B", label: "Can write basic scripts (Python/JS) with help from docs" },
      { id: "C", label: "Can build small projects independently end-to-end" },
      { id: "D", label: "Can work on production codebases — know DSA + system design" },
      { id: "E", label: "Strong engineer — multiple projects, contributions, or jobs" },
      { id: "F", label: "I don't want coding to be my primary skill" },
    ]
  },
  {
    key: "t_drains",
    title: "4. What drains vs energizes you?",
    desc: "When you spend 4 hours on a task and feel energized after, that task is:",
    multi: false,
    options: [
      { id: "A", label: "Debugging a broken system until it works" },
      { id: "B", label: "Designing how something looks and flows for a user" },
      { id: "C", label: "Finding patterns in messy data to reach a conclusion" },
      { id: "D", label: "Figuring out how to break or exploit a system" },
      { id: "E", label: "Building something from scratch — code, hardware, or tool" },
      { id: "F", label: "Explaining a complex concept simply to someone else" },
      { id: "G", label: "Optimizing a system to run faster / cost less" },
      { id: "H", label: "Researching an unsolved problem deeply" },
    ]
  },
  {
    key: "t_goodWork",
    title: "5. What \"Good Work\" Feels Like",
    desc: "Which outcome satisfies you most?",
    multi: false,
    options: [
      { id: "A", label: "Shipping a feature that 10,000 users interact with" },
      { id: "B", label: "A model that achieves 2% better accuracy after 3 days of work" },
      { id: "C", label: "A system that handles 10x traffic without breaking" },
      { id: "D", label: "A design that reduces user confusion by half" },
      { id: "E", label: "Finding a vulnerability before a hacker does" },
      { id: "F", label: "A dashboard that makes a business decision obvious" },
      { id: "G", label: "Code so clean another engineer compliments it" },
      { id: "H", label: "Teaching someone a concept and watching it click" },
    ]
  },
  {
    key: "t_constraints",
    title: "6. Transition Constraints",
    desc: "What is your timeline?",
    multi: false,
    options: [
      { id: "A", label: "I need a job in under 6 months — financial pressure" },
      { id: "B", label: "I have 1 year to make this transition happen" },
      { id: "C", label: "I have 2+ years — I can go deep and build strong foundations" },
      { id: "D", label: "I'm a student — I have time but want to be strategic from now" },
      { id: "E", label: "I want to freelance first — test before committing fully" },
    ]
  }
];

const UPSKILL_DIMENSIONS = [
  {
    key: "u_role",
    title: "1. Current Role & Level",
    desc: "What is your main title?",
    multi: false,
    options: [
      { id: "A", label: "Junior Developer / Fresher (0-1 year)" },
      { id: "B", label: "Mid-level Developer (1-3 years)" },
      { id: "C", label: "Senior Developer (3-6 years)" },
      { id: "D", label: "Tech Lead / Staff Engineer (6+ years)" },
      { id: "E", label: "Data Analyst / Scientist (any level)" },
      { id: "F", label: "DevOps / Cloud / SRE (any level)" },
      { id: "G", label: "Other tech role" },
    ]
  },
  {
    key: "u_stack",
    title: "2. Current Core Stack",
    desc: "Select all that apply:",
    multi: true,
    options: [
      { id: "A", label: "Python" }, { id: "B", label: "JavaScript / TypeScript" },
      { id: "C", label: "Java / C# / C++" },  { id: "D", label: "Go / Rust" },
      { id: "E", label: "SQL / data tools" }, 
      { id: "F", label: "React / Frontend" }, 
      { id: "G", label: "Cloud Platforms (AWS/GCP/Azure)" },
      { id: "H", label: "I don't have a strong stack yet" }
    ]
  },
  {
    key: "u_goal",
    title: "3. Where You Want To Be In 12 Months",
    desc: "Pick your primary goal:",
    multi: false,
    options: [
      { id: "A", label: "Promoted to Senior Engineer / Lead role at current company" },
      { id: "B", label: "Crack a FAANG / top product company interview" },
      { id: "C", label: "Move into system design & architecture roles" },
      { id: "D", label: "Become a strong full-stack engineer from frontend/backend only" },
      { id: "E", label: "Level up enough to start my own tech product" },
    ]
  },
  {
    key: "u_weakness",
    title: "4. Biggest Current Weakness",
    desc: "Be honest. Select ONE:",
    multi: false,
    options: [
      { id: "A", label: "DSA & Problem Solving — I struggle with coding interviews" },
      { id: "B", label: "System Design — I can't think at scale yet" },
      { id: "C", label: "Code Quality — I write working code but not clean/maintainable code" },
      { id: "D", label: "Building complete projects — I learn but don't ship" },
    ]
  },
  {
    key: "u_bandwidth",
    title: "5. Learning Bandwidth",
    desc: "How much time can you actually commit?",
    multi: false,
    options: [
      { id: "A", label: "30 mins/day — very busy, need high-efficiency plan" },
      { id: "B", label: "1 hour/day — consistent but limited" },
      { id: "C", label: "2-3 hours/day — serious commitment" },
    ]
  }
];

const API_TIMEOUT_MS = 60_000;

// ── Helpers ──────────────────────────────────────────────────────────────────
const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -56 : 56, opacity: 0 }),
};

// ── UI Components ────────────────────────────────────────────────────────────
function OptionCard({
  label, selected, onClick, multi
}: {
  label: string; selected: boolean; onClick: () => void; multi?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px", width: "100%",
        borderRadius: 0,
        border: selected ? "1.5px solid var(--primary)" : "1.5px solid var(--border)",
        background: selected ? "var(--bg-elevated)" : "var(--bg-surface)",
        color: "var(--text-primary)",
        fontSize: 14, fontWeight: selected ? 600 : 500,
        cursor: "pointer", transition: "all 0.15s",
        fontFamily: "var(--font-body), sans-serif", textAlign: "left",
        boxShadow: selected ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: multi ? 2 : "50%",
        border: selected ? "2px solid var(--primary)" : "2px solid var(--border-bright)",
        background: selected ? "var(--primary)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        {selected && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--bg-base)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </div>
      {label}
    </button>
  );
}

// ── Application ──────────────────────────────────────────────────────────────
export default function OnboardPage() {
  const router = useRouter();

  const [intent, setIntent] = useState<"transition" | "upskill" | "">("");
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Sandbox Modal State
  const [pendingResult, setPendingResult] = useState<any | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    intent: "",
    t_drains: "", t_principles: "", t_math: "", t_abstraction: "", t_background: "", t_built: "", t_coding: "", t_constraints: "", t_goodWork: "", t_identity: "", t_salaryMeaning: "", t_motivation: "",
    u_role: "", u_stack: [], u_goal: "", u_weakness: "", u_bandwidth: "", u_learning: "", u_blockers: "", u_success: ""
  });

  const activeDimensions = intent === "transition" ? TRANSITION_DIMENSIONS : UPSKILL_DIMENSIONS;
  const totalSteps = activeDimensions.length;

  const chooseIntent = (sel: "transition" | "upskill") => {
    setIntent(sel);
    setProfile(p => ({ ...p, intent: sel }));
    setStep(1);
    setDir(1);
  };

  const nextStep = () => {
    const key = activeDimensions[step - 1].key as keyof UserProfile;
    const val = profile[key];
    if (!val || (Array.isArray(val) && val.length === 0)) {
      setError("Please select an option to continue.");
      return;
    }
    setError(null);
    if (step < totalSteps) {
      setDir(1);
      setStep(s => s + 1);
    } else {
      submitAnalysis();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDir(-1);
      setStep(s => s - 1);
      setError(null);
    } else {
      setIntent(""); // go back to gateway
    }
  };

  // Handle Enter key for quick navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && intent) {
        e.preventDefault();
        nextStep();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [intent, step, profile, totalSteps, nextStep]);

  async function submitAnalysis() {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      storage.setProfile(profile);

      // Start the animated loader sequence
      const loadInterval = setInterval(() => {
        setLoadStep((s) => (s + 1) % 5);
      }, 2500);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
        signal: controller.signal,
      });

      clearInterval(loadInterval);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      if (!data.result) throw new Error("No analysis result received");
      
      const existingRawData = storage.getAnalysis();
      // Only trigger conflict resolution if the user has an ACTIVE dashboard
      // (not a blank legacy state or corrupted state).
      if (existingRawData && (existingRawData.mode === "transition" || existingRawData.mode === "upskill")) {
         setPendingResult(data.result);
      } else {
         storage.setAnalysis(data.result);
         router.push("/dashboard");
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        setError("Request timed out taking too long from AI provider. Please try again.");
      } else {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
      setLoading(false);
    } finally {
      clearTimeout(timer);
    }
  }

  // ── Conflict Resolution Sandbox Modal ──
  if (pendingResult) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
         <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "32px", maxWidth: 460, textAlign: "center", boxShadow: "var(--shadow-card)" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 12, letterSpacing: "-0.03em" }}>
               Active Dashboard Detected
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 28 }}>
               You already have goals and historical progress tracked on your dashboard. What would you like to do with this new assessment?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
               <button onClick={() => {
                  storage.setAnalysis(pendingResult);
                  router.push("/dashboard");
               }} style={{ background: "var(--primary)", color: "#fff", border: "none", padding: "12px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Overwrite My Dashboard
               </button>
               <button onClick={() => {
                  storage.setTempAnalysis(pendingResult);
                  router.push("/dashboard?temp=true");
               }} style={{ background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border)", padding: "12px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Just View (Keep Dashboard Unchanged)
               </button>
            </div>
         </div>
      </div>
    );
  }

  // Gateway Screen
  if (!intent) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: "#f3f3f3",
        backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "130px 16px", fontFamily: "var(--font-body), sans-serif",
      }}>
        <div style={{ position: "fixed", inset: 0, boxShadow: "inset 0 0 120px rgba(150,160,255,0.22)", pointerEvents: "none", zIndex: 0 }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 680, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--primary)", padding: "5px 12px", borderRadius: 999, background: "var(--primary)10", border: "1px solid var(--primary)20", marginBottom: 20 }}>
            Analysis Engine
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontFamily: "var(--font-body)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 10, lineHeight: 1.2 }}>
            What are you looking to do?
          </h1>
          <p style={{ fontSize: 14, color: "#999", marginBottom: 36, lineHeight: 1.7 }}>
            We use a first-principles approach. Answer honestly. Output is brutally honest.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            <motion.button whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(78,52,46,0.18)" }} whileTap={{ scale: 0.98 }} onClick={() => chooseIntent("transition")} style={{ background: "#fff", border: "1.5px solid #e8e8e8", borderRadius: 20, padding: "32px 28px", textAlign: "left", cursor: "pointer", fontFamily: "var(--font-body), sans-serif", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 13, background: "linear-gradient(135deg, var(--primary), var(--accent-violet))", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Shuffle size={22} color="#fff" />
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>6 Dimensions</div>
              <h2 style={{ fontSize: 20, fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 10 }}>Career Transition</h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>Switch to an entirely new role in tech. Discover your highest-signal matches.</p>
            </motion.button>

            <motion.button whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(34,197,94,0.15)" }} whileTap={{ scale: 0.98 }} onClick={() => chooseIntent("upskill")} style={{ background: "#fff", border: "1.5px solid #e8e8e8", borderRadius: 20, padding: "32px 28px", textAlign: "left", cursor: "pointer", fontFamily: "var(--font-body), sans-serif", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 13, background: "linear-gradient(135deg, #22c55e, #4ade80)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <ArrowUpRight size={22} color="#fff" />
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-green)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>5 Dimensions</div>
              <h2 style={{ fontSize: 20, fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 10 }}>Engineering Upskill</h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>Level up in your current stack. Get a precise, no-fluff 12-month growth plan.</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active Questionnaire
  const progress = (step / totalSteps) * 100;
  const currDim = activeDimensions[step - 1];
  const pKey = currDim.key as keyof UserProfile;
  const currVal = profile[pKey];

  const handleSelect = (optLabel: string) => {
    if (currDim.multi) {
      const arr = (currVal as string[]) || [];
      if (arr.includes(optLabel)) {
        setProfile(p => ({ ...p, [pKey]: arr.filter(x => x !== optLabel) }));
      } else {
        setProfile(p => ({ ...p, [pKey]: [...arr, optLabel] }));
      }
    } else {
      setProfile(p => ({ ...p, [pKey]: optLabel }));
    }
  };

  if (loading) {
    const loaderMsgs = [
      "Initializing heuristic systems...",
      "Correlating background with market trajectories...",
      "Analyzing abstraction comfort levels...",
      "Identifying high-leverage skill gaps...",
      "Formulating realistic operational roadmap..."
    ];

    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)", backgroundImage: "linear-gradient(rgba(100,80,60,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(100,80,60,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body), sans-serif" }}>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes clPulse {
            0% { transform: scale(0.96); opacity: 0.6; box-shadow: 0 0 0 0 rgba(78,52,46,0.25); }
            70% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 40px rgba(78,52,46,0); }
            100% { transform: scale(0.96); opacity: 0.6; box-shadow: 0 0 0 0 rgba(78,52,46,0); }
          }
          @keyframes clSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 120 }}>
          {/* Outer spinning ring */}
          <div style={{ position: "absolute", width: 96, height: 96, borderRadius: "50%", border: "2px dashed rgba(78,52,46,0.2)", animation: "clSpin 8s linear infinite" }} />
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--primary)", animation: "clPulse 2.5s infinite ease-in-out", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(78,52,46,0.2)" }}>
            <Target size={28} color="#fff" />
          </div>
        </div>

        <div style={{ height: 60, marginTop: 28, position: "relative", width: "100%", maxWidth: 420, textAlign: "center" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={loadStep}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ position: "absolute", width: "100%", left: 0 }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-display)" }}>
                {loaderMsgs[loadStep]}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <p style={{ color: "var(--text-muted)", fontSize: 13, maxWidth: 360, textAlign: "center", lineHeight: 1.7, marginTop: 8 }}>
          Applying first-principles reasoning to your profile.
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", background: "var(--bg-base)", display: "flex", flexDirection: "column", 
      alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body), sans-serif", padding: "80px 20px 40px" 
    }}>
      
      <div style={{ position: "fixed", top: 80, left: 0, right: 0, height: 4, background: "var(--bg-surface)", zIndex: 999 }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} style={{ height: "100%", background: "var(--primary)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 640 }}>
        {error && (
          <div style={{ background: "var(--accent-red)", padding: "14px", borderRadius: 0, color: "var(--bg-base)", fontSize: 13, marginBottom: 20, display: "flex", gap: 8, alignItems: "center" }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <AnimatePresence mode="popLayout" custom={dir}>
          <motion.div key={step} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ background: "var(--bg-surface)", padding: "28px 32px", borderRadius: 0, boxShadow: "var(--shadow-card)", border: "1px solid var(--border)" }}>
            
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 16, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
              Dimension {step} of {totalSteps}
            </div>
            <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 6, lineHeight: 1.25 }}>
              {currDim.title}
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>{currDim.desc}</p>

            <div className="options-scroll-container" style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: "40vh", overflowY: "auto", paddingRight: 4 }}>
              {currDim.options.map(opt => {
                const isSelected = currDim.multi 
                  ? ((currVal as string[]) || []).includes(opt.label)
                  : currVal === opt.label;
                return (
                  <OptionCard
                    key={opt.id}
                    label={opt.label}
                    multi={currDim.multi}
                    selected={isSelected}
                    onClick={() => handleSelect(opt.label)}
                  />
                )
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border-bright)" }}>
              <button
                type="button"
                onClick={prevStep}
                style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, background: "transparent", border: "none", cursor: "pointer", padding: "8px 12px", borderRadius: "var(--radius-sm)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <ArrowLeft size={16} /> Back
              </button>
              
              <button
                type="button"
                onClick={nextStep}
                style={{
                  display: "flex", alignItems: "center", gap: 8, background: "var(--text-primary)", color: "var(--bg-base)",
                  fontSize: 14, fontWeight: 700, padding: "12px 24px", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer"
                }}
              >
                {step === totalSteps ? "Generate Honest Report" : "Continue"} <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
