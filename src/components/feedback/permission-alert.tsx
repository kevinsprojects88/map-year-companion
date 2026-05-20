import type { ComponentProps, ReactNode } from "react";

type PermissionAlertProps = Omit<ComponentProps<"section">, "title"> & {
  title: string;
  description: string;
  allowedActions?: string[];
  disabledReason?: string;
  roleContext?: string;
  turnContext?: string;
  action?: ReactNode;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function PermissionAlert({
  action,
  allowedActions,
  className,
  description,
  disabledReason,
  roleContext,
  title,
  turnContext,
  ...props
}: PermissionAlertProps) {
  const hasContext = roleContext || turnContext;

  return (
    <section
      data-slot="permission-alert"
      className={classes(
        "rounded-lg border border-[var(--state-process-border)] bg-[var(--state-process-bg)] p-5 shadow-paper-sm",
        className
      )}
      {...props}
    >
      <div className="flex max-w-3xl flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-xs font-semibold uppercase text-[var(--state-process-text)]">
            Permission boundary
          </p>
          <h3 className="text-xl font-semibold leading-tight">{title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        {hasContext ? (
          <dl className="grid gap-2 rounded-md border border-[var(--state-process-border)] bg-card p-3 text-sm sm:grid-cols-2">
            {roleContext ? (
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                  Role context
                </dt>
                <dd>{roleContext}</dd>
              </div>
            ) : null}
            {turnContext ? (
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                  Turn context
                </dt>
                <dd>{turnContext}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {disabledReason ? (
          <p className="rounded-md border border-[var(--state-process-border)] bg-[var(--state-process-surface)] p-3 text-sm leading-6 text-[var(--state-process-text)]">
            {disabledReason}
          </p>
        ) : null}

        {allowedActions?.length ? (
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              Still available
            </p>
            <ul className="flex flex-col gap-1.5 text-sm leading-6 text-muted-foreground">
              {allowedActions.map((allowedAction) => (
                <li key={allowedAction} className="flex gap-2">
                  <span aria-hidden="true">-</span>
                  <span>{allowedAction}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
      </div>
    </section>
  );
}

export { PermissionAlert };
export type { PermissionAlertProps };
