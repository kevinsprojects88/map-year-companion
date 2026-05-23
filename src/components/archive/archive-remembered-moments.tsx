import type { ComponentProps } from "react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Badge, StateBadge, type BadgeVariant } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type {
  ArchiveRememberedMomentCategory,
  ArchiveRememberedMomentsViewModel
} from "@/types/archive";

type ArchiveRememberedMomentsProps = Omit<ComponentProps<"section">, "title"> & {
  rememberedMoments: ArchiveRememberedMomentsViewModel;
};

type MomentCategoryDisplay = {
  label: string;
  marker: string;
  variant: BadgeVariant;
};

const momentCategoryDisplay: Record<
  ArchiveRememberedMomentCategory,
  MomentCategoryDisplay
> = {
  communityMemory: {
    label: "Community Memory",
    marker: "MEM",
    variant: "archived"
  },
  decision: {
    label: "Decision",
    marker: "DEC",
    variant: "official"
  },
  mapChange: {
    label: "Map Change",
    marker: "MAP",
    variant: "official"
  },
  quote: {
    label: "Quote",
    marker: "QUOTE",
    variant: "outline"
  },
  unresolvedQuestion: {
    label: "Unresolved Question",
    marker: "Q",
    variant: "attention"
  }
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ArchiveRememberedMoments({
  className,
  rememberedMoments,
  ...props
}: ArchiveRememberedMomentsProps) {
  const titleId = `${rememberedMoments.id}-heading`;
  const descriptionId = `${rememberedMoments.id}-description`;

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={classes("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
            Remembered moments
          </p>
          <h3 id={titleId} className="mt-1 text-2xl font-semibold leading-tight">
            {rememberedMoments.title ?? "Remembered Moments"}
          </h3>
          <p
            id={descriptionId}
            className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground"
          >
            {rememberedMoments.description ??
              "Display-only highlights kept alongside the official archive. These are mock records, not summaries."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StateBadge state="archived" />
          <Badge variant="outline">
            {rememberedMoments.summaryLabel ??
              `${rememberedMoments.moments.length} placeholder moments`}
          </Badge>
          {rememberedMoments.statusLabel ? (
            <Badge variant="archived">{rememberedMoments.statusLabel}</Badge>
          ) : null}
        </div>
      </div>

      {rememberedMoments.moments.length ? (
        <ul className="grid gap-4 lg:grid-cols-2">
          {rememberedMoments.moments.map((moment) => {
            const category =
              momentCategoryDisplay[moment.category ?? "communityMemory"];
            const momentTitleId = `${rememberedMoments.id}-${moment.id}-title`;
            const momentBodyId = `${rememberedMoments.id}-${moment.id}-body`;
            const details = [
              moment.weekLabel ? { label: "Week", value: moment.weekLabel } : null,
              moment.turnLabel ? { label: "Turn", value: moment.turnLabel } : null,
              moment.authorLabel
                ? { label: "Remembered by", value: moment.authorLabel }
                : null
            ].filter(
              (item): item is { label: string; value: string } => item !== null
            );

            return (
              <li key={moment.id}>
                <Card
                  role="article"
                  aria-labelledby={momentTitleId}
                  aria-describedby={momentBodyId}
                  variant="archived"
                  className="min-h-full"
                >
                  <CardHeader className="gap-y-3">
                    <div className="col-start-1 flex min-w-0 flex-col gap-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={category.variant}>
                          <span
                            aria-hidden="true"
                            className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
                          >
                            {category.marker}
                          </span>
                          <span>{category.label}</span>
                        </Badge>
                        <Badge variant="outline">Mock memory</Badge>
                      </div>
                      <CardTitle id={momentTitleId}>{moment.title}</CardTitle>
                      <CardDescription>
                        Kept as a reflective archive note, separate from official
                        history and archived chat.
                      </CardDescription>
                    </div>
                    <CardAction>
                      <div className="rounded-md border border-[var(--state-archived-border)] bg-[var(--state-archived-surface)] px-3 py-2 text-right text-[var(--state-archived-text)]">
                        <p className="font-mono text-xs font-semibold uppercase leading-5">
                          Moment
                        </p>
                        <p className="text-sm font-semibold leading-6">
                          {category.label}
                        </p>
                      </div>
                    </CardAction>
                  </CardHeader>

                  <CardContent>
                    {moment.category === "quote" ? (
                      <blockquote
                        id={momentBodyId}
                        className="border-l-2 border-[var(--state-archived-border)] bg-surface px-4 py-3 text-base leading-7 text-foreground"
                      >
                        {moment.body}
                      </blockquote>
                    ) : (
                      <p id={momentBodyId} className="text-base leading-7">
                        {moment.body}
                      </p>
                    )}

                    {details.length ? (
                      <dl className="grid gap-2 sm:grid-cols-2">
                        {details.map((item) => (
                          <div
                            key={`${item.label}-${item.value}`}
                            className="rounded-md border border-border bg-surface px-3 py-2"
                          >
                            <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                              {item.label}
                            </dt>
                            <dd className="mt-1 text-sm font-semibold leading-6 text-foreground">
                              {item.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}

                    {moment.rememberedBecause ? (
                      <div className="rounded-md border border-[var(--state-archived-border)] bg-[var(--state-archived-surface)] px-3 py-2 text-[var(--state-archived-text)]">
                        <p className="font-mono text-xs font-semibold uppercase">
                          Remembered because
                        </p>
                        <p className="mt-1 text-sm leading-6">
                          {moment.rememberedBecause}
                        </p>
                      </div>
                    ) : null}
                  </CardContent>

                  <CardFooter>
                    <span>Remembered moment placeholder</span>
                    {moment.weekLabel || moment.turnLabel ? (
                      <>
                        <span aria-hidden="true">/</span>
                        <span>{moment.weekLabel ?? moment.turnLabel}</span>
                      </>
                    ) : null}
                  </CardFooter>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          description={
            rememberedMoments.emptyState?.description ??
            "No remembered moments are shown in this placeholder archive section."
          }
          title={
            rememberedMoments.emptyState?.title ??
            "No mock remembered moments shown"
          }
          variant="archived"
        />
      )}
    </section>
  );
}

export { ArchiveRememberedMoments };
export type { ArchiveRememberedMomentsProps };
