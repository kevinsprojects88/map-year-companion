# Component System Plan

## Goal

The system should make the app feel like a quiet field journal that became a reliable digital tabletop workspace.

It must clearly distinguish:

- Chat
- Draft
- Official
- Advisory Poll
- Process Vote

## Design Tokens

Use raw palette tokens plus semantic usage tokens.

Raw palette examples:

- `paper.*`
- `charcoal.*`
- `moss.*`
- `olive.*`
- `rust.*`
- `clay.*`
- `ochre.*`
- `slate.*`

Semantic examples:

- `bg.app`
- `bg.surface`
- `bg.surfaceRaised`
- `bg.canvas`
- `text.primary`
- `text.secondary`
- `state.official`
- `state.draft`
- `state.poll`
- `state.process`
- `border.default`
- `border.draft`
- `border.official`
- `border.focus`

Components should use semantic tokens. Raw tokens belong in theme definitions.

### Phase 1A Token Convention

- `src/styles/tokens.css` is the source of truth for raw palette values and semantic design tokens.
- `src/styles/theme.css` maps semantic tokens into shadcn-compatible variables.
- `src/app/globals.css` exposes theme values to Tailwind v4 and applies global base styling.
- Components should prefer semantic tokens over raw palette values.
- Raw palette values belong in token and theme definitions, not scattered across component files.

## Implemented Phase 1 Primitives

Current implemented primitives include:

- Token/theme foundation
- Card and badge/state badge primitives
- Button primitives
- Feedback primitives
- Input/textarea/field primitives
- Select/checkbox/switch primitives
- Tabs/segmented control primitives
- Dashboard and setup card primitives
- Story Poll and Process Vote primitives
- Current Turn Panel primitive
- Community State card primitives
- Official History / Timeline primitives
- Map Viewer shell primitives
- Chat primitives
- Right Rail shell primitive
- Layout shell primitives
- Archive section primitives, including remembered moments

## Component Library

Use `shadcn/ui` as the base and theme it heavily toward Weathered Field Journal.

Do not let the app look like default shadcn.

## Motion

Restrained functional motion only:

- drawers
- modals/sheets
- toasts
- full-screen mobile map
- subtle tab/panel changes

## Core Components

### Buttons

Variants:

- primary
- secondary
- ghost
- destructive
- process
- draft
- official

Rules:

- reserve primary for major actions
- Commit & Advance must be visually dominant
- Save Draft is distinct from Commit & Advance
- disabled buttons must explain why

### Inputs

Use labels, helper text, validation messages, strong focus states.

Never use placeholder-only labels.

### Textareas

Used for:

- turn outcome drafts
- community notes
- card prompts
- chat
- poll context

Draft textareas must look provisional. Official committed text must not look editable.

### Selects / Dropdowns

Used for:

- player selector
- turn order
- reassign target
- card setup method
- resource/project statuses

Prefer accessible primitives.

### Checkboxes / Toggles

Used for validation/checklist/status.

Setup checklist completion should usually reflect validation, not arbitrary user clicking.

## Card Families

### Base Card

Variants:

- default
- raised
- draft
- official
- poll
- process
- archived
- error

### Game Card

Dashboard card variants:

- yourTurn
- active
- waitingToStart
- completed
- needsAttention

Shows status, active player, week/turn, draft/poll/process indicators, last activity, and action.

### Setup Checklist Card

Variants:

- complete
- incomplete
- warning
- blocked
- optional

### Card Deck Entry Card

Variants:

- empty
- configured
- invalid
- current
- readOnly

Cards are UI cards, not necessarily styled playing cards. Visual card customization is V2.

## Modals / Sheets

Use for:

- Story Poll creation
- JSON import
- deck validation details
- Reassign Stuck Turn
- invite preview/join confirmation
- mobile panels

Must handle focus, escape, mobile viewport, and unsaved data.

## Navigation Components

### App Header

Used for app-level pages.

### Game Header

Shows world title, current turn, active player, status badges, and key actions.

### Right Rail Tabs

Desktop tabs:

- Chat
- State
- History

Current Turn panel stays pinned above.

### Mobile Bottom Tabs

Mobile tabs:

- Turn
- Chat
- Map
- State
- History

Use icons plus text labels.

## Chat Components

### Chat Message

Variants:

- player
- system
- linkedReference
- failedPending

Chat is not official history.

### Chat Composer

Must preserve typed text across tab switches where feasible.

Archived games are read-only unless explicitly changed later.

## Poll Components

### Story Poll Card

Variants:

- open
- voted
- closed
- readOnly

Must show:

- Community Vote label
- advisory/no automatic gameplay effect copy
- question
- options
- vote state
- results/tallies
- creator/status

### Process Vote Card

Separate from Story Poll styling.

Used for Reassign Stuck Turn only in MVP.

## Timeline / History Components

### History Entry Card

Variants:

- turnOutcome
- mapRevision
- projectChange
- resourceChange
- discontentChange
- gameStarted
- gameCompleted

Must show official badge, turn/week marker, committed summary, actor, timestamp, and linked state/map changes.

### Timeline Container

MVP: simple chronological timeline. No advanced filters yet.

## Map Components

### Map Viewer

Variants:

- readOnly
- fullScreenMobile
- archive
- initialPreview

Must include keyboard-accessible zoom controls and read-only indicators.

### Map Editor

Modes:

- initialSetup
- turnDraft

MVP tools:

- select/inspect
- pan
- draw/mark
- line/route
- text/label
- note pin
- erase/remove
- fit
- zoom

Map implementation/library is deferred to architecture spike.

### Full-Screen Mobile Map

Read-only.

Controls:

- close
- fit to map
- zoom reset
- read-only indicator

## State Components

### Project Card / Row

Fields:

- name
- description
- remaining weeks
- status
- started/completed turn
- linked map object
- last changed

### Resource Card / Row

Fields:

- name
- status: abundance/scarcity/neutral/custom
- notes
- linked map object
- last changed turn

### Discontent Card / Row

Fields:

- holder
- count
- reason
- linked turn
- last changed

## Badges

Required badges:

- Your Turn
- Active Player
- Waiting
- Draft
- Official
- Community Vote
- Process Vote
- Read-only
- Archived
- Needs Attention
- Validation Passed
- Invalid

Badges must use text, not color alone.

## Empty States

Each empty state answers:

1. What is missing?
2. Why does it matter?
3. What can the user do next?

Tone: quiet, specific, non-jokey.

## Loading States

Use skeletons for page/panel loads, inline spinners for small actions, and explicit progress for deck import/validation.

Commit & Advance must block duplicate submissions.

## Error States

Error messages should be plain, specific, and recovery-oriented.

Never show raw database errors.

Permission boundaries should explain role/state rather than feel like bugs.

## Build Order Recommendation

1. Design tokens
2. Base layout primitives
3. Button/Input/Textarea
4. Base Card
5. Badge
6. Empty/Error/Loading states
7. Game Card
8. Setup Checklist Card
9. Right Rail Tabs / Mobile Tabs
10. Chat Message / Composer
11. Story Poll Card
12. Current Turn Panel
13. State Cards
14. History Entry Card
15. Map Viewer shell
16. Map Editor tools
17. Archive sections

Do not start implementation with the map editor.
