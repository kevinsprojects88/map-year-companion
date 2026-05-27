import Link from "next/link";
import { notFound } from "next/navigation";

import { ErrorState } from "@/components/feedback/error-state";
import { PermissionAlert } from "@/components/feedback/permission-alert";
import { LobbySetupStatus } from "@/components/lobby/lobby-setup-status";
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
import { getLobbyStatusForCurrentUser } from "@/server/queries/lobby.queries";

export const dynamic = "force-dynamic";

type GameLobbyPageProps = {
  params: Promise<{
    gameId: string;
  }>;
};

export default async function GameLobbyPage({
  params
}: GameLobbyPageProps) {
  const { gameId } = await params;
  const safeGamePath = `/games/${encodeURIComponent(gameId)}/lobby`;

  const profileContext = await requireProfile(safeGamePath);
  const lobbyResult = await getLobbyStatusForCurrentUser(profileContext, gameId);

  if (!lobbyResult.ok) {
    if (lobbyResult.error === "not-member") {
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

  const { lobby } = lobbyResult;

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="flex flex-col gap-4">
          <Link
            className="w-fit rounded-md text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href="/dashboard"
          >
            Back to dashboard
          </Link>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Phase 5A</Badge>
              <Badge variant="outline">Member-scoped lobby</Badge>
              <Badge variant="waiting">{lobby.game.statusLabel}</Badge>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              {lobby.game.name}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              This private lobby now shows real setup status for active
              members. Setup is not complete yet, and deck, map, turn, notes,
              and start-game actions remain disabled for later slices.
            </p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="flex flex-col gap-6">
            <section className="grid gap-4 md:grid-cols-3">
              <Card variant="official">
                <CardHeader>
                  <CardTitle>Game status</CardTitle>
                  <CardDescription>
                    Read through the signed-in Supabase server client and RLS.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="waiting">{lobby.game.statusLabel}</Badge>
                    <Badge variant="outline">{lobby.game.updatedLabel}</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Game id: <span className="font-mono">{lobby.game.id}</span>
                  </p>
                  <p className="text-muted-foreground">
                    {lobby.game.createdLabel}
                  </p>
                </CardContent>
              </Card>

              <Card variant="raised">
                <CardHeader>
                  <CardTitle>Your membership</CardTitle>
                  <CardDescription>
                    Active membership is required before lobby details render.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {lobby.membership.roleLabel}
                    </Badge>
                    <Badge variant="success">
                      {lobby.membership.statusLabel}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {lobby.membership.isOwnerAdmin
                      ? "Owner/admin logistics controls are available where implemented."
                      : "Owner/admin logistics controls are not available to this role."}
                  </p>
                </CardContent>
              </Card>

              <Card variant="default">
                <CardHeader>
                  <CardTitle>Members</CardTitle>
                  <CardDescription>
                    Removed memberships and invite records are not listed here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">
                    {lobby.memberCount}
                  </p>
                  <p className="text-muted-foreground">
                    {lobby.memberCountLabel}
                  </p>
                </CardContent>
              </Card>
            </section>

            <LobbySetupStatus items={lobby.setupChecklistItems} />

            {lobby.membership.canCreateInvites ? (
              <CreateInviteForm gameId={lobby.game.id} />
            ) : (
              <PermissionAlert
                description="Only the owner or an admin can create private invite links for this game."
                disabledReason="You can still view lobby setup status as an active member."
                roleContext={lobby.membership.roleLabel}
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
                The lobby reads the game, your active membership, and active
                member count. It does not read invite lists, deck records, map
                records, notes, turn setup records, or private proof-of-concept
                content.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
