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
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import StepRail from "@/components/StepRail";
import UploadBox from "@/components/UploadBox";
import PaymentGateway from "@/components/PaymentGateway";
import { LANGUAGES } from "@/data/languages";
import { parseCVFile, generateInterviewQuestions } from "@/lib/parsePDF";
import { useAppState } from "@/lib/store";
import CameraView from "@/components/CameraView";
import { speak, stopSpeaking } from "@/lib/speechUtils";

const STEPS = ["Setup", "Payment", "Interview", "Report"];
const SESSION_SECONDS = 15 * 60;

export default function InterviewPage() {
  const router = useRouter();
  const { registerPayment } = useAppState();

  const [stepIndex, setStepIndex] = useState(0);
  const [language, setLanguage] = useState("English");
  const [avatar, setAvatar] = useState("female");

  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [draft, setDraft] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const timerRef = useRef(null);

  // Parse CV
  const handleCvFile = async (file) => {
    setCvFile(file);
    setAnalyzed(false);
    setCvText("");
    setAnalyzeError("");
    if (!file) return;

    setAnalyzing(true);
    try {
      const text = await parseCVFile(file);
      setCvText(text);
      setAnalyzed(true);
    } catch (err) {
      setAnalyzeError(err.message || "Could not read your CV. Please try a different file.");
    } finally {
      setAnalyzing(false);
    }
  };

  const canConfirmSetup = analyzed && jobTitle.trim().length > 1;

  // Generate questions
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  const confirmSetup = async () => {
    setGenerating(true);
    setGenerateError("");
    try {
      const qs = await generateInterviewQuestions(cvText, jobTitle, language);
      setQuestions(qs);
      setStepIndex(1); // proceed to payment (Step 2 on rail)
    } catch (err) {
      setGenerateError(err.message || "Failed to generate questions. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handlePaid = () => {
    registerPayment();
    setStepIndex(2); // proceed to interview room setup
  };

  const startInterview = () => {
    setQIndex(0);
    setAnswers({});
    setSecondsLeft(SESSION_SECONDS);
    setStepIndex(2.5); // live sub-state
  };

  const live = stepIndex === 2.5;
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
  }, [live]);

  // TTS for question
  useEffect(() => {
    if (live && questions[qIndex]) {
      stopSpeaking();
      speak(questions[qIndex].question, {
        gender: avatar,
        lang: language === "French" ? "fr-FR" :
              language === "Spanish" ? "es-ES" :
              language === "German" ? "de-DE" :
              language === "Italian" ? "it-IT" :
              language === "Japanese" ? "ja-JP" :
              language === "Korean" ? "ko-KR" :
              language === "Portuguese" ? "pt-PT" :
              language === "Russian" ? "ru-RU" :
              language === "Mandarin Chinese" ? "zh-CN" :
              "en-US"
      }).catch((err) => {
        console.error("Speech Synthesis failed:", err);
      });
    }

    return () => {
      stopSpeaking();
    };
  }, [live, qIndex, questions, language, avatar]);

  const finishInterview = () => {
    clearInterval(timerRef.current);
    setStepIndex(3); // Report
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
    <div className="min-h-screen bg-canvas pb-24 pt-10">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <StepRail steps={STEPS} current={railIndex} />

        {/* Heading Header */}
        <div className="mt-8 text-center sm:mt-12">
          <h1 className="font-display text-4xl font-semibold text-text-primary sm:text-5xl">
            AI Mock Interview
          </h1>
          <p className="mt-3 text-sm text-text-secondary sm:text-base">
            A 15-minute session with an AI avatar interviewer, tailored to your CV and target role.
          </p>
        </div>

        <div className="mt-10">
          {stepIndex === 0 && (
            <SetupStep
              language={language}
              setLanguage={setLanguage}
              cvFile={cvFile}
              onFile={handleCvFile}
              analyzing={analyzing}
              analyzed={analyzed}
              analyzeError={analyzeError}
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
              avatar={avatar}
              setAvatar={setAvatar}
              canConfirm={canConfirmSetup}
              onConfirm={confirmSetup}
              generating={generating}
              generateError={generateError}
            />
          )}

          {stepIndex === 1 && (
            <div className="mx-auto max-w-md">
              <PaymentGateway
                amount="24.00"
                description="AI Mock Interview — 15-minute session"
                onPaid={handlePaid}
              />
            </div>
          )}

          {stepIndex === 2 && (
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

          {stepIndex === 3 && (
            <ReportStep questions={questions} answers={answers} onStartOver={startOver} />
          )}
        </div>
      </div>
    </div>
  );
}

function SetupStep({
  language,
  setLanguage,
  cvFile,
  onFile,
  analyzing,
  analyzed,
  analyzeError,
  jobTitle,
  setJobTitle,
  avatar,
  setAvatar,
  canConfirm,
  onConfirm,
  generating,
  generateError,
}) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Language */}
      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-muted">
          INTERVIEW LANGUAGE
        </label>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-dark w-full appearance-none rounded-xl px-4 py-3.5 text-sm text-text-primary outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l} className="bg-canvas-card text-text-primary">
                {l}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        </div>
      </div>

      {/* 2. CV Upload */}
      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-muted">
          YOUR CV
        </label>
        <UploadBox file={cvFile} onFile={onFile} />

        {analyzing && (
          <div className="mt-3 flex items-center gap-2 text-xs font-mono text-gold-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Reading your CV — extracting experience and skills…
          </div>
        )}

        {analyzeError && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {analyzeError}
          </div>
        )}

        {analyzed && !analyzeError && (
          <p className="mt-2 font-mono text-xs text-text-muted">
            10 questions are extracted from your CV.
          </p>
        )}
      </div>

      {/* 3. Target Job Title */}
      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-muted">
          TARGET JOB TITLE
        </label>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Senior Financial Analyst"
          disabled={!analyzed}
          className="input-dark w-full rounded-xl px-4 py-3.5 text-sm outline-none disabled:opacity-40"
        />
        <p className="mt-2 font-mono text-xs text-text-muted">
          5 more questions are generated for this role.
        </p>
      </div>

      {/* 4. Avatar Interviewer */}
      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-muted">
          AVATAR INTERVIEWER
        </label>
        <div className="grid grid-cols-2 gap-3">
          {["female", "male"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setAvatar(g)}
              className={`rounded-xl border py-3.5 text-center text-sm font-medium transition ${
                avatar === g
                  ? "border-gold-500 bg-gold-500/10 text-gold-400"
                  : "border-canvas-border bg-canvas-mid text-text-secondary hover:border-canvas-muted hover:text-text-primary"
              }`}
            >
              {g === "female" ? "Female avatar" : "Male avatar"}
            </button>
          ))}
        </div>
      </div>

      {generateError && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {generateError}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={onConfirm}
        disabled={!canConfirm || generating}
        className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating your 15 questions…
          </>
        ) : (
          "Confirm & continue"
        )}
      </button>
    </div>
  );
}

function ReadyStep({ avatar, setAvatar, onStart }) {
  return (
    <div className="card-dark rounded-2xl p-8 text-center sm:p-12 animate-fadeIn">
      <h2 className="font-display text-3xl font-semibold text-text-primary">
        Choose your interviewer
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
        Payment confirmed. Pick an avatar and start whenever you're ready —
        the 15-minute clock starts on your first answer.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        {["female", "male"].map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setAvatar(g)}
            className={`flex w-36 flex-col items-center gap-3 rounded-2xl border-2 p-5 transition ${
              avatar === g
                ? "border-gold-500 bg-gold-500/10 text-gold-400"
                : "border-canvas-border bg-canvas-mid text-text-secondary hover:border-canvas-muted"
            }`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas-raised text-text-primary">
              <User className="h-6 w-6" />
            </span>
            <span className="text-sm font-semibold capitalize">{g} avatar</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="btn-gold mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
      >
        Start interview
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function LiveStep({ avatar, question, index, total, draft, setDraft, onSubmit, timeLabel }) {
  if (!question) return null;
  return (
    <div className="card-dark rounded-2xl p-6 sm:p-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-canvas-border bg-canvas-mid px-3 py-1 font-mono text-xs text-text-secondary">
          Question {index + 1} / {total}
        </span>
        <span className="rounded-full bg-gold-500 px-3 py-1 font-mono text-xs font-semibold text-canvas">
          {timeLabel} remaining
        </span>
      </div>

      {/* Split screen video */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-canvas-border bg-canvas-mid px-6 py-8 text-center min-h-[300px]">
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
            <User className="h-7 w-7" />
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-canvas bg-emerald-400" />
          </span>
          <p className="max-w-md font-display text-lg italic text-text-primary leading-relaxed sm:text-xl">
            &ldquo;{question.question}&rdquo;
          </p>
          <span className="font-mono text-[10px] uppercase tracking-wide text-text-muted">
            AI Interviewer &middot; {avatar}
          </span>
        </div>

        <CameraView className="w-full h-full min-h-[300px]" />
      </div>

      <div className="mt-6">
        <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-muted">
          YOUR ANSWER
        </label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          placeholder="Speak naturally — type what you'd say out loud."
          className="input-dark w-full resize-none rounded-xl p-4 text-sm outline-none"
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="btn-gold mt-5 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold"
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
    <div className="card-dark rounded-2xl p-6 sm:p-9 animate-fadeIn">
      <p className="font-mono text-xs uppercase tracking-wider text-gold-500">SESSION REPORT</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-text-primary sm:text-4xl">
        Interview complete
      </h2>

      <div className="mt-6 flex flex-wrap gap-3">
        <Stat label="Answered well" value={`${pct}%`} tone="gold" />
        <Stat label="Needs work" value={`${100 - pct}%`} tone="rose" />
        <Stat label="Questions" value={questions.length} tone="neutral" />
      </div>

      <div className="mt-8 space-y-4">
        {scored.map((s, i) => (
          <div key={s.id} className="rounded-xl border border-canvas-border bg-canvas-mid p-5">
            <p className="text-sm font-medium text-text-primary">
              {i + 1}. {s.question}
            </p>
            <p className="mt-2 text-sm text-rose-400">
              <span className="font-mono text-xs text-text-muted">You: </span>
              {s.userAnswer || "— no answer given —"}
            </p>
            <p className="mt-1 text-sm text-emerald-400">
              <span className="font-mono text-xs text-text-muted">Ideal: </span>
              {s.ideal}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onStartOver}
        className="btn-gold mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold"
      >
        <RotateCcw className="h-4 w-4" />
        Start over
      </button>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const toneMap = {
    gold: "text-gold-400 border-gold-500/30 bg-gold-500/10",
    rose: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    neutral: "text-text-primary border-canvas-border bg-canvas-mid",
  };
  return (
    <div className={`rounded-xl border px-5 py-3.5 ${toneMap[tone]}`}>
      <p className="font-mono text-2xl font-semibold">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </div>
  );
}
