import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { GameCard } from "@/components/dashboard/game-card";
import { SetupChecklistCard } from "@/components/lobby/setup-checklist-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { StoryPollCard } from "@/components/polls/story-poll-card";
import type { GameCardViewModel } from "@/types/game";
import type { StoryPollViewModel } from "@/types/poll";
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

const storyPolls: StoryPollViewModel[] = [
  {
    createdAtLabel: "Created 12 minutes ago",
    createdByLabel: "active player Rowan",
    description:
      "The group is weighing which conversation thread feels most useful before the turn is committed.",
    id: "shoreline-detail",
    options: [
      { id: "old-pier", label: "Follow up on the old pier marker", voteCount: 3 },
      { id: "fog-bank", label: "Ask what the fog bank has changed", voteCount: 1 },
      { id: "supply-cache", label: "Discuss the supply cache rumor", voteCount: 0 }
    ],
    question: "Which shoreline detail should guide the next table discussion?",
    status: "open",
    statusDetail:
      "Open for advisory input. The active player still decides what becomes part of the committed turn.",
    totalVotes: 4
  },
  {
    createdAtLabel: "Created 34 minutes ago",
    createdByLabel: "active player Mira",
    currentUserVoteOptionId: "market-garden",
    description:
      "This vote records the group mood without approving or rejecting any official outcome.",
    id: "shared-work",
    options: [
      { id: "market-garden", label: "Talk through a shared market garden", voteCount: 2 },
      { id: "watch-post", label: "Talk through a small watch post", voteCount: 1 },
      { id: "rain-cistern", label: "Talk through a rain cistern", voteCount: 1 }
    ],
    question: "Which community effort feels most worth discussing first?",
    status: "voted",
    statusDetail:
      "Your advisory vote is recorded. It does not bind the active player or change the map by itself.",
    totalVotes: 4
  },
  {
    createdAtLabel: "Closed this morning",
    createdByLabel: "active player Ellis",
    currentUserVoteOptionId: "listen",
    description:
      "Closed polls remain chat context and are not official ledger entries.",
    id: "meeting-tone",
    options: [
      { id: "listen", label: "Spend more time listening", voteCount: 4 },
      { id: "trade", label: "Focus on practical trade details", voteCount: 2 },
      { id: "boundary", label: "Clarify the group boundary", voteCount: 1 }
    ],
    question: "What tone should the next conversation hold?",
    status: "closed",
    statusDetail:
      "Closed by the active player. Results are preserved as chat context only.",
    totalVotes: 7
  },
  {
    createdAtLabel: "Archived last week",
    createdByLabel: "active player Jun",
    description:
      "Read-only presentation for archived chat where no new input is accepted.",
    id: "archive-note",
    options: [
      { id: "record", label: "Record the question for later reflection", voteCount: 3 },
      { id: "move-on", label: "Move on without another note", voteCount: 1 }
    ],
    question: "How should this older discussion be preserved?",
    status: "readOnly",
    statusDetail:
      "Read-only archive state. The poll is settled conversation, not official history.",
    totalVotes: 4
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1H placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">
              StoryPollCard Primitive
            </h1>
            <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks reusable component treatments
              with mock display data. It is not a real dashboard, lobby, route,
              game creation flow, auth flow, Supabase integration, map tool,
              chat integration, vote submission, poll system, or game state
              implementation.
            </p>
          </div>
        </section>

        <DashboardSection
          title="StoryPollCard States"
          description="Placeholder Community Vote cards for open, voted, closed, and read-only advisory poll states."
          count={storyPolls.length}
        >
          <div className="grid gap-4 xl:grid-cols-2">
            {storyPolls.map((poll) => (
              <StoryPollCard key={poll.id} poll={poll} />
            ))}
          </div>
        </DashboardSection>

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
