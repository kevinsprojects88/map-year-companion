import "server-only";

import { getAuthenticatedUser } from "@/lib/auth/require-user";
import {
  validateCreateDraftDeckInput,
  type CreateDraftDeckFieldErrors,
  type CreateDraftDeckInput,
  type CreateDraftDeckValues
} from "@/lib/validation/deck.schema";

const GENERIC_CREATE_DRAFT_DECK_ERROR =
  "We could not create a draft deck right now. Try again in a moment.";

type CreateDraftDeckForCurrentUserResult =
  | {
      gameId: string;
      message: string;
      ok: true;
      values: CreateDraftDeckValues;
    }
  | {
      fieldErrors?: CreateDraftDeckFieldErrors;
      formError?: string;
      ok: false;
      values: CreateDraftDeckValues;
    };

type PermissionRow = {
  games: { status: string } | { status: string }[] | null;
};

function getRelatedGameStatus(game: PermissionRow["games"]) {
  const relatedGame = Array.isArray(game) ? (game[0] ?? null) : game;

  return relatedGame?.status ?? null;
}

async function createDraftDeckForCurrentUser(
  input: CreateDraftDeckInput
): Promise<CreateDraftDeckForCurrentUserResult> {
  const validation = validateCreateDraftDeckInput(input);

  if (!validation.ok) {
    return {
      fieldErrors: validation.fieldErrors,
      ok: false,
      values: validation.values
    };
  }

  const authContext = await getAuthenticatedUser();

  if (!authContext) {
    return {
      formError: "Sign in again before creating a draft deck.",
      ok: false,
      values: validation.values
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
      formError: GENERIC_CREATE_DRAFT_DECK_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (!profile) {
    return {
      formError: "Finish your profile before creating a draft deck.",
      ok: false,
      values: validation.values
    };
  }

  const { data: permission, error: permissionError } = await supabase
    .from("game_memberships")
    .select(
      `
        id,
        games!inner (
          status
        )
      `
    )
    .eq("game_id", validation.data.gameId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .in("role", ["owner", "admin"])
    .maybeSingle();

  if (permissionError) {
    return {
      formError: GENERIC_CREATE_DRAFT_DECK_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (!permission) {
    return {
      formError:
        "Only active owner/admin members can create draft decks for this game.",
      ok: false,
      values: validation.values
    };
  }

  if (getRelatedGameStatus((permission as PermissionRow).games) !== "setup") {
    return {
      formError: "Draft decks can only be created while the game is in setup.",
      ok: false,
      values: validation.values
    };
  }

  const { data: existingDeck, error: existingDeckError } = await supabase
    .from("decks")
    .select("id")
    .eq("game_id", validation.data.gameId)
    .maybeSingle();

  if (existingDeckError) {
    return {
      formError: GENERIC_CREATE_DRAFT_DECK_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (existingDeck) {
    return {
      gameId: validation.data.gameId,
      message: "A draft deck already exists for this game.",
      ok: true,
      values: validation.values
    };
  }

  const { error: insertError } = await supabase.from("decks").insert({
    created_by: user.id,
    game_id: validation.data.gameId,
    source_type: "placeholder"
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return {
        gameId: validation.data.gameId,
        message: "A draft deck already exists for this game.",
        ok: true,
        values: validation.values
      };
    }

    return {
      formError: GENERIC_CREATE_DRAFT_DECK_ERROR,
      ok: false,
      values: validation.values
    };
  }

  return {
    gameId: validation.data.gameId,
    message:
      "Placeholder draft deck created. No card text or official content was added.",
    ok: true,
    values: validation.values
  };
}

export { createDraftDeckForCurrentUser };
export type { CreateDraftDeckForCurrentUserResult };
