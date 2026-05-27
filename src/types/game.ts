type GameCardStatus =
  | "yourTurn"
  | "active"
  | "waitingToStart"
  | "completed"
  | "archived"
  | "needsAttention";

type GameCardIndicators = {
  hasActiveStoryPoll?: boolean;
  hasDraft?: boolean;
  hasProcessVote?: boolean;
  needsAttention?: boolean;
};

type GameCardViewModel = {
  activePlayerLabel?: string;
  id: string;
  indicators?: GameCardIndicators;
  lastUpdatedLabel: string;
  membershipRoleLabel?: string;
  name: string;
  playerCountLabel?: string;
  primaryActionHref?: string;
  primaryActionLabel: string;
  status: GameCardStatus;
  turnLabel?: string;
};

type DashboardGameGroupKey =
  | "yourTurn"
  | "active"
  | "waitingToStart"
  | "completed";

type DashboardGameViewModel = GameCardViewModel & {
  group: DashboardGameGroupKey;
};

type CreateGameActionState = {
  fieldErrors: {
    description?: string;
    name?: string;
  };
  formError: string | null;
  gameId: string | null;
  status: "idle" | "error" | "success";
  values: {
    description: string;
    name: string;
  };
};

export type {
  CreateGameActionState,
  DashboardGameGroupKey,
  DashboardGameViewModel,
  GameCardIndicators,
  GameCardStatus,
  GameCardViewModel
};
