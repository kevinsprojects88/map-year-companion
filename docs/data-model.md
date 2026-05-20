# Data Model

## Core Rule

`game_memberships` is the authorization backbone.

Most access rules answer:

> Is `auth.uid()` an active member of this game, and does their role/current turn status allow this action?

## Entities

### `profiles`

| Field | Notes |
|---|---|
| `id` | uuid, same as auth user id |
| `display_name` | required |
| `avatar_color` | optional/later |
| `created_at` | timestamp |
| `updated_at` | timestamp |

### `games`

| Field | Notes |
|---|---|
| `id` | uuid |
| `owner_id` | profile/user id |
| `name` | required |
| `description` | optional |
| `status` | `setup`, `active`, `completed`, `archived` |
| `current_turn_id` | nullable |
| `current_week` | nullable int |
| `current_season` | optional display |
| `created_at` | timestamp |
| `updated_at` | timestamp |
| `completed_at` | nullable |

### `game_memberships`

| Field | Notes |
|---|---|
| `id` | uuid |
| `game_id` | references games |
| `user_id` | references profiles |
| `role` | `owner`, `admin`, `player` |
| `turn_order_index` | required before start |
| `status` | `invited`, `active`, `removed` |
| `joined_at` | nullable |

### `game_invites`

| Field | Notes |
|---|---|
| `id` | uuid |
| `game_id` | references games |
| `token_hash` | store hash, not raw token if possible |
| `created_by` | profile/user id |
| `expires_at` | nullable |
| `max_uses` | nullable |
| `used_count` | default 0 |
| `revoked_at` | nullable |
| `created_at` | timestamp |

### `decks`

| Field | Notes |
|---|---|
| `id` | uuid |
| `game_id` | references games |
| `source_type` | `placeholder`, `manual`, `json_import`, `private_poc` |
| `status` | `draft`, `valid`, `locked` |
| `created_by` | profile/user id |
| `created_at` | timestamp |
| `locked_at` | nullable |

Decks belong to game instances and are user-provided/private content.

### `deck_cards`

| Field | Notes |
|---|---|
| `id` | uuid |
| `deck_id` | references decks |
| `card_key` | e.g. `spring_01` |
| `season` | optional |
| `week_number` | required |
| `prompt_text` | optional/user-provided |
| `metadata` | jsonb optional |
| `created_at` | timestamp |
| `updated_at` | timestamp |

Validation:

- 52 entries for valid deck
- unique card key per deck
- unique week number per deck

### `turns`

| Field | Notes |
|---|---|
| `id` | uuid |
| `game_id` | references games |
| `turn_number` | int |
| `week_number` | int |
| `active_player_id` | profile/user id |
| `deck_card_id` | nullable |
| `status` | `active`, `completed`, `reassigned`, `skipped` |
| `started_at` | timestamp |
| `completed_at` | nullable |
| `reassigned_from_player_id` | nullable |
| `created_at` | timestamp |

### `turn_drafts`

| Field | Notes |
|---|---|
| `id` | uuid |
| `turn_id` | references turns |
| `game_id` | references games |
| `player_id` | active player |
| `outcome_text` | optional draft |
| `map_draft_id` | nullable |
| `state_changes_draft` | jsonb optional |
| `saved_at` | timestamp |

Draft is not official history.

### `turn_outcomes`

| Field | Notes |
|---|---|
| `id` | uuid |
| `turn_id` | unique |
| `game_id` | references games |
| `committed_by` | active player |
| `summary` | required |
| `map_revision_id` | nullable |
| `committed_at` | timestamp |

### `map_revisions`

| Field | Notes |
|---|---|
| `id` | uuid |
| `game_id` | references games |
| `turn_id` | nullable for initial map |
| `created_by` | profile/user id |
| `revision_number` | int |
| `map_document` | jsonb full snapshot |
| `summary` | optional human summary |
| `created_at` | timestamp |

Append-only for MVP.

### `map_drafts`

| Field | Notes |
|---|---|
| `id` | uuid |
| `game_id` | references games |
| `turn_id` | nullable during initial setup |
| `player_id` | active player or owner in setup |
| `base_revision_id` | references map_revisions |
| `map_document` | jsonb draft snapshot |
| `saved_at` | timestamp |

Passive players can view saved drafts after Save Draft. Only active player/owner setup can write.

### `chat_messages`

| Field | Notes |
|---|---|
| `id` | uuid |
| `game_id` | references games |
| `turn_id` | nullable |
| `author_id` | profile/user id |
| `body` | required text |
| `message_type` | `player`, `system` |
| `created_at` | timestamp |
| `edited_at` | nullable/later |

### `story_polls`

| Field | Notes |
|---|---|
| `id` | uuid |
| `game_id` | references games |
| `turn_id` | required |
| `created_by` | active player |
| `question` | required |
| `description` | optional |
| `status` | `open`, `closed` |
| `created_at` | timestamp |
| `closed_at` | nullable |

One active poll per turn by default.

### `story_poll_options`

| Field | Notes |
|---|---|
| `id` | uuid |
| `poll_id` | references story_polls |
| `label` | required |
| `sort_order` | int |

### `story_poll_votes`

| Field | Notes |
|---|---|
| `id` | uuid |
| `poll_id` | references story_polls |
| `option_id` | references story_poll_options |
| `voter_id` | profile/user id |
| `created_at` | timestamp |
| `updated_at` | timestamp |

Constraint: unique vote per `poll_id + voter_id`.

### `process_votes`

| Field | Notes |
|---|---|
| `id` | uuid |
| `game_id` | references games |
| `turn_id` | references turns |
| `created_by` | owner/admin |
| `vote_type` | `reassign_stuck_turn` for MVP |
| `target_player_id` | nullable |
| `reason` | optional |
| `status` | `open`, `passed`, `failed`, `cancelled` |
| `created_at` | timestamp |
| `resolved_at` | nullable |

### `process_vote_responses`

| Field | Notes |
|---|---|
| `id` | uuid |
| `process_vote_id` | references process_votes |
| `voter_id` | profile/user id |
| `response` | `yes`, `no`, `abstain` |
| `created_at` | timestamp |
| `updated_at` | timestamp |

Constraint: unique response per `process_vote_id + voter_id`.

### `projects`

| Field | Notes |
|---|---|
| `id` | uuid |
| `game_id` | references games |
| `name` | required |
| `description` | optional |
| `status` | `active`, `completed`, `abandoned` |
| `remaining_weeks` | nullable |
| `started_turn_id` | nullable |
| `completed_turn_id` | nullable |
| `created_at` | timestamp |
| `updated_at` | timestamp |

### `resources`

| Field | Notes |
|---|---|
| `id` | uuid |
| `game_id` | references games |
| `name` | required |
| `status` | `abundance`, `scarcity`, `neutral`, `custom` |
| `notes` | optional |
| `created_at` | timestamp |
| `updated_at` | timestamp |

### `discontent_entries`

| Field | Notes |
|---|---|
| `id` | uuid |
| `game_id` | references games |
| `holder_user_id` | nullable if community-linked |
| `count` | int |
| `reason` | optional |
| `linked_turn_id` | nullable |
| `created_at` | timestamp |

Recommendation: ledger entries first; aggregate in queries/views.

### `game_events`

| Field | Notes |
|---|---|
| `id` | uuid |
| `game_id` | references games |
| `turn_id` | nullable |
| `event_type` | enum |
| `actor_id` | nullable |
| `summary` | required |
| `payload` | jsonb optional |
| `created_at` | timestamp |

Event types may include:

- `game_created`
- `player_joined`
- `deck_configured`
- `initial_map_created`
- `game_started`
- `turn_draft_saved`
- `turn_committed`
- `map_revision_created`
- `story_poll_created`
- `process_vote_started`
- `turn_reassigned`
- `game_completed`
- `game_archived`

## Relationship Sketch

```txt
profiles
  └── game_memberships
        └── games
              ├── game_invites
              ├── decks
              │     └── deck_cards
              ├── turns
              │     ├── turn_drafts
              │     ├── turn_outcomes
              │     ├── story_polls
              │     │     ├── story_poll_options
              │     │     └── story_poll_votes
              │     └── process_votes
              │           └── process_vote_responses
              ├── map_drafts
              ├── map_revisions
              ├── chat_messages
              ├── projects
              ├── resources
              ├── discontent_entries
              └── game_events
```

## Validation Rules

- one active turn per active game
- only active player can save/commit turn draft
- one official outcome per turn
- official map revisions append-only
- 52 valid card entries before start unless placeholder deck rules allow blank text
- Story Polls require at least two options
- one Story Poll vote per player per poll
- process votes separate from Story Polls
- archived/completed games read-only unless later exceptions are designed
