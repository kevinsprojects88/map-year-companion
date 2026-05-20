import { useId, type ComponentProps, type ReactNode } from "react";

import { Label } from "@/components/ui/label";
import type { FieldVariant } from "@/types/form";

type FieldControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  "aria-required"?: true;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  variant: FieldVariant;
};

type FieldProps = Omit<ComponentProps<"div">, "children"> & {
  children: ReactNode | ((controlProps: FieldControlProps) => ReactNode);
  description?: ReactNode;
  disabled?: boolean;
  error?: ReactNode;
  id?: string;
  label?: ReactNode;
  message?: ReactNode;
  optional?: boolean;
  readOnly?: boolean;
  required?: boolean;
  statusLabel?: ReactNode;
  variant?: FieldVariant;
};

const fieldVariants: Record<FieldVariant, string> = {
  default: "border-transparent",
  error: "border-[var(--state-error-border)]",
  success: "border-[var(--state-success-border)]",
  draft: "border-dashed border-[var(--state-draft-border)]",
  official: "border-[var(--state-official-border)]"
};

const messageVariants: Record<FieldVariant, string> = {
  default: "text-muted-foreground",
  error: "text-[var(--state-error-text)]",
  success: "text-[var(--state-success-text)]",
  draft: "text-[var(--state-draft-text)]",
  official: "text-[var(--state-official-text)]"
};

const messagePrefixes: Partial<Record<FieldVariant, string>> = {
  error: "Needs attention:",
  success: "Verified:",
  draft: "Draft note:",
  official: "Official note:"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getFieldId(id: string | undefined, generatedId: string) {
  return id ?? `field-${generatedId.replace(/:/g, "")}`;
}

function FieldGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={classes("flex flex-col gap-5", className)}
      {...props}
    />
  );
}

function Field({
  children,
  className,
  description,
  disabled = false,
  error,
  id,
  label,
  message,
  optional = false,
  readOnly = false,
  required = false,
  statusLabel,
  variant = "default",
  ...props
}: FieldProps) {
  const generatedId = useId();
  const controlId = getFieldId(id, generatedId);
  const descriptionId = description ? `${controlId}-description` : undefined;
  const messageId = message ? `${controlId}-message` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [descriptionId, messageId, errorId]
    .filter(Boolean)
    .join(" ");
  const isInvalid = Boolean(error) || variant === "error";
  const resolvedStatusLabel =
    statusLabel ??
    (disabled
      ? "Disabled"
      : readOnly
        ? "Read-only"
        : variant === "draft"
          ? "Draft"
          : variant === "official"
            ? "Official"
            : null);
  const controlProps: FieldControlProps = {
    id: controlId,
    variant,
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
    ...(isInvalid ? { "aria-invalid": true } : {}),
    ...(required ? { "aria-required": true, required: true } : {}),
    ...(disabled ? { disabled: true } : {}),
    ...(readOnly ? { readOnly: true } : {})
  };
  const messagePrefix = messagePrefixes[variant];

  return (
    <div
      data-disabled={disabled || undefined}
      data-invalid={isInvalid || undefined}
      data-readonly={readOnly || undefined}
      data-slot="field"
      data-variant={variant}
      className={classes(
        "flex flex-col gap-2 border-l-2 pl-3",
        "data-[disabled=true]:opacity-75",
        fieldVariants[variant],
        disabled && "border-[var(--state-archived-border)]",
        className
      )}
      {...props}
    >
      {label || resolvedStatusLabel ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {label ? (
            <Label
              disabled={disabled}
              htmlFor={controlId}
              optional={optional}
              readOnly={readOnly}
              required={required}
              variant={variant}
            >
              {label}
            </Label>
          ) : null}
          {resolvedStatusLabel ? (
            <span className="font-mono text-[0.68rem] font-semibold uppercase leading-5 text-muted-foreground">
              {resolvedStatusLabel}
            </span>
          ) : null}
        </div>
      ) : null}
      {typeof children === "function" ? children(controlProps) : children}
      {description ? (
        <p
          id={descriptionId}
          className="text-sm leading-6 text-muted-foreground"
        >
          {description}
        </p>
      ) : null}
      {message ? (
        <p
          id={messageId}
          className={classes("text-sm leading-6", messageVariants[variant])}
        >
          {messagePrefix ? <strong>{messagePrefix} </strong> : null}
          {message}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm font-medium leading-6 text-[var(--state-error-text)]"
        >
          <strong>Needs attention: </strong>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Field, FieldGroup };
export type { FieldControlProps, FieldProps };
