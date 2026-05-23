import type { ComponentProps } from "react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type {
  ArchiveRosterAvatarColor,
  ArchiveRosterViewModel
} from "@/types/archive";

type ArchiveRosterProps = Omit<ComponentProps<"section">, "title"> & {
  roster: ArchiveRosterViewModel;
};

const avatarColorClasses: Record<ArchiveRosterAvatarColor, string> = {
  clay:
    "border-[var(--state-draft-border)] bg-[var(--state-draft-surface)] text-[var(--state-draft-text)]",
  moss:
    "border-[var(--state-official-border)] bg-[var(--state-official-surface)] text-[var(--state-official-text)]",
  ochre:
    "border-[var(--state-poll-border)] bg-[var(--state-poll-surface)] text-[var(--state-poll-text)]",
  slate:
    "border-[var(--state-archived-border)] bg-[var(--state-archived-surface)] text-[var(--state-archived-text)]"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ArchiveRoster({ className, roster, ...props }: ArchiveRosterProps) {
  const titleId = `${roster.id}-heading`;

  return (
    <section
      aria-labelledby={titleId}
      className={classes("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Participant roster
          </p>
          <h3 id={titleId} className="mt-1 text-2xl font-semibold leading-tight">
            {roster.title ?? "Archive Roster"}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {roster.description ??
              "Display-only participant records for the archived world. These are mock labels, not auth users."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="archived">
            {roster.summaryLabel ?? `${roster.members.length} mock participants`}
          </Badge>
          <Badge variant="outline">No auth data</Badge>
        </div>
      </div>

      {roster.members.length ? (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roster.members.map((member) => {
            const titleId = `archive-roster-${member.id}-title`;
            const descriptionId = `archive-roster-${member.id}-description`;

            return (
              <li key={member.id}>
                <Card
                  role="article"
                  aria-labelledby={titleId}
                  aria-describedby={descriptionId}
                  className="min-h-full"
                >
                  <CardHeader className="gap-y-3">
                    <div className="col-start-1 flex min-w-0 items-start gap-3">
                      {member.avatarInitials ? (
                        <span
                          aria-hidden="true"
                          className={classes(
                            "inline-flex size-11 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold uppercase shadow-paper-sm",
                            avatarColorClasses[member.avatarColor ?? "slate"]
                          )}
                        >
                          {member.avatarInitials}
                        </span>
                      ) : null}
                      <div className="min-w-0">
                        <CardTitle id={titleId} className="text-xl">
                          {member.displayName}
                        </CardTitle>
                        <CardDescription id={descriptionId}>
                          {member.participationLabel}
                        </CardDescription>
                      </div>
                    </div>
                    <CardAction>
                      <Badge variant="outline">Roster</Badge>
                    </CardAction>
                  </CardHeader>

                  <CardContent>
                    <dl className="grid gap-2">
                      {member.turnsTakenLabel ? (
                        <div className="rounded-md border border-border bg-surface px-3 py-2">
                          <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                            Turns
                          </dt>
                          <dd className="mt-1 text-sm font-semibold leading-6 text-foreground">
                            {member.turnsTakenLabel}
                          </dd>
                        </div>
                      ) : null}
                      {member.note ? (
                        <div className="rounded-md border border-border bg-surface px-3 py-2">
                          <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                            Archive note
                          </dt>
                          <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                            {member.note}
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          description="No participant records are shown in this placeholder archive roster."
          title="No mock participants shown"
          variant="archived"
        />
      )}
    </section>
  );
}

export { ArchiveRoster };
export type { ArchiveRosterProps };
