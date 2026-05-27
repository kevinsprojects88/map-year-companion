import Link from "next/link";
import { notFound } from "next/navigation";

import { ErrorState } from "@/components/feedback/error-state";
import { PermissionAlert } from "@/components/feedback/permission-alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { CreateInviteForm } from "@/features/invites/create-invite-form";
import { requireProfile } from "@/lib/auth/require-profile";
import { getLobbyGameAccessForCurrentUser } from "@/server/queries/game.queries";

export const dynamic = "force-dynamic";

type GameLobbyPlaceholderPageProps = {
  params: Promise<{
    gameId: string;
  }>;
};

export default async function GameLobbyPlaceholderPage({
  params
}: GameLobbyPlaceholderPageProps) {
  const { gameId } = await params;
  const safeGamePath = `/games/${encodeURIComponent(gameId)}/lobby`;

  const profileContext = await requireProfile(safeGamePath);
  const lobbyAccess = await getLobbyGameAccessForCurrentUser(
    profileContext,
    gameId
  );

  if (!lobbyAccess.ok) {
    if (lobbyAccess.error === "not-member") {
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
            description="The lobby could not be loaded. Refresh and try again before sharing any invite links."
            title="Lobby unavailable"
            variant="unknown"
          />
        </div>
      </main>
    );
  }

  const { game, membership } = lobbyAccess;

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
              <Badge variant="secondary">Phase 4G</Badge>
              <Badge variant="outline">Member-only lobby</Badge>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              {game.name}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              The game shell exists. Lobby setup is not built yet.
            </p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div className="flex flex-col gap-6">
            <Card variant="official" className="max-w-2xl">
              <CardHeader>
                <CardTitle>Placeholder lobby</CardTitle>
                <CardDescription>
                  Active membership was confirmed before this member content
                  loaded.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Game id: <span className="font-mono">{game.id}</span>
                </p>
                <p>
                  Your role:{" "}
                  <span className="font-semibold capitalize">
                    {membership.role}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  This page still does not query deck, map, player list, invite
                  list, or setup records.
                </p>
              </CardContent>
            </Card>

            {membership.canCreateInvites ? (
              <CreateInviteForm gameId={game.id} />
            ) : (
              <PermissionAlert
                description="Only the owner or an admin can create private invite links for this game."
                disabledReason="You can still view this placeholder lobby as an active member."
                roleContext={membership.role}
                title="Invite creation is limited"
              />
            )}
          </div>

          <aside className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground shadow-paper-sm">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold leading-tight text-foreground">
                Lobby scope
              </h2>
              <p>
                Invites are the only new control in this placeholder. Deck
                setup, map setup, turn order, start-game behavior, and player
                lists remain deferred.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
