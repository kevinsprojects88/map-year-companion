import { ChatMessage } from "@/components/chat/chat-message";
import { ChatPanel } from "@/components/chat/chat-panel";
import { SystemMessage } from "@/components/chat/system-message";
import { Timeline } from "@/components/history/timeline";
import { RightRail } from "@/components/layout/right-rail";
import { CommunityStatePanel } from "@/components/state/community-state-panel";
import { CurrentTurnPanel } from "@/components/turns/current-turn-panel";
import type {
  ChatMessageViewModel,
  SystemMessageViewModel
} from "@/types/chat";
import type {
  DiscontentCardViewModel,
  ProjectCardViewModel,
  ResourceCardViewModel
} from "@/types/community-state";
import type { HistoryEntryCardViewModel } from "@/types/history";
import type { CurrentTurnPanelViewModel } from "@/types/turn";

const currentTurn: CurrentTurnPanelViewModel = {
  actionCopy:
    "Placeholder controls are present for visual review only. This rail demo does not save drafts, commit turns, advance play, or update a map.",
  activePlayerLabel: "Placeholder active player",
  checklist: [
    {
      description:
        "This mock step represents checking the shared map without adding map behavior.",
      id: "review-placeholder-map",
      label: "Review placeholder map notes",
      status: "complete"
    },
    {
      description:
        "This mock step keeps the turn panel distinct from chat, state, and official history.",
      id: "draft-placeholder-outcome",
      label: "Draft placeholder outcome",
      status: "current"
    },
    {
      description:
        "The official commit remains deferred to a later implementation phase.",
      id: "commit-placeholder-outcome",
      label: "Commit placeholder outcome",
      status: "notStarted"
    }
  ],
  commitAndAdvanceLabel: "Commit placeholder",
  disabledReason:
    "The Phase 1O rail shell is display-only, so turn controls remain inert in this demo.",
  draft: {
    body: "Placeholder draft outcome text. It is visibly provisional and does not change official history.",
    helperText:
      "Draft state is separate from the official ledger. This copy is placeholder-only and has no persistence.",
    savedAtLabel: "Mock saved 10:30 AM"
  },
  gameName: "Placeholder Field Journal",
  id: "phase-1o-right-rail",
  passiveAvailableActions: [
    "Read the current turn",
    "Follow mock discussion",
    "Review mock state",
    "Read official placeholder history"
  ],
  promptDetail:
    "Placeholder prompt summary only. No official card text, rulebook text, or proprietary material appears in this demo.",
  promptLabel: "Mock prompt reference",
  saveDraftLabel: "Save placeholder draft",
  status: "draftSaved",
  storyPoll: {
    detail:
      "No Community Vote is attached to this right rail shell demo. Poll behavior is intentionally out of scope.",
    status: "none"
  },
  turnLabel: "Current Turn Placeholder",
  viewerState: "passivePlayer"
};

const chatMessages: ChatMessageViewModel[] = [
  {
    authorDisplayName: "Avery",
    avatarColor: "moss",
    avatarInitials: "AV",
    body: "Placeholder table note about checking the shared map before writing anything into the record.",
    id: "rail-chat-avery",
    linkedTurnLabel: "Current turn placeholder",
    status: "normal",
    timestampLabel: "10:12 AM"
  },
  {
    authorDisplayName: "Bryn",
    avatarColor: "ochre",
    avatarInitials: "BR",
    body: "Placeholder reply that stays conversational. It is not an official ledger entry.",
    id: "rail-chat-bryn",
    status: "edited",
    timestampLabel: "10:16 AM"
  }
];

const systemMessages: SystemMessageViewModel[] = [
  {
    body: "Placeholder system note: chat remains discussion and does not change official history.",
    id: "rail-system-chat-boundary",
    timestampLabel: "10:18 AM",
    type: "info"
  }
];

const projects: ProjectCardViewModel[] = [
  {
    description:
      "Placeholder project record shown as part of current community state.",
    id: "placeholder-project-active",
    lastChangedLabel: "Mock turn marker",
    locationLabel: "Map note placeholder",
    name: "Placeholder Repair Project",
    recentChange: {
      label: "Official state",
      tone: "official"
    },
    remainingWeeksLabel: "2 mock weeks",
    startedTurnLabel: "Turn placeholder",
    status: "active"
  },
  {
    description:
      "Placeholder project change shown with draft styling so it does not look committed.",
    id: "placeholder-project-draft",
    lastChangedLabel: "Draft saved marker",
    name: "Placeholder Draft Project Change",
    recentChange: {
      label: "Provisional",
      tone: "draft"
    },
    remainingWeeksLabel: "1 mock week",
    status: "draftChange"
  }
];

const resources: ResourceCardViewModel[] = [
  {
    id: "placeholder-resource-official",
    lastChangedTurnLabel: "Committed placeholder turn",
    locationLabel: "Map note placeholder",
    name: "Placeholder Shared Resource",
    notes:
      "Official current-state placeholder. This is not inventory, automation, or real game data.",
    recentChange: {
      label: "Official",
      tone: "official"
    },
    status: "abundance"
  },
  {
    id: "placeholder-resource-draft",
    name: "Placeholder Draft Resource Note",
    notes:
      "Draft resource copy remains visually distinct from committed state.",
    recentChange: {
      label: "Draft change",
      tone: "draft"
    },
    status: "draftChange"
  }
];

const discontent: DiscontentCardViewModel[] = [
  {
    count: 1,
    holderLabel: "Placeholder participant",
    holderType: "playerLinked",
    id: "placeholder-discontent-active",
    lastChangedLabel: "Mock turn marker",
    linkedTurnLabel: "Current turn placeholder",
    reason:
      "Placeholder discontent record with explicit text labels instead of color-only meaning.",
    recentChange: {
      label: "Current state",
      tone: "attention"
    },
    status: "active"
  }
];

const historyEntries: HistoryEntryCardViewModel[] = [
  {
    activePlayerLabel: "Placeholder active player",
    committedAtLabel: "10:00 AM",
    committedByLabel: "Avery",
    eventType: "turnOutcome",
    id: "placeholder-history-turn",
    outcomeSummary:
      "Official placeholder outcome summary. It is displayed as ledger history, not chat.",
    stateChange: {
      label: "Official",
      summary:
        "Placeholder state became part of the committed record after a mock turn.",
      tone: "official"
    },
    statusLabel: "Committed",
    title: "Placeholder turn committed",
    turnLabel: "Turn placeholder",
    weekLabel: "Week placeholder"
  },
  {
    committedAtLabel: "10:05 AM",
    committedByLabel: "Bryn",
    detailItems: [
      {
        label: "Record type",
        value: "Placeholder state change"
      }
    ],
    eventType: "projectChange",
    id: "placeholder-history-state",
    outcomeSummary:
      "Official placeholder state change shown with ledger treatment.",
    statusLabel: "Committed",
    title: "Placeholder project updated",
    turnLabel: "Turn placeholder"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1O placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">
              Right Rail Shell Primitive
            </h1>
            <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks a display-only right rail shell
              with a pinned current turn area and lower Chat, State, and
              History tabs. It is not a real game board, map-first layout,
              route, auth flow, Supabase integration, realtime layer, data
              loader, chat sender, poll workflow, turn engine, map behavior, or
              archive system.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="right-rail-demo-heading"
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <h2
              id="right-rail-demo-heading"
              className="text-3xl font-semibold leading-tight"
            >
              Mock right rail composition
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              The rail is shown alone as a design-system primitive. The map
              workspace and real game board composition are intentionally not
              included in this slice.
            </p>
          </div>

          <RightRail
            ariaLabel="Phase 1O placeholder right rail shell"
            className="mx-auto max-w-[34rem]"
            chat={(
              <ChatPanel
                description="Mock player and system messages for visual review. Chat remains conversational and separate from official history."
                messages={[
                  <ChatMessage
                    key={chatMessages[0].id}
                    message={chatMessages[0]}
                  />,
                  <SystemMessage
                    key={systemMessages[0].id}
                    message={systemMessages[0]}
                  />,
                  <ChatMessage
                    key={chatMessages[1].id}
                    message={chatMessages[1]}
                  />
                ]}
                title="Placeholder Table Discussion"
              />
            )}
            chatBadge="2"
            defaultTab="chat"
            description="Pinned current turn stays above switchable lower panes. Chat, state, and official history keep separate visual treatments."
            history={(
              <Timeline
                description="Official placeholder ledger entries only. Chat and drafts are intentionally excluded."
                entries={historyEntries}
                id="right-rail-history-demo"
                title="Official Placeholder History"
                variant="compact"
              />
            )}
            historyBadge="2"
            pinnedTop={<CurrentTurnPanel turn={currentTurn} />}
            state={(
              <CommunityStatePanel
                description="Mock projects, resources, and discontent grouped as current state. Draft changes remain visibly provisional."
                discontent={discontent}
                projects={projects}
                resources={resources}
                title="Placeholder Community State"
              />
            )}
            stateBadge="5"
            title="Rail Shell Placeholder"
          />
        </section>

        <section className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          Placeholder content only. No official or proprietary game content,
          private proof-of-concept data, secrets, auth wiring, Supabase schema,
          message persistence, realtime behavior, Story Poll behavior, official
          archive logic, routes, turn logic, map behavior, or real game state
          features are included.
        </section>
      </div>
    </main>
  );
}
