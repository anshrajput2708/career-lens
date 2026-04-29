"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

const NAV_LINKS = [
  { name: "Dashboard",  href: "/dashboard"  },
  { name: "Resume Analysis", href: "/resume-analysis" },
  { name: "Roadmaps",   href: "/roadmaps"   },
  { name: "Resources",  href: "/resources" },
  { name: "Research Lens", href: "/research-lens", isNew: true },
  { name: "CareerBro",  href: "/careerbro"  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
        background: "var(--bg-base)",
        fontFamily: "var(--font-body)",
      }}
    >


      {/* ── Main Nav ── */}
      <div
        style={{
          width: "100%",
          height: 62,
          background: "var(--bg-base)",
          borderBottom: "1px solid rgba(78, 52, 46,0.14)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        {/* Logo — flush left */}
        <Link
          href="/"
          style={{
            fontWeight: 900, fontSize: 21, letterSpacing: "-0.05em",
            color: "var(--text-primary)", textDecoration: "none",
            display: "flex", alignItems: "center",
            lineHeight: 1, flexShrink: 0,
          }}
        >
          C<span style={{ color: "var(--primary)" }}>.</span>
        </Link>

        {/* Links — left-aligned, generous spacing */}
        <div style={{ display: "flex", alignItems: "center", marginLeft: 32 }}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const isHov = hovered === link.name;
            return (
              <Link
                key={link.name}
                href={link.href}
                onMouseEnter={() => setHovered(link.name)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "0 14px", height: 62,
                  fontSize: 14, fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--text-primary)" : isHov ? "var(--text-primary)" : "var(--text-secondary)",
                  textDecoration: "none",
                  borderBottom: isActive ? "2px solid var(--text-primary)" : "2px solid transparent",
                  transition: "color 0.15s, border-color 0.15s",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box",
                }}
              >
                {link.name}
                {link.isNew && (
                  <span style={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: "0.03em",
                    background: "var(--text-primary)", color: "#ffffff",
                    borderRadius: 4, padding: "2px 5px", lineHeight: 1.6,
                  }}>
                    New
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* CTAs — flush right */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href="/onboard"
            className="btn-saas"
            style={{
              height: 38, padding: "0 20px", display: "inline-flex", alignItems: "center",
              fontSize: 13.5,
              whiteSpace: "nowrap",
            }}
          >
            Get Fit Score
          </Link>
          <Link
            href="/onboard"
            className="btn-secondary"
            style={{
              height: 38, padding: "0 18px",
              fontSize: 13.5,
              whiteSpace: "nowrap",
            }}
          >
            Retake Analysis
          </Link>
        </div>
      </div>
    </header>
  );
}
