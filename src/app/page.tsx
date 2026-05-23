import { ArchiveChatLog } from "@/components/archive/archive-chat-log";
import { ArchiveFinalMap } from "@/components/archive/archive-final-map";
import { ArchiveRememberedMoments } from "@/components/archive/archive-remembered-moments";
import { ArchiveRoster } from "@/components/archive/archive-roster";
import { ArchiveSection } from "@/components/archive/archive-section";
import { ArchiveStateSummary } from "@/components/archive/archive-state-summary";
import { ArchiveSummaryHeader } from "@/components/archive/archive-summary-header";
import { ArchiveTimeline } from "@/components/archive/archive-timeline";
import { Badge } from "@/components/ui/badge";
import type {
  ArchiveChatLogViewModel,
  ArchiveFinalMapViewModel,
  ArchiveRememberedMomentsViewModel,
  ArchiveRosterViewModel,
  ArchiveStateSummaryViewModel,
  ArchiveSummaryHeaderViewModel,
  ArchiveTimelineViewModel
} from "@/types/archive";

const archiveSummary: ArchiveSummaryHeaderViewModel = {
  completionDateLabel: "Placeholder completion date",
  id: "phase-1q-archive-summary",
  playerCountLabel: "3 mock participants",
  rememberedPhrase:
    "A placeholder remembered phrase, kept here only to test archive tone.",
  statusLabel: "Archived",
  summary:
    "A static final archive summary for a kept-world design-system demo. This copy is placeholder-only and does not represent a real game, export, route, data loader, or completion workflow.",
  turnCountLabel: "12 placeholder turns",
  worldTitle: "Placeholder Kept World"
};

const finalMap: ArchiveFinalMapViewModel = {
  description:
    "A read-only final map presentation using the existing map shell. It shows settled placeholder marks and a text landmark summary for accessibility.",
  finalRevisionLabel: "Final placeholder revision",
  id: "phase-1q-final-map",
  landmarksSummary:
    "Visible placeholder map marks: Region Placeholder North Ridge; Route Mock Causeway; Note Archive Note.",
  map: {
    description:
      "Archived final map placeholder. No drawing, editing, pan, zoom, persistence, or map behavior is included.",
    id: "phase-1q-final-map-surface",
    landmarks: [
      {
        description: "Settled region label for archive display only.",
        id: "placeholder-north-ridge",
        kind: "region",
        label: "Placeholder North Ridge",
        position: { x: 31, y: 34 },
        status: "archived"
      },
      {
        description: "Settled route label for archive display only.",
        id: "mock-causeway",
        kind: "route",
        label: "Mock Causeway",
        position: { x: 62, y: 52 },
        status: "archived"
      },
      {
        description: "Final note label for archive display only.",
        id: "archive-note",
        kind: "note",
        label: "Archive Note",
        position: { x: 44, y: 70 },
        status: "archived"
      }
    ],
    lastUpdatedLabel: "Placeholder final timestamp",
    readOnlyDetail:
      "The final archive map is preserved as a settled artifact in this mock display.",
    readOnlyReason: "Archived final map. Read-only placeholder.",
    revision: {
      detail: "Final map revision label for display only.",
      id: "phase-1q-final-revision",
      label: "Final placeholder revision",
      status: "archived",
      turnLabel: "End marker placeholder",
      updatedLabel: "Placeholder final timestamp"
    },
    status: "archived",
    summary:
      "Visible placeholder map marks: Region Placeholder North Ridge; Route Mock Causeway; Note Archive Note.",
    title: "Final Placeholder Map"
  },
  statusLabel: "Read-only archive",
  title: "Final Map"
};

const timeline: ArchiveTimelineViewModel = {
  description:
    "Display-only committed ledger entries. Chat, drafts, and informal notes stay outside this official archive timeline.",
  entries: [
    {
      activePlayerLabel: "Mock participant A",
      committedAtLabel: "Placeholder timestamp",
      committedByLabel: "Mock participant A",
      detailItems: [
        { label: "Archive status", value: "Committed placeholder" }
      ],
      eventType: "gameStarted",
      id: "archive-history-started",
      outcomeSummary:
        "Official placeholder opening record. This is ledger copy, not chat.",
      statusLabel: "Committed",
      title: "Placeholder world opened",
      turnLabel: "Turn marker placeholder",
      weekLabel: "Week marker placeholder"
    },
    {
      activePlayerLabel: "Mock participant B",
      committedAtLabel: "Placeholder timestamp",
      committedByLabel: "Mock participant B",
      eventType: "mapRevision",
      id: "archive-history-map",
      mapRevision: {
        detail: "Read-only link label for a mock final-map reference.",
        id: "archive-history-map-revision",
        label: "Placeholder map revision",
        readOnlyLabel: "Read-only"
      },
      outcomeSummary:
        "Official placeholder map change was added to the ledger.",
      stateChange: {
        label: "Official map note",
        summary:
          "A placeholder landmark became part of the committed archive record.",
        tone: "official"
      },
      statusLabel: "Committed",
      title: "Placeholder map mark settled",
      turnLabel: "Turn marker placeholder",
      weekLabel: "Week marker placeholder"
    },
    {
      activePlayerLabel: "Mock participant C",
      committedAtLabel: "Placeholder timestamp",
      committedByLabel: "Mock participant C",
      eventType: "gameCompleted",
      id: "archive-history-completed",
      outcomeSummary:
        "Official placeholder closing record. The archive is now read-only in this mock display.",
      stateChange: {
        label: "Archive complete",
        summary:
          "Final placeholder state, map, timeline, roster, and collapsed chat are presented together.",
        tone: "resolved"
      },
      statusLabel: "Archived",
      title: "Placeholder world archived",
      turnLabel: "Final turn placeholder",
      weekLabel: "Final week placeholder"
    }
  ],
  id: "phase-1q-archive-timeline",
  title: "Official Archive Timeline"
};

const stateSummary: ArchiveStateSummaryViewModel = {
  description:
    "Mock final projects, resources, and discontent records shown as read-only archive state.",
  discontent: [
    {
      count: 0,
      holderLabel: "Mock community",
      holderType: "communityLinked",
      id: "archive-discontent-resolved",
      lastChangedLabel: "Final placeholder turn",
      linkedTurnLabel: "Closing ledger placeholder",
      reason:
        "Resolved placeholder discontent record. It is not real game data.",
      recentChange: {
        label: "Resolved in archive",
        tone: "resolved"
      },
      status: "resolved"
    }
  ],
  id: "phase-1q-state-summary",
  projects: [
    {
      completedTurnLabel: "Final placeholder turn",
      description:
        "Completed placeholder project record for archive-state layout only.",
      id: "archive-project-completed",
      lastChangedLabel: "Final placeholder turn",
      locationLabel: "Final map placeholder note",
      name: "Placeholder Completed Project",
      recentChange: {
        label: "Final record",
        tone: "official"
      },
      status: "completed"
    }
  ],
  resources: [
    {
      id: "archive-resource-final",
      lastChangedTurnLabel: "Final placeholder turn",
      locationLabel: "Final map placeholder note",
      name: "Placeholder Final Resource",
      notes:
        "Archived placeholder resource state. This is display-only and not inventory behavior.",
      recentChange: {
        label: "Final state",
        tone: "official"
      },
      status: "neutral"
    }
  ],
  statusLabel: "Display-only final state",
  title: "Final State Summary"
};

const rememberedMoments: ArchiveRememberedMomentsViewModel = {
  description:
    "Mock remembered moments sit after official history and final state, giving the archive a small reflective layer without becoming chat, export, or summary behavior.",
  id: "phase-1r-remembered-moments",
  moments: [
    {
      authorLabel: "Mock participant A",
      body:
        "A placeholder decision note kept because later mock records refer back to it.",
      category: "decision",
      id: "remembered-decision",
      rememberedBecause:
        "It changed how later placeholder entries describe the community's shared direction.",
      title: "Placeholder Decision Kept",
      turnLabel: "Turn marker placeholder",
      weekLabel: "Week marker placeholder"
    },
    {
      authorLabel: "Mock participant B",
      body:
        "A settled placeholder map note became a common reference point in the final archive.",
      category: "mapChange",
      id: "remembered-map-change",
      rememberedBecause:
        "It ties the final map artifact to the official placeholder timeline.",
      title: "Placeholder Map Memory",
      turnLabel: "Turn marker placeholder"
    },
    {
      authorLabel: "Mock participant C",
      body:
        "A quiet placeholder line of archived conversation remains readable without taking over the official record.",
      category: "quote",
      id: "remembered-quote",
      rememberedBecause:
        "It preserves tone while keeping chat optional and secondary.",
      title: "Placeholder Quote",
      weekLabel: "Week marker placeholder"
    },
    {
      body:
        "A placeholder unresolved question is kept as part of the archive's human texture.",
      category: "unresolvedQuestion",
      id: "remembered-question",
      rememberedBecause:
        "Not every archive note needs to close a thread in order to remain useful.",
      title: "Placeholder Unresolved Question"
    }
  ],
  statusLabel: "Display-only",
  summaryLabel: "4 placeholder moments",
  title: "Remembered Moments"
};

const roster: ArchiveRosterViewModel = {
  description:
    "Mock participants are shown with explicit role labels and turn counts. These are not connected to auth or user profiles.",
  id: "phase-1q-archive-roster",
  members: [
    {
      avatarColor: "moss",
      avatarInitials: "PA",
      displayName: "Mock Participant A",
      id: "mock-participant-a",
      note: "Placeholder archive note for roster spacing.",
      participationLabel: "Participant placeholder",
      turnsTakenLabel: "4 placeholder turns"
    },
    {
      avatarColor: "ochre",
      avatarInitials: "PB",
      displayName: "Mock Participant B",
      id: "mock-participant-b",
      note: "Placeholder contributor label with no account data.",
      participationLabel: "Participant placeholder",
      turnsTakenLabel: "4 placeholder turns"
    },
    {
      avatarColor: "slate",
      avatarInitials: "PC",
      displayName: "Mock Participant C",
      id: "mock-participant-c",
      note: "Placeholder observer-style note for archive review.",
      participationLabel: "Participant placeholder",
      turnsTakenLabel: "4 placeholder turns"
    }
  ],
  summaryLabel: "3 mock participants",
  title: "Participant Roster"
};

const chatLog: ArchiveChatLogViewModel = {
  description:
    "Conversation is preserved as optional context while the official timeline remains primary.",
  hiddenMessageLabel:
    "Most placeholder chat is collapsed in this archive view.",
  id: "phase-1q-chat-log",
  messageCountLabel: "2 preview messages",
  previewMessages: [
    {
      authorDisplayName: "Mock Participant A",
      avatarColor: "moss",
      avatarInitials: "PA",
      body: "Placeholder archived chat preview. This remains conversation and is not official history.",
      id: "archive-chat-preview-a",
      linkedTurnLabel: "Placeholder turn",
      status: "readOnly",
      timestampLabel: "Placeholder time"
    },
    {
      authorDisplayName: "Mock Participant B",
      avatarColor: "ochre",
      avatarInitials: "PB",
      body: "Placeholder reply preserved as optional read-only context.",
      id: "archive-chat-preview-b",
      status: "readOnly",
      timestampLabel: "Placeholder time"
    }
  ],
  readOnlyReason:
    "Archived chat is read-only, collapsed by default, and secondary to official ledger entries.",
  statusLabel: "Collapsed",
  title: "Collapsed Read-only Chat"
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1R placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">
              Final Archive Section Primitives
            </h1>
            <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks static final archive components:
              summary, final map, official timeline, final state, remembered
              moments, roster, and collapsed read-only chat. It is not a real
              archive route, export, data loader, game completion flow, auth
              flow, Supabase integration, realtime layer, map behavior, chat
              persistence, or official event query.
            </p>
          </div>
        </section>

        <ArchiveSummaryHeader archive={archiveSummary} />

        <ArchiveSection
          description="The final map is treated as a settled artifact with read-only labels and a text landmark summary."
          eyebrow="Archive artifact"
          id="archive-final-map-demo"
          statusArea={(
            <>
              <Badge variant="archived">Final map</Badge>
              <Badge variant="outline">Mock data only</Badge>
            </>
          )}
          title="Final Map Section"
        >
          <ArchiveFinalMap finalMap={finalMap} />
        </ArchiveSection>

        <ArchiveSection
          description="The archive leads with committed history. Informal chat and draft content stay out of this ledger treatment."
          eyebrow="Official history first"
          id="archive-timeline-demo"
          statusArea={(
            <>
              <Badge variant="official">Official</Badge>
              <Badge variant="outline">Committed only</Badge>
            </>
          )}
          title="Official Timeline Section"
        >
          <ArchiveTimeline timeline={timeline} />
        </ArchiveSection>

        <ArchiveSection
          description="Final state summarizes the world at rest using the existing community-state card family."
          eyebrow="Settled state"
          id="archive-state-demo"
          statusArea={(
            <>
              <Badge variant="archived">Read-only</Badge>
              <Badge variant="outline">Display-only</Badge>
            </>
          )}
          title="Final State Section"
        >
          <ArchiveStateSummary state={stateSummary} />
        </ArchiveSection>

        <ArchiveSection
          description="Remembered moments are reflective archive notes with explicit labels, separate from official history and optional chat."
          eyebrow="Remembered moments"
          id="archive-remembered-moments-demo"
          statusArea={(
            <>
              <Badge variant="archived">Archive notes</Badge>
              <Badge variant="outline">Mock data only</Badge>
            </>
          )}
          title="Remembered Moments Section"
        >
          <ArchiveRememberedMoments rememberedMoments={rememberedMoments} />
        </ArchiveSection>

        <ArchiveSection
          description="Roster entries use explicit participant and turn labels so the meaning is readable without relying on color."
          eyebrow="Participants"
          id="archive-roster-demo"
          statusArea={<Badge variant="outline">No auth wiring</Badge>}
          title="Roster Section"
        >
          <ArchiveRoster roster={roster} />
        </ArchiveSection>

        <ArchiveSection
          description="Archived chat is preserved as optional context, collapsed in tone, and clearly read-only."
          eyebrow="Optional context"
          id="archive-chat-demo"
          statusArea={(
            <>
              <Badge variant="archived">Collapsed</Badge>
              <Badge variant="outline">Read-only</Badge>
            </>
          )}
          title="Collapsed Chat Section"
        >
          <ArchiveChatLog chatLog={chatLog} />
        </ArchiveSection>

        <section className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          Placeholder content only. No official or proprietary game content,
          private proof-of-concept data, secrets, auth wiring, Supabase schema,
          message persistence, realtime behavior, export behavior, archive route,
          turn logic, game-completion logic, map behavior, or real game state is
          included.
        </section>
      </div>
    </main>
  );
}
