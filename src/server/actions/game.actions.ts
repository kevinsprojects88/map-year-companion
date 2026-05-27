"use server";

import { createGameForCurrentUser } from "@/server/services/create-game.service";
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

async function createGameAction(
  _previousState: CreateGameActionState,
  formData: FormData
): Promise<CreateGameActionState> {
  const result = await createGameForCurrentUser(formData);

  if (result.ok) {
    return {
      ...initialCreateGameActionState,
      gameId: result.gameId,
      status: "success"
    };
  }

  return {
    fieldErrors: result.fieldErrors ?? {},
    formError: result.formError ?? null,
    gameId: null,
    status: "error",
    values: result.values
  };
}

export { createGameAction, initialCreateGameActionState };
