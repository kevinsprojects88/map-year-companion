import type { ComponentProps, ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

type DashboardSectionProps = Omit<ComponentProps<"section">, "title"> & {
  children?: ReactNode;
  count?: number | string;
  description?: string;
  emptyState?: ReactNode;
  title: string;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function DashboardSection({
  children,
  className,
  count,
  description,
  emptyState,
  title,
  ...props
}: DashboardSectionProps) {
  return (
    <section className={classes("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
        <div className="flex max-w-3xl flex-col gap-1.5">
          <h2 className="text-2xl font-semibold leading-tight">{title}</h2>
          {description ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {count !== undefined ? (
          <Badge variant="secondary" aria-label={`${count} items`}>
            <span className="font-mono text-xs uppercase">{count}</span>
          </Badge>
        ) : null}
      </div>
      {children ? children : emptyState}
    </section>
  );
}

export { DashboardSection };
export type { DashboardSectionProps };
