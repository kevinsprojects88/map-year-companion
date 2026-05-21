import type { ComponentProps } from "react";

import { Badge, StateBadge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ProcessVoteResponseGroup } from "@/components/polls/process-vote-response-group";
import type {
  ProcessVoteStatus,
  ProcessVoteType,
  ProcessVoteViewModel
} from "@/types/process-vote";

type ProcessVoteCardProps = Omit<ComponentProps<"div">, "title"> & {
  responseGroupName?: string;
  vote: ProcessVoteViewModel;
};

type ProcessVoteStatusDisplay = {
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  cardVariant: CardVariant;
  marker: string;
  responseControlsDisabled: boolean;
  tone: "active" | "settled" | "attention";
};

const governanceCopy =
  "Governance/admin only. This process vote is not a Story Poll, does not create fictional outcomes, and does not change official history by itself.";

const processVoteTypeLabels: Record<ProcessVoteType, string> = {
  reassignStuckTurn: "Reassign Stuck Turn"
};

const processVoteStatusDisplay: Record<
  ProcessVoteStatus,
  ProcessVoteStatusDisplay
> = {
  open: {
    badgeLabel: "Open",
    badgeVariant: "process",
    cardVariant: "process",
    marker: "OPEN",
    responseControlsDisabled: false,
    tone: "active"
  },
  passed: {
    badgeLabel: "Passed",
    badgeVariant: "success",
    cardVariant: "process",
    marker: "PASS",
    responseControlsDisabled: true,
    tone: "settled"
  },
  failed: {
    badgeLabel: "Failed",
    badgeVariant: "invalid",
    cardVariant: "process",
    marker: "FAIL",
    responseControlsDisabled: true,
    tone: "settled"
  },
  cancelled: {
    badgeLabel: "Cancelled",
    badgeVariant: "secondary",
    cardVariant: "archived",
    marker: "STOP",
    responseControlsDisabled: true,
    tone: "settled"
  },
  confirmationNeeded: {
    badgeLabel: "Owner/Admin Confirmation Needed",
    badgeVariant: "attention",
    cardVariant: "process",
    marker: "CONF",
    responseControlsDisabled: true,
    tone: "attention"
  },
  readOnly: {
    badgeLabel: "Read-only",
    badgeVariant: "readOnly",
    cardVariant: "archived",
    marker: "LOCK",
    responseControlsDisabled: true,
    tone: "settled"
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getResponseLabel(count: number) {
  return `${count} ${count === 1 ? "response" : "responses"}`;
}

function getToneClass(tone: ProcessVoteStatusDisplay["tone"]) {
  if (tone === "attention") {
    return "border-[var(--state-warning-border)] bg-[var(--state-warning-surface)] text-[var(--state-warning-text)]";
  }

  if (tone === "settled") {
    return "border-border bg-surface text-muted-foreground";
  }

  return "border-[var(--state-process-border)] bg-[var(--state-process-surface)] text-[var(--state-process-text)]";
}

function ProcessVoteCard({
  className,
  responseGroupName,
  vote,
  ...props
}: ProcessVoteCardProps) {
  const status = processVoteStatusDisplay[vote.status];
  const titleId = `process-vote-${vote.id}-title`;
  const governanceId = `process-vote-${vote.id}-governance`;
  const typeLabel = processVoteTypeLabels[vote.type];

  return (
    <Card
      role="article"
      aria-labelledby={titleId}
      aria-describedby={governanceId}
      variant={status.cardVariant}
      className={classes("min-h-full", className)}
      {...props}
    >
      <CardHeader className="gap-y-3">
        <div className="col-start-1 flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <StateBadge state="processVote" />
            <Badge variant={status.badgeVariant}>
              <span
                aria-hidden="true"
                className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
              >
                {status.marker}
              </span>
              <span>{status.badgeLabel}</span>
            </Badge>
          </div>
          <CardTitle id={titleId}>{vote.title}</CardTitle>
          <CardDescription>
            {typeLabel} table administration. This is separate from Community
            Vote cards and story discussion.
          </CardDescription>
        </div>
        <CardAction>
          <div
            className={classes(
              "rounded-md border px-3 py-2 text-right",
              getToneClass(status.tone)
            )}
          >
            <p className="font-mono text-xs font-semibold uppercase leading-5">
              Process
            </p>
            <p className="text-sm font-semibold leading-6">
              {getResponseLabel(vote.totalResponses)}
            </p>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div
          id={governanceId}
          className="rounded-md border border-[var(--state-process-border)] bg-[var(--state-process-surface)] p-3 text-sm font-medium leading-6 text-[var(--state-process-text)]"
        >
          {governanceCopy}
        </div>

        <dl className="grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Current Active Player
            </dt>
            <dd className="mt-1 font-semibold text-foreground">
              {vote.currentActivePlayerLabel}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Proposed Replacement
            </dt>
            <dd className="mt-1 font-semibold text-foreground">
              {vote.proposedReplacementPlayerLabel}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Reason / Context
            </dt>
            <dd className="mt-1 text-muted-foreground">{vote.reason}</dd>
          </div>
        </dl>

        <ProcessVoteResponseGroup
          disabled={status.responseControlsDisabled}
          legend={`Process vote responses for ${vote.title}`}
          name={responseGroupName ?? `process-vote-${vote.id}`}
          responses={vote.responses}
        />

        <div className="grid gap-2">
          <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm leading-6 text-muted-foreground">
            <span className="font-semibold text-foreground">Threshold: </span>
            {vote.thresholdCopy}
          </p>
          <p
            className={classes(
              "rounded-md border px-3 py-2 text-sm leading-6",
              getToneClass(status.tone)
            )}
          >
            <span className="font-semibold">Confirmation: </span>
            {vote.confirmationCopy}
          </p>
          <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm leading-6 text-muted-foreground">
            <span className="font-semibold text-foreground">Result: </span>
            {vote.resultCopy}
          </p>
          <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm leading-6 text-muted-foreground">
            {vote.statusDetail}
          </p>
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-3">
        <span>
          Initiated by {vote.initiatedByLabel} / {vote.createdAtLabel}
        </span>
        {vote.primaryActionLabel ? (
          <Button
            aria-label={`${vote.primaryActionLabel} placeholder control`}
            disabled
            variant="process"
          >
            {vote.primaryActionLabel}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export { ProcessVoteCard };
export type { ProcessVoteCardProps };
