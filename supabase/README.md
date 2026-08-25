# UniFlora — Supabase backend

## First-time setup

1. Create a project at [supabase.com](https://supabase.com) (or use an
   existing one).
2. Copy **Project Settings → API**: `Project URL`, `anon public` key, and
   `service_role` key (click "reveal") into `.env.local` (copy `.env.example`
   first) as `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY`.
3. Run the migrations, in order — either:
   - **Supabase Dashboard → SQL Editor**: open each file in
     `supabase/migrations/` in numeric order and run it, **or**
   - **Supabase CLI**: `npx supabase login`, `npx supabase link --project-ref <ref>`,
     then `npx supabase db push`.
4. Seed the catalogue and demo accounts (needs `SUPABASE_SERVICE_ROLE_KEY` in
   `.env.local`):
   ```bash
   node scripts/migrate_to_supabase.mjs
   node scripts/seed_demo_users.mjs
   ```
5. (Optional but recommended) regenerate real TypeScript types now that the
   project exists, replacing the hand-written `src/types/supabase.ts`:
   ```bash
   npx supabase gen types typescript --project-id <ref> > src/types/supabase.ts
   ```

## What's in `migrations/`

Run in filename order — later files reference tables/functions created by
earlier ones:

| File | Creates |
| --- | --- |
| `0001_extensions_and_enums.sql` | `pgcrypto`, `postgis`; every enum type |
| `0002_profiles.sql` | `profiles`, the `auth.users` → `profiles` signup trigger, `is_admin()`/`is_contributor_or_admin()` helpers, role-change guard |
| `0003_taxonomy.sql` | `families`, `species`, `species_profiles`, family-rollup trigger |
| `0004_campus_map.sql` | `campus_settings`, `campus_zones`, `plant_markers`, occurrence/plant-count triggers |
| `0005_specimens.sql` | `specimens` (herbarium vouchers) |
| `0006_workflow.sql` | `submissions`, `activity_log`, `learning_modules` (+ 3 seed rows), `learning_progress`, activity-logging trigger |
| `0007_storage.sql` | the public `plant-photos` Storage bucket + its access policies |

Every table has Row Level Security **on**. See the plan doc for the RLS
summary, or read the policies directly in each migration — they're right
next to the table they govern.

## Roles

Three roles, stored in `profiles.role`: `admin`, `contributor`, `student`.
`current_role()` / `is_admin()` / `is_contributor_or_admin()` (all
`SECURITY DEFINER`, defined in `0002_profiles.sql`) are what every other
migration's policies call — use them in any new policy rather than querying
`profiles` directly, to avoid RLS recursion.
