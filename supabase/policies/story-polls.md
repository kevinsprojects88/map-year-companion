# Story Polls RLS Policies

## Table Purpose

`public.story_polls` stores advisory community votes created by the active
player during their turn. `public.story_poll_options` stores the options for a
poll, and `public.story_poll_votes` stores one member vote per poll.

Story Polls are story input, not governance, and they have no automatic gameplay
effect. They do not create official history, update the map, advance turns, or
bind the active player.

## RLS Intent

Active game membership controls reads. The active player for an active turn can
create a Story Poll and its options. Active game members can cast or change one
vote while the poll is open.

Anonymous users receive no grants and have no policies. Client-side permission
checks are UX only; RLS enforces membership, active-player creation, and
one-vote-per-member constraints.

## Policy Behavior

### Select

Authenticated active game members can select Story Polls, options, and votes for
games where they have active membership. There are no public poll reads.

### Insert

Authenticated active players can insert a Story Poll only when:

- `created_by = auth.uid()`
- the referenced turn belongs to the same game
- the referenced turn is still active
- the referenced turn's `active_player_id` is the current user
- the poll starts open

Authenticated active players can insert options for their own open poll while
they still own the active turn.

Authenticated active game members can insert one vote for their own profile on
an open poll. A composite foreign key ensures the selected `option_id` belongs
to the same `poll_id`.

### Update

Normal authenticated clients can update only their own Story Poll vote by
changing `option_id` while the parent poll is open. The shared `updated_at`
trigger records vote changes.

Normal clients cannot update Story Poll questions, descriptions, options, or
poll status in this slice. Closing a poll is deferred to a future trusted server
action or service path.

### Delete

Normal client access cannot delete Story Polls, options, or votes. The migration
grants no delete privilege and creates no delete policy.

## Future Server Action / Service Needs

- Create a Story Poll and at least two options together transactionally.
- Validate option count and duplicate labels before insert.
- Close polls intentionally and set `closed_at`.
- Decide whether active player or owner/admin can close a poll from product UI.
- Keep Story Poll results advisory only.

## Security Notes

- Story Polls are visible only to active members of the private game.
- Story Polls are advisory and have no automatic gameplay effect.
- One open Story Poll per turn is enforced with a partial unique index.
- One vote per voter per poll is enforced with a unique constraint.
- Story Poll votes are member-visible in this foundation slice; anonymous and
  ranked voting are intentionally not included.
