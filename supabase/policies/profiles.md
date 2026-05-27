# Profiles RLS Policies

## Table Purpose

`public.profiles` stores the account-owned profile record for each authenticated
user. The profile id matches `auth.users.id`, so each account can have one
profile row and deleting the auth user cascades to the profile.

This table is for user identity inside the app only. It does not store private
proof-of-concept content, official game content, or seed data.

## RLS Intent

Profiles are private-by-default outside shared game membership. A signed-in user
can read, create, and update their own profile row. Active members of the same
game can read basic profile rows for other active members of that game so the
lobby can show display names in the member roster. Anonymous users receive no
table grants and have no policies.

Client-side checks are not authoritative. The policies enforce ownership with
`auth.uid()` and active same-game membership at the database layer.

## Policy Behavior

### Select

Authenticated users can select:

- their own profile row
- active same-game member profile rows through
  `private.can_read_game_member_profile(profiles.id)`

There is no broad public profile directory. Cross-user reads require both the
viewer and target profile to have active memberships in at least one shared
game.

### Insert

Authenticated users can insert a profile only when the inserted `id` matches
their own `auth.uid()`.

### Update

Authenticated users can update a profile only when the existing row belongs to
them and the updated row still belongs to them. The `updated_at` trigger refreshes
the timestamp on each update.

### Delete

Normal client access cannot delete profiles. The migration grants only
`select`, `insert`, and `update` to the `authenticated` role, limits client
writes to profile-owned fields, and creates no delete policy.

## Why Public Reads Stay Limited

Public profile reads are not enabled. The shared-game select policy exists only
for member rosters and other member-scoped attribution surfaces.

## Future Note

If more profile fields are introduced later, review whether they should remain
visible through the shared-game policy before granting them to authenticated
clients.
