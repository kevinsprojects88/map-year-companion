# Map Year Companion

> Private/personal-use async-first tabletop companion for map-based community storytelling games.

Do not include official The Quiet Year card text, rulebook text, PDFs, logos, art, or proprietary assets in repo, seed data, docs, Project files, screenshots, or shipped builds.

## Core Rules

Codex should work in small scoped tasks and avoid broad rewrites.

Codex may make small implementation decisions inside a task if they stay within docs and are reported. Product, architecture, security, or scope changes may be suggested but must not be silently locked.

Codex may suggest doc updates but should not edit docs unless asked.

If no test framework exists yet, Codex should report tests unavailable and perform manual checks.

Only small local refactors directly necessary for the task are allowed.

## Required Reading

Before most tasks:

```txt
README.md
docs/ai-agent-instructions.md
docs/product-strategy.md
docs/architecture.md
docs/data-model.md
docs/component-system.md
docs/scope-control.md
docs/decision-log.md
```

For UI tasks also read:

```txt
docs/visual-direction.md
docs/screen-inventory.md
docs/user-flows.md
```

For implementation tasks also read:

```txt
docs/implementation.md
```

## Non-Negotiable Product Rules

- Async-first play.
- One active player owns the turn.
- Chat is always open to members.
- Chat is not official history.
- Story Polls are advisory only.
- Process Votes are governance only.
- Only active player can commit official turn actions.
- Only active player can edit official turn map changes in MVP.
- Mobile map editing is out of MVP.
- No simultaneous drawing or live cursors in MVP.
- The map is the primary artifact.
- The final archive is core.

## IP / Content Rules

Never add official The Quiet Year text, prompts, PDFs, art, logos, or proprietary assets.

Use placeholder content only for examples, fixtures, docs, and tests.

## Technical Rules

Stack:

```txt
Next.js App Router
TypeScript
Tailwind CSS
shadcn/ui
Supabase Auth/Postgres/Realtime
Vercel
```

Auth:

- Magic Link / OTP for MVP.
- Google OAuth later.
- No anonymous guest mode.

Authorization:

- RLS on all exposed user-facing tables.
- Never rely only on client permission checks.
- Membership is the authorization backbone.
- Never expose service role keys client-side.
- Never use `NEXT_PUBLIC_` for service role secrets.

Realtime:

- UI refresh only.
- Never authority.

Hosted deployment:

- Hosted private alpha: `https://map-year-companion.vercel.app/`.
- Normal flow: Codex task, review, commit, push, Vercel deploys from `main`, then hosted smoke test when relevant.
- Migration-bearing flow: review migration SQL, apply Supabase SQL before pushing dependent app code when possible, verify SQL, commit/push, Vercel deploys, then hosted smoke test.
- Vercel environment variables live in the Vercel dashboard.
- Never commit `.env.local`.
- Never paste secrets or env values into docs or chat.
- Vercel currently needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Keep the Vercel auth callback URL allowed in Supabase, and keep localhost callbacks for local development.
- Use `docs/qa/vercel-hosted-smoke-test.md` for hosted smoke coverage.

Commit & Advance:

- Must be transaction-like.
- Must not leave partial official state.

## Visual Rules

Preserve Weathered Field Journal.

States must remain distinct:

| State | Treatment |
|---|---|
| Chat | conversational |
| Draft | dashed/provisional, rust/clay, timestamp |
| Official | ledger, moss/olive |
| Story Poll | `Community vote` advisory card |
| Process Vote | governance/warning panel |
| Archived | read-only settled |

Avoid generic SaaS, fantasy UI, combat/tactical language, dice-first visuals, ornate parchment, and full VTT clutter.

## Report-Back Format

```md
## Summary

## Files Changed

## Tests / Checks

## Acceptance Criteria

## Notes / Risks

## Follow-Up Tasks

## Decision Log Suggestions
```

Never just say “done.”

## Security Checklist

- [ ] No service role key in client code.
- [ ] No secrets committed.
- [ ] `.env.example` placeholders only.
- [ ] Server actions verify authenticated user.
- [ ] Server actions check membership/role/active-player status.
- [ ] Client checks are not sole protection.
- [ ] User text rendered safely.
- [ ] No raw DB errors shown.
- [ ] No official/proprietary content added.

## UI Checklist

- [ ] Uses existing tokens.
- [ ] No random hardcoded colors.
- [ ] Uses shadcn/ui primitives where appropriate.
- [ ] Focus visible.
- [ ] Loading/empty/error states where needed.
- [ ] Mobile considered.
- [ ] Draft/official/chat/poll/process states distinct.
- [ ] No generic VTT clutter.
- [ ] No mobile map editing.

## Map Rules

- no simultaneous editing
- no live cursors
- no mobile map editing
- no battlemap assumptions
- no token/initiative/combat vocabulary
- active player edits only
- passive players read/inspect saved drafts only
- committed revisions are append-only snapshots
