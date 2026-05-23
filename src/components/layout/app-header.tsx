import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  AppHeaderNavigationItemViewModel,
  AppHeaderViewModel
} from "@/types/layout";

type AppHeaderProps = Omit<ComponentProps<"header">, "children"> &
  AppHeaderViewModel;

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function AppHeaderNavItem({
  item
}: {
  item: AppHeaderNavigationItemViewModel;
}) {
  return (
    <li>
      <span
        aria-current={item.current ? "page" : undefined}
        className={classes(
          "inline-flex min-h-10 max-w-full items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold leading-none",
          item.current
            ? "border-border-strong bg-surface-raised text-foreground shadow-paper-sm"
            : "border-border bg-transparent text-muted-foreground"
        )}
      >
        {item.marker ? (
          <span
            aria-hidden="true"
            className="border-r border-border pr-1.5 font-mono text-[0.65rem] uppercase"
          >
            {item.marker}
          </span>
        ) : null}
        <span className="truncate">{item.label}</span>
        {item.detail ? (
          <span className="sr-only">{item.detail}</span>
        ) : null}
      </span>
    </li>
  );
}

function AppHeader({
  className,
  navigationItems = [],
  primaryAction,
  productName,
  subtitle,
  userDisplayLabel,
  ...props
}: AppHeaderProps) {
  const actionReason =
    primaryAction?.disabledReason ??
    "Static placeholder action for design-system review.";

  return (
    <header
      data-slot="app-header"
      className={classes(
        "rounded-lg border border-border bg-surface-raised px-4 py-4 shadow-paper-sm sm:px-5",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
            App-level placeholder header
          </p>
          <h2 className="truncate text-2xl font-semibold leading-tight">
            {productName}
          </h2>
          {subtitle ? (
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex flex-wrap items-center gap-2">
            {userDisplayLabel ? (
              <Badge variant="secondary">
                <span
                  aria-hidden="true"
                  className="border-r border-[var(--badge-mark-border)] pr-1.5 font-mono text-[0.65rem] uppercase leading-none"
                >
                  USER
                </span>
                <span>{userDisplayLabel}</span>
              </Badge>
            ) : null}
            {primaryAction ? (
              <Button
                aria-label={
                  primaryAction.ariaLabel ??
                  `${primaryAction.label} (static placeholder action)`
                }
                disabled
                size="sm"
                variant={primaryAction.variant ?? "secondary"}
              >
                {primaryAction.label}
              </Button>
            ) : null}
          </div>
          {primaryAction ? (
            <p className="text-xs leading-5 text-muted-foreground">
              {actionReason}
            </p>
          ) : null}
        </div>
      </div>

      {navigationItems.length ? (
        <nav
          aria-label="Placeholder app navigation"
          className="mt-4 border-t border-border pt-4"
        >
          <ul className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <AppHeaderNavItem key={item.id} item={item} />
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

export { AppHeader };
export type { AppHeaderProps };
