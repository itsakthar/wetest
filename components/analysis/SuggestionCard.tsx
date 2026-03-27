"use client";

import { motion } from "framer-motion";
import { Suggestion } from "@/types";

interface Props extends Suggestion {
  index: number;
}

const priorityConfig = {
  High:   { color: "var(--red)",    bg: "rgba(240,90,110,0.1)",   border: "rgba(240,90,110,0.25)"   },
  Medium: { color: "var(--yellow)", bg: "rgba(245,200,66,0.1)",   border: "rgba(245,200,66,0.25)"   },
  Low:    { color: "var(--green)",  bg: "rgba(34,211,160,0.1)",   border: "rgba(34,211,160,0.25)"   },
};

export function SuggestionCard({ icon, title, desc, priority, index }: Props) {
  const cfg = priorityConfig[priority] ?? priorityConfig.Low;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      whileHover={{ y: -3, boxShadow: "0 12px 36px rgba(79,127,255,0.12)" }}
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "18px 20px",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        cursor: "default",
        transition: "border-color 0.2s",
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: "var(--bg3)",
        border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0,
      }}>{icon}</div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: "var(--text)",
          }}>{title}</span>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 9px",
            borderRadius: 20,
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>{priority}</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.65 }}>{desc}</p>
      </div>
    </motion.div>
  );
}
