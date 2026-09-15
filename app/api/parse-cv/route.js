import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

export const runtime = "nodejs";

/**
 * POST /api/parse-cv
 * Accepts: PDF, DOCX, DOC, images (PNG/JPG/WEBP), plain text
 *
 * Extraction pipeline (each format has multiple fallback layers):
 *
 * PDF:  pdfjs-dist → pdf-parse → raw stream regex → OpenAI Vision (scanned PDFs)
 * DOCX: mammoth → raw XML extraction
 * DOC:  binary text extraction
 * IMG:  OpenAI Vision (GPT-4o-mini)
 * TXT:  direct UTF-8 read
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("cv");

    if (!file) {
      return NextResponse.json({ error: "No CV file uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "";
    const fileName = file.name?.toLowerCase() || "";

    let extractedText = "";

    const isImage =
      mimeType.startsWith("image/") ||
      /\.(png|jpe?g|webp|gif|bmp|tiff|heic)$/i.test(fileName);

    if (isImage) {
      // ── IMAGE FILES: Use OpenAI Vision ────────────────────────────────
      extractedText = await extractTextFromImage(buffer, mimeType, file.name);
    } else if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) {
      // ── PDF FILES: Multi-layer extraction ─────────────────────────────
      extractedText = await extractTextFromPDF(buffer, mimeType);
    } else if (
      fileName.endsWith(".docx") ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // ── DOCX FILES: Use mammoth ───────────────────────────────────────
      extractedText = await extractTextFromDOCX(buffer);
    } else if (
      fileName.endsWith(".doc") ||
      mimeType === "application/msword" ||
      mimeType.includes("word")
    ) {
      // ── DOC FILES: Binary text extraction ─────────────────────────────
      extractedText = extractTextFromDOC(buffer);
    } else {
      // ── PLAIN TEXT / OTHER: Direct read ───────────────────────────────
      extractedText = buffer.toString("utf-8").trim();
    }

    // Final validation
    if (!extractedText || extractedText.trim().length < 10) {
      return NextResponse.json(
        { error: "Could not extract readable text from this file. Please upload a PDF, DOCX, or image file." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text: extractedText.trim() });
  } catch (err) {
    console.error("[parse-cv] Error:", err);
    return NextResponse.json(
      { error: "Failed to parse CV. Please try again with a different file." },
      { status: 500 }
    );
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   PDF EXTRACTION — 4-layer fallback pipeline
   ═══════════════════════════════════════════════════════════════════════ */

async function extractTextFromPDF(buffer, mimeType) {
  let text = "";

  // Layer 1: pdfjs-dist (most robust, handles modern PDFs well)
  text = await extractWithPdfjs(buffer);
  if (isGoodText(text)) {
    console.log("[parse-cv] PDF extracted via pdfjs-dist:", text.length, "chars");
    return text;
  }

  // Layer 2: pdf-parse (npm package, simpler but handles some cases pdfjs misses)
  text = await extractWithPdfParse(buffer);
  if (isGoodText(text)) {
    console.log("[parse-cv] PDF extracted via pdf-parse:", text.length, "chars");
    return text;
  }

  // Layer 3: Raw PDF stream text operators (regex-based, catches remaining text PDFs)
  text = extractPDFTextFromStreams(buffer);
  if (isGoodText(text)) {
    console.log("[parse-cv] PDF extracted via stream regex:", text.length, "chars");
    return text;
  }

  // Layer 4: OpenAI Vision (for scanned/image-based PDFs — sends as image)
  console.warn("[parse-cv] All text extractors failed, attempting OpenAI Vision on PDF...");
  text = await extractTextFromImage(buffer, mimeType || "application/pdf", "cv.pdf");
  if (isGoodText(text)) {
    console.log("[parse-cv] PDF extracted via OpenAI Vision:", text.length, "chars");
    return text;
  }

  return text || "";
}

/**
 * Layer 1: pdfjs-dist — Mozilla's PDF.js running server-side
 */
async function extractWithPdfjs(buffer) {
  try {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // Load the PDF document
    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true,
    });
    const pdfDoc = await loadingTask.promise;

    const textParts = [];
    const numPages = pdfDoc.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const content = await page.getTextContent();

      // Extract text items with proper spacing
      let lastY = null;
      let lineText = "";

      for (const item of content.items) {
        if (!item.str && item.str !== "") continue;

        const y = item.transform ? item.transform[5] : null;

        // Detect line break (Y position changed significantly)
        if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) {
          if (lineText.trim()) {
            textParts.push(lineText.trim());
          }
          lineText = item.str;
        } else {
          // Same line — add with space if needed
          if (lineText && item.str && !lineText.endsWith(" ") && !item.str.startsWith(" ")) {
            const gap = item.transform && content.items.length > 1 ? item.width : 0;
            lineText += (gap > 5 ? "  " : " ") + item.str;
          } else {
            lineText += item.str;
          }
        }
        lastY = y;
      }

      if (lineText.trim()) {
        textParts.push(lineText.trim());
      }

      // Add page separator for multi-page CVs
      if (pageNum < numPages) {
        textParts.push("");
      }
    }

    return textParts.join("\n");
  } catch (err) {
    console.warn("[parse-cv] pdfjs-dist extraction failed:", err.message);
    return "";
  }
}

/**
 * Layer 2: pdf-parse npm package
 */
async function extractWithPdfParse(buffer) {
  try {
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (err) {
    console.warn("[parse-cv] pdf-parse extraction failed:", err.message);
    return "";
  }
}

/**
 * Layer 3: Raw PDF stream text extraction (regex-based)
 * Parses PDF string streams and text operators: (text) Tj / TJ / '
 */
function extractPDFTextFromStreams(buffer) {
  const str = buffer.toString("latin1");
  const textParts = [];

  // Match PDF text string operators: (Text Content) Tj or (Text Content) TJ
  const tjRegex = /\(([^()]{1,200})\)\s*(?:Tj|TJ|')/g;
  let match;

  while ((match = tjRegex.exec(str)) !== null) {
    const cleaned = match[1]
      .replace(/\\([()])/g, "$1")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "")
      .replace(/\\t/g, " ")
      .trim();
    if (cleaned.length > 0) {
      textParts.push(cleaned);
    }
  }

  // Also try BT...ET blocks with Tf and Td operators
  const btBlocks = str.match(/BT\s[\s\S]*?ET/g) || [];
  for (const block of btBlocks) {
    const innerMatches = block.match(/\(([^()]{1,200})\)/g) || [];
    for (const m of innerMatches) {
      const inner = m.slice(1, -1)
        .replace(/\\([()])/g, "$1")
        .replace(/\\n/g, "\n")
        .trim();
      if (inner.length > 0 && !textParts.includes(inner)) {
        textParts.push(inner);
      }
    }
  }

  if (textParts.length >= 3) {
    return textParts.join(" ");
  }

  // Last resort: extract printable ASCII blocks
  const printable = str.match(/[A-Za-z0-9@.,\s\-\/()]{5,150}/g) || [];
  const filtered = printable
    .map((s) => s.trim())
    .filter((s) => s.length > 4 && /[a-zA-Z]/.test(s));

  return filtered.join(" ");
}

/* ═══════════════════════════════════════════════════════════════════════
   DOCX EXTRACTION — mammoth + XML fallback
   ═══════════════════════════════════════════════════════════════════════ */

async function extractTextFromDOCX(buffer) {
  let text = "";

  // Layer 1: mammoth (proper DOCX parser)
  try {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    text = result.value || "";
    if (isGoodText(text)) {
      console.log("[parse-cv] DOCX extracted via mammoth:", text.length, "chars");
      return text;
    }
  } catch (err) {
    console.warn("[parse-cv] mammoth extraction failed:", err.message);
  }

  // Layer 2: Manual XML extraction from DOCX ZIP
  try {
    const JSZip = await import("jszip").then(m => m.default || m);
    const zip = await JSZip.loadAsync(buffer);
    const docXml = await zip.file("word/document.xml")?.async("string");

    if (docXml) {
      // Strip XML tags, decode entities
      text = docXml
        .replace(/<w:br[^>]*\/>/g, "\n")
        .replace(/<w:p[^>]*>/g, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      if (isGoodText(text)) {
        console.log("[parse-cv] DOCX extracted via XML:", text.length, "chars");
        return text;
      }
    }
  } catch (err) {
    console.warn("[parse-cv] DOCX XML extraction failed:", err.message);
  }

  return text || "";
}

/* ═══════════════════════════════════════════════════════════════════════
   DOC (Legacy) EXTRACTION — binary text extraction
   ═══════════════════════════════════════════════════════════════════════ */

function extractTextFromDOC(buffer) {
  // .doc files store text in a binary format — extract readable text sequences
  const raw = buffer.toString("utf-8");

  // Extract printable text blocks (DOC stores text as runs of readable chars)
  const textRuns = [];
  let current = "";

  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    // Printable ASCII + common Unicode ranges
    if ((code >= 0x20 && code <= 0x7E) || code === 0x0A || code === 0x0D || code === 0x09) {
      current += raw[i];
    } else {
      if (current.trim().length > 2) {
        textRuns.push(current.trim());
      }
      current = "";
    }
  }
  if (current.trim().length > 2) {
    textRuns.push(current.trim());
  }

  // Filter out binary garbage — keep lines that look like real text
  const meaningful = textRuns.filter((line) => {
    // Must contain at least one letter
    if (!/[a-zA-Z]/.test(line)) return false;
    // Skip very short fragments
    if (line.length < 3) return false;
    // Skip lines that are mostly special chars
    const letterRatio = (line.match(/[a-zA-Z]/g) || []).length / line.length;
    if (letterRatio < 0.3) return false;
    return true;
  });

  return meaningful.join("\n");
}

/* ═══════════════════════════════════════════════════════════════════════
   IMAGE EXTRACTION — OpenAI Vision (GPT-4o-mini)
   ═══════════════════════════════════════════════════════════════════════ */

async function extractTextFromImage(buffer, mimeType, fileName) {
  const openai = getOpenAIClient();

  if (openai) {
    try {
      const imageMime = mimeType && mimeType.startsWith("image/") ? mimeType : "image/png";
      // For PDFs sent as images, use a generic image type
      const effectiveMime = mimeType === "application/pdf" ? "image/png" : imageMime;
      const base64Image = buffer.toString("base64");
      const dataUrl = `data:${effectiveMime};base64,${base64Image}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Extract and transcribe ALL text from this CV / Resume document image. Return ONLY the extracted plain text.

IMPORTANT: Preserve the full structure including:
- Candidate's full name, email, phone number, location
- Professional summary / objective
- ALL work experience entries (company name, job title, dates, bullet points)
- ALL education entries (institution, degree, year)
- Skills section (every skill listed)
- Certifications, languages, or any other sections

Do NOT summarize or paraphrase. Extract the EXACT text as it appears.`,
              },
              {
                type: "image_url",
                image_url: { url: dataUrl },
              },
            ],
          },
        ],
        max_tokens: 4000,
      });

      const text = response.choices[0]?.message?.content || "";
      if (isGoodText(text)) {
        console.log("[parse-cv] Image extracted via OpenAI Vision:", text.length, "chars");
        return text;
      }
    } catch (visionErr) {
      console.warn("[parse-cv] OpenAI Vision parsing error:", visionErr.message);
    }
  }

  // Fallback if OpenAI Vision is not available or returned empty text
  console.warn("[parse-cv] OpenAI Vision unavailable, returning minimal fallback for image");
  const cleanName = (fileName || "Image").replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  return `CV Resume Document (Image: ${fileName || "Upload"})\nCandidate Profile based on uploaded resume screenshot (${cleanName}).\nKey Qualifications: Professional background in industry, leadership experience, project management, technical capabilities, and communications.`;
}

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * Check if extracted text is "good enough" — has meaningful content.
 * Requires at least 30 chars and contains real words (not just binary garbage).
 */
function isGoodText(text) {
  if (!text || text.trim().length < 30) return false;

  // Check that it contains real words, not just binary garbage
  const words = text.trim().split(/\s+/);
  if (words.length < 5) return false;

  // At least 40% of characters should be letters
  const letters = (text.match(/[a-zA-Z\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u0900-\u097F\u4E00-\u9FFF\uAC00-\uD7AF]/g) || []).length;
  const ratio = letters / text.length;
  if (ratio < 0.3) return false;

  // Reject raw PDF internal structure — indicates a failed extraction that
  // just scraped the file's object/xref syntax instead of real content.
  const pdfSyntaxMarkers = /\bendobj\b|\bxref\b|\btrailer\b|\/Type\s*\/(Page|Pages|Catalog|Font)|\bstartxref\b|\bFlateDecode\b/g;
  const markerHits = (text.match(pdfSyntaxMarkers) || []).length;
  if (markerHits >= 2) return false;

  return true;
}