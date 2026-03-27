/**
 * app/api/analyze/route.ts
 *
 * POST /api/analyze
 * Body: { url: string }
 *
 * Calls Anthropic Claude, returns a full AnalysisReport,
 * and persists it in the in-memory store.
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeWebsite } from "@/lib/analyzer";
import { reportStore } from "@/lib/store";
import { AnalyzeRequest, AnalyzeResponse } from "@/types";

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    let u = url.trim();
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    new URL(u);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  // ── Parse body ────────────────────────────────────────────────────
  let body: AnalyzeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body — expected JSON with a `url` field." },
      { status: 400 }
    );
  }

  const { url } = body;

  // ── Validate ──────────────────────────────────────────────────────
  if (!url || typeof url !== "string" || !url.trim()) {
    return NextResponse.json(
      { success: false, error: "A `url` field is required." },
      { status: 400 }
    );
  }

  if (!isValidUrl(url)) {
    return NextResponse.json(
      { success: false, error: "Invalid URL format. Example: stripe.com or https://stripe.com" },
      { status: 400 }
    );
  }

  // ── API key check ─────────────────────────────────────────────────
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { success: false, error: "Server misconfiguration: ANTHROPIC_API_KEY is not set." },
      { status: 500 }
    );
  }

  // ── Run analysis ──────────────────────────────────────────────────
  try {
    const report = await analyzeWebsite(url);

    // Persist to store
    reportStore.save(report);

    return NextResponse.json({ success: true, data: report }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    console.error("[/api/analyze] Error:", message);

    // Distinguish API key errors from other errors
    if (message.toLowerCase().includes("api key") || message.toLowerCase().includes("authentication")) {
      return NextResponse.json(
        { success: false, error: "Invalid Anthropic API key. Check your .env.local file." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// Handle preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
