import type { ComponentProps } from "react";

import type { LoadingSkeletonVariant } from "@/types/feedback";

type LoadingSkeletonProps = ComponentProps<"div"> & {
  variant?: LoadingSkeletonVariant;
  label?: string;
};

const skeletonPatterns: Record<LoadingSkeletonVariant, string[]> = {
  card: ["h-5 w-1/2", "h-4 w-full", "h-4 w-5/6", "h-24 w-full"],
  row: ["h-4 w-1/5", "h-4 w-2/5", "h-4 w-1/4"],
  panel: ["h-6 w-1/3", "h-4 w-full", "h-4 w-11/12", "h-36 w-full"]
};

const skeletonFrames: Record<LoadingSkeletonVariant, string> = {
  card: "rounded-lg border border-border bg-card p-5",
  row: "rounded-md border border-border bg-card p-3",
  panel: "rounded-lg border border-border bg-surface-raised p-5"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function LoadingSkeleton({
  className,
  label,
  variant = "card",
  ...props
}: LoadingSkeletonProps) {
  const text = label ?? `Loading ${variant} content`;

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={text}
      data-slot="loading-skeleton"
      data-variant={variant}
      className={classes(
        "flex w-full flex-col gap-3 shadow-paper-sm",
        skeletonFrames[variant],
        className
      )}
      {...props}
    >
      <span className="sr-only">{text}</span>
      {skeletonPatterns[variant].map((line, index) => (
        <span
          key={`${variant}-${line}-${index}`}
          aria-hidden="true"
          className={classes(
            "block rounded-md bg-muted motion-safe:animate-pulse",
            line
          )}
        />
      ))}
    </div>
  );
}

export { LoadingSkeleton };
export type { LoadingSkeletonProps };
