import { forwardRef, type ComponentPropsWithoutRef } from "react";

import type { TextareaVariant } from "@/types/form";

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  variant?: TextareaVariant;
};

const textareaVariants: Record<TextareaVariant, string> = {
  default: "border-border bg-card",
  error: "border-2 border-[var(--state-error-border)] bg-[var(--state-error-bg)]",
  success:
    "border-2 border-[var(--state-success-border)] bg-[var(--state-success-bg)]",
  draft:
    "border-2 border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-bg)]",
  official:
    "border-2 border-[var(--state-official-border)] bg-[var(--state-official-bg)]",
  chat: "border-border bg-card",
  cardPrompt:
    "border-2 border-dashed border-[var(--state-poll-border)] bg-[var(--state-poll-bg)]"
};

const textareaReadOnlyVariants: Record<TextareaVariant, string> = {
  default:
    "cursor-default border-[var(--state-archived-border)] bg-[var(--state-archived-bg)] text-[var(--state-archived-text)]",
  error:
    "cursor-default border-[var(--state-error-border)] bg-[var(--state-error-surface)] text-[var(--state-error-text)]",
  success:
    "cursor-default border-[var(--state-success-border)] bg-[var(--state-success-surface)] text-[var(--state-success-text)]",
  draft:
    "cursor-default border-dashed border-[var(--state-draft-border)] bg-[var(--state-draft-surface)] text-[var(--state-draft-text)]",
  official:
    "cursor-default border-[var(--state-official-border)] bg-[var(--state-official-surface)] text-[var(--state-official-text)]",
  chat:
    "cursor-default border-[var(--state-archived-border)] bg-[var(--state-archived-bg)] text-[var(--state-archived-text)]",
  cardPrompt:
    "cursor-default border-dashed border-[var(--state-poll-border)] bg-[var(--state-poll-surface)] text-[var(--state-poll-text)]"
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function isInvalid(
  ariaInvalid: ComponentPropsWithoutRef<"textarea">["aria-invalid"],
  variant: TextareaVariant
) {
  return variant === "error" || ariaInvalid === true || ariaInvalid === "true";
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    "aria-invalid": ariaInvalid,
    className,
    readOnly,
    variant = "default",
    ...props
  },
  ref
) {
  const invalid = isInvalid(ariaInvalid, variant);

  return (
    <textarea
      ref={ref}
      readOnly={readOnly}
      aria-invalid={invalid ? true : ariaInvalid}
      data-readonly={readOnly || undefined}
      data-slot="textarea"
      data-variant={variant}
      className={classes(
        "flex min-h-28 w-full resize-y rounded-md border px-3 py-2.5 text-sm leading-6 text-foreground shadow-paper-sm",
        "transition-colors duration-150 placeholder:text-muted-foreground/70",
        "focus-visible:border-[var(--border-focus)] focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70",
        variant === "chat" && "min-h-24 rounded-lg",
        variant === "cardPrompt" && "min-h-36",
        textareaVariants[variant],
        "[aria-invalid=true]:border-[var(--state-error-border)] [aria-invalid=true]:bg-[var(--state-error-bg)]",
        readOnly && textareaReadOnlyVariants[variant],
        className
      )}
      {...props}
    />
  );
});

export { Textarea };
export type { TextareaProps };
