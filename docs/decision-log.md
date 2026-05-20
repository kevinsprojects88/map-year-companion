# Decision Log

## Status Key

| Status | Meaning |
|---|---|
| Approved | Locked decision |
| Deferred | Valid idea intentionally postponed |
| Rejected | Explicitly cut |
| Proposed | Suggested but not locked |
| Superseded | Replaced by newer decision |
| Needs Review | Approved earlier but should be revisited |

## Major Product Decisions

| Date | Decision | Reason | Status |
|---|---|---|---|
| 2026-05-19 | Use Map Year Companion as working name and `map-year-companion` as repo folder. | Neutral internal name without implying official digital edition. | Approved |
| 2026-05-19 | Product is a personal-use companion for The Quiet Year in private planning; public/repo docs use broader map-based community storytelling language. | Supports use case while reducing public-facing IP/trade-dress risk. | Approved |
| 2026-05-19 | App is async-first with one active player per turn. | Supports play-by-post and clean state management. | Approved |
| 2026-05-19 | Chat is open, but official changes require explicit active-player commit. | Keeps discussion and canon distinct. | Approved |
| 2026-05-19 | MVP includes advisory Story Polls and one Reassign Stuck Turn process vote. | Helps async discussion and stalled-game recovery without replacing turn ownership. | Approved |
| 2026-05-19 | MVP is desktop/tablet-authoring first; mobile is read/respond/vote/view only. | Avoids mobile map editing complexity while supporting async participation. | Approved |
| 2026-05-19 | MVP archive is in-app only; Markdown export is V2; PDF/HTML later. | Archive must work before export polish. | Approved |
| 2026-05-19 | Card setup happens before game start through structured manual entry or user-provided JSON import. | Keeps turn flow clean and content user-provided. | Approved |
| 2026-05-19 | Official card text/content may be used only for local private proof-of-concept testing. | Protects repo, shipped app, docs, and public materials. | Approved |

## Major UX Decisions

| Date | Decision | Reason | Status |
|---|---|---|---|
| 2026-05-19 | Main flow is create private game → invite players → configure deck/map/community → start game → active player resolves turn → commit map/outcome → next player acts → archive world. | Captures core async loop. | Approved |
| 2026-05-19 | Dashboard groups games by Your Turn, Active Games, Waiting to Start, Completed Worlds. | Prioritizes async urgency. | Approved |
| 2026-05-19 | Lobby is a structured setup checklist. | Reduces blank-canvas anxiety. | Approved |
| 2026-05-19 | Owner can edit initial map before first turn. | Supports baseline geography/community context. | Approved |
| 2026-05-19 | Only active player can create Story Polls in MVP. | Preserves turn ownership. | Approved |
| 2026-05-19 | Final archive prioritizes official history; chat is collapsed/optional. | Makes archive readable as a world record. | Approved |
| 2026-05-19 | Passive players can view active player’s saved map draft after Save Draft. | Supports async discussion while preserving edit authority. | Approved |

## Major Visual / Component Decisions

| Date | Decision | Reason | Status |
|---|---|---|---|
| 2026-05-19 | Approve Weathered Field Journal visual direction. | Quiet, tactile, legible, archival, buildable. | Approved |
| 2026-05-19 | Use map-first desktop board with Current Turn panel and switchable right rail. | Keeps map primary while making turn/chat/state/history accessible. | Approved |
| 2026-05-19 | Use mobile bottom tabs: Turn, Chat, Map, State, History. | Supports mobile participation without implying authoring. | Approved |
| 2026-05-19 | Keep official history visually and structurally separate from chat. | Prevents canon confusion. | Approved |
| 2026-05-19 | Use raw palette tokens plus semantic tokens. | Balances flexibility and consistency. | Approved |
| 2026-05-19 | Use shadcn/ui as base and theme heavily. | Accessible primitives without heavy default visual system. | Approved |

## Major Technical Decisions

| Date | Decision | Reason | Status |
|---|---|---|---|
| 2026-05-19 | Use Next.js App Router, TypeScript, Tailwind, shadcn/ui, Supabase, and Vercel. | Fits solo-builder async app and AI coding workflow. | Approved |
| 2026-05-19 | Use Supabase Auth with Magic Link / OTP for MVP; Google OAuth later. | Persistent identity with simple MVP auth. | Approved |
| 2026-05-19 | Use Supabase Postgres and RLS on all exposed user-facing tables. | Private relational app needs strong access control. | Approved |
| 2026-05-19 | Use Supabase Realtime for UI refresh only, never authority. | Improves responsiveness while preserving server/database authority. | Approved |
| 2026-05-19 | Store official map revisions as full snapshots plus optional summaries. | Simplifies archive/history. | Approved |
| 2026-05-19 | Defer exact map library to dedicated spike. | Canvas choice needs focused evaluation. | Deferred |
| 2026-05-19 | Commit & Advance must be transaction-like. | Prevents partial official state corruption. | Approved |

## File / Repo Structure Decisions

| Date | Decision | Reason | Status |
|---|---|---|---|
| 2026-05-19 | Repo remains private through MVP; public later only after IP/content audit. | Prevents accidental proprietary content exposure. | Approved |
| 2026-05-19 | Use `src/components`, `src/features`, and `src/server`. | Separates UI, feature composition, and server logic. | Approved |
| 2026-05-19 | Deck setup uses lobby card plus dedicated `/games/[gameId]/deck`. | Tracks progress while giving editor space. | Approved |
| 2026-05-19 | Initial map setup uses lobby card plus dedicated `/games/[gameId]/initial-map`. | Tracks progress while giving map editor space. | Approved |
| 2026-05-19 | Maintain `supabase/policies/` plus executable policies in migrations. | Keeps RLS readable and executable. | Approved |

## Implementation Decisions

| Date | Decision | Reason | Status |
|---|---|---|---|
| 2026-05-19 | Use broad phases with smaller Codex task breakdowns. | Humans need roadmap; Codex needs narrow tasks. | Approved |
| 2026-05-19 | Use two-part map spike. | Proves feasibility early without blocking core loop. | Approved |
| 2026-05-19 | First playable milestone is chat + poll + one committed turn with map shell acceptable. | Proves async loop before full map editor. | Approved |
| 2026-05-19 | Codex may suggest decisions/docs but Kevin approves before canonical updates. | Keeps decisions controlled. | Approved |

## Validation / Review Decisions

| Date | Decision | Reason | Status |
|---|---|---|---|
| 2026-05-19 | Use full Daily Review after substantial coding and Quick Review after small changes. | Keeps review effort proportional. | Approved |
| 2026-05-19 | Daily review outputs are not saved by default; only durable decisions/tasks/questions are added. | Prevents documentation noise. | Approved |
| 2026-05-19 | First external validation uses 2 testers plus Kevin for 3–6 turns. | Small enough to manage while exposing async multiplayer issues. | Approved |
| 2026-05-19 | Validation artifacts include notes and tester task scripts. | Reusable testing assets belong in repo. | Approved |

## Deferred Decisions

| Date | Decision | Reason | Status |
|---|---|---|---|
| 2026-05-19 | Google OAuth. | MVP only needs Magic Link / OTP. | Deferred |
| 2026-05-19 | CSV card import. | JSON-only MVP reduces complexity. | Deferred |
| 2026-05-19 | Markdown archive export. | After in-app archive works. | Deferred |
| 2026-05-19 | PDF/HTML archive export. | Later polish. | Deferred |
| 2026-05-19 | Full mobile map editing. | Touch-first complexity. | Deferred |
| 2026-05-19 | Starter map library. | Needs asset/content/IP strategy. | Deferred |
| 2026-05-19 | Notifications/turn reminders. | Useful later; no hard timers in MVP. | Deferred |
| 2026-05-19 | AI-assisted lore summaries. | Later, after player-authored archive works. | Deferred |
| 2026-05-19 | Binding/anonymous/ranked/timed polls. | Advisory polls first. | Deferred |
| 2026-05-19 | Custom card visuals. | Not needed for MVP deck setup. | Deferred |

## Rejected / Cut Decisions

| Date | Decision | Reason | Status |
|---|---|---|---|
| 2026-05-19 | Vote required to advance every turn. | Slows async play and weakens active-player ownership. | Rejected |
| 2026-05-19 | Separate live mode in MVP. | Real-time is natural acceleration, not a second product. | Rejected |
| 2026-05-19 | Simultaneous drawing/live cursors in MVP. | Adds sync/conflict complexity. | Rejected |
| 2026-05-19 | Hard turn timers in MVP. | Recovery paths first. | Rejected |
| 2026-05-19 | Official prompts bundled in shipped app. | IP/content risk. | Rejected |
| 2026-05-19 | Public game directory, marketplace, dice/combat, character sheets. | Generic VTT/social scope creep. | Rejected |
| 2026-05-19 | AI story generation as MVP feature. | Risks replacing player-authored story. | Rejected |
| 2026-05-19 | Anonymous guest mode. | Async identity/permissions require accounts. | Rejected |

## Open Questions

| Date | Question | Why It Matters | Recommended Timing | Status |
|---|---|---|---|---|
| 2026-05-19 | Which map library/approach should MVP use? | Highest-risk technical area. | Tiny map spike, then full editor later. | Open |
| 2026-05-19 | Should Story Poll tallies be live or revealed on close? | Affects social dynamics. | Interaction design/testing. | Open |
| 2026-05-19 | How ceremonial vs ledger-like should archive be? | Affects final archive feel. | Archive screen design. | Open |
| 2026-05-19 | How much paper texture/serif treatment is too much? | Affects readability. | Visual QA. | Open |
| 2026-05-19 | Should passive right rail default to Chat, Turn, or State? | Affects passive flow. | Usability testing. | Open |
| 2026-05-19 | Should map labels always show or appear on selection/zoom? | Affects map legibility. | Map design. | Open |
| 2026-05-19 | Should imported JSON decks store raw file or parsed DB entries only? | Affects storage/privacy. | Deck import design. | Open |
| 2026-05-19 | Should archived games allow continued chat? | Affects read-only archive model. | Archive design. | Open |

## Risks

| Date | Risk | Why It Matters | Mitigation | Status |
|---|---|---|---|---|
| 2026-05-19 | Map editor complexity. | Could consume project before core loop. | Two-part map spike; shell acceptable first. | Active |
| 2026-05-19 | RLS complexity. | Could leak data or block access. | Policy docs, membership helpers, tests. | Active |
| 2026-05-19 | Commit & Advance partial failure. | Damages trust. | Transaction-like service and failure tests. | Active |
| 2026-05-19 | Proprietary content entering repo. | IP/public-release risk. | `.gitignore`, placeholders, local-only POC. | Active |
| 2026-05-19 | Generic VTT creep. | Derails focused product. | Scope-control, Codex instructions, reviews. | Active |
| 2026-05-19 | Draft/official confusion. | Damages canon trust. | Visual/state separation. | Active |
| 2026-05-19 | Mobile users feeling useless. | Async participation depends on mobile. | Read/chat/vote/full-screen map. | Active |
| 2026-05-19 | Codex broad rewrites. | Causes architecture drift. | Handoff template, scoped tasks. | Active |

## Maintenance Rule

Use categorized sections. Codex may suggest decision-log entries, but Kevin must approve them before they are added.
