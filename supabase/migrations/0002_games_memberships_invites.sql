create type public.game_status as enum (
  'setup',
  'active',
  'completed',
  'archived'
);

create type public.game_member_role as enum (
  'owner',
  'admin',
  'player'
);

create type public.game_member_status as enum (
  'active',
  'removed'
);

create table public.games (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  name text not null,
  description text,
  status public.game_status not null default 'setup',
  current_turn_id uuid,
  current_week int,
  current_season text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint games_name_trimmed_length check (
    char_length(btrim(name)) between 1 and 120
  ),
  constraint games_current_week_range check (
    current_week is null
    or current_week between 1 and 52
  )
);

create table public.game_memberships (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.game_member_role not null default 'player',
  status public.game_member_status not null default 'active',
  turn_order_index int,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint game_memberships_game_user_unique unique (game_id, user_id),
  constraint game_memberships_turn_order_nonnegative check (
    turn_order_index is null
    or turn_order_index >= 0
  )
);

create table public.game_invites (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  token_hash text not null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  expires_at timestamptz,
  max_uses int,
  used_count int not null default 0,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint game_invites_token_hash_unique unique (token_hash),
  constraint game_invites_token_hash_not_blank check (
    char_length(btrim(token_hash)) > 0
  ),
  constraint game_invites_max_uses_positive check (
    max_uses is null
    or max_uses > 0
  ),
  constraint game_invites_used_count_nonnegative check (used_count >= 0),
  constraint game_invites_used_count_max_uses check (
    max_uses is null
    or used_count <= max_uses
  )
);

create index games_owner_id_idx on public.games(owner_id);
create index games_status_idx on public.games(status);
create index games_updated_at_idx on public.games(updated_at desc);

create index game_memberships_game_id_idx on public.game_memberships(game_id);
create index game_memberships_user_id_idx on public.game_memberships(user_id);
create index game_memberships_game_status_idx
on public.game_memberships(game_id, status);
create index game_memberships_user_status_idx
on public.game_memberships(user_id, status);
create unique index game_memberships_active_turn_order_unique_idx
on public.game_memberships(game_id, turn_order_index)
where turn_order_index is not null
  and status = 'active'::public.game_member_status;

create index game_invites_game_id_idx on public.game_invites(game_id);
create index game_invites_created_by_idx on public.game_invites(created_by);

create trigger games_set_updated_at
before update on public.games
for each row
execute function public.set_updated_at();

create trigger game_memberships_set_updated_at
before update on public.game_memberships
for each row
execute function public.set_updated_at();

create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create or replace function private.is_game_member(target_game_id uuid)
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
      and memberships.user_id = (select auth.uid())
      and memberships.status = 'active'::public.game_member_status
  );
$$;

create or replace function private.is_game_owner_or_admin(target_game_id uuid)
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
      and memberships.user_id = (select auth.uid())
      and memberships.status = 'active'::public.game_member_status
      and memberships.role in (
        'owner'::public.game_member_role,
        'admin'::public.game_member_role
      )
  );
$$;

revoke all on function private.is_game_member(uuid) from public, anon, authenticated;
revoke all on function private.is_game_owner_or_admin(uuid) from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_game_member(uuid) to authenticated;
grant execute on function private.is_game_owner_or_admin(uuid) to authenticated;

alter table public.games enable row level security;
alter table public.game_memberships enable row level security;
alter table public.game_invites enable row level security;

revoke all on type public.game_status from public, anon, authenticated;
revoke all on type public.game_member_role from public, anon, authenticated;
revoke all on type public.game_member_status from public, anon, authenticated;
grant usage on type public.game_status to authenticated;
grant usage on type public.game_member_role to authenticated;
grant usage on type public.game_member_status to authenticated;

revoke all on table public.games from public, anon, authenticated;
revoke all on table public.game_memberships from public, anon, authenticated;
revoke all on table public.game_invites from public, anon, authenticated;

grant select (
  id,
  owner_id,
  name,
  description,
  status,
  current_turn_id,
  current_week,
  current_season,
  created_at,
  updated_at,
  completed_at
)
on table public.games to authenticated;
grant insert (owner_id, name, description)
on table public.games to authenticated;
grant update (
  name,
  description,
  status,
  current_turn_id,
  current_week,
  current_season,
  completed_at
)
on table public.games to authenticated;

grant select (
  id,
  game_id,
  user_id,
  role,
  status,
  turn_order_index,
  joined_at,
  created_at,
  updated_at
)
on table public.game_memberships to authenticated;
grant insert (game_id, user_id, role, status, turn_order_index)
on table public.game_memberships to authenticated;
grant update (status, turn_order_index)
on table public.game_memberships to authenticated;

grant select (
  id,
  game_id,
  token_hash,
  created_by,
  expires_at,
  max_uses,
  used_count,
  revoked_at,
  created_at
)
on table public.game_invites to authenticated;
grant insert (game_id, token_hash, created_by, expires_at, max_uses)
on table public.game_invites to authenticated;
grant update (revoked_at)
on table public.game_invites to authenticated;

create policy "select member games"
on public.games
for select
to authenticated
using (private.is_game_member(id));

create policy "insert own game shell"
on public.games
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy "update managed games"
on public.games
for update
to authenticated
using (private.is_game_owner_or_admin(id))
with check (private.is_game_owner_or_admin(id));

create policy "select own and game memberships"
on public.game_memberships
for select
to authenticated
using (
  user_id = (select auth.uid())
  or private.is_game_member(game_id)
);

create policy "insert memberships for managed games"
on public.game_memberships
for insert
to authenticated
with check (
  private.is_game_owner_or_admin(game_id)
  and role in (
    'admin'::public.game_member_role,
    'player'::public.game_member_role
  )
);

create policy "update memberships for managed games"
on public.game_memberships
for update
to authenticated
using (private.is_game_owner_or_admin(game_id))
with check (private.is_game_owner_or_admin(game_id));

create policy "select invites for managed games"
on public.game_invites
for select
to authenticated
using (private.is_game_owner_or_admin(game_id));

create policy "insert invites for managed games"
on public.game_invites
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and private.is_game_owner_or_admin(game_id)
);

create policy "revoke invites for managed games"
on public.game_invites
for update
to authenticated
using (private.is_game_owner_or_admin(game_id))
with check (private.is_game_owner_or_admin(game_id));
