create type public.deck_source_type as enum (
  'placeholder',
  'manual',
  'json_import',
  'private_poc'
);

create type public.deck_status as enum (
  'draft',
  'valid',
  'locked'
);

create type public.turn_status as enum (
  'active',
  'completed',
  'reassigned',
  'skipped'
);

create table public.decks (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  source_type public.deck_source_type not null default 'placeholder',
  status public.deck_status not null default 'draft',
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  locked_at timestamptz,
  constraint decks_game_id_unique unique (game_id)
);

create table public.deck_cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  card_key text not null,
  season text,
  week_number int not null,
  prompt_text text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deck_cards_deck_card_key_unique unique (deck_id, card_key),
  constraint deck_cards_deck_week_number_unique unique (deck_id, week_number),
  constraint deck_cards_week_number_range check (week_number between 1 and 52),
  constraint deck_cards_card_key_trimmed_length check (
    char_length(btrim(card_key)) between 1 and 80
  ),
  constraint deck_cards_prompt_text_length check (
    prompt_text is null
    or char_length(prompt_text) <= 5000
  )
);

create table public.turns (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  turn_number int not null,
  week_number int not null,
  active_player_id uuid not null references public.profiles(id) on delete restrict,
  deck_card_id uuid references public.deck_cards(id) on delete set null,
  status public.turn_status not null default 'active',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  reassigned_from_player_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint turns_game_turn_number_unique unique (game_id, turn_number),
  constraint turns_turn_number_positive check (turn_number >= 1),
  constraint turns_week_number_range check (week_number between 1 and 52)
);

create table public.turn_drafts (
  id uuid primary key default gen_random_uuid(),
  turn_id uuid not null references public.turns(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete cascade,
  player_id uuid not null references public.profiles(id) on delete cascade,
  outcome_text text,
  map_draft_id uuid,
  state_changes_draft jsonb,
  saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint turn_drafts_turn_player_unique unique (turn_id, player_id),
  constraint turn_drafts_outcome_text_length check (
    outcome_text is null
    or char_length(outcome_text) <= 5000
  )
);

create table public.map_revisions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  turn_id uuid references public.turns(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  revision_number int not null,
  map_document jsonb not null default '{}'::jsonb,
  summary text,
  created_at timestamptz not null default now(),
  constraint map_revisions_game_revision_number_unique unique (
    game_id,
    revision_number
  ),
  constraint map_revisions_revision_number_nonnegative check (
    revision_number >= 0
  )
);

create table public.map_drafts (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  turn_id uuid references public.turns(id) on delete cascade,
  player_id uuid not null references public.profiles(id) on delete cascade,
  base_revision_id uuid references public.map_revisions(id) on delete set null,
  map_document jsonb not null default '{}'::jsonb,
  saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.turn_outcomes (
  id uuid primary key default gen_random_uuid(),
  turn_id uuid not null references public.turns(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete cascade,
  committed_by uuid not null references public.profiles(id) on delete restrict,
  summary text not null,
  map_revision_id uuid references public.map_revisions(id) on delete set null,
  committed_at timestamptz not null default now(),
  constraint turn_outcomes_turn_unique unique (turn_id),
  constraint turn_outcomes_summary_trimmed_length check (
    char_length(btrim(summary)) between 1 and 5000
  )
);

alter table public.turn_drafts
add constraint turn_drafts_map_draft_id_fkey
foreign key (map_draft_id)
references public.map_drafts(id)
on delete set null;

alter table public.games
add constraint games_current_turn_id_fkey
foreign key (current_turn_id)
references public.turns(id)
on delete set null;

create index decks_game_id_idx on public.decks(game_id);
create index decks_created_by_idx on public.decks(created_by);

create index deck_cards_deck_id_idx on public.deck_cards(deck_id);

create index turns_game_id_idx on public.turns(game_id);
create index turns_active_player_id_idx on public.turns(active_player_id);
create index turns_deck_card_id_idx on public.turns(deck_card_id);
create index turns_game_status_idx on public.turns(game_id, status);
create unique index turns_active_game_unique_idx
on public.turns(game_id)
where status = 'active'::public.turn_status;

create index turn_drafts_game_id_idx on public.turn_drafts(game_id);
create index turn_drafts_turn_id_idx on public.turn_drafts(turn_id);
create index turn_drafts_player_id_idx on public.turn_drafts(player_id);

create index turn_outcomes_game_id_idx on public.turn_outcomes(game_id);
create index turn_outcomes_committed_by_idx on public.turn_outcomes(committed_by);

create index map_drafts_game_id_idx on public.map_drafts(game_id);
create index map_drafts_turn_id_idx on public.map_drafts(turn_id);
create index map_drafts_player_id_idx on public.map_drafts(player_id);
create unique index map_drafts_turn_player_unique_idx
on public.map_drafts(turn_id, player_id)
where turn_id is not null;

create index map_revisions_game_id_idx on public.map_revisions(game_id);
create index map_revisions_turn_id_idx on public.map_revisions(turn_id);
create index map_revisions_created_by_idx on public.map_revisions(created_by);

create trigger decks_set_updated_at
before update on public.decks
for each row
execute function public.set_updated_at();

create trigger deck_cards_set_updated_at
before update on public.deck_cards
for each row
execute function public.set_updated_at();

create trigger turn_drafts_set_updated_at
before update on public.turn_drafts
for each row
execute function public.set_updated_at();

create trigger map_drafts_set_updated_at
before update on public.map_drafts
for each row
execute function public.set_updated_at();

alter table public.decks enable row level security;
alter table public.deck_cards enable row level security;
alter table public.turns enable row level security;
alter table public.turn_drafts enable row level security;
alter table public.turn_outcomes enable row level security;
alter table public.map_drafts enable row level security;
alter table public.map_revisions enable row level security;

revoke all on type public.deck_source_type from public, anon, authenticated;
revoke all on type public.deck_status from public, anon, authenticated;
revoke all on type public.turn_status from public, anon, authenticated;
grant usage on type public.deck_source_type to authenticated;
grant usage on type public.deck_status to authenticated;
grant usage on type public.turn_status to authenticated;

revoke all on table public.decks from public, anon, authenticated;
revoke all on table public.deck_cards from public, anon, authenticated;
revoke all on table public.turns from public, anon, authenticated;
revoke all on table public.turn_drafts from public, anon, authenticated;
revoke all on table public.turn_outcomes from public, anon, authenticated;
revoke all on table public.map_drafts from public, anon, authenticated;
revoke all on table public.map_revisions from public, anon, authenticated;

grant select (
  id,
  game_id,
  source_type,
  status,
  created_by,
  created_at,
  updated_at,
  locked_at
)
on table public.decks to authenticated;
grant insert (game_id, source_type, created_by)
on table public.decks to authenticated;
grant update (source_type)
on table public.decks to authenticated;

grant select (
  id,
  deck_id,
  card_key,
  season,
  week_number,
  prompt_text,
  metadata,
  created_at,
  updated_at
)
on table public.deck_cards to authenticated;
grant insert (deck_id, card_key, season, week_number, prompt_text, metadata)
on table public.deck_cards to authenticated;
grant update (card_key, season, week_number, prompt_text, metadata)
on table public.deck_cards to authenticated;

grant select (
  id,
  game_id,
  turn_number,
  week_number,
  active_player_id,
  deck_card_id,
  status,
  started_at,
  completed_at,
  reassigned_from_player_id,
  created_at
)
on table public.turns to authenticated;

grant select (
  id,
  turn_id,
  game_id,
  player_id,
  outcome_text,
  map_draft_id,
  state_changes_draft,
  saved_at,
  created_at,
  updated_at
)
on table public.turn_drafts to authenticated;
grant insert (
  turn_id,
  game_id,
  player_id,
  outcome_text,
  map_draft_id,
  state_changes_draft,
  saved_at
)
on table public.turn_drafts to authenticated;
grant update (outcome_text, map_draft_id, state_changes_draft, saved_at)
on table public.turn_drafts to authenticated;

grant select (
  id,
  turn_id,
  game_id,
  committed_by,
  summary,
  map_revision_id,
  committed_at
)
on table public.turn_outcomes to authenticated;

grant select (
  id,
  game_id,
  turn_id,
  player_id,
  base_revision_id,
  map_document,
  saved_at,
  created_at,
  updated_at
)
on table public.map_drafts to authenticated;
grant insert (
  game_id,
  turn_id,
  player_id,
  base_revision_id,
  map_document,
  saved_at
)
on table public.map_drafts to authenticated;
grant update (base_revision_id, map_document, saved_at)
on table public.map_drafts to authenticated;

grant select (
  id,
  game_id,
  turn_id,
  created_by,
  revision_number,
  map_document,
  summary,
  created_at
)
on table public.map_revisions to authenticated;

create policy "select member decks"
on public.decks
for select
to authenticated
using (private.is_game_member(game_id));

create policy "insert setup managed decks"
on public.decks
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and private.is_game_owner_or_admin(game_id)
  and exists (
    select 1
    from public.games
    where games.id = decks.game_id
      and games.status = 'setup'::public.game_status
  )
);

create policy "update setup managed decks"
on public.decks
for update
to authenticated
using (
  private.is_game_owner_or_admin(game_id)
  and exists (
    select 1
    from public.games
    where games.id = decks.game_id
      and games.status = 'setup'::public.game_status
  )
)
with check (
  private.is_game_owner_or_admin(game_id)
  and exists (
    select 1
    from public.games
    where games.id = decks.game_id
      and games.status = 'setup'::public.game_status
  )
);

create policy "select member deck cards"
on public.deck_cards
for select
to authenticated
using (
  exists (
    select 1
    from public.decks
    where decks.id = deck_cards.deck_id
      and private.is_game_member(decks.game_id)
  )
);

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
      and games.status = 'setup'::public.game_status
      and private.is_game_owner_or_admin(decks.game_id)
  )
);

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
      and games.status = 'setup'::public.game_status
      and private.is_game_owner_or_admin(decks.game_id)
  )
);

create policy "select member turns"
on public.turns
for select
to authenticated
using (private.is_game_member(game_id));

create policy "select member turn drafts"
on public.turn_drafts
for select
to authenticated
using (private.is_game_member(game_id));

create policy "insert active player turn drafts"
on public.turn_drafts
for insert
to authenticated
with check (
  player_id = (select auth.uid())
  and exists (
    select 1
    from public.turns
    where turns.id = turn_drafts.turn_id
      and turns.game_id = turn_drafts.game_id
      and turns.active_player_id = (select auth.uid())
      and turns.status = 'active'::public.turn_status
  )
  and (
    map_draft_id is null
    or exists (
      select 1
      from public.map_drafts
      where map_drafts.id = turn_drafts.map_draft_id
        and map_drafts.game_id = turn_drafts.game_id
        and map_drafts.turn_id = turn_drafts.turn_id
        and map_drafts.player_id = turn_drafts.player_id
    )
  )
);

create policy "update active player turn drafts"
on public.turn_drafts
for update
to authenticated
using (
  player_id = (select auth.uid())
  and exists (
    select 1
    from public.turns
    where turns.id = turn_drafts.turn_id
      and turns.game_id = turn_drafts.game_id
      and turns.active_player_id = (select auth.uid())
      and turns.status = 'active'::public.turn_status
  )
)
with check (
  player_id = (select auth.uid())
  and exists (
    select 1
    from public.turns
    where turns.id = turn_drafts.turn_id
      and turns.game_id = turn_drafts.game_id
      and turns.active_player_id = (select auth.uid())
      and turns.status = 'active'::public.turn_status
  )
  and (
    map_draft_id is null
    or exists (
      select 1
      from public.map_drafts
      where map_drafts.id = turn_drafts.map_draft_id
        and map_drafts.game_id = turn_drafts.game_id
        and map_drafts.turn_id = turn_drafts.turn_id
        and map_drafts.player_id = turn_drafts.player_id
    )
  )
);

create policy "select member turn outcomes"
on public.turn_outcomes
for select
to authenticated
using (private.is_game_member(game_id));

create policy "select member map drafts"
on public.map_drafts
for select
to authenticated
using (private.is_game_member(game_id));

create policy "insert active player map drafts"
on public.map_drafts
for insert
to authenticated
with check (
  player_id = (select auth.uid())
  and turn_id is not null
  and exists (
    select 1
    from public.turns
    where turns.id = map_drafts.turn_id
      and turns.game_id = map_drafts.game_id
      and turns.active_player_id = (select auth.uid())
      and turns.status = 'active'::public.turn_status
  )
  and (
    base_revision_id is null
    or exists (
      select 1
      from public.map_revisions
      where map_revisions.id = map_drafts.base_revision_id
        and map_revisions.game_id = map_drafts.game_id
    )
  )
);

create policy "update active player map drafts"
on public.map_drafts
for update
to authenticated
using (
  player_id = (select auth.uid())
  and turn_id is not null
  and exists (
    select 1
    from public.turns
    where turns.id = map_drafts.turn_id
      and turns.game_id = map_drafts.game_id
      and turns.active_player_id = (select auth.uid())
      and turns.status = 'active'::public.turn_status
  )
)
with check (
  player_id = (select auth.uid())
  and turn_id is not null
  and exists (
    select 1
    from public.turns
    where turns.id = map_drafts.turn_id
      and turns.game_id = map_drafts.game_id
      and turns.active_player_id = (select auth.uid())
      and turns.status = 'active'::public.turn_status
  )
  and (
    base_revision_id is null
    or exists (
      select 1
      from public.map_revisions
      where map_revisions.id = map_drafts.base_revision_id
        and map_revisions.game_id = map_drafts.game_id
    )
  )
);

create policy "select member map revisions"
on public.map_revisions
for select
to authenticated
using (private.is_game_member(game_id));
