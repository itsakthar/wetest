"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { scoreColor, scoreLabel } from "@/lib/utils";

interface Props {
  score: number;
  label: string;
  icon: string;
  summary?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
}

const sizes = {
  sm: { svg: 80, r: 32, stroke: 4, font: 15, labelFont: 11 },
  md: { svg: 96, r: 38, stroke: 5, font: 18, labelFont: 12 },
  lg: { svg: 156, r: 66, stroke: 8, font: 42, labelFont: 14 },
};

export function CircularScore({ score, label, icon, summary, size = "md", delay = 0 }: Props) {
  const [displayed, setDisplayed] = useState(0);
  const { svg, r, stroke, font, labelFont } = sizes[size];
  const circ = 2 * Math.PI * r;
  const offset = circ - (displayed / 100) * circ;
  const color = scoreColor(score);

  useEffect(() => {
    const timer = setTimeout(() => {
      let val = 0;
      const step = () => {
        val = Math.min(val + 2, score);
        setDisplayed(val);
        if (val < score) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [score, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className="flex flex-col items-center gap-2"
    >
      <div style={{ position: "relative", width: svg, height: svg }}>
        <svg width={svg} height={svg} viewBox={`0 0 ${svg} ${svg}`} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={svg / 2} cy={svg / 2} r={r}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}
          />
          <circle
            cx={svg / 2} cy={svg / 2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.04s linear",
              filter: `drop-shadow(0 0 6px ${color}88)`,
            }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 1,
        }}>
          {size !== "lg" && <span style={{ fontSize: labelFont - 1 }}>{icon}</span>}
          <span style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: font,
            color,
            lineHeight: 1,
          }}>{displayed}</span>
          {size === "lg" && (
            <span style={{ fontSize: 11, color: "var(--text2)", fontWeight: 500 }}>/100</span>
          )}
        </div>
      </div>

      <span style={{
        fontSize: labelFont,
        fontWeight: 500,
        color: "var(--text2)",
        textAlign: "center",
        letterSpacing: "0.01em",
      }}>{label}</span>

      {summary && (
        <p style={{
          fontSize: 11,
          color: "var(--text2)",
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: 120,
        }}>{summary}</p>
      )}
    </motion.div>
  );
}
