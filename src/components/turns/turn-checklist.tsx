import type { ComponentProps } from "react";

import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type { TurnChecklistItem, TurnChecklistStatus } from "@/types/turn";

type TurnChecklistProps = ComponentProps<"section"> & {
  headingId?: string;
  items: TurnChecklistItem[];
  title?: string;
};

type ChecklistStatusDisplay = {
  label: string;
  marker: string;
  toneClass: string;
  variant: BadgeVariant;
};

const checklistStatusDisplay: Record<
  TurnChecklistStatus,
  ChecklistStatusDisplay
> = {
  notStarted: {
    label: "Not Started",
    marker: "TODO",
    toneClass: "border-border bg-surface text-muted-foreground",
    variant: "secondary"
  },
  current: {
    label: "Current",
    marker: "NOW",
    toneClass:
      "border-[var(--state-poll-border)] bg-[var(--state-poll-bg)] text-[var(--state-poll-text)]",
    variant: "poll"
  },
  complete: {
    label: "Complete",
    marker: "DONE",
    toneClass:
      "border-[var(--state-official-border)] bg-[var(--state-official-bg)] text-[var(--state-official-text)]",
    variant: "success"
  },
  blocked: {
    label: "Blocked",
    marker: "STOP",
    toneClass:
      "border-[var(--state-error-border)] bg-[var(--state-error-bg)] text-[var(--state-error-text)]",
    variant: "invalid"
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function TurnChecklist({
  className,
  headingId = "turn-checklist-heading",
  items,
  title = "Procedural checklist",
  ...props
}: TurnChecklistProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={classes("flex flex-col gap-3", className)}
      {...props}
    >
      <div className="flex flex-col gap-1">
        <h3
          id={headingId}
          className="text-lg font-semibold leading-tight"
        >
          {title}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Mock procedural steps only. Status labels are shown as text and marks.
        </p>
      </div>

      <ol className="flex flex-col gap-2">
        {items.map((item, index) => {
          const status = checklistStatusDisplay[item.status];

          return (
            <li
              key={item.id}
              className={classes(
                "grid gap-3 rounded-md border p-3 sm:grid-cols-[auto_1fr_auto] sm:items-start",
                status.toneClass
              )}
            >
              <span className="font-mono text-xs font-semibold uppercase leading-7 text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="font-semibold leading-6">{item.label}</span>
                {item.description ? (
                  <span className="text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </span>
                ) : null}
              </span>
              <Badge variant={status.variant}>
                <span
                  aria-hidden="true"
                  className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
                >
                  {status.marker}
                </span>
                <span>{status.label}</span>
              </Badge>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export { TurnChecklist };
export type { TurnChecklistProps };
