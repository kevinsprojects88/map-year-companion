import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

import type { FieldVariant } from "@/types/form";

type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SelectProps = Omit<ComponentPropsWithoutRef<"select">, "children"> & {
  children?: ReactNode;
  options?: SelectOption[];
  placeholder?: string;
  readOnly?: boolean;
  variant?: FieldVariant;
};

const selectVariants: Record<FieldVariant, string> = {
  default: "border-border bg-card",
  error: "border-2 border-[var(--state-error-border)] bg-[var(--state-error-bg)]",
  success:
    "border-2 border-[var(--state-success-border)] bg-[var(--state-success-bg)]",
  draft:
    "border-2 border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-bg)]",
  official:
    "border-2 border-[var(--state-official-border)] bg-[var(--state-official-bg)]"
};

const selectReadOnlyVariants: Record<FieldVariant, string> = {
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
  ariaInvalid: ComponentPropsWithoutRef<"select">["aria-invalid"],
  variant: FieldVariant
) {
  return variant === "error" || ariaInvalid === true || ariaInvalid === "true";
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    "aria-invalid": ariaInvalid,
    children,
    className,
    options,
    placeholder,
    readOnly,
    tabIndex,
    variant = "default",
    ...props
  },
  ref
) {
  const invalid = isInvalid(ariaInvalid, variant);

  return (
    <span
      data-disabled={props.disabled || undefined}
      data-readonly={readOnly || undefined}
      data-slot="select-wrapper"
      className="relative block w-full"
    >
      <select
        ref={ref}
        aria-invalid={invalid ? true : ariaInvalid}
        aria-readonly={readOnly || undefined}
        data-readonly={readOnly || undefined}
        data-slot="select"
        data-variant={variant}
        tabIndex={readOnly ? -1 : tabIndex}
        className={classes(
          "flex min-h-10 w-full appearance-none rounded-md border px-3 py-2 pr-10 text-sm leading-6 text-foreground shadow-paper-sm",
          "transition-colors duration-150",
          "focus-visible:border-[var(--border-focus)] focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70",
          selectVariants[variant],
          "[aria-invalid=true]:border-[var(--state-error-border)] [aria-invalid=true]:bg-[var(--state-error-bg)]",
          readOnly && selectReadOnlyVariants[variant],
          readOnly && "pointer-events-none",
          className
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options?.map((option) => (
          <option
            disabled={option.disabled}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
        {children}
      </select>
      <span
        aria-hidden="true"
        className={classes(
          "pointer-events-none absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-sm border border-border bg-surface text-[0.62rem] font-semibold leading-none text-muted-foreground",
          props.disabled && "opacity-60",
          readOnly && "border-[var(--state-archived-border)] bg-[var(--state-archived-bg)]"
        )}
      >
        v
      </span>
    </span>
  );
});

export { Select };
export type { SelectOption, SelectProps };
