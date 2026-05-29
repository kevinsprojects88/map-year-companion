import "server-only";

import { getAuthenticatedUser } from "@/lib/auth/require-user";
import {
  validateUpsertDeckCardInput,
  type UpsertDeckCardFieldErrors,
  type UpsertDeckCardInput,
  type UpsertDeckCardValues
} from "@/lib/validation/deck-card.schema";

const GENERIC_UPSERT_DECK_CARD_ERROR =
  "We could not save this card right now. Try again in a moment.";

type UpsertDeckCardForCurrentUserResult =
  | {
      gameId: string;
      message: string;
      ok: true;
      values: UpsertDeckCardValues;
    }
  | {
      fieldErrors?: UpsertDeckCardFieldErrors;
      formError?: string;
      ok: false;
      values: UpsertDeckCardValues;
    };

type PermissionRow = {
  games: { status: string } | { status: string }[] | null;
};

type DeckCardExistingRow = {
  id: string;
};

function getRelatedGameStatus(game: PermissionRow["games"]) {
  const relatedGame = Array.isArray(game) ? (game[0] ?? null) : game;

  return relatedGame?.status ?? null;
}

function getUniqueCardConflictMessage(code?: string) {
  return code === "23505"
    ? "That card key or week number is already used in this deck."
    : null;
}

async function upsertDeckCardForCurrentUser(
  input: UpsertDeckCardInput
): Promise<UpsertDeckCardForCurrentUserResult> {
  const validation = validateUpsertDeckCardInput(input);

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
      formError: "Sign in again before saving deck cards.",
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
      formError: GENERIC_UPSERT_DECK_CARD_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (!profile) {
    return {
      formError: "Finish your profile before saving deck cards.",
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
      formError: GENERIC_UPSERT_DECK_CARD_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (!permission) {
    return {
      formError: "Only active owner/admin members can save deck cards.",
      ok: false,
      values: validation.values
    };
  }

  if (getRelatedGameStatus((permission as PermissionRow).games) !== "setup") {
    return {
      formError: "Deck cards can only be saved while the game is in setup.",
      ok: false,
      values: validation.values
    };
  }

  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .select("id, status")
    .eq("game_id", validation.data.gameId)
    .maybeSingle();

  if (deckError) {
    return {
      formError: GENERIC_UPSERT_DECK_CARD_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (!deck) {
    return {
      formError: "Create the draft deck before saving cards.",
      ok: false,
      values: validation.values
    };
  }

  if (deck.status !== "draft") {
    return {
      formError: "Cards can only be edited while the deck is draft.",
      ok: false,
      values: validation.values
    };
  }

  const { data: existingCard, error: existingCardError } = await supabase
    .from("deck_cards")
    .select("id")
    .eq("deck_id", deck.id)
    .eq("week_number", validation.data.weekNumber)
    .maybeSingle();

  if (existingCardError) {
    return {
      formError: GENERIC_UPSERT_DECK_CARD_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (existingCard) {
    const { error: updateError } = await supabase
      .from("deck_cards")
      .update({
        card_key: validation.data.cardKey,
        prompt_text: validation.data.promptText,
        season: validation.data.season
      })
      .eq("id", (existingCard as DeckCardExistingRow).id);

    if (updateError) {
      const conflictMessage = getUniqueCardConflictMessage(updateError.code);

      return {
        fieldErrors: conflictMessage
          ? {
              cardKey: conflictMessage
            }
          : undefined,
        formError: conflictMessage ? undefined : GENERIC_UPSERT_DECK_CARD_ERROR,
        ok: false,
        values: validation.values
      };
    }

    return {
      gameId: validation.data.gameId,
      message: `Week ${validation.data.weekNumber} card updated.`,
      ok: true,
      values: validation.values
    };
  }

  const { error: insertError } = await supabase.from("deck_cards").insert({
    card_key: validation.data.cardKey,
    deck_id: deck.id,
    prompt_text: validation.data.promptText,
    season: validation.data.season,
    week_number: validation.data.weekNumber
  });

  if (insertError) {
    const conflictMessage = getUniqueCardConflictMessage(insertError.code);

    return {
      fieldErrors: conflictMessage
        ? {
            cardKey: conflictMessage
          }
        : undefined,
      formError: conflictMessage ? undefined : GENERIC_UPSERT_DECK_CARD_ERROR,
      ok: false,
      values: validation.values
    };
  }

  return {
    gameId: validation.data.gameId,
    message: `Week ${validation.data.weekNumber} card saved. Only user-provided placeholder text was stored.`,
    ok: true,
    values: validation.values
  };
}

export { upsertDeckCardForCurrentUser };
export type { UpsertDeckCardForCurrentUserResult };
