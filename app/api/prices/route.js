import { NextResponse } from "next/server";
import { getAllPrices } from "@/lib/pricing";

export const runtime = "nodejs";

/**
 * GET /api/prices
 * Public endpoint returning current active prices for all products.
 */
export async function GET() {
  try {
    const data = await getAllPrices();
    return NextResponse.json({
      success: true,
      products: data.products,
      connected: data.isConnectedToSupabase,
    });
  } catch (error) {
    console.error("[api/prices] Error fetching prices:", error);
    return NextResponse.json(
      { error: "Failed to retrieve prices." },
      { status: 500 }
    );
  }
}
