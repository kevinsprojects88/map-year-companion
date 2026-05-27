create type public.chat_message_type as enum (
  'player',
  'system'
);

create type public.system_message_type as enum (
  'info',
  'warning',
  'process',
  'state_change'
);

create type public.story_poll_status as enum (
  'open',
  'closed'
);

create type public.process_vote_type as enum (
  'reassign_stuck_turn'
);

create type public.process_vote_status as enum (
  'open',
  'passed',
  'failed',
  'cancelled'
);

create type public.process_vote_response as enum (
  'yes',
  'no',
  'abstain'
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  turn_id uuid references public.turns(id) on delete set null,
  author_id uuid not null references public.profiles(id) on delete restrict,
  body text not null,
  message_type public.chat_message_type not null default 'player',
  system_type public.system_message_type,
  linked_object_label text,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  constraint chat_messages_body_trimmed_length check (
    char_length(btrim(body)) between 1 and 5000
  ),
  constraint chat_messages_linked_object_label_length check (
    linked_object_label is null
    or char_length(linked_object_label) <= 200
  ),
  constraint chat_messages_system_type_matches_message_type check (
    (
      message_type = 'player'::public.chat_message_type
      and system_type is null
    )
    or (
      message_type = 'system'::public.chat_message_type
      and system_type is not null
    )
  ),
  constraint chat_messages_edited_at_after_created_at check (
    edited_at is null
    or edited_at >= created_at
  )
);

create table public.story_polls (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  turn_id uuid not null references public.turns(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  question text not null,
  description text,
  status public.story_poll_status not null default 'open',
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  constraint story_polls_question_trimmed_length check (
    char_length(btrim(question)) between 1 and 300
  ),
  constraint story_polls_description_length check (
    description is null
    or char_length(description) <= 2000
  ),
  constraint story_polls_closed_at_matches_status check (
    (
      status = 'open'::public.story_poll_status
      and closed_at is null
    )
    or (
      status = 'closed'::public.story_poll_status
      and closed_at is not null
    )
  )
);

create table public.story_poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.story_polls(id) on delete cascade,
  label text not null,
  sort_order int not null,
  constraint story_poll_options_poll_id_id_unique unique (poll_id, id),
  constraint story_poll_options_poll_sort_order_unique unique (
    poll_id,
    sort_order
  ),
  constraint story_poll_options_label_trimmed_length check (
    char_length(btrim(label)) between 1 and 200
  ),
  constraint story_poll_options_sort_order_nonnegative check (
    sort_order >= 0
  )
);

create table public.story_poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.story_polls(id) on delete cascade,
  option_id uuid not null references public.story_poll_options(id) on delete cascade,
  voter_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint story_poll_votes_poll_voter_unique unique (poll_id, voter_id),
  constraint story_poll_votes_poll_option_fkey foreign key (
    poll_id,
    option_id
  )
  references public.story_poll_options (poll_id, id)
  on delete cascade
);

create table public.process_votes (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  turn_id uuid not null references public.turns(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  vote_type public.process_vote_type not null default 'reassign_stuck_turn',
  target_player_id uuid references public.profiles(id) on delete set null,
  reason text,
  status public.process_vote_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint process_votes_reason_length check (
    reason is null
    or char_length(reason) <= 2000
  ),
  constraint process_votes_resolved_at_matches_status check (
    (
      status = 'open'::public.process_vote_status
      and resolved_at is null
    )
    or (
      status <> 'open'::public.process_vote_status
      and resolved_at is not null
    )
  )
);

create table public.process_vote_responses (
  id uuid primary key default gen_random_uuid(),
  process_vote_id uuid not null references public.process_votes(id) on delete cascade,
  voter_id uuid not null references public.profiles(id) on delete cascade,
  response public.process_vote_response not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint process_vote_responses_vote_voter_unique unique (
    process_vote_id,
    voter_id
  )
);

create index chat_messages_game_id_idx on public.chat_messages(game_id);
create index chat_messages_turn_id_idx on public.chat_messages(turn_id);
create index chat_messages_author_id_idx on public.chat_messages(author_id);
create index chat_messages_game_created_at_idx
on public.chat_messages(game_id, created_at);

create index story_polls_game_id_idx on public.story_polls(game_id);
create index story_polls_turn_id_idx on public.story_polls(turn_id);
create index story_polls_created_by_idx on public.story_polls(created_by);
create index story_polls_game_status_idx on public.story_polls(game_id, status);
create unique index story_polls_open_turn_unique_idx
on public.story_polls(turn_id)
where status = 'open'::public.story_poll_status;

create index story_poll_options_poll_id_idx
on public.story_poll_options(poll_id);

create index story_poll_votes_poll_id_idx on public.story_poll_votes(poll_id);
create index story_poll_votes_option_id_idx
on public.story_poll_votes(option_id);
create index story_poll_votes_voter_id_idx on public.story_poll_votes(voter_id);

create index process_votes_game_id_idx on public.process_votes(game_id);
create index process_votes_turn_id_idx on public.process_votes(turn_id);
create index process_votes_created_by_idx on public.process_votes(created_by);
create index process_votes_target_player_id_idx
on public.process_votes(target_player_id);
create index process_votes_game_status_idx
on public.process_votes(game_id, status);
create unique index process_votes_open_turn_type_unique_idx
on public.process_votes(turn_id, vote_type)
where status = 'open'::public.process_vote_status;

create index process_vote_responses_process_vote_id_idx
on public.process_vote_responses(process_vote_id);
create index process_vote_responses_voter_id_idx
on public.process_vote_responses(voter_id);

create trigger story_poll_votes_set_updated_at
before update on public.story_poll_votes
for each row
execute function public.set_updated_at();

create trigger process_vote_responses_set_updated_at
before update on public.process_vote_responses
for each row
execute function public.set_updated_at();

create or replace function private.is_active_player_for_turn(target_turn_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.turns
    where turns.id = target_turn_id
      and turns.active_player_id = (select auth.uid())
      and turns.status = 'active'::public.turn_status
  );
$$;

create or replace function private.is_active_game_member(
  target_game_id uuid,
  target_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.game_memberships memberships
    where memberships.game_id = target_game_id
      and memberships.user_id = target_user_id
      and memberships.status = 'active'::public.game_member_status
  );
$$;

revoke all on function private.is_active_player_for_turn(uuid)
from public, anon, authenticated;
revoke all on function private.is_active_game_member(uuid, uuid)
from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_active_player_for_turn(uuid)
to authenticated;
grant execute on function private.is_active_game_member(uuid, uuid)
to authenticated;

alter table public.chat_messages enable row level security;
alter table public.story_polls enable row level security;
alter table public.story_poll_options enable row level security;
alter table public.story_poll_votes enable row level security;
alter table public.process_votes enable row level security;
alter table public.process_vote_responses enable row level security;

revoke all on type public.chat_message_type from public, anon, authenticated;
revoke all on type public.system_message_type from public, anon, authenticated;
revoke all on type public.story_poll_status from public, anon, authenticated;
revoke all on type public.process_vote_type from public, anon, authenticated;
revoke all on type public.process_vote_status from public, anon, authenticated;
revoke all on type public.process_vote_response from public, anon, authenticated;
grant usage on type public.chat_message_type to authenticated;
grant usage on type public.system_message_type to authenticated;
grant usage on type public.story_poll_status to authenticated;
grant usage on type public.process_vote_type to authenticated;
grant usage on type public.process_vote_status to authenticated;
grant usage on type public.process_vote_response to authenticated;

revoke all on table public.chat_messages from public, anon, authenticated;
revoke all on table public.story_polls from public, anon, authenticated;
revoke all on table public.story_poll_options from public, anon, authenticated;
revoke all on table public.story_poll_votes from public, anon, authenticated;
revoke all on table public.process_votes from public, anon, authenticated;
revoke all on table public.process_vote_responses from public, anon, authenticated;

grant select (
  id,
  game_id,
  turn_id,
  author_id,
  body,
  message_type,
  system_type,
  linked_object_label,
  created_at,
  edited_at
)
on table public.chat_messages to authenticated;
grant insert (game_id, turn_id, author_id, body)
on table public.chat_messages to authenticated;

grant select (
  id,
  game_id,
  turn_id,
  created_by,
  question,
  description,
  status,
  created_at,
  closed_at
)
on table public.story_polls to authenticated;
grant insert (game_id, turn_id, created_by, question, description)
on table public.story_polls to authenticated;

grant select (id, poll_id, label, sort_order)
on table public.story_poll_options to authenticated;
grant insert (poll_id, label, sort_order)
on table public.story_poll_options to authenticated;

grant select (id, poll_id, option_id, voter_id, created_at, updated_at)
on table public.story_poll_votes to authenticated;
grant insert (poll_id, option_id, voter_id)
on table public.story_poll_votes to authenticated;
grant update (option_id)
on table public.story_poll_votes to authenticated;

grant select (
  id,
  game_id,
  turn_id,
  created_by,
  vote_type,
  target_player_id,
  reason,
  status,
  created_at,
  resolved_at
)
on table public.process_votes to authenticated;
grant insert (
  game_id,
  turn_id,
  created_by,
  vote_type,
  target_player_id,
  reason
)
on table public.process_votes to authenticated;

grant select (
  id,
  process_vote_id,
  voter_id,
  response,
  created_at,
  updated_at
)
on table public.process_vote_responses to authenticated;
grant insert (process_vote_id, voter_id, response)
on table public.process_vote_responses to authenticated;
grant update (response)
on table public.process_vote_responses to authenticated;

create policy "select member chat messages"
on public.chat_messages
for select
to authenticated
using (private.is_game_member(game_id));

create policy "insert member player chat messages"
on public.chat_messages
for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and message_type = 'player'::public.chat_message_type
  and system_type is null
  and private.is_game_member(game_id)
  and (
    turn_id is null
    or exists (
      select 1
      from public.turns
      where turns.id = chat_messages.turn_id
        and turns.game_id = chat_messages.game_id
    )
  )
);

create policy "select member story polls"
on public.story_polls
for select
to authenticated
using (private.is_game_member(game_id));

create policy "insert active player story polls"
on public.story_polls
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and status = 'open'::public.story_poll_status
  and closed_at is null
  and private.is_game_member(game_id)
  and private.is_active_player_for_turn(turn_id)
  and exists (
    select 1
    from public.turns
    where turns.id = story_polls.turn_id
      and turns.game_id = story_polls.game_id
  )
);

create policy "select member story poll options"
on public.story_poll_options
for select
to authenticated
using (
  exists (
    select 1
    from public.story_polls
    where story_polls.id = story_poll_options.poll_id
      and private.is_game_member(story_polls.game_id)
  )
);

create policy "insert active player story poll options"
on public.story_poll_options
for insert
to authenticated
with check (
  exists (
    select 1
    from public.story_polls
    where story_polls.id = story_poll_options.poll_id
      and story_polls.created_by = (select auth.uid())
      and story_polls.status = 'open'::public.story_poll_status
      and private.is_game_member(story_polls.game_id)
      and private.is_active_player_for_turn(story_polls.turn_id)
  )
);

create policy "select member story poll votes"
on public.story_poll_votes
for select
to authenticated
using (
  exists (
    select 1
    from public.story_polls
    where story_polls.id = story_poll_votes.poll_id
      and private.is_game_member(story_polls.game_id)
  )
);

create policy "insert own open story poll vote"
on public.story_poll_votes
for insert
to authenticated
with check (
  voter_id = (select auth.uid())
  and exists (
    select 1
    from public.story_polls
    where story_polls.id = story_poll_votes.poll_id
      and story_polls.status = 'open'::public.story_poll_status
      and private.is_game_member(story_polls.game_id)
  )
);

create policy "update own open story poll vote"
on public.story_poll_votes
for update
to authenticated
using (
  voter_id = (select auth.uid())
  and exists (
    select 1
    from public.story_polls
    where story_polls.id = story_poll_votes.poll_id
      and story_polls.status = 'open'::public.story_poll_status
      and private.is_game_member(story_polls.game_id)
  )
)
with check (
  voter_id = (select auth.uid())
  and exists (
    select 1
    from public.story_polls
    where story_polls.id = story_poll_votes.poll_id
      and story_polls.status = 'open'::public.story_poll_status
      and private.is_game_member(story_polls.game_id)
  )
);

create policy "select member process votes"
on public.process_votes
for select
to authenticated
using (private.is_game_member(game_id));

create policy "insert managed process votes"
on public.process_votes
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and status = 'open'::public.process_vote_status
  and resolved_at is null
  and private.is_game_owner_or_admin(game_id)
  and exists (
    select 1
    from public.turns
    where turns.id = process_votes.turn_id
      and turns.game_id = process_votes.game_id
  )
  and (
    target_player_id is null
    or private.is_active_game_member(game_id, target_player_id)
  )
);

create policy "select member process vote responses"
on public.process_vote_responses
for select
to authenticated
using (
  exists (
    select 1
    from public.process_votes
    where process_votes.id = process_vote_responses.process_vote_id
      and private.is_game_member(process_votes.game_id)
  )
);

create policy "insert own open process vote response"
on public.process_vote_responses
for insert
to authenticated
with check (
  voter_id = (select auth.uid())
  and exists (
    select 1
    from public.process_votes
    where process_votes.id = process_vote_responses.process_vote_id
      and process_votes.status = 'open'::public.process_vote_status
      and private.is_game_member(process_votes.game_id)
  )
);

create policy "update own open process vote response"
on public.process_vote_responses
for update
to authenticated
using (
  voter_id = (select auth.uid())
  and exists (
    select 1
    from public.process_votes
    where process_votes.id = process_vote_responses.process_vote_id
      and process_votes.status = 'open'::public.process_vote_status
      and private.is_game_member(process_votes.game_id)
  )
)
with check (
  voter_id = (select auth.uid())
  and exists (
    select 1
    from public.process_votes
    where process_votes.id = process_vote_responses.process_vote_id
      and process_votes.status = 'open'::public.process_vote_status
      and private.is_game_member(process_votes.game_id)
  )
);
