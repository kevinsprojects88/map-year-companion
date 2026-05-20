import type { ComponentProps, ReactNode } from "react";

import type { EmptyStateVariant } from "@/types/feedback";

type EmptyStateProps = Omit<ComponentProps<"section">, "title"> & {
  title: string;
  description: string;
  action?: ReactNode;
  variant?: EmptyStateVariant;
};

const emptyStateVariants: Record<EmptyStateVariant, string> = {
  neutral: "border-border bg-card before:bg-border",
  actionable:
    "border-[var(--state-official-border)] bg-[var(--state-official-bg)] before:bg-[var(--state-official-accent)]",
  blocked:
    "border-[var(--state-process-border)] bg-[var(--state-process-bg)] before:bg-[var(--state-process-accent)]",
  archived:
    "border-[var(--state-archived-border)] bg-[var(--state-archived-bg)] before:bg-[var(--state-archived-accent)]"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function EmptyState({
  action,
  className,
  description,
  title,
  variant = "neutral",
  ...props
}: EmptyStateProps) {
  return (
    <section
      data-slot="empty-state"
      data-variant={variant}
      className={classes(
        "relative overflow-hidden rounded-lg border p-5 shadow-paper-sm",
        "before:absolute before:inset-y-4 before:left-0 before:w-1",
        emptyStateVariants[variant],
        className
      )}
      {...props}
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-semibold leading-tight">{title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
      </div>
    </section>
  );
}

export { EmptyState };
export type { EmptyStateProps };
