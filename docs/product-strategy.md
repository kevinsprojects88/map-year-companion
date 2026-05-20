# Product Strategy Brief

## Working Name

**Map Year Companion**

Repo folder:

```txt
map-year-companion
```

## Product Summary

Map Year Companion is a personal-use virtual tabletop companion for playing map-based community storytelling games, with the initial private use case being *The Quiet Year*.

The app supports asynchronous play-by-post by giving a small private group one shared place to manage the map, turn order, discussion, advisory community polls, official decisions, projects, resources, discontent, and final world archive.

It is not an official digital edition and must not bundle official game content.

## Core Value Proposition

> Play slowly. Build the map. Keep the world.

The product keeps the map, turn flow, discussion, decisions, and final archive together so async play does not fragment across chat apps, whiteboards, docs, screenshots, and memory.

## Primary User

A small group of friends who want to play *The Quiet Year* asynchronously without losing the map, chat, turn history, or story context across scattered tools.

## Secondary Users

| User Type | Need |
|---|---|
| Game organizer | Create game, invite players, manage setup, keep play moving |
| Active player | Understand turn responsibility, update map/state, commit outcome |
| Passive player | Read, chat, vote, inspect map, review state/history |
| Returning player | Catch up after being away |
| Future reader | Revisit the completed world |

## Core User Problem

The game can be played asynchronously, but the experience becomes fragmented when map edits, discussion, decisions, turn order, projects, and final history live in separate tools.

This causes:

- unclear turn ownership
- buried discussion
- map edits without context
- official decisions blurring with chat
- hard-to-track projects/resources/discontent
- weak catch-up for returning players
- fragile final archive
- stalled async games

## Product Positioning

Private/internal framing:

> A personal-use companion for *The Quiet Year*.

Public/repo-facing framing:

> A map-based community storytelling companion.

## Primary Use Case

A group starts a private game, invites players, configures card content and initial map before play, then plays over days or weeks. One active player owns each turn, while everyone else can discuss, vote in advisory polls, inspect the map, and review state. The active player saves drafts, then commits official outcomes and advances the turn. When the game ends, the world is preserved in an in-app archive.

## Secondary Use Cases

### Real-Time Session Support

Real-time play is supported naturally when players are online together, but there is no separate live mode in MVP.

### Mobile Catch-Up

Mobile supports reading, chat, Story Poll voting, process voting, state review, and full-screen read-only map viewing.

### Finished World Archive

The completed world remains available in-app as a readable archive, with Markdown export deferred to V2 and PDF/HTML export later.

### Solo Testing

Solo start is allowed with a warning for testing, even though the intended play experience is 2+ players.

## Product Boundaries

The product is not:

- a full VTT
- an official digital edition
- a generic collaborative whiteboard
- a social network
- a rules lawyer
- a generative story machine
- a marketplace
- a multi-system platform

## MVP Must Include

- Auth/account access
- Profile display name
- Dashboard
- Create game
- Invite/join flow
- Pre-game setup lobby
- Turn order
- Structured card-by-card setup editor
- JSON deck import and validation
- Initial map setup
- Async turn state
- Active-player-only official actions
- Save Draft
- Commit & Advance
- Chat
- Active-player-created advisory Story Polls
- Reassign Stuck Turn process vote
- Desktop/tablet map editing
- Mobile read-only full-screen map view with pan/zoom
- Projects tracking
- Resources tracking
- Discontent tracking
- Official game history
- Final in-app archive

## MVP Must Not Include

- bundled official card prompts or rulebook text
- separate live mode
- simultaneous drawing
- live cursors
- full mobile map editing
- hard turn timers
- binding story votes
- ranked/anonymous/timed voting
- vote-required turn advancement
- vote-based map approval
- public game discovery
- payments/billing
- marketplace/assets
- AI story generation
- full generic VTT features
- advanced whiteboard tooling

## Card Content Strategy

Card content is configured before a game starts through:

- structured card-by-card manual entry
- user-provided JSON import
- placeholder identifiers

Card content belongs to a game instance and is treated as private user-provided content.

Official card text/content may be used only for local private proof-of-concept testing. It must not be committed, shipped, seeded, included in public docs, uploaded as Project files, or used in public screenshots/videos. Once profiles exist, private proof-of-concept card entries may be linked exclusively to Kevin's personal testing profile.

CSV import is deferred.

## Story Poll Strategy

During their turn, the active player may post an advisory community poll to chat.

Polls:

- are labeled Community Vote
- are created only by the active player in MVP
- are advisory only
- have no automatic gameplay effect
- do not change map, projects, resources, discontent, turns, or official history
- may inform the final committed outcome

## Success Metrics

MVP is successful if:

- Kevin can create a game
- friends can join
- the table can complete multiple async turns
- active-player permissions are enforced
- chat and official decisions stay distinct
- Story Polls support discussion
- a stuck turn can be reassigned through the process flow
- desktop/tablet map editing works
- mobile users can read/chat/vote/view map
- projects/resources/discontent can be tracked
- a final archive preserves the completed world
- Codex can work from docs without inventing architecture

## Product Principles

1. Async-first, not live-first.
2. One active player owns official actions.
3. Chat is not history until committed.
4. The map is the primary artifact.
5. The archive is the reward.
6. Support the table; do not replace it.
7. MVP discipline beats cleverness.
8. Repo docs are the source of truth.
