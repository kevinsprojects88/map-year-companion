import "server-only";

import { getAuthenticatedUser } from "@/lib/auth/require-user";
import {
  buildDeckLockPreflight,
  type DeckLockPreflightResult
} from "@/lib/decks/deck-lock-preflight";
import { validateDeckReadiness } from "@/lib/decks/deck-validation";
import type { Database } from "@/lib/supabase/types";

type DeckMemberRole = Database["public"]["Enums"]["game_member_role"];
type DeckMemberStatus = Database["public"]["Enums"]["game_member_status"];
type DeckStatus = Database["public"]["Enums"]["deck_status"];

type DeckLockPreflightMembershipRow = {
  role: DeckMemberRole;
  status: DeckMemberStatus;
};

type DeckLockPreflightDeckRow = Pick<
  Database["public"]["Tables"]["decks"]["Row"],
  "id" | "status"
>;

type DeckLockPreflightCardRow = Pick<
  Database["public"]["Tables"]["deck_cards"]["Row"],
  "prompt_text" | "week_number"
>;

type GetDeckLockPreflightForCurrentUserInput = {
  gameId: string;
  requireOwnerAdmin?: boolean;
};

type DeckLockPreflightForCurrentUserResult =
  | {
      deckId: string | null;
      deckStatus: DeckStatus | null;
      gameId: string;
      membership: {
        isOwnerAdmin: boolean;
        role: DeckMemberRole;
      };
      ok: true;
      preflight: DeckLockPreflightResult;
    }
  | {
      error:
        | "deck-lock-preflight-unavailable"
        | "not-member"
        | "not-owner-admin"
        | "not-signed-in"
        | "profile-required";
      ok: false;
    };

function isOwnerAdmin(role: DeckMemberRole) {
  return role === "owner" || role === "admin";
}

async function getDeckLockPreflightForCurrentUser({
  gameId,
  requireOwnerAdmin = false
}: GetDeckLockPreflightForCurrentUserInput): Promise<DeckLockPreflightForCurrentUserResult> {
  const authContext = await getAuthenticatedUser();

  if (!authContext) {
    return {
      error: "not-signed-in",
      ok: false
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
      error: "deck-lock-preflight-unavailable",
      ok: false
    };
  }

  if (!profile) {
    return {
      error: "profile-required",
      ok: false
    };
  }

  const { data: membershipData, error: membershipError } = await supabase
    .from("game_memberships")
    .select("role, status")
    .eq("game_id", gameId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (membershipError) {
    return {
      error: "deck-lock-preflight-unavailable",
      ok: false
    };
  }

  if (!membershipData) {
    return {
      error: "not-member",
      ok: false
    };
  }

  const membership = membershipData as DeckLockPreflightMembershipRow;
  const userIsOwnerAdmin = isOwnerAdmin(membership.role);

  if (membership.status !== "active") {
    return {
      error: "not-member",
      ok: false
    };
  }

  if (requireOwnerAdmin && !userIsOwnerAdmin) {
    return {
      error: "not-owner-admin",
      ok: false
    };
  }

  const { data: deckData, error: deckError } = await supabase
    .from("decks")
    .select("id, status")
    .eq("game_id", gameId)
    .maybeSingle();

  if (deckError) {
    return {
      error: "deck-lock-preflight-unavailable",
      ok: false
    };
  }

  const deck = deckData as DeckLockPreflightDeckRow | null;
  let cards: DeckLockPreflightCardRow[] = [];

  if (deck) {
    const { data: cardData, error: cardError } = await supabase
      .from("deck_cards")
      .select("week_number, prompt_text")
      .eq("deck_id", deck.id)
      .order("week_number", { ascending: true });

    if (cardError) {
      return {
        error: "deck-lock-preflight-unavailable",
        ok: false
      };
    }

    cards = (cardData ?? []) as DeckLockPreflightCardRow[];
  }

  const deckInput = deck
    ? {
        status: deck.status
      }
    : null;
  const validationCards = cards.map((card) => ({
    promptText: card.prompt_text,
    weekNumber: card.week_number
  }));
  const validation = validateDeckReadiness({
    cards: validationCards,
    deck: deckInput
  });

  return {
    deckId: deck?.id ?? null,
    deckStatus: deck?.status ?? null,
    gameId,
    membership: {
      isOwnerAdmin: userIsOwnerAdmin,
      role: membership.role
    },
    ok: true,
    preflight: buildDeckLockPreflight({
      deck: deckInput,
      validation
    })
  };
}

export { getDeckLockPreflightForCurrentUser };
export type {
  DeckLockPreflightForCurrentUserResult,
  GetDeckLockPreflightForCurrentUserInput
};
