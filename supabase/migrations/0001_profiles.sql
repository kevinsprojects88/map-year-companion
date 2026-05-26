create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_trimmed_length check (
    char_length(btrim(display_name)) between 1 and 80
  ),
  constraint profiles_avatar_color_format check (
    avatar_color is null
    or avatar_color ~ '^#[0-9A-Fa-f]{6}$'
    or avatar_color ~ '^[a-z][a-z0-9_-]{0,31}$'
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;

revoke all on table public.profiles from public, anon, authenticated;
grant select (id, display_name, avatar_color, created_at, updated_at)
on table public.profiles to authenticated;
grant insert (id, display_name, avatar_color)
on table public.profiles to authenticated;
grant update (display_name, avatar_color)
on table public.profiles to authenticated;

create policy "select own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "insert own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);
