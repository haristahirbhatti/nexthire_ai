import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

function getSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    "nexthire_admin_secret_key_32_characters_minimum_string"
  );
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || "admin123456";
}

/**
 * Validates the provided admin password.
 */
export function validatePassword(password) {
  if (!password || typeof password !== "string") return false;
  const expected = getAdminPassword();
  // Safe comparison
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Creates a signed session token valid for 12 hours.
 */
export function createSessionToken() {
  const secret = getSecret();
  const payload = {
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    nonce: crypto.randomBytes(8).toString("hex"),
  };

  const payloadStr = JSON.stringify(payload);
  const encodedPayload = Buffer.from(payloadStr).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies a signed session token.
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return false;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const secret = getSecret();
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }

  try {
    const payloadJson = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return false; // Expired
    }
    return payload.role === "admin";
  } catch (_) {
    return false;
  }
}

/**
 * Inspects a NextRequest or standard Request to verify admin session from cookie.
 */
export function verifyAdminRequest(request) {
  let token = null;

  // NextRequest cookies helper
  if (request.cookies && typeof request.cookies.get === "function") {
    token = request.cookies.get(COOKIE_NAME)?.value;
  }

  // Raw Cookie header fallback
  if (!token) {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    if (match) {
      token = match[1];
    }
  }

  return verifySessionToken(token);
}

export const ADMIN_COOKIE_CONFIG = {
  name: COOKIE_NAME,
  maxAge: SESSION_DURATION_SECONDS,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};
