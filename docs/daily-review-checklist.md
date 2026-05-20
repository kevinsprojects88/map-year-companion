# Map Year Companion

> Private/personal-use async-first tabletop companion for map-based community storytelling games.

Do not include official The Quiet Year card text, rulebook text, PDFs, logos, art, or proprietary assets in repo, seed data, docs, Project files, screenshots, or shipped builds.

## Rule

Use the full Daily Review after substantial coding sessions and the Quick Daily Review after small changes.

Do not save daily review transcripts in the repo by default. Add only durable consequences to:

- `docs/decision-log.md`
- `docs/manual-tasks.md`
- `docs/open-questions.md`
- `docs/scope-control.md`
- `docs/implementation.md`

## Full Daily Review Prompt

```md
# Daily Review — Map Year Companion

Review today’s work against locked docs.

Check:
- product alignment
- architecture
- security/privacy
- UI consistency
- duplication
- missing tests
- manual tasks
- decision-log suggestions
- open questions
- scope creep

## 1. Session Summary
What changed?

## 2. What Is Fragile?
What feels brittle and why?

## 3. What Did We Duplicate?
Components, styling, validation, permissions, queries, errors, constants, copy, forms.

## 4. What Could Break in Production?
Race conditions, partial saves, failed commits, auth redirects, client-only security, realtime assumptions, mobile issues.

## 5. What Code Is Hard to Understand?
Confusing names, overloaded functions, hidden side effects, clever code.

## 6. What Should Be Refactored?
Fix Before Next Feature / Fix Soon / Safe to Defer.

## 7. What Security Risks Were Introduced?
Secrets, service role exposure, missing RLS, weak policies, unsafe UGC, invite leakage, official content.

## 8. What UI Is Inconsistent?
Tokens, badges, buttons, focus, mobile, draft/official/chat/poll/process distinction.

## 9. What Components Should Be Reused?

## 10. What Tests Are Missing?

## 11. What Decisions Need the Decision Log?

## 12. What Manual Tasks Does Kevin Need?

## 13. What Open Questions Should Be Added?

## 14. Scope Creep Check
Check for full VTT, dice/combat, public games, official content, mobile editing, live cursors, hard timers, binding votes, AI story generation, export-before-archive.

## 15. Final Recommendation
End with:
- ✅ Safe to continue
- ⚠️ Continue after small cleanup
- 🛑 Stop and fix before next feature

Then list top 3 next actions.
```

## Quick Daily Review

```md
# Quick Daily Review — Map Year Companion

1. What changed?
2. What is fragile?
3. What was duplicated?
4. What could break in production?
5. What code is hard to understand?
6. What should be refactored before next task?
7. Were security risks introduced?
8. Is UI consistent with Weathered Field Journal?
9. Are draft, official, chat, poll, and process states distinct?
10. What tests are missing?
11. What manual tasks does Kevin need?
12. What decisions belong in `docs/decision-log.md`?
13. Did scope creep sneak in?
14. Final verdict: safe to continue, cleanup first, or stop and fix?
```

## Checklist

### Product

- [ ] Async-first preserved.
- [ ] One active player per turn preserved.
- [ ] Chat separate from official history.
- [ ] Story Polls advisory only.
- [ ] Process Votes governance-only.
- [ ] No mobile map editing.
- [ ] No simultaneous drawing/live cursors.
- [ ] No full VTT features.
- [ ] Archive remains core.

### Architecture

- [ ] Approved folders followed.
- [ ] Route files thin.
- [ ] Business logic not buried in components.
- [ ] Server mutations centralized.
- [ ] Validation reused.
- [ ] Realtime is UI refresh only.
- [ ] Draft and committed data distinct.

### Security

- [ ] No secrets committed.
- [ ] No service role key in client.
- [ ] Auth checked on protected routes.
- [ ] Server actions validate auth/membership/role.
- [ ] RLS enabled for new exposed tables.
- [ ] Raw DB errors hidden.
- [ ] No official/proprietary content added.

### UI

- [ ] Uses tokens.
- [ ] Correct button/badge variants.
- [ ] Draft looks provisional.
- [ ] Official looks ledger-like.
- [ ] Story Polls distinct from Process Votes.
- [ ] Chat does not look like official history.
- [ ] Empty/error/loading states exist.
- [ ] Focus visible.
- [ ] Mobile considered.
