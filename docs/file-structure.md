# Map Year Companion

> Private/personal-use async-first tabletop companion for map-based community storytelling games.

Do not include official The Quiet Year card text, rulebook text, PDFs, logos, art, or proprietary assets in repo, seed data, docs, Project files, screenshots, or shipped builds.

## Locked Structure

```txt
map-year-companion/
├── docs/
│   ├── product-strategy.md
│   ├── user-flows.md
│   ├── screen-inventory.md
│   ├── visual-direction.md
│   ├── component-system.md
│   ├── architecture.md
│   ├── data-model.md
│   ├── file-structure.md
│   ├── implementation.md
│   ├── ai-agent-instructions.md
│   ├── daily-review-checklist.md
│   ├── validation-plan.md
│   ├── decision-log.md
│   ├── scope-control.md
│   ├── manual-tasks.md
│   ├── open-questions.md
│   └── templates/
│       ├── validation-session-notes.md
│       └── tester-task-scripts.md
├── examples/
│   └── card-deck.template.json
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── lib/
│   ├── server/
│   ├── styles/
│   ├── types/
│   └── test/
├── supabase/
│   ├── migrations/
│   ├── policies/
│   ├── seed/
│   └── functions/
├── tests/
└── local-only/   # gitignored
```

## Locked Route Plan

```txt
/
 /auth/sign-in
 /auth/callback
 /onboarding/profile
 /dashboard
 /invites/[inviteToken]
 /games/new
 /games/[gameId]/lobby
 /games/[gameId]/deck
 /games/[gameId]/initial-map
 /games/[gameId]
 /games/[gameId]/archive
 /games/[gameId]/settings
```

## Locked Decisions

| Area | Decision |
|---|---|
| Source root | `src/` |
| Routes | `src/app/` |
| Reusable UI | `src/components/` |
| shadcn base UI | `src/components/ui/` |
| Feature composition | `src/features/` |
| Shared utilities | `src/lib/` |
| Server mutations/queries/services | `src/server/` |
| Styles/tokens | `src/styles/` |
| Shared types | `src/types/` |
| Supabase migrations | `supabase/migrations/` |
| RLS policy docs | `supabase/policies/` |
| Tests | `tests/` plus `src/test/` helpers |

## Route Notes

- Lobby shows setup status/checklist.
- Deck setup uses a lobby status card plus dedicated `/games/[gameId]/deck`.
- Initial map setup uses a lobby status card plus dedicated `/games/[gameId]/initial-map`.
- Settings route is planned/deferred; fold basics into lobby/game board first.

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Files | kebab-case | `current-turn-panel.tsx` |
| Components/types | PascalCase | `CurrentTurnPanel` |
| Functions | camelCase | `commitAndAdvanceTurn` |
| DB tables/columns | snake_case | `story_poll_votes` |

## Files Codex Must Not Edit Casually

```txt
docs/decision-log.md
docs/architecture.md
docs/data-model.md
supabase/migrations/*
supabase/policies/*
src/lib/supabase/admin.ts
.env.example
tailwind.config.ts
components.json
```

Never commit:

```txt
local-only/
*.private.json
*.private.csv
*.private.md
```
