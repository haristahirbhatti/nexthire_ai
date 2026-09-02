"use client";

import Link from "next/link";
import { Video, FileText, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-20 text-center sm:px-8 sm:pt-28">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-500 animate-fadeIn">
          NEXTHIRE.AI
        </p>
        <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.08] text-text-primary sm:text-7xl animate-fadeIn"
            style={{ animationDelay: "0.05s" }}>
          Rehearse the interview.{" "}
          <span className="text-text-muted">Perfect the CV.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-text-secondary animate-fadeIn"
           style={{ animationDelay: "0.1s" }}>
          Two focused services, no account needed. Choose where you want to start.
        </p>
      </section>

      {/* Cards */}
      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 sm:px-8 md:grid-cols-2 md:gap-5 animate-fadeIn"
               style={{ animationDelay: "0.15s" }}>
        {/* Card 1 — AI Mock Interview */}
        <Link href="/interview" className="card-dark group flex flex-col rounded-2xl p-7 sm:p-9">
          {/* Icon */}
          <div className="text-gold-500">
            <Video className="h-6 w-6" />
          </div>

          <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
            15-MINUTE SESSION
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-text-primary sm:text-4xl">
            AI Mock Interview Training
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            A live avatar interviewer asks 15 questions — 10 drawn from your CV
            and 5 from your target role — then hands you a scored report.
          </p>

          <ul className="mt-6 space-y-2">
            {["Avatar interviewer, male or female", "Any interview language", "Question-by-question scoring"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                <span className="h-1 w-1 rounded-full bg-gold-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-2 text-sm font-medium text-text-primary group-hover:text-gold-400 transition-colors">
            Get started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card 2 — CV Preparation */}
        <Link href="/cv-prep" className="card-dark group flex flex-col rounded-2xl p-7 sm:p-9">
          {/* Icon */}
          <div className="text-gold-500">
            <FileText className="h-6 w-6" />
          </div>

          <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
            CAREER DOCUMENTS
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-text-primary sm:text-4xl">
            Professional CV Preparation
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            An ATS-ready CV, tailored cover letter, and optimised LinkedIn &amp;
            Indeed profiles built from your existing CV in 28 languages.
          </p>

          <ul className="mt-6 space-y-2">
            {["10,000+ modern templates", "Keyword optimisation for ATS", "Word & PDF downloads"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                <span className="h-1 w-1 rounded-full bg-gold-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-2 text-sm font-medium text-text-primary group-hover:text-gold-400 transition-colors">
            Get started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </section>

      {/* Payment badges */}
      <section className="pb-20 text-center">
        <p className="mb-4 text-sm text-text-muted">Secure payment on completion</p>
        <div className="flex items-center justify-center gap-3">
          {["PayPal", "Google Pay", "VISA"].map((label) => (
            <span
              key={label}
              className="inline-flex items-center rounded border border-canvas-muted bg-canvas-raised px-3 py-1.5 text-xs font-semibold text-text-secondary"
            >
              {label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
