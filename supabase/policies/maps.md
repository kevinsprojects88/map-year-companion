# Maps RLS Policies

## Table Purpose

`public.map_drafts` stores provisional map state. `public.map_revisions` stores
official committed map snapshots.

Map drafts and map revisions are intentionally separate tables. The exact map
document shape remains unresolved until the future map spike/editor work.

These tables do not store official/proprietary card text, rulebook text, art,
logos, seed data, or private proof-of-concept content.

## RLS Intent

Active game membership controls reads. Only the active player for the active
turn can write their own turn map draft. Official map revisions are append-only
for MVP and are not directly writable, updatable, or deletable by normal clients
in this foundation slice.

Client-side checks are UX only; RLS and future server actions remain the
authority.

## Policy Behavior

### Select

Authenticated active game members can select saved map drafts and official map
revisions for their games. Anonymous users receive no grants and have no
policies.

### Insert

Authenticated active players can insert a map draft only when:

- `player_id = auth.uid()`
- `turn_id` is present
- the referenced turn belongs to the same game
- the referenced turn is still `active`
- the referenced turn's `active_player_id` is the current user
- any `base_revision_id` belongs to the same game

Normal authenticated clients cannot insert official map revisions. Future
commit/start-game services should create official revisions.

Owner/admin initial-map draft behavior is deferred because setup map ownership
needs the future map spike and setup flow.

### Update

Authenticated active players can update their own active-turn map draft document,
base revision, and `saved_at`. They cannot change map draft ownership columns
through normal column grants.

Normal authenticated clients cannot update official map revisions.

### Delete

Normal client access cannot delete map drafts or map revisions. The migration
grants no delete privilege and creates no delete policy.

## Future Server Action / Service Needs

- Define and validate the MVP `map_document` shape.
- Create the initial official map revision during setup/start-game. Revision `0`
  is the intended baseline initial map.
- Validate draft base revision freshness before commit.
- Create official map revisions inside `commitAndAdvanceTurn`.
- Decide whether setup-time owner/admin map drafts need a separate policy or a
  service-only path.

## Security Notes

- Map revisions are full snapshots for MVP.
- Official map revisions are append-only for normal clients: select is allowed
  for active game members, while insert/update/delete are withheld.
- Map drafts are provisional and must not be treated as official history.
