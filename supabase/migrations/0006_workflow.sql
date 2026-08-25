-- Student → contributor → admin workflow: observations, the activity feed,
-- and per-student learning progress. Replaces the static mocks in
-- src/data/dashboard.ts.

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  species_id uuid references public.species (id) on delete set null,
  type public.submission_type not null,
  status public.submission_status not null default 'Pending',
  zone_id text references public.campus_zones (id),
  notes text,
  photo_url text,
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index submissions_student_id_idx on public.submissions (student_id);
create index submissions_status_idx on public.submissions (status);

create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id),
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);

create table public.learning_modules (
  id uuid primary key default gen_random_uuid(),
  title text not null
);

create table public.learning_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  module_id uuid not null references public.learning_modules (id) on delete cascade,
  progress_pct int not null default 0 check (progress_pct between 0 and 100),
  label text,
  updated_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

-- Log every submission lifecycle event. SECURITY DEFINER so it can write to
-- activity_log even though ordinary users have no INSERT grant there.
create function public.log_submission_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activity_log (actor_id, action, detail)
    values (new.student_id, 'Submission created', new.type || ' submission (' || new.status || ')');
  elsif tg_op = 'UPDATE' and old.status is distinct from new.status then
    insert into public.activity_log (actor_id, action, detail)
    values (coalesce(new.reviewed_by, new.student_id), 'Submission ' || new.status, new.type || ' submission moved from ' || old.status || ' to ' || new.status);
  end if;
  return new;
end;
$$;

create trigger submissions_log_activity
  after insert or update of status on public.submissions
  for each row execute function public.log_submission_activity();

alter table public.submissions enable row level security;
alter table public.activity_log enable row level security;
alter table public.learning_modules enable row level security;
alter table public.learning_progress enable row level security;

create policy "submissions are readable by their owner or reviewers"
  on public.submissions for select
  using (student_id = auth.uid() or public.is_contributor_or_admin());

create policy "students insert their own submissions"
  on public.submissions for insert
  with check (student_id = auth.uid());

create policy "owners edit drafts, reviewers edit any submission"
  on public.submissions for update
  using ((student_id = auth.uid() and status = 'Draft') or public.is_contributor_or_admin())
  with check (student_id = auth.uid() or public.is_contributor_or_admin());

create policy "owners delete drafts, reviewers delete any submission"
  on public.submissions for delete
  using ((student_id = auth.uid() and status = 'Draft') or public.is_contributor_or_admin());

create policy "activity log is readable by contributors and admins"
  on public.activity_log for select
  using (public.is_contributor_or_admin());

create policy "learning modules are publicly readable"
  on public.learning_modules for select using (true);
create policy "learning modules are writable by admins"
  on public.learning_modules for all
  using (public.is_admin()) with check (public.is_admin());

create policy "learning progress is readable by its owner or an admin"
  on public.learning_progress for select
  using (user_id = auth.uid() or public.is_admin());
create policy "learning progress is upsertable by its owner"
  on public.learning_progress for insert
  with check (user_id = auth.uid());
create policy "learning progress is updatable by its owner"
  on public.learning_progress for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

insert into public.learning_modules (title) values
  ('Plant Identification Key'),
  ('Botanical Glossary'),
  ('Families Quiz');
