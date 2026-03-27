/**
 * app/api/history/route.ts
 *
 * GET  /api/history          → return all past reports
 * DELETE /api/history        → clear all history
 */

import { NextRequest, NextResponse } from "next/server";
import { reportStore } from "@/lib/store";

export async function GET(_request: NextRequest) {
  const reports = reportStore.getAll();
  return NextResponse.json({
    success: true,
    count: reports.length,
    data: reports,
  });
}

export async function DELETE(_request: NextRequest) {
  const all = reportStore.getAll();
  for (const r of all) reportStore.delete(r.id);
  return NextResponse.json({ success: true, message: "History cleared." });
}
