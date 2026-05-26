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
| Run migrations as each phase creates them. | Required for database setup. | Ongoing |
| Verify the current account has a `profiles` row. | Confirms profile setup can read/write the signed-in user's profile. | Complete |
| Create a dedicated no-profile test account. | Needed to manually verify the signed-in no-profile redirect path without disturbing Kevin's profile. | Future |
| Test invite flow with second account. | Validates private async flow. | Future |
| Approve map library choice after tiny map spike. | Map implementation is intentionally deferred. | Future |
| Review Codex decision-log suggestions before adding them. | Keeps canonical decisions controlled. | Ongoing |
| Run Daily Review after substantial coding sessions. | Catches drift. | Ongoing |
