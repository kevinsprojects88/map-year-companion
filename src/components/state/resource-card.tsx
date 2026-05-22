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
import type { ResourceCardViewModel, ResourceStatus } from "@/types/community-state";

type ResourceCardProps = Omit<ComponentProps<"div">, "resource" | "title"> & {
  resource: ResourceCardViewModel;
};

type ResourceStatusDisplay = {
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  cardVariant: CardVariant;
  marker: string;
  summary: string;
};

const resourceStatusDisplay: Record<ResourceStatus, ResourceStatusDisplay> = {
  abundance: {
    badgeLabel: "Abundance",
    badgeVariant: "official",
    cardVariant: "official",
    marker: "ABND",
    summary: "The community has enough of this resource for now."
  },
  custom: {
    badgeLabel: "Custom",
    badgeVariant: "outline",
    cardVariant: "raised",
    marker: "NOTE",
    summary: "This resource uses a custom community label in the mock data."
  },
  draftChange: {
    badgeLabel: "Draft Change",
    badgeVariant: "draft",
    cardVariant: "draft",
    marker: "DRAFT",
    summary: "This resource change is provisional and not official yet."
  },
  neutral: {
    badgeLabel: "Neutral",
    badgeVariant: "secondary",
    cardVariant: "default",
    marker: "EVEN",
    summary: "The resource is being tracked without abundance or scarcity."
  },
  scarcity: {
    badgeLabel: "Scarcity",
    badgeVariant: "attention",
    cardVariant: "process",
    marker: "LOW",
    summary: "The community is short on this resource."
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ResourceCard({ className, resource, ...props }: ResourceCardProps) {
  const status = resourceStatusDisplay[resource.status];
  const titleId = `resource-${resource.id}-title`;
  const summaryId = `resource-${resource.id}-summary`;
  const detailItems = [
    resource.locationLabel
      ? { label: "Map link", value: resource.locationLabel }
      : null,
    resource.lastChangedTurnLabel
      ? { label: "Last changed", value: resource.lastChangedTurnLabel }
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
            {resource.status === "draftChange" ? (
              <StateBadge state="draft" />
            ) : resource.status === "abundance" ? (
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
            {resource.recentChange ? (
              <StateChangeChip change={resource.recentChange} />
            ) : null}
          </div>
          <CardTitle id={titleId}>{resource.name}</CardTitle>
          {resource.notes ? (
            <CardDescription>{resource.notes}</CardDescription>
          ) : null}
        </div>
        <CardAction>
          <div className="rounded-md border border-border bg-surface px-3 py-2 text-right">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Resource
            </p>
            <p className="text-sm font-semibold leading-6">{status.badgeLabel}</p>
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

        {detailItems.length ? (
          <dl className="grid gap-2 sm:grid-cols-2">
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
        ) : null}
      </CardContent>

      <CardFooter>
        <span className="font-mono text-xs uppercase">Community resource</span>
        <span>Display-only mock state.</span>
      </CardFooter>
    </Card>
  );
}

export { ResourceCard };
export type { ResourceCardProps };
