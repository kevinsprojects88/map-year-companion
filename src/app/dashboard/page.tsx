import Link from "next/link";

import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { GameCard } from "@/components/dashboard/game-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { requireProfile } from "@/lib/auth/require-profile";
import { getDashboardGamesForCurrentUser } from "@/server/queries/game.queries";
import type {
  DashboardGameGroupKey,
  DashboardGameViewModel
} from "@/types/game";

export const dynamic = "force-dynamic";

const dashboardSections = [
  {
    description:
      "Turns that need the signed-in player's attention will appear here once turn flow exists.",
    emptyDescription:
      "No turn is waiting on you right now. Setup games stay in Waiting to Start.",
    emptyTitle: "No turn needs your attention yet.",
    group: "yourTurn" as const,
    title: "Your Turn",
    variant: "actionable" as const
  },
  {
    description:
      "Member games that have started but are not waiting on your turn.",
    emptyDescription: "No active games yet.",
    emptyTitle: "No active worlds are in motion.",
    group: "active" as const,
    title: "Active Games",
    variant: "neutral" as const
  },
  {
    description:
      "Private member games that exist but have not started turn play.",
    emptyDescription: "No worlds are waiting to start.",
    emptyTitle: "No setup games yet.",
    group: "waitingToStart" as const,
    title: "Waiting to Start",
    variant: "blocked" as const
  },
  {
    description:
      "Completed or archived member games will collect here later.",
    emptyDescription:
      "Completed worlds will appear here after a game is archived.",
    emptyTitle: "No completed worlds yet.",
    group: "completed" as const,
    title: "Completed Worlds",
    variant: "archived" as const
  }
];

function getGamesForGroup(
  games: DashboardGameViewModel[],
  group: DashboardGameGroupKey
) {
  return games.filter((game) => game.group === group);
}

export default async function DashboardPage() {
  const profileContext = await requireProfile("/dashboard");
  const { profile } = profileContext;
  const { games, gamesError } =
    await getDashboardGamesForCurrentUser(profileContext);

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:py-12">
      <DashboardShell
        actionArea={(
          <>
            <Link
              className="rounded-md border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[var(--moss-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href="/games/new"
            >
              Create Game
            </Link>
            <Link
              className="rounded-md border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:border-border-strong hover:bg-[var(--paper-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href="/onboarding/profile?next=%2Fdashboard"
            >
              Edit profile
            </Link>
          </>
        )}
        description="Your private member games appear here through the normal signed-in Supabase client and RLS."
        heading={`Welcome, ${profile.display_name}`}
      >
        <div className="flex flex-col gap-7">
          <section className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground shadow-paper-sm">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Phase 4C</Badge>
                <Badge variant="outline">Member games only</Badge>
              </div>
              <p>
                This dashboard reads only games where your signed-in profile has
                an active membership. Invites, deck setup, map setup, and turn
                flow remain deferred.
              </p>
            </div>
          </section>

          {gamesError ? (
            <EmptyState
              description="Your member games could not be loaded. Try refreshing before creating a duplicate game."
              title="Game list unavailable"
              variant="blocked"
            />
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2">
            {dashboardSections.map((section) => {
              const sectionGames = getGamesForGroup(games, section.group);

              return (
                <DashboardSection
                  count={sectionGames.length}
                  description={section.description}
                  key={section.title}
                  title={section.title}
                >
                  {sectionGames.length ? (
                    <div className="grid gap-4">
                      {sectionGames.map((game) => (
                        <GameCard game={game} key={game.id} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      description={section.emptyDescription}
                      title={section.emptyTitle}
                      variant={section.variant}
                    />
                  )}
                </DashboardSection>
              );
            })}
          </div>
        </div>
      </DashboardShell>
    </main>
  );
}
