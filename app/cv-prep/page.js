"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Check,
  Loader2,
  Lock,
  FileDown,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Copy,
  CheckCheck,
} from "lucide-react";
import StepRail from "@/components/StepRail";
import UploadBox from "@/components/UploadBox";
import PaymentGateway from "@/components/PaymentGateway";
import { LANGUAGES } from "@/data/languages";
import { TEMPLATE_COUNT, getTemplatePage } from "@/data/templates";
import { parseCVFile } from "@/lib/parsePDF";
import { useAppState } from "@/lib/store";
import { downloadWordDocument, downloadPDFDocument } from "@/lib/exportDocument";

const STEPS = ["Upload", "Template", "Language", "Generate", "Review", "Payment", "Download"];

const TASKS = [
  "Extracting candidate career history",
  "Building an ATS-compatible CV structure",
  "Writing a tailored executive cover letter",
  "Optimizing LinkedIn headline & profile keywords",
  "Tuning keywords for ATS visibility",
  "Finalizing clean document layout",
];

export default function CvPrepPage() {
  const router = useRouter();
  const { registerPayment } = useAppState();

  const [step, setStep] = useState(0);
  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState("");
  const [templateId, setTemplateId] = useState(1);
  const [language, setLanguage] = useState("English");
  const [targetRole, setTargetRole] = useState("");

  const [cvPackage, setCvPackage] = useState(null);
  const [generating, setGenerating] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));

  // Handle file upload and text extraction
  const handleFile = async (file) => {
    setCvFile(file);
    if (!file) return;
    try {
      const text = await parseCVFile(file);
      setCvText(text);
    } catch (e) {
      console.warn("PDF parse fallback:", e);
    }
  };

  // Trigger real AI generation
  const startGeneration = async () => {
    setGenerating(true);
    next(); // Move to Step 3 (Generate)

    try {
      const res = await fetch("/api/generate-cv-package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, language, templateId, targetRole }),
      });
      const data = await res.json();
      if (data.package) {
        setCvPackage(data.package);
      }
    } catch (err) {
      console.error("CV generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePaid = () => {
    registerPayment();
    next();
  };

  const startOver = () => {
    setStep(0);
    setCvFile(null);
    setCvText("");
    setTemplateId("modern-1");
    setLanguage("English");
    setTargetRole("");
    setCvPackage(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-canvas pb-24 pt-10">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <StepRail steps={STEPS} current={step} />

        <div className="mt-8 text-center sm:mt-12">
          <h1 className="font-display text-4xl font-semibold text-text-primary sm:text-5xl">
            Professional CV Preparation
          </h1>
          <p className="mt-3 text-sm text-text-secondary sm:text-base">
            An ATS-ready CV, tailored cover letter, and optimized LinkedIn &amp; Indeed profiles.
          </p>
        </div>

        <div className="mt-10">
          {step === 0 && (
            <UploadStep
              cvFile={cvFile}
              onFile={handleFile}
              targetRole={targetRole}
              setTargetRole={setTargetRole}
              onNext={next}
            />
          )}
          {step === 1 && (
            <TemplateStep
              templateId={templateId}
              setTemplateId={setTemplateId}
              onNext={next}
            />
          )}
          {step === 2 && (
            <LanguageStep
              language={language}
              setLanguage={setLanguage}
              onStartGenerate={startGeneration}
            />
          )}
          {step === 3 && (
            <GenerateStep generating={generating} onDone={next} />
          )}
          {step === 4 && (
            <ReviewStep cvPackage={cvPackage} onAgree={next} />
          )}
          {step === 5 && (
            <div className="mx-auto max-w-md">
              <PaymentGateway
                amount="19.00"
                description="Professional CV Preparation & Career Services"
                onPaid={handlePaid}
              />
            </div>
          )}
          {step === 6 && (
            <DownloadStep cvPackage={cvPackage} onStartOver={startOver} />
          )}
        </div>
      </div>
    </div>
  );
}

function UploadStep({ cvFile, onFile, targetRole, setTargetRole, onNext }) {
  return (
    <div className="card-dark rounded-2xl p-6 sm:p-9 animate-fadeIn space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-gold-500">STEP 1</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-text-primary sm:text-3xl">
          Upload your current CV
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          We'll rebuild it from the ground up — same experience, sharper presentation, tuned to pass applicant-tracking systems.
        </p>
      </div>

      <UploadBox file={cvFile} onFile={onFile} />

      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-muted">
          TARGET JOB TITLE (OPTIONAL)
        </label>
        <input
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. Senior Financial Analyst or Senior Software Engineer"
          className="input-dark w-full rounded-xl px-4 py-3.5 text-sm outline-none"
        />
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!cvFile}
        className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue to template selection
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function TemplateStep({ templateId, setTemplateId, onNext }) {
  const [page, setPage] = useState(1);
  const items = getTemplatePage(page, 12);
  const totalPages = Math.ceil(TEMPLATE_COUNT / 12);

  return (
    <div className="card-dark rounded-2xl p-6 sm:p-9 animate-fadeIn space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-gold-500">STEP 2</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-text-primary sm:text-3xl">
          Choose a design template
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Select from {TEMPLATE_COUNT.toLocaleString("en-US")} professional layouts designed to pass ATS parsers.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {items.map((t) => {
          const selected = templateId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplateId(t.id)}
              className={`group flex flex-col overflow-hidden rounded-xl border p-3.5 text-left transition ${
                selected
                  ? "border-gold-500 bg-gold-500/10 text-gold-400 shadow-gold"
                  : "border-canvas-border bg-canvas-mid hover:border-canvas-muted hover:bg-canvas-card"
              }`}
            >
              <div
                className="aspect-[3/4] w-full rounded-lg border border-canvas-border p-3 text-[8px] font-mono leading-tight overflow-hidden transition group-hover:border-gold-500/40 relative"
                style={{ backgroundColor: t.previewBg }}
              >
                <div
                  className="h-1.5 w-full rounded mb-2"
                  style={{ backgroundColor: t.accent }}
                />
                <div className="font-bold text-text-primary text-[10px] mb-0.5">{t.name}</div>
                <div className="text-[7px] text-text-muted mb-2">{t.tone} Layout</div>

                {t.columns === 2 ? (
                  <div className="grid grid-cols-3 gap-1">
                    <div className="col-span-1 space-y-1">
                      <div className="h-1 w-full bg-text-primary/20 rounded" />
                      <div className="h-1 w-4/5 bg-text-primary/10 rounded" />
                      <div className="h-1 w-3/4 bg-text-primary/10 rounded" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <div className="h-1 w-full bg-text-primary/30 rounded" />
                      <div className="h-1 w-5/6 bg-text-primary/20 rounded" />
                      <div className="h-1 w-4/5 bg-text-primary/20 rounded" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-text-secondary">
                    <div className="h-1 w-full bg-text-primary/30 rounded" />
                    <div className="h-1 w-4/5 bg-text-primary/20 rounded" />
                    <div className="h-1 w-5/6 bg-text-primary/20 rounded" />
                    <div className="h-1 w-2/3 bg-text-primary/10 rounded" />
                  </div>
                )}

                {selected && (
                  <div className="absolute top-2 right-2 rounded-full bg-gold-500 p-1 text-canvas">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">{t.name}</span>
                <span className="rounded bg-canvas-card px-1.5 py-0.5 text-[9px] font-mono text-text-muted">
                  {t.tone}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-canvas-border pt-4">
        <span className="font-mono text-xs text-text-muted">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-canvas-border bg-canvas-mid px-3 py-1.5 text-xs text-text-secondary disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-canvas-border bg-canvas-mid px-3 py-1.5 text-xs text-text-secondary disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!templateId}
        className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue to language selection
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function LanguageStep({ language, setLanguage, onStartGenerate }) {
  return (
    <div className="card-dark rounded-2xl p-6 sm:p-9 animate-fadeIn space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-gold-500">STEP 3</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-text-primary sm:text-3xl">
          Select target language
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          We can rewrite and optimize your CV in any of 28 supported languages.
        </p>
      </div>

      <div className="relative max-w-xs">
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

      <button
        type="button"
        onClick={onStartGenerate}
        className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold"
      >
        Generate CV package with AI
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function GenerateStep({ generating, onDone }) {
  const [taskIndex, setTaskIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTaskIndex((i) => {
        if (i < TASKS.length - 1) return i + 1;
        return i;
      });
    }, 700);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!generating && taskIndex >= TASKS.length - 2) {
      const timeout = setTimeout(onDone, 500);
      return () => clearTimeout(timeout);
    }
  }, [generating, taskIndex, onDone]);

  return (
    <div className="card-dark rounded-2xl p-8 text-center sm:p-12 animate-fadeIn space-y-6">
      <Loader2 className="mx-auto h-10 w-10 animate-spin text-gold-500" />
      <h2 className="font-display text-2xl font-semibold text-text-primary sm:text-3xl">
        AI is generating your CV package…
      </h2>

      <div className="mx-auto max-w-sm space-y-3 text-left">
        {TASKS.map((task, i) => {
          const done = i < taskIndex;
          const current = i === taskIndex;
          return (
            <div key={task} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs transition ${
                  done
                    ? "bg-gold-500 text-canvas font-bold"
                    : current
                    ? "border-2 border-gold-500 text-gold-400"
                    : "border border-canvas-border text-text-muted"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className={done ? "text-text-primary" : current ? "font-medium text-gold-400" : "text-text-muted"}>
                {task}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewStep({ cvPackage, onAgree }) {
  const [activeTab, setActiveTab] = useState("cv");
  const pkg = cvPackage || {};

  return (
    <div className="card-dark rounded-2xl p-6 sm:p-9 animate-fadeIn space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-gold-500">PREVIEW &amp; APPROVAL</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-text-primary sm:text-3xl">
            Review your rebuilt package
          </h2>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-xs font-mono text-gold-400">
          <Sparkles className="h-4 w-4" />
          ATS Score: <span className="font-bold text-text-primary">{pkg.atsScore || 95}/100</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-canvas-border">
        {[
          { id: "cv", label: "ATS CV" },
          { id: "cover", label: "Cover Letter" },
          { id: "linkedin", label: "LinkedIn Profile" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`border-b-2 px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === t.id
                ? "border-gold-500 text-gold-400"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Preview Content */}
      <div className="relative rounded-xl border border-canvas-border bg-canvas-mid p-6 font-mono text-xs leading-relaxed text-text-secondary max-h-[350px] overflow-y-auto">
        {activeTab === "cv" && (
          <div className="space-y-4">
            <div>
              <p className="text-base font-bold text-text-primary">{pkg.personalInfo?.fullName || "Candidate Name"}</p>
              <p className="text-gold-400 font-semibold">{pkg.personalInfo?.targetTitle || "Senior Professional"}</p>
              <p className="text-text-muted">{pkg.personalInfo?.location} · {pkg.personalInfo?.email}</p>
            </div>
            <div>
              <p className="font-bold uppercase text-text-primary border-b border-canvas-border pb-1 mb-2">Executive Summary</p>
              <p>{pkg.summary}</p>
            </div>
            <div>
              <p className="font-bold uppercase text-text-primary border-b border-canvas-border pb-1 mb-2">Key Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {(pkg.skills || []).map((s) => (
                  <span key={s} className="rounded bg-canvas-raised border border-canvas-border px-2 py-0.5 text-[11px] text-text-primary">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-bold uppercase text-text-primary border-b border-canvas-border pb-1 mb-2">Experience</p>
              {(pkg.experience || []).map((exp, idx) => (
                <div key={idx} className="mb-3">
                  <p className="font-semibold text-text-primary">{exp.role} — <span className="text-gold-400">{exp.company}</span> ({exp.period})</p>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    {(exp.highlights || []).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "cover" && (
          <div className="space-y-3 whitespace-pre-line">
            <p className="font-bold text-text-primary">{pkg.coverLetter?.greeting}</p>
            <p>{pkg.coverLetter?.body}</p>
            <p className="text-text-primary pt-2">{pkg.coverLetter?.signOff}</p>
          </div>
        )}

        {activeTab === "linkedin" && (
          <div className="space-y-4">
            <div>
              <p className="font-bold text-text-primary uppercase mb-1">Headline</p>
              <p className="text-gold-400 bg-canvas-raised p-3 rounded border border-canvas-border">{pkg.linkedInProfile?.headline}</p>
            </div>
            <div>
              <p className="font-bold text-text-primary uppercase mb-1">About Section</p>
              <p>{pkg.linkedInProfile?.aboutSection}</p>
            </div>
            <div>
              <p className="font-bold text-text-primary uppercase mb-1">Featured Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {(pkg.linkedInProfile?.featuredKeywords || []).map((kw) => (
                  <span key={kw} className="rounded bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 text-[11px] text-gold-400">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onAgree}
        className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold"
      >
        Proceed to checkout ($19.00)
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function DownloadStep({ cvPackage, onStartOver }) {
  const [copied, setCopied] = useState(false);
  const pkg = cvPackage || {};

  const copyText = () => {
    const text = `
CV: ${pkg.personalInfo?.fullName || "Candidate"} - ${pkg.personalInfo?.targetTitle || "Professional"}
SUMMARY: ${pkg.summary || ""}

SKILLS: ${(pkg.skills || []).join(", ")}

COVER LETTER:
${pkg.coverLetter?.greeting || ""}
${pkg.coverLetter?.body || ""}
${pkg.coverLetter?.signOff || ""}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="card-dark rounded-2xl p-8 text-center sm:p-12 animate-fadeIn space-y-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
        <FileDown className="h-7 w-7" />
      </div>
      <h2 className="font-display text-3xl font-semibold text-text-primary">
        Your package is ready!
      </h2>
      <p className="mx-auto max-w-md text-sm text-text-secondary">
        Select your preferred document format to download your complete ATS-optimized career package:
      </p>

      <div className="mx-auto flex max-w-sm flex-col gap-3">
        {/* Option 1: Word Document */}
        <button
          type="button"
          onClick={() => downloadWordDocument(pkg)}
          className="btn-gold flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold shadow-gold"
        >
          <FileDown className="h-4 w-4" />
          Download Word Document (.DOCX)
        </button>

        {/* Option 2: PDF Document */}
        <button
          type="button"
          onClick={() => downloadPDFDocument(pkg)}
          className="flex items-center justify-center gap-2 rounded-xl border border-gold-500/50 bg-gold-500/10 py-3.5 text-sm font-semibold text-gold-400 hover:bg-gold-500/20 transition"
        >
          <FileDown className="h-4 w-4" />
          Download PDF Document (.PDF)
        </button>

        {/* Option 3: Copy Text */}
        <button
          type="button"
          onClick={copyText}
          className="flex items-center justify-center gap-2 rounded-xl border border-canvas-border bg-canvas-mid py-3 text-xs text-text-secondary hover:text-text-primary transition"
        >
          {copied ? <CheckCheck className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied to clipboard!" : "Copy raw text to clipboard"}
        </button>

        <button
          type="button"
          onClick={onStartOver}
          className="flex items-center justify-center gap-2 text-xs text-text-muted hover:text-text-secondary pt-2"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Start another CV
        </button>
      </div>
    </div>
  );
}
