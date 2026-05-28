# Vercel Hosted Smoke Test

Hosted private alpha URL:

> https://map-year-companion.vercel.app/

Use this checklist after Vercel deploys from `main` when a task touches hosted auth, dashboard, game, lobby, invite, or turn-order behavior.

## Before Smoke Testing

- Confirm Vercel deployed the expected commit.
- Do not paste secrets or environment values into docs or chat.
- Do not commit `.env.local`.
- Confirm the Vercel auth callback URL is still allowed in Supabase.
- Keep localhost callback URLs allowed for local development.

Vercel environment variables live in the Vercel dashboard. The hosted app currently needs:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Checklist

| Check | Expected Result | Status |
|---|---|---|
| Sign in | Magic Link / OTP completes and returns to the app. | Manual after relevant deploy. |
| Dashboard loads | Signed-in user lands on the dashboard without an error state. | Manual after relevant deploy. |
| Game appears | The expected smoke-test game is visible to the signed-in user. | Manual after relevant deploy. |
| Lobby loads | Opening the game lobby shows the setup surface. | Manual after relevant deploy. |
| Invite flow works | Owner-created invite can be accepted by the intended second account. | Manual after relevant deploy. |
| Turn order edit works | Owner can update turn order and the saved order remains visible after reload. | Manual after relevant deploy. |

Do not mark an item verified unless the hosted private alpha was actually checked for that item.
