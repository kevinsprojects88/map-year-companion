import type { Database } from "@/lib/supabase/types";
import type {
  UpsertDeckCardFieldErrors,
  UpsertDeckCardValues
} from "@/lib/validation/deck-card.schema";
import type {
  CreateDraftDeckFieldErrors,
  CreateDraftDeckValues
} from "@/lib/validation/deck.schema";
import type { SetupReadinessCategory } from "@/types/setup";

type DeckSourceType = Database["public"]["Enums"]["deck_source_type"];
type DeckStatus = Database["public"]["Enums"]["deck_status"];
type DeckGameStatus = Database["public"]["Enums"]["game_status"];
type DeckMembershipRole = Database["public"]["Enums"]["game_member_role"];

type DeckSetupReadinessInput = {
  cardCount: number;
  deckId: string | null;
  promptTextCount?: number;
  isLocked: boolean;
  setupHref: string;
  sourceType: DeckSourceType | null;
  status: DeckStatus | null;
};

type DeckCardViewModel = {
  cardKey: string;
  createdLabel: string;
  hasPromptText: boolean;
  id: string;
  promptText: string | null;
  promptTextStatusLabel: string;
  season: string | null;
  seasonLabel: string;
  updatedLabel: string;
  weekNumber: number;
  weekNumberLabel: string;
};

type DeckSetupViewModel = {
  cardSetup: {
    cardCount: number;
    cardCountLabel: string;
    configuredCountLabel: string;
    promptTextCount: number;
    promptTextCountLabel: string;
  };
  cards: DeckCardViewModel[];
  deck: {
    createdLabel: string;
    id: string;
    isLocked: boolean;
    lockedLabel: string;
    sourceType: DeckSourceType;
    sourceTypeLabel: string;
    status: DeckStatus;
    statusLabel: string;
    updatedLabel: string;
  } | null;
  game: {
    id: string;
    name: string;
    status: DeckGameStatus;
    statusLabel: string;
  };
  membership: {
    isOwnerAdmin: boolean;
    role: DeckMembershipRole;
    roleLabel: string;
  };
  setup: {
    canCreateDraftDeck: boolean;
    description: string;
    readinessCategory: SetupReadinessCategory;
    statusLabel: string;
  };
};

type CreateDraftDeckActionState = {
  fieldErrors: CreateDraftDeckFieldErrors;
  formError: string | null;
  status: "idle" | "error" | "success";
  successMessage: string | null;
  values: CreateDraftDeckValues;
};

type UpsertDeckCardActionState = {
  fieldErrors: UpsertDeckCardFieldErrors;
  formError: string | null;
  status: "idle" | "error" | "success";
  successMessage: string | null;
  values: UpsertDeckCardValues;
};

export type {
  CreateDraftDeckActionState,
  DeckCardViewModel,
  DeckGameStatus,
  DeckMembershipRole,
  DeckSetupReadinessInput,
  DeckSetupViewModel,
  DeckSourceType,
  DeckStatus,
  UpsertDeckCardActionState
};
