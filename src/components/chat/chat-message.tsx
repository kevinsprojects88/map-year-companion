import type { ComponentProps } from "react";

import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type {
  ChatAvatarColor,
  ChatMessageStatus,
  ChatMessageViewModel
} from "@/types/chat";

type ChatMessageProps = Omit<ComponentProps<"article">, "children"> & {
  message: ChatMessageViewModel;
};

type ChatMessageStatusDisplay = {
  bubbleClassName: string;
  label: string;
  marker: string;
  variant: BadgeVariant;
};

const avatarColorClasses: Record<ChatAvatarColor, string> = {
  clay:
    "border-[var(--state-draft-border)] bg-[var(--state-draft-surface)] text-[var(--state-draft-text)]",
  moss:
    "border-[var(--state-official-border)] bg-[var(--state-official-surface)] text-[var(--state-official-text)]",
  ochre:
    "border-[var(--state-poll-border)] bg-[var(--state-poll-surface)] text-[var(--state-poll-text)]",
  slate:
    "border-[var(--state-archived-border)] bg-[var(--state-archived-surface)] text-[var(--state-archived-text)]"
};

const statusDisplay: Record<ChatMessageStatus, ChatMessageStatusDisplay> = {
  edited: {
    bubbleClassName: "border-border bg-card",
    label: "Edited",
    marker: "EDIT",
    variant: "secondary"
  },
  failed: {
    bubbleClassName:
      "border-[var(--state-error-border)] bg-[var(--state-error-bg)]",
    label: "Failed to send",
    marker: "FAIL",
    variant: "invalid"
  },
  normal: {
    bubbleClassName: "border-border bg-card",
    label: "Sent",
    marker: "CHAT",
    variant: "secondary"
  },
  pending: {
    bubbleClassName:
      "border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-bg)]",
    label: "Pending",
    marker: "WAIT",
    variant: "draft"
  },
  readOnly: {
    bubbleClassName:
      "border-[var(--state-archived-border)] bg-[var(--state-archived-bg)]",
    label: "Read-only",
    marker: "LOCK",
    variant: "readOnly"
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ChatMessage({ className, message, ...props }: ChatMessageProps) {
  const status = statusDisplay[message.status];
  const titleId = `chat-message-${message.id}-author`;
  const bodyId = `chat-message-${message.id}-body`;
  const showStatusBadge = message.status !== "normal";

  return (
    <article
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      data-slot="chat-message"
      data-status={message.status}
      className={classes("flex items-start gap-3", className)}
      {...props}
    >
      {message.avatarInitials ? (
        <span
          aria-hidden="true"
          className={classes(
            "mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold uppercase shadow-paper-sm",
            avatarColorClasses[message.avatarColor ?? "slate"]
          )}
        >
          {message.avatarInitials}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3
            id={titleId}
            className="font-sans text-sm font-semibold leading-6 text-foreground"
          >
            {message.authorDisplayName}
          </h3>
          <span className="font-mono text-xs font-semibold uppercase leading-5 text-muted-foreground">
            {message.timestampLabel}
          </span>
          {message.linkedTurnLabel ? (
            <Badge variant="outline">{message.linkedTurnLabel}</Badge>
          ) : null}
          {showStatusBadge ? (
            <Badge variant={status.variant}>
              <span
                aria-hidden="true"
                className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
              >
                {status.marker}
              </span>
              <span>{status.label}</span>
            </Badge>
          ) : null}
        </div>

        <div
          className={classes(
            "rounded-lg border px-4 py-3 shadow-paper-sm",
            status.bubbleClassName
          )}
        >
          <p
            id={bodyId}
            className="whitespace-pre-wrap text-sm leading-6 text-foreground"
          >
            {message.body}
          </p>
          {message.status === "failed" ? (
            <p className="mt-2 text-sm font-medium leading-6 text-[var(--state-error-text)]">
              Failed message. This placeholder message was not sent.
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export { ChatMessage };
export type { ChatMessageProps };
