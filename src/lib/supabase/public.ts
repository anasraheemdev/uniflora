import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Anon-key client with no cookie dependency — safe to call from anywhere,
 * including `generateStaticParams` at build time, where there is no request
 * (and therefore no `cookies()`) to read a session from.
 *
 * Used for every read in `@/lib/data`: species, families, campus map,
 * specimens are all public data (RLS grants `SELECT` to everyone), so none
 * of those reads need a signed-in user's session in the first place — the
 * cookie-aware client in `@/lib/supabase/server` is reserved for
 * `@/lib/dashboard-data`, where RLS genuinely depends on `auth.uid()`.
 */
export function createClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
