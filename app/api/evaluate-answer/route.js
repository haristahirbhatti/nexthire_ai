import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

/**
 * POST /api/evaluate-answer
 * Body: { question: string, idealAnswer: string, candidateAnswer: string, jobTitle: string }
 * Returns: { score: number, feedback: string, ideal: string, passed: boolean }
 *
 * GPT-4o scores the candidate's answer out of 10 and provides feedback.
 */
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { question, idealAnswer, candidateAnswer, jobTitle } = await request.json();

    if (!candidateAnswer || candidateAnswer.trim().length < 5) {
      return NextResponse.json({
        score: 0,
        feedback: "No answer was provided.",
        ideal: idealAnswer || "",
        passed: false,
      });
    }

    // If no API key — do a simple length-based mock score for demo
    const openai = getOpenAIClient();
    if (!openai) {
      const mockScore = Math.min(10, Math.max(3, Math.round(candidateAnswer.trim().split(/\s+/).length / 10)));
      return NextResponse.json({
        score: mockScore,
        feedback: mockScore >= 6
          ? "Good answer — you covered the key points clearly."
          : "Your answer was a bit brief. Try to include specific examples and measurable outcomes.",
        ideal: idealAnswer || "",
        passed: mockScore >= 6,
        mock: true,
      });
    }

    const systemPrompt = `You are an expert interview coach evaluating a job candidate's answer.
    
Score the answer from 1–10 and give concise, constructive feedback.
Return ONLY valid JSON in this exact format:
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentences of specific, actionable feedback>",
  "passed": <true if score >= 6, false otherwise>
}`;

    const userPrompt = `Job Title: ${jobTitle}

Interview Question: ${question}

Ideal Answer Outline: ${idealAnswer}

Candidate's Answer: ${candidateAnswer}

Evaluate the candidate's answer.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    const parsed = JSON.parse(raw);

    return NextResponse.json({
      score: parsed.score ?? 5,
      feedback: parsed.feedback ?? "No feedback available.",
      ideal: idealAnswer || "",
      passed: parsed.passed ?? parsed.score >= 6,
    });
  } catch (err) {
    console.error("[evaluate-answer] Error:", err);
    return NextResponse.json(
      { error: "Failed to evaluate answer. Please try again." },
      { status: 500 }
    );
  }
}
