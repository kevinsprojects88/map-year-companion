import "server-only";

import type { AuthenticatedProfileContext } from "@/lib/auth/require-profile";
import { REQUIRED_DECK_CARD_COUNT } from "@/lib/lobby/setup-readiness";
import type { Database } from "@/lib/supabase/types";
import type { DeckCardViewModel, DeckSetupViewModel } from "@/types/deck";

type DeckGameStatus = Database["public"]["Enums"]["game_status"];
type DeckMemberRole = Database["public"]["Enums"]["game_member_role"];
type DeckMemberStatus = Database["public"]["Enums"]["game_member_status"];
type DeckSourceType = Database["public"]["Enums"]["deck_source_type"];
type DeckStatus = Database["public"]["Enums"]["deck_status"];

type DeckQueryContext = Pick<
  AuthenticatedProfileContext,
  "profile" | "supabase" | "user"
>;

type DeckGameRow = Pick<
  Database["public"]["Tables"]["games"]["Row"],
  "id" | "name" | "status"
>;

type DeckMembershipRow = {
  games: DeckGameRow | DeckGameRow[] | null;
  role: DeckMemberRole;
  status: DeckMemberStatus;
};

type DeckRow = Pick<
  Database["public"]["Tables"]["decks"]["Row"],
  | "created_at"
  | "id"
  | "locked_at"
  | "source_type"
  | "status"
  | "updated_at"
>;

type DeckCardRow = Pick<
  Database["public"]["Tables"]["deck_cards"]["Row"],
  | "card_key"
  | "created_at"
  | "id"
  | "prompt_text"
  | "season"
  | "updated_at"
  | "week_number"
>;

type DeckSetupQueryResult =
  | {
      deckSetup: DeckSetupViewModel;
      ok: true;
    }
  | {
      error: "deck-setup-unavailable" | "not-member";
      ok: false;
    };

const gameStatusLabels: Record<DeckGameStatus, string> = {
  active: "Active",
  archived: "Archived",
  completed: "Completed",
  setup: "Setup"
};

const memberRoleLabels: Record<DeckMemberRole, string> = {
  admin: "Admin",
  owner: "Owner",
  player: "Player"
};

const deckSourceLabels: Record<DeckSourceType, string> = {
  json_import: "JSON import",
  manual: "Manual",
  placeholder: "Placeholder",
  private_poc: "Private POC"
};

const deckStatusLabels: Record<DeckStatus, string> = {
  draft: "Draft",
  locked: "Locked",
  valid: "Valid"
};

function getRelatedGame(
  game: DeckGameRow | DeckGameRow[] | null
): DeckGameRow | null {
  return Array.isArray(game) ? (game[0] ?? null) : game;
}

function isOwnerAdmin(role: DeckMemberRole) {
  return role === "owner" || role === "admin";
}

function formatDateLabel(
  prefix: "Created" | "Updated",
  value: string
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return `${prefix} date unavailable`;
  }

  return `${prefix} ${new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium"
  }).format(date)}`;
}

function getCardCountLabel(cardCount: number) {
  return `${cardCount} saved ${cardCount === 1 ? "card" : "cards"}`;
}

function getConfiguredCountLabel(cardCount: number) {
  return `${cardCount} / ${REQUIRED_DECK_CARD_COUNT} cards configured`;
}

function getPromptTextCountLabel(promptTextCount: number) {
  return `${promptTextCount} / ${REQUIRED_DECK_CARD_COUNT} cards have prompt text`;
}

function hasPromptText(card: Pick<DeckCardRow, "prompt_text">) {
  return Boolean(card.prompt_text?.trim());
}

function isDeckMeaningfullyComplete(deck: DeckRow, cards: DeckCardRow[]) {
  const promptTextCount = cards.filter(hasPromptText).length;

  return (
    cards.length >= REQUIRED_DECK_CARD_COUNT &&
    promptTextCount >= REQUIRED_DECK_CARD_COUNT &&
    (deck.status === "valid" ||
      deck.status === "locked" ||
      Boolean(deck.locked_at))
  );
}

function buildDeckCardViewModel(card: DeckCardRow): DeckCardViewModel {
  const cardHasPromptText = hasPromptText(card);

  return {
    cardKey: card.card_key,
    createdLabel: formatDateLabel("Created", card.created_at),
    hasPromptText: cardHasPromptText,
    id: card.id,
    promptText: card.prompt_text,
    promptTextStatusLabel: cardHasPromptText
      ? "Prompt text saved"
      : "No prompt text",
    season: card.season,
    seasonLabel: card.season?.trim() || "No season saved",
    updatedLabel: formatDateLabel("Updated", card.updated_at),
    weekNumber: card.week_number,
    weekNumberLabel: `Week ${card.week_number}`
  };
}

function buildDeckSetupViewModel({
  cards,
  deck,
  game,
  membership
}: {
  cards: DeckCardRow[];
  deck: DeckRow | null;
  game: DeckGameRow;
  membership: Pick<DeckMembershipRow, "role">;
}): DeckSetupViewModel {
  const userIsOwnerAdmin = isOwnerAdmin(membership.role);
  const cardCount = cards.length;
  const promptTextCount = cards.filter(hasPromptText).length;
  const cardSetup = {
    cardCount,
    cardCountLabel: getCardCountLabel(cardCount),
    configuredCountLabel: getConfiguredCountLabel(cardCount),
    promptTextCount,
    promptTextCountLabel: getPromptTextCountLabel(promptTextCount)
  };

  if (!deck) {
    return {
      cardSetup,
      cards: [],
      deck: null,
      game: {
        id: game.id,
        name: game.name,
        status: game.status,
        statusLabel: gameStatusLabels[game.status]
      },
      membership: {
        isOwnerAdmin: userIsOwnerAdmin,
        role: membership.role,
        roleLabel: memberRoleLabels[membership.role]
      },
      setup: {
        canCreateDraftDeck: userIsOwnerAdmin && game.status === "setup",
        description: userIsOwnerAdmin
          ? "Create a placeholder draft deck record before manual card entry arrives."
          : "Owner/admin members can create the draft deck. You can view setup status.",
        readinessCategory: "incomplete",
        statusLabel: "Missing"
      }
    };
  }

  const complete = isDeckMeaningfullyComplete(deck, cards);
  const isLocked = deck.status === "locked" || Boolean(deck.locked_at);

  return {
    cardSetup,
    cards: cards.map(buildDeckCardViewModel),
    deck: {
      createdLabel: formatDateLabel("Created", deck.created_at),
      id: deck.id,
      isLocked,
      lockedLabel: isLocked ? "Locked" : "Not locked",
      sourceType: deck.source_type,
      sourceTypeLabel: deckSourceLabels[deck.source_type],
      status: deck.status,
      statusLabel: deckStatusLabels[deck.status],
      updatedLabel: formatDateLabel("Updated", deck.updated_at)
    },
    game: {
      id: game.id,
      name: game.name,
      status: game.status,
      statusLabel: gameStatusLabels[game.status]
    },
    membership: {
      isOwnerAdmin: userIsOwnerAdmin,
      role: membership.role,
      roleLabel: memberRoleLabels[membership.role]
    },
    setup: {
      canCreateDraftDeck: false,
      description: complete
        ? "Deck setup has a saved status that can support later start validation."
        : "A draft deck exists. Manual card entry is available to owner/admin members while validation remains conservative.",
      readinessCategory: complete ? "complete" : "incomplete",
      statusLabel: complete ? "Complete" : "In progress"
    }
  };
}

async function getDeckSetupForCurrentUser(
  context: DeckQueryContext,
  gameId: string
): Promise<DeckSetupQueryResult> {
  const { profile, supabase, user } = context;

  if (profile.id !== user.id) {
    return {
      error: "deck-setup-unavailable",
      ok: false
    };
  }

  const { data, error } = await supabase
    .from("game_memberships")
    .select(
      `
        role,
        status,
        games!inner (
          id,
          name,
          status
        )
      `
    )
    .eq("game_id", gameId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    return {
      error: "deck-setup-unavailable",
      ok: false
    };
  }

  if (!data) {
    return {
      error: "not-member",
      ok: false
    };
  }

  const membership = data as DeckMembershipRow;
  const game = getRelatedGame(membership.games);

  if (!game || membership.status !== "active") {
    return {
      error: "not-member",
      ok: false
    };
  }

  const { data: deckData, error: deckError } = await supabase
    .from("decks")
    .select("id, source_type, status, created_at, updated_at, locked_at")
    .eq("game_id", gameId)
    .maybeSingle();

  if (deckError) {
    return {
      error: "deck-setup-unavailable",
      ok: false
    };
  }

  const deck = deckData as DeckRow | null;
  let cards: DeckCardRow[] = [];

  if (deck) {
    const { data: cardData, error: cardError } = await supabase
      .from("deck_cards")
      .select(
        "id, card_key, season, week_number, prompt_text, created_at, updated_at"
      )
      .eq("deck_id", deck.id)
      .order("week_number", { ascending: true })
      .order("card_key", { ascending: true });

    if (cardError) {
      return {
        error: "deck-setup-unavailable",
        ok: false
      };
    }

    cards = (cardData ?? []) as DeckCardRow[];
  }

  return {
    deckSetup: buildDeckSetupViewModel({
      cards,
      deck,
      game,
      membership
    }),
    ok: true
  };
}

export { buildDeckSetupViewModel, getDeckSetupForCurrentUser };
export type { DeckSetupQueryResult };
