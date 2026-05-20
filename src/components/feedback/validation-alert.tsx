import type { ComponentProps } from "react";

import type { ValidationAlertVariant } from "@/types/feedback";

type ValidationAlertProps = Omit<ComponentProps<"section">, "title"> & {
  title: string;
  messages: string[];
  variant?: ValidationAlertVariant;
};

const validationAlertVariants: Record<ValidationAlertVariant, string> = {
  warning:
    "border-[var(--state-warning-border)] bg-[var(--state-warning-bg)] text-[var(--state-warning-text)]",
  error:
    "border-[var(--state-error-border)] bg-[var(--state-error-bg)] text-[var(--state-error-text)]",
  success:
    "border-[var(--state-success-border)] bg-[var(--state-success-bg)] text-[var(--state-success-text)]"
};

const validationLabels: Record<ValidationAlertVariant, string> = {
  warning: "Warning",
  error: "Error",
  success: "Success"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ValidationAlert({
  className,
  messages,
  title,
  variant = "warning",
  ...props
}: ValidationAlertProps) {
  return (
    <section
      role={variant === "success" ? "status" : "alert"}
      aria-live="polite"
      data-slot="validation-alert"
      data-variant={variant}
      className={classes(
        "rounded-lg border p-4 shadow-paper-sm",
        validationAlertVariants[variant],
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs font-semibold uppercase">
            {validationLabels[variant]}
          </p>
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        </div>
        <ul className="flex flex-col gap-1.5 text-sm leading-6">
          {messages.map((message) => (
            <li key={message} className="flex gap-2">
              <span aria-hidden="true">-</span>
              <span>{message}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { ValidationAlert };
export type { ValidationAlertProps };
