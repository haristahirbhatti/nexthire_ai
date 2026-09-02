import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

/**
 * POST /api/generate-questions
 * Body: { cvText: string, jobTitle: string, language?: string }
 * Returns: { questions: Array<{ id, question, category, ideal }> }
 *
 * Calls GPT-4o to analyze the CV and generate 15 tailored questions:
 * - 10 based on the candidate's CV history
 * - 5 specific to the target job title
 */
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { cvText, jobTitle, language = "English" } = await request.json();

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json({ error: "CV text is too short or missing." }, { status: 400 });
    }

    if (!jobTitle || jobTitle.trim().length < 2) {
      return NextResponse.json({ error: "Job title is required." }, { status: 400 });
    }

    // Check if API key is configured — fall back to mock if not
    const openai = getOpenAIClient();
    if (!openai) {
      const mockQuestions = buildMockQuestions(jobTitle);
      return NextResponse.json({ questions: mockQuestions, mock: true });
    }

    const systemPrompt = `You are an expert professional interviewer. Your task is to analyze a candidate's CV and generate exactly 15 interview questions tailored specifically to them.

Rules:
- Generate 10 questions based directly on the candidate's CV (their experience, skills, projects, gaps, achievements)
- Generate 5 questions specific to the job title: "${jobTitle}"
- Each question must be thoughtful, specific, and not generic
- Questions should feel like a real professional interview
- Response language: ${language}
- Return ONLY valid JSON — no markdown, no explanation

Return this exact JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Your question here",
      "category": "cv" or "role",
      "ideal": "A concise ideal answer outline (2-3 sentences)"
    }
  ]
}`;

    const userPrompt = `Here is the candidate's CV:\n\n${cvText.slice(0, 6000)}\n\nTarget Job Title: ${jobTitle}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    const parsed = JSON.parse(raw);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid question format returned from GPT-4o.");
    }

    return NextResponse.json({ questions: parsed.questions });
  } catch (err) {
    console.error("[generate-questions] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate questions. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Fallback mock questions for development (no API key needed).
 */
function buildMockQuestions(jobTitle) {
  return [
    { id: "q1",  category: "cv",   question: "Walk me through your professional background and how it's shaped your career so far.", ideal: "Lead with the biggest outcome, then trace the path that led there." },
    { id: "q2",  category: "cv",   question: "What is the most complex project you've worked on, and what was your specific contribution?", ideal: "Explain scope, your role, technical decisions made, and measurable results." },
    { id: "q3",  category: "cv",   question: "Describe a time you had to learn a new skill or technology quickly. How did you approach it?", ideal: "Mention the resource, the timeline, and how you applied it in practice." },
    { id: "q4",  category: "cv",   question: "Tell me about a significant challenge you faced in a previous role and how you resolved it.", ideal: "Use STAR format: Situation, Task, Action, Result." },
    { id: "q5",  category: "cv",   question: "How have you handled working with cross-functional or remote teams?", ideal: "Highlight communication tools, async work, and conflict resolution." },
    { id: "q6",  category: "cv",   question: "Can you explain a decision you made that you later regretted, and what you learned from it?", ideal: "Be honest and reflective — show you learn from mistakes." },
    { id: "q7",  category: "cv",   question: "What metrics or KPIs did you own in your last role, and how did you perform against them?", ideal: "Use specific numbers and percentages." },
    { id: "q8",  category: "cv",   question: "Describe your experience mentoring others or being mentored.", ideal: "Show growth mindset and leadership awareness." },
    { id: "q9",  category: "cv",   question: "How do you prioritize tasks when multiple urgent deadlines collide?", ideal: "Describe a framework (Eisenhower matrix, MoSCoW) and a real example." },
    { id: "q10", category: "cv",   question: "What would your previous manager say is your biggest area for improvement?", ideal: "Be candid but follow with how you're actively addressing it." },
    { id: "q11", category: "role", question: `Why are you specifically interested in the ${jobTitle} role at this stage of your career?`, ideal: "Connect your past experience to what this role uniquely offers." },
    { id: "q12", category: "role", question: `What do you believe are the top 3 skills required to excel as a ${jobTitle}?`, ideal: "Name concrete skills and show evidence you possess them." },
    { id: "q13", category: "role", question: `How do you stay current with trends and developments relevant to ${jobTitle}?`, ideal: "Mention specific publications, communities, or courses." },
    { id: "q14", category: "role", question: `Where do you see the ${jobTitle} field heading in the next 3–5 years?`, ideal: "Show strategic thinking and awareness of industry trends." },
    { id: "q15", category: "role", question: `What would you accomplish in your first 90 days as a ${jobTitle}?`, ideal: "Show you've researched the role — quick wins, relationship building, deep dives." },
  ];
}
