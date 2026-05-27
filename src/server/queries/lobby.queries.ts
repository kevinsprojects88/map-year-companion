import "server-only";

import type { AuthenticatedProfileContext } from "@/lib/auth/require-profile";
import type { Database } from "@/lib/supabase/types";
import type { LobbyStatusViewModel } from "@/types/lobby";
import type { SetupChecklistItem } from "@/types/setup";

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

function canRoleCreateInvites(role: GameMemberRole) {
  return role === "owner" || role === "admin";
}

function formatDateLabel(prefix: "Created" | "Updated", value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return `${prefix} date unavailable`;
  }

  return `${prefix} ${new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium"
  }).format(date)}`;
}

function getMemberCountLabel(memberCount: number) {
  return `${memberCount} active ${memberCount === 1 ? "member" : "members"}`;
}

function buildLobbySetupChecklistItems({
  isOwnerAdmin,
  memberCount
}: {
  isOwnerAdmin: boolean;
  memberCount: number;
}): SetupChecklistItem[] {
  const hasMultipleMembers = memberCount >= 2;
  const memberCountLabel = getMemberCountLabel(memberCount);

  return [
    {
      actionDisabledReason: isOwnerAdmin
        ? "Use the invite form on this page; this checklist card is status-only."
        : "Only owner/admin members can create invite links.",
      actionLabel: isOwnerAdmin ? "Available below" : "Owner/admin only",
      description: isOwnerAdmin
        ? "Owner/admin invite creation is available in this lobby."
        : "Invite creation is hidden for player members.",
      requirement: "required",
      status: isOwnerAdmin ? "complete" : "blocked",
      title: "Invite link",
      validationMessages: [
        isOwnerAdmin
          ? "Private invite creation exists for owner/admin members."
          : "Player members can view setup status but cannot create invite links."
      ]
    },
    {
      actionDisabledReason:
        "Player list management is deferred; this card only reports the current active member count.",
      actionLabel: "Status only",
      description:
        "The lobby can see how many active members are already in the game.",
      requirement: "required",
      status: hasMultipleMembers ? "complete" : "warning",
      title: "Players invited",
      validationMessages: [
        `${memberCountLabel} confirmed.`,
        hasMultipleMembers
          ? "The recommended two-or-more-player baseline is met."
          : "Invite another player before starting if this should be a group game."
      ]
    },
    {
      actionDisabledReason: "Turn order editing comes in a later Phase 5 slice.",
      actionLabel: "Coming later",
      description:
        "Turn order will be structured here later without changing roles in this slice.",
      requirement: "required",
      status: "incomplete",
      title: "Turn order",
      validationMessages: [
        "No turn order editing or player management is available in Phase 5A."
      ]
    },
    {
      actionDisabledReason: "Deck setup is deferred to the dedicated deck phase.",
      actionLabel: "Coming later",
      description:
        "Deck/card setup will use user-provided content in a later slice.",
      requirement: "required",
      status: "blocked",
      title: "Deck/card setup",
      validationMessages: [
        "No deck editor, card import, or official/proprietary content is added here."
      ]
    },
    {
      actionDisabledReason: "Initial map setup is deferred to the map setup phase.",
      actionLabel: "Coming later",
      description:
        "The initial map setup route and editor are not part of this slice.",
      requirement: "required",
      status: "blocked",
      title: "Initial map",
      validationMessages: [
        "No map editor, map draft, or baseline map revision is created here."
      ]
    },
    {
      actionDisabledReason: "Community notes editing is deferred.",
      actionLabel: "Coming later",
      description:
        "Shared setup notes will become structured later; this page stays read-only for now.",
      requirement: "optional",
      status: "optional",
      title: "Community notes",
      validationMessages: [
        "No notes editor, comments, chat, or realtime behavior is added here."
      ]
    },
    {
      actionDisabledReason:
        "Start-game behavior is blocked until the setup steps have real validation.",
      actionLabel: "Blocked",
      description:
        "Starting the game remains unavailable until deck, map, and turn setup exist.",
      requirement: "required",
      status: "blocked",
      title: "Start game",
      validationMessages: [
        "No start-game action, turn creation, or game status mutation is added in this slice."
      ]
    }
  ];
}

function buildLobbyStatusViewModel({
  game,
  memberCount,
  membership
}: {
  game: LobbyGameRow;
  memberCount: number;
  membership: Pick<LobbyMembershipRow, "role" | "status">;
}): LobbyStatusViewModel {
  const isOwnerAdmin = canRoleCreateInvites(membership.role);

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
    memberCountLabel: getMemberCountLabel(memberCount),
    membership: {
      canCreateInvites: isOwnerAdmin,
      isOwnerAdmin,
      role: membership.role,
      roleLabel: memberRoleLabels[membership.role],
      status: membership.status,
      statusLabel: memberStatusLabels[membership.status]
    },
    setupChecklistItems: buildLobbySetupChecklistItems({
      isOwnerAdmin,
      memberCount
    })
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

  const { count, error: countError } = await supabase
    .from("game_memberships")
    .select("id", { count: "exact", head: true })
    .eq("game_id", gameId)
    .eq("status", "active");

  if (countError) {
    return {
      error: "lobby-unavailable",
      ok: false
    };
  }

  return {
    lobby: buildLobbyStatusViewModel({
      game,
      memberCount: count ?? 0,
      membership
    }),
    ok: true
  };
}

export {
  buildLobbySetupChecklistItems,
  buildLobbyStatusViewModel,
  getLobbyStatusForCurrentUser
};
export type { LobbyStatusQueryResult };
