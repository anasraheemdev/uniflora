import { createClient } from "@/lib/supabase/server";
import type { SessionUser } from "@/types/auth";

/**
 * Current signed-in user, joined with their `profiles` row for role/name.
 * Uses `getUser()` rather than reading the session cookie's claims directly —
 * it revalidates the token against Supabase Auth on every call, which is the
 * documented-safe way to check identity in a server context.
 */
export async function getSession(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();
  if (!profile) return null;

  return {
    role: profile.role,
    email: profile.email ?? user.email ?? "",
    name: profile.full_name ?? "UniFlora User",
  };
}

/**
 * The signed-in Supabase auth user's id (the `profiles.id` / every FK
 * column that points at a user). `SessionUser` deliberately doesn't carry
 * this — it's an internal key, not display data — so dashboard pages that
 * need to scope a query to "my own rows" call this alongside `getSession()`.
 */
export async function getSessionUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}
