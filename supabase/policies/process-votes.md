# Process Votes RLS Policies

## Table Purpose

`public.process_votes` stores governance/admin votes for game logistics. The MVP
process vote type is `reassign_stuck_turn`. `public.process_vote_responses`
stores one member response per process vote.

Process Votes are separate from Story Polls. They are not story input, do not
represent fictional outcomes, and do not automatically reassign turns or mutate
official state.

## RLS Intent

Active game membership controls reads and responses. Active owner/admin members
can initiate Process Votes. Active game members can cast or change their own
response while a Process Vote is open.

Anonymous users receive no grants and have no policies. Client-side role checks
are UX only; RLS enforces owner/admin creation and member response access.

## Policy Behavior

### Select

Authenticated active game members can select Process Votes and responses for
games where they have active membership. There are no public process-vote reads.

### Insert

Authenticated active owner/admin members can insert a Process Vote only when:

- `created_by = auth.uid()`
- the referenced turn belongs to the same game
- the Process Vote starts open
- any `target_player_id` is an active member of the same game

Authenticated active game members can insert one response for their own profile
on an open Process Vote.

### Update

Normal authenticated clients can update only their own Process Vote response
while the parent Process Vote is open. The shared `updated_at` trigger records
response changes.

Normal clients cannot update Process Vote status or `resolved_at` in this
foundation slice. Passing, failing, cancelling, confirming final action, and
turn reassignment are deferred to future trusted server action/service work.

### Delete

Normal client access cannot delete Process Votes or responses. The migration
grants no delete privilege and creates no delete policy.

## Future Server Action / Service Needs

- Resolve Process Votes by computing pass/fail rules and setting `resolved_at`.
- Confirm the final owner/admin action after a vote passes.
- Reassign stuck turns transactionally without partial official state.
- Decide whether cancellation is owner/admin-only or service-only.
- Emit any future trusted system chat message separately from vote resolution.

## Security Notes

- Process Votes are governance/admin only and separate from advisory Story Polls.
- One open Process Vote per turn/type is enforced with a partial unique index.
- One response per voter per Process Vote is enforced with a unique constraint.
- The schema does not automatically change turns, maps, official history, or
  game state.
- No service role key, secrets, seed data, private content, or
  official/proprietary content is introduced by these tables.
