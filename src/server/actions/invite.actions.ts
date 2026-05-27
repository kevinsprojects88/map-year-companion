"use server";

import {
  getAcceptGameInviteValues,
  getCreateGameInviteValues
} from "@/lib/validation/invite.schema";
import { acceptGameInviteForCurrentUser } from "@/server/services/accept-game-invite.service";
import { createGameInviteForCurrentUser } from "@/server/services/create-game-invite.service";
import type {
  AcceptGameInviteActionState,
  CreateGameInviteActionState
} from "@/types/invite";

async function acceptGameInviteAction(
  _previousState: AcceptGameInviteActionState,
  formData: FormData
): Promise<AcceptGameInviteActionState> {
  const result = await acceptGameInviteForCurrentUser(formData);

  if (result.ok) {
    return {
      fieldErrors: {},
      formError: null,
      gameId: result.gameId,
      membershipId: result.membershipId,
      status: "success",
      values: getAcceptGameInviteValues(formData)
    };
  }

  return {
    fieldErrors: result.fieldErrors ?? {},
    formError: result.formError ?? null,
    gameId: null,
    membershipId: null,
    status: "error",
    values: result.values
  };
}

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

export { acceptGameInviteAction, createGameInviteAction };
