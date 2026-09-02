import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  try {
    const { amount = "19.00", description = "NextHire.ai Service", returnUrl } = await req.json();

    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      // Mock payment fallback if STRIPE_SECRET_KEY is not set yet
      return NextResponse.json({
        mock: true,
        invoiceId: `NH-${Math.floor(100000 + Math.random() * 899999)}`,
        message: "Stripe test mode simulation (Add STRIPE_SECRET_KEY to enable live checkout).",
      });
    }

    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: description,
              description: "Instant access to NextHire.ai ATS package and interview simulation.",
            },
            unit_amount: Math.round(parseFloat(amount) * 100), // convert to cents ($19.00 -> 1900)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: returnUrl ? `${returnUrl}?payment=success` : "http://localhost:3000?payment=success",
      cancel_url: returnUrl ? `${returnUrl}?payment=cancelled` : "http://localhost:3000?payment=cancelled",
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error("[create-checkout-session] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Stripe checkout session." },
      { status: 500 }
    );
  }
}
