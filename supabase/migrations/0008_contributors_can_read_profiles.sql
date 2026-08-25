-- Contributors need to see submitter names on the review queue / approvals
-- tables — the original policy only let a user read their own profile (or
-- an admin read everyone's), so an embedded `student:student_id(full_name)`
-- select on `submissions` silently came back null for a contributor.
drop policy "profiles are readable by their owner or an admin" on public.profiles;

create policy "profiles are readable by their owner, a contributor, or an admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_contributor_or_admin());
