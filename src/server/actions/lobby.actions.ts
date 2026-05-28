"use server";

import { revalidatePath } from "next/cache";

import { updateLobbyTurnOrderForCurrentUser } from "@/server/services/update-turn-order.service";
import type { UpdateTurnOrderActionState } from "@/types/lobby";

async function updateLobbyTurnOrderAction(
  _previousState: UpdateTurnOrderActionState,
  formData: FormData
): Promise<UpdateTurnOrderActionState> {
  const result = await updateLobbyTurnOrderForCurrentUser(formData);

  if (result.ok) {
    revalidatePath(`/games/${result.gameId}/lobby`);

    return {
      fieldErrors: {},
      formError: null,
      status: "success",
      values: result.values
    };
  }

  return {
    fieldErrors: result.fieldErrors ?? {},
    formError: result.formError ?? null,
    status: "error",
    values: result.values
  };
}

export { updateLobbyTurnOrderAction };
