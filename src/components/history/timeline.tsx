import type { ComponentProps } from "react";

import { EmptyState } from "@/components/feedback/empty-state";
import { HistoryEntryCard } from "@/components/history/history-entry-card";
import type {
  HistoryEntryCardViewModel,
  HistoryTimelineEmptyState
} from "@/types/history";

type TimelineVariant = "default" | "compact";

type TimelineProps = Omit<ComponentProps<"section">, "title"> & {
  description?: string;
  emptyState?: HistoryTimelineEmptyState;
  entries: HistoryEntryCardViewModel[];
  title?: string;
  variant?: TimelineVariant;
};

const timelineVariantClasses: Record<TimelineVariant, string> = {
  compact: "gap-4",
  default: "gap-6"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Timeline({
  className,
  description = "Display-only official ledger entries shown in chronological order.",
  emptyState = {
    description:
      "Committed entries will appear here after official history exists. Drafts, chat, Story Polls, and Process Votes stay separate.",
    title: "No official history entries yet"
  },
  entries,
  id,
  title = "Official History Timeline",
  variant = "default",
  ...props
}: TimelineProps) {
  const titleId = id ? `${id}-heading` : "official-history-timeline-heading";

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={classes(
        "flex flex-col",
        timelineVariantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
          Display-only official ledger
        </p>
        <h2 id={titleId} className="text-2xl font-semibold">
          {title}
        </h2>
        <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      {entries.length ? (
        <ol
          aria-label="Official history entries in chronological display order"
          className="flex flex-col gap-5"
        >
          {entries.map((entry, index) => (
            <li
              key={entry.id}
              className="grid grid-cols-[1.25rem_1fr] gap-3"
            >
              <div
                aria-hidden="true"
                className="flex min-h-full flex-col items-center pt-7"
              >
                <span className="size-2.5 rounded-full border border-[var(--state-official-border)] bg-[var(--state-official-accent)]" />
                <span
                  className={classes(
                    "mt-2 w-px flex-1 bg-[var(--state-official-border)]",
                    index === entries.length - 1 && "hidden"
                  )}
                />
              </div>
              <HistoryEntryCard entry={entry} />
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState
          description={emptyState.description}
          title={emptyState.title}
          variant="archived"
        />
      )}
    </section>
  );
}

export { Timeline };
export type { TimelineProps, TimelineVariant };
