"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_ACCOUNTS, roleDashboardPath } from "@/types/auth";
import type { UserRole } from "@/types/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as UserRole;

  if (!["admin", "contributor", "student"].includes(role)) {
    redirect(`/login?error=${encodeURIComponent("Please select a valid role.")}`);
  }

  const account = DEMO_ACCOUNTS.find((a) => a.role === role);
  if (!account || email !== account.email || password !== account.password) {
    redirect(`/login?error=${encodeURIComponent("Invalid email or password for the selected role.")}`);
  }

  const jar = await cookies();
  const opts = { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 };
  jar.set("uf-role", role, opts);
  jar.set("uf-email", account.email, opts);
  jar.set("uf-name", account.name, opts);

  redirect(roleDashboardPath(role));
}
