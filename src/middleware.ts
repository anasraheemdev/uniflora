import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { withCache } from "@/lib/redis";

const ROLES = ["admin", "contributor", "student"] as const;

export async function middleware(request: NextRequest) {
  const { supabase, getResponse } = createMiddlewareClient(request);
  const { pathname } = request.nextUrl;

  // getUser() (not getSession()) revalidates the token against Supabase Auth
  // rather than trusting the cookie's claims — the same reason src/lib/auth.ts
  // uses it in server components.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  // Redis-cached (60s TTL) when configured — avoids a Postgres round trip on
  // every /dashboard/* navigation. Falls straight through to the query when
  // Redis isn't set up. This is a route-gating convenience only: every
  // dashboard page's own requireRole() re-reads the role fresh from Postgres,
  // so a stale cache entry here can misroute a redirect for up to 60s but can
  // never grant access the database wouldn't.
  const role = await withCache(`uf:role:${user.id}`, 60, async () => {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    return profile?.role ?? null;
  });

  if (!role || !ROLES.includes(role)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  const segment = pathname.split("/")[2];
  if (segment && ROLES.includes(segment as (typeof ROLES)[number]) && segment !== role) {
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  return getResponse();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
