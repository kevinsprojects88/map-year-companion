# Auth/Profile/Dashboard/Invite QA Checklist

Phase 2E scope: auth, profile setup, and protected dashboard QA only. Do not add game creation, game lists, invites, logout, middleware, schema, RLS, storage, or official/proprietary content from this checklist.

Phase 4H scope: invite-flow QA closeout only. Record Kevin's verified invite
flow evidence without adding invite management, email, revoke, player list,
dashboard indicators, setup features, schema/RLS changes, or product behavior
changes.

## Manual Checks

| Check | Expected Result | Status |
|---|---|---|
| Signed-out `/dashboard` | Redirects to `/auth/sign-in?next=%2Fdashboard`. | Verified in Phase 2E HTTP probe. |
| Magic Link / OTP sign-in | Email link completes sign-in and returns to the requested internal path. | Verified by Kevin before Phase 2E; repeat after auth settings change. |
| Auth callback missing or provider error | Redirects back to sign-in with a generic error marker. | Missing-code path verified in Phase 2E HTTP probe. |
| Auth callback external `next` | Rejects external redirects and falls back to an internal path. | Verified in Phase 2E HTTP probe. |
| Profile creation/update | Saving display name writes only the signed-in user's `profiles` row and redirects to `/dashboard`. | Verified by Kevin for current profile; repeat when testing a fresh account. |
| Dashboard access with profile | Signed-in user with a profile can open `/dashboard`. | Verified by Kevin for current profile. |
| Dashboard display name | Dashboard heading shows the current profile display name. | Verified by Kevin: `Kevin`. |
| No-profile redirect path | Signed-in user without a profile is sent to `/onboarding/profile?next=%2Fdashboard`. | Needs a dedicated no-profile test account. |
| `/onboarding/profile` signed out | Redirects to sign-in before rendering profile data. | Verified in Phase 2E HTTP probe. |
| `.env.local` tracking | `.env.local` exists only locally and is not listed by `git status --short --untracked-files=all`. | Verified in Phase 2E status check. |
| Supabase profile row | `profiles.id` matches the authenticated user id and `display_name` is present. | Verified by Kevin before Phase 2E. |
| Invite flow with second account | Owner-created invite can be accepted by a second profiled account, creating an active player membership and incrementing invite usage once. | Verified by Kevin in Phase 4G using `First Smoke Game` (`c54887e2-6ee1-46a2-9861-7a5894d697db`). |

## Phase 4H Invite Flow Evidence

Verified manually by Kevin after Phase 4G:

| Evidence | Verified Result |
|---|---|
| Game | `First Smoke Game` |
| Game id | `c54887e2-6ee1-46a2-9861-7a5894d697db` |
| Owner membership | Kevin is `owner` / `active` / `turn_order_index = 0` |
| Second account membership | `kevinrallen0` is `player` / `active` / `turn_order_index = 1` |
| Latest invite usage | `used_count = 1` |
| Latest invite limits | `max_uses = null`, `revoked_at = null`, `expires_at = null` |

Membership and invite usage SQL is recorded in
`docs/qa/schema-rls-verification.md`.

## Security Notes

- Use only the public Supabase URL and anon key in browser code.
- Do not print or commit secrets while checking auth.
- Treat client-side checks as UX only; RLS and server-side user scoping remain authoritative.
