import type { ComponentProps } from "react";

import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type { SystemMessageType, SystemMessageViewModel } from "@/types/chat";

type SystemMessageProps = Omit<ComponentProps<"article">, "children"> & {
  message: SystemMessageViewModel;
};

type SystemMessageTypeDisplay = {
  className: string;
  label: string;
  marker: string;
  variant: BadgeVariant;
};

const systemMessageTypes: Record<
  SystemMessageType,
  SystemMessageTypeDisplay
> = {
  info: {
    className: "border-border bg-surface text-muted-foreground",
    label: "System note",
    marker: "INFO",
    variant: "secondary"
  },
  process: {
    className:
      "border-[var(--state-process-border)] bg-[var(--state-process-bg)] text-[var(--state-process-text)]",
    label: "Process note",
    marker: "PROC",
    variant: "process"
  },
  stateChange: {
    className:
      "border-[var(--state-draft-border)] bg-[var(--state-draft-bg)] text-[var(--state-draft-text)]",
    label: "State note",
    marker: "STATE",
    variant: "draft"
  },
  warning: {
    className:
      "border-[var(--state-warning-border)] bg-[var(--state-warning-bg)] text-[var(--state-warning-text)]",
    label: "Warning",
    marker: "WARN",
    variant: "attention"
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SystemMessage({ className, message, ...props }: SystemMessageProps) {
  const display = systemMessageTypes[message.type];
  const bodyId = `system-message-${message.id}-body`;

  return (
    <article
      aria-describedby={bodyId}
      data-slot="system-message"
      data-type={message.type}
      className={classes(
        "rounded-lg border px-4 py-3 shadow-paper-sm",
        display.className,
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={display.variant}>
          <span
            aria-hidden="true"
            className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
          >
            {display.marker}
          </span>
          <span>{display.label}</span>
        </Badge>
        <span className="font-mono text-xs font-semibold uppercase leading-5 text-current/80">
          {message.timestampLabel}
        </span>
        {message.linkedObjectLabel ? (
          <Badge variant="outline">{message.linkedObjectLabel}</Badge>
        ) : null}
      </div>
      <p id={bodyId} className="mt-2 text-sm font-medium leading-6">
        {message.body}
      </p>
    </article>
  );
}

export { SystemMessage };
export type { SystemMessageProps };
