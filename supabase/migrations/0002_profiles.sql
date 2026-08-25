-- Profiles — one row per auth.users, carries the app role.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'student',
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'App-level user record: role, display name. 1:1 with auth.users.';

-- SECURITY DEFINER: reads a caller's own role while bypassing RLS on this
-- table, so policies that call this function (including this table's own
-- policies) don't recurse into themselves.
create function public.current_role()
returns public.user_role
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.current_role() = 'admin';
$$;

create function public.is_contributor_or_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.current_role() in ('contributor', 'admin');
$$;

-- Auto-create a profile row whenever a new auth user signs up. Role comes
-- from signup metadata (`{ data: { role: 'contributor' } }` passed to
-- supabase.auth.signUp / admin.createUser) so the demo-account seed script
-- can set roles directly; anyone who signs up without that metadata lands as
-- a student by the column default.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student'),
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Only an admin may change someone's role.
create function public.guard_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only an admin can change a user role.';
  end if;
  return new;
end;
$$;

create trigger guard_profile_role_change
  before update on public.profiles
  for each row execute function public.guard_profile_role_change();

alter table public.profiles enable row level security;

create policy "profiles are readable by their owner or an admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles are updatable by their owner or an admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());
