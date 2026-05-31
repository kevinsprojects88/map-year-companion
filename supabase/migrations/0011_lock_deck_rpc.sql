create or replace function private.lock_game_deck(
  target_game_id uuid
)
returns table (
  deck_id uuid,
  locked_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  authenticated_user_id uuid := (select auth.uid());
  card_summary record;
  target_deck record;
  locked_timestamp timestamptz := now();
begin
  if authenticated_user_id is null then
    raise exception 'Authentication is required to lock a deck.'
      using errcode = '42501';
  end if;

  if target_game_id is null then
    raise exception 'Choose a valid game before locking the deck.'
      using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.profiles profiles
    where profiles.id = authenticated_user_id
  ) then
    raise exception 'A profile is required to lock a deck.'
      using errcode = '42501';
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
    raise exception 'Only active owner/admin members can lock a deck.'
      using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.games games
    where games.id = target_game_id
      and games.status = 'setup'::public.game_status
  ) then
    raise exception 'Deck can only be locked while the game is in setup.'
      using errcode = '22023';
  end if;

  select
    decks.id,
    decks.status
  into target_deck
  from public.decks decks
  where decks.game_id = target_game_id
  for update;

  if not found then
    raise exception 'Create a draft deck before locking the deck.'
      using errcode = '22023';
  end if;

  if target_deck.status <> 'draft'::public.deck_status then
    raise exception 'Only draft decks can be locked.'
      using errcode = '22023';
  end if;

  perform 1
  from public.deck_cards cards
  where cards.deck_id = target_deck.id
  order by cards.week_number
  for update;

  select
    count(*) as card_count,
    count(*) filter (
      where cards.week_number between 1 and 52
    ) as in_range_count,
    count(distinct cards.week_number) as represented_weeks,
    count(*) filter (
      where btrim(coalesce(cards.prompt_text, '')) <> ''
    ) as prompt_filled_count
  into card_summary
  from public.deck_cards cards
  where cards.deck_id = target_deck.id;

  if card_summary.card_count <> 52
    or card_summary.in_range_count <> 52
    or card_summary.represented_weeks <> 52
    or exists (
      select 1
      from generate_series(1, 52) as expected(week_number)
      where not exists (
        select 1
        from public.deck_cards cards
        where cards.deck_id = target_deck.id
          and cards.week_number = expected.week_number
      )
    )
    or exists (
      select 1
      from public.deck_cards cards
      where cards.deck_id = target_deck.id
      group by cards.week_number
      having count(*) > 1
    ) then
    raise exception 'Deck must contain exactly one card for each week 1 through 52 before it can be locked.'
      using errcode = '22023';
  end if;

  if card_summary.prompt_filled_count <> 52 then
    raise exception 'Every deck card needs non-blank prompt text before the deck can be locked.'
      using errcode = '22023';
  end if;

  return query
  update public.decks decks
  set
    status = 'locked'::public.deck_status,
    locked_at = locked_timestamp
  where decks.id = target_deck.id
    and decks.status = 'draft'::public.deck_status
  returning decks.id, decks.locked_at;
end;
$$;

revoke all on function private.lock_game_deck(uuid)
from public, anon, authenticated;

grant execute on function private.lock_game_deck(uuid)
to authenticated;

create or replace function public.lock_game_deck(
  target_game_id uuid
)
returns table (
  deck_id uuid,
  locked_at timestamptz
)
language sql
security invoker
set search_path = ''
as $$
  select locked.deck_id, locked.locked_at
  from private.lock_game_deck($1) locked;
$$;

revoke all on function public.lock_game_deck(uuid)
from public, anon, authenticated;

grant execute on function public.lock_game_deck(uuid)
to authenticated;

drop policy if exists "update setup managed decks"
on public.decks;

create policy "update setup managed decks"
on public.decks
for update
to authenticated
using (
  private.is_game_owner_or_admin(game_id)
  and status = 'draft'::public.deck_status
  and locked_at is null
  and exists (
    select 1
    from public.games
    where games.id = decks.game_id
      and games.status = 'setup'::public.game_status
  )
)
with check (
  private.is_game_owner_or_admin(game_id)
  and status = 'draft'::public.deck_status
  and locked_at is null
  and exists (
    select 1
    from public.games
    where games.id = decks.game_id
      and games.status = 'setup'::public.game_status
  )
);

drop policy if exists "insert setup managed deck cards"
on public.deck_cards;

create policy "insert setup managed deck cards"
on public.deck_cards
for insert
to authenticated
with check (
  exists (
    select 1
    from public.decks
    join public.games on games.id = decks.game_id
    where decks.id = deck_cards.deck_id
      and decks.status = 'draft'::public.deck_status
      and decks.locked_at is null
      and games.status = 'setup'::public.game_status
      and private.is_game_owner_or_admin(decks.game_id)
  )
);

drop policy if exists "update setup managed deck cards"
on public.deck_cards;

create policy "update setup managed deck cards"
on public.deck_cards
for update
to authenticated
using (
  exists (
    select 1
    from public.decks
    join public.games on games.id = decks.game_id
    where decks.id = deck_cards.deck_id
      and decks.status = 'draft'::public.deck_status
      and decks.locked_at is null
      and games.status = 'setup'::public.game_status
      and private.is_game_owner_or_admin(decks.game_id)
  )
)
with check (
  exists (
    select 1
    from public.decks
    join public.games on games.id = decks.game_id
    where decks.id = deck_cards.deck_id
      and decks.status = 'draft'::public.deck_status
      and decks.locked_at is null
      and games.status = 'setup'::public.game_status
      and private.is_game_owner_or_admin(decks.game_id)
  )
);
