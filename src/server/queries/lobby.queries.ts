import "server-only";

import type { AuthenticatedProfileContext } from "@/lib/auth/require-profile";
import { buildLobbySetupReadiness } from "@/lib/lobby/setup-readiness";
import type { Database } from "@/lib/supabase/types";
import type {
  LobbyRosterMemberViewModel,
  LobbyStatusViewModel
} from "@/types/lobby";

type GameStatus = Database["public"]["Enums"]["game_status"];
type GameMemberRole = Database["public"]["Enums"]["game_member_role"];
type GameMemberStatus = Database["public"]["Enums"]["game_member_status"];

type LobbyQueryContext = Pick<
  AuthenticatedProfileContext,
  "profile" | "supabase" | "user"
>;

type LobbyGameRow = Pick<
  Database["public"]["Tables"]["games"]["Row"],
  "created_at" | "id" | "name" | "status" | "updated_at"
>;

type LobbyMembershipRow = {
  games: LobbyGameRow | LobbyGameRow[] | null;
  role: GameMemberRole;
  status: GameMemberStatus;
};

type LobbyProfileRow = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "display_name" | "id"
>;

type LobbyRosterMembershipRow = Pick<
  Database["public"]["Tables"]["game_memberships"]["Row"],
  "id" | "joined_at" | "role" | "status" | "turn_order_index" | "user_id"
> & {
  profiles: LobbyProfileRow | LobbyProfileRow[] | null;
};

type LobbyStatusQueryResult =
  | {
      lobby: LobbyStatusViewModel;
      ok: true;
    }
  | {
      error: "lobby-unavailable" | "not-member";
      ok: false;
    };

const gameStatusLabels: Record<GameStatus, string> = {
  active: "Active",
  archived: "Archived",
  completed: "Completed",
  setup: "Setup"
};

const memberRoleLabels: Record<GameMemberRole, string> = {
  admin: "Admin",
  owner: "Owner",
  player: "Player"
};

const memberStatusLabels: Record<GameMemberStatus, string> = {
  active: "Active",
  removed: "Removed"
};

function getRelatedGame(
  game: LobbyGameRow | LobbyGameRow[] | null
): LobbyGameRow | null {
  return Array.isArray(game) ? (game[0] ?? null) : game;
}

function getRelatedProfile(
  profile: LobbyProfileRow | LobbyProfileRow[] | null
): LobbyProfileRow | null {
  return Array.isArray(profile) ? (profile[0] ?? null) : profile;
}

function canRoleCreateInvites(role: GameMemberRole) {
  return role === "owner" || role === "admin";
}

function formatDateLabel(
  prefix: "Created" | "Joined" | "Updated",
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

function formatJoinedLabel(value: string) {
  return formatDateLabel("Joined", value);
}

function getMemberCountLabel(memberCount: number) {
  return `${memberCount} active ${memberCount === 1 ? "member" : "members"}`;
}

function getTurnOrderLabel(turnOrderIndex: number | null) {
  return turnOrderIndex === null
    ? "Turn order: not set"
    : `Turn order: ${turnOrderIndex + 1}`;
}

function sortRosterRows(
  first: LobbyRosterMembershipRow,
  second: LobbyRosterMembershipRow
) {
  if (first.turn_order_index === second.turn_order_index) {
    return first.joined_at.localeCompare(second.joined_at);
  }

  if (first.turn_order_index === null) {
    return 1;
  }

  if (second.turn_order_index === null) {
    return -1;
  }

  return first.turn_order_index - second.turn_order_index;
}

function buildRosterMemberViewModel(
  membership: LobbyRosterMembershipRow,
  currentUserId: string
): LobbyRosterMemberViewModel {
  const profile = getRelatedProfile(membership.profiles);
  const displayName =
    profile?.display_name?.trim() || "Member profile unavailable";

  return {
    displayName,
    isCurrentUser: membership.user_id === currentUserId,
    joinedLabel: formatJoinedLabel(membership.joined_at),
    membershipId: membership.id,
    profileId: profile?.id ?? membership.user_id,
    role: membership.role,
    roleLabel: memberRoleLabels[membership.role],
    status: membership.status,
    statusLabel: memberStatusLabels[membership.status],
    turnOrderIndex: membership.turn_order_index,
    turnOrderLabel: getTurnOrderLabel(membership.turn_order_index)
  };
}

function buildLobbyStatusViewModel({
  game,
  membership,
  rosterMembers
}: {
  game: LobbyGameRow;
  membership: Pick<LobbyMembershipRow, "role" | "status">;
  rosterMembers: LobbyRosterMemberViewModel[];
}): LobbyStatusViewModel {
  const isOwnerAdmin = canRoleCreateInvites(membership.role);
  const memberCount = rosterMembers.length;
  const memberCountLabel = getMemberCountLabel(memberCount);
  const setupReadiness = buildLobbySetupReadiness({
    gameStatus: game.status,
    gameStatusLabel: gameStatusLabels[game.status],
    isOwnerAdmin,
    memberCount,
    memberCountLabel,
    rosterMembers: rosterMembers.map((member) => ({
      displayName: member.displayName,
      turnOrderIndex: member.turnOrderIndex
    }))
  });

  return {
    game: {
      createdLabel: formatDateLabel("Created", game.created_at),
      id: game.id,
      name: game.name,
      status: game.status,
      statusLabel: gameStatusLabels[game.status],
      updatedLabel: formatDateLabel("Updated", game.updated_at)
    },
    memberCount,
    memberCountLabel,
    membership: {
      canCreateInvites: isOwnerAdmin,
      isOwnerAdmin,
      role: membership.role,
      roleLabel: memberRoleLabels[membership.role],
      status: membership.status,
      statusLabel: memberStatusLabels[membership.status]
    },
    roster: {
      memberCount,
      memberCountLabel,
      members: rosterMembers,
      readOnlyLabel:
        "This roster is read-only; player removal, role changes, and status changes are not available."
    },
    setupChecklistItems: setupReadiness.items,
    setupReadinessSummary: setupReadiness.summary
  };
}

async function getLobbyStatusForCurrentUser(
  context: LobbyQueryContext,
  gameId: string
): Promise<LobbyStatusQueryResult> {
  const { profile, supabase, user } = context;

  if (profile.id !== user.id) {
    return {
      error: "lobby-unavailable",
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
          status,
          created_at,
          updated_at
        )
      `
    )
    .eq("game_id", gameId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    return {
      error: "lobby-unavailable",
      ok: false
    };
  }

  if (!data) {
    return {
      error: "not-member",
      ok: false
    };
  }

  const membership = data as LobbyMembershipRow;
  const game = getRelatedGame(membership.games);

  if (!game || membership.status !== "active") {
    return {
      error: "not-member",
      ok: false
    };
  }

  const { data: rosterData, error: rosterError } = await supabase
    .from("game_memberships")
    .select(
      `
        id,
        user_id,
        role,
        status,
        turn_order_index,
        joined_at,
        profiles!game_memberships_user_id_fkey (
          id,
          display_name
        )
      `
    )
    .eq("game_id", gameId)
    .eq("status", "active")
    .order("turn_order_index", { ascending: true, nullsFirst: false })
    .order("joined_at", { ascending: true });

  if (rosterError) {
    return {
      error: "lobby-unavailable",
      ok: false
    };
  }

  return {
    lobby: buildLobbyStatusViewModel({
      game,
      membership,
      rosterMembers: [...((rosterData ?? []) as LobbyRosterMembershipRow[])]
        .sort(sortRosterRows)
        .map((rosterMembership) =>
          buildRosterMemberViewModel(rosterMembership, user.id)
        )
    }),
    ok: true
  };
}

export {
  buildRosterMemberViewModel,
  buildLobbyStatusViewModel,
  getLobbyStatusForCurrentUser
};
export type { LobbyStatusQueryResult };
