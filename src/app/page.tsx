import { ChatMessage } from "@/components/chat/chat-message";
import { ChatPanel } from "@/components/chat/chat-panel";
import { SystemMessage } from "@/components/chat/system-message";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AppHeader } from "@/components/layout/app-header";
import { GameBoardShell } from "@/components/layout/game-board-shell";
import { GameHeader } from "@/components/layout/game-header";
import { MobileGameTabs } from "@/components/layout/mobile-game-tabs";
import { RightRail } from "@/components/layout/right-rail";
import { MapViewer } from "@/components/map/map-viewer";
import { CommunityStatePanel } from "@/components/state/community-state-panel";
import { CurrentTurnPanel } from "@/components/turns/current-turn-panel";
import { Timeline } from "@/components/history/timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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
import type {
  AppHeaderViewModel,
  GameHeaderViewModel
} from "@/types/layout";
import type { MapViewerViewModel } from "@/types/map";
import type { CurrentTurnPanelViewModel } from "@/types/turn";

const appHeader: AppHeaderViewModel = {
  navigationItems: [
    {
      current: true,
      detail: "Static dashboard label for this design-system demo.",
      id: "dashboard",
      label: "Dashboard",
      marker: "APP"
    },
    {
      detail: "Static active games label. No route is attached.",
      id: "active-games",
      label: "Active Games",
      marker: "MOCK"
    },
    {
      detail: "Static archive label. No archive route is attached.",
      id: "completed-worlds",
      label: "Completed Worlds",
      marker: "MOCK"
    }
  ],
  primaryAction: {
    disabledReason:
      "This is a disabled placeholder action. Phase 1P does not create games, routes, auth, or data.",
    id: "placeholder-primary-action",
    label: "Placeholder Action",
    variant: "secondary"
  },
  productName: "Map Year Companion",
  subtitle:
    "App-level shell example only. The navigation labels are static placeholders, not working routes.",
  userDisplayLabel: "Mock user"
};

const gameHeader: GameHeaderViewModel = {
  activePlayerLabel: "Placeholder active player",
  currentTurnLabel: "Week placeholder",
  gameStatusLabel: "Draft visible; official history unchanged",
  rightActions: [
    {
      disabledReason:
        "Save is disabled because this shell has no draft persistence.",
      id: "save-placeholder",
      label: "Save Placeholder",
      variant: "draft"
    },
    {
      disabledReason:
        "Commit is disabled because turn logic belongs to a later phase.",
      id: "commit-placeholder",
      label: "Commit Placeholder",
      variant: "official"
    }
  ],
  statusBadges: [
    { id: "draft-status", state: "draft" },
    { id: "mock-state", label: "Mock status", marker: "MOCK" }
  ],
  worldTitle: "Placeholder Field Journal"
};

const map: MapViewerViewModel = {
  description:
    "Mock map workspace slot for shell layout review. It does not support editing, routing, saving, or real map state.",
  id: "phase-1p-map-shell",
  landmarks: [
    {
      description: "Official placeholder label.",
      id: "mock-ridge",
      kind: "region",
      label: "Mock Ridge",
      position: { x: 30, y: 34 },
      status: "official"
    },
    {
      description: "Draft placeholder label.",
      id: "mock-path",
      kind: "route",
      label: "Draft Path",
      position: { x: 62, y: 54 },
      status: "draft"
    },
    {
      description: "Read-only placeholder note.",
      id: "mock-note",
      kind: "note",
      label: "Quiet Note",
      position: { x: 45, y: 72 },
      status: "archived"
    }
  ],
  lastUpdatedLabel: "Mock timestamp",
  readOnlyDetail:
    "This surface only demonstrates where the future map-first workspace sits.",
  readOnlyReason: "Display-only map placeholder.",
  revision: {
    detail: "No map document or behavior is created by this demo.",
    id: "mock-revision",
    label: "Mock draft revision",
    status: "draft",
    turnLabel: "Week placeholder",
    updatedLabel: "Mock timestamp"
  },
  status: "draftVisible",
  summary:
    "Visible placeholder map marks: Region Mock Ridge; Route Draft Path; Note Quiet Note.",
  title: "Placeholder Map Workspace"
};

const currentTurn: CurrentTurnPanelViewModel = {
  actionCopy:
    "Placeholder controls are present for visual review only. This board shell does not save drafts, commit turns, advance play, or update a map.",
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
        "This mock step keeps turn status separate from chat and official history.",
      id: "draft-placeholder-outcome",
      label: "Draft placeholder outcome",
      status: "current"
    },
    {
      description:
        "Official commit behavior remains deferred to a later implementation phase.",
      id: "commit-placeholder-outcome",
      label: "Commit placeholder outcome",
      status: "notStarted"
    }
  ],
  commitAndAdvanceLabel: "Commit placeholder",
  disabledReason:
    "The Phase 1P board shell is display-only, so turn controls remain inert in this demo.",
  draft: {
    body: "Placeholder draft outcome text. It is visibly provisional and does not change official history.",
    helperText:
      "Draft state is separate from the official ledger. This copy is placeholder-only and has no persistence.",
    savedAtLabel: "Mock saved 10:30 AM"
  },
  gameName: "Placeholder Field Journal",
  id: "phase-1p-current-turn",
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
      "No Community Vote is attached to this layout shell demo. Poll behavior is intentionally out of scope.",
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
    id: "board-chat-avery",
    linkedTurnLabel: "Current turn placeholder",
    status: "normal",
    timestampLabel: "10:12 AM"
  },
  {
    authorDisplayName: "Bryn",
    avatarColor: "ochre",
    avatarInitials: "BR",
    body: "Placeholder reply that stays conversational. It is not an official ledger entry.",
    id: "board-chat-bryn",
    status: "edited",
    timestampLabel: "10:16 AM"
  }
];

const systemMessages: SystemMessageViewModel[] = [
  {
    body: "Placeholder system note: chat remains discussion and does not change official history.",
    id: "board-system-chat-boundary",
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
  }
];

function ShellDemoCard({
  description,
  label,
  title,
  variant = "default"
}: {
  description: string;
  label: string;
  title: string;
  variant?: "default" | "draft" | "official";
}) {
  return (
    <Card variant={variant}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm leading-6 text-muted-foreground">
          Placeholder child content for the shell slot. No route, query, or
          action is wired here.
        </p>
      </CardContent>
      <CardFooter>
        <span className="font-mono text-xs uppercase">{label}</span>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1P placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">
              Layout Shell Primitives
            </h1>
            <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks static layout shells for app
              navigation, dashboard framing, game headers, the future
              map-first board shape, and future mobile tab labels. It is not a
              real dashboard, game board, route, auth flow, Supabase
              integration, realtime layer, data loader, chat sender, poll
              workflow, turn engine, map behavior, archive system, or mobile
              navigation implementation.
            </p>
          </div>
        </section>

        <AppHeader {...appHeader} />

        <DashboardShell
          actionArea={(
            <>
              <Badge variant="outline">Display-only area</Badge>
              <Button disabled size="sm" variant="secondary">
                Disabled placeholder
              </Button>
            </>
          )}
          description="A comfortable wrapper for future app-level dashboard pages. This example uses mock cards only."
          heading="Dashboard Shell Example"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <ShellDemoCard
              description="Mock urgency group for shell spacing only."
              label="Mock group"
              title="Placeholder Group"
              variant="official"
            />
            <ShellDemoCard
              description="Mock waiting state with no real list or route."
              label="Mock state"
              title="Placeholder Waiting"
            />
            <ShellDemoCard
              description="Mock draft state that stays visually provisional."
              label="Mock draft"
              title="Placeholder Draft"
              variant="draft"
            />
          </div>
        </DashboardShell>

        <section
          aria-labelledby="game-header-demo-heading"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <h2
              id="game-header-demo-heading"
              className="text-3xl font-semibold leading-tight"
            >
              Game Header Example
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              A compact in-game header that keeps turn marker, active player,
              and status text visible without becoming the main surface.
            </p>
          </div>
          <GameHeader {...gameHeader} />
        </section>

        <section
          aria-labelledby="game-board-shell-demo-heading"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <h2
              id="game-board-shell-demo-heading"
              className="text-3xl font-semibold leading-tight"
            >
              Game Board Shell Placeholder
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              The shell demonstrates a future map-first center workspace with a
              persistent right rail. All content is mock display-only slot
              content.
            </p>
          </div>

          <GameBoardShell
            header={<GameHeader {...gameHeader} />}
            mapWorkspace={<MapViewer map={map} />}
            rightRail={(
              <RightRail
                ariaLabel="Phase 1P placeholder board right rail"
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
                className="min-h-[44rem] xl:max-h-[calc(100vh-7rem)]"
                defaultTab="chat"
                description="Pinned current turn stays above switchable lower panes. Chat, state, and official history keep separate visual treatments."
                history={(
                  <Timeline
                    description="Official placeholder ledger entries only. Chat and drafts are intentionally excluded."
                    entries={historyEntries}
                    id="board-shell-history-demo"
                    title="Official Placeholder History"
                    variant="compact"
                  />
                )}
                historyBadge="1"
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
                stateBadge="3"
                title="Rail Shell Placeholder"
              />
            )}
          />
        </section>

        <section
          aria-labelledby="mobile-tabs-demo-heading"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <h2
              id="mobile-tabs-demo-heading"
              className="text-3xl font-semibold leading-tight"
            >
              Static Mobile Tab Labels
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              This optional primitive previews future labels only. It has no
              routing, selected-state logic, panel switching, or mobile game
              behavior.
            </p>
          </div>
          <MobileGameTabs />
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
