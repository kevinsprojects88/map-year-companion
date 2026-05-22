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
import type { ProjectCardViewModel, ProjectStatus } from "@/types/community-state";

type ProjectCardProps = Omit<ComponentProps<"div">, "title"> & {
  project: ProjectCardViewModel;
};

type ProjectStatusDisplay = {
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  cardVariant: CardVariant;
  marker: string;
  summary: string;
};

const projectStatusDisplay: Record<ProjectStatus, ProjectStatusDisplay> = {
  abandoned: {
    badgeLabel: "Abandoned",
    badgeVariant: "archived",
    cardVariant: "archived",
    marker: "LEFT",
    summary: "This project is no longer being advanced."
  },
  active: {
    badgeLabel: "Active",
    badgeVariant: "active",
    cardVariant: "default",
    marker: "ACT",
    summary: "This project is part of the current official community state."
  },
  completed: {
    badgeLabel: "Completed",
    badgeVariant: "success",
    cardVariant: "official",
    marker: "DONE",
    summary: "This project has settled into the official record."
  },
  draftChange: {
    badgeLabel: "Draft Change",
    badgeVariant: "draft",
    cardVariant: "draft",
    marker: "DRAFT",
    summary: "This project change is provisional and not official yet."
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ProjectCard({ className, project, ...props }: ProjectCardProps) {
  const status = projectStatusDisplay[project.status];
  const titleId = `project-${project.id}-title`;
  const summaryId = `project-${project.id}-summary`;
  const detailItems = [
    project.remainingWeeksLabel
      ? { label: "Remaining", value: project.remainingWeeksLabel }
      : null,
    project.startedTurnLabel
      ? { label: "Started", value: project.startedTurnLabel }
      : null,
    project.completedTurnLabel
      ? { label: "Completed", value: project.completedTurnLabel }
      : null,
    project.locationLabel ? { label: "Map link", value: project.locationLabel } : null
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
            {project.status === "draftChange" ? (
              <StateBadge state="draft" />
            ) : project.status === "completed" ? (
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
            {project.recentChange ? (
              <StateChangeChip change={project.recentChange} />
            ) : null}
          </div>
          <CardTitle id={titleId}>{project.name}</CardTitle>
          {project.description ? (
            <CardDescription>{project.description}</CardDescription>
          ) : null}
        </div>
        <CardAction>
          <div className="rounded-md border border-border bg-surface px-3 py-2 text-right">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Project
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

      {project.lastChangedLabel ? (
        <CardFooter>
          <span className="font-mono text-xs uppercase">Last changed</span>
          <span>{project.lastChangedLabel}</span>
        </CardFooter>
      ) : null}
    </Card>
  );
}

export { ProjectCard };
export type { ProjectCardProps };
