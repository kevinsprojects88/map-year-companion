import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { GameCard } from "@/components/dashboard/game-card";
import { SetupChecklistCard } from "@/components/lobby/setup-checklist-card";
import { EmptyState } from "@/components/feedback/empty-state";
import type { GameCardViewModel } from "@/types/game";
import type { SetupChecklistItem } from "@/types/setup";

const gameCards: GameCardViewModel[] = [
  {
    activePlayerLabel: "Active player: Rowan",
    indicators: {
      hasDraft: true,
      hasActiveStoryPoll: true
    },
    lastUpdatedLabel: "Updated 18 minutes ago",
    name: "North Ridge Field Notes",
    playerCountLabel: "4 players",
    primaryActionLabel: "Resume Turn",
    status: "yourTurn",
    turnLabel: "Week 3, Turn 2"
  },
  {
    activePlayerLabel: "Active player: Mira",
    indicators: {
      hasDraft: true
    },
    lastUpdatedLabel: "Updated this morning",
    name: "Harbor Map Study",
    playerCountLabel: "5 players",
    primaryActionLabel: "Open Game",
    status: "active",
    turnLabel: "Week 5, Turn 1"
  },
  {
    activePlayerLabel: "Waiting for a final player confirmation",
    lastUpdatedLabel: "Updated yesterday",
    name: "Riverbend Setup",
    playerCountLabel: "3 players",
    primaryActionLabel: "Review Setup",
    status: "waitingToStart",
    turnLabel: "Lobby checklist"
  },
  {
    activePlayerLabel: "Process vote needs review",
    indicators: {
      hasProcessVote: true,
      needsAttention: true
    },
    lastUpdatedLabel: "Updated 2 hours ago",
    name: "Low Meadow Notebook",
    playerCountLabel: "4 players",
    primaryActionLabel: "Review Vote",
    status: "needsAttention",
    turnLabel: "Week 7, Turn 3"
  },
  {
    activePlayerLabel: "Completed world",
    lastUpdatedLabel: "Completed last week",
    name: "Old Mill Archive",
    playerCountLabel: "4 players",
    primaryActionLabel: "Read Archive",
    status: "completed",
    turnLabel: "Final archive"
  },
  {
    activePlayerLabel: "Read-only record",
    lastUpdatedLabel: "Archived 3 months ago",
    name: "Cedar Hollow Record",
    playerCountLabel: "2 players",
    primaryActionLabel: "Open Record",
    status: "archived",
    turnLabel: "Settled archive"
  }
];

const setupItems: SetupChecklistItem[] = [
  {
    actionLabel: "Review",
    description:
      "The name, short description, and shared intent are ready for the group.",
    requirement: "required",
    status: "complete",
    title: "Game Information",
    validationMessages: ["Required fields are filled in."]
  },
  {
    actionLabel: "Invite",
    description:
      "A private invite link can be shared once the player list is ready.",
    requirement: "required",
    status: "incomplete",
    title: "Invite Players",
    validationMessages: ["At least one invited player is still pending."]
  },
  {
    actionLabel: "Adjust",
    description:
      "The order is saved, but the group can still revise it before starting.",
    requirement: "required",
    status: "warning",
    title: "Turn Order",
    validationMessages: [
      "One player appears twice in the placeholder order.",
      "Confirm the first active player before starting."
    ]
  },
  {
    actionLabel: "Resolve",
    description:
      "The placeholder deck import has structural issues that block start.",
    requirement: "required",
    status: "blocked",
    title: "Deck Setup",
    validationMessages: [
      "The placeholder JSON shape is incomplete.",
      "No official or proprietary content is included in this demo."
    ]
  },
  {
    actionLabel: "Add Note",
    description:
      "Optional table notes can be recorded for later reference by the group.",
    requirement: "optional",
    status: "optional",
    title: "Community Notes",
    validationMessages: ["This can remain blank for now."]
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1G placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">
              GameCard and SetupChecklistCard Primitives
            </h1>
            <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks reusable card treatments with
              mock display data. It is not a real dashboard, lobby, route, game
              creation flow, auth flow, Supabase integration, map tool, chat,
              poll system, or game state implementation.
            </p>
          </div>
        </section>

        <DashboardSection
          title="GameCard States"
          description="Placeholder examples for future dashboard groupings and action surfaces."
          count={gameCards.length}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {gameCards.map((game) => (
              <GameCard key={game.name} game={game} />
            ))}
          </div>
        </DashboardSection>

        <DashboardSection
          title="SetupChecklistCard States"
          description="Placeholder examples for future lobby setup validation and status review."
          count={setupItems.length}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {setupItems.map((item) => (
              <SetupChecklistCard key={item.title} item={item} />
            ))}
          </div>
        </DashboardSection>

        <DashboardSection
          title="DashboardSection Empty State"
          description="Tiny wrapper support for sections that have no mock cards yet."
          count={0}
          emptyState={
            <EmptyState
              title="No placeholder cards in this section"
              description="This empty state only demonstrates section composition. It does not create or join a game."
              variant="neutral"
            />
          }
        />

        <section className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          Placeholder content only. No official or proprietary game content,
          private proof-of-concept data, secrets, auth wiring, Supabase schema,
          chat, polls, map editing, or game creation features are included.
        </section>
      </div>
    </main>
  );
}
