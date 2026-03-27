/**
 * lib/pdfExport.ts
 * Generates a professional PDF report from an AnalysisReport.
 * Uses jsPDF + jsPDF-AutoTable — runs on the server (API route).
 */

import { AnalysisReport } from "@/types";

function scoreColor(score: number): [number, number, number] {
  if (score >= 80) return [34, 211, 160];   // green
  if (score >= 50) return [245, 200, 66];   // yellow
  return [240, 90, 110];                     // red
}

export async function generatePDFReport(report: AnalysisReport): Promise<Buffer> {
  // Dynamic import to avoid SSR issues
  const { default: jsPDF } = await import("jspdf");
  // @ts-ignore — autoTable attaches to prototype
  await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const [r, g, b] = scoreColor(report.overallScore);

  // ── Header Bar ────────────────────────────────────────────────────
  doc.setFillColor(13, 18, 32);
  doc.rect(0, 0, W, 36, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("SiteIQ Analysis Report", 14, 16);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 140, 165);
  doc.text(report.url, 14, 24);
  doc.text(`Generated: ${report.analyzedAt ?? new Date().toLocaleString()}`, 14, 30);

  // ── Overall Score Box ─────────────────────────────────────────────
  doc.setFillColor(r, g, b);
  doc.roundedRect(W - 52, 4, 42, 28, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text(`${report.overallScore}`, W - 34, 21, { align: "center" });
  doc.setFontSize(9);
  doc.text("/100", W - 20, 27, { align: "right" });

  // ── Verdict ───────────────────────────────────────────────────────
  let y = 46;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(13, 18, 32);
  doc.text("Verdict", 14, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 80, 100);
  const verdictLines = doc.splitTextToSize(report.verdict, W - 28);
  doc.text(verdictLines, 14, y);
  y += verdictLines.length * 5 + 8;

  // ── Category Scores Table ─────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(13, 18, 32);
  doc.text("Category Breakdown", 14, y);
  y += 4;

  // @ts-ignore
  doc.autoTable({
    startY: y,
    head: [["#", "Category", "Score", "Rating", "Summary"]],
    body: report.categories.map((cat, i) => {
      const label =
        cat.score >= 80 ? "Excellent" : cat.score >= 50 ? "Needs Work" : "Poor";
      return [
        `${cat.icon}`,
        cat.label,
        `${cat.score}/100`,
        label,
        cat.summary,
      ];
    }),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: {
      fillColor: [13, 18, 32],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 32, fontStyle: "bold" },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 22, halign: "center" },
      4: { cellWidth: "auto" },
    },
    didDrawCell: (data: any) => {
      // Color the Score cell
      if (data.section === "body" && data.column.index === 2) {
        const score = parseInt(data.cell.text[0]);
        const [cr, cg, cb] = scoreColor(score);
        doc.setTextColor(cr, cg, cb);
        doc.setFont("helvetica", "bold");
        doc.text(
          data.cell.text[0],
          data.cell.x + data.cell.width / 2,
          data.cell.y + data.cell.height / 2 + 1,
          { align: "center" }
        );
        doc.setTextColor(0, 0, 0);
      }
    },
    margin: { left: 14, right: 14 },
  });

  // @ts-ignore
  y = (doc as any).lastAutoTable.finalY + 10;

  // ── Suggestions ───────────────────────────────────────────────────
  if (y > 230) { doc.addPage(); y = 20; }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(13, 18, 32);
  doc.text("AI Recommendations", 14, y);
  y += 4;

  const priorityColor = (p: string): [number, number, number] =>
    p === "High" ? [240, 90, 110] : p === "Medium" ? [245, 200, 66] : [34, 211, 160];

  // @ts-ignore
  doc.autoTable({
    startY: y,
    head: [["#", "Icon", "Recommendation", "Priority", "Details"]],
    body: report.suggestions.map((s, i) => [
      i + 1,
      s.icon,
      s.title,
      s.priority,
      s.desc,
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: {
      fillColor: [13, 18, 32],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 10, halign: "center" },
      2: { cellWidth: 40, fontStyle: "bold" },
      3: { cellWidth: 22, halign: "center" },
      4: { cellWidth: "auto" },
    },
    didDrawCell: (data: any) => {
      if (data.section === "body" && data.column.index === 3) {
        const priority = data.cell.text[0];
        const [pr, pg, pb] = priorityColor(priority);
        doc.setTextColor(pr, pg, pb);
        doc.setFont("helvetica", "bold");
        doc.text(
          priority,
          data.cell.x + data.cell.width / 2,
          data.cell.y + data.cell.height / 2 + 1,
          { align: "center" }
        );
        doc.setTextColor(0, 0, 0);
      }
    },
    margin: { left: 14, right: 14 },
  });

  // ── Footer ────────────────────────────────────────────────────────
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 160, 175);
    doc.text(
      `SiteIQ © ${new Date().getFullYear()} — Page ${i} of ${pageCount}`,
      W / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}
