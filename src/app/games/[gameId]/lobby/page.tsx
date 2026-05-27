import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/require-profile";

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

  await requireProfile(safeGamePath);

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
              <Badge variant="outline">Lobby placeholder</Badge>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
              Game created
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              The game shell exists. Lobby setup is not built yet.
            </p>
          </div>
        </section>

        <Card variant="official" className="max-w-2xl">
          <CardHeader>
            <CardTitle>Placeholder lobby</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Game id: <span className="font-mono">{gameId}</span>
            </p>
            <p className="text-muted-foreground">
              This page does not query deck, map, player, invite, or setup
              records.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
