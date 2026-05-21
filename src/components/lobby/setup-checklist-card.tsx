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
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button, type ButtonVariant } from "@/components/ui/button";
import type {
  SetupChecklistItem,
  SetupChecklistRequirement,
  SetupChecklistStatus
} from "@/types/setup";

type SetupChecklistCardProps = Omit<ComponentProps<"div">, "title"> & {
  actionAriaLabel?: string;
  item: SetupChecklistItem;
};

type SetupStatusDisplay = {
  actionVariant: ButtonVariant;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  cardVariant: CardVariant;
  marker: string;
  validationTone: "neutral" | "success" | "warning" | "error";
};

const setupStatusDisplay: Record<SetupChecklistStatus, SetupStatusDisplay> = {
  complete: {
    actionVariant: "secondary",
    badgeLabel: "Complete",
    badgeVariant: "success",
    cardVariant: "official",
    marker: "PASS",
    validationTone: "success"
  },
  incomplete: {
    actionVariant: "secondary",
    badgeLabel: "Incomplete",
    badgeVariant: "outline",
    cardVariant: "default",
    marker: "TODO",
    validationTone: "neutral"
  },
  warning: {
    actionVariant: "process",
    badgeLabel: "Warning",
    badgeVariant: "attention",
    cardVariant: "process",
    marker: "WARN",
    validationTone: "warning"
  },
  blocked: {
    actionVariant: "destructive",
    badgeLabel: "Blocked",
    badgeVariant: "invalid",
    cardVariant: "error",
    marker: "STOP",
    validationTone: "error"
  },
  optional: {
    actionVariant: "ghost",
    badgeLabel: "Optional",
    badgeVariant: "secondary",
    cardVariant: "raised",
    marker: "OPT",
    validationTone: "neutral"
  }
};

const requirementDisplay: Record<
  SetupChecklistRequirement,
  { label: string; variant: BadgeVariant }
> = {
  required: { label: "Required", variant: "process" },
  optional: { label: "Optional", variant: "secondary" }
};

const validationToneClasses: Record<SetupStatusDisplay["validationTone"], string> =
  {
    neutral: "border-border bg-surface text-muted-foreground",
    success:
      "border-[var(--state-success-border)] bg-[var(--state-success-bg)] text-[var(--state-success-text)]",
    warning:
      "border-[var(--state-warning-border)] bg-[var(--state-warning-bg)] text-[var(--state-warning-text)]",
    error:
      "border-[var(--state-error-border)] bg-[var(--state-error-bg)] text-[var(--state-error-text)]"
  };

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SetupChecklistCard({
  actionAriaLabel,
  className,
  item,
  ...props
}: SetupChecklistCardProps) {
  const status = setupStatusDisplay[item.status];
  const requirement = requirementDisplay[item.requirement];
  const validationMessages = item.validationMessages ?? [];

  return (
    <Card
      role="article"
      variant={status.cardVariant}
      className={classes("min-h-full", className)}
      {...props}
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
            <Badge variant={requirement.variant}>{requirement.label}</Badge>
          </div>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </div>
        <CardAction>
          <Button
            aria-label={actionAriaLabel ?? `${item.actionLabel}: ${item.title}`}
            variant={status.actionVariant}
          >
            {item.actionLabel}
          </Button>
        </CardAction>
      </CardHeader>

      {validationMessages.length ? (
        <CardContent>
          <div
            className={classes(
              "rounded-md border p-3",
              validationToneClasses[status.validationTone]
            )}
          >
            <p className="font-mono text-xs font-semibold uppercase">
              Validation messages
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-6">
              {validationMessages.map((message) => (
                <li key={message} className="flex gap-2">
                  <span aria-hidden="true">-</span>
                  <span>{message}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      ) : null}

      <CardFooter>
        <span className="font-mono text-xs uppercase">
          {item.requirement === "required"
            ? "Required before start"
            : "Optional setup note"}
        </span>
      </CardFooter>
    </Card>
  );
}

export { SetupChecklistCard };
export type { SetupChecklistCardProps };
