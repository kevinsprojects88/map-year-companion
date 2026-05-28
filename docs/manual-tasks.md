# Manual Tasks

| Task | Why It Matters | Status |
|---|---|---|
| Copy Docs Batch 2 files into repo root after review. | Adds Steps 7–12 docs and templates. | Complete |
| Initialize Git/repo and connect remote. | Needed for tracked-file checks, rollback safety, and future Codex diff review. | Complete |
| Confirm `.gitignore` protects `local-only/` and private files. | Prevents private POC content from being committed. | Complete |
| Before adding private card content, create local-only private deck file outside git tracking. | Keeps POC content local-only. | Future |
| Create Supabase project during implementation setup. | Required for auth/database/RLS/realtime. | Complete |
| Configure Magic Link / OTP auth and redirect URLs. | Required for auth and invite return routing. | Complete |
| Add environment variables locally; never commit secrets. | Required for app/Supabase connection. | Complete |
| Keep Vercel environment variables configured in the Vercel dashboard. | Hosted deploys need `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; values must not be committed or pasted into docs/chat. | Ongoing |
| Keep Supabase redirect allowlist current for hosted and local auth callbacks. | The Vercel auth callback URL must stay allowed, and localhost callbacks should remain for local development. | Ongoing |
| Run the hosted Vercel smoke test after relevant deploys. | Confirms sign-in, dashboard, game, lobby, invite, and turn-order flows on the private alpha. | Ongoing |
| Run migrations as each phase creates them. | Phase 3 migrations `0001` through `0006` were manually applied through Supabase SQL Editor; future migrations still need apply/verification as they are created. | Ongoing |
| Install and configure Supabase CLI for repeatable local/hosted verification. | Enables migration history, RLS/grant checks, advisors, and generated types without relying only on SQL Editor. | Future |
| Verify the current account has a `profiles` row. | Confirms profile setup can read/write the signed-in user's profile. | Complete |
| Create a dedicated no-profile test account. | Needed to manually verify the signed-in no-profile redirect path without disturbing Kevin's profile. | Future |
| Test invite flow with second account. | Kevin verified `First Smoke Game` (`c54887e2-6ee1-46a2-9861-7a5894d697db`) with Kevin as owner/active turn order `0`, `kevinrallen0` as player/active turn order `1`, and the latest invite at `used_count = 1`. | Complete |
| Approve map library choice after tiny map spike. | Map implementation is intentionally deferred. | Future |
| Review Codex decision-log suggestions before adding them. | Keeps canonical decisions controlled. | Ongoing |
| Run Daily Review after substantial coding sessions. | Catches drift. | Ongoing |
