-- UniFlora — extensions and shared enum types.
-- Run once, before every other migration.

create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists postgis;    -- geography columns on markers/zones

create type public.user_role as enum ('admin', 'contributor', 'student');

create type public.plant_type as enum (
  'Tree', 'Palm', 'Shrub', 'Subshrub', 'Climber', 'Succulent', 'Herb', 'Grass', 'Sedge'
);

create type public.growth_status as enum ('Cultivated', 'Wild');
create type public.life_form as enum ('Annual', 'Perennial');
create type public.map_layer as enum ('trees', 'shrubs', 'herbs');
create type public.native_status as enum ('Native', 'Exotic');

create type public.submission_type as enum (
  'Photo', 'Observation', 'Specimen', 'GPS Pin', 'Photo + GPS', 'Draft'
);
create type public.submission_status as enum ('Draft', 'Pending', 'Review', 'Approved', 'Rejected');
