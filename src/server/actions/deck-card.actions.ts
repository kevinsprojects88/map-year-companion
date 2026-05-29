"use server";

import { revalidatePath } from "next/cache";

import { upsertDeckCardForCurrentUser } from "@/server/services/upsert-deck-card.service";
import type { UpsertDeckCardActionState } from "@/types/deck";

async function upsertDeckCardAction(
  _previousState: UpsertDeckCardActionState,
  formData: FormData
): Promise<UpsertDeckCardActionState> {
  const result = await upsertDeckCardForCurrentUser(formData);

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

export { upsertDeckCardAction };
