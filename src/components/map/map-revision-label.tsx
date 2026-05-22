import type { ComponentProps } from "react";

import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type {
  MapRevisionLabelViewModel,
  MapRevisionStatus
} from "@/types/map";

type MapRevisionLabelProps = Omit<ComponentProps<"div">, "children"> & {
  revision: MapRevisionLabelViewModel;
};

const revisionStatusDisplay: Record<
  MapRevisionStatus,
  { label: string; marker: string; variant: BadgeVariant }
> = {
  archived: {
    label: "Archived",
    marker: "ARCH",
    variant: "archived"
  },
  draft: {
    label: "Draft",
    marker: "DRAFT",
    variant: "draft"
  },
  official: {
    label: "Official",
    marker: "LEDGER",
    variant: "official"
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function MapRevisionLabel({
  className,
  revision,
  ...props
}: MapRevisionLabelProps) {
  const statusDisplay = revisionStatusDisplay[revision.status];
  const detailItems = [
    revision.turnLabel ? { label: "Linked turn", value: revision.turnLabel } : null,
    revision.updatedLabel
      ? { label: "Updated", value: revision.updatedLabel }
      : null,
    revision.detail ? { label: "Note", value: revision.detail } : null
  ].filter((item): item is { label: string; value: string } => item !== null);

  return (
    <div
      className={classes(
        "flex flex-col gap-3 rounded-md border border-border bg-surface px-3 py-3 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="min-w-0">
        <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
          Map revision
        </p>
        <p className="mt-1 text-sm font-semibold leading-6 text-foreground">
          {revision.label}
        </p>
        {detailItems.length ? (
          <dl className="mt-2 grid gap-1.5 text-sm leading-6 text-muted-foreground">
            {detailItems.map((item) => (
              <div key={`${item.label}-${item.value}`} className="min-w-0">
                <dt className="inline font-semibold text-foreground">
                  {item.label}:{" "}
                </dt>
                <dd className="inline">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      <Badge variant={statusDisplay.variant}>
        <span
          aria-hidden="true"
          className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
        >
          {statusDisplay.marker}
        </span>
        <span>{statusDisplay.label}</span>
      </Badge>
    </div>
  );
}

export { MapRevisionLabel };
export type { MapRevisionLabelProps };
