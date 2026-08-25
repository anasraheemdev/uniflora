import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 * Reads/writes the session via the request's cookies. Call this fresh inside
 * every server function that needs it — the underlying cookie store is
 * request-scoped in the App Router, so it can't be created once at module
 * load like the browser client can.
 *
 * Server Components can't write cookies (Next.js throws if you try outside a
 * Server Action/Route Handler); the try/catch below swallows that so a
 * background session-refresh write from supabase-js never crashes a page
 * render — `src/middleware.ts` is what actually persists the refreshed
 * session on every request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component render — middleware refreshes
            // the session cookie instead. Safe to ignore.
          }
        },
      },
    },
  );
}

/**
 * Service-role client — bypasses Row Level Security entirely. Server-only:
 * migration/seed scripts and any server action that must act across users
 * (e.g. a contributor approving another user's submission touches
 * `activity_log`, which normal users can't INSERT into). Never import this
 * from a Client Component or anything that ships to the browser.
 */
export function createServiceRoleClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  );
}
