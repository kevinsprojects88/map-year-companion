"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createGameForCurrentUser } from "@/server/services/create-game.service";
import type { CreateGameActionState } from "@/types/game";

async function createGameAction(
  _previousState: CreateGameActionState,
  formData: FormData
): Promise<CreateGameActionState> {
  const result = await createGameForCurrentUser(formData);

  if (result.ok) {
    revalidatePath("/dashboard");
    redirect(`/games/${result.gameId}/lobby`);
  }

  return {
    fieldErrors: result.fieldErrors ?? {},
    formError: result.formError ?? null,
    gameId: null,
    status: "error",
    values: result.values
  };
}

export { createGameAction };
