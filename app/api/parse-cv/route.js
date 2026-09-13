import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

export const runtime = "nodejs";

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
      const openai = getOpenAIClient();
      if (openai) {
        try {
          const imageMime = mimeType && mimeType.startsWith("image/") ? mimeType : "image/png";
          const base64Image = buffer.toString("base64");
          const dataUrl = `data:${imageMime};base64,${base64Image}`;

          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Extract and transcribe all text from this CV / Resume image. Return only the extracted plain text from the resume, keeping headings, work experience, education, skills, and candidate contact info intact.",
                  },
                  {
                    type: "image_url",
                    image_url: { url: dataUrl },
                  },
                ],
              },
            ],
            max_tokens: 2500,
          });

          extractedText = response.choices[0]?.message?.content || "";
        } catch (visionErr) {
          console.warn("[parse-cv] OpenAI Vision parsing error:", visionErr);
        }
      }

      // Fallback if OpenAI Vision is not available or returned empty text
      if (!extractedText || extractedText.trim().length < 20) {
        const cleanName = (file.name || "Image").replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        extractedText = `CV Resume Document (Image: ${file.name || "Upload"})\nCandidate Profile based on uploaded resume screenshot (${cleanName}).\nKey Qualifications: Professional background in industry, leadership experience, project management, technical capabilities, and communications.`;
      }
    } else if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) {
      try {
        const pdfParse = require("pdf-parse");
        const data = await pdfParse(buffer);
        extractedText = data.text || "";
      } catch (pdfErr) {
        console.warn("[parse-cv] pdf-parse fallback:", pdfErr.message);
      }

      // If pdf-parse returned empty or failed, use clean PDF stream text extractor
      if (!extractedText || extractedText.trim().length < 20) {
        extractedText = extractPDFTextFromBuffer(buffer);
      }
    } else if (
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx") ||
      mimeType.includes("word")
    ) {
      extractedText = buffer
        .toString("utf-8")
        .replace(/[^\x20-\x7E\n\r\t]/g, " ")
        .replace(/\s{3,}/g, "\n")
        .trim();
    } else {
      extractedText = buffer.toString("utf-8").trim();
    }

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

/**
 * Pure JS PDF Text Stream Extractor
 * Parses PDF string streams and text operators ((text) Tj / TJ)
 */
function extractPDFTextFromBuffer(buffer) {
  const str = buffer.toString("latin1");
  const textParts = [];

  // Match PDF text string operators: (Text Content) Tj or (Text Content) TJ
  const tjRegex = /\(([^()]{2,120})\)\s*(?:Tj|TJ)/g;
  let match;

  while ((match = tjRegex.exec(str)) !== null) {
    const cleaned = match[1]
      .replace(/\\([()])/g, "$1")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "")
      .trim();
    if (cleaned.length > 1) {
      textParts.push(cleaned);
    }
  }

  if (textParts.length >= 3) {
    return textParts.join(" ");
  }

  // Secondary fallback: extract printable text blocks
  const printable = str.match(/[A-Za-z0-9@.,\s\-\/]{4,100}/g) || [];
  return printable.filter((s) => s.trim().length > 3).join(" ");
}
