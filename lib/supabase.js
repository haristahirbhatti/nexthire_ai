import { createClient } from "@supabase/supabase-js";

let _supabase = null;
let _cachedUrl = null;
let _cachedKey = null;

/**
 * Normalizes user-entered Supabase URL.
 * Automatically fixes common mistakes like pasting the dashboard URL
 * (e.g. https://supabase.com/dashboard/project/abcdefghijk) instead of the API URL.
 */
export function normalizeSupabaseUrl(rawUrl) {
  if (!rawUrl) return "";
  let url = String(rawUrl).trim().replace(/^["']|["']$/g, "").trim();

  // If user pasted the dashboard URL, extract the project reference
  // e.g. https://supabase.com/dashboard/project/xyzabcdef12345/settings/api
  const dashboardMatch = url.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/i);
  if (dashboardMatch && dashboardMatch[1]) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, "");

  // Ensure protocol exists
  if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  return url;
}

/**
 * Normalizes Supabase API key (strips quotes and whitespace).
 */
export function normalizeSupabaseKey(rawKey) {
  if (!rawKey) return "";
  return String(rawKey).trim().replace(/^["']|["']$/g, "").trim();
}

/**
 * Returns a Supabase client using the service role key for trusted server operations.
 * Returns null if Supabase environment variables are not configured.
 */
export function getSupabaseClient() {
  const rawUrl = process.env.SUPABASE_URL;
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const url = normalizeSupabaseUrl(rawUrl);
  const key = normalizeSupabaseKey(rawKey);

  if (!url || !key) {
    return null;
  }

  // If URL or key changed, recreate client
  if (!_supabase || _cachedUrl !== url || _cachedKey !== key) {
    _cachedUrl = url;
    _cachedKey = key;
    _supabase = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return _supabase;
}

/**
 * Check whether Supabase is configured in environment variables.
 */
export function isSupabaseConfigured() {
  const url = normalizeSupabaseUrl(process.env.SUPABASE_URL);
  const key = normalizeSupabaseKey(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return Boolean(url && key);
}
