import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "process"
  | "draft"
  | "official";

type ButtonSize = "sm" | "default" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border-primary bg-primary text-primary-foreground hover:bg-[var(--moss-800)]",
  secondary:
    "border-border bg-secondary text-secondary-foreground hover:border-border-strong hover:bg-[var(--paper-200)]",
  ghost:
    "border-transparent bg-transparent text-foreground hover:border-border hover:bg-muted",
  destructive:
    "border-[var(--state-error-border)] bg-[var(--state-error-accent)] text-[var(--text-inverse)] hover:bg-[var(--error-700)]",
  process:
    "border-[var(--state-process-border)] bg-[var(--state-process-surface)] text-[var(--state-process-text)] hover:bg-[var(--state-process-bg)]",
  draft:
    "border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-surface)] text-[var(--state-draft-text)] hover:bg-[var(--state-draft-bg)]",
  official:
    "border-[var(--state-official-border)] bg-[var(--state-official-accent)] text-[var(--text-inverse)] hover:bg-[var(--moss-800)]"
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 py-2 text-sm",
  default: "min-h-10 px-4 py-2.5 text-sm",
  lg: "min-h-11 px-5 py-3 text-base",
  icon: "size-10 p-0"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Button({
  className,
  variant = "primary",
  size = "default",
  loading = false,
  loadingText,
  iconStart,
  iconEnd,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const visibleChildren = loading && loadingText ? loadingText : children;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      data-slot="button"
      data-size={size}
      data-variant={variant}
      className={classes(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-semibold leading-none",
        "transition-colors duration-150",
        "disabled:cursor-not-allowed disabled:opacity-55",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-4 rounded-full border-2 border-current/30 border-t-current motion-safe:animate-spin"
        />
      ) : iconStart ? (
        <span data-icon="inline-start" className="inline-flex items-center">
          {iconStart}
        </span>
      ) : null}
      {visibleChildren ? <span>{visibleChildren}</span> : null}
      {loading && !loadingText ? (
        <span className="sr-only">Loading</span>
      ) : null}
      {!loading && iconEnd ? (
        <span data-icon="inline-end" className="inline-flex items-center">
          {iconEnd}
        </span>
      ) : null}
    </button>
  );
}

export { Button };
export type { ButtonProps, ButtonSize, ButtonVariant };
