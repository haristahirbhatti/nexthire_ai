import { NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * POST /api/verify-payment
 * Body: { sessionId: string }
 * Returns: { verified: boolean, invoiceId?: string }
 *
 * Server-side verification of Stripe checkout session.
 * Prevents URL manipulation (e.g. manually adding ?payment=success).
 */
export async function POST(req) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ verified: false, error: "No session ID provided." });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ verified: false, error: "Payment system not configured." });
    }

    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return NextResponse.json({
        verified: true,
        invoiceId: session.id,
        amount: (session.amount_total / 100).toFixed(2),
        customerEmail: session.customer_details?.email || "",
      });
    }

    return NextResponse.json({
      verified: false,
      error: "Payment has not been completed.",
    });
  } catch (error) {
    console.error("[verify-payment] Error:", error);
    return NextResponse.json(
      { verified: false, error: "Failed to verify payment." },
      { status: 500 }
    );
  }
}
