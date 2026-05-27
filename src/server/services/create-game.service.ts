import "server-only";

import { getAuthenticatedUser } from "@/lib/auth/require-user";
import {
  validateCreateGameInput,
  type CreateGameFieldErrors,
  type CreateGameInput,
  type CreateGameValues
} from "@/lib/validation/game.schema";

const GENERIC_CREATE_GAME_ERROR =
  "We could not create the game right now. Try again in a moment.";

type CreateGameForCurrentUserResult =
  | {
      gameId: string;
      ok: true;
    }
  | {
      fieldErrors?: CreateGameFieldErrors;
      formError?: string;
      ok: false;
      values: CreateGameValues;
    };

async function createGameForCurrentUser(
  input: CreateGameInput
): Promise<CreateGameForCurrentUserResult> {
  const validation = validateCreateGameInput(input);

  if (!validation.ok) {
    return {
      fieldErrors: validation.fieldErrors,
      ok: false,
      values: validation.values
    };
  }

  const values = {
    description: validation.data.description ?? "",
    name: validation.data.name
  };
  const authContext = await getAuthenticatedUser();

  if (!authContext) {
    return {
      formError: "Sign in again before creating a game.",
      ok: false,
      values
    };
  }

  const { supabase, user } = authContext;
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return {
      formError: GENERIC_CREATE_GAME_ERROR,
      ok: false,
      values
    };
  }

  if (!profile) {
    return {
      formError: "Finish your profile before creating a game.",
      ok: false,
      values
    };
  }

  const { data: gameId, error: createError } = await supabase.rpc(
    "create_game_with_owner",
    {
      game_description: validation.data.description,
      game_name: validation.data.name
    }
  );

  if (createError || typeof gameId !== "string") {
    return {
      formError: GENERIC_CREATE_GAME_ERROR,
      ok: false,
      values
    };
  }

  return {
    gameId,
    ok: true
  };
}

export { createGameForCurrentUser };
export type { CreateGameForCurrentUserResult };
