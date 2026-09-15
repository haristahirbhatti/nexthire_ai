import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { buildQuestionSet } from "@/data/interviewQuestions";

/**
 * POST /api/generate-questions
 * Body: { cvText: string, jobTitle: string, language?: string }
 * Returns: { questions: Array<{ id, question, category, ideal }> }
 *
 * Calls GPT-4o to analyze the CV and generate 15 tailored questions:
 * - 10 based on the candidate's CV history
 * - 5 specific to the target job title
 *
 * ALL questions and ideal answers are generated in the selected language.
 * If OpenAI is unavailable or errors, seamlessly falls back to the localized
 * question bank (fully supporting Arabic, French, Spanish, German, English).
 */
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { cvText, jobTitle, language = "English" } = await request.json();

    if (!cvText || cvText.trim().length < 20) {
      return NextResponse.json({ error: "CV text is too short or missing." }, { status: 400 });
    }

    if (!jobTitle || jobTitle.trim().length < 2) {
      return NextResponse.json({ error: "Job title is required." }, { status: 400 });
    }

    const openai = getOpenAIClient();

    if (!openai) {
      // Localized fallback mock questions (supports Arabic, French, Spanish, etc.)
      const mockQuestions = buildQuestionSet(jobTitle, language);
      return NextResponse.json({ questions: mockQuestions, mock: true });
    }

    // ── OpenAI is available: generate questions in the selected language ──
    const isEnglish = language === "English";
    const isArabic = language === "Arabic" || language.toLowerCase().includes("arab");

    const languageDirective = isEnglish
      ? "- Write all questions and ideal answers in English."
      : `- CRITICAL LANGUAGE DIRECTIVE: Write ALL questions and ALL ideal answers 100% in ${language}.
- Do NOT output any English words, Latin characters, or untranslated jargon in questions.
${isArabic ? '- In Arabic, replace acronyms like "CV" with "السيرة الذاتية", never write "CV" in Latin letters.' : ''}
- The ideal answer outlines must also be fully in ${language}.
- Only proper nouns (company names, candidate name) may remain untranslated if essential.`;

    const systemPrompt = `You are an expert professional interviewer. Your task is to analyze a candidate's CV and generate exactly 15 interview questions tailored specifically to them.

Rules:
- Generate 10 questions based directly on the candidate's CV (their experience, skills, projects, gaps, achievements)
- Generate 5 questions specific to the job title: "${jobTitle}"
- Each question must be thoughtful, specific, and not generic
- Questions should feel like a real professional interview
${languageDirective}
- Return ONLY valid JSON — no markdown, no explanation

Return this exact JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Your question here in ${language}",
      "category": "cv" or "role",
      "ideal": "A concise ideal answer outline (2-3 sentences) in ${language}"
    }
  ]
}`;

    const userPrompt = `Here is the candidate's CV:\n\n${cvText.slice(0, 6000)}\n\nTarget Job Title: ${jobTitle}\n\nCRITICAL REQUIREMENT: Output EVERY question and ideal answer 100% in ${language}. Never use English words.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      });

      const raw = completion.choices[0]?.message?.content;
      const parsed = JSON.parse(raw);

      if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return NextResponse.json({ questions: parsed.questions });
      }
    } catch (apiErr) {
      console.warn("[generate-questions] OpenAI API call failed, falling back to localized questions:", apiErr);
      const fallbackQuestions = buildQuestionSet(jobTitle, language);
      return NextResponse.json({ questions: fallbackQuestions, mock: true });
    }

    // Fallback if parsing failed
    const fallbackQuestions = buildQuestionSet(jobTitle, language);
    return NextResponse.json({ questions: fallbackQuestions, mock: true });
  } catch (err) {
    console.error("[generate-questions] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate questions. Please try again." },
      { status: 500 }
    );
  }
}
