"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppStateContext = createContext(null);

const COUNTER_KEY = "nexthire.liveUserCount";
const BASE_COUNT = 50000;

export function AppStateProvider({ children }) {
  const [liveCount, setLiveCount] = useState(BASE_COUNT);
  const [session, setSession] = useState({
    interview: null,
    cvPrep: null,
  });

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(COUNTER_KEY);
      if (stored) setLiveCount(Number(stored));
    } catch (e) {
      // localStorage unavailable (private mode, SSR edge) — fall back silently
    }
  }, []);

  const registerPayment = () => {
    setLiveCount((prev) => {
      const next = prev + 1;
      try {
        window.localStorage.setItem(COUNTER_KEY, String(next));
      } catch (e) {}
      return next;
    });
  };

  const updateSession = (key, value) => {
    setSession((prev) => ({ ...prev, [key]: value }));
  };

  const resetSession = (key) => {
    setSession((prev) => ({ ...prev, [key]: null }));
  };

  const value = useMemo(
    () => ({ liveCount, registerPayment, session, updateSession, resetSession }),
    [liveCount, session]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
