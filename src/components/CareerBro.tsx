"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  X,
  Send,
  Sparkles,
  RotateCcw,
  ChevronDown,
  BookOpen,
  Code2,
  Map,
  Calendar,
  Lightbulb,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ── Quick prompts ─────────────────────────────────────────────────────────────

const QUICK_PROMPTS = [
  { icon: Map,       label: "Study roadmap",      prompt: "Give me a 3-month study roadmap for full-stack web development." },
  { icon: Code2,     label: "DSA tips",            prompt: "What are the most important DSA topics to master for FAANG interviews?" },
  { icon: Calendar,  label: "Daily plan",          prompt: "Build me a daily 2-hour study plan for learning Python from scratch." },
  { icon: BookOpen,  label: "Best resources",      prompt: "What are the best free resources for learning System Design?" },
  { icon: Lightbulb, label: "Interview prep",      prompt: "How should I prepare for behavioral interviews at top tech companies?" },
];

// ── Markdown-lite renderer (bold, code, bullets) ──────────────────────────────

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith("## ")) {
      nodes.push(
        <p key={i} style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)", margin: "10px 0 4px" }}>
          {line.slice(3)}
        </p>
      );
    } else if (line.match(/^(\d+)\.\s/)) {
      nodes.push(
        <p key={i} style={{ paddingLeft: "12px", margin: "2px 0", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
          {renderInline(line)}
        </p>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      nodes.push(
        <p key={i} style={{ paddingLeft: "12px", margin: "2px 0", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
          <span style={{ color: "var(--primary)", marginRight: "6px" }}>›</span>
          {renderInline(line.slice(2))}
        </p>
      );
    } else if (line.trim() === "") {
      nodes.push(<span key={i} style={{ display: "block", height: "6px" }} />);
    } else {
      nodes.push(
        <p key={i} style={{ margin: "2px 0", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
          {renderInline(line)}
        </p>
      );
    }
  });

  return nodes;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "var(--text-primary)", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} style={{
          background: "rgba(78, 52, 46,0.15)",
          color: "var(--accent-violet)",
          padding: "1px 6px",
          borderRadius: "4px",
          fontSize: "0.78rem",
          fontFamily: "var(--font-mono)",
        }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="cb-typing-dots">
      <span /><span /><span />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CareerBro() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey! I'm **CareerBro** 👋\n\nI'm your AI study partner — ask me anything about learning, interview prep, roadmaps, or levelling up your skills.\n\nWhat are you working on today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuick, setShowQuick] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const sendMessage = useCallback(async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || loading) return;

    setShowQuick(false);
    setError(null);
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    abortRef.current = new AbortController();

    try {
      const payload = history
        .filter((m) => m.role !== "assistant" || m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/careerbro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
        signal: abortRef.current.signal,
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    if (loading && abortRef.current) abortRef.current.abort();
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hey! I'm **CareerBro** 👋\n\nI'm your AI study partner — ask me anything about learning, interview prep, roadmaps, or levelling up your skills.\n\nWhat are you working on today?",
        timestamp: new Date(),
      },
    ]);
    setShowQuick(true);
    setError(null);
    setLoading(false);
  };

  // Don't show the floating widget on the dedicated page
  if (pathname === "/careerbro") return null;

  return (
    <>
      {/* ── Floating Button ────────────────────────────────────────────── */}
      <button
        id="careerbro-toggle"
        className="cb-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close CareerBro" : "Open CareerBro"}
      >
        {open ? (
          <ChevronDown size={22} className="cb-fab-icon" />
        ) : (
          <>
            <div className="cb-fab-glow" />
            <Sparkles size={20} className="cb-fab-icon" />
            <span className="cb-fab-label">CareerBro</span>
            {/* Unread dot */}
            <span className="cb-unread-dot" />
          </>
        )}
      </button>

      {/* ── Chat Window ───────────────────────────────────────────────── */}
      <div className={`cb-window ${open ? "cb-window--open" : ""}`} role="dialog" aria-label="CareerBro AI chat">
        {/* Header */}
        <div className="cb-header">
          <div className="cb-header-left">
            <div className="cb-avatar">
              <Sparkles size={16} />
              <span className="cb-avatar-ring" />
            </div>
            <div>
              <p className="cb-header-name">CareerBro</p>
              <p className="cb-header-status">
                <span className="cb-status-dot" />
                Study AI · Always on
              </p>
            </div>
          </div>
          <div className="cb-header-actions">
            <button className="cb-icon-btn" onClick={clearChat} title="Clear chat">
              <RotateCcw size={15} />
            </button>
            <button className="cb-icon-btn" onClick={() => setOpen(false)} title="Close">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="cb-messages" ref={scrollRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`cb-msg cb-msg--${msg.role}`}>
              {msg.role === "assistant" && (
                <div className="cb-msg-avatar">
                  <Sparkles size={12} />
                </div>
              )}
              <div className={`cb-bubble cb-bubble--${msg.role}`}>
                {msg.role === "assistant"
                  ? renderMarkdown(msg.content)
                  : <span style={{ fontSize: "0.84rem", lineHeight: 1.6 }}>{msg.content}</span>}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="cb-msg cb-msg--assistant">
              <div className="cb-msg-avatar">
                <Sparkles size={12} />
              </div>
              <div className="cb-bubble cb-bubble--assistant">
                <TypingDots />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="cb-error">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}

          {/* Quick prompts */}
          {showQuick && messages.length === 1 && (
            <div className="cb-quick-prompts">
              <p className="cb-quick-label">Quick starts:</p>
              <div className="cb-quick-grid">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q.label}
                    className="cb-quick-btn"
                    onClick={() => sendMessage(q.prompt)}
                  >
                    <q.icon size={13} />
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="cb-input-area">
          <div className="cb-input-wrap">
            <textarea
              ref={inputRef}
              className="cb-input"
              placeholder="Ask anything about studying, skills, interviews…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={loading}
            />
            <button
              className={`cb-send-btn ${input.trim() && !loading ? "cb-send-btn--active" : ""}`}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </div>
          <p className="cb-footer-note">Powered by Gemini · CareerLens AI</p>
        </div>
      </div>
    </>
  );
}
