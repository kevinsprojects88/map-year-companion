"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { ValidationAlert } from "@/components/feedback/validation-alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GAME_DESCRIPTION_MAX_LENGTH,
  GAME_NAME_MAX_LENGTH
} from "@/lib/validation/game.schema";
import { createGameAction } from "@/server/actions/game.actions";
import type { CreateGameActionState } from "@/types/game";

const initialCreateGameActionState: CreateGameActionState = {
  fieldErrors: {},
  formError: null,
  gameId: null,
  status: "idle",
  values: {
    description: "",
    name: ""
  }
};

function CreateGameSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} loadingText="Creating game" type="submit">
      Create Game
    </Button>
  );
}

function CreateGameForm() {
  const [state, formAction] = useActionState(
    createGameAction,
    initialCreateGameActionState
  );
  const nameError = state.fieldErrors.name ?? null;
  const descriptionError = state.fieldErrors.description ?? null;
  const nameInputKey = `${state.status}-${state.values.name}`;
  const descriptionInputKey = `${state.status}-${state.values.description}`;

  return (
    <Card variant="raised" className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create a private game</CardTitle>
        <CardDescription>
          Start a new private map-year space. Setup steps come later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-5">
          <FieldGroup>
            <Field
              description="Use 1 to 120 characters."
              error={nameError}
              label="Game name"
              required
              variant={nameError ? "error" : "default"}
            >
              {(controlProps) => (
                <Input
                  {...controlProps}
                  autoComplete="off"
                  defaultValue={state.values.name}
                  key={nameInputKey}
                  maxLength={GAME_NAME_MAX_LENGTH}
                  name="name"
                  placeholder="First Smoke Game"
                />
              )}
            </Field>

            <Field
              description="Optional plain-text note, up to 1000 characters."
              error={descriptionError}
              label="Description"
              optional
              variant={descriptionError ? "error" : "default"}
            >
              {(controlProps) => (
                <Textarea
                  {...controlProps}
                  defaultValue={state.values.description}
                  key={descriptionInputKey}
                  maxLength={GAME_DESCRIPTION_MAX_LENGTH}
                  name="description"
                  placeholder="A short note about the community or table."
                  rows={5}
                />
              )}
            </Field>
          </FieldGroup>

          {state.formError ? (
            <ValidationAlert
              messages={[state.formError]}
              title="Game not created"
              variant="error"
            />
          ) : null}

          <CreateGameSubmitButton />
        </form>
      </CardContent>
      <CardFooter>
        Creation uses the signed-in profile and creates owner membership in one
        server-controlled step.
      </CardFooter>
    </Card>
  );
}

export { CreateGameForm };
