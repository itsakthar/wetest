"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onAnalyze: (url: string) => void;
  loading: boolean;
}

const EXAMPLES = ["stripe.com", "apple.com", "linear.app", "vercel.com", "github.com"];

export function HeroSection({ onAnalyze, loading }: Props) {
  const [url, setUrl] = useState("");
  const [focused, setFocused] = useState(false);

  const submit = () => { if (url.trim()) onAnalyze(url.trim()); };
  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") submit(); };

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "80px clamp(20px,5vw,60px) 60px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Glow orbs */}
      <div style={{
        position: "absolute", top: "20%", left: "10%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(79,127,255,0.07) 0%, transparent 70%)",
        pointerEvents: "none", animation: "floatY 10s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "5%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(162,89,255,0.07) 0%, transparent 70%)",
        pointerEvents: "none", animation: "floatY 8s ease-in-out infinite reverse",
      }} />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 100,
          border: "1px solid rgba(79,127,255,0.3)",
          background: "rgba(79,127,255,0.08)",
          marginBottom: 28,
        }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "var(--accent)", display: "block",
          animation: "pulse 2s infinite",
        }} />
        <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 500, letterSpacing: "0.04em" }}>
          AI-Powered Website Intelligence
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        style={{
          fontFamily: "Syne,sans-serif", fontWeight: 800,
          fontSize: "clamp(38px,6.5vw,76px)",
          lineHeight: 1.07, textAlign: "center",
          letterSpacing: "-0.03em", maxWidth: 820, marginBottom: 20,
        }}
      >
        Analyze Any Website
        <span style={{
          display: "block",
          background: "linear-gradient(135deg, var(--accent), var(--accent2))",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "gradientShift 4s ease infinite",
        }}>in Seconds</span>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
        style={{
          fontSize: "clamp(15px,2vw,18px)", color: "var(--text2)",
          textAlign: "center", maxWidth: 540, lineHeight: 1.75, marginBottom: 44,
        }}
      >
        Deep AI analysis on UI/UX, performance, SEO, accessibility, security, and more — with specific, actionable recommendations.
      </motion.p>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        style={{ width: "100%", maxWidth: 620 }}
      >
        <div style={{
          display: "flex", gap: 8, padding: 6,
          background: "var(--bg2)",
          border: `1px solid ${focused ? "rgba(79,127,255,0.5)" : "var(--border)"}`,
          borderRadius: 18,
          boxShadow: focused
            ? "0 0 0 3px rgba(79,127,255,0.12), 0 0 60px rgba(79,127,255,0.1)"
            : "0 0 40px rgba(0,0,0,0.12)",
          transition: "border-color 0.2s, box-shadow 0.2s",
          flexWrap: "wrap",
        }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, minWidth: 200 }}>
            <span style={{ paddingLeft: 12, fontSize: 18 }}>🌐</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKey}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Enter website URL (e.g. stripe.com)"
              disabled={loading}
              style={{
                flex: 1, border: "none", background: "transparent",
                outline: "none", color: "var(--text)",
                fontSize: 15, fontFamily: "inherit", padding: "11px 0",
              }}
            />
          </div>
          <button
            onClick={submit}
            disabled={loading || !url.trim()}
            style={{
              padding: "12px 28px", borderRadius: 12, border: "none",
              cursor: loading || !url.trim() ? "not-allowed" : "pointer",
              background: loading || !url.trim()
                ? "var(--bg3)"
                : "linear-gradient(135deg, var(--accent), var(--accent2))",
              color: loading || !url.trim() ? "var(--text2)" : "#fff",
              fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 14,
              letterSpacing: "0.01em", whiteSpace: "nowrap",
              transition: "all 0.25s",
              boxShadow: loading || !url.trim()
                ? "none"
                : "0 4px 20px rgba(79,127,255,0.4)",
            }}
          >{loading ? "Analyzing…" : "Analyze Now →"}</button>
        </div>

        {/* Example links */}
        <div style={{
          display: "flex", gap: 8, marginTop: 14,
          flexWrap: "wrap", justifyContent: "center",
          alignItems: "center",
        }}>
          <span style={{ fontSize: 12, color: "var(--text2)" }}>Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => { setUrl(ex); onAnalyze(ex); }}
              disabled={loading}
              style={{
                fontSize: 12, color: "var(--accent)",
                background: "rgba(79,127,255,0.08)",
                border: "1px solid rgba(79,127,255,0.2)",
                borderRadius: 20, padding: "3px 12px",
                cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >{ex}</button>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42 }}
        style={{
          display: "flex", gap: "clamp(24px,5vw,60px)",
          marginTop: 64, flexWrap: "wrap", justifyContent: "center",
        }}
      >
        {[
          ["7", "Analysis Dimensions"],
          ["AI", "Powered Insights"],
          ["100", "Point Scoring"],
          ["PDF", "Export Ready"],
        ].map(([v, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 30, color: "var(--accent)" }}>{v}</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
