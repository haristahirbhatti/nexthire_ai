"use client";

import Link from "next/link";
import { Mic, FileText, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="paper-grain">
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-14 sm:px-8 sm:pt-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ready-600">
          Two paths, one goal
        </p>
        <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-6xl">
          Walk into the room
          <span className="italic text-ready-600"> already prepared.</span>
        </h1>
        <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-ink-soft sm:text-lg">
          NextHire.ai runs your mock interview and rebuilds your CV against
          real applicant-tracking rules — no account, no email, just your
          documents and fifteen focused minutes.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 pb-20 sm:px-8 md:grid-cols-2 md:gap-6">
        {/* Block 1 — AI Mock Interview */}
        <Link
          href="#" onClick={(e) => e.preventDefault()}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white p-7 shadow-panel transition hover:-translate-y-0.5 hover:shadow-lg sm:p-9"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ready-50 text-ready-600">
              <Mic className="h-5 w-5" />
            </span>
            <ArrowUpRight className="h-5 w-5 text-ink-soft transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ready-600" />
          </div>

          <h2 className="mt-6 font-display text-2xl font-semibold text-ink sm:text-[26px]">
            AI Mock Interview Training
          </h2>
          <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-soft">
            15-minute live session
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Upload your CV, name the role you're chasing, and face an AI
            interviewer that asks fifteen questions built specifically for
            you — ten from your history, five from the role.
          </p>

          {/* Signature: live report color-key preview */}
          <div className="mt-6 rounded-xl border border-line bg-paper-dim p-4 font-mono text-[11px] leading-relaxed">
            <p className="text-ink">Q: Walk me through your CV.</p>
            <p className="text-flag-500">You: I started as a coordinator, then—</p>
            <p className="text-ready-600">Ideal: Lead with the outcome, then the path.</p>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-ink-soft">
            <Bullet>Video-call style interview, avatar of your choice</Bullet>
            <Bullet>Scored report — correct vs. missed, in seconds</Bullet>
          </ul>

          <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition group-hover:bg-ready-600">
            Start the interview
          </span>
        </Link>

        {/* Block 2 — CV Preparation */}
        <Link
          href="#" onClick={(e) => e.preventDefault()}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white p-7 shadow-panel transition hover:-translate-y-0.5 hover:shadow-lg sm:p-9"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-signal-50 text-signal-600">
              <FileText className="h-5 w-5" />
            </span>
            <ArrowUpRight className="h-5 w-5 text-ink-soft transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal-600" />
          </div>

          <h2 className="mt-6 font-display text-2xl font-semibold text-ink sm:text-[26px]">
            Professional CV Preparation
          </h2>
          <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-soft">
            10,000 templates · 28 languages
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Upload your current CV and get an ATS-ready rebuild: a tailored
            cover letter, an optimized LinkedIn profile, and keywords tuned
            to get you past the filters.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {["ATS-ready CV", "Cover letter", "LinkedIn profile"].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-line bg-paper-dim px-2 py-3 text-center text-[11px] font-medium leading-tight text-ink-soft"
              >
                {item}
              </div>
            ))}
          </div>

          <ul className="mt-6 space-y-2 text-sm text-ink-soft">
            <Bullet>Preview every file before you pay — nothing downloads early</Bullet>
            <Bullet>Word and PDF delivery once your invoice clears</Bullet>
          </ul>

          <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition group-hover:bg-signal-600">
            Rebuild my CV
          </span>
        </Link>
      </section>
    </div>
  );
}

function Bullet({ children }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-ready-500" />
      <span>{children}</span>
    </li>
  );
}
