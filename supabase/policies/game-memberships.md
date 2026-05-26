# Game Memberships RLS Policies

## Table Purpose

`public.game_memberships` connects profiles to games and provides the main
authorization backbone for game access. Membership rows represent users who have
joined a game; pending invite state is kept in `public.game_invites` instead of
using an `invited` membership status.

## RLS Intent

Active game membership controls access to private game data. Users can see their
own memberships, and active game members can see the membership roster for games
they belong to. Owner/admin members can manage membership status and turn order.

## Policy Behavior

### Select

Authenticated users can select:

- their own membership rows
- membership rows for games where they have an active membership

Anonymous users receive no grants and have no policies.

### Insert

Authenticated owner/admin members can insert `admin` or `player` memberships for
games they manage. Normal client inserts cannot create `owner` memberships.

The initial owner membership for a newly created game is intentionally deferred
to a future server action or RPC so game creation and membership bootstrap can
be transactional.

### Update

Authenticated owner/admin members can update membership `status` and
`turn_order_index` for games they manage. Normal authenticated clients are not
granted direct role updates in this slice.

### Delete

Normal client access cannot delete memberships. The migration grants no delete
privilege and creates no delete policy. Removal should use `status = 'removed'`
unless a future maintenance path explicitly requires hard deletes.

## Future Server Action / RPC Needs

- Create the initial `owner` membership when a game is created.
- Enforce owner transfer and role-change rules.
- Accept invites by creating active player memberships.
- Prevent invalid setup states such as duplicate or missing active turn order
  before game start.

## Security Notes

- There is no `invited` membership status in this slice.
- Players cannot grant themselves owner/admin access through membership RLS.
- Membership policies use private helper functions to avoid recursive RLS.
- Client-side role checks are never authoritative.
