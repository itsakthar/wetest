/**
 * lib/analyzer.ts
 * Calls Anthropic API and returns a structured AnalysisReport.
 */

import Anthropic from "@anthropic-ai/sdk";
import { v4 as uuidv4 } from "uuid";
import { AnalysisReport } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert web analyst with deep knowledge of UI/UX design, 
web performance, SEO, accessibility standards (WCAG 2.1), mobile-first development, 
content strategy, and web security. Your analysis is precise, realistic, and actionable.
Always respond ONLY with valid JSON — no markdown fences, no explanatory text before or after.`;

function buildPrompt(url: string): string {
  return `Analyze the website at "${url}".

Based on your knowledge of this website (or reasonable inference from the domain/brand), 
return a JSON object with EXACTLY this structure:

{
  "overallScore": <integer 0-100>,
  "categories": [
    { "id": "uiux",          "label": "UI/UX Design",      "icon": "🎨", "score": <0-100>, "summary": "<one specific sentence about this site's UI/UX>" },
    { "id": "performance",   "label": "Performance",        "icon": "⚡", "score": <0-100>, "summary": "<one specific sentence about load speed / Core Web Vitals>" },
    { "id": "seo",           "label": "SEO",                "icon": "🔍", "score": <0-100>, "summary": "<one specific sentence about SEO>" },
    { "id": "mobile",        "label": "Mobile",             "icon": "📱", "score": <0-100>, "summary": "<one specific sentence about mobile experience>" },
    { "id": "accessibility", "label": "Accessibility",      "icon": "♿", "score": <0-100>, "summary": "<one specific sentence about a11y>" },
    { "id": "content",       "label": "Content Quality",    "icon": "📝", "score": <0-100>, "summary": "<one specific sentence about content>" },
    { "id": "security",      "label": "Security",           "icon": "🔒", "score": <0-100>, "summary": "<one specific sentence about HTTPS/headers/security>" }
  ],
  "suggestions": [
    { "icon": "<relevant emoji>", "title": "<short actionable title>", "desc": "<2 sentence specific recommendation>", "priority": "High" },
    { "icon": "<relevant emoji>", "title": "<short actionable title>", "desc": "<2 sentence specific recommendation>", "priority": "High" },
    { "icon": "<relevant emoji>", "title": "<short actionable title>", "desc": "<2 sentence specific recommendation>", "priority": "Medium" },
    { "icon": "<relevant emoji>", "title": "<short actionable title>", "desc": "<2 sentence specific recommendation>", "priority": "Medium" },
    { "icon": "<relevant emoji>", "title": "<short actionable title>", "desc": "<2 sentence specific recommendation>", "priority": "Low" },
    { "icon": "<relevant emoji>", "title": "<short actionable title>", "desc": "<2 sentence specific recommendation>", "priority": "Low" }
  ],
  "verdict": "<2-3 sentence balanced overall verdict that is specific to this website>"
}

Rules:
- Be realistic: well-known sites (Google, Apple, Stripe) score higher; unknown/simple sites score lower
- overallScore should be a weighted average of category scores
- Suggestions must be specific to this site, not generic
- Return ONLY the JSON object`;
}

export async function analyzeWebsite(url: string): Promise<AnalysisReport> {
  // Normalize URL
  let cleanUrl = url.trim();
  if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = "https://" + cleanUrl;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildPrompt(cleanUrl) }],
  });

  const raw = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("")
    .trim();

  // Strip any accidental markdown fences
  const clean = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();

  let parsed: Omit<AnalysisReport, "id" | "url" | "createdAt">;
  try {
    parsed = JSON.parse(clean);
  } catch {
    throw new Error("AI returned invalid JSON. Please try again.");
  }

  const report: AnalysisReport = {
    id: uuidv4(),
    url: cleanUrl,
    createdAt: new Date().toISOString(),
    analyzedAt: new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    ...parsed,
  };

  return report;
}
