import { NextResponse } from "next/server";
import { ADMIN_COOKIE_CONFIG } from "@/lib/adminAuth";

export const runtime = "nodejs";

/**
 * POST /api/admin/logout
 * Clears the admin session cookie.
 */
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.set({
    ...ADMIN_COOKIE_CONFIG,
    value: "",
    maxAge: 0,
  });

  return response;
}
