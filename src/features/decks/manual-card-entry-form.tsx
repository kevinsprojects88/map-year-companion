"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { ValidationAlert } from "@/components/feedback/validation-alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CARD_KEY_MAX_LENGTH,
  CARD_PROMPT_TEXT_MAX_LENGTH,
  CARD_SEASON_MAX_LENGTH,
  MAX_CARD_WEEK_NUMBER,
  MIN_CARD_WEEK_NUMBER
} from "@/lib/validation/deck-card.schema";
import { upsertDeckCardAction } from "@/server/actions/deck-card.actions";
import type { UpsertDeckCardActionState } from "@/types/deck";

type ManualCardEntryFormProps = {
  gameId: string;
};

function getInitialUpsertDeckCardActionState(
  gameId: string
): UpsertDeckCardActionState {
  return {
    fieldErrors: {},
    formError: null,
    status: "idle",
    successMessage: null,
    values: {
      cardKey: "",
      gameId,
      promptText: "",
      season: "",
      weekNumber: ""
    }
  };
}

function ManualCardEntrySubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      loading={pending}
      loadingText="Saving card"
      type="submit"
      variant="draft"
    >
      Save card
    </Button>
  );
}

function ManualCardEntryForm({ gameId }: ManualCardEntryFormProps) {
  const [state, formAction] = useActionState(
    upsertDeckCardAction,
    getInitialUpsertDeckCardActionState(gameId)
  );
  const fieldErrorMessages = [
    state.fieldErrors.gameId,
    state.fieldErrors.weekNumber,
    state.fieldErrors.cardKey,
    state.fieldErrors.season,
    state.fieldErrors.promptText
  ].filter((message): message is string => Boolean(message));
  const weekInputKey = `${state.status}-${state.values.weekNumber}`;
  const cardKeyInputKey = `${state.status}-${state.values.cardKey}`;
  const seasonInputKey = `${state.status}-${state.values.season}`;
  const promptTextInputKey = `${state.status}-${state.values.promptText}`;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input name="gameId" type="hidden" value={gameId} />

      <FieldGroup>
        <div className="grid gap-5 md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
          <Field
            description="Use 1 through 52."
            error={state.fieldErrors.weekNumber}
            label="Week number"
            required
            variant={state.fieldErrors.weekNumber ? "error" : "draft"}
          >
            {(controlProps) => (
              <Input
                {...controlProps}
                defaultValue={state.values.weekNumber}
                inputMode="numeric"
                key={weekInputKey}
                max={MAX_CARD_WEEK_NUMBER}
                min={MIN_CARD_WEEK_NUMBER}
                name="weekNumber"
                placeholder="1"
                type="number"
              />
            )}
          </Field>

          <Field
            description="Required user-provided key, up to 80 characters."
            error={state.fieldErrors.cardKey}
            label="Card key"
            required
            variant={state.fieldErrors.cardKey ? "error" : "draft"}
          >
            {(controlProps) => (
              <Input
                {...controlProps}
                autoComplete="off"
                defaultValue={state.values.cardKey}
                key={cardKeyInputKey}
                maxLength={CARD_KEY_MAX_LENGTH}
                name="cardKey"
                placeholder="test-week-1"
              />
            )}
          </Field>
        </div>

        <Field
          description="Optional plain-text label, up to 40 characters."
          error={state.fieldErrors.season}
          label="Season"
          optional
          variant={state.fieldErrors.season ? "error" : "default"}
        >
          {(controlProps) => (
            <Input
              {...controlProps}
              autoComplete="off"
              defaultValue={state.values.season}
              key={seasonInputKey}
              maxLength={CARD_SEASON_MAX_LENGTH}
              name="season"
              placeholder="Spring"
            />
          )}
        </Field>

        <Field
          description="Optional user-provided placeholder text, up to 5000 characters. Empty text is saved as blank."
          error={state.fieldErrors.promptText}
          label="Prompt text"
          optional
          variant={state.fieldErrors.promptText ? "error" : "draft"}
        >
          {(controlProps) => (
            <Textarea
              {...controlProps}
              defaultValue={state.values.promptText}
              key={promptTextInputKey}
              maxLength={CARD_PROMPT_TEXT_MAX_LENGTH}
              name="promptText"
              placeholder="Enter user-provided placeholder text."
              rows={6}
              variant="cardPrompt"
            />
          )}
        </Field>
      </FieldGroup>

      {fieldErrorMessages.length ? (
        <ValidationAlert
          messages={fieldErrorMessages}
          title="Card not saved"
          variant="error"
        />
      ) : null}

      {state.formError ? (
        <ValidationAlert
          messages={[state.formError]}
          title="Card not saved"
          variant="error"
        />
      ) : null}

      {state.status === "success" && state.successMessage ? (
        <ValidationAlert
          messages={[state.successMessage]}
          title="Card saved"
          variant="success"
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <ManualCardEntrySubmitButton />
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Saves one card row for this game&apos;s draft deck. It does not import
          files, lock the deck, start the game, or add bundled card content.
        </p>
      </div>
    </form>
  );
}

export { ManualCardEntryForm, getInitialUpsertDeckCardActionState };
export type { ManualCardEntryFormProps };
