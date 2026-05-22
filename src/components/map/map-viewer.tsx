import type { ComponentProps, CSSProperties } from "react";

import { MapReadonlyBanner } from "@/components/map/map-readonly-banner";
import { MapRevisionLabel } from "@/components/map/map-revision-label";
import { Badge, StateBadge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  MapLandmarkKind,
  MapLandmarkStatus,
  MapLandmarkViewModel,
  MapShellStatus,
  MapViewerViewModel
} from "@/types/map";

type MapViewerProps = Omit<ComponentProps<"section">, "title"> & {
  map: MapViewerViewModel;
  showPlaceholderControls?: boolean;
};

type StatusDisplay = {
  badge?: "readOnly" | "draft" | "archived";
  label: string;
  marker: string;
  shellClass: string;
  variant: BadgeVariant;
};

const statusDisplay: Record<MapShellStatus, StatusDisplay> = {
  archived: {
    badge: "archived",
    label: "Archived",
    marker: "ARCH",
    shellClass:
      "border-[var(--state-archived-border)] bg-[var(--state-archived-bg)]",
    variant: "archived"
  },
  blank: {
    label: "Blank map",
    marker: "BLANK",
    shellClass: "border-border bg-card",
    variant: "secondary"
  },
  draftVisible: {
    badge: "draft",
    label: "Draft visible",
    marker: "DRAFT",
    shellClass:
      "border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-bg)]",
    variant: "draft"
  },
  error: {
    label: "Map unavailable",
    marker: "ERR",
    shellClass:
      "border-[var(--state-error-border)] bg-[var(--state-error-bg)]",
    variant: "invalid"
  },
  loading: {
    label: "Loading map",
    marker: "LOAD",
    shellClass: "border-border bg-card",
    variant: "secondary"
  },
  readOnly: {
    badge: "readOnly",
    label: "Read-only",
    marker: "LOCK",
    shellClass:
      "border-[var(--state-archived-border)] bg-[var(--state-archived-bg)]",
    variant: "readOnly"
  }
};

const landmarkKindLabels: Record<MapLandmarkKind, string> = {
  landmark: "Landmark",
  note: "Note",
  region: "Region",
  resource: "Resource",
  route: "Route"
};

const landmarkKindMarkers: Record<MapLandmarkKind, string> = {
  landmark: "LAND",
  note: "NOTE",
  region: "AREA",
  resource: "RES",
  route: "PATH"
};

const landmarkStatusClasses: Record<MapLandmarkStatus, string> = {
  archived:
    "border-[var(--state-archived-border)] bg-[var(--state-archived-surface)] text-[var(--state-archived-text)]",
  draft:
    "border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-surface)] text-[var(--state-draft-text)]",
  official:
    "border-[var(--state-official-border)] bg-[var(--state-official-surface)] text-[var(--state-official-text)]"
};

const fallbackPositions = [
  { x: 25, y: 28 },
  { x: 61, y: 31 },
  { x: 43, y: 55 },
  { x: 72, y: 67 },
  { x: 30, y: 72 }
];

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getLandmarkSummary(landmarks: MapLandmarkViewModel[]) {
  if (!landmarks.length) {
    return "No visible placeholder map marks are shown.";
  }

  return `Visible placeholder map marks: ${landmarks
    .map((landmark) => {
      const kind = landmarkKindLabels[landmark.kind ?? "landmark"];
      return `${kind} ${landmark.label}`;
    })
    .join("; ")}.`;
}

function MapStatusBadge({ status }: { status: MapShellStatus }) {
  const display = statusDisplay[status];

  if (display.badge === "readOnly") {
    return <StateBadge state="readOnly" />;
  }

  if (display.badge === "draft") {
    return <StateBadge state="draft" />;
  }

  if (display.badge === "archived") {
    return <StateBadge state="archived" />;
  }

  return (
    <Badge variant={display.variant}>
      <span
        aria-hidden="true"
        className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
      >
        {display.marker}
      </span>
      <span>{display.label}</span>
    </Badge>
  );
}

function PlaceholderControls({ mapId }: { mapId: string }) {
  const descriptionId = `${mapId}-disabled-controls-note`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="outline">
        <span
          aria-hidden="true"
          className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
        >
          DEMO
        </span>
        <span>Display-only controls</span>
      </Badge>
      <div
        role="group"
        aria-describedby={descriptionId}
        aria-label="Disabled placeholder map controls"
        className="flex flex-wrap gap-2"
      >
        {["Fit", "Zoom reset", "Full screen", "Inspect labels"].map(
          (label) => (
            <Button
              key={label}
              aria-describedby={descriptionId}
              disabled
              size="sm"
              variant="secondary"
            >
              {label}
            </Button>
          )
        )}
      </div>
      <span id={descriptionId} className="sr-only">
        These map controls are disabled placeholders in the design-system shell.
      </span>
    </div>
  );
}

function MapSurfaceMarks({ landmarks }: { landmarks: MapLandmarkViewModel[] }) {
  return (
    <>
      {landmarks.map((landmark, index) => {
        const position = landmark.position ?? fallbackPositions[index % fallbackPositions.length];
        const kind = landmark.kind ?? "landmark";
        const markerStyle = {
          left: `${position.x}%`,
          top: `${position.y}%`
        } satisfies CSSProperties;

        return (
          <div
            key={landmark.id}
            className={classes(
              "absolute z-10 flex min-w-28 max-w-44 -translate-x-1/2 -translate-y-1/2 flex-col gap-1 rounded-md border px-2.5 py-2 text-xs shadow-paper-sm sm:text-sm",
              landmarkStatusClasses[landmark.status ?? "official"]
            )}
            style={markerStyle}
          >
            <span className="font-mono text-[0.65rem] font-semibold uppercase leading-none">
              {landmarkKindMarkers[kind]}
            </span>
            <span className="font-semibold leading-5">{landmark.label}</span>
          </div>
        );
      })}
    </>
  );
}

function MapSurfaceContent({ map }: { map: MapViewerViewModel }) {
  const landmarks = map.landmarks ?? [];

  if (map.status === "loading") {
    return (
      <div className="relative z-10 flex min-h-72 items-center justify-center p-6 text-center text-sm font-semibold leading-6 text-muted-foreground">
        {map.loadingMessage ?? "Loading placeholder map surface."}
      </div>
    );
  }

  if (map.status === "error") {
    return (
      <div className="relative z-10 flex min-h-72 items-center justify-center p-6 text-center text-sm font-semibold leading-6 text-[var(--state-error-text)]">
        {map.errorMessage ??
          "The placeholder map surface could not be displayed."}
      </div>
    );
  }

  if (map.status === "blank") {
    return (
      <div className="relative z-10 flex min-h-72 items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <p className="text-lg font-semibold leading-7 text-foreground">
            {map.emptyState?.title ?? "Blank map placeholder"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {map.emptyState?.description ??
              "No saved map marks are shown in this display-only shell."}
          </p>
        </div>
      </div>
    );
  }

  return <MapSurfaceMarks landmarks={landmarks} />;
}

function MapViewer({
  className,
  map,
  showPlaceholderControls = true,
  ...props
}: MapViewerProps) {
  const display = statusDisplay[map.status];
  const titleId = `${map.id}-title`;
  const summaryId = `${map.id}-summary`;
  const landmarkListId = `${map.id}-landmark-list`;
  const landmarks = map.landmarks ?? [];
  const landmarkSummary = map.summary ?? getLandmarkSummary(landmarks);
  const ariaDescription =
    landmarks.length > 0
      ? `${summaryId} ${landmarkListId}`
      : summaryId;
  const showReadonlyBanner =
    map.status === "readOnly" ||
    map.status === "draftVisible" ||
    map.status === "archived";

  return (
    <section
      aria-describedby={ariaDescription}
      aria-labelledby={titleId}
      className={classes(
        "flex flex-col gap-4 rounded-lg border p-5 shadow-paper-sm",
        display.shellClass,
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Placeholder map shell
          </p>
          <h2 id={titleId} className="mt-1 text-2xl font-semibold leading-tight">
            {map.title}
          </h2>
          {map.description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {map.description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <MapStatusBadge status={map.status} />
          {map.lastUpdatedLabel ? (
            <Badge variant="outline">
              <span
                aria-hidden="true"
                className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
              >
                TIME
              </span>
              <span>{map.lastUpdatedLabel}</span>
            </Badge>
          ) : null}
        </div>
      </div>

      {map.revision ? <MapRevisionLabel revision={map.revision} /> : null}

      {showReadonlyBanner ? (
        <MapReadonlyBanner
          detail={map.readOnlyDetail}
          reason={map.readOnlyReason}
        />
      ) : null}

      <div
        role="img"
        aria-label={`${map.title}. ${display.label}. ${landmarkSummary}`}
        className="relative min-h-72 overflow-hidden rounded-md border border-[var(--border-strong)] bg-canvas shadow-inner"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, color-mix(in srgb, var(--border-subtle) 34%, transparent) 1px, transparent 1px), linear-gradient(180deg, color-mix(in srgb, var(--border-subtle) 28%, transparent) 1px, transparent 1px)",
            backgroundSize: "56px 56px"
          }}
        />
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-80"
          focusable="false"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M11 68 C22 55, 31 58, 41 46 S67 31, 88 23"
            fill="none"
            stroke="var(--state-official-border)"
            strokeLinecap="round"
            strokeWidth="1.1"
          />
          <path
            d="M18 26 C31 18, 39 22, 48 34 S64 48, 79 45"
            fill="none"
            stroke="var(--state-draft-border)"
            strokeDasharray="3 3"
            strokeLinecap="round"
            strokeWidth="0.9"
          />
          <path
            d="M23 76 C34 70, 50 75, 60 66 S77 57, 86 69"
            fill="none"
            stroke="var(--state-archived-border)"
            strokeLinecap="round"
            strokeWidth="0.8"
          />
          <ellipse
            cx="34"
            cy="39"
            fill="var(--state-official-surface)"
            opacity="0.72"
            rx="13"
            ry="8"
            stroke="var(--state-official-border)"
            strokeWidth="0.5"
          />
          <ellipse
            cx="67"
            cy="62"
            fill="var(--state-draft-surface)"
            opacity="0.68"
            rx="15"
            ry="9"
            stroke="var(--state-draft-border)"
            strokeDasharray="2 2"
            strokeWidth="0.5"
          />
        </svg>

        <MapSurfaceContent map={map} />
      </div>

      <p
        id={summaryId}
        className="rounded-md border border-border bg-surface px-3 py-2 text-sm leading-6 text-muted-foreground"
      >
        {landmarkSummary}
      </p>

      {landmarks.length ? (
        <div
          id={landmarkListId}
          className="rounded-md border border-border bg-surface px-3 py-3"
        >
          <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
            Visible labels
          </p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {landmarks.map((landmark) => {
              const kind = landmarkKindLabels[landmark.kind ?? "landmark"];

              return (
                <li key={landmark.id} className="text-sm leading-6">
                  <span className="font-semibold text-foreground">
                    {landmark.label}
                  </span>
                  <span className="text-muted-foreground"> - {kind}</span>
                  {landmark.description ? (
                    <span className="text-muted-foreground">
                      {" "}
                      - {landmark.description}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {showPlaceholderControls ? <PlaceholderControls mapId={map.id} /> : null}
    </section>
  );
}

export { MapViewer };
export type { MapViewerProps };
