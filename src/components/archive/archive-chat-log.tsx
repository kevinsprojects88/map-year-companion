import type { ComponentProps } from "react";

import { ChatMessage } from "@/components/chat/chat-message";
import { Badge, StateBadge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { ArchiveChatLogViewModel } from "@/types/archive";

type ArchiveChatLogProps = Omit<ComponentProps<"section">, "title"> & {
  chatLog: ArchiveChatLogViewModel;
};

function ArchiveChatLog({
  chatLog,
  className,
  ...props
}: ArchiveChatLogProps) {
  const titleId = `${chatLog.id}-heading`;
  const descriptionId = `${chatLog.id}-description`;
  const previewMessages = chatLog.previewMessages ?? [];

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={className}
      {...props}
    >
      <Card variant="archived">
        <CardHeader className="gap-y-3">
          <div className="col-start-1 flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <StateBadge state="readOnly" />
              <StateBadge state="archived" />
              <Badge variant="outline">Chat preserved</Badge>
              {chatLog.statusLabel ? (
                <Badge variant="archived">{chatLog.statusLabel}</Badge>
              ) : null}
            </div>
            <CardTitle id={titleId}>
              {chatLog.title ?? "Collapsed Chat Log"}
            </CardTitle>
            <CardDescription id={descriptionId}>
              {chatLog.description ??
                "Archived chat is preserved as optional context. Official history remains the primary archive record."}
            </CardDescription>
          </div>
          <CardAction>
            <div className="rounded-md border border-[var(--state-archived-border)] bg-[var(--state-archived-surface)] px-3 py-2 text-right text-[var(--state-archived-text)]">
              <p className="font-mono text-xs font-semibold uppercase leading-5">
                Hidden
              </p>
              <p className="text-sm font-semibold leading-6">
                {chatLog.messageCountLabel}
              </p>
            </div>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-[var(--state-archived-border)] bg-surface px-4 py-3">
            <p className="font-semibold leading-6 text-foreground">
              {chatLog.hiddenMessageLabel}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {chatLog.readOnlyReason ??
                "This archive chat view is read-only and collapsed in the mock demo."}
            </p>
          </div>

          {previewMessages.length ? (
            <div
              aria-label="Read-only placeholder chat preview"
              className="flex flex-col gap-4 rounded-md border border-border bg-surface px-4 py-4"
            >
              {previewMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={{ ...message, status: "readOnly" }}
                />
              ))}
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="items-start">
          <span className="font-mono text-xs uppercase">Archive note</span>
          <span>
            Chat remains conversation; official ledger entries carry the kept
            world history.
          </span>
        </CardFooter>
      </Card>
    </section>
  );
}

export { ArchiveChatLog };
export type { ArchiveChatLogProps };
