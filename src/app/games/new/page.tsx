import Link from "next/link";

import { ValidationAlert } from "@/components/feedback/validation-alert";
import { Badge } from "@/components/ui/badge";
import { CreateGameForm } from "@/features/games/create-game-form";
import { requireProfile } from "@/lib/auth/require-profile";

export const dynamic = "force-dynamic";

export default async function NewGamePage() {
  const { profile } = await requireProfile("/games/new");

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="flex flex-col gap-4">
          <Link
            className="w-fit rounded-md text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href="/dashboard"
          >
            Back to dashboard
          </Link>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Phase 4B</Badge>
              <Badge variant="outline">Create Game</Badge>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              Name the next shared map
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              This creates a private game shell for {profile.display_name}.
            </p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <CreateGameForm />

          <aside className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground shadow-paper-sm">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold leading-tight text-foreground">
                What this saves
              </h2>
              <ValidationAlert
                messages={[
                  "The signed-in profile becomes the owner.",
                  "The owner membership is created by the server.",
                  "Invites, deck setup, and map setup stay deferred."
                ]}
                title="Private by default"
                variant="success"
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
