import type { ComponentProps } from "react";

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "turn"
  | "active"
  | "waiting"
  | "draft"
  | "official"
  | "poll"
  | "process"
  | "readOnly"
  | "archived"
  | "attention"
  | "success"
  | "invalid";

type BadgeState =
  | "yourTurn"
  | "activePlayer"
  | "waiting"
  | "draft"
  | "official"
  | "communityVote"
  | "processVote"
  | "readOnly"
  | "archived"
  | "needsAttention"
  | "validationPassed"
  | "invalid";

type BadgeProps = ComponentProps<"span"> & {
  variant?: BadgeVariant;
};

type StateBadgeProps = Omit<BadgeProps, "children" | "variant"> & {
  state: BadgeState;
};

const badgeVariants: Record<BadgeVariant, string> = {
  default:
    "border-border bg-secondary text-secondary-foreground [--badge-mark-border:var(--border-default)]",
  secondary:
    "border-border bg-muted text-muted-foreground [--badge-mark-border:var(--border-default)]",
  outline:
    "border-border bg-transparent text-foreground [--badge-mark-border:var(--border-default)]",
  turn:
    "border-[var(--state-official-border)] bg-[var(--state-official-surface)] text-[var(--state-official-text)] [--badge-mark-border:var(--state-official-border)]",
  active:
    "border-[var(--state-official-border)] bg-[var(--state-official-bg)] text-[var(--state-official-text)] [--badge-mark-border:var(--state-official-border)]",
  waiting:
    "border-[var(--state-archived-border)] bg-[var(--state-archived-bg)] text-[var(--state-archived-text)] [--badge-mark-border:var(--state-archived-border)]",
  draft:
    "border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-surface)] text-[var(--state-draft-text)] [--badge-mark-border:var(--state-draft-border)]",
  official:
    "border-[var(--state-official-border)] bg-[var(--state-official-surface)] text-[var(--state-official-text)] [--badge-mark-border:var(--state-official-border)]",
  poll:
    "border-[var(--state-poll-border)] bg-[var(--state-poll-surface)] text-[var(--state-poll-text)] [--badge-mark-border:var(--state-poll-border)]",
  process:
    "border-[var(--state-process-border)] bg-[var(--state-process-surface)] text-[var(--state-process-text)] [--badge-mark-border:var(--state-process-border)]",
  readOnly:
    "border-[var(--state-archived-border)] bg-[var(--state-archived-bg)] text-[var(--state-archived-text)] [--badge-mark-border:var(--state-archived-border)]",
  archived:
    "border-[var(--state-archived-border)] bg-[var(--state-archived-surface)] text-[var(--state-archived-text)] [--badge-mark-border:var(--state-archived-border)]",
  attention:
    "border-[var(--state-warning-border)] bg-[var(--state-warning-surface)] text-[var(--state-warning-text)] [--badge-mark-border:var(--state-warning-border)]",
  success:
    "border-[var(--state-success-border)] bg-[var(--state-success-surface)] text-[var(--state-success-text)] [--badge-mark-border:var(--state-success-border)]",
  invalid:
    "border-[var(--state-error-border)] bg-[var(--state-error-surface)] text-[var(--state-error-text)] [--badge-mark-border:var(--state-error-border)]"
};

const stateBadges: Record<
  BadgeState,
  { label: string; mark: string; variant: BadgeVariant }
> = {
  yourTurn: {
    label: "Your Turn",
    mark: "TURN",
    variant: "turn"
  },
  activePlayer: {
    label: "Active Player",
    mark: "ACT",
    variant: "active"
  },
  waiting: {
    label: "Waiting",
    mark: "WAIT",
    variant: "waiting"
  },
  draft: {
    label: "Draft",
    mark: "DRAFT",
    variant: "draft"
  },
  official: {
    label: "Official",
    mark: "LEDGER",
    variant: "official"
  },
  communityVote: {
    label: "Community Vote",
    mark: "ADV",
    variant: "poll"
  },
  processVote: {
    label: "Process Vote",
    mark: "PROC",
    variant: "process"
  },
  readOnly: {
    label: "Read-only",
    mark: "LOCK",
    variant: "readOnly"
  },
  archived: {
    label: "Archived",
    mark: "ARCH",
    variant: "archived"
  },
  needsAttention: {
    label: "Needs Attention",
    mark: "ATTN",
    variant: "attention"
  },
  validationPassed: {
    label: "Validation Passed",
    mark: "PASS",
    variant: "success"
  },
  invalid: {
    label: "Invalid",
    mark: "ERR",
    variant: "invalid"
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={classes(
        "inline-flex min-h-7 max-w-full items-center gap-1.5 rounded-md border px-2.5 py-1 align-middle",
        "text-xs font-semibold leading-none",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

function StateBadge({ className, state, ...props }: StateBadgeProps) {
  const badge = stateBadges[state];

  return (
    <Badge
      className={className}
      variant={badge.variant}
      data-state={state}
      {...props}
    >
      <span
        aria-hidden="true"
        className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
      >
        {badge.mark}
      </span>
      <span>{badge.label}</span>
    </Badge>
  );
}

export { Badge, StateBadge };
export type { BadgeState, BadgeVariant };
