"use client";

import { motion } from "framer-motion";
import { AnalysisReport } from "@/types";
import { CircularScore } from "./CircularScore";
import { ScoreBar } from "./ScoreBar";
import { SuggestionCard } from "./SuggestionCard";
import { scoreColor, scoreLabel } from "@/lib/utils";

interface Props {
  report: AnalysisReport;
  onReset: () => void;
  onExportPDF: () => void;
  onExportJSON: () => void;
  onShare: () => void;
  exporting: boolean;
}

export function ResultsDashboard({ report, onReset, onExportPDF, onExportJSON, onShare, exporting }: Props) {
  const color = scoreColor(report.overallScore);
  const circ = 2 * Math.PI * 66;
  const offset = circ - (report.overallScore / 100) * circ;

  return (
    <section style={{
      padding: "20px clamp(20px,5vw,60px) 80px",
      maxWidth: 1100,
      margin: "0 auto",
    }}>
      {/* ── Overall Score Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 28,
          padding: "40px 48px",
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          alignItems: "center",
          boxShadow: `0 0 80px ${color}12`,
        }}
      >
        {/* Big circle */}
        <div style={{ position: "relative", width: 156, height: 156, flexShrink: 0 }}>
          <svg width={156} height={156} viewBox="0 0 156 156" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="78" cy="78" r="66" fill="none" stroke="var(--border)" strokeWidth="8" />
            <motion.circle
              cx="78" cy="78" r="66"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 10px ${color}88)` }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 44, color, lineHeight: 1 }}>
              {report.overallScore}
            </span>
            <span style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500 }}>/100</span>
          </div>
        </div>

        {/* Right side */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "4px 14px", borderRadius: 100,
            background: `${color}18`, border: `1px solid ${color}44`,
            marginBottom: 12,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "block" }} />
            <span style={{ fontSize: 12, color, fontWeight: 600 }}>{scoreLabel(report.overallScore)}</span>
          </div>

          <h2 style={{
            fontFamily: "Syne,sans-serif",
            fontWeight: 800,
            fontSize: "clamp(22px,3vw,32px)",
            letterSpacing: "-0.02em",
            marginBottom: 10,
          }}>Overall Score</h2>

          <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.75, maxWidth: 500 }}>
            {report.verdict}
          </p>

          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 10 }}>
            🌐 <span style={{ color: "var(--accent)" }}>{report.url}</span>
            {report.analyzedAt && <span style={{ marginLeft: 12 }}>🕐 {report.analyzedAt}</span>}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <button onClick={onShare} style={btnStyle("ghost")}>🔗 Share</button>
            <button onClick={onExportJSON} style={btnStyle("ghost")}>⬇ JSON</button>
            <button onClick={onExportPDF} disabled={exporting} style={btnStyle("ghost")}>
              {exporting ? "Generating…" : "📄 PDF"}
            </button>
            <button onClick={onReset} style={btnStyle("primary")}>+ New Analysis</button>
          </div>
        </div>
      </motion.div>

      {/* ── Category Grid ── */}
      <Card title="Category Breakdown" delay={0.1}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(110px,1fr))",
          gap: "28px 16px",
        }}>
          {report.categories.map((cat, i) => (
            <CircularScore
              key={cat.id}
              score={cat.score}
              label={cat.label}
              icon={cat.icon}
              summary={cat.summary}
              delay={i * 80}
            />
          ))}
        </div>
      </Card>

      {/* ── Score Bars ── */}
      <Card title="Score Distribution" delay={0.15}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {report.categories.map((cat, i) => (
            <ScoreBar key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </Card>

      {/* ── Suggestions ── */}
      <Card
        title="AI Recommendations"
        badge={`${report.suggestions.length} suggestions`}
        delay={0.2}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))",
          gap: 14,
        }}>
          {report.suggestions.map((s, i) => (
            <SuggestionCard key={i} {...s} index={i} />
          ))}
        </div>
      </Card>
    </section>
  );
}

// ── Helpers ────────────────────────────────────────────────────────

function Card({
  title, badge, delay = 0, children,
}: {
  title: string; badge?: string; delay?: number; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 28,
        padding: "36px 40px",
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        {badge && (
          <span style={{
            fontSize: 12, color: "var(--text2)",
            background: "var(--bg3)",
            padding: "4px 12px", borderRadius: 20,
            border: "1px solid var(--border)",
          }}>{badge}</span>
        )}
      </div>
      {children}
    </motion.div>
  );
}

function btnStyle(variant: "primary" | "ghost"): React.CSSProperties {
  return variant === "primary" ? {
    padding: "9px 20px", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    color: "#fff", cursor: "pointer",
    fontFamily: "Syne,sans-serif", fontSize: 13, fontWeight: 700,
    letterSpacing: "0.01em", transition: "all 0.2s",
    boxShadow: "0 4px 16px rgba(79,127,255,0.35)",
  } : {
    padding: "9px 18px", borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--bg3)", color: "var(--text)",
    cursor: "pointer", fontFamily: "inherit",
    fontSize: 13, fontWeight: 500, transition: "all 0.2s",
  };
}
