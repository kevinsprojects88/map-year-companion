type EmptyStateVariant = "neutral" | "actionable" | "blocked" | "archived";

type ErrorStateVariant =
  | "validation"
  | "permission"
  | "network"
  | "conflict"
  | "unknown"
  | "destructive";

type LoadingSkeletonVariant = "card" | "row" | "panel";

type ValidationAlertVariant = "warning" | "error" | "success";

type AutosaveStatusState = "idle" | "saving" | "saved" | "error";

export type {
  AutosaveStatusState,
  EmptyStateVariant,
  ErrorStateVariant,
  LoadingSkeletonVariant,
  ValidationAlertVariant
};
