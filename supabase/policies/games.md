# Games RLS Policies

## Table Purpose

`public.games` stores the private game container. It owns setup metadata,
the current-turn pointer, lifecycle status, and timestamps.

This table does not store official card text, rulebook text, proprietary assets,
seed data, or raw invite tokens.

## RLS Intent

Games are private by default. A signed-in user can read a game only through an
active `game_memberships` row. Owner/admin privileges are represented by active
membership roles, not by client-side checks.

The migration uses private SQL helper functions for membership checks so RLS
policies do not recursively query `game_memberships` through its own policies.

## Policy Behavior

### Select

Authenticated users can select a game only when they are an active member of
that game. Anonymous users receive no grants and have no policies.

### Insert

Authenticated users can insert a new game shell only when `owner_id` equals
their own `auth.uid()`. The profile row must already exist because `owner_id`
references `public.profiles(id)`.

The insert policy is intentionally not a complete product flow. Creating a game
and creating the initial owner membership should be wrapped by a future server
action or RPC so both rows are created together.

### Update

Only active owner/admin members can update basic game setup and lifecycle fields
granted to normal authenticated clients.

### Delete

Normal client access cannot delete games. The migration grants no delete
privilege and creates no delete policy.

## Future Server Action / RPC Needs

- Create game plus the initial `owner` membership transactionally.
- Validate lifecycle transitions such as setup to active, completed, and
  archived.
- Validate `current_turn_id` changes now that it references `turns(id)`.

## Security Notes

- No public or anonymous game reads are allowed.
- Client-side permission checks are UX only; RLS is the authority.
- `games.current_turn_id` is linked to `turns(id)` after the Phase 3B deck/turn/map migration.
- The owner id is logistics metadata. Active membership roles remain the
  authorization backbone.
