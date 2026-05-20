# Visual Direction

## Approved Direction

**Weathered Field Journal**

## Design Concept

A quiet, tactile map-based community storytelling workspace that feels like a shared field notebook gradually becoming a durable world archive.

## Brand Personality

Observant, careful, grounded, reflective, modest, and quietly communal.

The app should feel like a practical artifact made for preserving a fragile community's story, not like a corporate dashboard, fantasy VTT, or generic whiteboard.

## Mood Keywords

Quiet, tactile, legible, reflective, weathered, restrained, communal, slightly post-apocalyptic, archival, human.

## Typography

Use a restrained pairing:

- Serif display/headings for world titles, archive headings, major section titles, and kept-world moments.
- Humanist sans-serif for body text, UI, buttons, forms, labels, badges, chat, and controls.
- Optional mono-like label treatment only for timestamps, counters, validation statuses, and structured records.

Avoid fantasy display fonts, distressed novelty fonts, or over-styled handwriting.

## Color Direction

Warm, muted, accessible palette:

- paper/parchment backgrounds
- charcoal ink text
- moss/olive for active and official states
- clay/rust for drafts, warnings, provisional changes
- faded brass/ochre for advisory polls/community votes
- muted slate for secondary structure

Avoid sepia mush. Maintain contrast.

## Surfaces

- warm paper-like app background
- lightly elevated cards
- subtle grain/dot/grid texture only where useful
- physical/hand-marked map canvas
- practical restrained UI chrome

Avoid heavy parchment textures, fantasy scrolls, burned edges, ornate borders, and copied trade dress.

## Borders / Radius / Shadows

- soft rounded cards
- thin warm borders
- dashed/broken borders for draft/provisional state
- subtle shadows like lifted paper
- stronger borders for state distinction instead of relying on color alone

## Iconography

Simple utilitarian line icons.

Recommended categories:

- Map
- Archive
- Chat
- Vote
- Clock/turn
- Users
- Draft/pencil
- Commit/flag
- History/ledger
- Warning/process

Avoid ornate fantasy icons, dice-first language, RPG combat icons, spellbooks, or tactical vocabulary.

## Map Style

The map should feel hand-authored and community-made:

- simple regions
- routes
- landmarks
- labels
- pins
- notes

Draft changes appear provisional. Committed marks settle into calmer integrated styling.

The map is the primary artifact, not a battlemap.

## Motion

Use restrained functional motion only:

- drawer transitions
- modal/sheet transitions
- toast fade in/out
- draft save confirmation
- tab switching
- full-screen mobile map open/close

Avoid playful bouncing, particles, cinematic transitions, and animation-heavy UI.

## Accessibility Requirements

- Maintain strong contrast.
- Never rely on color alone.
- Draft state requires label + dashed border + timestamp/provisional copy.
- Official history requires label + ledger/card treatment.
- Buttons/controls need visible focus states.
- Mobile tap targets must be comfortable.
- Chat, polls, and history should be screen-reader friendly.
- Polls must clearly state advisory/no automatic gameplay effect.
- Full-screen mobile map must include close, fit, zoom reset, and read-only indicators.

## UX Direction

### Navigation

Two-level navigation:

- app level: Dashboard, Waiting to Start, Active Games, Completed Worlds, Profile/Settings if needed
- game level: collapsed global nav, light game header, current turn state, active player, key actions

### Dashboard

Groups:

- Your Turn
- Active Games
- Waiting to Start
- Completed Worlds

### Lobby

Structured checklist, not blank board.

Includes invite link, player list, turn order, deck setup, JSON import validation, initial map, community notes, Start Game, and solo-start warning.

### Desktop Game Board

Map-first center workspace with persistent right rail.

Map occupies primary area. Right rail contains:

- pinned Current Turn Panel at top
- switchable lower pane: Chat, State, History

### Mobile

Bottom tabs:

- Turn
- Chat
- Map
- State
- History

Map opens full-screen read-only with pan/zoom/fit/reset/close.

### Chat Placement

Chat lives in the switchable right rail, not a bottom drawer and not a full-height dominant chat panel.

### Story Polls

Story Polls appear in chat as special cards labeled Community Vote.

They are advisory only, created by the active player, and have no automatic gameplay effect.

### Draft vs Committed State

Draft:

- Draft badge
- dashed/broken border
- rust/clay accent
- saved-at timestamp
- provisional copy
- clear official-history-unchanged language

Committed:

- Official badge
- stable ledger card
- moss/olive accent
- integrated map styling
- permanent history entry

### Official History vs Chat

Chat is conversation.

Official history is committed canon, ledger/timeline style, keyed to turns/weeks, and linked to map/state where possible.

They must not share the same component style.

### Final Archive

Structure:

1. Summary header
2. Final map
3. Official timeline/ledger
4. Final projects/resources/discontent state
5. Remembered moments
6. Participant roster
7. Collapsed chat log

## Visual Avoid List

Avoid:

- official game assets/trade dress
- flashy fantasy UI
- grimdark edgelord aesthetics
- generic SaaS blue/white styling
- full VTT clutter
- tactical combat map vocabulary
- whiteboard chaos
- ornate parchment UI
- excessive animation
- chat-dominant layouts
- official history looking like casual chat
