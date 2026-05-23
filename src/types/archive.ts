import type { ChatMessageViewModel } from "@/types/chat";
import type {
  DiscontentCardViewModel,
  ProjectCardViewModel,
  ResourceCardViewModel
} from "@/types/community-state";
import type {
  HistoryEntryCardViewModel,
  HistoryTimelineEmptyState
} from "@/types/history";
import type { MapViewerViewModel } from "@/types/map";

type ArchiveSummaryHeaderViewModel = {
  completionDateLabel: string;
  id: string;
  playerCountLabel: string;
  rememberedPhrase?: string;
  statusLabel?: string;
  summary: string;
  turnCountLabel: string;
  worldTitle: string;
};

type ArchiveFinalMapViewModel = {
  description?: string;
  finalRevisionLabel?: string;
  id: string;
  landmarksSummary?: string;
  map: MapViewerViewModel;
  statusLabel?: string;
  title: string;
};

type ArchiveTimelineViewModel = {
  description?: string;
  emptyState?: HistoryTimelineEmptyState;
  entries: HistoryEntryCardViewModel[];
  id: string;
  title?: string;
};

type ArchiveStateSummaryViewModel = {
  description?: string;
  discontent: DiscontentCardViewModel[];
  id: string;
  projects: ProjectCardViewModel[];
  resources: ResourceCardViewModel[];
  statusLabel?: string;
  title?: string;
};

type ArchiveRosterAvatarColor = "moss" | "clay" | "ochre" | "slate";

type ArchiveRosterMemberViewModel = {
  avatarColor?: ArchiveRosterAvatarColor;
  avatarInitials?: string;
  displayName: string;
  id: string;
  note?: string;
  participationLabel: string;
  turnsTakenLabel?: string;
};

type ArchiveRosterViewModel = {
  description?: string;
  id: string;
  members: ArchiveRosterMemberViewModel[];
  summaryLabel?: string;
  title?: string;
};

type ArchiveChatLogViewModel = {
  description?: string;
  hiddenMessageLabel: string;
  id: string;
  messageCountLabel: string;
  previewMessages?: ChatMessageViewModel[];
  readOnlyReason?: string;
  statusLabel?: string;
  title?: string;
};

export type {
  ArchiveChatLogViewModel,
  ArchiveFinalMapViewModel,
  ArchiveRosterAvatarColor,
  ArchiveRosterMemberViewModel,
  ArchiveRosterViewModel,
  ArchiveStateSummaryViewModel,
  ArchiveSummaryHeaderViewModel,
  ArchiveTimelineViewModel
};
