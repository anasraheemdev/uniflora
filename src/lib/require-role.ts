import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import type { UserRole } from "@/types/auth";

export async function requireRole(allowed: UserRole | UserRole[]) {
  const session = await getSession();
  if (!session) redirect("/login");
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  if (!roles.includes(session.role)) redirect(`/dashboard/${session.role}`);
  return session;
}
