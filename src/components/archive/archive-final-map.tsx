import type { ComponentProps } from "react";

import { MapViewer } from "@/components/map/map-viewer";
import { Badge, StateBadge } from "@/components/ui/badge";
import type { ArchiveFinalMapViewModel } from "@/types/archive";

type ArchiveFinalMapProps = Omit<ComponentProps<"section">, "title"> & {
  finalMap: ArchiveFinalMapViewModel;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ArchiveFinalMap({
  className,
  finalMap,
  ...props
}: ArchiveFinalMapProps) {
  const titleId = `${finalMap.id}-heading`;
  const summary = finalMap.landmarksSummary ?? finalMap.map.summary;
  const map = summary ? { ...finalMap.map, summary } : finalMap.map;

  return (
    <section
      aria-labelledby={titleId}
      className={classes("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Final map artifact
          </p>
          <h3 id={titleId} className="mt-1 text-2xl font-semibold leading-tight">
            {finalMap.title}
          </h3>
          {finalMap.description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {finalMap.description}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StateBadge state="archived" />
          <StateBadge state="readOnly" />
          {finalMap.statusLabel ? (
            <Badge variant="archived">{finalMap.statusLabel}</Badge>
          ) : null}
          {finalMap.finalRevisionLabel ? (
            <Badge variant="outline">{finalMap.finalRevisionLabel}</Badge>
          ) : null}
        </div>
      </div>

      <MapViewer map={map} showPlaceholderControls={false} />
    </section>
  );
}

export { ArchiveFinalMap };
export type { ArchiveFinalMapProps };
