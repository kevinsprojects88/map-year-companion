import type { ComponentProps } from "react";

import { Badge, StateBadge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { ArchiveSummaryHeaderViewModel } from "@/types/archive";

type ArchiveSummaryHeaderProps = Omit<ComponentProps<"header">, "title"> & {
  archive: ArchiveSummaryHeaderViewModel;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ArchiveSummaryHeader({
  archive,
  className,
  ...props
}: ArchiveSummaryHeaderProps) {
  const titleId = `${archive.id}-title`;
  const summaryId = `${archive.id}-summary`;
  const metricItems = [
    { label: "Completed", value: archive.completionDateLabel },
    { label: "Participants", value: archive.playerCountLabel },
    { label: "Turns kept", value: archive.turnCountLabel }
  ];

  return (
    <header
      aria-labelledby={titleId}
      aria-describedby={summaryId}
      className={className}
      {...props}
    >
      <Card variant="archived" className="gap-6">
        <CardHeader className="gap-y-4">
          <div className="col-start-1 flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <StateBadge state="archived" />
              <StateBadge state="readOnly" />
              {archive.statusLabel ? (
                <Badge variant="archived">{archive.statusLabel}</Badge>
              ) : null}
            </div>
            <div>
              <p className="font-mono text-sm font-semibold uppercase text-muted-foreground">
                Final archive placeholder
              </p>
              <CardTitle id={titleId} className="mt-1 text-4xl sm:text-5xl">
                {archive.worldTitle}
              </CardTitle>
            </div>
            <CardDescription
              id={summaryId}
              className="max-w-4xl text-base leading-7"
            >
              {archive.summary}
            </CardDescription>
          </div>
          <CardAction>
            <div className="rounded-md border border-[var(--state-archived-border)] bg-[var(--state-archived-surface)] px-3 py-2 text-right text-[var(--state-archived-text)]">
              <p className="font-mono text-xs font-semibold uppercase leading-5">
                Archive
              </p>
              <p className="text-sm font-semibold leading-6">
                {archive.statusLabel ?? "Archived"}
              </p>
            </div>
          </CardAction>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-3 md:grid-cols-3">
            {metricItems.map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-border bg-surface px-4 py-3"
              >
                <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="mt-1 text-base font-semibold leading-7 text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>

        {archive.rememberedPhrase ? (
          <CardFooter
            className={classes(
              "items-start border-[var(--state-archived-border)]",
              "bg-[var(--state-archived-surface)]"
            )}
          >
            <span className="font-mono text-xs uppercase">Remembered phrase</span>
            <span className="text-sm leading-6 text-foreground">
              {archive.rememberedPhrase}
            </span>
          </CardFooter>
        ) : null}
      </Card>
    </header>
  );
}

export { ArchiveSummaryHeader };
export type { ArchiveSummaryHeaderProps };
