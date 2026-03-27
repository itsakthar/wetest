// ─── Core Types ────────────────────────────────────────────────────

export interface Category {
  id: string;
  label: string;
  icon: string;
  score: number;
  summary: string;
}

export interface Suggestion {
  icon: string;
  title: string;
  desc: string;
  priority: "High" | "Medium" | "Low";
}

export interface AnalysisReport {
  id: string;
  url: string;
  createdAt: string;
  overallScore: number;
  categories: Category[];
  suggestions: Suggestion[];
  verdict: string;
  analyzedAt?: string;
}

// ─── API Request / Response ─────────────────────────────────────────

export interface AnalyzeRequest {
  url: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisReport;
  error?: string;
}

export interface HistoryResponse {
  success: boolean;
  data: AnalysisReport[];
}

export interface ExportRequest {
  reportId: string;
  format: "json" | "pdf";
}

// ─── UI State ──────────────────────────────────────────────────────

export type AppState = "idle" | "loading" | "done" | "error" | "history";

export interface LoadStep {
  text: string;
  done: boolean;
  active: boolean;
}
