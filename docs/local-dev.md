# Local Development

This repo should be worked from `C:\Dev\Active\map-year-companion`.

Use `package.json` scripts as the source of truth for commands:

```powershell
corepack pnpm install
corepack pnpm dev -- -p 3060
corepack pnpm lint
corepack pnpm build
```

The recommended local dev port for `map-year-companion` is `3060`.

Sibling workspace port assignments:

| Repo | Port |
|---|---:|
| `litrpg-mechanics-workbench` | `3050` |
| `map-year-companion` | `3060` |
| `questbinder` | `3070` |
| `ttrpg-maker` | `3080` |

Generated folders such as `node_modules/` and `.next/` are not source of truth. They can be recreated from the package scripts when needed.

Secrets such as `.env.local` must stay local and must not be committed.

This repo uses Supabase. `supabase/.temp/` is local Supabase CLI state and should remain ignored.
