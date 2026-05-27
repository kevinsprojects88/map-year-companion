import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";

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
import {
  Badge,
  StateBadge,
  type BadgeVariant
} from "@/components/ui/badge";
import { Button, type ButtonVariant } from "@/components/ui/button";
import type { GameCardStatus, GameCardViewModel } from "@/types/game";

type GameCardProps = Omit<ComponentProps<"div">, "title"> & {
  game: GameCardViewModel;
  primaryActionAriaLabel?: string;
};

type GameStatusDisplay = {
  actionVariant: ButtonVariant;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  cardVariant: CardVariant;
  marker: string;
};

type Indicator = {
  key: string;
  node: ReactNode;
};

const gameStatusDisplay: Record<GameCardStatus, GameStatusDisplay> = {
  yourTurn: {
    actionVariant: "official",
    badgeLabel: "Your Turn",
    badgeVariant: "turn",
    cardVariant: "official",
    marker: "TURN"
  },
  active: {
    actionVariant: "primary",
    badgeLabel: "Active",
    badgeVariant: "active",
    cardVariant: "default",
    marker: "ACT"
  },
  waitingToStart: {
    actionVariant: "secondary",
    badgeLabel: "Waiting to Start",
    badgeVariant: "waiting",
    cardVariant: "raised",
    marker: "WAIT"
  },
  completed: {
    actionVariant: "secondary",
    badgeLabel: "Completed",
    badgeVariant: "success",
    cardVariant: "archived",
    marker: "DONE"
  },
  archived: {
    actionVariant: "secondary",
    badgeLabel: "Archived",
    badgeVariant: "archived",
    cardVariant: "archived",
    marker: "ARCH"
  },
  needsAttention: {
    actionVariant: "process",
    badgeLabel: "Needs Attention",
    badgeVariant: "attention",
    cardVariant: "process",
    marker: "ATTN"
  }
};

const actionBaseClasses =
  "inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold leading-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const actionVariantClasses: Record<ButtonVariant, string> = {
  destructive:
    "border-[var(--state-error-border)] bg-[var(--state-error-accent)] text-[var(--text-inverse)] hover:bg-[var(--error-700)]",
  draft:
    "border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-surface)] text-[var(--state-draft-text)] hover:bg-[var(--state-draft-bg)]",
  ghost:
    "border-transparent bg-transparent text-foreground hover:border-border hover:bg-muted",
  official:
    "border-[var(--state-official-border)] bg-[var(--state-official-accent)] text-[var(--text-inverse)] hover:bg-[var(--moss-800)]",
  primary:
    "border-primary bg-primary text-primary-foreground hover:bg-[var(--moss-800)]",
  process:
    "border-[var(--state-process-border)] bg-[var(--state-process-surface)] text-[var(--state-process-text)] hover:bg-[var(--state-process-bg)]",
  secondary:
    "border-border bg-secondary text-secondary-foreground hover:border-border-strong hover:bg-[var(--paper-200)]"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getGameIndicators(game: GameCardViewModel): Indicator[] {
  const indicators = game.indicators ?? {};
  const indicatorItems: Array<Indicator | null> = [
    indicators.hasDraft
      ? { key: "draft", node: <StateBadge state="draft" /> }
      : null,
    indicators.hasActiveStoryPoll
      ? { key: "story-poll", node: <StateBadge state="communityVote" /> }
      : null,
    indicators.hasProcessVote
      ? { key: "process-vote", node: <StateBadge state="processVote" /> }
      : null,
    indicators.needsAttention
      ? { key: "needs-attention", node: <StateBadge state="needsAttention" /> }
      : null
  ];

  return indicatorItems.filter(
    (indicator): indicator is Indicator => indicator !== null
  );
}

function GameCard({
  className,
  game,
  primaryActionAriaLabel,
  ...props
}: GameCardProps) {
  const status = gameStatusDisplay[game.status];
  const indicators = getGameIndicators(game);
  const primaryActionLabel =
    primaryActionAriaLabel ?? `${game.primaryActionLabel}: ${game.name}`;
  const detailItems = [
    game.activePlayerLabel
      ? { label: "Player", value: game.activePlayerLabel }
      : null,
    game.turnLabel ? { label: "Marker", value: game.turnLabel } : null,
    game.membershipRoleLabel
      ? { label: "Role", value: game.membershipRoleLabel }
      : null,
    game.playerCountLabel
      ? { label: "Players", value: game.playerCountLabel }
      : null,
    { label: "Updated", value: game.lastUpdatedLabel }
  ].filter(
    (item): item is { label: string; value: string } => item !== null
  );

  return (
    <Card
      role="article"
      variant={status.cardVariant}
      className={classes("min-h-full", className)}
      {...props}
    >
      <CardHeader className="gap-y-3">
        <div className="col-start-1 flex flex-col gap-2">
          <Badge variant={status.badgeVariant}>
            <span
              aria-hidden="true"
              className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
            >
              {status.marker}
            </span>
            <span>{status.badgeLabel}</span>
          </Badge>
          <CardTitle>{game.name}</CardTitle>
          <CardDescription>
            {game.activePlayerLabel ?? "No active player is assigned yet."}
          </CardDescription>
        </div>
        <CardAction>
          {game.primaryActionHref ? (
            <Link
              aria-label={primaryActionLabel}
              className={classes(
                actionBaseClasses,
                actionVariantClasses[status.actionVariant]
              )}
              href={game.primaryActionHref}
            >
              {game.primaryActionLabel}
            </Link>
          ) : (
            <Button
              aria-label={primaryActionLabel}
              variant={status.actionVariant}
            >
              {game.primaryActionLabel}
            </Button>
          )}
        </CardAction>
      </CardHeader>

      <CardContent>
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
      </CardContent>

      {indicators.length ? (
        <CardFooter aria-label="Game indicators">
          {indicators.map((indicator) => (
            <span key={indicator.key}>{indicator.node}</span>
          ))}
        </CardFooter>
      ) : null}
    </Card>
  );
}

export { GameCard };
export type { GameCardProps };
