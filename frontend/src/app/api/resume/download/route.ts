import { NextRequest, NextResponse } from "next/server";
import { parseResumeMarkdown } from "@/lib/resume-markdown";
import { jsonError } from "@/server/http";
import { getResumeForSite } from "@/server/services/resume";

export async function GET(request: NextRequest) {
  try {
    const format = request.nextUrl.searchParams.get("format") || "txt";
    const resume = await getResumeForSite();
    return buildDownloadResponse(format, resume?.content || "");
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const format =
      body && (body.format === "txt" || body.format === "docx" || body.format === "pdf")
        ? body.format
        : "txt";
    const content = typeof body.content === "string" ? body.content : "";

    return buildDownloadResponse(format, content);
  } catch (e) {
    return jsonError(e);
  }
}

async function buildDownloadResponse(format: string, content: string) {
  if (!content.trim()) {
    return jsonError("Resume content is empty", 400);
  }

  if (format === "txt") {
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": 'attachment; filename="andre-deomondes-cv.txt"',
      },
    });
  }

  if (format === "docx") {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx");
    const blocks = parseResumeMarkdown(content);
    const children = blocks.flatMap((block) => {
      if (block.type === "h1") {
        return [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: block.text.toUpperCase(),
                bold: true,
                size: 28,
                font: "Times New Roman",
                color: "000000",
              }),
            ],
          }),
        ];
      }

      if (block.type === "h2") {
        return [
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 360, after: 120 },
            border: { bottom: { style: "single", size: 6, color: "000000", space: 4 } },
            children: [
              new TextRun({
                text: block.text.toUpperCase(),
                bold: true,
                size: 24,
                font: "Times New Roman",
                color: "000000",
              }),
            ],
          }),
        ];
      }

      if (block.type === "h3") {
        return [
          new Paragraph({
            spacing: { before: 160, after: 80 },
            children: [
              new TextRun({
                text: block.text,
                bold: true,
                size: 24,
                font: "Times New Roman",
                color: "000000",
              }),
            ],
          }),
        ];
      }

      if (block.type === "ul") {
        return block.items.map((item) =>
          new Paragraph({
            spacing: { before: 40, after: 40 },
            indent: { left: 440 },
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: item,
                size: 24,
                font: "Times New Roman",
                color: "000000",
              }),
            ],
          })
        );
      }

      return [
        new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: block.text.replace(/^> ?/, ""),
              size: 24,
              font: "Times New Roman",
              color: "000000",
            }),
          ],
        }),
      ];
    });

    const doc = new Document({
      title: "Andre Deomondes - Curriculo",
      description: "Curriculo de Andre Deomondes",
      creator: "Andre Deomondes",
      styles: {
        default: {
          document: {
            run: { font: "Times New Roman", size: 24, color: "000000" },
            paragraph: { spacing: { after: 80 } },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1418, bottom: 1134, left: 1701, right: 1134 },
            },
          },
          children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition":
          'attachment; filename="andre-deomondes-cv.docx"',
        "Cache-Control": "no-store",
      },
    });
  }

  if (format === "pdf") {
    const pdf = buildPdfFromResume(content);
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="andre-deomondes-cv.pdf"',
        "Cache-Control": "no-store",
      },
    });
  }

  return jsonError("Invalid format", 400);
}

function normalizePdfText(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/^> ?/, "")
    .replace(/[^\x20-\x7E]/g, " ");
}

function escapePdfText(text: string) {
  return normalizePdfText(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[•→]/g, "-");
}

function splitLine(text: string, maxLength: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [text];
}

function buildPdfFromResume(content: string) {
  const blocks = parseResumeMarkdown(content);
  const pageWidth = 595;
  const pageHeight = 842;
  const marginLeft = 55;
  const marginRight = 55;
  const marginTop = 55;
  const marginBottom = 50;
  const contentRight = pageWidth - marginRight;
  const bodySize = 9;
  const bodyLeading = 13.5;

  const pages: string[][] = [[]];
  let y = pageHeight - marginTop;
  let pageIndex = 0;

  function push(cmd: string) {
    pages[pageIndex].push(cmd);
  }

  function newPage() {
    pages.push([]);
    pageIndex++;
    y = pageHeight - marginTop;
  }

  function checkBreak(needed: number) {
    if (y - needed < marginBottom) newPage();
  }

  function renderText(text: string, x: number, yPos: number, font: "/F1" | "/F2", size: number) {
    push("BT");
    push(`${font} ${size} Tf`);
    push("0 g");
    push(`${x} ${yPos} Td`);
    push(`(${escapePdfText(text)}) Tj`);
    push("ET");
  }

  function drawRule(yPos: number) {
    push("0.75 G");
    push("0.5 w");
    push(`${marginLeft} ${yPos} m`);
    push(`${contentRight} ${yPos} l`);
    push("S");
  }

  function drawSectionHeader(label: string) {
    checkBreak(22);
    renderText(label.toUpperCase(), marginLeft, y, "/F2", 9.5);
    y -= 5;
    drawRule(y);
    y -= 10;
  }

  let isFirstBlock = true;

  for (const block of blocks) {
    if (block.type === "h1") {
      const lines = splitLine(block.text, 52);
      lines.forEach((line) => {
        checkBreak(24);
        renderText(line, marginLeft, y, "/F2", 18);
        y -= 24;
      });
      isFirstBlock = false;
      continue;
    }

    if (block.type === "h2") {
      y -= isFirstBlock ? 0 : 10;
      drawSectionHeader(block.text);
      isFirstBlock = false;
      continue;
    }

    if (block.type === "h3") {
      const lines = splitLine(block.text, 92);
      lines.forEach((line) => {
        checkBreak(bodyLeading);
        renderText(line, marginLeft, y, "/F2", bodySize);
        y -= bodyLeading;
      });
      isFirstBlock = false;
      continue;
    }

    if (block.type === "ul") {
      block.items.forEach((item) => {
        const itemLines = splitLine(item, 88);
        itemLines.forEach((line, i) => {
          checkBreak(bodyLeading);
          if (i === 0) {
            renderText("-", marginLeft + 3, y, "/F1", bodySize);
            renderText(line, marginLeft + 14, y, "/F1", bodySize);
          } else {
            renderText(line, marginLeft + 14, y, "/F1", bodySize);
          }
          y -= bodyLeading;
        });
      });
      isFirstBlock = false;
      continue;
    }

    // paragraph
    const text = normalizePdfText(block.text);
    if (!text.trim()) continue;

    const lines = splitLine(text, 92);
    lines.forEach((line) => {
      checkBreak(bodyLeading);
      renderText(line, marginLeft, y, "/F1", bodySize);
      y -= bodyLeading;
    });
    y -= 2;
    isFirstBlock = false;
  }

  const objects: string[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push(`<< /Type /Pages /Kids [${pages.map((_, i) => `${5 + i * 2} 0 R`).join(" ")}] /Count ${pages.length} >>`);
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  pages.forEach((commands, i) => {
    const contentObjectId = 6 + i * 2;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectId} 0 R >>`);
    const stream = commands.join("\n");
    objects.push(`<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`);
  });

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}
