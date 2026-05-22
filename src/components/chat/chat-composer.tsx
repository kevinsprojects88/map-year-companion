"use client";

import {
  useRef,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type KeyboardEvent
} from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type ChatComposerProps = Omit<ComponentPropsWithoutRef<"form">, "onSubmit"> & {
  defaultValue?: string;
  disabled?: boolean;
  disabledReason?: string;
  failed?: boolean;
  helperText?: string;
  label?: string;
  onSend?: (message: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  sendButtonLabel?: string;
  sending?: boolean;
  value?: string;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ChatComposer({
  className,
  defaultValue,
  disabled = false,
  disabledReason,
  failed = false,
  helperText,
  label = "Chat message draft",
  onSend,
  placeholder = "Write a placeholder table note...",
  readOnly = false,
  sendButtonLabel = "Send",
  sending = false,
  value,
  ...props
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inactive = disabled || readOnly || sending;
  const controlVariant = failed ? "error" : "chat";
  const statusLabel = disabled
    ? "Disabled"
    : readOnly
      ? "Read-only"
      : sending
        ? "Sending"
        : failed
          ? "Needs attention"
          : "Ready";
  const resolvedReason =
    disabledReason ??
    (disabled
      ? "Chat is unavailable in this placeholder state."
      : readOnly
        ? "This mock composer is read-only and will not send messages."
        : sending
          ? "Sending state is shown for component review only."
          : undefined);
  const resolvedHelper =
    helperText ??
    "Display-only composer. No message is persisted, broadcast, or connected to game state.";

  function getCurrentValue() {
    return textareaRef.current?.value ?? value ?? defaultValue ?? "";
  }

  function submitComposer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (inactive) {
      return;
    }

    const message = getCurrentValue().trim();

    if (message) {
      onSend?.(message);
    }
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form
      data-failed={failed || undefined}
      data-readonly={readOnly || undefined}
      data-sending={sending || undefined}
      data-slot="chat-composer"
      className={classes(
        "rounded-lg border border-border bg-surface p-4 shadow-paper-sm",
        failed && "border-[var(--state-error-border)] bg-[var(--state-error-bg)]",
        readOnly &&
          "border-[var(--state-archived-border)] bg-[var(--state-archived-bg)]",
        className
      )}
      onSubmit={submitComposer}
      {...props}
    >
      <Field
        disabled={disabled}
        error={failed ? "The previous placeholder message failed to send." : undefined}
        label={label}
        message={resolvedHelper}
        readOnly={readOnly}
        statusLabel={statusLabel}
        variant={failed ? "error" : "default"}
      >
        {(controlProps) => (
          <Textarea
            {...controlProps}
            ref={textareaRef}
            defaultValue={defaultValue}
            onKeyDown={handleTextareaKeyDown}
            placeholder={placeholder}
            value={value}
            variant={controlVariant}
          />
        )}
      </Field>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-h-6 flex-1">
          {resolvedReason ? (
            <p className="rounded-md border border-[var(--state-process-border)] bg-[var(--state-process-surface)] px-3 py-2 text-sm leading-6 text-[var(--state-process-text)]">
              {resolvedReason}
            </p>
          ) : failed ? (
            <p className="rounded-md border border-[var(--state-error-border)] bg-[var(--state-error-surface)] px-3 py-2 text-sm font-medium leading-6 text-[var(--state-error-text)]">
              Failed state is visible in text; use the field above to inspect
              recovery styling.
            </p>
          ) : null}
        </div>

        <Button
          aria-busy={sending || undefined}
          aria-disabled={inactive || undefined}
          data-inactive={inactive || undefined}
          type="submit"
          variant={failed ? "destructive" : "secondary"}
          className="data-[inactive=true]:cursor-not-allowed data-[inactive=true]:opacity-55"
        >
          {sending ? (
            <span
              aria-hidden="true"
              className="size-4 rounded-full border-2 border-current/30 border-t-current motion-safe:animate-spin"
            />
          ) : null}
          {sending ? "Sending..." : sendButtonLabel}
        </Button>
      </div>
    </form>
  );
}

export { ChatComposer };
export type { ChatComposerProps };
