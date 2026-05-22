import type { ComponentProps } from "react";

import { StateChangeChip } from "@/components/state/state-change-chip";
import { Badge, StateBadge, type BadgeVariant } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardVariant
} from "@/components/ui/card";
import type {
  DiscontentCardViewModel,
  DiscontentHolderType,
  DiscontentStatus
} from "@/types/community-state";

type DiscontentCardProps = Omit<ComponentProps<"div">, "title"> & {
  discontent: DiscontentCardViewModel;
};

type DiscontentStatusDisplay = {
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  cardVariant: CardVariant;
  marker: string;
  summary: string;
};

const discontentStatusDisplay: Record<
  DiscontentStatus,
  DiscontentStatusDisplay
> = {
  active: {
    badgeLabel: "Active",
    badgeVariant: "attention",
    cardVariant: "process",
    marker: "ACT",
    summary: "This discontent is part of the current community state."
  },
  draftChange: {
    badgeLabel: "Draft Change",
    badgeVariant: "draft",
    cardVariant: "draft",
    marker: "DRAFT",
    summary: "This discontent change is provisional and not official yet."
  },
  resolved: {
    badgeLabel: "Resolved",
    badgeVariant: "success",
    cardVariant: "archived",
    marker: "DONE",
    summary: "This discontent has been settled in the mock record."
  }
};

const holderDisplay: Record<
  DiscontentHolderType,
  { label: string; variant: BadgeVariant }
> = {
  communityLinked: {
    label: "Community-linked",
    variant: "secondary"
  },
  playerLinked: {
    label: "Player-linked",
    variant: "outline"
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getDiscontentCountLabel(count: number) {
  return `${count} ${count === 1 ? "mark" : "marks"}`;
}

function DiscontentCard({
  className,
  discontent,
  ...props
}: DiscontentCardProps) {
  const status = discontentStatusDisplay[discontent.status];
  const holder = holderDisplay[discontent.holderType];
  const titleId = `discontent-${discontent.id}-title`;
  const summaryId = `discontent-${discontent.id}-summary`;
  const detailItems = [
    { label: "Holder", value: discontent.holderLabel },
    discontent.linkedTurnLabel
      ? { label: "Linked turn", value: discontent.linkedTurnLabel }
      : null,
    discontent.lastChangedLabel
      ? { label: "Last changed", value: discontent.lastChangedLabel }
      : null
  ].filter(
    (item): item is { label: string; value: string } => item !== null
  );

  return (
    <Card
      role="article"
      aria-labelledby={titleId}
      aria-describedby={summaryId}
      variant={status.cardVariant}
      className={classes("min-h-full", className)}
      {...props}
    >
      <CardHeader className="gap-y-3">
        <div className="col-start-1 flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {discontent.status === "draftChange" ? (
              <StateBadge state="draft" />
            ) : discontent.status === "resolved" ? (
              <StateBadge state="official" />
            ) : null}
            <Badge variant={status.badgeVariant}>
              <span
                aria-hidden="true"
                className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
              >
                {status.marker}
              </span>
              <span>{status.badgeLabel}</span>
            </Badge>
            <Badge variant={holder.variant}>{holder.label}</Badge>
            {discontent.recentChange ? (
              <StateChangeChip change={discontent.recentChange} />
            ) : null}
          </div>
          <CardTitle id={titleId}>{discontent.holderLabel}</CardTitle>
          {discontent.reason ? (
            <CardDescription>{discontent.reason}</CardDescription>
          ) : null}
        </div>
        <CardAction>
          <div className="rounded-md border border-border bg-surface px-3 py-2 text-right">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Count
            </p>
            <p className="text-sm font-semibold leading-6">
              {getDiscontentCountLabel(discontent.count)}
            </p>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p
          id={summaryId}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm leading-6 text-muted-foreground"
        >
          {status.summary}
        </p>

        <dl className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-surface px-3 py-2">
            <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Discontent
            </dt>
            <dd className="mt-1 text-sm font-semibold leading-6 text-foreground">
              {getDiscontentCountLabel(discontent.count)}
            </dd>
          </div>
          {detailItems.map((item) => (
            <div
              key={item.label}
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
      </CardContent>

      <CardFooter>
        <span className="font-mono text-xs uppercase">Community state</span>
        <span>Display-only discontent record.</span>
      </CardFooter>
    </Card>
  );
}

export { DiscontentCard };
export type { DiscontentCardProps };
