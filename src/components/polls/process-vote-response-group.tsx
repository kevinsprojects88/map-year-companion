"use client";

import { useId, useState, type ComponentProps } from "react";

import { SegmentedControl } from "@/components/ui/segmented-control";
import type {
  ProcessVoteResponse,
  ProcessVoteResponseValue
} from "@/types/process-vote";

type ProcessVoteResponseGroupProps = Omit<ComponentProps<"div">, "children"> & {
  disabled?: boolean;
  legend: string;
  name?: string;
  responses: ProcessVoteResponse[];
};

const responseOrder: ProcessVoteResponseValue[] = ["yes", "no", "abstain"];

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getInitialValue(responses: ProcessVoteResponse[]) {
  return (
    responses.find((response) => response.currentUserSelected)?.value ??
    responses[0]?.value ??
    "abstain"
  );
}

function isProcessVoteResponseValue(
  value: string
): value is ProcessVoteResponseValue {
  return responseOrder.includes(value as ProcessVoteResponseValue);
}

function getResponseCountLabel(count: number) {
  return `${count} ${count === 1 ? "response" : "responses"}`;
}

function ProcessVoteResponseGroup({
  className,
  disabled = false,
  legend,
  name,
  responses,
  ...props
}: ProcessVoteResponseGroupProps) {
  const generatedId = useId();
  const [selectedValue, setSelectedValue] = useState(getInitialValue(responses));
  const sortedResponses = [...responses].sort(
    (a, b) => responseOrder.indexOf(a.value) - responseOrder.indexOf(b.value)
  );

  return (
    <div
      className={classes("flex min-w-0 flex-col gap-2", className)}
      {...props}
    >
      <SegmentedControl
        aria-label={legend}
        className="w-fit max-w-full border-[var(--state-process-border)] bg-[var(--state-process-bg)]"
        name={name ?? `process-vote-${generatedId.replace(/:/g, "")}`}
        onValueChange={(nextValue) => {
          if (isProcessVoteResponseValue(nextValue)) {
            setSelectedValue(nextValue);
          }
        }}
        options={sortedResponses.map((response) => ({
          badge: getResponseCountLabel(response.count),
          disabled,
          label: response.label,
          value: response.value
        }))}
        size="sm"
        value={selectedValue}
      />
      <p className="text-sm leading-6 text-muted-foreground">
        Local demo control only. Selecting {selectedValue} does not submit a
        vote or reassign anyone.
      </p>
    </div>
  );
}

export { ProcessVoteResponseGroup };
export type { ProcessVoteResponseGroupProps };
