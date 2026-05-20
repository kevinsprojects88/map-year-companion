# Core Screens List

## MVP Required Screens / UI States

1. Landing / Sign-In
2. Profile Setup
3. Dashboard
4. Create Game
5. Invite Preview / Join Game
6. Game Lobby / Pre-Game Setup
7. Structured Card Deck Setup
8. JSON Import / Deck Validation
9. Initial Map Setup
10. Game Board
11. Current Turn Panel
12. Map Viewer / Map Editor
13. Full-Screen Mobile Map View
14. Chat Panel
15. Story Poll Create Modal
16. Story Poll Card
17. Projects / Resources / Discontent Panel
18. Game History Tab/Drawer
19. Reassign Stuck Turn Vote Modal/Panel
20. Final Archive

## MVP Nice-to-Have

- Game Settings, folded into lobby/game board if possible
- Account Settings
- Deck Format Help, ideally inline

## Later Version Screens

- Markdown Export
- PDF/HTML Export
- Starter Map Library
- Notification Preferences
- Public/Spectator Archive Sharing
- Advanced Map Revision Browser
- Mobile Map Editing

## Screen Details

### Landing / Sign-In

Purpose: unauthenticated entry.

Primary action: sign in.

Data shown: app name, short description, sign-in action, invite continuation if applicable.

Mobile: first-class.

### Profile Setup

Purpose: capture display name for attribution.

Required field: display name.

Skip if profile already exists.

### Dashboard

Purpose: show games and what needs attention.

Sections:

- Your Turn
- Active Games
- Waiting to Start
- Completed Worlds

Cards show status, active player, draft/poll/process indicators, last activity, and action.

### Create Game

Purpose: create private game shell.

Fields:

- game name required
- description optional

Routes to lobby.

### Invite Preview / Join Game

Purpose: accept invite after auth.

Shows game name, owner, status, player count, validity, and join action.

Must preserve return routing after sign-in.

### Game Lobby / Pre-Game Setup

Purpose: prepare game before first turn.

Checklist:

- game info
- invite players
- player list
- turn order
- card setup
- initial map
- community notes
- start game

Solo start warning if fewer than two players.

### Structured Card Deck Setup

Purpose: configure card content before game start.

Supports:

- card-by-card UI editor
- JSON import
- validation summary

Cards are UI cards, not styled collectible playing cards. Custom card visuals are V2.

### Initial Map Setup

Purpose: owner creates baseline map before first turn.

Creates initial map revision.

Desktop/tablet authoring first.

### Game Board

Purpose: main play experience.

Desktop layout:

- map-first center workspace
- persistent right rail
- Current Turn pinned top
- lower tabs: Chat, State, History

Mobile layout:

- Turn
- Chat
- Map
- State
- History

### Current Turn Panel

Purpose: guide active player and inform passive players.

Shows:

- active player
- week/turn marker
- current card/prompt
- checklist
- draft status
- Story Poll status
- Save Draft
- Commit & Advance

### Map Viewer / Editor

Modes:

- read-only viewer
- full-screen mobile viewer
- initial setup editor
- active-player turn editor

MVP tools:

- select/inspect
- pan
- draw/mark
- line/route
- text/label
- note pin
- erase/remove
- fit/zoom

### Full-Screen Mobile Map View

Read-only.

Supports:

- pan
- pinch zoom
- fit to map
- zoom reset
- close
- read-only indicator

### Chat Panel

Purpose: player discussion.

Includes messages, system notes, and Story Poll cards.

Chat is distinct from official history.

### Story Poll Create Modal

Active-player-only in MVP.

Fields:

- question
- at least two options
- optional description

### Story Poll Card

Appears in chat as Community Vote.

Advisory only. No automatic gameplay effect.

### Projects / Resources / Discontent Panel

Desktop: State tab.

Mobile: State tab.

Compact cards/rows with official-history links and recent-change indicators.

### Game History Tab/Drawer

Official committed history only.

Lives inside Game Board for MVP.

Not chat.

### Reassign Stuck Turn Vote Modal/Panel

Owner/admin initiated.

Separate from Story Poll UX.

Process/governance action, not story input.

### Final Archive

Read-only in-app archive.

Sections:

- summary header
- final map
- official timeline
- final projects/resources/discontent state
- remembered moments
- roster
- collapsed chat log

## Screens Explicitly Not in MVP

- Public game directory
- Marketplace/assets browser
- Billing/pricing
- Character sheets
- Dice roller page
- Live session room with cursors
- Social profiles
- Admin analytics dashboard
- AI lore generation
- Complex rulebook/reference screen
