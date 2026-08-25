-- These are trigger bodies and internal aggregate-recompute helpers, never
-- meant to be called directly — PostgREST auto-exposes every SECURITY
-- DEFINER function as an RPC endpoint unless EXECUTE is revoked. The
-- is_admin()/is_contributor_or_admin()/current_role() trio stays public:
-- they only ever reflect the caller's own row, so there's nothing to leak.
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.guard_profile_role_change() from anon, authenticated;
revoke execute on function public.log_submission_activity() from anon, authenticated;
revoke execute on function public.on_marker_change_refresh_aggregates() from anon, authenticated;
revoke execute on function public.on_species_change_refresh_family() from anon, authenticated;
revoke execute on function public.refresh_family_aggregates(uuid) from anon, authenticated;
revoke execute on function public.refresh_marker_aggregates(uuid, text) from anon, authenticated;
