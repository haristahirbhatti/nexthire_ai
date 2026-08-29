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
  const [status, setStatus] = useState("idle"); // idle | processing | paid
  const invoiceId = useState(() => `NH-${Math.floor(100000 + Math.random() * 899999)}`)[0];

  const pay = () => {
    setStatus("processing");
    setTimeout(() => {
      setStatus("paid");
      onPaid?.({ invoiceId, method, amount });
    }, 1400);
  };

  if (status === "paid") {
    return (
      <div className="rounded-2xl border border-ready-100 bg-ready-50 p-6 text-center sm:p-8">
        <ShieldCheck className="mx-auto h-8 w-8 text-ready-600" />
        <p className="mt-3 font-display text-xl font-semibold text-ink">Payment confirmed</p>
        <p className="mt-1 text-sm text-ink-soft">
          Invoice <span className="font-mono text-ink">{invoiceId}</span> — ${amount} via{" "}
          {METHODS.find((m) => m.id === method)?.label}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-panel sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xl font-semibold text-ink">Secure checkout</p>
          <p className="text-sm text-ink-soft">{description}</p>
        </div>
        <p className="font-mono text-2xl text-ink">${amount}</p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {METHODS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMethod(id)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition ${
              method === id
                ? "border-ready-500 bg-ready-50 text-ready-700"
                : "border-line text-ink-soft hover:border-ink-soft"
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
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-ready-600 disabled:opacity-70"
      >
        {status === "processing" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Verifying payment…
          </>
        ) : (
          `Pay $${amount} securely`
        )}
      </button>
      <p className="mt-3 text-center text-xs text-ink-soft">
        An electronic invoice is issued automatically after verification.
      </p>
    </div>
  );
}
