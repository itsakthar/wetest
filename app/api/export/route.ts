/**
 * app/api/export/route.ts
 *
 * POST /api/export
 * Body: { reportId: string, format: "pdf" | "json" }
 *
 * Returns the report as a downloadable PDF or JSON file.
 */

import { NextRequest, NextResponse } from "next/server";
import { reportStore } from "@/lib/store";
import { generatePDFReport } from "@/lib/pdfExport";
import { ExportRequest } from "@/types";

export async function POST(request: NextRequest) {
  let body: ExportRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const { reportId, format } = body;

  if (!reportId || !format) {
    return NextResponse.json(
      { success: false, error: "`reportId` and `format` are required." },
      { status: 400 }
    );
  }

  const report = reportStore.get(reportId);
  if (!report) {
    return NextResponse.json(
      { success: false, error: "Report not found. It may have expired." },
      { status: 404 }
    );
  }

  // ── JSON export ───────────────────────────────────────────────────
  if (format === "json") {
    const json = JSON.stringify(report, null, 2);
    return new NextResponse(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="siteiq-${report.id}.json"`,
      },
    });
  }

  // ── PDF export ────────────────────────────────────────────────────
  if (format === "pdf") {
    try {
      const pdfBuffer = await generatePDFReport(report);
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="siteiq-report-${report.id}.pdf"`,
          "Content-Length": pdfBuffer.length.toString(),
        },
      });
    } catch (err) {
      console.error("[/api/export] PDF generation error:", err);
      return NextResponse.json(
        { success: false, error: "Failed to generate PDF. Please try again." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { success: false, error: "Invalid format. Use `pdf` or `json`." },
    { status: 400 }
  );
}
