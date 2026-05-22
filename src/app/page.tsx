import { CommunityStatePanel } from "@/components/state/community-state-panel";
import type {
  DiscontentCardViewModel,
  ProjectCardViewModel,
  ResourceCardViewModel
} from "@/types/community-state";

const projects: ProjectCardViewModel[] = [
  {
    description:
      "The community is reinforcing a narrow crossing used for daily travel.",
    id: "repair-footbridge",
    lastChangedLabel: "Updated in Week 03",
    locationLabel: "South creek marker",
    name: "Repair the footbridge",
    recentChange: {
      label: "Project advanced",
      tone: "official"
    },
    remainingWeeksLabel: "2 weeks remaining",
    startedTurnLabel: "Started Week 01",
    status: "active"
  },
  {
    completedTurnLabel: "Completed Week 02",
    description:
      "A finished record for a shared effort that has become part of the settled ledger.",
    id: "catalog-rain-catchers",
    lastChangedLabel: "Settled in Week 02",
    locationLabel: "Old courtyard",
    name: "Catalog rain catchers",
    recentChange: {
      label: "Completed",
      tone: "resolved"
    },
    startedTurnLabel: "Started Week 01",
    status: "completed"
  },
  {
    description:
      "A provisional note about whether the community should keep pursuing this work.",
    id: "survey-north-ridge",
    lastChangedLabel: "Draft saved 8 minutes ago",
    locationLabel: "North ridge note",
    name: "Survey the north ridge",
    recentChange: {
      label: "Draft change",
      tone: "draft"
    },
    remainingWeeksLabel: "No official countdown yet",
    startedTurnLabel: "Draft start: Week 04",
    status: "draftChange"
  },
  {
    description:
      "A stopped effort preserved for context without showing it as active work.",
    id: "signal-mast",
    lastChangedLabel: "Marked abandoned in Week 03",
    locationLabel: "Hill path",
    name: "Raise a signal mast",
    recentChange: {
      label: "Marked abandoned",
      tone: "neutral"
    },
    startedTurnLabel: "Started Week 02",
    status: "abandoned"
  }
];

const resources: ResourceCardViewModel[] = [
  {
    id: "clean-water",
    lastChangedTurnLabel: "Changed in Week 03",
    locationLabel: "Covered well",
    name: "Clean water",
    notes:
      "The community is tracking access carefully after a recent shortage.",
    recentChange: {
      label: "Marked Scarcity",
      tone: "attention"
    },
    status: "scarcity"
  },
  {
    id: "shared-tools",
    lastChangedTurnLabel: "Confirmed in Week 02",
    locationLabel: "Workshop shelf",
    name: "Shared tools",
    notes:
      "Enough reliable tools are available for ordinary community projects.",
    recentChange: {
      label: "Abundance noted",
      tone: "official"
    },
    status: "abundance"
  },
  {
    id: "meeting-space",
    lastChangedTurnLabel: "Reviewed in Week 01",
    name: "Quiet meeting space",
    notes:
      "Tracked as a communal condition without abundance or scarcity emphasis.",
    status: "neutral"
  },
  {
    id: "forager-notes",
    lastChangedTurnLabel: "Draft saved 4 minutes ago",
    locationLabel: "East path marker",
    name: "Forager notes",
    notes:
      "A provisional resource label that has not become official community state.",
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
    holderLabel: "Rowan placeholder",
    holderType: "playerLinked",
    id: "rowan-discontent",
    lastChangedLabel: "Changed in Week 03",
    linkedTurnLabel: "Week 03",
    reason:
      "A quiet disagreement over how much effort should go toward the crossing.",
    recentChange: {
      label: "+1 Discontent",
      tone: "attention"
    },
    status: "active"
  },
  {
    count: 2,
    holderLabel: "Community mood",
    holderType: "communityLinked",
    id: "community-draft-discontent",
    lastChangedLabel: "Draft saved 11 minutes ago",
    linkedTurnLabel: "Week 04 draft",
    reason:
      "A provisional note that the current turn may add pressure to the group.",
    recentChange: {
      label: "Draft change",
      tone: "draft"
    },
    status: "draftChange"
  },
  {
    count: 0,
    holderLabel: "Mira placeholder",
    holderType: "playerLinked",
    id: "mira-resolved-discontent",
    lastChangedLabel: "Resolved in Week 02",
    linkedTurnLabel: "Week 02",
    reason:
      "A past tension has been settled and is kept here as read-only context.",
    recentChange: {
      label: "Resolved",
      tone: "resolved"
    },
    status: "resolved"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1K placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">
              State Cards for Projects, Resources, and Discontent
            </h1>
            <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks mock community-state card
              primitives. It is not a real State tab, right rail, database
              model, turn draft system, Commit & Advance flow, auth surface,
              Supabase integration, chat surface, map feature, realtime system,
              game event system, route, or official history implementation.
            </p>
          </div>
        </section>

        <CommunityStatePanel
          projects={projects}
          resources={resources}
          discontent={discontent}
          title="Community State Card Gallery"
          description="Mock data demonstrates official, provisional, resolved, abandoned, abundance, scarcity, neutral, and active discontent states with text labels instead of color-only meaning."
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
