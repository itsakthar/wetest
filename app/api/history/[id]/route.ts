/**
 * app/api/history/[id]/route.ts
 *
 * GET    /api/history/:id  → fetch single report
 * DELETE /api/history/:id  → delete single report
 */

import { NextRequest, NextResponse } from "next/server";
import { reportStore } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const report = reportStore.get(params.id);
  if (!report) {
    return NextResponse.json(
      { success: false, error: "Report not found." },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: report });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = reportStore.delete(params.id);
  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Report not found." },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, message: `Report ${params.id} deleted.` });
}
