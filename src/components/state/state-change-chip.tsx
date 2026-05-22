import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type {
  StateChangeChipViewModel,
  StateChangeTone
} from "@/types/community-state";

type StateChangeChipProps = {
  change: StateChangeChipViewModel;
};

const stateChangeToneDisplay: Record<
  StateChangeTone,
  { marker: string; variant: BadgeVariant }
> = {
  attention: {
    marker: "NOTE",
    variant: "attention"
  },
  draft: {
    marker: "DRAFT",
    variant: "draft"
  },
  neutral: {
    marker: "REC",
    variant: "secondary"
  },
  official: {
    marker: "LEDGER",
    variant: "official"
  },
  resolved: {
    marker: "DONE",
    variant: "success"
  }
};

function StateChangeChip({ change }: StateChangeChipProps) {
  const display = stateChangeToneDisplay[change.tone ?? "neutral"];

  return (
    <Badge variant={display.variant}>
      <span
        aria-hidden="true"
        className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
      >
        {display.marker}
      </span>
      <span>{change.label}</span>
    </Badge>
  );
}

export { StateChangeChip };
export type { StateChangeChipProps };
