"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { roleDashboardPath } from "@/types/auth";
import type { UserRole } from "@/types/auth";

const ROLES: UserRole[] = ["admin", "contributor", "student"];

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as UserRole;

  if (!ROLES.includes(role)) {
    redirect(`/login?error=${encodeURIComponent("Please select a valid role.")}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect(`/login?error=${encodeURIComponent("Invalid email or password.")}`);
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();

  if (!profile) {
    await supabase.auth.signOut();
    redirect(`/login?error=${encodeURIComponent("Account has no profile — contact an admin.")}`);
  }

  if (profile.role !== role) {
    await supabase.auth.signOut();
    redirect(`/login?error=${encodeURIComponent("That account isn't registered with the selected role.")}`);
  }

  redirect(roleDashboardPath(profile.role));
}
