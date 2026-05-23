"use client";

import { useId, type ComponentProps, type ReactNode } from "react";

import { Badge, StateBadge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

type RightRailTabValue = "chat" | "state" | "history";
type RightRailStatus = "active" | "readOnly" | "archived";

type RightRailProps = Omit<ComponentProps<"aside">, "children" | "title"> & {
  ariaLabel?: string;
  chat: ReactNode;
  chatBadge?: ReactNode;
  defaultTab?: RightRailTabValue;
  description?: string;
  history: ReactNode;
  historyBadge?: ReactNode;
  pinnedTop: ReactNode;
  state: ReactNode;
  stateBadge?: ReactNode;
  status?: RightRailStatus;
  title: string;
};

const statusLabel: Record<RightRailStatus, string> = {
  active: "Mock rail",
  archived: "Archived",
  readOnly: "Read-only"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function RightRail({
  ariaLabel,
  chat,
  chatBadge,
  className,
  defaultTab = "chat",
  description,
  history,
  historyBadge,
  pinnedTop,
  state,
  stateBadge,
  status = "active",
  title,
  ...props
}: RightRailProps) {
  const generatedId = useId().replace(/:/g, "");
  const titleId = `right-rail-${generatedId}-title`;
  const pinnedId = `right-rail-${generatedId}-pinned`;
  const tabsLabel = `${title} lower panes`;

  return (
    <aside
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : titleId}
      data-slot="right-rail"
      data-status={status}
      className={classes(
        "flex max-h-[calc(100vh-6rem)] min-h-[44rem] w-full flex-col gap-4 overflow-hidden rounded-lg border border-border bg-surface-raised p-4 shadow-paper-md",
        status !== "active" &&
          "border-[var(--state-archived-border)] bg-[var(--state-archived-bg)]",
        className
      )}
      {...props}
    >
      <header className="flex flex-col gap-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Placeholder right rail shell
            </p>
            <h2 id={titleId} className="text-2xl font-semibold leading-tight">
              {title}
            </h2>
          </div>
          {status === "archived" ? (
            <StateBadge state="archived" />
          ) : status === "readOnly" ? (
            <StateBadge state="readOnly" />
          ) : (
            <Badge variant="secondary">{statusLabel[status]}</Badge>
          )}
        </div>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </header>

      <section
        aria-labelledby={pinnedId}
        className="min-h-0 max-h-[44%] overflow-y-auto pr-1"
      >
        <h3
          id={pinnedId}
          className="mb-3 font-mono text-xs font-semibold uppercase text-muted-foreground"
        >
          Pinned Current Turn
        </h3>
        {pinnedTop}
      </section>

      <Tabs
        activationMode="automatic"
        className="min-h-0 flex-1 gap-3 overflow-hidden"
        defaultValue={defaultTab}
      >
        <TabsList aria-label={tabsLabel} className="shrink-0">
          <TabsTrigger value="chat" badge={chatBadge}>
            Chat
          </TabsTrigger>
          <TabsTrigger value="state" badge={stateBadge}>
            State
          </TabsTrigger>
          <TabsTrigger value="history" badge={historyBadge}>
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="chat"
          className="min-h-0 flex-1 overflow-y-auto p-3"
        >
          {chat}
        </TabsContent>
        <TabsContent
          value="state"
          className="min-h-0 flex-1 overflow-y-auto p-3"
        >
          {state}
        </TabsContent>
        <TabsContent
          value="history"
          className="min-h-0 flex-1 overflow-y-auto p-3"
        >
          {history}
        </TabsContent>
      </Tabs>
    </aside>
  );
}

export { RightRail };
export type { RightRailProps, RightRailStatus, RightRailTabValue };
