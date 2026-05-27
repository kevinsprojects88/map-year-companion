# Turns RLS Policies

## Table Purpose

`public.turns` stores official turn ownership and lifecycle records.
`public.turn_drafts` stores provisional active-player draft work.
`public.turn_outcomes` stores the committed official outcome for a turn.

Draft state and committed state are intentionally separate tables.

These tables do not store official/proprietary card content, seed data, private
proof-of-concept text, or public game data.

## RLS Intent

Active game membership controls reads. Normal clients can write only their own
draft for the active turn they own. Official turn records and official outcomes
are read-only to normal authenticated clients in this foundation slice.

Future start-game and `commitAndAdvanceTurn` flows should own official writes.
Client-side checks are not authoritative.

## Policy Behavior

### Select

Authenticated active game members can select turns, saved turn drafts, and
official turn outcomes for their games. Anonymous users receive no grants and
have no policies.

### Insert

Normal authenticated clients cannot insert `turns` or `turn_outcomes`.

Authenticated active players can insert one `turn_drafts` row for their active
turn when:

- `player_id = auth.uid()`
- the referenced turn belongs to the same game
- the referenced turn is still `active`
- the referenced turn's `active_player_id` is the current user
- any linked `map_draft_id` belongs to the same turn, game, and player

### Update

Normal authenticated clients cannot update official `turns` or
`turn_outcomes`.

Authenticated active players can update their own active-turn draft text,
linked map draft, draft state JSON, and `saved_at`. They cannot change draft
ownership columns through normal column grants.

### Delete

Normal client access cannot delete turns, turn drafts, or turn outcomes. The
migration grants no delete privilege and creates no delete policy.

## Future Server Action / Service Needs

- Start a game by creating the first active turn and setting `games.current_turn_id`.
- Validate that `active_player_id` is an active member of the game.
- Save turn drafts through a server action if additional validation is needed.
- Commit and advance a turn transactionally by creating the official outcome,
  creating any official map revision, completing the current turn, and creating
  the next active turn.
- Validate reassignment and skipped-turn rules before changing official turn
  state.

## Security Notes

- There is a partial unique index allowing only one active turn per game.
- `games.current_turn_id` now references `public.turns(id)`, but same-game
  consistency and turn advancement rules still belong in future service/action
  validation.
- Turn drafts are visible to active game members after save, but only the active
  player can write their own draft.
- Official outcomes are member-readable and not directly client-writable in this
  slice.
