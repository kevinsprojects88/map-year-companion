# Game Invites RLS Policies

## Table Purpose

`public.game_invites` stores invite records for private games. It stores only
`token_hash`, never raw invite tokens.

Invite rows are logistics records. They do not create membership by themselves
and do not contain official or proprietary game content.

## RLS Intent

Only active owner/admin members can manage invites for games they administer.
Invite lookup and acceptance by token hash happen through
`public.accept_game_invite(invite_token_hash)`, which delegates privileged work
to a private helper instead of exposing broad client table reads.

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

## Server Action / RPC Behavior

- Create invite tokens, store only hashes, and return the raw token once.
- Accept invites by hashing the raw token server-side, then passing only
  `invite_token_hash` to `public.accept_game_invite(invite_token_hash)`.
- Increment `used_count` only when a new membership is created.
- Return an existing active membership without creating a duplicate.
- Reject removed memberships until a future owner/admin reactivation flow is
  intentionally designed.
- Enforce expiration, revocation, and max-use limits during acceptance.

## Security Notes

- Raw invite tokens are not stored.
- Invite acceptance is intentionally not solved by public table reads.
- No anonymous table grant is added.
- Client-side checks are not authoritative.
