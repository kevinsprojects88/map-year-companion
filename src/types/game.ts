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

export type { GameCardIndicators, GameCardStatus, GameCardViewModel };
