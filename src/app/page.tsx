import { MapViewer } from "@/components/map/map-viewer";
import type { MapViewerViewModel } from "@/types/map";

const mapShellDemos: MapViewerViewModel[] = [
  {
    description:
      "A display-only shell for the earliest state before any placeholder marks exist.",
    emptyState: {
      description:
        "No map labels, regions, routes, or notes are shown in this mock state.",
      title: "No placeholder map marks yet"
    },
    id: "blank-map-demo",
    status: "blank",
    summary:
      "Blank placeholder map. No saved map marks are visible in this design-system demo.",
    title: "Blank Map State"
  },
  {
    description:
      "A quiet read-only map surface with settled placeholder labels and no editing affordance.",
    id: "readonly-map-demo",
    landmarks: [
      {
        description: "Settled label used only for component display.",
        id: "north-ridge",
        kind: "region",
        label: "North ridge",
        position: { x: 29, y: 36 },
        status: "official"
      },
      {
        description: "Simple route mark without path editing behavior.",
        id: "old-footpath",
        kind: "route",
        label: "Old footpath",
        position: { x: 56, y: 47 },
        status: "official"
      },
      {
        description: "Mock landmark label for map-reader contrast.",
        id: "shared-well",
        kind: "landmark",
        label: "Shared well",
        position: { x: 69, y: 66 },
        status: "official"
      }
    ],
    lastUpdatedLabel: "Updated in placeholder review",
    readOnlyDetail:
      "You can inspect the current world, but only the active player can commit official map changes.",
    readOnlyReason: "Read-only map.",
    revision: {
      detail: "Settled placeholder snapshot for display only.",
      id: "revision-readonly",
      label: "Map Revision 003",
      status: "official",
      turnLabel: "Turn placeholder",
      updatedLabel: "Mock updated label"
    },
    status: "readOnly",
    title: "Read-only Map State"
  },
  {
    description:
      "A saved draft is visible for inspection, but the map shell stays non-editable.",
    id: "draft-visible-map-demo",
    landmarks: [
      {
        description: "Provisional area label with dashed draft treatment.",
        id: "draft-garden",
        kind: "region",
        label: "Garden note",
        position: { x: 34, y: 44 },
        status: "draft"
      },
      {
        description: "Draft route label shown as saved but not official.",
        id: "draft-trail",
        kind: "route",
        label: "Possible trail",
        position: { x: 61, y: 33 },
        status: "draft"
      },
      {
        description: "Inspection-only note pin in the saved draft.",
        id: "draft-lookout",
        kind: "note",
        label: "Lookout note",
        position: { x: 75, y: 62 },
        status: "draft"
      }
    ],
    lastUpdatedLabel: "Draft saved 12 minutes ago",
    readOnlyDetail:
      "This saved draft can be inspected by passive players, but it has not become official history.",
    readOnlyReason: "Draft-visible read-only map.",
    revision: {
      detail: "Provisional snapshot visible after a mock Save Draft event.",
      id: "revision-draft-visible",
      label: "Draft Map Revision 004",
      status: "draft",
      turnLabel: "Turn placeholder",
      updatedLabel: "Saved draft label"
    },
    status: "draftVisible",
    title: "Draft-visible Map State"
  },
  {
    description:
      "A closed archive map shell with settled placeholder labels and no continued interaction.",
    id: "archived-map-demo",
    landmarks: [
      {
        description: "Archived area label retained for final review.",
        id: "archive-hill",
        kind: "region",
        label: "Hill record",
        position: { x: 27, y: 30 },
        status: "archived"
      },
      {
        description: "Archived resource label with read-only wording.",
        id: "archive-storehouse",
        kind: "resource",
        label: "Storehouse record",
        position: { x: 53, y: 58 },
        status: "archived"
      },
      {
        description: "Final route label shown without pan or zoom behavior.",
        id: "archive-crossing",
        kind: "route",
        label: "Crossing record",
        position: { x: 73, y: 42 },
        status: "archived"
      }
    ],
    lastUpdatedLabel: "Closed archive label",
    readOnlyDetail:
      "The archived map is settled for later review and cannot receive new official changes.",
    readOnlyReason: "Archived map.",
    revision: {
      detail: "Final placeholder map snapshot for archive display.",
      id: "revision-archived",
      label: "Final Map Revision",
      status: "archived",
      turnLabel: "Final turn placeholder",
      updatedLabel: "Archive close label"
    },
    status: "archived",
    title: "Archived Map State"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <section className="flex flex-col gap-3">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Phase 1M placeholder design-system demo
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">
              Map Viewer Shell Primitive
            </h1>
            <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
              This temporary page only checks mock map-viewer shell primitives,
              revision labels, read-only messaging, disabled display controls,
              and text summaries for placeholder map labels. It is not a real
              game board, map editor, canvas library choice, pan or zoom system,
              route, auth surface, Supabase integration, persistence layer,
              draft implementation, commit flow, chat surface, realtime system,
              or official map feature.
            </p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          {mapShellDemos.map((map) => (
            <MapViewer key={map.id} map={map} />
          ))}
        </section>

        <section className="rounded-lg border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          Placeholder content only. No official or proprietary game content,
          private proof-of-concept data, secrets, auth wiring, Supabase schema,
          turn persistence, commit logic, chat, realtime, map editing, pan/zoom
          behavior, map library selection, or game creation features are
          included.
        </section>
      </div>
    </main>
  );
}
