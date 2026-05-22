import type { ComponentProps } from "react";

import { StateBadge } from "@/components/ui/badge";

type MapReadonlyBannerProps = Omit<ComponentProps<"aside">, "children"> & {
  detail?: string;
  reason?: string;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function MapReadonlyBanner({
  className,
  detail = "You can inspect the current world, but only the active player can commit official map changes.",
  reason = "Read-only map.",
  ...props
}: MapReadonlyBannerProps) {
  return (
    <aside
      role="note"
      className={classes(
        "flex flex-col gap-3 rounded-md border border-[var(--state-archived-border)] bg-[var(--state-archived-bg)] px-4 py-3 text-[var(--state-archived-text)] sm:flex-row sm:items-start sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-6">{reason}</p>
        <p className="text-sm leading-6">{detail}</p>
      </div>
      <StateBadge state="readOnly" />
    </aside>
  );
}

export { MapReadonlyBanner };
export type { MapReadonlyBannerProps };
