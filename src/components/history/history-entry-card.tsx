import type { ComponentProps } from "react";

import { MapRevisionLink } from "@/components/history/map-revision-link";
import { StateChangeChip } from "@/components/state/state-change-chip";
import { Badge, StateBadge, type BadgeVariant } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type {
  HistoryEntryCardViewModel,
  HistoryEntryEventType
} from "@/types/history";

type HistoryEntryCardProps = Omit<ComponentProps<"div">, "title"> & {
  entry: HistoryEntryCardViewModel;
};

type HistoryEntryEventDisplay = {
  label: string;
  marker: string;
  variant: BadgeVariant;
};

const officialLedgerCopy =
  "Official committed history. This ledger entry is separate from chat, drafts, Community Votes, and Process Votes.";

const historyEntryEventDisplay: Record<
  HistoryEntryEventType,
  HistoryEntryEventDisplay
> = {
  discontentChange: {
    label: "Discontent Change",
    marker: "DISC",
    variant: "attention"
  },
  gameCompleted: {
    label: "Game Completed",
    marker: "END",
    variant: "archived"
  },
  gameStarted: {
    label: "Game Started",
    marker: "START",
    variant: "official"
  },
  mapRevision: {
    label: "Map Revision",
    marker: "MAP",
    variant: "official"
  },
  projectChange: {
    label: "Project Change",
    marker: "PROJ",
    variant: "official"
  },
  resourceChange: {
    label: "Resource Change",
    marker: "RES",
    variant: "official"
  },
  turnOutcome: {
    label: "Turn Outcome",
    marker: "TURN",
    variant: "official"
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function HistoryEntryCard({
  className,
  entry,
  ...props
}: HistoryEntryCardProps) {
  const eventDisplay = historyEntryEventDisplay[entry.eventType];
  const titleId = `history-entry-${entry.id}-title`;
  const summaryId = `history-entry-${entry.id}-summary`;
  const boundaryId = `history-entry-${entry.id}-boundary`;
  const detailItems = [
    entry.weekLabel ? { label: "Week", value: entry.weekLabel } : null,
    entry.turnLabel ? { label: "Turn", value: entry.turnLabel } : null,
    entry.activePlayerLabel
      ? { label: "Active player", value: entry.activePlayerLabel }
      : null,
    { label: "Committed by", value: entry.committedByLabel },
    { label: "Committed", value: entry.committedAtLabel },
    ...(entry.detailItems ?? [])
  ].filter(
    (item): item is { label: string; value: string } => item !== null
  );

  return (
    <Card
      role="article"
      aria-labelledby={titleId}
      aria-describedby={`${summaryId} ${boundaryId}`}
      variant="official"
      className={classes("min-h-full", className)}
      {...props}
    >
      <CardHeader className="gap-y-3">
        <div className="col-start-1 flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <StateBadge state="official" />
            <Badge variant={eventDisplay.variant}>
              <span
                aria-hidden="true"
                className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
              >
                {eventDisplay.marker}
              </span>
              <span>{eventDisplay.label}</span>
            </Badge>
            {entry.stateChange ? (
              <StateChangeChip change={entry.stateChange} />
            ) : null}
          </div>
          <CardTitle id={titleId}>{entry.title}</CardTitle>
          <CardDescription id={summaryId}>
            {entry.outcomeSummary}
          </CardDescription>
        </div>
        <CardAction>
          <div className="rounded-md border border-[var(--state-official-border)] bg-[var(--state-official-surface)] px-3 py-2 text-right text-[var(--state-official-text)]">
            <p className="font-mono text-xs font-semibold uppercase leading-5">
              Ledger
            </p>
            <p className="text-sm font-semibold leading-6">
              {entry.statusLabel ?? "Committed"}
            </p>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p
          id={boundaryId}
          className="rounded-md border border-[var(--state-official-border)] bg-[var(--state-official-surface)] px-3 py-2 text-sm font-medium leading-6 text-[var(--state-official-text)]"
        >
          {officialLedgerCopy}
        </p>

        <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {detailItems.map((item) => (
            <div
              key={`${item.label}-${item.value}`}
              className="rounded-md border border-border bg-surface px-3 py-2"
            >
              <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold leading-6 text-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        {entry.stateChange?.summary ? (
          <div className="rounded-md border border-border bg-surface px-3 py-2">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              State change summary
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {entry.stateChange.summary}
            </p>
          </div>
        ) : null}

        {entry.mapRevision ? (
          <MapRevisionLink
            actionLabel={entry.actionLabel}
            revision={entry.mapRevision}
          />
        ) : null}
      </CardContent>

      <CardFooter>
        <span>Committed by {entry.committedByLabel}</span>
        <span aria-hidden="true">/</span>
        <span>{entry.committedAtLabel}</span>
      </CardFooter>
    </Card>
  );
}

export { HistoryEntryCard };
export type { HistoryEntryCardProps };
