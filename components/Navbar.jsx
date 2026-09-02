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
    <header className="sticky top-0 z-40 border-b border-canvas-border bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-1.5 group">
          <span className="font-display text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
            NextHire<span className="text-gold-500 group-hover:text-gold-400 transition-colors">.ai</span>
          </span>
        </Link>

        {/* Live counter */}
        <div className="flex items-center gap-3" aria-live="polite">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-xs text-text-secondary">
              <span className="font-semibold text-text-primary">{display.toLocaleString("en-US")}</span>
              {" "}candidates served
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
