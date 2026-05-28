import type { Database } from "@/lib/supabase/types";
import type {
  UpdateTurnOrderFieldErrors,
  UpdateTurnOrderValues
} from "@/lib/validation/turn-order.schema";
import type {
  SetupChecklistItem,
  SetupReadinessSummary
} from "@/types/setup";

type LobbyGameStatus = Database["public"]["Enums"]["game_status"];
type LobbyMembershipRole = Database["public"]["Enums"]["game_member_role"];
type LobbyMembershipStatus =
  Database["public"]["Enums"]["game_member_status"];

type LobbyRosterMemberViewModel = {
  displayName: string;
  isCurrentUser: boolean;
  joinedLabel: string;
  membershipId: string;
  profileId: string;
  role: LobbyMembershipRole;
  roleLabel: string;
  status: LobbyMembershipStatus;
  statusLabel: string;
  turnOrderIndex: number | null;
  turnOrderLabel: string;
};

type LobbyStatusViewModel = {
  game: {
    createdLabel: string;
    id: string;
    name: string;
    status: LobbyGameStatus;
    statusLabel: string;
    updatedLabel: string;
  };
  membership: {
    canCreateInvites: boolean;
    isOwnerAdmin: boolean;
    role: LobbyMembershipRole;
    roleLabel: string;
    status: LobbyMembershipStatus;
    statusLabel: string;
  };
  memberCount: number;
  memberCountLabel: string;
  roster: {
    memberCount: number;
    memberCountLabel: string;
    members: LobbyRosterMemberViewModel[];
    readOnlyLabel: string;
  };
  setupChecklistItems: SetupChecklistItem[];
  setupReadinessSummary: SetupReadinessSummary;
};

type UpdateTurnOrderActionState = {
  fieldErrors: UpdateTurnOrderFieldErrors;
  formError: string | null;
  status: "idle" | "error" | "success";
  values: UpdateTurnOrderValues;
};

export type {
  LobbyGameStatus,
  LobbyMembershipRole,
  LobbyMembershipStatus,
  LobbyRosterMemberViewModel,
  LobbyStatusViewModel,
  UpdateTurnOrderActionState
};
