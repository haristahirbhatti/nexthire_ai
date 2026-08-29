"use client";

import { CreditCard, Wallet, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-dim">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg font-semibold text-ink">
              NextHire<span className="text-ready-500">.ai</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              AI mock interviews and ATS-ready CV preparation. No account, no
              email registration — start straight from the homepage.
            </p>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-wide text-ink-soft">
              Secure payment
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge icon={<Wallet className="h-3.5 w-3.5" />} label="PayPal" />
              <Badge icon={<Wallet className="h-3.5 w-3.5" />} label="Google Pay" />
              <Badge icon={<CreditCard className="h-3.5 w-3.5" />} label="Visa" />
              <Badge icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Invoice issued" />
            </div>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-wide text-ink-soft">
              Support
            </p>
            <a
              href="#" onClick={(e) => e.preventDefault()}
              className="text-sm text-ink underline decoration-line underline-offset-4 hover:decoration-ready-500"
            >
              support@nexthire.ai
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-1 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} NextHire.ai — Phase 1 frontend build.</span>
          <span>Optimized for desktop, tablet, and mobile.</span>
        </div>
      </div>
    </footer>
  );
}

function Badge({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-soft shadow-sm">
      {icon}
      {label}
    </span>
  );
}
