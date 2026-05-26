# Game Invites RLS Policies

## Table Purpose

`public.game_invites` stores invite records for private games. It stores only
`token_hash`, never raw invite tokens.

Invite rows are logistics records. They do not create membership by themselves
and do not contain official or proprietary game content.

## RLS Intent

Only active owner/admin members can manage invites for games they administer.
Invite lookup and acceptance by token are deferred because that flow may need
pre-member or unauthenticated access through a server action or RPC.

## Policy Behavior

### Select

Authenticated owner/admin members can select invite records for their managed
games. There is no public or anonymous broad select policy.

### Insert

Authenticated owner/admin members can create invite records for their managed
games when `created_by` equals their own `auth.uid()`.

The table accepts only token hashes. The raw invite token should be generated
outside the table and shown only at creation time by a future server flow.

### Update

Authenticated owner/admin members can update `revoked_at` for invites in their
managed games. Normal clients are not granted direct updates to `token_hash`,
`used_count`, `max_uses`, or `expires_at`.

### Delete

Normal client access cannot delete invites. The migration grants no delete
privilege and creates no delete policy. Revocation should use `revoked_at`.

## Future Server Action / RPC Needs

- Create invite tokens, store only hashes, and return the raw token once.
- Accept invites by looking up a token hash without exposing all invites.
- Increment `used_count` safely and create the joined membership in the same
  operation.
- Enforce expiration, revocation, and max-use limits during acceptance.

## Security Notes

- Raw invite tokens are not stored.
- Invite acceptance is intentionally not solved by public table reads.
- No anonymous table grant is added.
- Client-side checks are not authoritative.
