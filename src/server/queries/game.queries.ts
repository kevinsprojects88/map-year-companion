import "server-only";

import type { AuthenticatedProfileContext } from "@/lib/auth/require-profile";
import type { Database } from "@/lib/supabase/types";
import type {
  DashboardGameGroupKey,
  DashboardGameViewModel,
  GameCardStatus
} from "@/types/game";

type GameStatus = Database["public"]["Enums"]["game_status"];
type GameMemberRole = Database["public"]["Enums"]["game_member_role"];
type GameMemberStatus = Database["public"]["Enums"]["game_member_status"];

type DashboardGamesQueryContext = Pick<
  AuthenticatedProfileContext,
  "supabase" | "user"
>;

type LobbyGameAccessQueryContext = DashboardGamesQueryContext;

type DashboardGameRow = Pick<
  Database["public"]["Tables"]["games"]["Row"],
  | "completed_at"
  | "created_at"
  | "current_season"
  | "current_week"
  | "id"
  | "name"
  | "owner_id"
  | "status"
  | "updated_at"
>;

type DashboardGameMembershipRow = {
  games: DashboardGameRow | DashboardGameRow[] | null;
  role: GameMemberRole;
  status: GameMemberStatus;
  turn_order_index: number | null;
};

type LobbyGameRow = Pick<
  Database["public"]["Tables"]["games"]["Row"],
  "id" | "name" | "status"
>;

type LobbyGameMembershipRow = {
  games: LobbyGameRow | LobbyGameRow[] | null;
  role: GameMemberRole;
  status: GameMemberStatus;
};

type DashboardGamesResult = {
  games: DashboardGameViewModel[];
  gamesError: "games-unavailable" | null;
};

type LobbyGameAccessResult =
  | {
      game: LobbyGameRow;
      membership: {
        canCreateInvites: boolean;
        role: GameMemberRole;
      };
      ok: true;
    }
  | {
      error: "lobby-unavailable" | "not-member";
      ok: false;
    };

const roleLabels: Record<GameMemberRole, string> = {
  admin: "Admin",
  owner: "Owner",
  player: "Player"
};

function getDashboardGroup(status: GameStatus): DashboardGameGroupKey {
  if (status === "setup") {
    return "waitingToStart";
  }

  if (status === "completed" || status === "archived") {
    return "completed";
  }

  return "active";
}

function getCardStatus(status: GameStatus): GameCardStatus {
  if (status === "setup") {
    return "waitingToStart";
  }

  return status;
}

function formatLastUpdatedLabel(updatedAt: string, createdAt: string) {
  const date = new Date(updatedAt || createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Update date unavailable";
  }

  return `Updated ${new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium"
  }).format(date)}`;
}

function formatTurnLabel(game: DashboardGameRow) {
  if (!game.current_week) {
    return game.status === "setup" ? "Setup" : "Week not started";
  }

  return game.current_season
    ? `${game.current_season}, week ${game.current_week}`
    : `Week ${game.current_week}`;
}

function getRelatedGame(
  game: LobbyGameRow | LobbyGameRow[] | null
): LobbyGameRow | null {
  return Array.isArray(game) ? (game[0] ?? null) : game;
}

function canRoleCreateInvites(role: GameMemberRole) {
  return role === "owner" || role === "admin";
}

function getPrimaryActionLabel(status: GameStatus) {
  if (status === "setup") {
    return "Open lobby";
  }

  if (status === "completed" || status === "archived") {
    return "View placeholder";
  }

  return "Open game";
}

function getDashboardGameFromMembership(
  membership: DashboardGameMembershipRow
): DashboardGameViewModel | null {
  const game = Array.isArray(membership.games)
    ? membership.games[0]
    : membership.games;

  if (!game || membership.status !== "active") {
    return null;
  }

  return {
    activePlayerLabel:
      game.status === "setup"
        ? "No active player is assigned yet."
        : "Active turn details are not loaded yet.",
    group: getDashboardGroup(game.status),
    id: game.id,
    lastUpdatedLabel: formatLastUpdatedLabel(game.updated_at, game.created_at),
    membershipRoleLabel: roleLabels[membership.role],
    name: game.name,
    primaryActionHref: `/games/${game.id}/lobby`,
    primaryActionLabel: getPrimaryActionLabel(game.status),
    status: getCardStatus(game.status),
    turnLabel: formatTurnLabel(game)
  };
}

async function getDashboardGamesForCurrentUser({
  supabase,
  user
}: DashboardGamesQueryContext): Promise<DashboardGamesResult> {
  const { data, error } = await supabase
    .from("game_memberships")
    .select(
      `
        role,
        status,
        turn_order_index,
        games!inner (
          id,
          owner_id,
          name,
          status,
          current_week,
          current_season,
          created_at,
          updated_at,
          completed_at
        )
      `
    )
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("updated_at", { ascending: false });

  if (error) {
    return {
      games: [],
      gamesError: "games-unavailable"
    };
  }

  const games = ((data ?? []) as DashboardGameMembershipRow[])
    .map(getDashboardGameFromMembership)
    .filter((game): game is DashboardGameViewModel => game !== null);

  return {
    games,
    gamesError: null
  };
}

async function getLobbyGameAccessForCurrentUser(
  { supabase, user }: LobbyGameAccessQueryContext,
  gameId: string
): Promise<LobbyGameAccessResult> {
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

  const membership = data as LobbyGameMembershipRow;
  const game = getRelatedGame(membership.games);

  if (!game || membership.status !== "active") {
    return {
      error: "not-member",
      ok: false
    };
  }

  return {
    game,
    membership: {
      canCreateInvites: canRoleCreateInvites(membership.role),
      role: membership.role
    },
    ok: true
  };
}

export { getDashboardGamesForCurrentUser, getLobbyGameAccessForCurrentUser };
export type { DashboardGamesResult, LobbyGameAccessResult };
