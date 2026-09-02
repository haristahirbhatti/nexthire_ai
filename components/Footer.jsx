"use client";

export default function Footer() {
  return (
    <footer className="border-t border-canvas-border bg-canvas">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-8">
        <div className="text-sm text-text-muted">
          <span>No sign-up. No email required.</span>
          <span className="mx-2 text-canvas-muted">·</span>
          <span>Support · <a href="mailto:support@nexthire.ai" className="text-text-secondary hover:text-text-primary transition-colors">support@nexthire.ai</a></span>
        </div>

        <div className="flex items-center gap-2">
          {["PayPal", "Google Pay", "VISA"].map((label) => (
            <span
              key={label}
              className="inline-flex items-center rounded border border-canvas-muted bg-canvas-raised px-2.5 py-1 text-xs font-semibold text-text-secondary"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
