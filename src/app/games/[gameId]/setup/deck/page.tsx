import Link from "next/link";
import { notFound } from "next/navigation";

import { ErrorState } from "@/components/feedback/error-state";
import { Badge } from "@/components/ui/badge";
import { DeckSetupPanel } from "@/features/decks/deck-setup-panel";
import { requireProfile } from "@/lib/auth/require-profile";
import { getDeckSetupForCurrentUser } from "@/server/queries/deck.queries";

export const dynamic = "force-dynamic";

type GameDeckSetupPageProps = {
  params: Promise<{
    gameId: string;
  }>;
};

export default async function GameDeckSetupPage({
  params
}: GameDeckSetupPageProps) {
  const { gameId } = await params;
  const safeDeckSetupPath = `/games/${encodeURIComponent(gameId)}/setup/deck`;
  const lobbyPath = `/games/${encodeURIComponent(gameId)}/lobby`;

  const profileContext = await requireProfile(safeDeckSetupPath);
  const deckSetupResult = await getDeckSetupForCurrentUser(
    profileContext,
    gameId
  );

  if (!deckSetupResult.ok) {
    if (deckSetupResult.error === "not-member") {
      notFound();
    }

    return (
      <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:py-12">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <Link
            className="w-fit rounded-md text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href="/dashboard"
          >
            Back to dashboard
          </Link>
          <ErrorState
            description="Deck setup could not be loaded. Refresh and try again before creating or editing deck setup."
            title="Deck setup unavailable"
            variant="unknown"
          />
        </div>
      </main>
    );
  }

  const { deckSetup } = deckSetupResult;

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="flex flex-col gap-4">
          <Link
            className="w-fit rounded-md text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href={lobbyPath}
          >
            Back to lobby
          </Link>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Phase 6D</Badge>
              <Badge variant="outline">Member-scoped deck setup</Badge>
              <Badge variant="waiting">{deckSetup.game.statusLabel}</Badge>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              {deckSetup.game.name}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              Deck/card setup now shows conservative read-only validation for
              user-provided placeholder cards. Manual entry remains one card at
              a time; this route does not include official card content, import
              files, deck locking, or start-game behavior.
            </p>
          </div>
        </section>

        <DeckSetupPanel deckSetup={deckSetup} />
      </div>
    </main>
  );
}
