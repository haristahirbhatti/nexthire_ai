import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductPrice } from "@/lib/pricing";

export const runtime = "nodejs";

/**
 * POST /api/create-checkout-session
 *
 * SECURE CHECKOUT ENDPOINT:
 * - Completely ignores and discards any client-supplied `amount` parameter.
 * - Resolves the trusted product price exclusively from the server-side source of truth.
 * - Prevents client-side price tampering (e.g. dev-tools manipulation to $0.01).
 *
 * Body: { productId: 'interview' | 'cv-package', returnUrl?: string }
 */
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { productId, description: clientDesc, returnUrl } = body;

    // Detect product ID (or deduce from legacy description if not explicitly provided)
    let targetProductId = (productId || "").trim().toLowerCase();
    if (!targetProductId) {
      const lowerDesc = String(clientDesc || "").toLowerCase();
      if (lowerDesc.includes("cv") || lowerDesc.includes("prep") || lowerDesc.includes("career")) {
        targetProductId = "cv-package";
      } else {
        targetProductId = "interview";
      }
    }

    // ── CRITICAL SECURITY CHECK: Fetch trusted price from server source of truth ──
    const product = await getProductPrice(targetProductId);

    // Calculate unit amount in cents strictly from the verified server price
    const unitAmountCents = Math.round(product.amount * 100);
    if (!unitAmountCents || unitAmountCents <= 0) {
      return NextResponse.json(
        { error: "Invalid product pricing detected. Please contact support." },
        { status: 500 }
      );
    }

    const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

    if (!secretKey) {
      // Mock payment simulation when Stripe is not yet configured
      return NextResponse.json({
        mock: true,
        invoiceId: `NH-${Math.floor(100000 + Math.random() * 899999)}`,
        verifiedAmount: product.amount,
        productId: product.id,
        message: "Stripe test mode simulation (Add STRIPE_SECRET_KEY to enable live checkout).",
      });
    }

    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: product.currency || "usd",
            product_data: {
              name: product.name,
              description: product.description || "NextHire.ai verified service access.",
            },
            unit_amount: unitAmountCents, // Verified server-side amount!
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        productId: product.id,
        verifiedAmount: String(product.amount),
      },
      success_url: returnUrl
        ? `${returnUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`
        : `http://localhost:3000?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: returnUrl
        ? `${returnUrl}?payment=cancelled`
        : "http://localhost:3000?payment=cancelled",
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      verifiedPrice: product.amount,
    });
  } catch (error) {
    console.error("[create-checkout-session] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Stripe checkout session." },
      { status: 500 }
    );
  }
}
