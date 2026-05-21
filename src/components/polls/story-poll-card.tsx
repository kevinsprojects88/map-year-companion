import type { ComponentProps } from "react";

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
import { Badge, StateBadge, type BadgeVariant } from "@/components/ui/badge";
import { PollOptionRadioGroup } from "@/components/polls/poll-option-radio-group";
import type { StoryPollStatus, StoryPollViewModel } from "@/types/poll";

type StoryPollCardProps = Omit<ComponentProps<"div">, "title"> & {
  optionGroupName?: string;
  poll: StoryPollViewModel;
};

type StoryPollStatusDisplay = {
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  cardVariant: CardVariant;
  marker: string;
  optionControlsDisabled: boolean;
  showResults: boolean;
  tone: "active" | "muted";
};

const advisoryCopy =
  "Advisory only. This community vote does not change official history or resolve rules automatically.";

const storyPollStatusDisplay: Record<
  StoryPollStatus,
  StoryPollStatusDisplay
> = {
  open: {
    badgeLabel: "Open",
    badgeVariant: "poll",
    cardVariant: "poll",
    marker: "OPEN",
    optionControlsDisabled: false,
    showResults: true,
    tone: "active"
  },
  voted: {
    badgeLabel: "Vote Recorded",
    badgeVariant: "success",
    cardVariant: "poll",
    marker: "VOTED",
    optionControlsDisabled: true,
    showResults: true,
    tone: "active"
  },
  closed: {
    badgeLabel: "Closed",
    badgeVariant: "secondary",
    cardVariant: "poll",
    marker: "END",
    optionControlsDisabled: true,
    showResults: true,
    tone: "muted"
  },
  readOnly: {
    badgeLabel: "Read-only",
    badgeVariant: "readOnly",
    cardVariant: "archived",
    marker: "LOCK",
    optionControlsDisabled: true,
    showResults: true,
    tone: "muted"
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getVoteLabel(count: number) {
  return `${count} ${count === 1 ? "vote" : "votes"}`;
}

function StoryPollCard({
  className,
  optionGroupName,
  poll,
  ...props
}: StoryPollCardProps) {
  const status = storyPollStatusDisplay[poll.status];
  const titleId = `story-poll-${poll.id}-title`;
  const advisoryId = `story-poll-${poll.id}-advisory`;
  const groupName = optionGroupName ?? `story-poll-${poll.id}`;

  return (
    <Card
      role="article"
      aria-labelledby={titleId}
      aria-describedby={advisoryId}
      variant={status.cardVariant}
      className={classes("min-h-full", className)}
      {...props}
    >
      <CardHeader className="gap-y-3">
        <div className="col-start-1 flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <StateBadge state="communityVote" />
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
          <CardTitle id={titleId}>{poll.question}</CardTitle>
          {poll.description ? (
            <CardDescription>{poll.description}</CardDescription>
          ) : null}
        </div>
        <CardAction>
          <div
            className={classes(
              "rounded-md border px-3 py-2 text-right",
              status.tone === "active"
                ? "border-[var(--state-poll-border)] bg-[var(--state-poll-surface)] text-[var(--state-poll-text)]"
                : "border-border bg-surface text-muted-foreground"
            )}
          >
            <p className="font-mono text-xs font-semibold uppercase leading-5">
              Tallies
            </p>
            <p className="text-sm font-semibold leading-6">
              {getVoteLabel(poll.totalVotes)}
            </p>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div
          id={advisoryId}
          className="rounded-md border border-[var(--state-poll-border)] bg-[var(--state-poll-surface)] p-3 text-sm font-medium leading-6 text-[var(--state-poll-text)]"
        >
          {advisoryCopy}
        </div>
        <PollOptionRadioGroup
          disabled={status.optionControlsDisabled}
          legend={`Community vote options for ${poll.question}`}
          name={groupName}
          options={poll.options}
          selectedOptionId={poll.currentUserVoteOptionId}
          showResults={status.showResults}
          totalVotes={poll.totalVotes}
        />
        <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm leading-6 text-muted-foreground">
          {poll.statusDetail}
        </p>
      </CardContent>

      <CardFooter>
        <span>Created by {poll.createdByLabel}</span>
        <span aria-hidden="true">/</span>
        <span>{poll.createdAtLabel}</span>
      </CardFooter>
    </Card>
  );
}

export { StoryPollCard };
export type { StoryPollCardProps };
