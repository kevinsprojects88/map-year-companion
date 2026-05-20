# Map Year Companion

> Private/personal-use async-first tabletop companion for map-based community storytelling games.

Do not include official The Quiet Year card text, rulebook text, PDFs, logos, art, or proprietary assets in repo, seed data, docs, Project files, screenshots, or shipped builds.

## Purpose

Implementation should happen in thin, Codex-safe slices.

First playable milestone:

> Chat + Story Poll + one committed turn, with map shell acceptable.

## Broad Phases

| Phase | Name | Goal |
|---:|---|---|
| 0 | Repo Setup and Documentation | Scaffold app/docs/guardrails |
| 1 | Design System Foundation | Weathered Field Journal tokens/components |
| 2 | Supabase/Auth/Profile | Magic Link/OTP, profile, protected routes |
| 3 | Core Schema/RLS | Tables, constraints, RLS |
| 4 | Dashboard/Game Creation/Invites | Create private games and invite players |
| 5 | Lobby Setup/Turn Order | Structured pre-game checklist |
| 6 | Card Deck Setup | Structured editor + JSON import |
| 7A | Tiny Map Spike | Choose approach, prove map document/render |
| 7B | Initial Map Setup Shell | Baseline map and first revision |
| 8 | Start Game/First Turn | Valid setup becomes active game |
| 9 | Game Board Shell | Map-first layout/right rail/mobile tabs |
| 10 | Chat | Member chat + basic realtime |
| 11 | Story Polls | Active-player advisory Community Vote |
| 12 | Turn Drafts | Save Draft + passive draft visibility |
| 13 | Community State | Projects/resources/discontent |
| 14 | Commit & Advance | Transaction-like turn transition |
| 15 | Official History | Ledger/timeline separate from chat |
| 16 | Reassign Stuck Turn | MVP process vote |
| 17 | Final Archive | In-app read-only archive |
| 18 | Full MVP Map Editor | Real map tools/drafts/revisions |
| 19 | Polish/Hardening | Security/errors/mobile/permissions |
| 20 | Validation Prep | Playtest docs and QA script |

## Two-Part Map Spike

Tiny spike before Initial Map Setup:

- choose likely library/approach
- define minimal `map_document`
- prove save/load
- prove read-only render
- prove passive read-only enforcement

Full editor later:

- select/inspect
- pan
- draw/mark
- line/route
- text/label
- note pin
- erase/remove
- fit/zoom
- draft save
- committed full snapshot revisions
- full-screen mobile read-only view

Do not build simultaneous drawing, live cursors, mobile map editing, battlemap tokens, grids, or asset marketplaces.

## Codex Task Template

```md
# Codex Task Handoff — [TASK TITLE]

## Project Context

You are working in `map-year-companion`.

Preserve:
- async-first
- one active player per turn
- map-first
- chat is not official history
- Story Polls are advisory only
- Process Votes are governance only
- mobile is read/respond/vote/view only
- no mobile map editing
- no simultaneous drawing/live cursors
- no official The Quiet Year text, prompts, art, logos, PDFs, or proprietary content

## Task Goal

[One narrow goal.]

## Phase

[Phase from docs/implementation.md]

## Read First

- README.md
- docs/ai-agent-instructions.md
- docs/architecture.md
- docs/data-model.md
- docs/component-system.md
- docs/scope-control.md
- docs/implementation.md
- [task-specific files]

## Files You May Edit

- [exact files/folders]

## Files You Should Not Edit

- docs/decision-log.md
- docs/architecture.md
- docs/data-model.md
- supabase/migrations/*
- supabase/policies/*
- src/lib/supabase/admin.ts
- .env.example
- tailwind.config.ts
- components.json

## Requirements

- [Requirement 1]
- [Requirement 2]

## Acceptance Criteria

- [Criterion 1]
- [Criterion 2]

## Tests / Checks

- pnpm lint
- [specific tests or manual checks]

## Report Back

1. Summary
2. Files changed
3. Checks run
4. Acceptance criteria
5. Issues/incomplete items
6. Decision-log suggestions
7. Follow-up tasks
```

## Task Sizing

Good:

> Create `StoryPollCard` with mock data and existing tokens. Do not connect Supabase yet.

Bad:

> Build Story Polls.

Forbidden chaos:

> Build the whole game board with chat, polls, map, drafts, history, and commit.
