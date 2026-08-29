"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Check,
  Loader2,
  Lock,
  FileDown,
  RotateCcw,
} from "lucide-react";
import StepRail from "@/components/StepRail";
import UploadBox from "@/components/UploadBox";
import PaymentGateway from "@/components/PaymentGateway";
import { LANGUAGES } from "@/data/languages";
import { TEMPLATE_COUNT, getTemplatePage } from "@/data/templates";
import { useAppState } from "@/lib/store";

const STEPS = ["Upload", "Template", "Language", "Generate", "Review", "Payment", "Download"];

const TASKS = [
  "Building an ATS-compatible CV",
  "Writing a tailored cover letter",
  "Optimizing your LinkedIn profile",
  "Tuning keywords for visibility",
  "Highlighting skills & experience",
  "Finalizing a clean, clear layout",
];

export default function CvPrepPage() {
  const router = useRouter();
  const { registerPayment } = useAppState();

  const [step, setStep] = useState(0);
  const [cvFile, setCvFile] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [language, setLanguage] = useState("English");

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));

  const handlePaid = () => {
    registerPayment();
    next();
  };

  const startOver = () => {
    setStep(0);
    setCvFile(null);
    setTemplateId(null);
    setLanguage("English");
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-10 sm:px-8">
      <StepRail steps={STEPS} current={step} />

      <div className="mt-10">
        {step === 0 && (
          <UploadStep cvFile={cvFile} onFile={setCvFile} onNext={next} />
        )}
        {step === 1 && (
          <TemplateStep
            templateId={templateId}
            setTemplateId={setTemplateId}
            onNext={next}
          />
        )}
        {step === 2 && (
          <LanguageStep language={language} setLanguage={setLanguage} onNext={next} />
        )}
        {step === 3 && <GenerateStep onDone={next} />}
        {step === 4 && <ReviewStep onAgree={next} />}
        {step === 5 && (
          <div className="mx-auto max-w-md">
            <PaymentGateway
              amount="19.00"
              description="Professional CV Preparation & Career Services"
              onPaid={handlePaid}
            />
          </div>
        )}
        {step === 6 && <DownloadStep onStartOver={startOver} />}
      </div>
    </div>
  );
}

function UploadStep({ cvFile, onFile, onNext }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-panel sm:p-9">
      <p className="font-mono text-xs uppercase tracking-wide text-signal-600">Step 1</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
        Upload your current CV
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
        We'll rebuild it from the ground up — same experience, sharper
        presentation, tuned to pass applicant-tracking systems.
      </p>
      <div className="mt-6">
        <UploadBox file={cvFile} onFile={onFile} />
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={!cvFile}
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-signal-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next: choose a template
      </button>
    </div>
  );
}

function TemplateStep({ templateId, setTemplateId, onNext }) {
  const [page, setPage] = useState(0);
  const [items, setItems] = useState(() => getTemplatePage(0));

  const loadMore = () => {
    const nextPage = page + 1;
    setItems((prev) => [...prev, ...getTemplatePage(nextPage)]);
    setPage(nextPage);
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-panel sm:p-9">
      <p className="font-mono text-xs uppercase tracking-wide text-signal-600">Step 2</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
        Pick a template
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
        Choose from {TEMPLATE_COUNT.toLocaleString("en-US")} modern layouts.
        Showing {items.length.toLocaleString("en-US")} so far.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTemplateId(t.id)}
            className={`overflow-hidden rounded-xl border-2 text-left transition ${
              templateId === t.id ? "border-signal-500" : "border-line hover:border-ink-soft"
            }`}
          >
            <div className="aspect-[3/4] w-full bg-paper-dim p-2.5">
              <div className="h-full w-full rounded-sm bg-white p-1.5 shadow-sm">
                <div
                  className={`h-2 w-3/4 rounded-full ${t.columns === 2 ? "mb-1" : "mb-1.5"}`}
                  style={{ backgroundColor: t.accent }}
                />
                <div className="space-y-1">
                  {Array.from({ length: t.columns === 2 ? 5 : 7 }).map((_, i) => (
                    <div key={i} className="h-1 w-full rounded-full bg-line" />
                  ))}
                </div>
              </div>
            </div>
            <div className="px-2 py-1.5">
              <p className="truncate text-[11px] font-medium text-ink">{t.name}</p>
              <p className="text-[10px] text-ink-soft">{t.tone}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={loadMore}
        className="mt-5 text-sm font-medium text-signal-600 hover:underline"
      >
        Load more templates
      </button>

      <div>
        <button
          type="button"
          onClick={onNext}
          disabled={!templateId}
          className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-signal-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next: choose a language
        </button>
      </div>
    </div>
  );
}

function LanguageStep({ language, setLanguage, onNext }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-panel sm:p-9">
      <p className="font-mono text-xs uppercase tracking-wide text-signal-600">Step 3</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
        Choose your language
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
        Your CV, cover letter, and LinkedIn profile will be written in this
        language — 28 to choose from.
      </p>

      <div className="mt-6 max-w-xs">
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full appearance-none rounded-xl border border-line bg-paper-dim px-4 py-3 text-sm text-ink outline-none focus-visible:border-signal-500"
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
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-signal-600"
      >
        Next: generate my documents
      </button>
    </div>
  );
}

function GenerateStep({ onDone }) {
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    if (doneCount >= TASKS.length) {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDoneCount((c) => c + 1), 650);
    return () => clearTimeout(t);
  }, [doneCount, onDone]);

  const progress = Math.round((doneCount / TASKS.length) * 100);

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-panel sm:p-9">
      <p className="font-mono text-xs uppercase tracking-wide text-signal-600">Step 4</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
        Generating your documents
      </h1>

      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-paper-dim">
        <div
          className="h-full rounded-full bg-signal-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="mt-6 space-y-3">
        {TASKS.map((task, i) => {
          const done = i < doneCount;
          const active = i === doneCount;
          return (
            <li key={task} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                  done
                    ? "border-ready-500 bg-ready-500 text-white"
                    : active
                    ? "border-signal-500"
                    : "border-line"
                }`}
              >
                {done ? (
                  <Check className="h-3 w-3" />
                ) : active ? (
                  <Loader2 className="h-3 w-3 animate-spin text-signal-600" />
                ) : null}
              </span>
              <span className={done || active ? "text-ink" : "text-ink-soft"}>{task}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ReviewStep({ onAgree }) {
  const [tab, setTab] = useState("cv");
  const tabs = [
    { id: "cv", label: "CV" },
    { id: "cover", label: "Cover letter" },
    { id: "linkedin", label: "LinkedIn profile" },
  ];

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-panel sm:p-9">
      <p className="font-mono text-xs uppercase tracking-wide text-signal-600">Step 5</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
        Review before you pay
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
        Every file is ready to read. Downloading unlocks after checkout.
      </p>

      <div className="mt-6 flex gap-1 rounded-full bg-paper-dim p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-medium transition ${
              tab === t.id ? "bg-white text-ink shadow-sm" : "text-ink-soft"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative mt-4 overflow-hidden rounded-xl border border-line">
        <div className="space-y-2 p-6 blur-[3px]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full bg-line"
              style={{ width: `${90 - (i % 4) * 12}%` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/40">
          <Lock className="h-6 w-6 text-ink-soft" />
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-paper">
            Preview only — unlocks after payment
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onAgree}
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-signal-600"
      >
        Agree & continue to payment
      </button>
    </div>
  );
}

function DownloadStep({ onStartOver }) {
  const generate = (kind, ext) => {
    const content = `NextHire.ai — Generated ${kind}\n\nThis is a placeholder ${kind.toLowerCase()} file from the Phase 1 demo build.\nThe production version will deliver a fully formatted ${ext.toUpperCase()} file.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NextHire-${kind.replace(/\s+/g, "-")}.${ext === "word" ? "doc" : "pdf"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const files = [
    { name: "ATS-ready CV" },
    { name: "Cover letter" },
    { name: "LinkedIn profile" },
  ];

  return (
    <div className="rounded-2xl border border-ready-100 bg-white p-6 shadow-panel sm:p-9">
      <p className="font-mono text-xs uppercase tracking-wide text-ready-600">Unlocked</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
        Your documents are ready
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
        Download each file in Word or PDF.
      </p>

      <div className="mt-6 space-y-3">
        {files.map((f) => (
          <div
            key={f.name}
            className="flex flex-col gap-3 rounded-xl border border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm font-medium text-ink">{f.name}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => generate(f.name, "word")}
                className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-ready-500 hover:text-ready-600"
              >
                <FileDown className="h-3.5 w-3.5" /> Word
              </button>
              <button
                type="button"
                onClick={() => generate(f.name, "pdf")}
                className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-ready-500 hover:text-ready-600"
              >
                <FileDown className="h-3.5 w-3.5" /> PDF
              </button>
            </div>
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
  );
}
