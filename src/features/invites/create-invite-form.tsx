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
import { createGameInviteAction } from "@/server/actions/invite.actions";
import type { CreateGameInviteActionState } from "@/types/invite";

type CreateInviteFormProps = {
  gameId: string;
};

function getInitialCreateInviteActionState(
  gameId: string
): CreateGameInviteActionState {
  return {
    fieldErrors: {},
    formError: null,
    invite: null,
    status: "idle",
    values: {
      expiresAt: "",
      gameId,
      maxUses: ""
    }
  };
}

function CreateInviteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} loadingText="Creating invite" type="submit">
      Create invite
    </Button>
  );
}

function CreateInviteForm({ gameId }: CreateInviteFormProps) {
  const [state, formAction] = useActionState(
    createGameInviteAction,
    getInitialCreateInviteActionState(gameId)
  );
  const fieldErrorMessages = [
    state.fieldErrors.gameId,
    state.fieldErrors.expiresAt,
    state.fieldErrors.maxUses
  ].filter((message): message is string => Boolean(message));

  return (
    <Card variant="raised" className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create invite</CardTitle>
        <CardDescription>
          Create one private invite path to share directly with another signed-in
          player.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-5">
          <input name="gameId" type="hidden" value={gameId} />

          <div className="rounded-lg border border-dashed border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
            The raw invite path is shown once after creation. The database keeps
            only the token hash.
          </div>

          {fieldErrorMessages.length ? (
            <ValidationAlert
              messages={fieldErrorMessages}
              title="Invite not created"
              variant="error"
            />
          ) : null}

          {state.formError ? (
            <ValidationAlert
              messages={[state.formError]}
              title="Invite not created"
              variant="error"
            />
          ) : null}

          {state.invite ? (
            <section
              aria-live="polite"
              className="rounded-lg border border-[var(--state-success-border)] bg-[var(--state-success-bg)] p-4 text-[var(--state-success-text)] shadow-paper-sm"
              role="status"
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <p className="font-mono text-xs font-semibold uppercase">
                    Shown once
                  </p>
                  <h3 className="text-lg font-semibold leading-tight">
                    Invite path created
                  </h3>
                </div>
                <p className="text-sm leading-6">
                  Share this private path with the player you want to invite.
                </p>
                <code className="block overflow-x-auto rounded-md border border-[var(--state-success-border)] bg-card p-3 font-mono text-sm text-foreground">
                  {state.invite.invitePath}
                </code>
              </div>
            </section>
          ) : null}

          <CreateInviteSubmitButton />
        </form>
      </CardContent>
      <CardFooter>
        This creates no email, invite list, revocation flow, or player list.
      </CardFooter>
    </Card>
  );
}

export { CreateInviteForm };
export type { CreateInviteFormProps };
