"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Navbar } from "@/components/ui/Navbar";
import { HeroSection } from "@/components/ui/HeroSection";
import { LoadingScreen, STEPS } from "@/components/analysis/LoadingScreen";
import { ResultsDashboard } from "@/components/analysis/ResultsDashboard";
import { HistoryPanel } from "@/components/analysis/HistoryPanel";

import { AnalysisReport, AppState } from "@/types";
import { triggerDownload, copyToClipboard } from "@/lib/utils";

export default function Home() {
  const [dark, setDark] = useState(true);
  const [appState, setAppState] = useState<AppState>("idle");
  const [loadStep, setLoadStep] = useState(0);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState("");
  const [exporting, setExporting] = useState(false);
  const [analyzingUrl, setAnalyzingUrl] = useState("");

  const resultsRef = useRef<HTMLDivElement>(null);

  // Apply dark/light class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ── Animate loading steps client-side while API call is in-flight ──
  const runLoadSteps = async (): Promise<void> => {
    for (let i = 0; i < STEPS.length; i++) {
      await new Promise<void>((r) => setTimeout(r, 550 + Math.random() * 350));
      setLoadStep(i + 1);
    }
  };

  // ── Main analyze handler ───────────────────────────────────────────
  const analyze = async (url: string) => {
    setAppState("loading");
    setLoadStep(0);
    setReport(null);
    setErrorMsg("");
    setAnalyzingUrl(url);

    // Run the step animation in parallel with the API call
    const stepsPromise = runLoadSteps();

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      // Wait for steps to finish (so animation isn't cut short)
      await stepsPromise;

      if (!data.success || !data.data) {
        setErrorMsg(data.error ?? "Analysis failed. Please try again.");
        setAppState("error");
        return;
      }

      setReport(data.data);
      setAppState("done");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 120);
    } catch (err) {
      await stepsPromise;
      setErrorMsg("Network error. Make sure the dev server is running and your API key is set.");
      setAppState("error");
    }
  };

  // ── Export handlers ────────────────────────────────────────────────
  const exportPDF = async () => {
    if (!report) return;
    setExporting(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: report.id, format: "pdf" }),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      triggerDownload(blob, `siteiq-report-${report.id}.pdf`);
      showToast("✅ PDF downloaded!");
    } catch {
      showToast("❌ PDF export failed. Try again.");
    } finally {
      setExporting(false);
    }
  };

  const exportJSON = async () => {
    if (!report) return;
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: report.id, format: "json" }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      triggerDownload(blob, `siteiq-${report.id}.json`);
      showToast("✅ JSON downloaded!");
    } catch {
      showToast("❌ JSON export failed.");
    }
  };

  const shareReport = async () => {
    if (!report) return;
    const shareUrl = `${window.location.origin}?report=${report.id}`;
    await copyToClipboard(shareUrl);
    showToast("🔗 Share link copied to clipboard!");
  };

  const reset = () => {
    setAppState("idle");
    setReport(null);
    setLoadStep(0);
    setErrorMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", transition: "background 0.3s" }}>
      {/* Nav */}
      <Navbar
        dark={dark}
        onToggleDark={() => setDark(!dark)}
        onShowHistory={() => setShowHistory(true)}
        onReset={reset}
        hasResults={appState === "done"}
      />

      {/* Hero — always visible */}
      <AnimatePresence>
        {appState === "idle" && (
          <motion.div key="hero" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HeroSection onAnalyze={analyze} loading={false} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      <AnimatePresence>
        {appState === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingScreen url={analyzingUrl} step={loadStep} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {appState === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", padding: "80px 20px 40px" }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 10 }}>
              Analysis Failed
            </h2>
            <p style={{ color: "var(--text2)", maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.7 }}>
              {errorMsg}
            </p>
            <button onClick={reset} className="btn-primary">← Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {appState === "done" && report && (
          <motion.div
            key="results"
            ref={resultsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ paddingTop: 72 }}
          >
            <ResultsDashboard
              report={report}
              onReset={reset}
              onExportPDF={exportPDF}
              onExportJSON={exportJSON}
              onShare={shareReport}
              exporting={exporting}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {appState === "idle" && (
        <footer style={{
          textAlign: "center", padding: "32px 20px",
          color: "var(--text2)", fontSize: 12,
          borderTop: "1px solid var(--border)",
        }}>
          SiteIQ — AI-Powered Website Intelligence · Built with Next.js + Claude AI · {new Date().getFullYear()}
        </footer>
      )}

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <HistoryPanel
            onSelect={(r) => { setReport(r); setAppState("done"); }}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            className="toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
