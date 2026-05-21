import type { ComponentProps } from "react";

import { AutosaveStatus } from "@/components/feedback/autosave-status";
import { PermissionAlert } from "@/components/feedback/permission-alert";
import { TurnChecklist } from "@/components/turns/turn-checklist";
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
import { Textarea } from "@/components/ui/textarea";
import type { AutosaveStatusState } from "@/types/feedback";
import type {
  CurrentTurnPanelViewModel,
  TurnStatus,
  TurnStoryPollStatus,
  TurnViewerState
} from "@/types/turn";

type CurrentTurnPanelProps = Omit<ComponentProps<"div">, "title"> & {
  turn: CurrentTurnPanelViewModel;
};

type TurnStatusDisplay = {
  autosaveMessage?: string;
  autosaveState?: AutosaveStatusState;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  cardVariant: CardVariant;
  marker: string;
  summary: string;
};

type ViewerDisplay = {
  badge: "yourTurn" | "waiting" | "readOnly";
  label: string;
  summary: string;
};

type PollDisplay = {
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  marker: string;
};

const turnStatusDisplay: Record<TurnStatus, TurnStatusDisplay> = {
  active: {
    autosaveMessage: "Draft workspace is ready. Nothing is official yet.",
    autosaveState: "idle",
    badgeLabel: "Active",
    badgeVariant: "turn",
    cardVariant: "default",
    marker: "TURN",
    summary: "The active player can keep drafting before the official commit."
  },
  draftSaved: {
    autosaveMessage: "Draft saved for table review. Official history is unchanged.",
    autosaveState: "saved",
    badgeLabel: "Draft Saved",
    badgeVariant: "draft",
    cardVariant: "draft",
    marker: "DRAFT",
    summary: "A provisional draft is visible, but the turn has not advanced."
  },
  needsAttention: {
    autosaveMessage: "Review the blocked checklist item before committing.",
    autosaveState: "error",
    badgeLabel: "Needs Attention",
    badgeVariant: "attention",
    cardVariant: "process",
    marker: "ATTN",
    summary: "The draft can still be inspected, but commit is paused."
  },
  blocked: {
    autosaveMessage: "Draft controls are paused for this blocked mock state.",
    autosaveState: "error",
    badgeLabel: "Blocked",
    badgeVariant: "invalid",
    cardVariant: "error",
    marker: "STOP",
    summary: "This mock turn needs review before draft or commit controls resume."
  },
  completed: {
    badgeLabel: "Completed",
    badgeVariant: "archived",
    cardVariant: "archived",
    marker: "DONE",
    summary: "This settled turn is shown as an official read-only record."
  }
};

const viewerDisplay: Record<TurnViewerState, ViewerDisplay> = {
  activePlayer: {
    badge: "yourTurn",
    label: "Active player view",
    summary: "You can draft the turn outcome in this mock panel."
  },
  passivePlayer: {
    badge: "waiting",
    label: "Passive player view",
    summary: "You can inspect the saved draft, discuss, and vote elsewhere."
  },
  readOnly: {
    badge: "readOnly",
    label: "Read-only archive view",
    summary: "This panel is settled and accepts no turn actions."
  }
};

const pollDisplay: Record<TurnStoryPollStatus, PollDisplay> = {
  none: {
    badgeLabel: "No Story Poll",
    badgeVariant: "secondary",
    marker: "NONE"
  },
  open: {
    badgeLabel: "Open",
    badgeVariant: "poll",
    marker: "OPEN"
  },
  closed: {
    badgeLabel: "Closed",
    badgeVariant: "secondary",
    marker: "END"
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getPermissionTitle(turn: CurrentTurnPanelViewModel) {
  if (turn.status === "completed") {
    return "Turn record is read-only";
  }

  if (turn.status === "blocked") {
    return "Turn controls are blocked";
  }

  if (turn.viewerState === "passivePlayer") {
    return "Only the active player can commit";
  }

  return "Turn controls are read-only";
}

function getDefaultDisabledReason(turn: CurrentTurnPanelViewModel) {
  if (turn.disabledReason) {
    return turn.disabledReason;
  }

  if (turn.status === "completed") {
    return "Completed turns preserve official history and cannot be edited from this panel.";
  }

  if (turn.status === "blocked") {
    return "Resolve the blocked checklist item before saving or committing this mock turn.";
  }

  if (turn.viewerState === "passivePlayer") {
    return "Passive players can discuss, vote, inspect saved drafts, and review history, but cannot save or commit the turn.";
  }

  if (turn.viewerState === "readOnly") {
    return "Archived or read-only views keep draft and commit controls disabled.";
  }

  return "Commit is paused until the needs-attention item is reviewed.";
}

function CurrentTurnPanel({
  className,
  turn,
  ...props
}: CurrentTurnPanelProps) {
  const status = turnStatusDisplay[turn.status];
  const viewer = viewerDisplay[turn.viewerState];
  const poll = pollDisplay[turn.storyPoll.status];
  const titleId = `current-turn-${turn.id}-title`;
  const summaryId = `current-turn-${turn.id}-summary`;
  const isReadOnly =
    turn.viewerState !== "activePlayer" ||
    turn.status === "blocked" ||
    turn.status === "completed";
  const isOfficialReadOnly =
    turn.viewerState === "readOnly" || turn.status === "completed";
  const saveDisabled =
    turn.viewerState !== "activePlayer" ||
    turn.status === "blocked" ||
    turn.status === "completed";
  const commitDisabled =
    saveDisabled || turn.status === "needsAttention";
  const disabledReason =
    saveDisabled || commitDisabled ? getDefaultDisabledReason(turn) : undefined;
  const showPermissionAlert =
    saveDisabled || turn.viewerState !== "activePlayer" || turn.status === "completed";
  const draftLabel = isOfficialReadOnly
    ? "Official committed outcome"
    : "Draft outcome workspace";

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
            <StateBadge state={viewer.badge} />
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
          <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
            {turn.gameName}
          </p>
          <CardTitle id={titleId}>{turn.turnLabel}</CardTitle>
          <CardDescription id={summaryId}>
            Active player: {turn.activePlayerLabel}. {status.summary}
          </CardDescription>
        </div>
        <CardAction>
          <div className="rounded-md border border-border bg-surface px-3 py-2 text-right">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Viewer
            </p>
            <p className="text-sm font-semibold leading-6">{viewer.label}</p>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="gap-5">
        <dl className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-surface px-3 py-2">
            <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Active player
            </dt>
            <dd className="mt-1 text-sm font-semibold leading-6">
              {turn.activePlayerLabel}
            </dd>
          </div>
          <div className="rounded-md border border-border bg-surface px-3 py-2">
            <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Turn state
            </dt>
            <dd className="mt-1 text-sm font-semibold leading-6">
              {status.badgeLabel}
            </dd>
          </div>
          <div className="rounded-md border border-border bg-surface px-3 py-2">
            <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Viewer state
            </dt>
            <dd className="mt-1 text-sm font-semibold leading-6">
              {viewer.summary}
            </dd>
          </div>
        </dl>

        <section className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="poll">Prompt placeholder</Badge>
            <span className="text-sm font-semibold leading-6">
              {turn.promptLabel}
            </span>
          </div>
          <Textarea
            aria-label={`${turn.turnLabel} prompt placeholder`}
            defaultValue={turn.promptDetail}
            readOnly
            variant="cardPrompt"
          />
          <p className="text-sm leading-6 text-muted-foreground">
            Placeholder prompt content only. No official card text or
            proprietary material is included.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {isOfficialReadOnly ? (
                <StateBadge state="official" />
              ) : (
                <StateBadge state="draft" />
              )}
              <h3 className="text-lg font-semibold leading-tight">
                {draftLabel}
              </h3>
            </div>
            {status.autosaveState ? (
              <AutosaveStatus
                message={status.autosaveMessage}
                state={status.autosaveState}
                timestamp={turn.draft.savedAtLabel}
              />
            ) : (
              <Badge variant="readOnly">Official record</Badge>
            )}
          </div>
          <Textarea
            aria-label={`${turn.turnLabel} ${draftLabel.toLowerCase()}`}
            defaultValue={turn.draft.body}
            readOnly={isReadOnly}
            variant={isOfficialReadOnly ? "official" : "draft"}
          />
          <p
            className={classes(
              "rounded-md border p-3 text-sm leading-6",
              isOfficialReadOnly
                ? "border-[var(--state-official-border)] bg-[var(--state-official-bg)] text-[var(--state-official-text)]"
                : "border-[var(--state-draft-border)] bg-[var(--state-draft-surface)] text-[var(--state-draft-text)]"
            )}
          >
            {turn.draft.helperText}
          </p>
        </section>

        <TurnChecklist
          headingId={`current-turn-${turn.id}-checklist-heading`}
          items={turn.checklist}
        />

        <section className="flex flex-col gap-3 rounded-md border border-[var(--state-poll-border)] bg-[var(--state-poll-bg)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <StateBadge state="communityVote" />
              <Badge variant={poll.badgeVariant}>
                <span
                  aria-hidden="true"
                  className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
                >
                  {poll.marker}
                </span>
                <span>{poll.badgeLabel}</span>
              </Badge>
            </div>
            {turn.storyPoll.linkLabel ? (
              <Button
                aria-label={`${turn.storyPoll.linkLabel} (mock link, disabled)`}
                disabled
                variant="ghost"
              >
                {turn.storyPoll.linkLabel}
              </Button>
            ) : null}
          </div>
          <p className="text-sm font-medium leading-6 text-[var(--state-poll-text)]">
            {turn.storyPoll.detail}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Mock Story Poll status only. This area does not create, close, route
            to, or apply any poll result.
          </p>
        </section>

        <section className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold leading-tight">
              Turn action area
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {turn.actionCopy}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled={saveDisabled} variant="draft">
              {turn.saveDraftLabel}
            </Button>
            <Button disabled={commitDisabled} variant="official">
              {turn.commitAndAdvanceLabel}
            </Button>
          </div>
          {disabledReason ? (
            <p className="rounded-md border border-[var(--state-process-border)] bg-[var(--state-process-surface)] p-3 text-sm leading-6 text-[var(--state-process-text)]">
              {disabledReason}
            </p>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              Buttons are present for visual review only and have no action
              handlers in this primitive.
            </p>
          )}
        </section>

        {showPermissionAlert ? (
          <PermissionAlert
            allowedActions={turn.passiveAvailableActions}
            description="This primitive explains the boundary in plain text while leaving real authorization, server actions, and turn logic for later phases."
            disabledReason={disabledReason}
            roleContext={viewer.label}
            title={getPermissionTitle(turn)}
            turnContext={status.badgeLabel}
          />
        ) : null}
      </CardContent>

      <CardFooter>
        <span className="font-mono text-xs uppercase">Mock turn panel</span>
        <span aria-hidden="true">/</span>
        <span>Draft state and official state remain visually distinct.</span>
      </CardFooter>
    </Card>
  );
}

export { CurrentTurnPanel };
export type { CurrentTurnPanelProps };
