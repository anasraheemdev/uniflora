"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const jar = await cookies();
  jar.delete("uf-role");
  jar.delete("uf-email");
  jar.delete("uf-name");
  redirect("/login");
}
