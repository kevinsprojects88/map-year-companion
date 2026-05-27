import Link from "next/link";

import { Badge, type BadgeVariant } from "@/components/ui/badge";
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
import { Button, type ButtonVariant } from "@/components/ui/button";
import type {
  SetupChecklistItem,
  SetupChecklistRequirement,
  SetupChecklistStatus
} from "@/types/setup";

type LobbySetupStatusProps = {
  items: SetupChecklistItem[];
};

type SetupStatusDisplay = {
  actionVariant: ButtonVariant;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  cardVariant: CardVariant;
  marker: string;
};

const setupStatusDisplay: Record<SetupChecklistStatus, SetupStatusDisplay> = {
  blocked: {
    actionVariant: "destructive",
    badgeLabel: "Blocked",
    badgeVariant: "invalid",
    cardVariant: "error",
    marker: "STOP"
  },
  complete: {
    actionVariant: "secondary",
    badgeLabel: "Complete",
    badgeVariant: "success",
    cardVariant: "official",
    marker: "PASS"
  },
  incomplete: {
    actionVariant: "secondary",
    badgeLabel: "Later",
    badgeVariant: "outline",
    cardVariant: "default",
    marker: "TODO"
  },
  optional: {
    actionVariant: "ghost",
    badgeLabel: "Optional",
    badgeVariant: "secondary",
    cardVariant: "raised",
    marker: "OPT"
  },
  warning: {
    actionVariant: "process",
    badgeLabel: "Needs Review",
    badgeVariant: "attention",
    cardVariant: "process",
    marker: "WARN"
  }
};

const requirementDisplay: Record<
  SetupChecklistRequirement,
  { label: string; variant: BadgeVariant }
> = {
  optional: { label: "Optional", variant: "secondary" },
  required: { label: "Required", variant: "process" }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ChecklistAction({ item }: { item: SetupChecklistItem }) {
  const status = setupStatusDisplay[item.status];

  if (item.actionHref) {
    return (
      <Link
        aria-label={`${item.actionLabel}: ${item.title}`}
        className={classes(
          "inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold leading-none",
          "border-border bg-secondary text-secondary-foreground transition-colors duration-150 hover:border-border-strong hover:bg-[var(--paper-200)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
        href={item.actionHref}
      >
        {item.actionLabel}
      </Link>
    );
  }

  return (
    <Button
      aria-label={`${item.actionLabel}: ${item.title}`}
      disabled
      title={item.actionDisabledReason}
      variant={status.actionVariant}
    >
      {item.actionLabel}
    </Button>
  );
}

function LobbySetupStatus({ items }: LobbySetupStatusProps) {
  return (
    <section aria-labelledby="lobby-setup-status-heading" className="grid gap-4">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
          Setup checklist
        </p>
        <h2
          className="text-2xl font-semibold leading-tight"
          id="lobby-setup-status-heading"
        >
          Setup is not complete yet
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          These cards report the current lobby state and mark future setup
          areas without enabling deck, map, turn, player-management, notes, or
          start-game behavior.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => {
          const status = setupStatusDisplay[item.status];
          const requirement = requirementDisplay[item.requirement];
          const validationMessages = item.validationMessages ?? [];

          return (
            <Card
              className="min-h-full"
              key={item.title}
              role="article"
              variant={status.cardVariant}
            >
              <CardHeader className="gap-y-3">
                <div className="col-start-1 flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={status.badgeVariant}>
                      <span
                        aria-hidden="true"
                        className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
                      >
                        {status.marker}
                      </span>
                      <span>{status.badgeLabel}</span>
                    </Badge>
                    <Badge variant={requirement.variant}>
                      {requirement.label}
                    </Badge>
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                <CardAction>
                  <ChecklistAction item={item} />
                </CardAction>
              </CardHeader>

              {validationMessages.length ? (
                <CardContent>
                  <ul className="flex flex-col gap-1.5 text-sm leading-6 text-muted-foreground">
                    {validationMessages.map((message) => (
                      <li className="flex gap-2" key={message}>
                        <span aria-hidden="true">-</span>
                        <span>{message}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              ) : null}

              <CardFooter>
                <span className="text-xs leading-5">
                  {item.actionDisabledReason ?? "Linked setup action available"}
                </span>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export { LobbySetupStatus };
export type { LobbySetupStatusProps };
