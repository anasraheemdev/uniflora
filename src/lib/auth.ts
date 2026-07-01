import { cookies } from "next/headers";
import type { SessionUser, UserRole } from "@/types/auth";

const ROLE_COOKIE = "uf-role";
const EMAIL_COOKIE = "uf-email";
const NAME_COOKIE = "uf-name";

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const role = jar.get(ROLE_COOKIE)?.value as UserRole | undefined;
  if (!role || !["admin", "contributor", "student"].includes(role)) return null;

  return {
    role,
    email: jar.get(EMAIL_COOKIE)?.value ?? `${role}@uniflora.edu`,
    name: jar.get(NAME_COOKIE)?.value ?? "UniFlora User",
  };
}
