"use client";

import React from "react";
import { motion } from "framer-motion";
import { Map, ExternalLink } from "lucide-react";

const careers = [
  { title: "Frontend Developer",  desc: "UI, CSS, React, browser",           url: "https://roadmap.sh/frontend" },
  { title: "Backend Developer",   desc: "APIs, servers, databases",           url: "https://roadmap.sh/backend" },
  { title: "Full Stack Developer",desc: "Frontend + backend both",            url: "https://roadmap.sh/full-stack" },
  { title: "DevOps Engineer",     desc: "CI/CD, cloud, infra",               url: "https://roadmap.sh/devops" },
  { title: "UX Designer",         desc: "Research, wireframes, design",       url: "https://roadmap.sh/ux-design" },
  { title: "Data Analyst",        desc: "SQL, dashboards, insights",          url: "https://roadmap.sh/data-analyst" },
  { title: "AI Engineer",         desc: "LLMs, pipelines, RAG",              url: "https://roadmap.sh/ai-engineer" },
  { title: "Data Scientist",      desc: "ML models, statistics",             url: "https://roadmap.sh/ai-data-scientist" },
  { title: "Data Engineer",       desc: "ETL, pipelines, warehouses",        url: "https://roadmap.sh/data-engineer" },
  { title: "Android Developer",   desc: "Kotlin, Jetpack, Android",          url: "https://roadmap.sh/android" },
  { title: "iOS Developer",       desc: "Swift, SwiftUI, Xcode",             url: "https://roadmap.sh/ios" },
  { title: "ML Engineer",         desc: "Deploy and scale ML systems",       url: "https://roadmap.sh/machine-learning" },
  { title: "QA Engineer",         desc: "Testing, automation, quality",      url: "https://roadmap.sh/qa" },
  { title: "Cyber Security",      desc: "Threats, networks, defense",        url: "https://roadmap.sh/cyber-security" },
  { title: "Product Manager",     desc: "Vision, roadmap, teams",            url: "https://roadmap.sh/product-manager" },
  { title: "Blockchain Developer",desc: "Smart contracts, Web3",             url: "https://roadmap.sh/blockchain" },
  { title: "Game Developer",      desc: "Unity, Unreal, game logic",         url: "https://roadmap.sh/game-developer" },
  { title: "Technical Writer",    desc: "Docs, APIs, developer content",     url: "https://roadmap.sh/technical-writer" },
];

export default function RoadmapsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        backgroundImage:
          "linear-gradient(#d0d0dc 1px, transparent 1px), linear-gradient(90deg, #d0d0dc 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "var(--font-body), sans-serif",
        paddingTop: 88,
        paddingBottom: 80,
        position: "relative",
      }}
    >
      {/* Vignette */}
      <div
        style={{
          position: "fixed", inset: 0,
          boxShadow: "inset 0 0 140px rgba(78,52,46,0.06)",
          pointerEvents: "none", zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 40 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 14px", borderRadius: 999,
            background: "var(--primary)10", border: "1px solid var(--primary)25", marginBottom: 14,
          }}>
            <Map size={13} color="var(--primary)" />
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--primary)" }}>
              Career Roadmaps
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 400, fontFamily: "var(--font-display)",
            color: "#111", letterSpacing: "0", marginBottom: 12, lineHeight: 1.1,
          }}>
            Pick your path.<br />
            <span style={{ color: "var(--primary)" }}>Follow the map.</span>
          </h1>
          <p style={{ fontSize: 16, color: "#777", maxWidth: 540, lineHeight: 1.6 }}>
            {careers.length} curated career roadmaps from{" "}
            <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
              roadmap.sh
            </a>
            {" "}— the industry standard for structured learning paths.
          </p>
        </motion.div>

        {/* ── Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 14,
        }}>
          {careers.map((c, i) => (
            <motion.a
              key={c.url}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "22px 22px 18px",
                background: "#fff",
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                textDecoration: "none",
                cursor: "pointer",
                transition: "transform 0.18s, box-shadow 0.18s, background 0.18s, border-color 0.18s",
                minHeight: 120,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = "0 8px 32px rgba(78,52,46,0.08)";
                el.style.background = "#fff";
                el.style.borderColor = "var(--primary)30";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "";
                el.style.boxShadow = "0 2px 16px rgba(0,0,0,0.03)";
                el.style.background = "#fff";
                el.style.borderColor = "rgba(0,0,0,0.07)";
              }}
            >
              {/* Card body */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#222", marginBottom: 6, lineHeight: 1.3 }}>
                  {c.title}
                </p>
                <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6 }}>
                  {c.desc}
                </p>
              </div>

              {/* Footer */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginTop: 16, paddingTop: 12, borderTop: "1px solid #f0f0f0",
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>
                  View Roadmap →
                </span>
                <ExternalLink size={13} color="#bbb" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* ── Footer note ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ marginTop: 36, fontSize: 13, color: "#bbb", textAlign: "center" as const }}
        >
          All roadmaps open on{" "}
          <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            roadmap.sh
          </a>
          {" "}in a new tab.
        </motion.p>

      </div>
    </div>
  );
}
