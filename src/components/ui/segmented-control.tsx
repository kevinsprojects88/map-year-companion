"use client";

import {
  useCallback,
  useId,
  useState,
  type ComponentProps,
  type ReactNode
} from "react";

type SegmentedControlOption = {
  badge?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  label: ReactNode;
  value: string;
};

type SegmentedControlSize = "sm" | "default";

type SegmentedControlProps = Omit<ComponentProps<"div">, "onChange"> & {
  defaultValue?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  options: SegmentedControlOption[];
  size?: SegmentedControlSize;
  value?: string;
};

const controlSizes: Record<SegmentedControlSize, string> = {
  sm: "min-h-9 px-2.5 py-1.5 text-sm",
  default: "min-h-10 px-3 py-2 text-sm"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function sanitizeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function getFirstEnabledValue(options: SegmentedControlOption[]) {
  return options.find((option) => !option.disabled)?.value ?? "";
}

function SegmentedControl({
  className,
  defaultValue,
  name,
  onValueChange,
  options,
  size = "default",
  value: controlledValue,
  ...props
}: SegmentedControlProps) {
  const generatedId = useId();
  const controlName = name ?? `segmented-${generatedId.replace(/:/g, "")}`;
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? controlledValue ?? getFirstEnabledValue(options)
  );
  const value = controlledValue ?? internalValue;
  const setValue = useCallback(
    (nextValue: string) => {
      if (nextValue === value) {
        return;
      }

      if (controlledValue === undefined) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [controlledValue, onValueChange, value]
  );

  return (
    <div
      role="radiogroup"
      data-slot="segmented-control"
      className={classes(
        "inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-border bg-muted p-1 shadow-paper-sm",
        className
      )}
      {...props}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const optionId = `${controlName}-${sanitizeId(option.value)}`;

        return (
          <label
            key={option.value}
            htmlFor={optionId}
            data-disabled={option.disabled || undefined}
            data-state={selected ? "checked" : "unchecked"}
            data-slot="segmented-control-option"
            className="contents"
          >
            <input
              id={optionId}
              type="radio"
              name={controlName}
              value={option.value}
              checked={selected}
              disabled={option.disabled}
              className="peer sr-only"
              onChange={() => setValue(option.value)}
            />
            <span
              className={classes(
                "inline-flex max-w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-transparent",
                "font-semibold leading-none text-muted-foreground transition-colors duration-150",
                "hover:border-border-strong hover:bg-card hover:text-foreground",
                "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-[var(--border-focus)] peer-focus-visible:ring-4 peer-focus-visible:ring-[var(--ring-focus)]",
                "peer-disabled:cursor-not-allowed peer-disabled:border-border peer-disabled:bg-muted peer-disabled:text-muted-foreground peer-disabled:opacity-55",
                "peer-checked:border-border-strong peer-checked:bg-surface-raised peer-checked:text-foreground peer-checked:shadow-paper-sm",
                "peer-checked:underline peer-checked:decoration-[3px] peer-checked:decoration-[var(--state-official-accent)] peer-checked:underline-offset-[7px]",
                controlSizes[size]
              )}
            >
              {option.icon ? (
                <span
                  aria-hidden="true"
                  data-slot="segmented-control-icon"
                  className="inline-flex items-center"
                >
                  {option.icon}
                </span>
              ) : null}
              <span className="truncate">{option.label}</span>
              {option.badge ? (
                <span
                  data-slot="segmented-control-badge"
                  className="rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.68rem] font-semibold leading-none text-muted-foreground"
                >
                  {option.badge}
                </span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export { SegmentedControl };
export type {
  SegmentedControlOption,
  SegmentedControlProps,
  SegmentedControlSize
};
