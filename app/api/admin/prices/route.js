import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { getAllPrices, updateProductPrice } from "@/lib/pricing";
import { isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * GET /api/admin/prices
 * Protected: returns all products and prices with database status.
 */
export async function GET(req) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  try {
    const data = await getAllPrices();
    return NextResponse.json({
      success: true,
      products: data.products,
      isConnectedToSupabase: data.isConnectedToSupabase,
      isConfigured: isSupabaseConfigured(),
    });
  } catch (error) {
    console.error("[admin/prices GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin prices." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/prices
 * Protected: updates product price in database.
 * Body: { productId: string, amount: number }
 */
export async function PUT(req) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { productId, amount } = body;

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid productId." },
        { status: 400 }
      );
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid price: amount must be a positive number greater than 0." },
        { status: 400 }
      );
    }

    const updated = await updateProductPrice(productId, numAmount);

    return NextResponse.json({
      success: true,
      product: updated,
      message: `Price for ${updated.name || productId} updated to $${Number(updated.amount).toFixed(2)}.`,
    });
  } catch (error) {
    console.error("[admin/prices PUT] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update price." },
      { status: 500 }
    );
  }
}
