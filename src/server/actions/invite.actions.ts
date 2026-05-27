"use server";

import { getCreateGameInviteValues } from "@/lib/validation/invite.schema";
import { createGameInviteForCurrentUser } from "@/server/services/create-game-invite.service";
import type { CreateGameInviteActionState } from "@/types/invite";

async function createGameInviteAction(
  _previousState: CreateGameInviteActionState,
  formData: FormData
): Promise<CreateGameInviteActionState> {
  const result = await createGameInviteForCurrentUser(formData);

  if (result.ok) {
    return {
      fieldErrors: {},
      formError: null,
      invite: {
        inviteId: result.inviteId,
        invitePath: result.invitePath,
        token: result.token
      },
      status: "success",
      values: getCreateGameInviteValues(formData)
    };
  }

  return {
    fieldErrors: result.fieldErrors ?? {},
    formError: result.formError ?? null,
    invite: null,
    status: "error",
    values: result.values
  };
}

export { createGameInviteAction };
