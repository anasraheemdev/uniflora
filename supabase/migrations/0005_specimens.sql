-- Herbarium voucher specimens. Empty until the physical herbarium is
-- digitised (matches src/data/specimens.ts today) — contributors fill this
-- in via the dashboard as sheets are scanned.

create table public.specimens (
  id uuid primary key default gen_random_uuid(),
  species_id uuid not null references public.species (id) on delete cascade,
  voucher_number text not null,
  collector text not null,
  collected_year text,
  barcode text,
  image_url text,
  digitized_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index specimens_species_id_idx on public.specimens (species_id);

alter table public.specimens enable row level security;

create policy "specimens are publicly readable" on public.specimens for select using (true);
create policy "specimens are writable by contributors and admins" on public.specimens for all
  using (public.is_contributor_or_admin()) with check (public.is_contributor_or_admin());
