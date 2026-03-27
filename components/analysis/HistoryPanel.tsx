"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnalysisReport } from "@/types";
import { scoreColor, scoreLabel } from "@/lib/utils";

interface Props {
  onSelect: (report: AnalysisReport) => void;
  onClose: () => void;
}

export function HistoryPanel({ onSelect, onClose }: Props) {
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setReports(data.data ?? []);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    await fetch("/api/history", { method: "DELETE" });
    setReports([]);
  };

  const deleteOne = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch(`/api/history/${id}`, { method: "DELETE" });
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 24,
          padding: "32px",
          width: "100%",
          maxWidth: 640,
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 20 }}>
            Past Reports
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            {reports.length > 0 && (
              <button onClick={clearHistory} style={{
                padding: "7px 14px", borderRadius: 8,
                border: "1px solid rgba(240,90,110,0.3)",
                background: "rgba(240,90,110,0.08)", color: "var(--red)",
                cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 500,
              }}>Clear All</button>
            )}
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--bg3)",
              cursor: "pointer", fontSize: 16, color: "var(--text2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>×</button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text2)" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              border: "3px solid var(--border)", borderTopColor: "var(--accent)",
              animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
            }} />
            Loading history…
          </div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text2)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 15, fontWeight: 500 }}>No past reports yet</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>Analyze a website to see it here.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>
              {reports.length} report{reports.length !== 1 ? "s" : ""} stored in this session
            </p>
            <AnimatePresence>
              {reports.map((r, i) => {
                const color = scoreColor(r.overallScore);
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => { onSelect(r); onClose(); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                      background: "var(--bg3)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    whileHover={{ background: "var(--bg)", borderColor: "rgba(79,127,255,0.3)" }}
                  >
                    {/* Score badge */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: `${color}18`, border: `1px solid ${color}44`,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 16, color }}>{r.overallScore}</span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: "var(--text)",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>{r.url}</div>
                      <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 3 }}>
                        {r.analyzedAt} · <span style={{ color }}>{scoreLabel(r.overallScore)}</span>
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={(e) => deleteOne(r.id, e)}
                      style={{
                        width: 28, height: 28, borderRadius: 7,
                        border: "1px solid var(--border)", background: "transparent",
                        cursor: "pointer", fontSize: 13, color: "var(--text2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >×</button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
