-- The professor's species write-ups carry native/introduced/regional
-- distribution and taxonomic notes as distinct fields — species_profiles had
-- nowhere to put them (only a single free-text `habitat`). Add the missing
-- columns rather than flattening everything into `description`.
alter table public.species_profiles
  add column if not exists synonyms text[] not null default '{}',
  add column if not exists native_range text,
  add column if not exists introduced_range text,
  add column if not exists regional_distribution text,
  add column if not exists taxonomic_notes text;
