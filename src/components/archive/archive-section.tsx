import type { ComponentProps, ReactNode } from "react";

type ArchiveSectionProps = Omit<ComponentProps<"section">, "title"> & {
  children: ReactNode;
  description?: string;
  eyebrow?: string;
  statusArea?: ReactNode;
  title: string;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ArchiveSection({
  children,
  className,
  description,
  eyebrow = "Archive placeholder section",
  id,
  statusArea,
  title,
  ...props
}: ArchiveSectionProps) {
  const fallbackTitleId = `archive-section-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}-heading`;
  const titleId = id ? `${id}-heading` : fallbackTitleId;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={classes("flex flex-col gap-5 border-t border-border pt-6", className)}
      {...props}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            {eyebrow}
          </p>
          <h2 id={titleId} className="mt-1 text-3xl font-semibold leading-tight">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {statusArea ? (
          <div className="flex flex-wrap items-center gap-2">{statusArea}</div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export { ArchiveSection };
export type { ArchiveSectionProps };
