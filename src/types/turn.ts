type TurnViewerState = "activePlayer" | "passivePlayer" | "readOnly";

type TurnStatus =
  | "active"
  | "draftSaved"
  | "needsAttention"
  | "blocked"
  | "completed";

type TurnStoryPollStatus = "none" | "open" | "closed";

type TurnChecklistStatus = "notStarted" | "current" | "complete" | "blocked";

type TurnChecklistItem = {
  description?: string;
  id: string;
  label: string;
  status: TurnChecklistStatus;
};

type TurnStoryPollSummary = {
  detail: string;
  linkLabel?: string;
  status: TurnStoryPollStatus;
};

type TurnDraftSummary = {
  body: string;
  helperText: string;
  savedAtLabel?: string;
};

type CurrentTurnPanelViewModel = {
  actionCopy: string;
  activePlayerLabel: string;
  checklist: TurnChecklistItem[];
  commitAndAdvanceLabel: string;
  disabledReason?: string;
  draft: TurnDraftSummary;
  gameName: string;
  id: string;
  passiveAvailableActions?: string[];
  promptDetail: string;
  promptLabel: string;
  saveDraftLabel: string;
  status: TurnStatus;
  storyPoll: TurnStoryPollSummary;
  turnLabel: string;
  viewerState: TurnViewerState;
};

export type {
  CurrentTurnPanelViewModel,
  TurnChecklistItem,
  TurnChecklistStatus,
  TurnDraftSummary,
  TurnStatus,
  TurnStoryPollStatus,
  TurnStoryPollSummary,
  TurnViewerState
};
