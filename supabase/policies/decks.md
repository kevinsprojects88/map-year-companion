# Decks RLS Policies

## Table Purpose

`public.decks` stores the one MVP deck shell for a private game. `public.deck_cards`
stores game-specific card rows for that deck.

Deck/card content is user-provided and private to the game. The repository must
not store, seed, ship, or document official/proprietary card text, rulebook text,
art, logos, or private proof-of-concept content.

## RLS Intent

Active game membership controls reads. Owner/admin membership controls setup-time
deck and card management. Anonymous users receive no grants and have no policies.

Deck locking is handled by a narrow authenticated RPC that re-runs validation at
mutation time. Client checks are UX only; RLS and the RPC are the database
authority.

## Policy Behavior

### Select

Authenticated active game members can select the deck and deck cards for games
where they have active membership. There are no public deck or card reads.

### Insert

Authenticated owner/admin members can insert a deck for a game only while that
game is still in `setup`, and `created_by` must match `auth.uid()`.

Authenticated owner/admin members can insert deck cards only for setup-game draft
decks they manage, and only while the deck is not locked.

### Update

Authenticated owner/admin members can update the deck source label and deck-card
content only while the parent game remains in `setup`, the deck remains `draft`,
and `locked_at` is null.

The table grants no direct writes to `status`, `locked_at`, or `updated_at`.
Deck locking stays behind `public.lock_game_deck(target_game_id uuid)`, and the
shared trigger updates `updated_at`.

### Delete

Normal client access cannot delete decks or deck cards. The migration grants no
delete privilege and creates no delete policy. Hard deletes, if ever needed, must
be handled by a future trusted maintenance or setup service path.

## Server Action / Service Needs

- Validate that a deck has the required 52 card entries.
- Validate imported JSON before inserting cards.
- Lock a deck through the RPC before any future start-game flow can use it.
- Keep start-game behavior, turn creation, and game status mutation out of deck
  locking.

## Security Notes

- `private_poc` is only a source label for local/private proof-of-concept use.
  It does not permit committing or seeding official/proprietary content.
- `prompt_text` may be null so placeholder decks can exist without real card
  text.
- Deck cards intentionally do not include card art or background image fields in
  the MVP schema.
