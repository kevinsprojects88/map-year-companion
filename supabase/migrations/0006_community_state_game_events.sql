create type public.project_status as enum (
  'active',
  'completed',
  'abandoned'
);

create type public.resource_status as enum (
  'abundance',
  'scarcity',
  'neutral',
  'custom'
);

create type public.game_event_type as enum (
  'game_created',
  'player_joined',
  'deck_configured',
  'initial_map_created',
  'game_started',
  'turn_draft_saved',
  'turn_committed',
  'map_revision_created',
  'story_poll_created',
  'process_vote_started',
  'turn_reassigned',
  'project_changed',
  'resource_changed',
  'discontent_changed',
  'game_completed',
  'game_archived'
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  name text not null,
  description text,
  status public.project_status not null default 'active',
  remaining_weeks int,
  started_turn_id uuid references public.turns(id) on delete set null,
  completed_turn_id uuid references public.turns(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_name_trimmed_length check (
    char_length(btrim(name)) between 1 and 160
  ),
  constraint projects_description_length check (
    description is null
    or char_length(description) <= 5000
  ),
  constraint projects_remaining_weeks_nonnegative check (
    remaining_weeks is null
    or remaining_weeks >= 0
  )
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  name text not null,
  status public.resource_status not null default 'neutral',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resources_name_trimmed_length check (
    char_length(btrim(name)) between 1 and 160
  ),
  constraint resources_notes_length check (
    notes is null
    or char_length(notes) <= 5000
  )
);

create table public.discontent_entries (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  holder_user_id uuid references public.profiles(id) on delete set null,
  count int not null,
  reason text,
  linked_turn_id uuid references public.turns(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint discontent_entries_count_positive check (count > 0),
  constraint discontent_entries_reason_length check (
    reason is null
    or char_length(reason) <= 2000
  )
);

create table public.game_events (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  turn_id uuid references public.turns(id) on delete set null,
  event_type public.game_event_type not null,
  actor_id uuid references public.profiles(id) on delete set null,
  summary text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint game_events_summary_trimmed_length check (
    char_length(btrim(summary)) between 1 and 5000
  )
);

create index projects_game_id_idx on public.projects(game_id);
create index projects_status_idx on public.projects(status);
create index projects_started_turn_id_idx on public.projects(started_turn_id);
create index projects_completed_turn_id_idx on public.projects(completed_turn_id);

create index resources_game_id_idx on public.resources(game_id);
create index resources_status_idx on public.resources(status);

create index discontent_entries_game_id_idx
on public.discontent_entries(game_id);
create index discontent_entries_holder_user_id_idx
on public.discontent_entries(holder_user_id);
create index discontent_entries_linked_turn_id_idx
on public.discontent_entries(linked_turn_id);

create index game_events_game_id_idx on public.game_events(game_id);
create index game_events_turn_id_idx on public.game_events(turn_id);
create index game_events_actor_id_idx on public.game_events(actor_id);
create index game_events_event_type_idx on public.game_events(event_type);
create index game_events_game_created_at_idx
on public.game_events(game_id, created_at);

create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

create trigger resources_set_updated_at
before update on public.resources
for each row
execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.resources enable row level security;
alter table public.discontent_entries enable row level security;
alter table public.game_events enable row level security;

revoke all on type public.project_status from public, anon, authenticated;
revoke all on type public.resource_status from public, anon, authenticated;
revoke all on type public.game_event_type from public, anon, authenticated;
grant usage on type public.project_status to authenticated;
grant usage on type public.resource_status to authenticated;
grant usage on type public.game_event_type to authenticated;

revoke all on table public.projects from public, anon, authenticated;
revoke all on table public.resources from public, anon, authenticated;
revoke all on table public.discontent_entries from public, anon, authenticated;
revoke all on table public.game_events from public, anon, authenticated;

grant select on table public.projects to authenticated;
grant select on table public.resources to authenticated;
grant select on table public.discontent_entries to authenticated;
grant select on table public.game_events to authenticated;

create policy "select member projects"
on public.projects
for select
to authenticated
using (private.is_game_member(game_id));

create policy "select member resources"
on public.resources
for select
to authenticated
using (private.is_game_member(game_id));

create policy "select member discontent entries"
on public.discontent_entries
for select
to authenticated
using (private.is_game_member(game_id));

create policy "select member game events"
on public.game_events
for select
to authenticated
using (private.is_game_member(game_id));
