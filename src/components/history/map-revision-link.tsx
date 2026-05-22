import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import type { MapRevisionLinkViewModel } from "@/types/history";

type MapRevisionLinkProps = Omit<ComponentProps<"div">, "title"> & {
  actionLabel?: string;
  revision: MapRevisionLinkViewModel;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function MapRevisionLink({
  actionLabel,
  className,
  revision,
  ...props
}: MapRevisionLinkProps) {
  const visibleActionLabel =
    actionLabel ?? revision.actionLabel ?? "View on map";

  return (
    <div
      className={classes(
        "flex flex-col gap-3 rounded-md border border-[var(--state-official-border)] bg-surface p-3 sm:flex-row sm:items-center sm:justify-between",
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
        {revision.detail ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {revision.detail}
          </p>
        ) : null}
      </div>

      {revision.href ? (
        <a
          className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-md border border-[var(--state-official-border)] bg-[var(--state-official-accent)] px-3 py-2 text-sm font-semibold leading-none text-[var(--text-inverse)] transition-colors duration-150 hover:bg-[var(--moss-800)]"
          href={revision.href}
        >
          {visibleActionLabel}
        </a>
      ) : (
        <Badge variant="readOnly">
          <span
            aria-hidden="true"
            className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
          >
            MAP
          </span>
          <span>{revision.readOnlyLabel ?? "Map reference"}</span>
        </Badge>
      )}
    </div>
  );
}

export { MapRevisionLink };
export type { MapRevisionLinkProps };
