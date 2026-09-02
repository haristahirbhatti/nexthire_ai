"use client";

import { useState } from "react";
import { CreditCard, Wallet, ShieldCheck, Loader2 } from "lucide-react";

const METHODS = [
  { id: "paypal", label: "PayPal", icon: Wallet },
  { id: "googlepay", label: "Google Pay", icon: Wallet },
  { id: "visa", label: "Visa", icon: CreditCard },
];

export default function PaymentGateway({ amount = "24.00", description, onPaid }) {
  const [method, setMethod] = useState("visa");
  const [status, setStatus] = useState("idle");
  const invoiceId = useState(() => `NH-${Math.floor(100000 + Math.random() * 899999)}`)[0];

  const pay = () => {
    setStatus("processing");
    setTimeout(() => {
      setStatus("paid");
      onPaid?.({ invoiceId, method, amount });
    }, 1200);
  };

  if (status === "paid") {
    return (
      <div className="rounded-2xl border border-gold-500/40 bg-canvas-card p-6 text-center sm:p-8">
        <ShieldCheck className="mx-auto h-8 w-8 text-gold-500" />
        <p className="mt-3 font-display text-xl font-semibold text-text-primary">Payment confirmed</p>
        <p className="mt-1 text-sm text-text-secondary">
          Invoice <span className="font-mono text-gold-400">{invoiceId}</span> — ${amount} via{" "}
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
        <p className="font-mono text-2xl font-semibold text-gold-400">${amount}</p>
      </div>

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
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={pay}
        disabled={status === "processing"}
        className="btn-gold mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-canvas disabled:opacity-70"
      >
        {status === "processing" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Verifying payment…
          </>
        ) : (
          `Pay $${amount} securely`
        )}
      </button>
      <p className="mt-3 text-center text-xs text-text-muted">
        An electronic invoice is issued automatically after verification.
      </p>
    </div>
  );
}
