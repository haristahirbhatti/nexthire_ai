export default function StepRail({ steps, current }) {
  return (
    <ol className="mx-auto flex max-w-3xl items-center px-1">
      {steps.map((step, i) => {
        const state =
          i < current ? "done" : i === current ? "active" : "upcoming";
        return (
          <li key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-[11px] transition ${
                  state === "done"
                    ? "bg-ready-500 text-white"
                    : state === "active"
                    ? "border-2 border-ready-500 text-ready-600"
                    : "border border-line text-ink-soft"
                }`}
              >
                {state === "done" ? "✓" : i + 1}
              </div>
              <span
                className={`hidden text-center text-[11px] leading-tight sm:block ${
                  state === "upcoming" ? "text-ink-soft" : "text-ink"
                }`}
                style={{ maxWidth: "80px" }}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-2 h-px flex-1 ${
                  state === "done" ? "bg-ready-500" : "bg-line"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
