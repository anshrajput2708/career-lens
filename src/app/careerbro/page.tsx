"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Map, Code2, Calendar, BookOpen, Sparkles, Plus } from "lucide-react";

const PAGE: React.CSSProperties = {
  minHeight: "calc(100vh - 98px)",
  background: "var(--bg-base)",
  fontFamily: "var(--font-body), sans-serif",
  display: "flex",
  flexDirection: "column",
  height: "calc(100vh - 98px)",
  overflow: "hidden",
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  provider?: "huggingface" | "gemini";
}

const QUICK_PROMPTS = [
  { icon: Map, label: "Study Roadmap", prompt: "Give me a 3-month study roadmap for full-stack web development." },
  { icon: Code2, label: "DSA Mastery", prompt: "What are the most important DSA topics for FAANG interviews?" },
  { icon: Calendar, label: "Daily Plan", prompt: "I have 2 hours daily. Build me an optimal study plan." },
  { icon: BookOpen, label: "Best Resources", prompt: "What are the best free resources for learning System Design?" },
];

function renderMarkdown(text: string, isUser: boolean): React.ReactNode[] {
  // Always use standard text primary color for text
  const textColor = "var(--text-primary)";
  const lines = text.split("\n");
  
  return lines.map((line, i) => {
    if (line.startsWith("## ") || line.startsWith("### ")) {
      const txt = line.replace(/^#{2,3}\s/, "");
      return <p key={i} style={{ fontWeight: 700, fontSize: "1.1rem", margin: "16px 0 8px", fontFamily: "var(--font-display), sans-serif", color: textColor }}>{txt}</p>;
    }
    if (line.match(/^(\d+)\.\s/) || line.startsWith("- ") || line.startsWith("* ")) {
      const isBullet = line.startsWith("- ") || line.startsWith("* ");
      const content  = isBullet ? line.slice(2) : line;
      return (
        <p key={i} style={{ paddingLeft: 16, margin: "6px 0", fontSize: "1rem", color: textColor, lineHeight: 1.6, position: "relative" }}>
          {isBullet && <span style={{ position: "absolute", left: 0, top: 0, color: "var(--text-secondary)", fontWeight: 600 }}>•</span>}
          {renderInline(content)}
        </p>
      );
    }
    if (line.trim() === "") return <span key={i} style={{ display: "block", height: 12 }} />;
    return (
      <p key={i} style={{ margin: "6px 0", fontSize: "1rem", color: textColor, lineHeight: 1.6 }}>
        {renderInline(line)}
      </p>
    );
  });
}

function renderInline(text: string): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={i} style={{
          background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)",
          padding: "2px 6px", borderRadius: 4, fontSize: "0.85em", fontFamily: "monospace",
          color: "var(--text-primary)"
        }}>
          {part.slice(1, -1)}
        </code>
      );
    return <span key={i}>{part}</span>;
  });
}

export default function CareerBroPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  const isEmpty = messages.length === 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = useCallback(async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || loading) return;
    setError(null);
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: trimmed };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    try {
      const res = await fetch("/api/careerbro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply }]);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.style.height = "auto";
          inputRef.current.focus();
        }
      }, 80);
    }
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div style={PAGE}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 860, width: "100%", margin: "0 auto", padding: "0 20px", overflow: "hidden" }}>
        
        {/* Top Header - Claude style start new chat button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "16px 0", flexShrink: 0, height: 60 }}>
          <button 
            onClick={() => setMessages([])} 
            style={{ 
              display: isEmpty ? "none" : "flex", alignItems: "center", gap: 6,
              background: "transparent", border: "none", color: "var(--text-secondary)", 
              fontSize: "0.85rem", cursor: "pointer", fontWeight: 500, transition: "color 0.2s" 
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            <Plus size={16} /> New Chat
          </button>
        </div>

        {/* ── EMPTY STATE ── */}
        {isEmpty && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: "10vh" }}>
            <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.2rem)", fontWeight: 400, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 32, fontFamily: "var(--font-display), sans-serif", textAlign: "center" }}>
              Good afternoon. How can I help you study?
            </h1>
            
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 650 }}>
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.prompt)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 16px", borderRadius: 999,
                    background: "rgba(78,52,46,0.04)", border: "1px solid rgba(78,52,46,0.06)",
                    color: "var(--text-secondary)", fontSize: "0.9rem", cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(78,52,46,0.08)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(78,52,46,0.04)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  }}
                >
                  <q.icon size={14} />
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── CHAT MESSAGES ── */}
        {!isEmpty && (
          <div ref={scrollRef} data-lenis-prevent="true" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 32, paddingBottom: 40, paddingRight: 8 }}>
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", width: "100%" }}>
                  {isUser ? (
                    <div style={{ background: "rgba(78,52,46,0.05)", padding: "14px 20px", borderRadius: 24, borderBottomRightRadius: 6, maxWidth: "80%", color: "var(--text-primary)", fontSize: "1rem", lineHeight: 1.5 }}>
                      {msg.content}
                    </div>
                  ) : (
                    <div style={{ padding: "0", maxWidth: "100%", width: "100%", color: "var(--text-primary)", fontSize: "1rem" }}>
                      <div style={{ paddingRight: 40 }}>
                        {renderMarkdown(msg.content, false)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {loading && (
              <div style={{ paddingTop: 8, paddingLeft: 4 }}>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)" }} />
              </div>
            )}
            
            {error && <div style={{ color: "#ef4444", padding: "12px 16px", border: "1px solid #fecaca", background: "#fef2f2", borderRadius: 12 }}>{error}</div>}
          </div>
        )}

        {/* ── FLOATING CLAUDE INPUT ── */}
        <div style={{ paddingBottom: 24, paddingTop: 12, flexShrink: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ 
            width: "100%", maxWidth: 800, background: "#fff", border: "1px solid rgba(0,0,0,0.1)", 
            borderRadius: 24, padding: "10px 10px 10px 18px", boxShadow: "0 8px 32px rgba(0,0,0,0.05)", 
            display: "flex", flexDirection: "column", transition: "box-shadow 0.2s ease" 
          }}
          onFocus={e => (e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)")}
          onBlur={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.05)")}
          >
            <textarea
              ref={inputRef}
              data-lenis-prevent="true"
              autoFocus
              value={input}
              onChange={adjustTextareaHeight}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Message CareerBro..."
              rows={1}
              style={{
                width: "100%", background: "transparent", border: "none", outline: "none",
                color: "var(--text-primary)", fontSize: "1.05rem", fontFamily: "var(--font-body), sans-serif",
                lineHeight: 1.5, resize: "none", padding: "6px 0", maxHeight: 200, overflowY: "auto",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              {/* Optional secondary actions can go here in the future */}
              <div /> 
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                title="Send message"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 34, height: 34, borderRadius: 12, border: "none",
                  background: input.trim() && !loading ? "var(--primary)" : "rgba(78,52,46,0.05)",
                  color: input.trim() && !loading ? "#fff" : "rgba(78,52,46,0.3)",
                  cursor: input.trim() && !loading ? "pointer" : "default", transition: "all 0.15s",
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
