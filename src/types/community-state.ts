type StateChangeTone = "neutral" | "official" | "draft" | "attention" | "resolved";

type StateChangeChipViewModel = {
  label: string;
  tone?: StateChangeTone;
};

type ProjectStatus = "active" | "completed" | "abandoned" | "draftChange";

type ProjectCardViewModel = {
  completedTurnLabel?: string;
  description?: string;
  id: string;
  lastChangedLabel?: string;
  locationLabel?: string;
  name: string;
  recentChange?: StateChangeChipViewModel;
  remainingWeeksLabel?: string;
  startedTurnLabel?: string;
  status: ProjectStatus;
};

type ResourceStatus =
  | "abundance"
  | "scarcity"
  | "neutral"
  | "custom"
  | "draftChange";

type ResourceCardViewModel = {
  id: string;
  lastChangedTurnLabel?: string;
  locationLabel?: string;
  name: string;
  notes?: string;
  recentChange?: StateChangeChipViewModel;
  status: ResourceStatus;
};

type DiscontentHolderType = "playerLinked" | "communityLinked";

type DiscontentStatus = "active" | "draftChange" | "resolved";

type DiscontentCardViewModel = {
  count: number;
  holderLabel: string;
  holderType: DiscontentHolderType;
  id: string;
  lastChangedLabel?: string;
  linkedTurnLabel?: string;
  reason?: string;
  recentChange?: StateChangeChipViewModel;
  status: DiscontentStatus;
};

export type {
  DiscontentCardViewModel,
  DiscontentHolderType,
  DiscontentStatus,
  ProjectCardViewModel,
  ProjectStatus,
  ResourceCardViewModel,
  ResourceStatus,
  StateChangeChipViewModel,
  StateChangeTone
};
