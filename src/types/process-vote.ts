type ProcessVoteStatus =
  | "open"
  | "passed"
  | "failed"
  | "cancelled"
  | "confirmationNeeded"
  | "readOnly";

type ProcessVoteType = "reassignStuckTurn";

type ProcessVoteResponseValue = "yes" | "no" | "abstain";

type ProcessVoteResponse = {
  count: number;
  currentUserSelected?: boolean;
  label: string;
  value: ProcessVoteResponseValue;
};

type ProcessVoteViewModel = {
  confirmationCopy: string;
  createdAtLabel: string;
  currentActivePlayerLabel: string;
  id: string;
  initiatedByLabel: string;
  primaryActionLabel?: string;
  proposedReplacementPlayerLabel: string;
  reason: string;
  responses: ProcessVoteResponse[];
  resultCopy: string;
  status: ProcessVoteStatus;
  statusDetail: string;
  thresholdCopy: string;
  title: string;
  totalResponses: number;
  type: ProcessVoteType;
};

export type {
  ProcessVoteResponse,
  ProcessVoteResponseValue,
  ProcessVoteStatus,
  ProcessVoteType,
  ProcessVoteViewModel
};
