import type { Database } from "@/lib/supabase/types";
import type { SetupChecklistItem } from "@/types/setup";

type LobbyGameStatus = Database["public"]["Enums"]["game_status"];
type LobbyMembershipRole = Database["public"]["Enums"]["game_member_role"];
type LobbyMembershipStatus =
  Database["public"]["Enums"]["game_member_status"];

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
  setupChecklistItems: SetupChecklistItem[];
};

export type {
  LobbyGameStatus,
  LobbyMembershipRole,
  LobbyMembershipStatus,
  LobbyStatusViewModel
};
