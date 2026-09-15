import { createClient } from "@supabase/supabase-js";

let _supabase = null;

/**
 * Returns a Supabase client using the service role key for trusted server operations.
 * Returns null if Supabase environment variables are not configured.
 */
export function getSupabaseClient() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    return null;
  }

  if (!_supabase) {
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
  return Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}
