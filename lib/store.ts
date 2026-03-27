/**
 * lib/store.ts
 * Simple in-memory store for analysis history.
 * In production, swap this for PostgreSQL / Supabase / MongoDB.
 *
 * Uses a module-level Map so data persists between API calls
 * in the same Node.js process (i.e. across requests in dev & prod).
 */

import { AnalysisReport } from "@/types";

// Global singleton (survives hot-reloads in dev via globalThis trick)
const globalStore = globalThis as typeof globalThis & {
  __siteiq_store?: Map<string, AnalysisReport>;
};

if (!globalStore.__siteiq_store) {
  globalStore.__siteiq_store = new Map<string, AnalysisReport>();
}

const store = globalStore.__siteiq_store;

export const reportStore = {
  /** Save a report */
  save(report: AnalysisReport): void {
    store.set(report.id, report);
    // Keep only last 50 reports
    if (store.size > 50) {
      const oldest = [...store.keys()][0];
      store.delete(oldest);
    }
  },

  /** Get a single report by ID */
  get(id: string): AnalysisReport | undefined {
    return store.get(id);
  },

  /** Get all reports sorted by date desc */
  getAll(): AnalysisReport[] {
    return [...store.values()].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /** Delete a report */
  delete(id: string): boolean {
    return store.delete(id);
  },

  /** Count of stored reports */
  count(): number {
    return store.size;
  },
};
