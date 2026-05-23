import type { ComponentProps, ReactNode } from "react";

type DashboardShellProps = Omit<ComponentProps<"section">, "title"> & {
  actionArea?: ReactNode;
  children: ReactNode;
  description?: string;
  heading: string;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function slugifyId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function DashboardShell({
  actionArea,
  children,
  className,
  description,
  heading,
  ...props
}: DashboardShellProps) {
  const headingId = `dashboard-shell-${slugifyId(heading) || "heading"}`;

  return (
    <section
      aria-labelledby={headingId}
      data-slot="dashboard-shell"
      className={classes(
        "mx-auto flex w-full max-w-6xl flex-col gap-6 px-1 py-2",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-3xl flex-col gap-2">
          <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
            Dashboard shell placeholder
          </p>
          <h2 id={headingId} className="text-3xl font-semibold leading-tight">
            {heading}
          </h2>
          {description ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actionArea ? (
          <div className="flex flex-wrap items-center gap-2">{actionArea}</div>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export { DashboardShell };
export type { DashboardShellProps };
