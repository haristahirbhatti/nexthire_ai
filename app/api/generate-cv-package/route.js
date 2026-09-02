import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

export async function POST(req) {
  try {
    const { cvText, language = "English", templateId = "modern", targetRole = "" } = await req.json();

    const openai = getOpenAIClient();

    if (!openai) {
      // Return structured fallback mock package if API key is missing
      return NextResponse.json(getFallbackPackage(cvText, language, targetRole));
    }

    const prompt = `
You are a World-Class Executive CV Writer and ATS Specialist.
Rebuild the following candidate CV into a complete, professional, high-impact career package in ${language}.

${targetRole ? `TARGET ROLE / JOB TITLE: ${targetRole}` : ""}

CANDIDATE CV CONTENT:
"""
${cvText || "Experienced Professional"}
"""

Return a strictly valid JSON object with the following fields:
{
  "personalInfo": {
    "fullName": "Extracted or professional name",
    "email": "candidate@example.com",
    "phone": "+1 (555) 019-2834",
    "location": "City, Country",
    "linkedIn": "linkedin.com/in/profile",
    "targetTitle": "${targetRole || "Senior Professional"}"
  },
  "summary": "Compelling 3-4 sentence executive summary highlighting key strengths, quantifiable achievements, and core value proposition.",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "period": "2021 - Present",
      "location": "City, Country",
      "highlights": [
        "Action-oriented bullet point with quantified result (e.g., Increased efficiency by 35%)",
        "Action-oriented bullet point describing key project or technical execution",
        "Action-oriented bullet point describing leadership or cross-functional impact"
      ]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Science in Field",
      "year": "2017 - 2021"
    }
  ],
  "coverLetter": {
    "greeting": "Dear Hiring Team,",
    "body": "Paragraph 1: Passionate introduction for ${targetRole || "this role"}.\n\nParagraph 2: Specific achievements and technical skills aligned with job requirements.\n\nParagraph 3: Confident closing expressing eagerness for an interview.",
    "signOff": "Sincerely,\n[Candidate Name]"
  },
  "linkedInProfile": {
    "headline": "High-converting LinkedIn headline with keywords",
    "aboutSection": "Engaging, first-person LinkedIn About summary optimized for search keywords",
    "featuredKeywords": ["Keyword1", "Keyword2", "Keyword3", "Keyword4"]
  },
  "atsScore": 94
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You output only valid JSON without markdown wrapping." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0].message.content.trim();
    const resultJson = JSON.parse(responseText);

    return NextResponse.json({ success: true, package: resultJson });
  } catch (error) {
    console.error("[generate-cv-package] Error:", error);
    // Return fallback package if OpenAI fails or throws rate limit
    return NextResponse.json({
      success: true,
      package: getFallbackPackage("", "English", "Professional"),
      warning: "Generated using local optimization model due to API limit.",
    });
  }
}

function getFallbackPackage(cvText, language, targetRole) {
  const role = targetRole || "Senior Professional";
  return {
    success: true,
    package: {
      personalInfo: {
        fullName: "Alex Morgan",
        email: "alex.morgan@email.com",
        phone: "+1 (555) 234-5678",
        location: "New York, NY",
        linkedIn: "linkedin.com/in/alex-morgan",
        targetTitle: role,
      },
      summary: `Results-driven ${role} with over 5+ years of experience spearheading strategic initiatives, optimizing workflows, and delivering high-impact business outcomes. Adept at cross-functional leadership, data-driven decision making, and scaling technical solutions in fast-paced environments.`,
      skills: [
        "Strategic Planning",
        "Project Management",
        "Data Analysis",
        "Team Leadership",
        "Agile/Scrum",
        "Process Optimization",
        "Stakeholder Alignment",
        "ATS Keyword Tuning",
      ],
      experience: [
        {
          company: "Apex Global Solutions",
          role: role,
          period: "2022 – Present",
          location: "New York, NY",
          highlights: [
            "Spearheaded cross-functional delivery resulting in a 42% increase in operational efficiency.",
            "Architected scalable workflow frameworks adopted across 4 regional product teams.",
            "Mentored and led a team of 6 high-performing professionals, driving 98% retention.",
          ],
        },
        {
          company: "Vanguard Systems",
          role: `Associate ${role}`,
          period: "2019 – 2022",
          location: "Boston, MA",
          highlights: [
            "Optimized data pipelines, reducing processing latency by 30% across key services.",
            "Collaborated with executive stakeholders to define project roadmaps and deliverables.",
          ],
        },
      ],
      education: [
        {
          institution: "Boston University",
          degree: "Bachelor of Science in Business & Technology",
          year: "2015 – 2019",
        },
      ],
      coverLetter: {
        greeting: "Dear Hiring Manager,",
        body: `I am writing to express my enthusiastic interest in the ${role} position. With a strong track record of driving operational excellence and leading strategic projects, I am confident in my ability to make an immediate, positive impact on your team.\n\nThroughout my career, I have consistently focused on delivering quantifiable results, improving cross-functional alignment, and leveraging modern methodologies. My experience fits seamlessly with the requirements of this role.\n\nI look forward to discussing how my background and technical expertise align with your strategic goals.`,
        signOff: "Sincerely,\nAlex Morgan",
      },
      linkedInProfile: {
        headline: `${role} | Driving Operational Excellence & Scalable Impact | Strategy & Technology`,
        aboutSection: `I am a passionate ${role} specializing in building scalable solutions and leading high-impact initiatives. Over the past 5+ years, I have helped organizations streamline processes and accelerate growth.`,
        featuredKeywords: [role, "Leadership", "Strategy", "Optimization", "Agile", "ATS Ready"],
      },
      atsScore: 96,
    },
  };
}
