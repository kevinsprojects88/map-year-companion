import type { ComponentProps, ReactNode } from "react";

import type { ErrorStateVariant } from "@/types/feedback";

type ErrorStateProps = Omit<ComponentProps<"section">, "title"> & {
  title: string;
  description: string;
  recoveryAction?: ReactNode;
  technicalDetails?: ReactNode;
  variant?: ErrorStateVariant;
};

const errorStateVariants: Record<ErrorStateVariant, string> = {
  validation:
    "border-[var(--state-warning-border)] bg-[var(--state-warning-bg)] before:bg-[var(--state-warning-accent)]",
  permission:
    "border-[var(--state-process-border)] bg-[var(--state-process-bg)] before:bg-[var(--state-process-accent)]",
  network:
    "border-[var(--state-archived-border)] bg-[var(--state-archived-bg)] before:bg-[var(--state-archived-accent)]",
  conflict:
    "border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-bg)] before:bg-[var(--state-draft-accent)]",
  unknown:
    "border-[var(--state-error-border)] bg-[var(--state-error-bg)] before:bg-[var(--state-error-accent)]",
  destructive:
    "border-2 border-[var(--state-error-border)] bg-[var(--state-error-bg)] before:bg-[var(--state-error-accent)]"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ErrorState({
  className,
  description,
  recoveryAction,
  technicalDetails,
  title,
  variant = "unknown",
  ...props
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      aria-live="polite"
      data-slot="error-state"
      data-variant={variant}
      className={classes(
        "relative overflow-hidden rounded-lg border p-5 shadow-paper-sm",
        "before:absolute before:inset-y-4 before:left-0 before:w-1",
        errorStateVariants[variant],
        className
      )}
      {...props}
    >
      <div className="flex max-w-2xl flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-semibold leading-tight">{title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {recoveryAction ? (
          <div className="flex flex-wrap gap-2">{recoveryAction}</div>
        ) : null}
        {technicalDetails ? (
          <details className="rounded-md border border-border bg-card p-3 text-sm leading-6 text-muted-foreground">
            <summary className="cursor-pointer font-semibold text-foreground">
              Technical details
            </summary>
            <div className="pt-2">{technicalDetails}</div>
          </details>
        ) : null}
      </div>
    </section>
  );
}

export { ErrorState };
export type { ErrorStateProps };
