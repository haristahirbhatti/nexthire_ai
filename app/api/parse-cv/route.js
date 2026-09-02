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
      // Use pdfjs-dist — works reliably on Vercel (no broken internal paths)
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

      // Disable the worker (server-side, no worker needed)
      pdfjsLib.GlobalWorkerOptions.workerSrc = "";

      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
        disableFontFace: true,
      });

      const pdf = await loadingTask.promise;
      const textParts = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        textParts.push(pageText);
      }

      extractedText = textParts.join("\n").trim();
    } else if (
      mimeType === "application/msword" ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx")
    ) {
      // For Word docs — extract raw text as UTF-8 (strips binary noise; some text preserved)
      extractedText = buffer
        .toString("utf-8")
        .replace(/[^\x20-\x7E\n\r\t]/g, " ")  // strip non-printable chars
        .replace(/\s{3,}/g, "\n")              // collapse excessive whitespace
        .trim();
    } else {
      // Plain text / other formats
      extractedText = buffer.toString("utf-8").trim();
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json(
        {
          error:
            "Could not extract readable text from this file. Please upload a text-based PDF or a .docx Word document.",
        },
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
