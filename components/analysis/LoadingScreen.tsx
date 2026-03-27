"use client";

import { motion } from "framer-motion";

const STEPS = [
  "Fetching website metadata…",
  "Analyzing UI/UX Design…",
  "Checking Performance metrics…",
  "Evaluating SEO factors…",
  "Testing Mobile Responsiveness…",
  "Auditing Accessibility…",
  "Reviewing Content Quality…",
  "Scanning Security headers…",
  "Generating AI recommendations…",
  "Compiling final report…",
];

interface Props {
  url: string;
  step: number;
}

export function LoadingScreen({ url, step }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        padding: "60px clamp(20px,5vw,60px)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 24,
        padding: "40px 48px",
        maxWidth: 480,
        width: "100%",
        boxShadow: "0 0 80px rgba(79,127,255,0.08)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            border: "3px solid transparent",
            borderTopColor: "var(--accent)",
            animation: "spin 0.8s linear infinite",
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18 }}>
              Analyzing Website
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 3 }}>
              {url}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {STEPS.map((s, i) => {
            const done = step > i + 1;
            const active = step === i + 1;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: done || active ? 1 : 0.3,
                  transition: "opacity 0.4s",
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  border: done
                    ? "2px solid var(--green)"
                    : active
                      ? "2px solid var(--accent)"
                      : "2px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? "rgba(34,211,160,0.12)" : "transparent",
                  transition: "all 0.3s",
                  animation: active ? "pulse 1.2s infinite" : "none",
                }}>
                  {done
                    ? <span style={{ fontSize: 10, color: "var(--green)" }}>✓</span>
                    : active
                      ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                      : null}
                </div>
                <span style={{
                  fontSize: 13,
                  color: done ? "var(--text)" : active ? "var(--accent)" : "var(--text2)",
                  fontWeight: active ? 500 : 400,
                  transition: "color 0.3s",
                }}>{s}</span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{
          marginTop: 28, height: 4, borderRadius: 2,
          background: "var(--bg3)", overflow: "hidden",
        }}>
          <motion.div
            animate={{ width: `${(step / STEPS.length) * 100}%` }}
            transition={{ ease: "easeOut", duration: 0.4 }}
            style={{
              height: "100%",
              borderRadius: 2,
              background: "linear-gradient(90deg, var(--accent), var(--accent2))",
            }}
          />
        </div>

        <div style={{
          marginTop: 10, fontSize: 11, color: "var(--text2)",
          textAlign: "right", fontVariantNumeric: "tabular-nums",
        }}>
          {Math.round((step / STEPS.length) * 100)}% complete
        </div>
      </div>
    </motion.section>
  );
}

export { STEPS };
