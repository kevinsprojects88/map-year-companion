"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { ValidationAlert } from "@/components/feedback/validation-alert";
import { Button } from "@/components/ui/button";
import { lockDeckAction } from "@/server/actions/deck-lock.actions";
import type { LockDeckActionState } from "@/types/deck";

type LockDeckFormProps = {
  gameId: string;
};

function getInitialLockDeckActionState(gameId: string): LockDeckActionState {
  return {
    fieldErrors: {},
    formError: null,
    status: "idle",
    successMessage: null,
    values: {
      gameId
    }
  };
}

function LockDeckSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      loading={pending}
      loadingText="Locking deck"
      type="submit"
      variant="official"
    >
      Lock deck
    </Button>
  );
}

function LockDeckForm({ gameId }: LockDeckFormProps) {
  const [state, formAction] = useActionState(
    lockDeckAction,
    getInitialLockDeckActionState(gameId)
  );
  const fieldErrorMessages = [state.fieldErrors.gameId].filter(
    (message): message is string => Boolean(message)
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input name="gameId" type="hidden" value={gameId} />

      <ValidationAlert
        messages={[
          "Locking prevents further manual card edits.",
          "Locking does not start the game or create turns."
        ]}
        title="Before locking"
        variant="warning"
      />

      {fieldErrorMessages.length ? (
        <ValidationAlert
          messages={fieldErrorMessages}
          title="Deck not locked"
          variant="error"
        />
      ) : null}

      {state.formError ? (
        <ValidationAlert
          messages={[state.formError]}
          title="Deck not locked"
          variant="error"
        />
      ) : null}

      {state.status === "success" && state.successMessage ? (
        <ValidationAlert
          messages={[state.successMessage]}
          title="Deck locked"
          variant="success"
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <LockDeckSubmitButton />
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          The server rechecks membership, deck status, all 52 weeks, duplicate
          weeks, and non-blank prompt text before saving the locked state.
        </p>
      </div>
    </form>
  );
}

export { LockDeckForm, getInitialLockDeckActionState };
export type { LockDeckFormProps };
