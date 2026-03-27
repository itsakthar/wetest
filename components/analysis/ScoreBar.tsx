"use client";

import { motion } from "framer-motion";
import { Category } from "@/types";
import { scoreColor } from "@/lib/utils";

interface Props {
  category: Category;
  index: number;
}

export function ScoreBar({ category, index }: Props) {
  const color = scoreColor(category.score);
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      style={{ display: "flex", alignItems: "center", gap: 14 }}
    >
      <span style={{ width: 22, textAlign: "center", fontSize: 16 }}>{category.icon}</span>
      <span style={{
        width: 120, fontSize: 13, color: "var(--text2)",
        flexShrink: 0, letterSpacing: "0.01em",
      }}>{category.label}</span>

      <div style={{
        flex: 1, height: 7, borderRadius: 4,
        background: "var(--bg3)", overflow: "hidden",
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${category.score}%` }}
          transition={{ delay: 0.3 + index * 0.07, duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            height: "100%",
            borderRadius: 4,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            boxShadow: `0 0 8px ${color}55`,
          }}
        />
      </div>

      <span style={{
        width: 34, textAlign: "right",
        fontSize: 13,
        fontFamily: "Syne, sans-serif",
        fontWeight: 700,
        color,
      }}>{category.score}</span>
    </motion.div>
  );
}
