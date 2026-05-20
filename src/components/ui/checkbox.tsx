import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode
} from "react";

import type { FieldVariant } from "@/types/form";

type CheckboxProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  description?: ReactNode;
  label?: ReactNode;
  variant?: FieldVariant;
};

type CheckboxInputProps = Omit<CheckboxProps, "description" | "label">;

const checkboxVariants: Record<FieldVariant, string> = {
  default:
    "border-border bg-card checked:border-[var(--state-official-border)] checked:bg-[var(--state-official-accent)]",
  error:
    "border-2 border-[var(--state-error-border)] bg-[var(--state-error-bg)] checked:bg-[var(--state-error-accent)]",
  success:
    "border-2 border-[var(--state-success-border)] bg-[var(--state-success-bg)] checked:bg-[var(--state-success-accent)]",
  draft:
    "border-2 border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-bg)] checked:bg-[var(--state-draft-accent)]",
  official:
    "border-2 border-[var(--state-official-border)] bg-[var(--state-official-bg)] checked:bg-[var(--state-official-accent)]"
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

const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(
  function CheckboxInput(
    { "aria-invalid": ariaInvalid, className, variant = "default", ...props },
    ref
  ) {
    const invalid = isInvalid(ariaInvalid, variant);

    return (
      <input
        ref={ref}
        type="checkbox"
        aria-invalid={invalid ? true : ariaInvalid}
        data-slot="checkbox"
        data-variant={variant}
        className={classes(
          "relative mt-0.5 grid size-5 shrink-0 appearance-none place-items-center rounded-sm border shadow-paper-sm",
          "transition-colors duration-150",
          "after:hidden after:size-2 after:rotate-[-45deg] after:border-b-2 after:border-l-2 after:border-[var(--text-inverse)] after:content-[''] checked:after:block",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:opacity-70",
          checkboxVariants[variant],
          "[aria-invalid=true]:border-[var(--state-error-border)] [aria-invalid=true]:bg-[var(--state-error-bg)]",
          className
        )}
        {...props}
      />
    );
  }
);

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { description, disabled, label, ...props },
  ref
) {
  if (!label && !description) {
    return <CheckboxInput ref={ref} disabled={disabled} {...props} />;
  }

  return (
    <label
      data-disabled={disabled || undefined}
      data-slot="checkbox-label"
      className={classes(
        "flex max-w-full items-start gap-3 text-sm leading-6 text-foreground",
        "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-muted-foreground data-[disabled=true]:opacity-75"
      )}
    >
      <CheckboxInput ref={ref} disabled={disabled} {...props} />
      <span className="flex min-w-0 flex-col gap-1">
        {label ? <span className="font-semibold">{label}</span> : null}
        {description ? (
          <span className="text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </label>
  );
});

export { Checkbox };
export type { CheckboxProps };
