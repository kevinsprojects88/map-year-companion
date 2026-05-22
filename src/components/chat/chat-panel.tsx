import type { ComponentProps, ReactNode } from "react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Badge } from "@/components/ui/badge";

type ChatPanelEmptyState = {
  description: string;
  title: string;
};

type ChatPanelProps = Omit<ComponentProps<"section">, "children" | "title"> & {
  composer?: ReactNode;
  description?: string;
  emptyState?: ChatPanelEmptyState;
  messages?: ReactNode[];
  title: string;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ChatPanel({
  className,
  composer,
  description,
  emptyState,
  messages = [],
  title,
  ...props
}: ChatPanelProps) {
  const titleId = `chat-panel-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const hasMessages = messages.length > 0;

  return (
    <section
      aria-labelledby={titleId}
      data-slot="chat-panel"
      className={classes(
        "flex flex-col gap-5 rounded-lg border border-border bg-card p-5 shadow-paper-sm",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h2 id={titleId} className="text-2xl font-semibold leading-tight">
            {title}
          </h2>
          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <Badge variant="secondary">Mock chat</Badge>
      </div>

      <div className="flex flex-col gap-4">
        {hasMessages ? (
          messages
        ) : (
          <EmptyState
            description={
              emptyState?.description ??
              "No placeholder discussion messages are shown in this mock state."
            }
            title={emptyState?.title ?? "No placeholder messages yet"}
            variant="neutral"
          />
        )}
      </div>

      {composer ? <div>{composer}</div> : null}
    </section>
  );
}

export { ChatPanel };
export type { ChatPanelEmptyState, ChatPanelProps };
