# Schema/RLS Verification

Reusable SQL checks for Phase 3 schema/RLS closeout. Run these in Supabase SQL
Editor or another trusted SQL client against the target project.

## Table Inventory

```sql
with expected(table_name) as (
  values
    ('profiles'),
    ('games'),
    ('game_memberships'),
    ('game_invites'),
    ('decks'),
    ('deck_cards'),
    ('turns'),
    ('turn_drafts'),
    ('turn_outcomes'),
    ('map_drafts'),
    ('map_revisions'),
    ('chat_messages'),
    ('story_polls'),
    ('story_poll_options'),
    ('story_poll_votes'),
    ('process_votes'),
    ('process_vote_responses'),
    ('projects'),
    ('resources'),
    ('discontent_entries'),
    ('game_events')
)
select
  table_name,
  to_regclass('public.' || table_name) is not null as exists
from expected
order by table_name;
```

## RLS Enabled

```sql
with expected(table_name) as (
  values
    ('profiles'),
    ('games'),
    ('game_memberships'),
    ('game_invites'),
    ('decks'),
    ('deck_cards'),
    ('turns'),
    ('turn_drafts'),
    ('turn_outcomes'),
    ('map_drafts'),
    ('map_revisions'),
    ('chat_messages'),
    ('story_polls'),
    ('story_poll_options'),
    ('story_poll_votes'),
    ('process_votes'),
    ('process_vote_responses'),
    ('projects'),
    ('resources'),
    ('discontent_entries'),
    ('game_events')
)
select
  expected.table_name,
  coalesce(pg_class.relrowsecurity, false) as rls_enabled
from expected
left join pg_class
  on pg_class.oid = to_regclass('public.' || expected.table_name)
order by expected.table_name;
```

## Policy Coverage

```sql
with expected(table_name) as (
  values
    ('profiles'),
    ('games'),
    ('game_memberships'),
    ('game_invites'),
    ('decks'),
    ('deck_cards'),
    ('turns'),
    ('turn_drafts'),
    ('turn_outcomes'),
    ('map_drafts'),
    ('map_revisions'),
    ('chat_messages'),
    ('story_polls'),
    ('story_poll_options'),
    ('story_poll_votes'),
    ('process_votes'),
    ('process_vote_responses'),
    ('projects'),
    ('resources'),
    ('discontent_entries'),
    ('game_events')
)
select
  expected.table_name,
  count(pg_policies.policyname) as policy_count,
  coalesce(array_agg(pg_policies.policyname order by pg_policies.policyname)
    filter (where pg_policies.policyname is not null), '{}') as policies
from expected
left join pg_policies
  on pg_policies.schemaname = 'public'
 and pg_policies.tablename = expected.table_name
group by expected.table_name
order by expected.table_name;
```

## Grants For Anon/Authenticated

```sql
select
  'table' as grant_scope,
  table_name,
  null as column_name,
  grantee,
  privilege_type
from information_schema.table_privileges
where table_schema = 'public'
  and grantee in ('anon', 'authenticated')
union all
select
  'column' as grant_scope,
  table_name,
  column_name,
  grantee,
  privilege_type
from information_schema.column_privileges
where table_schema = 'public'
  and grantee in ('anon', 'authenticated')
order by table_name, grant_scope, column_name, grantee, privilege_type;
```

Expected shape: no `anon` grants for Phase 3 app tables.

## Game Event Types

```sql
select pg_enum.enumlabel as event_type
from pg_type
join pg_enum on pg_enum.enumtypid = pg_type.oid
join pg_namespace on pg_namespace.oid = pg_type.typnamespace
where pg_namespace.nspname = 'public'
  and pg_type.typname = 'game_event_type'
order by pg_enum.enumsortorder;
```

## No Raw Invite Tokens

```sql
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'game_invites'
  and column_name ilike '%token%'
order by column_name;
```

Expected result: `token_hash` only.

## Phase 4H Invite Flow Membership Check

Use this to verify the accepted invite created the expected active membership
rows for the smoke-test game.

```sql
select
  profiles.display_name,
  profiles.id as user_id,
  memberships.role,
  memberships.status,
  memberships.turn_order_index,
  memberships.joined_at
from public.game_memberships memberships
join public.profiles profiles
  on profiles.id = memberships.user_id
where memberships.game_id = 'c54887e2-6ee1-46a2-9861-7a5894d697db'
order by memberships.turn_order_index nulls last, profiles.display_name;
```

Expected result for the Phase 4G manual verification:

- Kevin is `owner` / `active` / `turn_order_index = 0`.
- `kevinrallen0` is `player` / `active` / `turn_order_index = 1`.

## Phase 4H Invite Usage Check

Use this to verify the latest invite for the smoke-test game was consumed once
and remains unlimited, not revoked, and unexpired.

```sql
select
  id,
  game_id,
  used_count,
  max_uses,
  revoked_at,
  expires_at,
  created_at
from public.game_invites
where game_id = 'c54887e2-6ee1-46a2-9861-7a5894d697db'
order by created_at desc
limit 1;
```

Expected result for the Phase 4G manual verification:

- `used_count = 1`
- `max_uses = null`
- `revoked_at = null`
- `expires_at = null`

## No Authenticated Delete Grants

```sql
select table_name, privilege_type
from information_schema.table_privileges
where table_schema = 'public'
  and grantee = 'authenticated'
  and privilege_type = 'DELETE'
order by table_name;
```

Expected result: no rows.

## Official/Draft Table Separation

```sql
select
  'table' as grant_scope,
  table_name,
  null as column_name,
  grantee,
  privilege_type
from information_schema.table_privileges
where table_schema = 'public'
  and grantee = 'authenticated'
  and table_name in (
    'turn_drafts',
    'map_drafts',
    'turns',
    'turn_outcomes',
    'map_revisions',
    'projects',
    'resources',
    'discontent_entries',
    'game_events'
  )
union all
select
  'column' as grant_scope,
  table_name,
  column_name,
  grantee,
  privilege_type
from information_schema.column_privileges
where table_schema = 'public'
  and grantee = 'authenticated'
  and table_name in (
    'turn_drafts',
    'map_drafts',
    'turns',
    'turn_outcomes',
    'map_revisions',
    'projects',
    'resources',
    'discontent_entries',
    'game_events'
  )
order by table_name, grant_scope, column_name, grantee, privilege_type;
```

Expected shape: draft tables may have constrained client write grants; official
history/state tables should not expose normal client writes unless a later
trusted flow explicitly adds them.
