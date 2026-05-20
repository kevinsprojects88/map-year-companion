import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode
} from "react";

import type { FieldVariant } from "@/types/form";

type SwitchProps = Omit<ComponentPropsWithoutRef<"input">, "role" | "type"> & {
  description?: ReactNode;
  label?: ReactNode;
  variant?: FieldVariant;
};

type SwitchInputProps = Omit<SwitchProps, "description" | "label">;

const switchVariants: Record<FieldVariant, string> = {
  default:
    "border-border bg-muted peer-checked:border-[var(--state-official-border)] peer-checked:bg-[var(--state-official-surface)]",
  error:
    "border-[var(--state-error-border)] bg-[var(--state-error-bg)] peer-checked:bg-[var(--state-error-surface)]",
  success:
    "border-[var(--state-success-border)] bg-[var(--state-success-bg)] peer-checked:bg-[var(--state-success-surface)]",
  draft:
    "border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-bg)] peer-checked:bg-[var(--state-draft-surface)]",
  official:
    "border-[var(--state-official-border)] bg-[var(--state-official-bg)] peer-checked:bg-[var(--state-official-surface)]"
};

const switchKnobVariants: Record<FieldVariant, string> = {
  default: "bg-surface text-muted-foreground peer-checked:text-[var(--state-official-text)]",
  error: "bg-surface text-[var(--state-error-text)]",
  success: "bg-surface text-[var(--state-success-text)]",
  draft: "bg-surface text-[var(--state-draft-text)]",
  official: "bg-surface text-[var(--state-official-text)]"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const SwitchInput = forwardRef<HTMLInputElement, SwitchInputProps>(
  function SwitchInput(
    { className, variant = "default", ...props },
    ref
  ) {
    return (
      <span
        data-disabled={props.disabled || undefined}
        data-slot="switch-control"
        data-variant={variant}
        className={classes(
          "relative inline-flex h-8 w-16 shrink-0 items-center",
          "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-70",
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          data-slot="switch"
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden="true"
          className={classes(
            "absolute inset-0 rounded-full border shadow-paper-sm transition-colors duration-150",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-[var(--border-focus)] peer-focus-visible:ring-4 peer-focus-visible:ring-[var(--ring-focus)]",
            "peer-disabled:cursor-not-allowed",
            switchVariants[variant]
          )}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-8 z-10 font-mono text-[0.6rem] font-semibold uppercase leading-none text-muted-foreground transition-opacity peer-checked:opacity-0"
        >
          Off
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2 z-10 font-mono text-[0.6rem] font-semibold uppercase leading-none text-[var(--state-official-text)] opacity-0 transition-opacity peer-checked:opacity-100"
        >
          On
        </span>
        <span
          aria-hidden="true"
          className={classes(
            "pointer-events-none absolute left-1 z-20 flex size-6 items-center justify-center rounded-full border border-border text-[0.58rem] font-bold uppercase leading-none shadow-paper-sm transition-transform duration-150 peer-checked:translate-x-8",
            switchKnobVariants[variant]
          )}
        >
          |
        </span>
      </span>
    );
  }
);

const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { description, disabled, label, ...props },
  ref
) {
  if (!label && !description) {
    return <SwitchInput ref={ref} disabled={disabled} {...props} />;
  }

  return (
    <label
      data-disabled={disabled || undefined}
      data-slot="switch-label"
      className={classes(
        "flex max-w-full items-start gap-3 text-sm leading-6 text-foreground",
        "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-muted-foreground data-[disabled=true]:opacity-75"
      )}
    >
      <SwitchInput ref={ref} disabled={disabled} {...props} />
      <span className="flex min-w-0 flex-col gap-1">
        {label ? <span className="font-semibold">{label}</span> : null}
        {description ? (
          <span className="text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </label>
  );
});

export { Switch };
export type { SwitchProps };
