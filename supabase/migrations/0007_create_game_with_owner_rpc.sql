create or replace function public.create_game_with_owner(
  game_name text,
  game_description text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  authenticated_user_id uuid := (select auth.uid());
  created_game_id uuid;
  normalized_description text := nullif(btrim(game_description), '');
  normalized_name text := btrim(coalesce(game_name, ''));
begin
  if authenticated_user_id is null then
    raise exception 'Authentication is required to create a game.'
      using errcode = '42501';
  end if;

  if char_length(normalized_name) < 1 then
    raise exception 'Game name is required.'
      using errcode = '22023';
  end if;

  if char_length(normalized_name) > 120 then
    raise exception 'Game name must be 120 characters or fewer.'
      using errcode = '22023';
  end if;

  if normalized_description is not null
    and char_length(normalized_description) > 1000 then
    raise exception 'Description must be 1000 characters or fewer.'
      using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = authenticated_user_id
  ) then
    raise exception 'A profile is required to create a game.'
      using errcode = '42501';
  end if;

  insert into public.games (owner_id, name, description)
  values (authenticated_user_id, normalized_name, normalized_description)
  returning id into created_game_id;

  insert into public.game_memberships (
    game_id,
    user_id,
    role,
    status,
    turn_order_index
  )
  values (
    created_game_id,
    authenticated_user_id,
    'owner'::public.game_member_role,
    'active'::public.game_member_status,
    0
  );

  return created_game_id;
end;
$$;

revoke all on function public.create_game_with_owner(text, text)
from public, anon, authenticated;

grant execute on function public.create_game_with_owner(text, text)
to authenticated;
