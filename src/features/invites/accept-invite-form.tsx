"use client";

import Link from "next/link";
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
import { acceptGameInviteAction } from "@/server/actions/invite.actions";
import type { AcceptGameInviteActionState } from "@/types/invite";

type AcceptInviteFormProps = {
  token: string;
};

const initialAcceptInviteActionState: AcceptGameInviteActionState = {
  fieldErrors: {},
  formError: null,
  gameId: null,
  membershipId: null,
  status: "idle",
  values: {
    token: ""
  }
};

function AcceptInviteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} loadingText="Accepting invite" type="submit">
      Accept invite
    </Button>
  );
}

function AcceptInviteForm({ token }: AcceptInviteFormProps) {
  const [state, formAction] = useActionState(
    acceptGameInviteAction,
    initialAcceptInviteActionState
  );
  const tokenError = state.fieldErrors.token ?? null;

  return (
    <Card variant="raised" className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Join a private game</CardTitle>
        <CardDescription>
          Accepting this invite adds your signed-in profile as a player. The
          game controls the membership details after the invite is accepted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-5">
          <input name="token" type="hidden" value={token} />

          <div className="rounded-lg border border-dashed border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
            This page does not preview private game details. Continue only if
            you trust the invite link.
          </div>

          {tokenError ? (
            <ValidationAlert
              messages={[tokenError]}
              title="Invite link not accepted"
              variant="error"
            />
          ) : null}

          {state.formError ? (
            <ValidationAlert
              messages={[state.formError]}
              title="Invite not accepted"
              variant="error"
            />
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <AcceptInviteSubmitButton />
            <Link
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              href="/dashboard"
            >
              Back to dashboard
            </Link>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        The browser sends only the invite token. Game id, profile id, role,
        status, and turn order stay server-controlled.
      </CardFooter>
    </Card>
  );
}

export { AcceptInviteForm };
export type { AcceptInviteFormProps };
