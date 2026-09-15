import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * GET /api/admin/session
 * Checks whether the current visitor has an active, authenticated admin session.
 */
export async function GET(req) {
  const isAuthenticated = verifyAdminRequest(req);
  return NextResponse.json({
    authenticated: isAuthenticated,
    supabaseConfigured: isSupabaseConfigured(),
  });
}
