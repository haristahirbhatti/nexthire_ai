import { NextResponse } from "next/server";
import { validatePassword, createSessionToken, ADMIN_COOKIE_CONFIG } from "@/lib/adminAuth";

export const runtime = "nodejs";

/**
 * POST /api/admin/login
 * Validates admin password and sets HTTP-only session cookie.
 */
export async function POST(req) {
  try {
    const { password } = await req.json().catch(() => ({}));

    if (!password || !validatePassword(password)) {
      return NextResponse.json(
        { error: "Invalid admin password. Access denied." },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
    });

    response.cookies.set({
      ...ADMIN_COOKIE_CONFIG,
      value: token,
    });

    return response;
  } catch (error) {
    console.error("[admin/login] Error:", error);
    return NextResponse.json(
      { error: "Authentication service error." },
      { status: 500 }
    );
  }
}
