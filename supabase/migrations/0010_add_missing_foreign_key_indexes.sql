-- Supabase performance advisor: these FK columns are queried in joins
-- (review queues, activity feeds, learning progress lookups) but had no
-- supporting index.
create index if not exists species_profiles_updated_by_idx on public.species_profiles (updated_by);
create index if not exists specimens_digitized_by_idx on public.specimens (digitized_by);
create index if not exists submissions_species_id_idx on public.submissions (species_id);
create index if not exists submissions_zone_id_idx on public.submissions (zone_id);
create index if not exists submissions_reviewed_by_idx on public.submissions (reviewed_by);
create index if not exists activity_log_actor_id_idx on public.activity_log (actor_id);
create index if not exists learning_progress_module_id_idx on public.learning_progress (module_id);
