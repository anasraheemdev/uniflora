-- Campus map — settings, zones, and every individually GPS'd plant.
-- This is "the map data": campus_zones + plant_markers are exactly what
-- src/app/map/page.tsx fetches to feed MapExplorer, replacing the static
-- src/data/generated/{campus,markers}.json bundled today.

create table public.campus_settings (
  id boolean primary key default true check (id),  -- singleton row
  center_lat double precision not null,
  center_lng double precision not null,
  bounds jsonb not null,   -- [[lat,lng],[lat,lng]] south-west / north-east
  zoom int not null
);

comment on table public.campus_settings is 'Single-row map configuration (center/bounds/default zoom).';

create table public.campus_zones (
  id text primary key,          -- 'zone-a' …
  name text not null,
  short_name text not null,
  color text not null,
  center_lat double precision not null,
  center_lng double precision not null,
  polygon jsonb not null,       -- [[lat,lng], …] — zero-transform for Leaflet
  polygon_geog geography(polygon, 4326),   -- mirror, for future ST_Contains/nearest queries
  plant_count int not null default 0
);

create table public.plant_markers (
  id text primary key,          -- 'A-0001' …
  species_id uuid not null references public.species (id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  location geography(point, 4326) generated always as (
    st_setsrid(st_makepoint(lng, lat), 4326)::geography
  ) stored,
  zone_id text not null references public.campus_zones (id) on delete restrict,
  layer public.map_layer not null
);

create index plant_markers_species_id_idx on public.plant_markers (species_id);
create index plant_markers_zone_id_idx on public.plant_markers (zone_id);
create index plant_markers_location_idx on public.plant_markers using gist (location);

-- Keep species.occurrences and campus_zones.plant_count in sync with the
-- marker rows, the same way 0003's trigger keeps families in sync with species.
create function public.refresh_marker_aggregates(target_species_id uuid, target_zone_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if target_species_id is not null then
    update public.species s set occurrences = (
      select count(*) from public.plant_markers where species_id = target_species_id
    ) where s.id = target_species_id;
  end if;

  if target_zone_id is not null then
    update public.campus_zones z set plant_count = (
      select count(*) from public.plant_markers where zone_id = target_zone_id
    ) where z.id = target_zone_id;
  end if;
end;
$$;

create function public.on_marker_change_refresh_aggregates()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.refresh_marker_aggregates(old.species_id, old.zone_id);
    return old;
  end if;

  perform public.refresh_marker_aggregates(new.species_id, new.zone_id);
  if tg_op = 'UPDATE' then
    if old.species_id is distinct from new.species_id then
      perform public.refresh_marker_aggregates(old.species_id, null);
    end if;
    if old.zone_id is distinct from new.zone_id then
      perform public.refresh_marker_aggregates(null, old.zone_id);
    end if;
  end if;
  return new;
end;
$$;

create trigger plant_markers_refresh_aggregates
  after insert or update of species_id, zone_id or delete on public.plant_markers
  for each row execute function public.on_marker_change_refresh_aggregates();

alter table public.campus_settings enable row level security;
alter table public.campus_zones enable row level security;
alter table public.plant_markers enable row level security;

create policy "campus settings are publicly readable" on public.campus_settings for select using (true);
create policy "campus settings are writable by admins" on public.campus_settings for all
  using (public.is_admin()) with check (public.is_admin());

create policy "campus zones are publicly readable" on public.campus_zones for select using (true);
create policy "campus zones are writable by admins" on public.campus_zones for all
  using (public.is_admin()) with check (public.is_admin());

create policy "plant markers are publicly readable" on public.plant_markers for select using (true);
create policy "plant markers are writable by admins" on public.plant_markers for all
  using (public.is_admin()) with check (public.is_admin());
