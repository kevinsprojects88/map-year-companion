"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { ValidationAlert } from "@/components/feedback/validation-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { updateLobbyTurnOrderAction } from "@/server/actions/lobby.actions";
import type {
  LobbyRosterMemberViewModel,
  LobbyStatusViewModel,
  UpdateTurnOrderActionState
} from "@/types/lobby";

type TurnOrderFormProps = {
  gameId: string;
  roster: LobbyStatusViewModel["roster"];
};

function getInitialTurnOrderActionState({
  gameId,
  roster
}: TurnOrderFormProps): UpdateTurnOrderActionState {
  return {
    fieldErrors: {},
    formError: null,
    status: "idle",
    values: {
      gameId,
      orderedProfileIds: roster.members.map((member) => member.profileId)
    }
  };
}

function moveMember(
  members: LobbyRosterMemberViewModel[],
  fromIndex: number,
  toIndex: number
) {
  const nextMembers = [...members];
  const [movedMember] = nextMembers.splice(fromIndex, 1);

  if (!movedMember) {
    return members;
  }

  nextMembers.splice(toIndex, 0, movedMember);

  return nextMembers;
}

function TurnOrderSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} loadingText="Saving order" type="submit">
      Save turn order
    </Button>
  );
}

function TurnOrderForm({ gameId, roster }: TurnOrderFormProps) {
  const [orderedMembers, setOrderedMembers] = useState(roster.members);
  const [state, formAction] = useActionState(
    updateLobbyTurnOrderAction,
    getInitialTurnOrderActionState({ gameId, roster })
  );
  const fieldErrorMessages = [
    state.fieldErrors.gameId,
    state.fieldErrors.orderedProfileIds
  ].filter((message): message is string => Boolean(message));

  return (
    <section aria-labelledby="turn-order-form-heading">
      <Card variant="official">
        <CardHeader className="gap-y-3">
          <div className="col-start-1 flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="official">Owner/admin</Badge>
              <Badge variant="secondary">{roster.memberCountLabel}</Badge>
            </div>
            <CardTitle id="turn-order-form-heading">Turn order</CardTitle>
            <CardDescription>
              Reorder active members only. This does not remove players, change
              roles, change statuses, or start the game.
            </CardDescription>
          </div>
          <CardAction>
            <Badge variant="outline">{orderedMembers.length}</Badge>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="flex flex-col gap-5">
            <input name="gameId" type="hidden" value={gameId} />
            {orderedMembers.map((member) => (
              <input
                key={member.profileId}
                name="orderedProfileIds"
                type="hidden"
                value={member.profileId}
              />
            ))}

            {fieldErrorMessages.length ? (
              <ValidationAlert
                messages={fieldErrorMessages}
                title="Turn order not saved"
                variant="error"
              />
            ) : null}

            {state.formError ? (
              <ValidationAlert
                messages={[state.formError]}
                title="Turn order not saved"
                variant="error"
              />
            ) : null}

            {state.status === "success" ? (
              <ValidationAlert
                messages={["Turn order was saved for all active members."]}
                title="Turn order saved"
                variant="success"
              />
            ) : null}

            <ol className="grid gap-3">
              {orderedMembers.map((member, index) => {
                const isFirst = index === 0;
                const isLast = index === orderedMembers.length - 1;

                return (
                  <li
                    className="grid gap-3 rounded-md border border-border bg-card p-4 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-center"
                    key={member.membershipId}
                  >
                    <div className="flex min-h-12 min-w-12 items-center justify-center rounded-md border border-[var(--state-official-border)] bg-[var(--state-official-surface)] font-mono text-lg font-semibold text-[var(--state-official-text)]">
                      {index + 1}
                    </div>

                    <div className="flex min-w-0 flex-col gap-2">
                      <h3 className="truncate text-lg font-semibold leading-tight text-foreground">
                        {member.displayName}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{member.roleLabel}</Badge>
                        <Badge variant="success">{member.statusLabel}</Badge>
                        {member.isCurrentUser ? (
                          <Badge variant="outline">You</Badge>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <Button
                        aria-label={`Move ${member.displayName} up`}
                        disabled={isFirst}
                        onClick={() =>
                          setOrderedMembers((currentMembers) =>
                            moveMember(currentMembers, index, index - 1)
                          )
                        }
                        type="button"
                        variant="secondary"
                      >
                        Up
                      </Button>
                      <Button
                        aria-label={`Move ${member.displayName} down`}
                        disabled={isLast}
                        onClick={() =>
                          setOrderedMembers((currentMembers) =>
                            moveMember(currentMembers, index, index + 1)
                          )
                        }
                        type="button"
                        variant="secondary"
                      >
                        Down
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ol>

            <TurnOrderSubmitButton />
          </form>
        </CardContent>

        <CardFooter>
          Active members must be included exactly once before the database saves
          the order.
        </CardFooter>
      </Card>
    </section>
  );
}

export { TurnOrderForm };
export type { TurnOrderFormProps };
