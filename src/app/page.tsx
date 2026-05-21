import { CurrentTurnPanel } from "@/components/turns/current-turn-panel";
import type { CurrentTurnPanelViewModel } from "@/types/turn";

const passiveActions = [
  "Discuss the turn in chat.",
  "Vote in advisory Story Polls when one is open.",
  "Inspect saved drafts without editing them.",
  "Review state and official history."
];

const turnPanels: CurrentTurnPanelViewModel[] = [
  {
    actionCopy:
      "The active player can keep a provisional outcome here, then commit only when the table is ready.",
    activePlayerLabel: "Rowan placeholder",
    checklist: [
      {
        description: "Read the mock prompt area before drafting.",
        id: "active-review-prompt",
        label: "Review current prompt",
        status: "complete"
      },
      {
        description: "Use chat outside this primitive for table discussion.",
        id: "active-discuss",
        label: "Discuss with the table",
        status: "current"
      },
      {
        description: "Save a provisional version before final commit.",
        id: "active-save-draft",
        label: "Save draft outcome",
        status: "notStarted"
      },
      {
        description: "Map review is represented only as placeholder copy.",
        id: "active-review-map",
        label: "Review map changes",
        status: "notStarted"
      },
      {
        description: "Commit remains a mock button with no action handler.",
        id: "active-commit",
        label: "Commit and advance",
        status: "notStarted"
      }
    ],
    commitAndAdvanceLabel: "Commit & Advance",
    draft: {
      body:
        "Draft placeholder: the community notices a new mark at the edge of the shared map and agrees to discuss what it means.",
      helperText:
        "Draft/provisional copy. It is editable-looking for the active player and does not represent official history.",
      savedAtLabel: undefined
    },
    gameName: "Placeholder World Ledger",
    id: "active-player",
    promptDetail:
      "Prompt placeholder only: describe a quiet change the community has noticed. Do not treat this as official card text.",
    promptLabel: "Mock current prompt",
    saveDraftLabel: "Save Draft",
    status: "active",
    storyPoll: {
      detail: "No advisory Story Poll is open for this mock turn.",
      status: "none"
    },
    turnLabel: "Week 03 / Active Turn",
    viewerState: "activePlayer"
  },
  {
    actionCopy:
      "Passive players can read the turn context and respond elsewhere, but the official turn controls stay disabled.",
    activePlayerLabel: "Mira placeholder",
    checklist: [
      {
        description: "The current placeholder prompt has been reviewed.",
        id: "passive-review-prompt",
        label: "Review current prompt",
        status: "complete"
      },
      {
        description: "Table discussion is still available outside this panel.",
        id: "passive-discuss",
        label: "Discuss with the table",
        status: "current"
      },
      {
        description: "Only the active player can save a new draft.",
        id: "passive-save-draft",
        label: "Save draft outcome",
        status: "notStarted"
      },
      {
        description: "Passive players can inspect saved map notes later.",
        id: "passive-review-map",
        label: "Review map changes",
        status: "notStarted"
      },
      {
        description: "Only the active player can commit official changes.",
        id: "passive-commit",
        label: "Commit and advance",
        status: "notStarted"
      }
    ],
    commitAndAdvanceLabel: "Commit & Advance",
    disabledReason:
      "You are viewing as a passive player. Discussion, voting, draft inspection, and history review remain available; Save Draft and Commit & Advance do not.",
    draft: {
      body:
        "Saved draft preview placeholder: a possible outcome is visible for the table to inspect, but passive players cannot edit it.",
      helperText:
        "Passive-player read-only treatment. The draft remains provisional and separate from official history.",
      savedAtLabel: "Saved 14 minutes ago"
    },
    gameName: "Placeholder World Ledger",
    id: "passive-player",
    passiveAvailableActions: passiveActions,
    promptDetail:
      "Prompt placeholder only: the table is considering a community observation. No official prompt or private content appears here.",
    promptLabel: "Mock current prompt",
    saveDraftLabel: "Save Draft",
    status: "active",
    storyPoll: {
      detail:
        "An advisory Community Vote is open in this mock state. It does not decide or apply the turn outcome.",
      linkLabel: "View Mock Story Poll",
      status: "open"
    },
    turnLabel: "Week 04 / Passive View",
    viewerState: "passivePlayer"
  },
  {
    actionCopy:
      "The active player has saved a provisional draft and can choose whether to revise it or commit later.",
    activePlayerLabel: "Talia placeholder",
    checklist: [
      {
        description: "The placeholder prompt has been reviewed.",
        id: "draft-review-prompt",
        label: "Review current prompt",
        status: "complete"
      },
      {
        description: "The table has had a chance to respond.",
        id: "draft-discuss",
        label: "Discuss with the table",
        status: "complete"
      },
      {
        description: "A visible provisional draft has been saved.",
        id: "draft-save-draft",
        label: "Save draft outcome",
        status: "complete"
      },
      {
        description: "Map notes still need an active-player review.",
        id: "draft-review-map",
        label: "Review map changes",
        status: "current"
      },
      {
        description: "Commit is available as a visual mock button only.",
        id: "draft-commit",
        label: "Commit and advance",
        status: "notStarted"
      }
    ],
    commitAndAdvanceLabel: "Commit & Advance",
    draft: {
      body:
        "Saved draft placeholder: the proposed turn outcome is shared for review, with map and state notes still provisional.",
      helperText:
        "Draft saved treatment uses a dashed/provisional surface plus timestamp. Official history remains unchanged.",
      savedAtLabel: "Saved 3 minutes ago"
    },
    gameName: "Placeholder World Ledger",
    id: "draft-saved",
    promptDetail:
      "Prompt placeholder only: describe a small tension around a shared resource. This is invented demo copy.",
    promptLabel: "Mock current prompt",
    saveDraftLabel: "Save Draft",
    status: "draftSaved",
    storyPoll: {
      detail:
        "A mock advisory poll has closed. Its result is visible for context only and has no automatic effect.",
      linkLabel: "Review Closed Mock Poll",
      status: "closed"
    },
    turnLabel: "Week 05 / Draft Saved",
    viewerState: "activePlayer"
  },
  {
    actionCopy:
      "This state shows a needs-attention turn where the active player must resolve a blocked checklist item before committing.",
    activePlayerLabel: "Sol placeholder",
    checklist: [
      {
        description: "The prompt has been reviewed.",
        id: "blocked-review-prompt",
        label: "Review current prompt",
        status: "complete"
      },
      {
        description: "The table is still discussing an unresolved note.",
        id: "blocked-discuss",
        label: "Discuss with the table",
        status: "current"
      },
      {
        description: "A draft exists, but it needs a correction.",
        id: "blocked-save-draft",
        label: "Save draft outcome",
        status: "blocked"
      },
      {
        description: "Map review is blocked until the draft note is settled.",
        id: "blocked-review-map",
        label: "Review map changes",
        status: "blocked"
      },
      {
        description: "Commit stays disabled in this needs-attention state.",
        id: "blocked-commit",
        label: "Commit and advance",
        status: "blocked"
      }
    ],
    commitAndAdvanceLabel: "Commit & Advance",
    disabledReason:
      "Needs attention: review the blocked checklist items before committing this mock turn.",
    draft: {
      body:
        "Attention placeholder: this draft has a missing clarification, so Commit & Advance remains disabled in the demo.",
      helperText:
        "Needs-attention treatment uses explicit text, a warning panel, and blocked checklist labels rather than color alone.",
      savedAtLabel: "Saved with attention needed"
    },
    gameName: "Placeholder World Ledger",
    id: "needs-attention",
    promptDetail:
      "Prompt placeholder only: the community notices an unresolved detail near an existing map note.",
    promptLabel: "Mock current prompt",
    saveDraftLabel: "Save Draft",
    status: "needsAttention",
    storyPoll: {
      detail:
        "No active Story Poll is attached to this attention state; the issue is procedural in this mock panel.",
      status: "none"
    },
    turnLabel: "Week 06 / Needs Attention",
    viewerState: "activePlayer"
  },
  {
    actionCopy:
      "Completed turns are official records. The draft area becomes settled copy and all controls remain disabled.",
    activePlayerLabel: "Ilan placeholder",
    checklist: [
      {
        description: "The prompt was reviewed during the completed turn.",
        id: "readonly-review-prompt",
        label: "Review current prompt",
        status: "complete"
      },
      {
        description: "The table discussion is preserved outside official history.",
        id: "readonly-discuss",
        label: "Discuss with the table",
        status: "complete"
      },
      {
        description: "The draft was saved before final commit.",
        id: "readonly-save-draft",
        label: "Save draft outcome",
        status: "complete"
      },
      {
        description: "Map changes are represented as settled review copy.",
        id: "readonly-review-map",
        label: "Review map changes",
        status: "complete"
      },
      {
        description: "The turn has already advanced in this mock record.",
        id: "readonly-commit",
        label: "Commit and advance",
        status: "complete"
      }
    ],
    commitAndAdvanceLabel: "Commit & Advance",
    draft: {
      body:
        "Official record placeholder: the outcome is settled and read-only, with draft styling removed.",
      helperText:
        "Official/read-only treatment uses a stable ledger surface and makes clear that controls are unavailable.",
      savedAtLabel: "Committed yesterday"
    },
    gameName: "Placeholder World Ledger",
    id: "read-only-completed",
    passiveAvailableActions: [
      "Review the official record.",
      "Inspect archived state and history.",
      "Read preserved discussion separately from official history."
    ],
    promptDetail:
      "Prompt placeholder only: archived context is preserved without official card text.",
    promptLabel: "Archived prompt placeholder",
    saveDraftLabel: "Save Draft",
    status: "completed",
    storyPoll: {
      detail:
        "A closed advisory poll may be reviewed as context, but it remains separate from the official record.",
      linkLabel: "Review Archived Mock Poll",
      status: "closed"
    },
    turnLabel: "Week 02 / Completed Record",
    viewerState: "readOnly"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1J placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">
              CurrentTurnPanel Primitive
            </h1>
            <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks mock current-turn panel states. It
              is not a real game board, turn engine, auth flow, Supabase
              integration, Story Poll implementation, chat integration, map
              editor, realtime surface, route, or official history system.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
              Mock Current Turn States
            </p>
            <h2 className="text-2xl font-semibold">Turn Panel Gallery</h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Placeholder examples for active-player, passive-player,
              draft-saved, needs-attention, and read-only completed states. All
              controls are visual only.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {turnPanels.map((turn) => (
              <CurrentTurnPanel key={turn.id} turn={turn} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          Placeholder content only. No official or proprietary game content,
          private proof-of-concept data, secrets, auth wiring, Supabase schema,
          turn persistence, Story Poll behavior, chat, realtime, map editing, or
          game creation features are included.
        </section>
      </div>
    </main>
  );
}
