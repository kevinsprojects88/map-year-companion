import type { ComponentProps } from "react";

type CardVariant =
  | "default"
  | "raised"
  | "draft"
  | "official"
  | "poll"
  | "process"
  | "archived"
  | "error";

type CardProps = ComponentProps<"div"> & {
  variant?: CardVariant;
};

const cardVariants: Record<CardVariant, string> = {
  default:
    "border-border bg-card text-card-foreground shadow-paper-sm before:bg-transparent",
  raised:
    "border-border-strong bg-surface-raised text-card-foreground shadow-paper-md before:bg-[var(--border-strong)]",
  draft:
    "border-2 border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-bg)] text-card-foreground shadow-paper-sm before:bg-[var(--state-draft-accent)]",
  official:
    "border-2 border-solid border-[var(--state-official-border)] bg-[var(--state-official-bg)] text-card-foreground shadow-paper-sm before:bg-[var(--state-official-accent)]",
  poll:
    "border-2 border-solid border-[var(--state-poll-border)] bg-[var(--state-poll-bg)] text-card-foreground shadow-paper-sm before:bg-[var(--state-poll-accent)]",
  process:
    "border-2 border-solid border-[var(--state-process-border)] bg-[var(--state-process-bg)] text-card-foreground shadow-paper-sm before:bg-[var(--state-process-accent)]",
  archived:
    "border-2 border-solid border-[var(--state-archived-border)] bg-[var(--state-archived-bg)] text-card-foreground shadow-none before:bg-[var(--state-archived-accent)]",
  error:
    "border-2 border-solid border-[var(--state-error-border)] bg-[var(--state-error-bg)] text-card-foreground shadow-paper-sm before:bg-[var(--state-error-accent)]"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      className={classes(
        "relative flex flex-col gap-5 overflow-hidden rounded-lg border p-5",
        "before:absolute before:inset-y-4 before:left-0 before:w-1",
        cardVariants[variant],
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={classes(
        "grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={classes(
        "col-start-1 text-xl font-semibold leading-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={classes(
        "col-start-1 max-w-prose text-sm leading-6 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={classes("col-start-2 row-span-2 row-start-1", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={classes("flex flex-col gap-3 text-sm leading-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={classes(
        "flex flex-wrap items-center gap-2 border-t border-border/70 pt-4 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
};

export type { CardVariant };
