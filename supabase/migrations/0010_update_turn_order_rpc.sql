create or replace function public.update_game_turn_order(
  target_game_id uuid,
  ordered_profile_ids uuid[]
)
returns table (
  membership_id uuid,
  user_id uuid,
  role public.game_member_role,
  status public.game_member_status,
  turn_order_index int
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  active_member_count int;
  authenticated_user_id uuid := (select auth.uid());
  distinct_ordered_count int;
  ordered_member_count int;
begin
  if authenticated_user_id is null then
    raise exception 'Authentication is required to update turn order.'
      using errcode = '42501';
  end if;

  if target_game_id is null then
    raise exception 'Choose a valid game before saving turn order.'
      using errcode = '22023';
  end if;

  if ordered_profile_ids is null
    or coalesce(cardinality(ordered_profile_ids), 0) = 0 then
    raise exception 'Turn order must include at least one active member.'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from unnest(ordered_profile_ids) as ordered(ordered_profile_id)
    where ordered.ordered_profile_id is null
  ) then
    raise exception 'Each turn order member id must be valid.'
      using errcode = '22023';
  end if;

  select
    count(*),
    count(distinct ordered.ordered_profile_id)
  into ordered_member_count, distinct_ordered_count
  from unnest(ordered_profile_ids) as ordered(ordered_profile_id);

  if ordered_member_count <> distinct_ordered_count then
    raise exception 'Each active member can appear only once.'
      using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.game_memberships memberships
    where memberships.game_id = target_game_id
      and memberships.user_id = authenticated_user_id
      and memberships.status = 'active'::public.game_member_status
      and memberships.role in (
        'owner'::public.game_member_role,
        'admin'::public.game_member_role
      )
  ) then
    raise exception 'Only game owners and admins can save turn order.'
      using errcode = '42501';
  end if;

  perform 1
  from public.game_memberships memberships
  where memberships.game_id = target_game_id
    and memberships.status = 'active'::public.game_member_status
  order by memberships.id
  for update;

  select count(*)
  into active_member_count
  from public.game_memberships memberships
  where memberships.game_id = target_game_id
    and memberships.status = 'active'::public.game_member_status;

  if active_member_count <> ordered_member_count
    or exists (
      select 1
      from public.game_memberships memberships
      where memberships.game_id = target_game_id
        and memberships.status = 'active'::public.game_member_status
        and not memberships.user_id = any(ordered_profile_ids)
    )
    or exists (
      select 1
      from unnest(ordered_profile_ids) as ordered(ordered_profile_id)
      where not exists (
        select 1
        from public.game_memberships memberships
        where memberships.game_id = target_game_id
          and memberships.status = 'active'::public.game_member_status
          and memberships.user_id = ordered.ordered_profile_id
      )
    ) then
    raise exception 'Turn order must include every active member exactly once.'
      using errcode = '22023';
  end if;

  update public.game_memberships memberships
  set turn_order_index = null
  where memberships.game_id = target_game_id
    and memberships.status = 'active'::public.game_member_status;

  update public.game_memberships memberships
  set turn_order_index = (ordered.ordinality - 1)::int
  from unnest(ordered_profile_ids) with ordinality as ordered(user_id, ordinality)
  where memberships.game_id = target_game_id
    and memberships.status = 'active'::public.game_member_status
    and memberships.user_id = ordered.user_id;

  return query
  select
    memberships.id,
    memberships.user_id,
    memberships.role,
    memberships.status,
    memberships.turn_order_index
  from public.game_memberships memberships
  where memberships.game_id = target_game_id
    and memberships.status = 'active'::public.game_member_status
  order by memberships.turn_order_index;
end;
$$;

revoke update (status, turn_order_index)
on public.game_memberships
from authenticated;

revoke all on function public.update_game_turn_order(uuid, uuid[])
from public, anon, authenticated;

grant execute on function public.update_game_turn_order(uuid, uuid[])
to authenticated;
