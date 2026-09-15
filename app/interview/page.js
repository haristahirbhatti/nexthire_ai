"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import StepRail from "@/components/StepRail";
import UploadBox from "@/components/UploadBox";
import PaymentGateway from "@/components/PaymentGateway";
import { LANGUAGES } from "@/data/languages";
import { parseCVFile, generateInterviewQuestions, evaluateAnswer } from "@/lib/parsePDF";
import { buildQuestionSet } from "@/data/interviewQuestions";
import { useAppState } from "@/lib/store";
import CameraView from "@/components/CameraView";
import { speak, stopSpeaking } from "@/lib/speechUtils";

const STEPS = ["Setup", "Payment", "Interview", "Report"];
const SESSION_SECONDS = 15 * 60;

/**
 * Full BCP 47 language tag mapping for all 28 supported languages.
 * Used by both TTS (speak) and STT (startListening).
 */
const LANG_BCP47 = {
  "English":           "en-US",
  "French":            "fr-FR",
  "Spanish":           "es-ES",
  "Russian":           "ru-RU",
  "Arabic":            "ar-SA",
  "Mandarin Chinese":  "zh-CN",
  "Swedish":           "sv-SE",
  "German":            "de-DE",
  "Italian":           "it-IT",
  "Japanese":          "ja-JP",
  "Korean":            "ko-KR",
  "Thai":              "th-TH",
  "Indonesian":        "id-ID",
  "Turkish":           "tr-TR",
  "Hebrew":            "he-IL",
  "Hindi":             "hi-IN",
  "Portuguese":        "pt-PT",
  "Urdu":              "ur-PK",
  "Danish":            "da-DK",
  "Norwegian":         "nb-NO",
  "Ukrainian":         "uk-UA",
  "Polish":            "pl-PL",
  "Czech":             "cs-CZ",
  "Slovak":            "sk-SK",
  "Serbian":           "sr-RS",
  "Croatian":          "hr-HR",
  "Bulgarian":         "bg-BG",
  "Macedonian":        "mk-MK",
};

function getLangCode(language) {
  return LANG_BCP47[language] || "en-US";
}

export default function InterviewPage() {
  const router = useRouter();
  const { registerPayment } = useAppState();

  const [stepIndex, setStepIndex] = useState(0);
  const [language, setLanguage] = useState("English");
  const [avatar, setAvatar] = useState("female");

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    try {
      sessionStorage.setItem("nexthire_language", newLang);
      sessionStorage.removeItem("nexthire_questions");
    } catch (_) {}
    setQuestions([]);
  };

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

  // AI Report state
  const [evaluations, setEvaluations] = useState({});
  const [evaluating, setEvaluating] = useState(false);

  // Load saved session on mount (handles page reloads / post-payment redirects)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedJob = sessionStorage.getItem("nexthire_jobTitle");
      if (savedJob) setJobTitle(savedJob);

      const savedQs = sessionStorage.getItem("nexthire_questions");
      if (savedQs) {
        const parsed = JSON.parse(savedQs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
        }
      }

      const savedLang = sessionStorage.getItem("nexthire_language");
      if (savedLang) setLanguage(savedLang);
    } catch (e) {
      console.warn("Could not read sessionStorage:", e);
    }
  }, []);

  // Save questions, job title, and language to sessionStorage
  const saveInterviewSession = (qs, title, lang) => {
    if (typeof window === "undefined") return;
    try {
      if (qs && qs.length > 0) {
        sessionStorage.setItem("nexthire_questions", JSON.stringify(qs));
      }
      if (title) {
        sessionStorage.setItem("nexthire_jobTitle", title);
      }
      if (lang) {
        sessionStorage.setItem("nexthire_language", lang);
      }
    } catch (e) {
      console.warn("Could not save to sessionStorage:", e);
    }
  };

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
      let qs;
      try {
        qs = await generateInterviewQuestions(cvText, jobTitle, language);
      } catch (err) {
        console.warn("API question generation failed, falling back to localized questions:", err);
        qs = buildQuestionSet(jobTitle, language);
      }
      if (!qs || qs.length === 0) {
        qs = buildQuestionSet(jobTitle, language);
      }
      setQuestions(qs);
      saveInterviewSession(qs, jobTitle, language);
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

  // Detect Stripe Checkout success redirect (?payment=success&session_id=...)
  // Now verifies payment server-side before granting access
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment") || params.get("status");
    const sessionId = params.get("session_id");

    if (paymentStatus === "success" && sessionId) {
      // Verify payment server-side
      fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.verified) {
            handlePaid();
            // Clean URL
            window.history.replaceState({}, "", window.location.pathname);
          } else {
            console.error("Payment verification failed:", data.error);
          }
        })
        .catch((err) => {
          console.error("Payment verification request failed:", err);
        });
    }
    // If ?payment=success but NO session_id → do NOT grant access (prevents URL manipulation)
  }, []);

  const startInterview = () => {
    let activeQuestions = questions;
    if (!activeQuestions || activeQuestions.length === 0) {
      try {
        const saved = sessionStorage.getItem("nexthire_questions");
        const savedLang = sessionStorage.getItem("nexthire_language");
        if (saved && (!savedLang || savedLang === language)) {
          activeQuestions = JSON.parse(saved);
        }
      } catch (e) {}

      if (!activeQuestions || activeQuestions.length === 0) {
        activeQuestions = buildQuestionSet(jobTitle || "Professional", language);
      }
      setQuestions(activeQuestions);
      saveInterviewSession(activeQuestions, jobTitle || "Professional", language);
    }

    setQIndex(0);
    setAnswers({});
    setEvaluations({});
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

  // TTS for question — uses full 28-language BCP47 mapping and languageName
  useEffect(() => {
    if (live && questions[qIndex]) {
      stopSpeaking();
      speak(questions[qIndex].question, {
        gender: avatar,
        lang: getLangCode(language),
        languageName: language,
      }).catch((err) => {
        console.error("Speech Synthesis failed:", err);
      });
    }

    return () => {
      stopSpeaking();
    };
  }, [live, qIndex, questions, language, avatar]);

  const finishInterview = useCallback(() => {
    clearInterval(timerRef.current);
    setStepIndex(3); // Report
  }, []);

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
    setEvaluations({});
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
              setLanguage={handleLanguageChange}
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
                amount="9.99"
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
              language={language}
            />
          )}

          {stepIndex === 3 && (
            <ReportStep
              questions={questions}
              answers={answers}
              jobTitle={jobTitle}
              evaluations={evaluations}
              setEvaluations={setEvaluations}
              evaluating={evaluating}
              setEvaluating={setEvaluating}
              onStartOver={startOver}
            />
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

function LiveStep({ avatar, question, index, total, draft, setDraft, onSubmit, timeLabel, language }) {
  const isArabic = language === "Arabic" || (language && language.toLowerCase().includes("arab"));
  const currentQuestion = question || {
    id: "fallback-q",
    question: isArabic
      ? "تحدث عن مسيرتك المهنية وسيرتك الذاتية، وأبرز الإنجازات المتعلقة بهذا الدور."
      : "Walk me through your background and key achievements relevant to this role.",
    ideal: isArabic
      ? "تقديم ملخص واضح وموجز لخبراتك وأثرك المهني."
      : "Provide a clear summary of your experience and measurable impact.",
  };

  return (
    <div className="card-dark rounded-2xl p-6 sm:p-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-canvas-border bg-canvas-mid px-3 py-1 font-mono text-xs text-text-secondary">
          Question {index + 1} / {total || 15}
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
            &ldquo;{currentQuestion.question}&rdquo;
          </p>
          <span className="font-mono text-[10px] uppercase tracking-wide text-text-muted">
            AI Interviewer &middot; {avatar} &middot; {language}
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

/**
 * ReportStep — NOW calls /api/evaluate-answer for real AI scoring
 * instead of the broken length >= 20 check.
 */
function ReportStep({ questions, answers, jobTitle, evaluations, setEvaluations, evaluating, setEvaluating, onStartOver }) {
  // Run AI evaluations when report loads
  useEffect(() => {
    if (!questions || questions.length === 0) return;
    if (Object.keys(evaluations).length > 0) return; // already evaluated

    const runEvaluations = async () => {
      setEvaluating(true);
      const results = {};

      for (const q of questions) {
        const userAnswer = answers[q.id] || "";
        try {
          const evalResult = await evaluateAnswer({
            question: q.question,
            idealAnswer: q.ideal,
            candidateAnswer: userAnswer,
            jobTitle: jobTitle || "Professional",
          });
          results[q.id] = {
            score: evalResult.score ?? 0,
            feedback: evalResult.feedback || "No feedback available.",
            passed: evalResult.passed ?? false,
          };
        } catch (err) {
          // Fallback: if API fails, use a smarter heuristic than length >= 20
          const words = userAnswer.trim().split(/\s+/).length;
          const hasSubstance = words >= 15;
          results[q.id] = {
            score: hasSubstance ? Math.min(10, Math.round(words / 8)) : userAnswer.trim().length > 0 ? 3 : 0,
            feedback: !userAnswer.trim()
              ? "No answer was provided for this question."
              : hasSubstance
              ? "Your answer covers some key points. Try to include more specific examples and measurable outcomes."
              : "Your answer is too brief. Expand with concrete examples using the STAR method (Situation, Task, Action, Result).",
            passed: hasSubstance,
          };
        }
      }

      setEvaluations(results);
      setEvaluating(false);
    };

    runEvaluations();
  }, [questions, answers, jobTitle]);

  // Compute stats from real evaluations
  const scored = useMemo(() => {
    return questions.map((q) => {
      const userAnswer = answers[q.id] || "";
      const evalData = evaluations[q.id] || { score: 0, feedback: "Evaluating…", passed: false };
      return { ...q, userAnswer, ...evalData };
    });
  }, [questions, answers, evaluations]);

  const answeredQuestions = scored.filter((s) => s.userAnswer.trim().length > 0);
  const passedCount = scored.filter((s) => s.passed).length;
  const totalScore = scored.reduce((sum, s) => sum + (s.score || 0), 0);
  const avgScore = questions.length ? (totalScore / questions.length).toFixed(1) : "0.0";
  const passPct = questions.length ? Math.round((passedCount / questions.length) * 100) : 0;

  if (evaluating) {
    return (
      <div className="card-dark rounded-2xl p-8 text-center sm:p-12 animate-fadeIn space-y-6">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-gold-500" />
        <h2 className="font-display text-2xl font-semibold text-text-primary sm:text-3xl">
          AI is analyzing your answers…
        </h2>
        <p className="mx-auto max-w-md text-sm text-text-secondary">
          Each answer is being evaluated by GPT-4o against the ideal response criteria.
          This takes 15–30 seconds.
        </p>
        <div className="mx-auto max-w-xs">
          <div className="h-1.5 w-full rounded-full bg-canvas-mid overflow-hidden">
            <div
              className="h-full rounded-full bg-gold-500 transition-all duration-500"
              style={{ width: `${Math.round((Object.keys(evaluations).length / Math.max(questions.length, 1)) * 100)}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-xs text-text-muted">
            {Object.keys(evaluations).length} / {questions.length} evaluated
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-dark rounded-2xl p-6 sm:p-9 animate-fadeIn">
      <p className="font-mono text-xs uppercase tracking-wider text-gold-500">SESSION REPORT</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-text-primary sm:text-4xl">
        Interview complete
      </h2>

      <div className="mt-6 flex flex-wrap gap-3">
        <Stat label="Average Score" value={`${avgScore}/10`} tone="gold" />
        <Stat label="Passed" value={`${passPct}%`} tone={passPct >= 60 ? "gold" : "rose"} />
        <Stat label="Answered" value={`${answeredQuestions.length}/${questions.length}`} tone="neutral" />
        <Stat label="Need Work" value={`${questions.length - passedCount}`} tone="rose" />
      </div>

      {/* Overall Assessment */}
      <div className="mt-6 rounded-xl border border-canvas-border bg-canvas-mid p-5">
        <div className="flex items-center gap-2 mb-3">
          {passPct >= 70 ? (
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          ) : (
            <TrendingDown className="h-5 w-5 text-rose-400" />
          )}
          <span className="font-display text-lg font-semibold text-text-primary">
            {passPct >= 80 ? "Excellent Performance" :
             passPct >= 60 ? "Good Performance — Room for Improvement" :
             passPct >= 40 ? "Needs Significant Improvement" :
             "Below Expectations — Practice Required"}
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          {passPct >= 80
            ? "You demonstrated strong command of the subject matter with specific, detailed answers. Continue refining your responses for maximum impact."
            : passPct >= 60
            ? "You showed competence in several areas but some answers lacked depth or specificity. Focus on using the STAR method and including measurable outcomes."
            : "Many answers were too brief or missed key points. Practice structuring answers with the STAR method (Situation, Task, Action, Result) and prepare specific examples from your experience."}
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {scored.map((s, i) => (
          <div key={s.id} className="rounded-xl border border-canvas-border bg-canvas-mid p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-text-primary">
                {i + 1}. {s.question}
              </p>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {s.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-rose-400" />
                )}
                <span className={`font-mono text-xs font-bold ${s.passed ? "text-emerald-400" : "text-rose-400"}`}>
                  {s.score}/10
                </span>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div>
                <span className="font-mono text-xs text-text-muted">Your answer: </span>
                <p className="mt-0.5 text-sm text-text-secondary">
                  {s.userAnswer || "— no answer given —"}
                </p>
              </div>

              <div className="rounded-lg bg-canvas-raised border border-canvas-border p-3">
                <span className="font-mono text-xs text-gold-400">AI Feedback: </span>
                <p className="mt-0.5 text-sm text-text-primary">{s.feedback}</p>
              </div>

              <div>
                <span className="font-mono text-xs text-emerald-400/70">Ideal approach: </span>
                <p className="mt-0.5 text-sm text-emerald-400/80">{s.ideal}</p>
              </div>
            </div>
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
