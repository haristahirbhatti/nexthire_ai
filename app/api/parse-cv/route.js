import { NextResponse } from "next/server";

/**
 * POST /api/parse-cv
 * Accepts a multipart form with a "cv" file (PDF or plain text).
 * Returns: { text: string } — raw extracted text from the CV.
 *
 * Note: pdf-parse only runs on the server (Node.js runtime).
 */
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

    let extractedText = "";

    if (mimeType === "application/pdf" || file.name?.endsWith(".pdf")) {
      // Dynamically import pdf-parse (avoids build-time issues)
      const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else {
      // Plain text / doc fallback — read as UTF-8
      extractedText = buffer.toString("utf-8");
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json(
        { error: "Could not extract readable text from the CV. Please upload a text-based PDF." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text: extractedText.trim() });
  } catch (err) {
    console.error("[parse-cv] Error:", err);
    return NextResponse.json(
      { error: "Failed to parse CV. Please try again." },
      { status: 500 }
    );
  }
}
