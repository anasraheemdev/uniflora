/**
 * Creates the 3 demo accounts (same emails/passwords the app has always
 * shown on the login page) as real Supabase Auth users, with their role set
 * via user metadata — `handle_new_user()` (0002_profiles.sql) picks that up
 * and creates the matching `profiles` row automatically.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY. Safe to re-run: an account that
 * already exists gets its profile role/name corrected instead of erroring.
 *
 * Usage:
 *   npx tsx scripts/seed-demo-users.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import { DEMO_ACCOUNTS } from "../src/types/auth";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function ensureDemoUser(account: (typeof DEMO_ACCOUNTS)[number]) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: { role: account.role, full_name: account.name },
  });

  if (!error) {
    console.log(`  created ${account.email} (${account.role})`);
    return;
  }

  if (!/already been registered|already exists/i.test(error.message)) {
    throw error;
  }

  // Already seeded on a previous run — just make sure the profile matches.
  const { data: existing, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) throw listError;
  const user = existing.users.find((u) => u.email === account.email);
  if (!user) throw new Error(`${account.email} reported as existing but not found in listUsers()`);

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: user.id, role: account.role, full_name: account.name, email: account.email }, { onConflict: "id" });
  if (profileError) throw profileError;
  console.log(`  already existed — profile confirmed for ${account.email} (${account.role})`);
}

async function main() {
  for (const account of DEMO_ACCOUNTS) {
    await ensureDemoUser(account);
  }
  console.log("\nDone. Sign in at /login with the same 3 accounts as before.");
}

main().catch((err) => {
  console.error("Seeding demo users failed:", err);
  process.exit(1);
});
