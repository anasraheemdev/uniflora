import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLES = ["admin", "contributor", "student"] as const;

export function middleware(request: NextRequest) {
  const role = request.cookies.get("uf-role")?.value;
  const { pathname } = request.nextUrl;

  if (!role || !ROLES.includes(role as (typeof ROLES)[number])) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
