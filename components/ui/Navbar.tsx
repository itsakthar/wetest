"use client";

interface Props {
  dark: boolean;
  onToggleDark: () => void;
  onShowHistory: () => void;
  onReset: () => void;
  hasResults: boolean;
}

export function Navbar({ dark, onToggleDark, onShowHistory, onReset, hasResults }: Props) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 clamp(20px,5vw,60px)", height: 60,
      background: dark ? "rgba(8,12,20,0.88)" : "rgba(244,246,251,0.88)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)",
      transition: "background 0.3s",
    }}>
      {/* Logo */}
      <div
        onClick={onReset}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: "linear-gradient(135deg, var(--accent), var(--accent2))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, boxShadow: "0 0 16px rgba(79,127,255,0.4)",
        }}>⚡</div>
        <span style={{
          fontFamily: "Syne,sans-serif",
          fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em",
          color: "var(--text)",
        }}>SiteIQ</span>
      </div>

      {/* Right controls */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={onShowHistory} style={{
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          color: "var(--text2)",
          padding: "6px 16px",
          cursor: "pointer",
          fontSize: 13,
          fontFamily: "inherit",
          transition: "all 0.2s",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span>📋</span> History
        </button>

        {hasResults && (
          <button onClick={onReset} style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: 10,
            color: "var(--text2)",
            padding: "6px 16px",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}>+ New</button>
        )}

        <button onClick={onToggleDark} style={{
          width: 38, height: 38, borderRadius: 10,
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          cursor: "pointer", fontSize: 16,
          transition: "all 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{dark ? "☀️" : "🌙"}</button>
      </div>
    </nav>
  );
}
