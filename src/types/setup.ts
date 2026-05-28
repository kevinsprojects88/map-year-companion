type SetupChecklistStatus =
  | "complete"
  | "incomplete"
  | "warning"
  | "blocked"
  | "optional";

type SetupChecklistRequirement = "required" | "optional";

type SetupReadinessCategory =
  | "complete"
  | "incomplete"
  | "blocked"
  | "future";

type SetupChecklistItem = {
  actionDisabledReason?: string;
  actionHref?: string;
  actionLabel: string;
  description: string;
  readinessCategory: SetupReadinessCategory;
  requirement: SetupChecklistRequirement;
  status: SetupChecklistStatus;
  statusLabel?: string;
  title: string;
  validationMessages?: string[];
};

type SetupReadinessSummary = {
  blockedAreaLabels: string[];
  futureAreaLabels: string[];
  needsAttentionAreaLabels: string[];
  readyAreaLabels: string[];
  readyCount: number;
  roleDescription: string;
  summaryLabel: string;
  totalCount: number;
};

export type {
  SetupChecklistItem,
  SetupChecklistRequirement,
  SetupChecklistStatus,
  SetupReadinessCategory,
  SetupReadinessSummary
};
