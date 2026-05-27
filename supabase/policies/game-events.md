# Game Events RLS Policies

## Table Purpose

`public.game_events` stores official event log entries for a private game. Event
rows can point to a turn, actor, event type, summary, and optional structured
payload for future trusted flows.

Game events are official history/log records. They are structurally separate
from `public.chat_messages`, Story Poll votes, Process Vote responses, drafts,
map drafts, and other discussion or provisional state.

This table does not store official card text, rulebook text, proprietary
assets, seed data, private proof-of-concept content, notifications, archive
exports, or realtime behavior.

## RLS Intent

Active game membership controls reads. Anonymous users receive no grants and
have no policies.

Normal authenticated clients can read events for games where they have active
membership, but they cannot directly create, update, or delete official event
records in this foundation slice. Future controlled server actions/services
should create events as part of validated official flows.

## Policy Behavior

### Select

Authenticated active game members can select game events for games where they
have active membership. There are no public game-event reads.

### Insert

Normal client access cannot insert game events. The migration grants no insert
privilege and creates no insert policy.

Future trusted flows should insert game events only after the underlying
official operation succeeds.

### Update

Normal client access cannot update game events. The migration grants no update
privilege and creates no update policy.

Game events are intended to behave as log entries. Any future correction flow
should be explicit about whether it appends a correcting event or allows trusted
maintenance edits.

### Delete

Normal client access cannot delete game events. The migration grants no delete
privilege and creates no delete policy.

## Future Server Action / Service Needs

- Create `game_created`, `player_joined`, setup, start-game, turn, map, poll,
  process-vote, community-state, completion, and archive events from trusted
  server flows.
- Keep event creation transactionally paired with official state changes where
  losing the event would harm the official timeline.
- Validate that referenced turns and actors belong to the same game context
  before event creation.
- Decide payload shape per event type before product code depends on it.
- Keep realtime as UI refresh only; RLS remains the authority.

## Security Notes

- Game events are private to active members of a game.
- Game events are official history/log entries; chat is discussion and is not
  official history.
- Story Poll votes are advisory input, not official outcomes by themselves.
- Process Vote responses are governance input, not official state changes by
  themselves.
- Direct client writes are intentionally withheld for official events.
- No service role key, secrets, seed data, private content, or
  official/proprietary content is introduced by this table.
