-- Taxonomy — families, species, and the curated botanical write-up layer.
-- Field-for-field mirror of `Family` (src/data/families.ts) and `Plant`
-- (src/data/plants.ts) so the migration script in Phase B is a straight copy.

create table public.families (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  letter text not null,
  order_name text,
  common_name text,
  genera text[] not null default '{}',
  species_count int not null default 0,
  occurrences int not null default 0,
  habits text[] not null default '{}',
  cultivated int not null default 0,
  wild int not null default 0,
  description text,
  characteristics text[] not null default '{}',
  distribution text,
  economic_uses text[] not null default '{}'
);

comment on table public.families is 'Plant families. species_count/occurrences/cultivated/wild/habits/genera are kept in sync by refresh_family_aggregates().';

create table public.species (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  scientific_name text not null,
  author text,
  common_name text not null,
  local_names text[] not null default '{}',
  family_id uuid not null references public.families (id) on delete restrict,
  genus text not null,
  type public.plant_type not null,
  habit text not null,
  life_form public.life_form not null,
  growth_status public.growth_status not null,
  layer public.map_layer not null,
  badge_color text not null default '#2f6b3f',
  has_image boolean not null default false,
  -- Denormalized count of this species' rows in plant_markers — kept in sync
  -- by refresh_species_occurrences() (defined in 0005, once that table exists).
  occurrences int not null default 0
);

create index species_family_id_idx on public.species (family_id);
create index species_scientific_name_idx on public.species (scientific_name);

create table public.species_profiles (
  species_id uuid primary key references public.species (id) on delete cascade,
  native_status public.native_status,
  medicinal boolean not null default false,
  height text,
  habitat text,
  conservation_status text,
  description text[] not null default '{}',
  diagnostic_characters jsonb not null default '[]',   -- [{ label, value }]
  phenology jsonb,                                       -- { flowering:int[], fruiting:int[], floweringLabel, fruitingLabel }
  ethnobotany jsonb not null default '[]',               -- [{ title, text }]
  "references" text[] not null default '{}',
  voucher jsonb,                                         -- { number, collector, date, barcode }
  updated_by uuid references public.profiles (id),
  updated_at timestamptz not null default now()
);

comment on table public.species_profiles is 'Curated botanical write-up (was src/data/curated.ts). Separate from species so contributors can be granted write access without touching core taxonomy.';

-- Recompute one family's rollup columns from its current species rows.
create function public.refresh_family_aggregates(target_family_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.families f set
    species_count = agg.species_count,
    occurrences = agg.occurrences,
    cultivated = agg.cultivated,
    wild = agg.wild,
    genera = agg.genera,
    habits = agg.habits
  from (
    select
      count(*) as species_count,
      coalesce(sum(occurrences), 0) as occurrences,
      count(*) filter (where growth_status = 'Cultivated') as cultivated,
      count(*) filter (where growth_status = 'Wild') as wild,
      coalesce(array_agg(distinct genus order by genus), '{}') as genera,
      coalesce(array_agg(distinct habit order by habit), '{}') as habits
    from public.species
    where family_id = target_family_id
  ) agg
  where f.id = target_family_id;
end;
$$;

create function public.on_species_change_refresh_family()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.refresh_family_aggregates(old.family_id);
    return old;
  end if;

  perform public.refresh_family_aggregates(new.family_id);
  if tg_op = 'UPDATE' and old.family_id is distinct from new.family_id then
    perform public.refresh_family_aggregates(old.family_id);
  end if;
  return new;
end;
$$;

create trigger species_refresh_family_aggregates
  after insert or update of family_id, growth_status, genus, habit or delete on public.species
  for each row execute function public.on_species_change_refresh_family();

alter table public.families enable row level security;
alter table public.species enable row level security;
alter table public.species_profiles enable row level security;

create policy "families are publicly readable" on public.families for select using (true);
create policy "families are writable by admins" on public.families for all
  using (public.is_admin()) with check (public.is_admin());

create policy "species are publicly readable" on public.species for select using (true);
create policy "species are writable by admins" on public.species for all
  using (public.is_admin()) with check (public.is_admin());

create policy "species profiles are publicly readable" on public.species_profiles for select using (true);
create policy "species profiles are writable by contributors and admins" on public.species_profiles for all
  using (public.is_contributor_or_admin()) with check (public.is_contributor_or_admin());
