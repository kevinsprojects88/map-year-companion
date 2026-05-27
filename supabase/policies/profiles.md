# Profiles RLS Policies

## Table Purpose

`public.profiles` stores the account-owned profile record for each authenticated
user. The profile id matches `auth.users.id`, so each account can have one
profile row and deleting the auth user cascades to the profile.

This table is for user identity inside the app only. It does not store private
proof-of-concept content, official game content, or seed data.

## RLS Intent

Profiles are private-by-default during this foundation slice. A signed-in user
can read, create, and update only their own profile row. Anonymous users receive
no table grants and have no policies.

Client-side checks are not authoritative. The policies enforce ownership with
`auth.uid()` at the database layer.

## Policy Behavior

### Select

Authenticated users can select a profile only when `profiles.id = auth.uid()`.
There is no broad public profile directory or cross-user read policy.

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

## Why Public Reads Are Deferred

Public profile reads are not enabled yet because game membership does not exist
in the database. Exposing profiles broadly now would leak user names before the
app has a membership-based access model.

## Future Note

Although `game_memberships` now exists, co-member profile reads remain deferred.
If that policy is added later, it should stay limited to the specific game
relationship and should not become a broad public profile directory.
