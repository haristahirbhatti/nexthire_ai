import { NextResponse } from "next/server";

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

    if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) {
      try {
        // Standard pdf-parse import — works on both local & Vercel
        const pdfParse = require("pdf-parse");
        const data = await pdfParse(buffer);
        extractedText = data.text || "";
      } catch (pdfErr) {
        console.warn("[parse-cv] pdf-parse fallback:", pdfErr.message);
        // Clean raw buffer extraction fallback
        extractedText = buffer
          .toString("utf-8")
          .replace(/[^\x20-\x7E\n\r\t]/g, " ")
          .replace(/\s{3,}/g, "\n")
          .trim();
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
        { error: "Could not extract readable text from this file. Please upload a text-based PDF or .docx file." },
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
