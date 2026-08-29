"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Video,
  ChevronDown,
  Sparkles,
  Loader2,
  User,
  RotateCcw,
  Send,
} from "lucide-react";
import StepRail from "@/components/StepRail";
import UploadBox from "@/components/UploadBox";
import PaymentGateway from "@/components/PaymentGateway";
import { LANGUAGES } from "@/data/languages";
import { buildQuestionSet } from "@/data/interviewQuestions";
import { useAppState } from "@/lib/store";

const STEPS = ["Set up", "Analyze CV", "Payment", "Interview", "Report"];
const SESSION_SECONDS = 15 * 60;

export default function InterviewPage() {
  const router = useRouter();
  const { registerPayment } = useAppState();

  const [stepIndex, setStepIndex] = useState(0);
  const [language, setLanguage] = useState("English");
  const [avatar, setAvatar] = useState("female");

  const [cvFile, setCvFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [jobTitle, setJobTitle] = useState("");

  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [draft, setDraft] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const timerRef = useRef(null);

  // --- CV upload -> mock analysis ---
  const handleCvFile = (file) => {
    setCvFile(file);
    setAnalyzed(false);
    if (!file) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 1600);
  };

  const canConfirmSetup = analyzed && jobTitle.trim().length > 1;

  const confirmSetup = () => {
    setQuestions(buildQuestionSet(jobTitle));
    setStepIndex(2); // payment
  };

  const handlePaid = () => {
    registerPayment();
    setStepIndex(3);
  };

  const startInterview = () => {
    setQIndex(0);
    setAnswers({});
    setSecondsLeft(SESSION_SECONDS);
    setStepIndex(3.5); // live sub-state, still index 3 on rail
  };

  // Countdown while live
  const live = stepIndex === 3.5;
  useEffect(() => {
    if (!live) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          finishInterview();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  const finishInterview = () => {
    clearInterval(timerRef.current);
    setStepIndex(4);
  };

  const submitAnswer = () => {
    const q = questions[qIndex];
    setAnswers((prev) => ({ ...prev, [q.id]: draft }));
    setDraft("");
    if (qIndex + 1 >= questions.length) {
      finishInterview();
    } else {
      setQIndex((i) => i + 1);
    }
  };

  const startOver = () => {
    clearInterval(timerRef.current);
    setStepIndex(0);
    setCvFile(null);
    setAnalyzed(false);
    setJobTitle("");
    setQuestions([]);
    setAnswers({});
    setQIndex(0);
    router.push("/");
  };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const railIndex = Math.floor(stepIndex);

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-10 sm:px-8">
      <StepRail steps={STEPS} current={railIndex} />

      <div className="mt-10">
        {stepIndex === 0 && (
          <SetupStep
            language={language}
            setLanguage={setLanguage}
            onNext={() => setStepIndex(1)}
          />
        )}

        {stepIndex === 1 && (
          <AnalyzeStep
            cvFile={cvFile}
            onFile={handleCvFile}
            analyzing={analyzing}
            analyzed={analyzed}
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            canConfirm={canConfirmSetup}
            onConfirm={confirmSetup}
          />
        )}

        {stepIndex === 2 && (
          <div className="mx-auto max-w-md">
            <PaymentGateway
              amount="24.00"
              description="AI Mock Interview — 15-minute session"
              onPaid={handlePaid}
            />
          </div>
        )}

        {stepIndex === 3 && (
          <ReadyStep avatar={avatar} setAvatar={setAvatar} onStart={startInterview} />
        )}

        {live && (
          <LiveStep
            avatar={avatar}
            question={questions[qIndex]}
            index={qIndex}
            total={questions.length}
            draft={draft}
            setDraft={setDraft}
            onSubmit={submitAnswer}
            timeLabel={`${minutes}:${seconds}`}
          />
        )}

        {stepIndex === 4 && (
          <ReportStep questions={questions} answers={answers} onStartOver={startOver} />
        )}
      </div>
    </div>
  );
}

function SetupStep({ language, setLanguage, onNext }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-panel sm:p-9">
      <p className="font-mono text-xs uppercase tracking-wide text-ready-600">Step 1</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
        Enter the interview room
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
        Your session runs on a live video screen, just like Teams or Zoom.
        Choose the language you'd like your interviewer to speak.
      </p>

      <div className="mt-7 flex aspect-video w-full items-center justify-center rounded-xl border border-line bg-ink">
        <div className="flex flex-col items-center gap-2 text-paper/70">
          <Video className="h-9 w-9" />
          <span className="font-mono text-xs">Camera preview — connects when your interview starts</span>
        </div>
      </div>

      <div className="mt-6 max-w-xs">
        <label className="mb-1.5 block text-xs font-medium text-ink-soft">
          Interview language
        </label>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full appearance-none rounded-xl border border-line bg-paper-dim px-4 py-3 text-sm text-ink outline-none focus-visible:border-ready-500"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-ready-600"
      >
        Continue
      </button>
    </div>
  );
}

function AnalyzeStep({
  cvFile,
  onFile,
  analyzing,
  analyzed,
  jobTitle,
  setJobTitle,
  canConfirm,
  onConfirm,
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-panel sm:p-9">
      <p className="font-mono text-xs uppercase tracking-wide text-ready-600">Step 2</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
        Upload your CV
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
        The AI reads your CV and drafts ten questions from it, then five more
        once you name the role you're targeting.
      </p>

      <div className="mt-6">
        <UploadBox file={cvFile} onFile={onFile} />
      </div>

      {analyzing && (
        <div className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
          <Loader2 className="h-4 w-4 animate-spin text-ready-600" />
          Reading your CV and drafting ten questions…
        </div>
      )}

      {analyzed && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-ready-50 px-4 py-3 text-sm text-ready-700">
          <Sparkles className="h-4 w-4" />
          10 questions ready from your CV.
        </div>
      )}

      <div className="mt-7 max-w-sm">
        <label className="mb-1.5 block text-xs font-medium text-ink-soft">
          Target job title
        </label>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Senior Product Designer"
          disabled={!analyzed}
          className="w-full rounded-xl border border-line bg-paper-dim px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus-visible:border-ready-500 disabled:opacity-50"
        />
        {jobTitle.trim().length > 1 && (
          <p className="mt-2 text-xs text-ink-soft">
            + 5 role-specific questions for “{jobTitle}” added.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onConfirm}
        disabled={!canConfirm}
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-ready-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Confirm & continue to payment
      </button>
    </div>
  );
}

function ReadyStep({ avatar, setAvatar, onStart }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 text-center shadow-panel sm:p-9">
      <p className="font-mono text-xs uppercase tracking-wide text-ready-600">Step 4</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
        Choose your interviewer
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
        Payment confirmed. Pick an avatar and start whenever you're ready —
        the 15-minute clock starts on your first answer.
      </p>

      <div className="mt-7 flex justify-center gap-4">
        {["female", "male"].map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setAvatar(g)}
            className={`flex w-32 flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 transition ${
              avatar === g ? "border-ready-500 bg-ready-50" : "border-line hover:border-ink-soft"
            }`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
              <User className="h-6 w-6" />
            </span>
            <span className="text-sm capitalize text-ink">{g}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 rounded-full bg-ink px-7 py-3 text-sm font-medium text-paper transition hover:bg-ready-600"
      >
        Start interview
      </button>
    </div>
  );
}

function LiveStep({ avatar, question, index, total, draft, setDraft, onSubmit, timeLabel }) {
  if (!question) return null;
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-panel sm:p-9">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-paper-dim px-3 py-1 font-mono text-xs text-ink-soft">
          Question {index + 1} / {total}
        </span>
        <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs text-paper">
          {timeLabel} remaining
        </span>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-line bg-ink px-6 py-10 text-center">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-paper/10 text-paper">
          <User className="h-7 w-7" />
          <span className="absolute -bottom-1 -right-1 h-4 w-4 animate-tick rounded-full border-2 border-ink bg-ready-400" />
        </span>
        <p className="max-w-md text-balance font-display text-xl italic text-paper sm:text-2xl">
          “{question.question}”
        </p>
        <span className="font-mono text-[10px] uppercase tracking-wide text-paper/50">
          AI interviewer · {avatar}
        </span>
      </div>

      <div className="mt-6">
        <label className="mb-1.5 block text-xs font-medium text-ink-soft">Your answer</label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          placeholder="Speak naturally — type what you'd say out loud."
          className="w-full resize-none rounded-xl border border-line bg-paper-dim px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus-visible:border-ready-500"
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="mt-5 flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-ready-600"
      >
        <Send className="h-4 w-4" />
        {index + 1 >= total ? "Finish interview" : "Next question"}
      </button>
    </div>
  );
}

function ReportStep({ questions, answers, onStartOver }) {
  const scored = useMemo(
    () =>
      questions.map((q) => {
        const userAnswer = answers[q.id] || "";
        const correct = userAnswer.trim().length >= 20;
        return { ...q, userAnswer, correct };
      }),
    [questions, answers]
  );

  const correctCount = scored.filter((s) => s.correct).length;
  const pct = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div>
      <div className="rounded-2xl border border-line bg-white p-6 shadow-panel sm:p-9">
        <p className="font-mono text-xs uppercase tracking-wide text-ready-600">Report</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Interview complete
        </h1>

        <div className="mt-5 flex flex-wrap gap-3">
          <Stat label="Answered well" value={`${pct}%`} tone="ready" />
          <Stat label="Needs work" value={`${100 - pct}%`} tone="flag" />
          <Stat label="Questions" value={questions.length} tone="ink" />
        </div>

        <div className="mt-8 space-y-5">
          {scored.map((s, i) => (
            <div key={s.id} className="rounded-xl border border-line p-4 sm:p-5">
              <p className="text-sm font-medium text-ink">
                {i + 1}. {s.question}
              </p>
              <p className="mt-2 text-sm text-flag-500">
                <span className="font-mono text-xs text-ink-soft">You: </span>
                {s.userAnswer || "— no answer given —"}
              </p>
              <p className="mt-1 text-sm text-ready-600">
                <span className="font-mono text-xs text-ink-soft">Ideal: </span>
                {s.ideal}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onStartOver}
          className="mt-8 flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-ready-600"
        >
          <RotateCcw className="h-4 w-4" />
          Start over
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const toneMap = {
    ready: "text-ready-600 border-ready-100 bg-ready-50",
    flag: "text-flag-500 border-flag-400/20 bg-flag-400/5",
    ink: "text-ink border-line bg-paper-dim",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 ${toneMap[tone]}`}>
      <p className="font-mono text-xl font-semibold">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}
