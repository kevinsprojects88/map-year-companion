import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { LobbyStatusViewModel } from "@/types/lobby";

type LobbyRosterProps = {
  roster: LobbyStatusViewModel["roster"];
};

function LobbyRoster({ roster }: LobbyRosterProps) {
  return (
    <section aria-labelledby="lobby-roster-heading">
      <Card variant="raised">
        <CardHeader className="gap-y-3">
          <div className="col-start-1 flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="readOnly">Read-only</Badge>
              <Badge variant="secondary">{roster.memberCountLabel}</Badge>
            </div>
            <CardTitle id="lobby-roster-heading">Players</CardTitle>
            <CardDescription>
              Active game members can see the current roster and turn order.
              Editing comes in a later lobby slice.
            </CardDescription>
          </div>
          <CardAction>
            <Badge variant="outline">{roster.memberCount}</Badge>
          </CardAction>
        </CardHeader>

        <CardContent>
          <ol className="grid gap-3">
            {roster.members.map((member) => (
              <li
                className="grid gap-3 rounded-md border border-border bg-card p-4 sm:grid-cols-[4rem_minmax(0,1fr)] sm:items-start"
                key={member.membershipId}
              >
                <div className="flex min-h-12 min-w-12 items-center justify-center rounded-md border border-[var(--state-official-border)] bg-[var(--state-official-surface)] font-mono text-lg font-semibold text-[var(--state-official-text)]">
                  {member.turnOrderIndex === null
                    ? "-"
                    : member.turnOrderIndex + 1}
                </div>

                <div className="flex min-w-0 flex-col gap-3">
                  <div className="flex min-w-0 flex-col gap-2">
                    <h3 className="truncate text-lg font-semibold leading-tight text-foreground">
                      {member.displayName}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{member.roleLabel}</Badge>
                      <Badge variant="success">{member.statusLabel}</Badge>
                      {member.isCurrentUser ? (
                        <Badge variant="outline">You</Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm leading-6 text-muted-foreground">
                    <span>{member.turnOrderLabel}</span>
                    <span>{member.joinedLabel}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>

        <CardFooter>{roster.readOnlyLabel}</CardFooter>
      </Card>
    </section>
  );
}

export { LobbyRoster };
export type { LobbyRosterProps };
