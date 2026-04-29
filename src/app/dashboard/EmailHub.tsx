"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Copy,
  Mail,
  Radio,
  Send,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { storage, type EmailPrefs } from "@/lib/utils/storage";

const tile: React.CSSProperties = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-card)",
  padding: "18px 16px",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  minHeight: 128,
  textAlign: "left" as const,
};

const label: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
};

function ToggleTile({
  title,
  sub,
  active,
  onClick,
  icon: Icon,
}: {
  title: string;
  sub: string;
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...tile,
        cursor: "pointer",
        borderColor: active ? "var(--accent-green)" : "var(--border)",
        background: active ? "var(--accent-green-soft)" : "var(--bg-surface)",
        transition: "border-color 0.15s ease, background 0.15s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon size={20} color={active ? "var(--accent-green)" : "var(--text-muted)"} aria-hidden />
        <div>
          <div style={{ ...label, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{active ? "On" : "Off"}</div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.45, margin: 0 }}>{sub}</p>
    </button>
  );
}

export interface EmailHubSummary {
  headline: string;
  fitScore: number | null;
  streak: number;
  resourcesDone: number;
}

export function EmailHub({ summary }: { summary: EmailHubSummary }) {
  const [emailDraft, setEmailDraft] = useState("");
  const [prefs, setPrefs] = useState<EmailPrefs>(storage.getEmailPrefs());
  const [resendConfigured, setResendConfigured] = useState<boolean | null>(null);
  const [fromHint, setFromHint] = useState("");
  const [sending, setSending] = useState(false);
  const [lastMsg, setLastMsg] = useState<string | null>(null);
  const [lastOk, setLastOk] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [subjectLine, setSubjectLine] = useState("CareerLens — test email");

  useEffect(() => {
    setEmailDraft(storage.getEmail() || "");
    setPrefs(storage.getEmailPrefs());
    fetch("/api/email/test")
      .then((r) => r.json())
      .then((d: { resendConfigured?: boolean; fromDefault?: string }) => {
        setResendConfigured(Boolean(d.resendConfigured));
        if (d.fromDefault) setFromHint(d.fromDefault);
      })
      .catch(() => setResendConfigured(false));
  }, []);

  const saveEmail = useCallback(() => {
    const t = emailDraft.trim();
    if (!t || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) {
      setLastOk(false);
      setLastMsg("Save a valid email first.");
      return;
    }
    storage.setEmail(t);
    setLastOk(true);
    setLastMsg("Saved. Supabase sync will run if your project keys are set.");
  }, [emailDraft]);

  const updatePref = useCallback((key: keyof EmailPrefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    storage.setEmailPrefs(next);
  }, [prefs]);

  const progressSnippet = useCallback(() => {
    const lines = [
      `CareerLens snapshot`,
      `Focus: ${summary.headline}`,
      summary.fitScore != null ? `Readiness: ${summary.fitScore}%` : null,
      `Streak: ${summary.streak} days`,
      `Resources completed: ${summary.resourcesDone}`,
      `Weekly recap: ${prefs.weeklyRecap ? "yes" : "no"} · Streak nudges: ${prefs.streakSaver ? "yes" : "no"} · Milestones: ${prefs.milestoneAlerts ? "yes" : "no"}`,
    ].filter(Boolean) as string[];
    return lines.join("\n");
  }, [summary, prefs]);

  const copySnippet = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(progressSnippet());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setLastOk(false);
      setLastMsg("Could not copy to clipboard.");
    }
  }, [progressSnippet]);

  const sendTest = useCallback(async () => {
    const to = emailDraft.trim() || (storage.getEmail() || "").trim();
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      setLastOk(false);
      setLastMsg("Enter and save a valid email, or type one in the field.");
      return;
    }
    setSending(true);
    setLastMsg(null);
    try {
      const r = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject: subjectLine.trim() || undefined,
          stats: {
            headline: summary.headline,
            fitScore: summary.fitScore,
            streak: summary.streak,
            resourcesDone: summary.resourcesDone,
          },
        }),
      });
      const data = (await r.json()) as {
        ok?: boolean;
        demo?: boolean;
        message?: string;
        error?: string;
        id?: string;
      };
      if (!r.ok || data.ok === false) {
        setLastOk(false);
        setLastMsg(data.error || "Send failed.");
        return;
      }
      if (data.demo) {
        setLastOk(true);
        setLastMsg(data.message || "Dry run OK.");
      } else {
        setLastOk(true);
        setLastMsg(data.id ? `Sent (id ${data.id}). Check inbox & spam.` : "Sent. Check inbox.");
      }
    } catch {
      setLastOk(false);
      setLastMsg("Network error — try again.");
    } finally {
      setSending(false);
    }
  }, [emailDraft, subjectLine, summary]);

  return (
    <section style={{ marginBottom: 28 }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ ...label, marginBottom: 8 }}>Email desk</p>
        <h2
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 6,
          }}
        >
          Inbox, nudges & dry-run sends
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
          Save your address for Supabase sync, toggle future automations, send a test message, or copy a text summary for yourself.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 14,
        }}
      >
        {/* Full-width row */}
        <div style={{ ...tile, gridColumn: "1 / -1", minHeight: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <Mail size={20} color="var(--primary)" aria-hidden />
            <span style={label}>Delivery address</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 8px" }}>
            Used for cloud backup and outbound mail. Never shown on the public site.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <input
              type="email"
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={{
                flex: "1 1 200px",
                minWidth: 0,
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-bright)",
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                fontSize: 15,
              }}
            />
            <button
              type="button"
              onClick={saveEmail}
              style={{
                padding: "12px 20px",
                borderRadius: "var(--radius-md)",
                background: "var(--primary)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>

        <ToggleTile
          title="Weekly recap"
          sub="Sunday-style digest of score, streak, and sprint (when wired to cron)."
          active={prefs.weeklyRecap}
          onClick={() => updatePref("weeklyRecap", !prefs.weeklyRecap)}
          icon={Sparkles}
        />
        <ToggleTile
          title="Streak saver"
          sub="Ping before a streak breaks after quiet days."
          active={prefs.streakSaver}
          onClick={() => updatePref("streakSaver", !prefs.streakSaver)}
          icon={Zap}
        />
        <ToggleTile
          title="Milestone alerts"
          sub="Heads-up when readiness crosses big thresholds."
          active={prefs.milestoneAlerts}
          onClick={() => updatePref("milestoneAlerts", !prefs.milestoneAlerts)}
          icon={Target}
        />

        <div style={tile}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Send size={18} color="var(--primary)" aria-hidden />
            <span style={label}>Send test</span>
          </div>
          <input
            type="email"
            value={emailDraft}
            onChange={(e) => setEmailDraft(e.target.value)}
            placeholder="destination@example.com"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontSize: 13,
            }}
          />
          <button
            type="button"
            disabled={sending}
            onClick={sendTest}
            style={{
              marginTop: 4,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "11px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-bright)",
              background: "var(--bg-base)",
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: 13,
              cursor: sending ? "wait" : "pointer",
            }}
          >
            <Send size={15} aria-hidden />
            {sending ? "Sending…" : "Send test email"}
          </button>
        </div>

        <div style={tile}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Radio size={18} color="var(--primary)" aria-hidden />
            <span style={label}>Outbound status</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <p style={{ margin: "0 0 6px" }}>
              Resend:{" "}
              <strong style={{ color: resendConfigured ? "var(--accent-green)" : "var(--text-muted)" }}>
                {resendConfigured === null ? "…" : resendConfigured ? "live key detected" : "dry-run only"}
              </strong>
            </p>
            {fromHint ? (
              <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
                Default from: {fromHint}
              </p>
            ) : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", paddingTop: 8 }}>
            <Bell size={14} color="var(--text-muted)" aria-hidden />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Set RESEND_API_KEY & optional RESEND_FROM_EMAIL</span>
          </div>
        </div>

        <div style={{ ...tile, gridColumn: "1 / -1", minHeight: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Copy size={18} color="var(--primary)" aria-hidden />
              <span style={label}>Copy progress snippet</span>
            </div>
            <button
              type="button"
              onClick={copySnippet}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-elevated)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              {copied ? <CheckCircle2 size={15} color="var(--accent-green)" /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre
            style={{
              margin: "10px 0 0",
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              color: "var(--text-secondary)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              maxHeight: 120,
              overflow: "auto",
            }}
          >
            {progressSnippet()}
          </pre>
        </div>
      </div>

      {lastMsg ? (
        <p
          style={{
            marginTop: 14,
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            color: lastOk ? "var(--accent-green)" : "var(--accent-red)",
          }}
        >
          {lastMsg}
        </p>
      ) : null}
    </section>
  );
}
