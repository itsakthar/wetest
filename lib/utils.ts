/**
 * lib/utils.ts
 * Shared helpers used across components and API routes.
 */

export function scoreColor(score: number): string {
  if (score >= 80) return "var(--green)";
  if (score >= 50) return "var(--yellow)";
  return "var(--red)";
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 50) return "Needs Work";
  return "Poor";
}

/** Trigger a file download in the browser from a Blob/URL */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** Copy text to clipboard with fallback */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  }
}
