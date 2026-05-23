import type { ComponentProps } from "react";

import { CommunityStatePanel } from "@/components/state/community-state-panel";
import { Badge, StateBadge } from "@/components/ui/badge";
import type { ArchiveStateSummaryViewModel } from "@/types/archive";

type ArchiveStateSummaryProps = Omit<ComponentProps<"section">, "title"> & {
  state: ArchiveStateSummaryViewModel;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ArchiveStateSummary({
  className,
  state,
  ...props
}: ArchiveStateSummaryProps) {
  const titleId = `${state.id}-heading`;
  const totalRecords =
    state.projects.length + state.resources.length + state.discontent.length;

  return (
    <section
      aria-labelledby={titleId}
      className={classes("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Final community state
          </p>
          <h3 id={titleId} className="mt-1 text-2xl font-semibold leading-tight">
            {state.title ?? "Final State Summary"}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {state.description ??
              "Display-only final projects, resources, and discontent records for the archived world."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StateBadge state="archived" />
          <Badge variant="outline">{`${totalRecords} placeholder records`}</Badge>
          {state.statusLabel ? (
            <Badge variant="archived">{state.statusLabel}</Badge>
          ) : null}
        </div>
      </div>

      <CommunityStatePanel
        description={
          state.description ??
          "Archived display-only grouping for final projects, resources, and discontent."
        }
        discontent={state.discontent}
        projects={state.projects}
        resources={state.resources}
        title={state.title ?? "Final State Summary"}
      />
    </section>
  );
}

export { ArchiveStateSummary };
export type { ArchiveStateSummaryProps };
