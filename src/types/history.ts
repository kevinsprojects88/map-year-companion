import type { StateChangeChipViewModel } from "@/types/community-state";

type HistoryEntryEventType =
  | "turnOutcome"
  | "mapRevision"
  | "projectChange"
  | "resourceChange"
  | "discontentChange"
  | "gameStarted"
  | "gameCompleted";

type HistoryEntryDetail = {
  label: string;
  value: string;
};

type HistoryStateChangeViewModel = StateChangeChipViewModel & {
  summary?: string;
};

type MapRevisionLinkViewModel = {
  actionLabel?: string;
  detail?: string;
  href?: string;
  id: string;
  label: string;
  readOnlyLabel?: string;
};

type HistoryEntryCardViewModel = {
  actionLabel?: string;
  activePlayerLabel?: string;
  committedAtLabel: string;
  committedByLabel: string;
  detailItems?: HistoryEntryDetail[];
  eventType: HistoryEntryEventType;
  id: string;
  mapRevision?: MapRevisionLinkViewModel;
  outcomeSummary: string;
  stateChange?: HistoryStateChangeViewModel;
  statusLabel?: string;
  title: string;
  turnLabel?: string;
  weekLabel?: string;
};

type HistoryTimelineEmptyState = {
  description: string;
  title: string;
};

export type {
  HistoryEntryCardViewModel,
  HistoryEntryDetail,
  HistoryEntryEventType,
  HistoryStateChangeViewModel,
  HistoryTimelineEmptyState,
  MapRevisionLinkViewModel
};
