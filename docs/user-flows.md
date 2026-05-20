# User Flow Map

## Guiding Flow Principle

The app should always answer:

1. Where am I?
2. Whose turn is it?
3. What needs to happen next?
4. What is official vs. just discussion?
5. What changed in the world?

## Main Journey

Create private game → invite players → configure deck/map/community → start game → active player resolves turn with discussion/poll support → active player commits map/outcome → next player acts → repeat until ending → archive the world.

## Entry Points

| Entry Point | Purpose |
|---|---|
| Direct app visit | Return to dashboard |
| Invite link | Join a specific game |
| Direct game URL | Open an existing game |
| Local/dev route | Testing only |

## Auth / Onboarding

Accounts are required. Exact provider details are locked in architecture: Supabase Auth with Magic Link / OTP for MVP.

First-time onboarding requires only display name.

Auth must support invite-link return routing.

## Dashboard Flow

Dashboard groups games by urgency:

1. Your Turn
2. Active Games
3. Waiting to Start
4. Completed Worlds

Each game card shows:

- game/world name
- current status
- active player / waiting player
- draft presence
- active poll/process vote if attention is needed
- last updated time
- clear action

Empty state:

> No worlds yet. Create a game or join one with an invite link.

## Create Game Flow

1. User clicks Create Game.
2. User enters game name and optional description.
3. App creates a private game shell.
4. User routes to lobby/pre-game setup.

## Invite / Join Flow

1. User opens invite link.
2. App validates invite.
3. If signed out, user signs in.
4. User returns to invite preview.
5. User accepts invite.
6. User lands in lobby or active game.

Failure states include expired invite, invalid invite, game full, completed game, and already joined.

## Lobby / Pre-Game Setup Flow

Lobby is a structured checklist, not a blank board.

Required setup areas:

- Invite link
- Player list
- Turn order
- Card/deck setup
- Initial map setup
- Community notes
- Start Game

The owner can edit the initial map before the first turn. This creates the baseline map revision.

The app recommends 2+ players but allows solo start with a warning.

## Card Setup Flow

MVP supports:

- structured card-by-card manual entry
- user-provided JSON import
- placeholder identifiers

Card setup happens before game start. Active players do not enter card prompts mid-turn as the default flow.

Official content remains local/private only and must not be committed or shipped.

## Game Board Flow

Desktop game board uses:

- map-first center workspace
- persistent right rail
- pinned Current Turn panel
- lower right rail tabs for Chat, State, and History

Mobile uses bottom tabs:

- Turn
- Chat
- Map
- State
- History

## Passive Player Flow

Passive players can:

- read current turn/card status
- read and send chat
- vote in Story Polls
- vote in process votes
- inspect map and saved drafts
- review state and history

Passive players cannot:

- edit official map
- commit outcome
- advance turn
- create Story Polls in MVP
- mutate official game state

## Active Player Turn Flow

1. Open game.
2. See active-player state.
3. Review current card/prompt.
4. Discuss in chat.
5. Optionally create Story Poll.
6. Edit map if needed.
7. Draft outcome and state changes.
8. Save Draft.
9. Commit & Advance.
10. App creates official outcome, map revision if present, events, and next turn.

## Save Draft vs Commit & Advance

Save Draft:

- provisional
- may be visible to passive players after save
- not official history

Commit & Advance:

- official
- creates history/event entries
- commits map revision/state changes
- advances to next player

## Chat Flow

Chat is always open to game members while the game is active.

Chat:

- is discussion
- is timestamped and attributed
- can include Story Poll cards
- is preserved
- is not official history
- cannot mutate game state

## Story Poll Flow

Only the active player can create a Story Poll in MVP.

Story Polls:

- appear in chat as Community Vote cards
- are single-choice for MVP
- are advisory only
- have live visible tallies by default for now
- close manually or on turn commit
- do not affect gameplay automatically

## Map Flow

Owner can edit initial map before play starts.

During play, only active player can edit official map draft and commit map revisions.

Passive players can view saved drafts after Save Draft.

Mobile map is read-only, full-screen capable, and supports pan/zoom/fit/reset.

## Reassign Stuck Turn Flow

1. Owner/admin initiates Reassign Stuck Turn process vote.
2. Players vote yes/no/abstain.
3. Vote informs the action.
4. Owner/admin confirms final reassignment for MVP.
5. No story/fictional outcome is created.

## Final Archive Flow

When the game ends:

- game becomes completed/read-only
- final map is preserved
- official timeline is available
- final projects/resources/discontent state is shown
- remembered moments can be highlighted
- roster is shown
- chat log is preserved but collapsed/optional

MVP archive is in-app only. Markdown export is V2. PDF/HTML later.
