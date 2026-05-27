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
  indicators?: GameCardIndicators;
  lastUpdatedLabel: string;
  name: string;
  playerCountLabel: string;
  primaryActionLabel: string;
  status: GameCardStatus;
  turnLabel?: string;
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
  GameCardIndicators,
  GameCardStatus,
  GameCardViewModel
};
