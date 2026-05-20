import { forwardRef, type ComponentPropsWithoutRef } from "react";

import type { FieldVariant } from "@/types/form";

type InputProps = ComponentPropsWithoutRef<"input"> & {
  variant?: FieldVariant;
};

const inputVariants: Record<FieldVariant, string> = {
  default: "border-border bg-card",
  error: "border-2 border-[var(--state-error-border)] bg-[var(--state-error-bg)]",
  success:
    "border-2 border-[var(--state-success-border)] bg-[var(--state-success-bg)]",
  draft:
    "border-2 border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-bg)]",
  official:
    "border-2 border-[var(--state-official-border)] bg-[var(--state-official-bg)]"
};

const inputReadOnlyVariants: Record<FieldVariant, string> = {
  default:
    "cursor-default border-[var(--state-archived-border)] bg-[var(--state-archived-bg)] text-[var(--state-archived-text)]",
  error:
    "cursor-default border-[var(--state-error-border)] bg-[var(--state-error-surface)] text-[var(--state-error-text)]",
  success:
    "cursor-default border-[var(--state-success-border)] bg-[var(--state-success-surface)] text-[var(--state-success-text)]",
  draft:
    "cursor-default border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-surface)] text-[var(--state-draft-text)]",
  official:
    "cursor-default border-[var(--state-official-border)] bg-[var(--state-official-surface)] text-[var(--state-official-text)]"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function isInvalid(
  ariaInvalid: ComponentPropsWithoutRef<"input">["aria-invalid"],
  variant: FieldVariant
) {
  return variant === "error" || ariaInvalid === true || ariaInvalid === "true";
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { "aria-invalid": ariaInvalid, className, readOnly, variant = "default", ...props },
  ref
) {
  const invalid = isInvalid(ariaInvalid, variant);

  return (
    <input
      ref={ref}
      readOnly={readOnly}
      aria-invalid={invalid ? true : ariaInvalid}
      data-readonly={readOnly || undefined}
      data-slot="input"
      data-variant={variant}
      className={classes(
        "flex min-h-10 w-full rounded-md border px-3 py-2 text-sm leading-6 text-foreground shadow-paper-sm",
        "transition-colors duration-150 placeholder:text-muted-foreground/70",
        "focus-visible:border-[var(--border-focus)] focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70",
        inputVariants[variant],
        "[aria-invalid=true]:border-[var(--state-error-border)] [aria-invalid=true]:bg-[var(--state-error-bg)]",
        readOnly && inputReadOnlyVariants[variant],
        className
      )}
      {...props}
    />
  );
});

export { Input };
export type { InputProps };
