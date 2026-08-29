"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAppState } from "@/lib/store";

function useOdometer(value) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current === value) return;
    prev.current = value;
    setDisplay(value);
  }, [value]);

  return display;
}

export default function Navbar() {
  const { liveCount } = useAppState();
  const display = useOdometer(liveCount);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            NextHire<span className="text-ready-500">.ai</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <div
            className="hidden items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 shadow-sm sm:flex"
            aria-live="polite"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ready-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ready-500" />
            </span>
            <span className="font-mono text-xs text-ink-soft">
              <span className="font-medium text-ink">{display.toLocaleString("en-US")}</span> people prepared this way
            </span>
          </div>

          <a
            href="#" onClick={(e) => e.preventDefault()}
            className="hidden text-sm text-ink-soft transition hover:text-ink md:inline"
          >
            support@nexthire.ai
          </a>
        </div>
      </div>
      <div
        className="flex items-center justify-center gap-2 border-t border-line bg-paper-dim py-1.5 font-mono text-[11px] text-ink-soft sm:hidden"
        aria-live="polite"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-ready-500" />
        {display.toLocaleString("en-US")} people prepared this way
      </div>
    </header>
  );
}
