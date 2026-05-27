import Link from "next/link";

import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { EmptyState } from "@/components/feedback/empty-state";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { requireProfile } from "@/lib/auth/require-profile";

export const dynamic = "force-dynamic";

const dashboardSections = [
  {
    description:
      "Placeholder for turns that will need the signed-in player's attention later.",
    emptyDescription:
      "No turn data is queried yet. The future turn summary will be added in a later phase.",
    emptyTitle: "No turn placeholder records",
    title: "Your Turn",
    variant: "actionable" as const
  },
  {
    description:
      "Placeholder for worlds that are in progress once game membership exists.",
    emptyDescription:
      "Active game listing is not built yet, and this dashboard does not fetch game rows.",
    emptyTitle: "No active games shown",
    title: "Active Games",
    variant: "neutral" as const
  },
  {
    description:
      "Placeholder for setup spaces before turn order and invitation flows exist.",
    emptyDescription:
      "Waiting rooms, invites, and game setup are intentionally deferred from this slice.",
    emptyTitle: "No setup placeholders shown",
    title: "Waiting to Start",
    variant: "blocked" as const
  },
  {
    description:
      "Placeholder for kept-world archives once completed worlds are implemented.",
    emptyDescription:
      "Completed world queries and archive links are not part of this slice.",
    emptyTitle: "No completed worlds shown",
    title: "Completed Worlds",
    variant: "archived" as const
  }
];

export default async function DashboardPage() {
  const { profile } = await requireProfile("/dashboard");

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
        description="This protected placeholder confirms account and profile access while the first create-game path comes online."
        heading={`Welcome, ${profile.display_name}`}
      >
        <div className="flex flex-col gap-7">
          <section className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground shadow-paper-sm">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Phase 4B</Badge>
                <Badge variant="outline">No game list query</Badge>
              </div>
              <p>
                Game creation now has a minimal form. Game listing, invites,
                account settings, and dashboard data remain deferred from this
                slice.
              </p>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {dashboardSections.map((section) => (
              <DashboardSection
                count={0}
                description={section.description}
                key={section.title}
                title={section.title}
              >
                <EmptyState
                  description={section.emptyDescription}
                  title={section.emptyTitle}
                  variant={section.variant}
                />
              </DashboardSection>
            ))}
          </div>
        </div>
      </DashboardShell>
    </main>
  );
}
