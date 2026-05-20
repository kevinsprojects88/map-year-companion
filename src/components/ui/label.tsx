import type { ComponentProps, ReactNode } from "react";

import type { FieldVariant } from "@/types/form";

type LabelProps = ComponentProps<"label"> & {
  disabled?: boolean;
  optional?: boolean;
  readOnly?: boolean;
  required?: boolean;
  variant?: FieldVariant;
  marker?: ReactNode;
};

const labelVariants: Record<FieldVariant, string> = {
  default: "text-foreground",
  error: "text-[var(--state-error-text)]",
  success: "text-[var(--state-success-text)]",
  draft: "text-[var(--state-draft-text)]",
  official: "text-[var(--state-official-text)]"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Label({
  children,
  className,
  disabled = false,
  marker,
  optional = false,
  readOnly = false,
  required = false,
  variant = "default",
  ...props
}: LabelProps) {
  return (
    <label
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-required={required || undefined}
      data-slot="label"
      data-variant={variant}
      className={classes(
        "inline-flex max-w-full flex-wrap items-center gap-2 text-sm font-semibold leading-6",
        "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-muted-foreground",
        labelVariants[variant],
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {required ? (
        <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-normal text-muted-foreground">
          Required
        </span>
      ) : null}
      {optional && !required ? (
        <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-normal text-muted-foreground">
          Optional
        </span>
      ) : null}
      {marker}
    </label>
  );
}

export { Label };
export type { LabelProps };
