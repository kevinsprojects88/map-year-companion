# Map Year Companion

> Private/personal-use async-first tabletop companion for map-based community storytelling games.

Do not include official The Quiet Year card text, rulebook text, PDFs, logos, art, or proprietary assets in repo, seed data, docs, Project files, screenshots, or shipped builds.

## Purpose

Validate whether real players can use Map Year Companion asynchronously without losing the map, turn flow, discussion, decisions, or final world record.

## Core Hypothesis

A small private group can use Map Year Companion to play a map-based community storytelling game asynchronously, with clear turn ownership, useful discussion, visible map/state changes, and a preserved final archive.

## First External Test

- 2 testers plus Kevin.
- Target 3–6 turns.
- Mixed tester type.
- At least one tester should know The Quiet Year or be prepared to read/play it properly.

## Validation Rounds

| Round | Participants | Goal |
|---|---|---|
| Round 0 | Kevin solo | Smoke test core flow |
| Round 1 | Kevin two-account or Kevin + trusted tester | Permissions and role differences |
| Round 2 | 2 testers plus Kevin | 3–6 turns of real async play |
| Round 3 | Trusted group | Longer private playtest and archive review |

## What to Validate

| Question | Learning |
|---|---|
| Do players know whose turn it is? | Turn clarity |
| Do passive players know what they can do? | Passive-player value |
| Do players understand chat vs official history? | Canon clarity |
| Do players understand draft vs committed? | State clarity |
| Do players understand Story Polls are advisory? | Poll clarity |
| Can owner set up game? | Setup usability |
| Can active player complete a turn? | Core loop |
| Can mobile players follow along? | Async participation |
| Does archive feel worth keeping? | Long-term value |

## Tasks

### Owner

- Sign in.
- Create game.
- Invite players.
- Set turn order.
- Configure deck.
- Create/save initial map.
- Add community notes.
- Start game.
- Test stuck-turn reassignment.
- Complete/archive game.

### Active Player

- Open game.
- Identify it is their turn.
- Read/recall card prompt.
- Read discussion.
- Post Story Poll.
- Save draft outcome.
- Review/update map if available.
- Update state if needed.
- Commit & Advance.
- Confirm next player.

### Passive Player

- Open game.
- Identify active player.
- Read current turn.
- Chat.
- Vote in Story Poll.
- Inspect saved draft.
- Review map.
- Review state.
- Find official history.
- Explain official vs discussion.

### Mobile Tester

- Accept invite.
- Sign in.
- Open game.
- Read current turn.
- Chat.
- Vote.
- Open full-screen map.
- Pan/zoom.
- Review State.
- Review History.
- Explain mobile limitations.

### Archive

- Find final map.
- Find official timeline.
- Find past decision.
- Find final state.
- Open collapsed chat.
- Explain story from archive.

## What Not to Explain

Do not explain app mechanics unless blocked. Observe whether UI explains:

- whose turn it is
- what can be done
- what is official
- what is draft
- what polls do
- where history lives
- what mobile can/cannot do

## Moderator Script

```md
Thanks for testing this rough private MVP. I’m testing whether the app is understandable and useful, not whether you personally are “good at using it.”

Please think out loud as you use it. Say what you expect to happen before you click. If something is confusing, say so.

I may stay quiet even if I see you struggling, because I need to learn whether the interface explains itself.
```

If they ask for help:

```md
What would you expect the app to let you do here?
```

If blocked:

```md
I’ll help you past this so we can keep testing, but I’m marking this as a usability issue.
```

## Confusion Signals

- Players repeatedly ask whose turn it is.
- Passive players feel locked out entirely.
- Chat and official history are confused.
- Story Polls feel binding.
- Drafts look official.
- Owner cannot start game without explanation.
- Active player hesitates at Commit & Advance.
- Players cannot find history.
- Mobile tester cannot inspect map.
- Archive feels like a raw dump.

## Value Signals

- Players return without reminders.
- Passive players chat/vote/review state.
- Active player saves drafts naturally.
- Players reference official history.
- Players reference map changes.
- Owner trusts setup checklist.
- Mobile player participates from phone.
- Archive triggers memory/discussion.
- Players want to continue.

## Feedback to Defer

- Dice/combat/initiative
- Character sheets
- Simultaneous drawing
- Mobile map editing
- Anonymous/ranked/timed polls
- Public games
- AI story generation
- PDF/HTML export
- Multi-system support
- Official bundled cards
- Marketplace/assets

## Templates

Use:

- `docs/templates/validation-session-notes.md`
- `docs/templates/tester-task-scripts.md`
