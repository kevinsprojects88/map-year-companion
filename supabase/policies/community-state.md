# Community State RLS Policies

## Table Purpose

`public.projects`, `public.resources`, and `public.discontent_entries` store
official community state for a private game.

Projects track ongoing or resolved community work. Resources track shared
community conditions such as abundance, scarcity, neutral, or custom status.
Discontent entries are ledger-style records that can later be aggregated by
queries or views.

These tables are official state, not drafts. They do not store official card
text, rulebook text, proprietary assets, seed data, private proof-of-concept
content, inventory stacks, chat messages, or realtime behavior.

## RLS Intent

Active game membership controls reads. Anonymous users receive no grants and
have no policies.

Normal authenticated clients can read community state for games where they have
active membership, but they cannot directly create, update, or delete official
community state in this foundation slice. Future controlled server
actions/services should own project, resource, and discontent changes.

## Policy Behavior

### Select

Authenticated active game members can select projects, resources, and
discontent entries for games where they have active membership. There are no
public community-state reads.

### Insert

Normal client access cannot insert projects, resources, or discontent entries.
The migration grants no insert privilege and creates no insert policy.

Official community-state creation should happen later through trusted
setup/start-game or turn commit flows after product validation is designed.

### Update

Normal client access cannot update projects, resources, or discontent entries.
The migration grants no update privilege and creates no update policy.

Project and resource rows have shared `updated_at` triggers ready for future
trusted update paths. Discontent entries are ledger records and do not include
an `updated_at` column in this slice.

### Delete

Normal client access cannot delete projects, resources, or discontent entries.
The migration grants no delete privilege and creates no delete policy.

If official state correction or maintenance is needed later, it should be
designed as a trusted service path with explicit audit expectations.

## Future Server Action / Service Needs

- Create initial community state during setup/start-game if the product needs
  starter rows.
- Apply project/resource/discontent changes during `commitAndAdvanceTurn`.
- Validate that referenced turns belong to the same game before official state
  changes are written.
- Create matching `game_events` entries for official state changes.
- Decide whether state correction is admin-only, service-only, or represented
  as additional ledger events.

## Security Notes

- Community state is private to active members of a game.
- Membership is the authorization backbone.
- Client-side permission checks are UX only; RLS is the database authority.
- Direct client writes are intentionally withheld for official state.
- Game events are the official event log for committed changes; chat remains
  discussion and is not official history.
- No service role key, secrets, seed data, private content, or
  official/proprietary content is introduced by these tables.
