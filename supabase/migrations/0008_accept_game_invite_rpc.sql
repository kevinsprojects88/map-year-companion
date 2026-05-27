create or replace function private.accept_game_invite_by_hash(
  invite_token_hash text
)
returns table (
  game_id uuid,
  membership_id uuid
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  authenticated_user_id uuid := (select auth.uid());
  created_membership_id uuid;
  existing_membership record;
  matched_invite record;
  next_turn_order_index int;
  normalized_token_hash text := btrim(coalesce(invite_token_hash, ''));
begin
  if authenticated_user_id is null then
    raise exception 'Authentication is required to accept an invite.'
      using errcode = '42501';
  end if;

  if char_length(normalized_token_hash) < 1 then
    raise exception 'Invite token hash is required.'
      using errcode = '22023';
  end if;

  if normalized_token_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'Invite is invalid or no longer available.'
      using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.profiles profiles
    where profiles.id = authenticated_user_id
  ) then
    raise exception 'A profile is required to accept an invite.'
      using errcode = '42501';
  end if;

  select
    invites.id,
    invites.game_id,
    invites.expires_at,
    invites.max_uses,
    invites.revoked_at,
    invites.used_count
  into matched_invite
  from public.game_invites invites
  where invites.token_hash = normalized_token_hash
  for update;

  if not found then
    raise exception 'Invite is invalid or no longer available.'
      using errcode = '22023';
  end if;

  if matched_invite.revoked_at is not null then
    raise exception 'Invite is invalid or no longer available.'
      using errcode = '22023';
  end if;

  if matched_invite.expires_at is not null
    and matched_invite.expires_at <= now() then
    raise exception 'This invite has expired.'
      using errcode = '22023';
  end if;

  perform 1
  from public.games games
  where games.id = matched_invite.game_id
  for update;

  select
    memberships.game_id,
    memberships.id,
    memberships.status
  into existing_membership
  from public.game_memberships memberships
  where memberships.game_id = matched_invite.game_id
    and memberships.user_id = authenticated_user_id
  for update;

  if found then
    if existing_membership.status = 'active'::public.game_member_status then
      return query
      select existing_membership.game_id, existing_membership.id;
      return;
    end if;

    raise exception 'This account cannot accept this invite right now. Ask the game owner to add you again.'
      using errcode = '42501';
  end if;

  if matched_invite.max_uses is not null
    and matched_invite.used_count >= matched_invite.max_uses then
    raise exception 'This invite has no remaining uses.'
      using errcode = '22023';
  end if;

  select coalesce(max(memberships.turn_order_index), -1) + 1
  into next_turn_order_index
  from public.game_memberships memberships
  where memberships.game_id = matched_invite.game_id
    and memberships.status = 'active'::public.game_member_status
    and memberships.turn_order_index is not null;

  insert into public.game_memberships (
    game_id,
    user_id,
    role,
    status,
    turn_order_index
  )
  values (
    matched_invite.game_id,
    authenticated_user_id,
    'player'::public.game_member_role,
    'active'::public.game_member_status,
    next_turn_order_index
  )
  returning id into created_membership_id;

  update public.game_invites invites
  set used_count = invites.used_count + 1
  where invites.id = matched_invite.id;

  return query
  select matched_invite.game_id, created_membership_id;
end;
$$;

revoke all on function private.accept_game_invite_by_hash(text)
from public, anon, authenticated;

grant execute on function private.accept_game_invite_by_hash(text)
to authenticated;

create or replace function public.accept_game_invite(
  invite_token_hash text
)
returns table (
  game_id uuid,
  membership_id uuid
)
language sql
security invoker
set search_path = ''
as $$
  select accepted.game_id, accepted.membership_id
  from private.accept_game_invite_by_hash($1) accepted;
$$;

revoke all on function public.accept_game_invite(text)
from public, anon, authenticated;

grant execute on function public.accept_game_invite(text)
to authenticated;
