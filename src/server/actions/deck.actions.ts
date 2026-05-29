"use server";

import { revalidatePath } from "next/cache";

import { createDraftDeckForCurrentUser } from "@/server/services/create-draft-deck.service";
import type { CreateDraftDeckActionState } from "@/types/deck";

async function createDraftDeckAction(
  _previousState: CreateDraftDeckActionState,
  formData: FormData
): Promise<CreateDraftDeckActionState> {
  const result = await createDraftDeckForCurrentUser(formData);

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

export { createDraftDeckAction };
