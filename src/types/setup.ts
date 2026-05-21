type SetupChecklistStatus =
  | "complete"
  | "incomplete"
  | "warning"
  | "blocked"
  | "optional";

type SetupChecklistRequirement = "required" | "optional";

type SetupChecklistItem = {
  actionLabel: string;
  description: string;
  requirement: SetupChecklistRequirement;
  status: SetupChecklistStatus;
  title: string;
  validationMessages?: string[];
};

export type {
  SetupChecklistItem,
  SetupChecklistRequirement,
  SetupChecklistStatus
};
