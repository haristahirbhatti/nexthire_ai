"use client";

export default function StepRail({ steps, current }) {
  return (
    <div className="mx-auto flex max-w-xl items-center justify-center gap-2 font-mono text-xs">
      {steps.map((step, i) => {
        const isPast = i < current;
        const isActive = i === current;

        return (
          <div key={step} className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 transition-all ${
                isActive
                  ? "bg-gold-500 font-semibold text-canvas"
                  : isPast
                  ? "bg-canvas-card text-text-primary border border-gold-500/40"
                  : "text-text-muted"
              }`}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <span className="h-px w-6 bg-canvas-border" />
            )}
          </div>
        );
      })}
    </div>
  );
}
