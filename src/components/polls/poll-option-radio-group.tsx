import type { ComponentProps, CSSProperties } from "react";

import type { StoryPollOption } from "@/types/poll";

type PollOptionRadioGroupProps = Omit<ComponentProps<"fieldset">, "children"> & {
  disabled?: boolean;
  legend: string;
  name: string;
  options: StoryPollOption[];
  selectedOptionId?: string;
  showResults?: boolean;
  totalVotes: number;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getVoteLabel(count: number) {
  return `${count} ${count === 1 ? "vote" : "votes"}`;
}

function getVoteShare(voteCount: number, totalVotes: number) {
  if (totalVotes <= 0) {
    return 0;
  }

  return Math.round((voteCount / totalVotes) * 100);
}

function PollOptionRadioGroup({
  className,
  disabled = false,
  legend,
  name,
  options,
  selectedOptionId,
  showResults = true,
  totalVotes,
  ...props
}: PollOptionRadioGroupProps) {
  return (
    <fieldset
      className={classes("flex min-w-0 flex-col gap-2", className)}
      disabled={disabled}
      {...props}
    >
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => {
        const checked = option.id === selectedOptionId;
        const voteShare = getVoteShare(option.voteCount, totalVotes);
        const resultStyle = {
          width: `${voteShare}%`
        } as CSSProperties;

        return (
          <label
            key={option.id}
            data-selected={checked || undefined}
            className={classes(
              "grid min-h-16 cursor-pointer grid-cols-[auto_1fr] gap-x-3 gap-y-2 rounded-md border bg-surface px-3 py-3",
              "transition-colors duration-150",
              "hover:border-[var(--state-poll-border)] hover:bg-[var(--state-poll-bg)]",
              "data-[selected=true]:border-[var(--state-poll-border)] data-[selected=true]:bg-[var(--state-poll-surface)]",
              disabled && "cursor-default opacity-85"
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              defaultChecked={checked}
              className="mt-1 size-4 accent-[var(--state-poll-accent)]"
            />
            <span className="flex min-w-0 flex-col gap-2">
              <span className="font-semibold leading-6 text-foreground">
                {option.label}
              </span>
              {showResults ? (
                <span className="grid gap-1.5">
                  <span className="h-2 overflow-hidden rounded-full border border-[var(--state-poll-border)] bg-[var(--state-poll-bg)]">
                    <span
                      aria-hidden="true"
                      className="block h-full rounded-full bg-[var(--state-poll-accent)]"
                      style={resultStyle}
                    />
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                    {getVoteLabel(option.voteCount)} / {voteShare}%
                  </span>
                </span>
              ) : null}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

export { PollOptionRadioGroup };
export type { PollOptionRadioGroupProps };
