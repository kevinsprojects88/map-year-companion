"use server";

import { revalidatePath } from "next/cache";

import { lockDeckForCurrentUser } from "@/server/services/lock-deck.service";
import type { LockDeckActionState } from "@/types/deck";

async function lockDeckAction(
  _previousState: LockDeckActionState,
  formData: FormData
): Promise<LockDeckActionState> {
  const result = await lockDeckForCurrentUser(formData);

  if (result.ok) {
    revalidatePath(`/games/${result.gameId}/setup/deck`);
    revalidatePath(`/games/${result.gameId}/lobby`);

    return {
      fieldErrors: {},
      formError: null,
      status: "success",
      successMessage: result.message,
      values: result.values
    };
  }

  return {
    fieldErrors: result.fieldErrors ?? {},
    formError: result.formError ?? null,
    status: "error",
    successMessage: null,
    values: result.values
  };
}

export { lockDeckAction };
