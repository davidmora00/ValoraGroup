import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the SERVICE ROLE key (bypasses RLS).
 * Returns null when Supabase isn't configured, so the app runs without it.
 *
 * NEVER import this into a client component — the `server-only` guard above
 * fails the build if you do, and the service-role key must never reach the
 * browser. (The browser/dashboard should use the anon key + RLS instead.)
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  if (!client) {
    client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
