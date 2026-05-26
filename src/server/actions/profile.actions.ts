"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthenticatedUser } from "@/lib/auth/require-user";
import { validateProfileDisplayName } from "@/lib/validation/profile.schema";
import type { ProfileActionState } from "@/types/profile";

const GENERIC_SAVE_ERROR =
  "We could not save your profile right now. Try again in a moment.";

function createProfileActionErrorState({
  displayName,
  displayNameError,
  formError
}: {
  displayName: string;
  displayNameError?: string;
  formError?: string;
}): ProfileActionState {
  return {
    displayName,
    fieldErrors: displayNameError ? { displayName: displayNameError } : {},
    formError: formError ?? null,
    status: "error"
  };
}

async function saveProfileAction(
  _previousState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const rawDisplayName = formData.get("display_name");
  const displayNameValue =
    typeof rawDisplayName === "string" ? rawDisplayName : "";
  const validation = validateProfileDisplayName(rawDisplayName);

  if (!validation.ok) {
    return createProfileActionErrorState({
      displayName: displayNameValue,
      displayNameError: validation.message
    });
  }

  const authContext = await getAuthenticatedUser();

  if (!authContext) {
    return createProfileActionErrorState({
      displayName: validation.displayName,
      formError: "Sign in again before saving your profile."
    });
  }

  const { supabase, user } = authContext;
  const { data: existingProfile, error: lookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (lookupError) {
    return createProfileActionErrorState({
      displayName: validation.displayName,
      formError: GENERIC_SAVE_ERROR
    });
  }

  const { error: saveError } = existingProfile
    ? await supabase
        .from("profiles")
        .update({ display_name: validation.displayName })
        .eq("id", user.id)
        .select("id")
        .single()
    : await supabase
        .from("profiles")
        .insert({
          display_name: validation.displayName,
          id: user.id
        })
        .select("id")
        .single();

  if (saveError) {
    return createProfileActionErrorState({
      displayName: validation.displayName,
      formError: GENERIC_SAVE_ERROR
    });
  }

  revalidatePath("/onboarding/profile");
  redirect("/");
}

export { saveProfileAction };
