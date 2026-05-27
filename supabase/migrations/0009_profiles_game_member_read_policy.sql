create or replace function private.can_read_game_member_profile(
  target_profile_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.game_memberships target_membership
    join public.game_memberships viewer_membership
      on viewer_membership.game_id = target_membership.game_id
    where target_membership.user_id = target_profile_id
      and target_membership.status = 'active'::public.game_member_status
      and viewer_membership.user_id = (select auth.uid())
      and viewer_membership.status = 'active'::public.game_member_status
  );
$$;

revoke all on function private.can_read_game_member_profile(uuid)
from public, anon, authenticated;

grant execute on function private.can_read_game_member_profile(uuid)
to authenticated;

create policy "select shared game member profiles"
on public.profiles
for select
to authenticated
using (private.can_read_game_member_profile(id));
