# Architecture

## Locked Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase Postgres
- Supabase Realtime
- Supabase Storage only if needed
- Vercel

## Architecture Philosophy

Map Year Companion is a private, permissioned async game-state app with a map editor, not a live multiplayer canvas app.

The architecture must protect:

- private games
- authenticated users
- game membership
- one active player per turn
- draft vs official state separation
- active-player-only official actions
- server-controlled Commit & Advance
- append-only map revisions
- chat/history separation
- RLS-based authorization

## Frontend

Use Next.js App Router with TypeScript.

Expected layers:

- app routes/pages
- server actions or route handlers for mutations
- shared validation schemas
- typed Supabase client utilities
- shadcn/ui components themed with Tailwind tokens

## Backend

Use Supabase for:

- Auth
- Postgres
- Realtime
- Storage if needed

Avoid custom backend unless a future requirement clearly demands it.

## Auth

MVP auth:

- Supabase Auth
- Magic Link / OTP only
- Google OAuth later
- no guest mode
- no anonymous play

Auth must support invite return routing.

## Authorization

Enable RLS on every exposed user-facing table.

Client-side checks are helpful UX, not authority.

Most policies should be based on:

- active game membership
- membership role
- active player status
- owner/admin status

Never expose service role keys to client code. Never prefix service keys with `NEXT_PUBLIC_`.

## Realtime

Use Supabase Realtime for:

- chat updates
- poll updates
- turn/game status refreshes

Realtime is UI refresh only. It is never authoritative.

All mutations still go through server/database validation.

## Hosting

- Vercel for app
- Supabase cloud for backend
- Supabase Storage only if needed

No payments or webhooks in MVP.

## Map Engine Strategy

Map implementation/library remains deferred to a dedicated architecture spike.

Requirements:

- read-only view
- desktop/tablet editing by active player
- initial map editing by owner during setup
- freehand/mark
- route/line
- label
- note pin
- erase/remove
- pan/zoom
- full-screen mobile read-only map
- draft map changes
- committed map revisions
- archive display

Must not support MVP:

- simultaneous drawing
- live cursors
- battlemap tokens
- tactical grid assumptions
- mobile map editing
- marketplace assets

Candidate approaches to evaluate:

- tldraw
- Excalidraw package
- custom minimal SVG/object editor
- Fabric.js/Konva if needed

## Map Persistence

Locked concept:

- map drafts are provisional and tied to active-player save draft work
- passive players can view saved map drafts after Save Draft
- official map revisions are full snapshots plus optional human summary
- official map revisions are append-only for MVP

Implementation details wait until map library choice.

## Critical Server-Controlled Mutations

These operations must not be client-only:

- create game
- accept invite
- start game
- import/validate deck
- save turn draft
- save map draft
- commit and advance turn
- create/vote/close Story Poll
- start/respond/resolve process vote
- reassign stuck turn
- complete/archive game

## Commit & Advance

`commitAndAdvanceTurn` must be transaction-like.

It must validate:

1. user is the active player
2. turn is still active
3. outcome summary exists
4. draft map base revision is current
5. state changes are valid
6. official outcome can be created
7. map revision can be created if needed
8. game event can be created
9. current turn can be completed
10. next turn can be created/activated

If any critical official save fails, the turn must not advance.

## Security Concerns

- auth required
- RLS everywhere
- membership-based reads
- role/current-turn based writes
- no service keys in client
- no raw HTML UGC
- length limits on user text
- JSON import validation
- no official content in seed data
- private games by default
- archives member-only in MVP

## Private POC Content

Official card text/content may be used only for local private proof-of-concept testing.

It must not be committed, shipped, seeded, uploaded as Project files, shown publicly, or included in demos.

When profiles exist, private proof-of-concept card entries may be linked only to Kevin's personal testing profile.

## Risks

### Biggest Risk: Map Editor

Do not start implementation here. Build app shell, auth, games, lobby, deck setup, chat, and turn state first.

### Second Risk: RLS

Needs dedicated tests for membership/role/turn permissions.

### Third Risk: Commit Flow

Avoid partial official state.

### Fourth Risk: Official Card POC Content

Enforce with `.gitignore`, local-only paths, and workflow discipline.
