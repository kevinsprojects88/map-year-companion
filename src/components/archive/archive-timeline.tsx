import type { ComponentProps } from "react";

import { Timeline } from "@/components/history/timeline";
import { Badge, StateBadge } from "@/components/ui/badge";
import type { ArchiveTimelineViewModel } from "@/types/archive";

type ArchiveTimelineProps = Omit<ComponentProps<"section">, "title"> & {
  timeline: ArchiveTimelineViewModel;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ArchiveTimeline({
  className,
  timeline,
  ...props
}: ArchiveTimelineProps) {
  const titleId = `${timeline.id}-archive-heading`;

  return (
    <section
      aria-labelledby={titleId}
      className={classes("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Official archive ledger
          </p>
          <h3 id={titleId} className="mt-1 text-2xl font-semibold leading-tight">
            {timeline.title ?? "Official Timeline"}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {timeline.description ??
              "Committed entries are presented first as official history. Chat, drafts, and informal discussion remain outside this ledger."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StateBadge state="official" />
          <StateBadge state="archived" />
          <Badge variant="outline">Committed entries only</Badge>
        </div>
      </div>

      <Timeline
        description={
          timeline.description ??
          "Display-only committed archive entries. This component does not query real events."
        }
        emptyState={timeline.emptyState}
        entries={timeline.entries}
        id={`${timeline.id}-timeline`}
        title="Committed Ledger Entries"
      />
    </section>
  );
}

export { ArchiveTimeline };
export type { ArchiveTimelineProps };
