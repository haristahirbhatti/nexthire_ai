"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  DollarSign,
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  HelpCircle,
} from "lucide-react";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard state
  const [products, setProducts] = useState([]);
  const [isConnectedToSupabase, setIsConnectedToSupabase] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [editingPrices, setEditingPrices] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [saveMessages, setSaveMessages] = useState({});
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Check current session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      if (data.authenticated) {
        setAuthenticated(true);
        await loadPrices();
      } else {
        setAuthenticated(false);
      }
    } catch (err) {
      console.error("Session check error:", err);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const loadPrices = async () => {
    try {
      const res = await fetch("/api/admin/prices");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
        setIsConnectedToSupabase(data.isConnectedToSupabase);
        setIsConfigured(data.isConfigured);

        // Initialize price inputs
        const initialMap = {};
        for (const p of data.products) {
          initialMap[p.id] = String(p.amount);
        }
        setEditingPrices(initialMap);
      }
    } catch (err) {
      console.error("Failed to load admin prices:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Incorrect password.");
      }

      setAuthenticated(true);
      setPassword("");
      await loadPrices();
    } catch (err) {
      setLoginError(err.message || "Failed to sign in.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setAuthenticated(false);
      setProducts([]);
    }
  };

  const handleUpdatePrice = async (productId) => {
    const newAmount = editingPrices[productId];
    if (!newAmount || isNaN(parseFloat(newAmount)) || parseFloat(newAmount) <= 0) {
      setSaveMessages((prev) => ({
        ...prev,
        [productId]: { type: "error", text: "Please enter a valid positive price." },
      }));
      return;
    }

    setSavingId(productId);
    setSaveMessages((prev) => ({ ...prev, [productId]: null }));

    try {
      const res = await fetch("/api/admin/prices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, amount: newAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update price.");
      }

      setSaveMessages((prev) => ({
        ...prev,
        [productId]: { type: "success", text: `Price updated to $${parseFloat(newAmount).toFixed(2)}!` },
      }));

      // Reload fresh prices
      await loadPrices();
    } catch (err) {
      setSaveMessages((prev) => ({
        ...prev,
        [productId]: { type: "error", text: err.message },
      }));
    } finally {
      setSavingId(null);
    }
  };

  const copySql = () => {
    const sql = `-- Run this in Supabase SQL Editor:
create table if not exists public.prices (
  id text primary key,
  name text not null,
  description text,
  amount numeric(10,2) not null check (amount > 0),
  currency text not null default 'usd',
  updated_at timestamptz not null default now()
);

insert into public.prices (id, name, description, amount, currency, updated_at)
values
  ('interview', 'AI Mock Interview', 'AI Mock Interview — 15-minute session', 9.99, 'usd', now()),
  ('cv-package', 'Complete CV Package', 'Professional CV Preparation & Career Services', 24.00, 'usd', now())
on conflict (id) do nothing;

alter table public.prices enable row level security;
create policy "Allow public read access to prices" on public.prices for select to anon, authenticated using (true);
create policy "Allow service role full access" on public.prices for all to service_role using (true) with check (true);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 1. LOGIN SCREEN
  // ─────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
        <div className="card-dark w-full max-w-md rounded-2xl p-8 sm:p-10 animate-fadeIn">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-400">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-semibold text-text-primary sm:text-3xl">
              NextHire Admin
            </h1>
            <p className="mt-2 text-xs text-text-secondary sm:text-sm">
              Secure price control and database settings.
            </p>
          </div>

          {loginError && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-400 animate-fadeIn">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-muted">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                autoFocus
                className="input-dark w-full rounded-xl px-4 py-3.5 text-sm text-text-primary outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold disabled:opacity-50"
            >
              {loggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Sign in to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-canvas-border pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary"
            >
              ← Back to NextHire.ai
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. AUTHENTICATED DASHBOARD
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-canvas pb-24 pt-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        {/* Top Navbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-border pb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-xl font-semibold text-text-primary sm:text-2xl">
                NextHire.ai Admin
              </h1>
              <p className="font-mono text-xs text-text-muted">
                Server-Side Price Authority & Database Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Database Status Badge */}
            {isConnectedToSupabase ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-medium text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-xs font-medium text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Local Fallback Mode
              </span>
            )}

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-canvas-border bg-canvas-mid px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary"
            >
              Live Site
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Security Banner */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/5 p-4 sm:p-5">
          <ShieldCheck className="h-5 w-5 flex-shrink-0 text-gold-400 mt-0.5" />
          <div className="text-xs text-text-secondary sm:text-sm">
            <span className="font-semibold text-text-primary">
              Security Protection Active:
            </span>{" "}
            Client-side checkout manipulation is permanently disabled. Stripe checkout sessions resolve prices
            strictly from this server-side source of truth. Any modified client parameters (like $0.01) are automatically rejected.
          </div>
        </div>

        {/* Database Notice if not connected to Supabase */}
        {!isConnectedToSupabase && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <div className="text-xs text-text-secondary sm:text-sm">
                <span className="font-semibold text-amber-300">
                  Running on In-Memory Fallback:
                </span>{" "}
                Prices can be updated immediately and will apply to all checkouts, but will reset on server restart until Supabase is connected.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSqlGuide(!showSqlGuide)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              {showSqlGuide ? "Hide Setup Guide" : "View Supabase Setup"}
            </button>
          </div>
        )}

        {/* Supabase SQL Guide Accordion */}
        {showSqlGuide && (
          <div className="mt-4 card-dark rounded-2xl p-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-text-primary">
                Supabase 2-Minute Setup
              </h3>
              <button
                type="button"
                onClick={copySql}
                className="inline-flex items-center gap-1.5 rounded-lg border border-canvas-border bg-canvas-mid px-3 py-1.5 text-xs text-text-primary hover:border-gold-500/40"
              >
                {copiedSql ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Copied SQL!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-gold-400" />
                    Copy SQL Script
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-text-secondary leading-relaxed">
              1. Open your Supabase Project → <strong>SQL Editor</strong> → Paste and Run the script below.<br />
              2. In your <code>.env.local</code> (or Vercel settings), set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>.
            </p>
            <pre className="mt-4 max-h-48 overflow-x-auto rounded-xl bg-canvas-mid p-4 font-mono text-[11px] text-text-muted">
{`-- Run in Supabase SQL Editor:
create table if not exists public.prices (
  id text primary key,
  name text not null,
  description text,
  amount numeric(10,2) not null check (amount > 0),
  currency text not null default 'usd',
  updated_at timestamptz not null default now()
);

insert into public.prices (id, name, description, amount, currency, updated_at)
values
  ('interview', 'AI Mock Interview', 'AI Mock Interview — 15-minute session', 9.99, 'usd', now()),
  ('cv-package', 'Complete CV Package', 'Professional CV Preparation & Career Services', 24.00, 'usd', now())
on conflict (id) do nothing;

alter table public.prices enable row level security;
create policy "Allow public read access to prices" on public.prices for select to anon, authenticated using (true);
create policy "Allow service role full access" on public.prices for all to service_role using (true) with check (true);`}
            </pre>
          </div>
        )}

        {/* Dynamic Price Editor Cards */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-text-primary">
                Product Pricing
              </h2>
              <p className="text-xs text-text-secondary sm:text-sm">
                Updates take effect immediately on checkout and all user-facing pricing labels.
              </p>
            </div>
            <button
              type="button"
              onClick={loadPrices}
              className="inline-flex items-center gap-1.5 rounded-xl border border-canvas-border bg-canvas-mid px-3 py-2 text-xs text-text-secondary hover:text-text-primary"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {products.map((p) => {
              const msg = saveMessages[p.id];
              const isSaving = savingId === p.id;

              return (
                <div key={p.id} className="card-dark rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-gold-400">
                          PRODUCT ID: {p.id}
                        </span>
                        <h3 className="mt-1 font-display text-xl font-semibold text-text-primary">
                          {p.name}
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-text-muted capitalize">
                        {p.source || "default"}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-text-secondary sm:text-sm">
                      {p.description}
                    </p>

                    {/* Current Price Display */}
                    <div className="mt-6 rounded-xl border border-canvas-border bg-canvas-mid p-4">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
                        Active Charged Price
                      </p>
                      <p className="mt-1 font-mono text-3xl font-semibold text-gold-400">
                        ${Number(p.amount).toFixed(2)}
                      </p>
                      {p.updated_at && (
                        <p className="mt-1 text-[10px] font-mono text-text-muted">
                          Last modified: {new Date(p.updated_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Edit Form */}
                  <div className="mt-6 pt-4 border-t border-canvas-border">
                    <label className="block font-mono text-xs uppercase tracking-wider text-text-muted mb-2">
                      Change Price (USD)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.50"
                          value={editingPrices[p.id] ?? p.amount}
                          onChange={(e) =>
                            setEditingPrices((prev) => ({
                              ...prev,
                              [p.id]: e.target.value,
                            }))
                          }
                          className="input-dark w-full rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono text-text-primary outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUpdatePrice(p.id)}
                        disabled={isSaving}
                        className="btn-gold flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Price"
                        )}
                      </button>
                    </div>

                    {msg && (
                      <div
                        className={`mt-3 flex items-center gap-1.5 text-xs font-mono animate-fadeIn ${
                          msg.type === "success" ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {msg.type === "success" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        )}
                        <span>{msg.text}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
