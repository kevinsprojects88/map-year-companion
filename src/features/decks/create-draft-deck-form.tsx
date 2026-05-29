"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { ValidationAlert } from "@/components/feedback/validation-alert";
import { Button } from "@/components/ui/button";
import { createDraftDeckAction } from "@/server/actions/deck.actions";
import type { CreateDraftDeckActionState } from "@/types/deck";

type CreateDraftDeckFormProps = {
  gameId: string;
};

function getInitialCreateDraftDeckActionState(
  gameId: string
): CreateDraftDeckActionState {
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

function CreateDraftDeckSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      loading={pending}
      loadingText="Creating draft"
      type="submit"
      variant="draft"
    >
      Create placeholder draft deck
    </Button>
  );
}

function CreateDraftDeckForm({ gameId }: CreateDraftDeckFormProps) {
  const [state, formAction] = useActionState(
    createDraftDeckAction,
    getInitialCreateDraftDeckActionState(gameId)
  );
  const fieldErrorMessages = [state.fieldErrors.gameId].filter(
    (message): message is string => Boolean(message)
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input name="gameId" type="hidden" value={gameId} />

      {fieldErrorMessages.length ? (
        <ValidationAlert
          messages={fieldErrorMessages}
          title="Draft deck not created"
          variant="error"
        />
      ) : null}

      {state.formError ? (
        <ValidationAlert
          messages={[state.formError]}
          title="Draft deck not created"
          variant="error"
        />
      ) : null}

      {state.status === "success" && state.successMessage ? (
        <ValidationAlert
          messages={[state.successMessage]}
          title="Draft deck ready for setup"
          variant="success"
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <CreateDraftDeckSubmitButton />
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          This creates the game-specific draft deck shell only. It does not add
          card rows, card text, imports, uploads, or official content.
        </p>
      </div>
    </form>
  );
}

export { CreateDraftDeckForm, getInitialCreateDraftDeckActionState };
export type { CreateDraftDeckFormProps };
