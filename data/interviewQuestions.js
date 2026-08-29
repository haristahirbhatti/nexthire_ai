// Phase 1 mock generator: simulates what the real CV/job-title analysis
// endpoint will return in Phase 2. Deterministic-ish so demos feel stable.

const CV_QUESTION_BANK = [
  { q: "Walk me through your CV, starting with your most recent role.", a: "A concise 90-second walkthrough moving from current role backward, tying each stop to measurable outcomes and the throughline that explains why the next role makes sense." },
  { q: "You list three years at your last company — what's the achievement you're proudest of there?", a: "One specific, metric-backed win (e.g. \"cut onboarding time 40%\") described in Situation → Action → Result form, not a restated job duty." },
  { q: "Your CV shows a gap between roles — can you tell me about that period?", a: "A direct, non-defensive account of what happened and what was learned or built during the gap, then a bridge back to current readiness." },
  { q: "I see you moved from a technical role into a leadership one. What prompted that shift?", a: "A clear motivation (mentoring, systems thinking, wanting broader impact) paired with one concrete example of leadership already exercised before the formal title." },
  { q: "Which tools or systems on your CV have you used most recently, and how confident are you with them?", a: "An honest self-rating per tool, anchored to a recent project, avoiding blanket claims of expertise across everything listed." },
  { q: "Your CV mentions cross-functional collaboration — describe a time that collaboration was difficult.", a: "A specific conflict, the concrete step taken to resolve it, and the measurable outcome, told without blaming the other party." },
  { q: "What's a responsibility on your CV that you'd want to leave behind in your next role?", a: "A candid answer that reframes as growth-seeking rather than complaint, tied to what the candidate wants to do more of instead." },
  { q: "One of your bullet points mentions a project that shipped late — what happened?", a: "Ownership of the root cause, the specific corrective action taken, and what changed in the candidate's process afterward." },
  { q: "How did the scope of your role change over the time you were there?", a: "A before/after comparison showing expanding scope or responsibility, with one concrete marker of trust earned (budget, headcount, ownership)." },
  { q: "If I called your last manager right now, what would they say your biggest strength is?", a: "A specific, verifiable strength (not a soft-skill cliché) that the candidate can back with one recent example." },
];

const ROLE_QUESTION_BANK = (role) => [
  { q: `What do you think is the hardest part of succeeding as a ${role} in the first 90 days?`, a: "Naming a concrete, role-specific challenge (not a generic 'learning the ropes') and a realistic plan to address it early." },
  { q: `Which metric would you consider most important to track in a ${role} role, and why?`, a: "One well-chosen metric tied directly to the role's core output, explained in terms of what it reveals and what it doesn't." },
  { q: `Describe a project you'd tackle first if you were hired as ${role} tomorrow.`, a: "A realistic, scoped first project that shows understanding of the role's priorities rather than an oversized, unrealistic pitch." },
  { q: `What's a common mistake people make early in a ${role} position?`, a: "A specific, credible mistake (not a platitude) paired with how the candidate would avoid it, showing real domain awareness." },
  { q: `Why does this ${role} role interest you specifically, beyond the job title?`, a: "A reason grounded in the actual work of the role and the candidate's trajectory, not a generic statement about growth or passion." },
];

export function buildQuestionSet(jobTitle) {
  const role = jobTitle?.trim() || "this role";
  const cvQs = CV_QUESTION_BANK.map((item, i) => ({
    id: `cv-${i + 1}`,
    source: "cv",
    question: item.q,
    ideal: item.a,
  }));
  const roleQs = ROLE_QUESTION_BANK(role).map((item, i) => ({
    id: `role-${i + 1}`,
    source: "role",
    question: item.q,
    ideal: item.a,
  }));
  return [...cvQs, ...roleQs];
}
