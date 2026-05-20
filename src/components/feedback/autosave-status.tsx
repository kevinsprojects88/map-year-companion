import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import type { AutosaveStatusState } from "@/types/feedback";

type AutosaveStatusProps = ComponentProps<"div"> & {
  state: AutosaveStatusState;
  message?: string;
  timestamp?: string;
};

const autosaveStatus: Record<
  AutosaveStatusState,
  {
    badgeVariant: "secondary" | "draft" | "success" | "invalid";
    label: string;
    message: string;
  }
> = {
  idle: {
    badgeVariant: "secondary",
    label: "Idle",
    message: "Draft is unchanged."
  },
  saving: {
    badgeVariant: "draft",
    label: "Saving",
    message: "Saving draft..."
  },
  saved: {
    badgeVariant: "success",
    label: "Saved",
    message: "Draft saved."
  },
  error: {
    badgeVariant: "invalid",
    label: "Needs attention",
    message: "Autosave could not finish. Try saving again."
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function AutosaveStatus({
  className,
  message,
  state,
  timestamp,
  ...props
}: AutosaveStatusProps) {
  const status = autosaveStatus[state];

  return (
    <div
      role="status"
      aria-live="polite"
      data-slot="autosave-status"
      data-state={state}
      className={classes(
        "inline-flex max-w-full flex-wrap items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm leading-6 shadow-paper-sm",
        className
      )}
      {...props}
    >
      <Badge variant={status.badgeVariant}>
        {state === "saving" ? (
          <span
            aria-hidden="true"
            className="size-3 rounded-full border-2 border-current/30 border-t-current motion-safe:animate-spin"
          />
        ) : null}
        <span>{status.label}</span>
      </Badge>
      <span className="text-muted-foreground">{message ?? status.message}</span>
      {timestamp ? (
        <span className="font-mono text-xs uppercase text-muted-foreground">
          {timestamp}
        </span>
      ) : null}
    </div>
  );
}

export { AutosaveStatus };
export type { AutosaveStatusProps };
