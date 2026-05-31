import "server-only";

import { getAuthenticatedUser } from "@/lib/auth/require-user";
import {
  validateLockDeckInput,
  type LockDeckFieldErrors,
  type LockDeckInput,
  type LockDeckValues
} from "@/lib/validation/deck-lock.schema";
import { getDeckLockPreflightForCurrentUser } from "@/server/services/deck-lock-preflight.service";

const GENERIC_LOCK_DECK_ERROR =
  "We could not lock this deck right now. Try again in a moment.";

type LockDeckForCurrentUserResult =
  | {
      gameId: string;
      lockedAt: string;
      message: string;
      ok: true;
      values: LockDeckValues;
    }
  | {
      fieldErrors?: LockDeckFieldErrors;
      formError?: string;
      ok: false;
      values: LockDeckValues;
    };

type LockDeckRpcRow = {
  deck_id: string;
  locked_at: string;
};

function getPreflightErrorMessage(
  error: Exclude<
    Awaited<ReturnType<typeof getDeckLockPreflightForCurrentUser>>,
    { ok: true }
  >["error"]
) {
  switch (error) {
    case "not-signed-in":
      return "Sign in again before locking the deck.";
    case "profile-required":
      return "Finish your profile before locking the deck.";
    case "not-member":
      return "Only active game members can view deck setup.";
    case "not-owner-admin":
      return "Only active owner/admin members can lock the deck.";
    case "deck-lock-preflight-unavailable":
      return GENERIC_LOCK_DECK_ERROR;
  }
}

function getPreflightBlockerMessage(blockerMessages: string[]) {
  if (blockerMessages.length === 0) {
    return "Fix deck validation blockers before locking the deck.";
  }

  return `Fix deck validation blockers before locking the deck: ${blockerMessages.join(
    " "
  )}`;
}

function getLockDeckRpcErrorMessage(message?: string) {
  switch (message) {
    case "Authentication is required to lock a deck.":
    case "A profile is required to lock a deck.":
    case "Only active owner/admin members can lock a deck.":
    case "Create a draft deck before locking the deck.":
    case "Only draft decks can be locked.":
    case "Deck can only be locked while the game is in setup.":
    case "Deck must contain exactly one card for each week 1 through 52 before it can be locked.":
    case "Every deck card needs non-blank prompt text before the deck can be locked.":
      return message;
    default:
      return GENERIC_LOCK_DECK_ERROR;
  }
}

async function lockDeckForCurrentUser(
  input: LockDeckInput
): Promise<LockDeckForCurrentUserResult> {
  const validation = validateLockDeckInput(input);

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
      formError: "Sign in again before locking the deck.",
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
      formError: GENERIC_LOCK_DECK_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (!profile) {
    return {
      formError: "Finish your profile before locking the deck.",
      ok: false,
      values: validation.values
    };
  }

  const preflight = await getDeckLockPreflightForCurrentUser({
    gameId: validation.data.gameId,
    requireOwnerAdmin: true
  });

  if (!preflight.ok) {
    return {
      formError: getPreflightErrorMessage(preflight.error),
      ok: false,
      values: validation.values
    };
  }

  if (!preflight.preflight.canLock) {
    return {
      formError: getPreflightBlockerMessage(
        preflight.preflight.blockers.map((blocker) => blocker.message)
      ),
      ok: false,
      values: validation.values
    };
  }

  const { data, error } = await supabase.rpc("lock_game_deck", {
    target_game_id: validation.data.gameId
  });

  if (error) {
    return {
      formError: getLockDeckRpcErrorMessage(error.message),
      ok: false,
      values: validation.values
    };
  }

  const lockedDeck = (Array.isArray(data) ? data[0] : data) as
    | LockDeckRpcRow
    | null
    | undefined;

  if (!lockedDeck?.locked_at) {
    return {
      formError: GENERIC_LOCK_DECK_ERROR,
      ok: false,
      values: validation.values
    };
  }

  return {
    gameId: validation.data.gameId,
    lockedAt: lockedDeck.locked_at,
    message:
      "Deck locked. Manual card editing is now closed; start-game behavior is still not built.",
    ok: true,
    values: validation.values
  };
}

export { lockDeckForCurrentUser };
export type { LockDeckForCurrentUserResult };
