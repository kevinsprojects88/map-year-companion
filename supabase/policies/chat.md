# Chat RLS Policies

## Table Purpose

`public.chat_messages` stores member discussion for a private game. Chat may be
linked to a turn or future object label for context, but it is not official
history and does not mutate game state.

This table does not store official/proprietary card text, rulebook text, seed
data, private proof-of-concept content, file uploads, or rich text.

## RLS Intent

Active game membership controls reads and player-message creation. Anonymous
users receive no grants and have no policies.

Normal authenticated clients can create only their own `player` messages.
`system` messages are represented structurally for future trusted flows, but
direct client system-message insertion is withheld in this slice.

## Policy Behavior

### Select

Authenticated active game members can select chat messages for games where they
have active membership. There are no public chat reads.

### Insert

Authenticated active game members can insert player chat messages only when:

- `author_id = auth.uid()`
- `message_type` remains `player`
- `system_type` is null
- any linked `turn_id` belongs to the same game

The normal client column grant omits `message_type` and `system_type`, so player
messages use the default player type. System messages are reserved for future
trusted service/server paths.

### Update

Normal client access cannot update chat messages in this slice. Message editing,
if added later, should define owner-only edit rules, `edited_at` behavior, and
safe text validation in one focused pass.

### Delete

Normal client access cannot delete chat messages. The migration grants no delete
privilege and creates no delete policy.

## Future Server Action / Service Needs

- Validate and send player chat messages through a server action if the product
  needs stronger moderation or rate limits.
- Create trusted system messages for future process/state notifications.
- Decide whether member-owned edit behavior belongs in RLS or only in server
  actions.
- Keep realtime as UI refresh only; RLS remains the authority.

## Security Notes

- Chat is private to active game members.
- Chat is discussion only and must not be treated as official history.
- System messages are not client-writable through normal authenticated access.
- No service role key, private content, seed data, or official/proprietary
  content is introduced by this table.
