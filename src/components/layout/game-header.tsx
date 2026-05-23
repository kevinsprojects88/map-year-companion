import type { ComponentProps } from "react";

import { Badge, StateBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  GameHeaderBadgeViewModel,
  GameHeaderViewModel
} from "@/types/layout";

type GameHeaderProps = Omit<ComponentProps<"header">, "children"> &
  GameHeaderViewModel;

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function GameHeaderBadge({ badge }: { badge: GameHeaderBadgeViewModel }) {
  if (badge.state) {
    return <StateBadge state={badge.state} />;
  }

  return (
    <Badge variant={badge.variant ?? "secondary"}>
      {badge.marker ? (
        <span
          aria-hidden="true"
          className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
        >
          {badge.marker}
        </span>
      ) : null}
      <span>{badge.label}</span>
    </Badge>
  );
}

function GameHeader({
  activePlayerLabel,
  className,
  currentTurnLabel,
  gameStatusLabel,
  rightActions = [],
  statusBadges = [],
  worldTitle,
  ...props
}: GameHeaderProps) {
  const actionReasons = rightActions
    .map(
      (action) =>
        action.disabledReason ??
        `${action.label} is a static placeholder action in this demo.`
    )
    .join(" ");

  return (
    <header
      data-slot="game-header"
      className={classes(
        "rounded-lg border border-border bg-surface-raised px-4 py-4 shadow-paper-sm sm:px-5",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
            In-game placeholder header
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="min-w-0 text-2xl font-semibold leading-tight sm:text-3xl">
              {worldTitle}
            </h2>
            <Badge variant="turn">
              <span
                aria-hidden="true"
                className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
              >
                TURN
              </span>
              <span>{currentTurnLabel}</span>
            </Badge>
          </div>
          <dl className="flex flex-wrap gap-2 text-sm leading-6">
            <div className="rounded-md border border-border bg-surface px-3 py-1.5">
              <dt className="inline font-mono text-xs font-semibold uppercase text-muted-foreground">
                Active player:{" "}
              </dt>
              <dd className="inline font-semibold text-foreground">
                {activePlayerLabel}
              </dd>
            </div>
            <div className="rounded-md border border-border bg-surface px-3 py-1.5">
              <dt className="inline font-mono text-xs font-semibold uppercase text-muted-foreground">
                Status:{" "}
              </dt>
              <dd className="inline font-semibold text-foreground">
                {gameStatusLabel}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          {statusBadges.length ? (
            <div
              aria-label="Game status badges"
              className="flex flex-wrap gap-2 lg:justify-end"
            >
              {statusBadges.map((badge) => (
                <GameHeaderBadge key={badge.id} badge={badge} />
              ))}
            </div>
          ) : null}

          {rightActions.length ? (
            <div className="flex flex-col gap-2 lg:items-end">
              <div
                aria-label="Static placeholder game actions"
                className="flex flex-wrap gap-2 lg:justify-end"
              >
                {rightActions.map((action) => (
                  <Button
                    key={action.id}
                    aria-label={
                      action.ariaLabel ??
                      `${action.label} (static placeholder action)`
                    }
                    disabled
                    size="sm"
                    variant={action.variant ?? "secondary"}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
              <p className="max-w-md text-xs leading-5 text-muted-foreground">
                {actionReasons}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export { GameHeader };
export type { GameHeaderProps };
