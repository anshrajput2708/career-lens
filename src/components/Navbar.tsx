"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Dashboard",      href: "/dashboard" },
  { name: "Resume Analysis",href: "/resume-analysis" },
  { name: "Roadmaps",       href: "/roadmaps" },
  { name: "Resources",      href: "/resources" },
  { name: "Research Lens",  href: "/research-lens", isNew: true },
  { name: "CareerBro",      href: "/careerbro" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
          background: "var(--bg-base)",
          borderBottom: "1px solid rgba(78,52,46,0.14)",
          fontFamily: "var(--font-body)",
        }}
      >
        <div style={{
          width: "100%", maxWidth: 1140, margin: "0 auto", height: 62,
          display: "flex", alignItems: "center",
          padding: "0 24px", boxSizing: "border-box",
        }}>
          {/* Logo */}
          <Link href="/" style={{
            fontWeight: 900, fontSize: 21, letterSpacing: "-0.05em",
            color: "var(--text-primary)", textDecoration: "none",
            display: "flex", alignItems: "center", lineHeight: 1, flexShrink: 0,
          }}>
            C<span style={{ color: "var(--primary)" }}>.</span>
          </Link>

          {/* Desktop links */}
          <div className="nav-desktop-links" style={{ display: "flex", alignItems: "center", marginLeft: 28, height: "100%" }}>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "2px 14px 0", height: "100%",
                    fontSize: 13.5, fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    textDecoration: "none",
                    boxShadow: isActive ? "inset 0 -2px 0 var(--text-primary)" : "none",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap", boxSizing: "border-box",
                  }}
                >
                  <span style={{ transform: "translateY(1px)" }}>{link.name}</span>
                  {link.isNew && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.03em",
                      background: "var(--text-primary)", color: "#fff",
                      borderRadius: 4, padding: "2px 5px", lineHeight: 1.6,
                      transform: "translateY(1px)"
                    }}>New</span>
                  )}
                </Link>
              );
            })}
          </div>

          <div style={{ flex: 1 }} />

          {/* Desktop CTAs */}
          <div className="nav-desktop-ctas" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/onboard" className="btn-saas" style={{ height: 38, padding: "2px 18px 0", fontSize: 13, whiteSpace: "nowrap" }}>
              <span style={{ transform: "translateY(0.5px)" }}>Get Fit Score</span>
            </Link>
            <Link href="/onboard" className="btn-secondary" style={{ height: 38, padding: "2px 16px 0", fontSize: 13, whiteSpace: "nowrap" }}>
              <span style={{ transform: "translateY(0.5px)" }}>Retake</span>
            </Link>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setOpen(o => !o)}
            style={{
              display: "none",
              background: "transparent", border: "none",
              cursor: "pointer", padding: 8, marginLeft: 8,
              color: "var(--text-primary)",
            }}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9998,
            background: "rgba(41,37,36,0.4)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* Mobile drawer */}
      <nav
        style={{
          position: "fixed", top: 62, left: 0, right: 0, zIndex: 9999,
          background: "var(--bg-base)",
          borderBottom: "1px solid rgba(78,52,46,0.14)",
          transform: open ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.3s cubic-bezier(0.19,1,0.22,1)",
          padding: "12px 0 20px",
        }}
        className="nav-mobile-drawer"
      >
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "14px 24px",
                fontSize: 15, fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                borderLeft: isActive ? "3px solid var(--primary)" : "3px solid transparent",
                background: isActive ? "var(--bg-elevated)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              {link.name}
              {link.isNew && (
                <span style={{
                  fontSize: 9, fontWeight: 700, background: "var(--text-primary)",
                  color: "#fff", borderRadius: 4, padding: "2px 5px",
                }}>New</span>
              )}
            </Link>
          );
        })}

        {/* CTA in drawer */}
        <div style={{ padding: "16px 24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href="/onboard" className="btn-saas" onClick={() => setOpen(false)}
            style={{ textAlign: "center", padding: "12px 0", width: "100%", justifyContent: "center" }}>
            Get Fit Score
          </Link>
          <Link href="/onboard" className="btn-secondary" onClick={() => setOpen(false)}
            style={{ textAlign: "center", padding: "12px 0", width: "100%", justifyContent: "center" }}>
            Retake Analysis
          </Link>
        </div>
      </nav>
    </>
  );
}
