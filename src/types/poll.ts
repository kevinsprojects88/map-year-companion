type StoryPollStatus = "open" | "voted" | "closed" | "readOnly";

type StoryPollOption = {
  id: string;
  label: string;
  voteCount: number;
};

type StoryPollViewModel = {
  createdAtLabel: string;
  createdByLabel: string;
  currentUserVoteOptionId?: string;
  description?: string;
  id: string;
  options: StoryPollOption[];
  question: string;
  status: StoryPollStatus;
  statusDetail: string;
  totalVotes: number;
};

export type { StoryPollOption, StoryPollStatus, StoryPollViewModel };
