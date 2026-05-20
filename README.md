# Map Year Companion

Map Year Companion is a private, personal-use virtual tabletop companion for map-based community storytelling games, with the initial private use case being play of *The Quiet Year*.

The app is designed for asynchronous play-by-post first, while still supporting real-time play when everyone happens to be online. It keeps the evolving map, turn flow, chat, advisory community polls, projects, resources, discontent, official history, and final archive together in one private place.

Core product promise:

> Play slowly. Build the map. Keep the world.

## Current Planning Status

Locked through Step 6:

1. Product Strategy Brief
2. User Flow Map
3. Core Screens List
4. Visual Direction and UX Research Plan
5. Component System Plan
6. Data Model and Architecture

Next planned step:

7. File and Folder Structure

## MVP Guardrails

The MVP is:

- Async-first.
- Private by default.
- Account-required.
- One active player per turn.
- Map-first.
- Desktop/tablet-authoring first.
- Mobile read/respond/vote/view only.
- Built around explicit Save Draft and Commit & Advance actions.
- Designed to preserve a readable final in-app archive.

The MVP is not:

- A full VTT.
- An official digital edition.
- A generic whiteboard.
- A social network.
- A rules engine.
- An AI story generator.
- A public game marketplace.

## Important IP / Content Rule

Do not commit, ship, seed, upload, or publicly display official *The Quiet Year* card text, rulebook text, art, logos, PDFs, proprietary assets, or trade dress.

Official card text/content may be used only locally for private proof-of-concept testing, and only under local/private guardrails. It must not be committed to this repository or included in public docs, demos, seed data, screenshots, or deployed builds.

Public/repo-facing language should describe the app broadly as a map-based community storytelling companion. Private planning may refer to *The Quiet Year* directly.

## Recommended Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui, heavily themed
- Supabase Auth
- Supabase Postgres
- Supabase Realtime
- Supabase Storage only if needed
- Vercel

## Documentation Index

- `docs/product-strategy.md`
- `docs/user-flows.md`
- `docs/screen-inventory.md`
- `docs/visual-direction.md`
- `docs/component-system.md`
- `docs/architecture.md`
- `docs/data-model.md`
- `docs/scope-control.md`
- `docs/decision-log.md`
- `docs/manual-tasks.md`
- `docs/open-questions.md`
- `docs/ai-agent-instructions.md`
