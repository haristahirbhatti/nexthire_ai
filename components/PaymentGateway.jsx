"use client";

import { useState, useEffect } from "react";
import { CreditCard, Wallet, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

const METHODS = [
  { id: "paypal", label: "PayPal", icon: Wallet },
  { id: "googlepay", label: "Google Pay", icon: Wallet },
  { id: "visa", label: "Visa", icon: CreditCard },
];

export default function PaymentGateway({
  productId,
  amount: initialAmount,
  description,
  onPaid,
}) {
  const [method, setMethod] = useState("visa");
  const [status, setStatus] = useState("idle");
  const [invoiceId, setInvoiceId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Determine target product ID
  const targetProductId =
    productId ||
    (description?.toLowerCase().includes("cv") ? "cv-package" : "interview");

  // Dynamic price fetched from server-side source of truth
  const [liveAmount, setLiveAmount] = useState(
    initialAmount || (targetProductId === "interview" ? "9.99" : "24.00")
  );

  // Fetch verified active price from server
  useEffect(() => {
    let isMounted = true;
    async function fetchLivePrice() {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) return;
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          const match = data.products.find((p) => p.id === targetProductId);
          if (match && match.amount && isMounted) {
            setLiveAmount(Number(match.amount).toFixed(2));
          }
        }
      } catch (err) {
        // Fallback to initial amount
      }
    }
    fetchLivePrice();
    return () => {
      isMounted = false;
    };
  }, [targetProductId]);

  const pay = async () => {
    setStatus("processing");
    setErrorMsg("");
    try {
      // NOTE: We send productId. The server resolves price from database,
      // permanently preventing client-side price tampering.
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: targetProductId,
          description,
          returnUrl: typeof window !== "undefined" ? window.location.href.split("?")[0] : "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment service unavailable. Please try again.");
      }

      if (data.url) {
        // Redirect to live Stripe Checkout page
        window.location.href = data.url;
        return;
      }

      // Stripe key not configured — simulation mode
      if (data.mock) {
        setStatus("error");
        setErrorMsg("Stripe keys not configured. Add STRIPE_SECRET_KEY to enable live checkout.");
        return;
      }

      setStatus("error");
      setErrorMsg("Could not initiate payment. Please try again.");
    } catch (err) {
      console.error("Payment error:", err);
      setStatus("error");
      setErrorMsg(err.message || "Payment failed. Please check your connection and try again.");
    }
  };

  if (status === "paid") {
    return (
      <div className="rounded-2xl border border-gold-500/40 bg-canvas-card p-6 text-center sm:p-8 animate-fadeIn">
        <ShieldCheck className="mx-auto h-8 w-8 text-gold-500" />
        <p className="mt-3 font-display text-xl font-semibold text-text-primary">Payment confirmed</p>
        <p className="mt-1 text-sm text-text-secondary">
          Invoice <span className="font-mono text-gold-400">{invoiceId}</span> — ${liveAmount} via{" "}
          {METHODS.find((m) => m.id === method)?.label}
        </p>
      </div>
    );
  }

  return (
    <div className="card-dark rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xl font-semibold text-text-primary">Secure checkout</p>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <p className="font-mono text-2xl font-semibold text-gold-400">${liveAmount}</p>
      </div>

      {errorMsg && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="mt-6 grid grid-cols-3 gap-2">
        {METHODS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMethod(id)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition ${
              method === id
                ? "border-gold-500 bg-gold-500/10 text-gold-400"
                : "border-canvas-border text-text-secondary hover:border-canvas-muted"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={pay}
        disabled={status === "processing"}
        className="btn-gold mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === "processing" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparing secure checkout…
          </>
        ) : (
          `Pay $${liveAmount} with ${METHODS.find((m) => m.id === method)?.label}`
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-text-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
        <span>256-bit encrypted checkout via Stripe &middot; Instant access</span>
      </div>
    </div>
  );
}
