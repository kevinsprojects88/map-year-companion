type MapShellStatus =
  | "blank"
  | "readOnly"
  | "draftVisible"
  | "archived"
  | "loading"
  | "error";

type MapRevisionStatus = "draft" | "official" | "archived";

type MapLandmarkKind = "region" | "landmark" | "route" | "note" | "resource";

type MapLandmarkStatus = "draft" | "official" | "archived";

type MapPosition = {
  x: number;
  y: number;
};

type MapRevisionLabelViewModel = {
  detail?: string;
  id: string;
  label: string;
  status: MapRevisionStatus;
  turnLabel?: string;
  updatedLabel?: string;
};

type MapLandmarkViewModel = {
  description?: string;
  id: string;
  kind?: MapLandmarkKind;
  label: string;
  position?: MapPosition;
  status?: MapLandmarkStatus;
};

type MapEmptyStateViewModel = {
  description: string;
  title: string;
};

type MapViewerViewModel = {
  description?: string;
  emptyState?: MapEmptyStateViewModel;
  errorMessage?: string;
  id: string;
  landmarks?: MapLandmarkViewModel[];
  lastUpdatedLabel?: string;
  loadingMessage?: string;
  readOnlyDetail?: string;
  readOnlyReason?: string;
  revision?: MapRevisionLabelViewModel;
  status: MapShellStatus;
  summary?: string;
  title: string;
};

export type {
  MapEmptyStateViewModel,
  MapLandmarkKind,
  MapLandmarkStatus,
  MapLandmarkViewModel,
  MapPosition,
  MapRevisionLabelViewModel,
  MapRevisionStatus,
  MapShellStatus,
  MapViewerViewModel
};
