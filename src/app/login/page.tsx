'use client';

import React, { useState } from 'react';
import { login, signup } from './actions';
import { ArrowRight, KeyRound, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = isLogin ? await login(formData) : await signup(formData);
      if (res?.error) {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "var(--bg-base)",
        padding: "24px"
      }}
    >
      <div 
        style={{
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Link href="/" style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 500, display: "inline-block", marginBottom: 40 }}>
          ← Back to home
        </Link>
        
        <h1 style={{ 
          fontFamily: "var(--font-display)", 
          fontSize: "2rem", 
          marginBottom: 8,
          color: "var(--text-primary)"
        }}>
          {isLogin ? "Welcome back." : "Start your journey."}
        </h1>
        <p style={{ 
          color: "var(--text-secondary)", 
          fontSize: 15, 
          marginBottom: 32 
        }}>
          {isLogin 
            ? "Log in to view your career analytics and saved roadmaps." 
            : "Create an account to track your progress and sync to the cloud."}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {errorMsg && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#ef4444",
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              fontWeight: 500
            }}>
              {errorMsg}
            </div>
          )}

          <div style={{ position: "relative" }}>
            <Mail size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: 14 }} />
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="name@example.com"
              style={{
                width: "100%",
                padding: "12px 16px 12px 42px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                fontSize: 15,
                outline: "none",
                transition: "border-color 0.2s"
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <KeyRound size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: 14 }} />
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px 16px 12px 42px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                fontSize: 15,
                outline: "none",
                transition: "border-color 0.2s"
              }}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 24px",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-md)",
              fontSize: 15,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: 8,
              transition: "opacity 0.2s"
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : (isLogin ? "Sign in" : "Create account")}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            type="button"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: 14,
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: 4
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
