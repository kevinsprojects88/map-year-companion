import { Timeline } from "@/components/history/timeline";
import type { HistoryEntryCardViewModel } from "@/types/history";

const officialHistoryEntries: HistoryEntryCardViewModel[] = [
  {
    committedAtLabel: "Committed during setup",
    committedByLabel: "Facilitator placeholder",
    eventType: "gameStarted",
    id: "game-started",
    mapRevision: {
      detail: "Baseline sketch for the shared map, shown as a mock reference.",
      href: "#mock-map-revision-note",
      id: "map-revision-000",
      label: "Map Revision 000"
    },
    outcomeSummary:
      "The official record begins with a baseline map and an empty community ledger.",
    stateChange: {
      label: "Baseline committed",
      summary:
        "The starting record is settled and ready for future turn outcomes.",
      tone: "official"
    },
    statusLabel: "Started",
    title: "World record opened",
    turnLabel: "Setup",
    weekLabel: "Week 00"
  },
  {
    activePlayerLabel: "Rowan placeholder",
    committedAtLabel: "Committed 2 days ago",
    committedByLabel: "Rowan placeholder",
    detailItems: [
      {
        label: "Official note",
        value: "Turn outcome recorded"
      }
    ],
    eventType: "turnOutcome",
    id: "turn-outcome-week-01",
    mapRevision: {
      actionLabel: "View on map",
      detail: "Settled map marks connected to this turn outcome.",
      href: "#mock-map-revision-note",
      id: "map-revision-001",
      label: "Map Revision 001"
    },
    outcomeSummary:
      "A committed turn outcome was added to the official ledger with its map reference.",
    stateChange: {
      label: "Outcome official",
      summary:
        "The draft text is no longer provisional and now belongs to official history.",
      tone: "official"
    },
    title: "First turn outcome committed",
    turnLabel: "Turn 01",
    weekLabel: "Week 01"
  },
  {
    activePlayerLabel: "Mira placeholder",
    committedAtLabel: "Committed yesterday",
    committedByLabel: "Mira placeholder",
    eventType: "mapRevision",
    id: "map-revision-week-02",
    mapRevision: {
      actionLabel: "View on map",
      detail: "Display-only link to the committed map snapshot.",
      href: "#mock-map-revision-note",
      id: "map-revision-002",
      label: "Map Revision 002"
    },
    outcomeSummary:
      "A committed map snapshot was added without making this card behave like a map editor.",
    title: "Map revision recorded",
    turnLabel: "Turn 02",
    weekLabel: "Week 02"
  },
  {
    activePlayerLabel: "Ilan placeholder",
    committedAtLabel: "Committed this morning",
    committedByLabel: "Ilan placeholder",
    detailItems: [
      {
        label: "Project record",
        value: "2 weeks remaining"
      }
    ],
    eventType: "projectChange",
    id: "project-change-week-03",
    outcomeSummary:
      "A community project was advanced as part of the committed state record.",
    stateChange: {
      label: "Project advanced",
      summary:
        "The project countdown changed in official state, not in chat or a poll.",
      tone: "official"
    },
    title: "Project progress entered",
    turnLabel: "Turn 03",
    weekLabel: "Week 03"
  },
  {
    activePlayerLabel: "Rowan placeholder",
    committedAtLabel: "Committed 3 hours ago",
    committedByLabel: "Rowan placeholder",
    detailItems: [
      {
        label: "Resource record",
        value: "Marked scarcity"
      }
    ],
    eventType: "resourceChange",
    id: "resource-change-week-04",
    outcomeSummary:
      "A resource changed status and was recorded as part of the official ledger.",
    stateChange: {
      label: "Resource changed",
      summary:
        "The resource status is committed state, separate from discussion or advisory voting.",
      tone: "attention"
    },
    title: "Resource status changed",
    turnLabel: "Turn 04",
    weekLabel: "Week 04"
  },
  {
    activePlayerLabel: "Mira placeholder",
    committedAtLabel: "Committed 42 minutes ago",
    committedByLabel: "Mira placeholder",
    detailItems: [
      {
        label: "Discontent holder",
        value: "Community mood"
      }
    ],
    eventType: "discontentChange",
    id: "discontent-change-week-05",
    outcomeSummary:
      "A discontent change was committed as official state, with visible labels for the ledger.",
    stateChange: {
      label: "+1 Discontent",
      summary:
        "The change is recorded as official pressure in the community state.",
      tone: "attention"
    },
    title: "Discontent added to the ledger",
    turnLabel: "Turn 05",
    weekLabel: "Week 05"
  },
  {
    activePlayerLabel: "Ilan placeholder",
    committedAtLabel: "Committed at archive close",
    committedByLabel: "Facilitator placeholder",
    eventType: "gameCompleted",
    id: "game-completed",
    mapRevision: {
      detail: "Final map snapshot displayed as a read-only placeholder.",
      href: "#mock-map-revision-note",
      id: "map-revision-final",
      label: "Final Map Revision"
    },
    outcomeSummary:
      "The completed world is closed into a read-only official timeline and final map reference.",
    stateChange: {
      label: "Archive ready",
      summary:
        "The final record is settled for future archive display without exposing private playtest content.",
      tone: "resolved"
    },
    statusLabel: "Archived",
    title: "Official timeline completed",
    turnLabel: "Final turn",
    weekLabel: "Final week"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1L placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">
              Official History Ledger Primitives
            </h1>
            <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks mock official-history card and
              timeline primitives. It is not a real History tab, archive,
              database model, turn draft system, Commit & Advance flow, auth
              surface, Supabase integration, chat surface, map feature, realtime
              system, game event system, route, or official history
              implementation.
            </p>
          </div>
        </section>

        <Timeline
          id="official-history-ledger-demo"
          entries={officialHistoryEntries}
          title="Official History Ledger Gallery"
          description="Mock entries demonstrate committed turn outcomes, map revisions, project and resource changes, discontent changes, game start, and archive completion. The cards use official ledger treatment so they do not read like chat, drafts, Community Votes, or Process Votes."
        />

        <section
          id="mock-map-revision-note"
          tabIndex={-1}
          className="rounded-lg border border-[var(--state-official-border)] bg-[var(--state-official-bg)] p-5 text-sm leading-6 text-[var(--state-official-text)]"
        >
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs font-semibold uppercase">
              Mock map revision reference
            </p>
            <h2 className="text-2xl font-semibold">Read-only map link target</h2>
            <p>
              This same-page target proves the ledger action can be keyboard
              reached without adding real map behavior, map data, routes,
              persistence, or editing tools.
            </p>
          </div>
        </section>

        <Timeline
          id="official-history-empty-demo"
          entries={[]}
          title="Empty Official History State"
          description="Display-only empty state for a future history panel before any committed entries exist."
          emptyState={{
            description:
              "No committed history has been added yet. Drafts, chat messages, Story Polls, and Process Votes would still remain outside this ledger.",
            title: "No official ledger entries yet"
          }}
        />

        <section className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          Placeholder content only. No official or proprietary game content,
          private proof-of-concept data, secrets, auth wiring, Supabase schema,
          turn persistence, commit logic, chat, realtime, map editing, or game
          creation features are included.
        </section>
      </div>
    </main>
  );
}
