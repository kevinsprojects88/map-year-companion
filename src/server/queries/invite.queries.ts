import "server-only";

import type { AuthenticatedUserContext } from "@/lib/auth/require-user";

type InvitePermissionQueryContext = Pick<
  AuthenticatedUserContext,
  "supabase" | "user"
>;

type OwnerAdminInvitePermissionResult =
  | {
      canCreateInvite: boolean;
      ok: true;
    }
  | {
      error: "membership-unavailable";
      ok: false;
    };

async function getActiveOwnerAdminInvitePermission(
  { supabase, user }: InvitePermissionQueryContext,
  gameId: string
): Promise<OwnerAdminInvitePermissionResult> {
  const { data, error } = await supabase
    .from("game_memberships")
    .select("id")
    .eq("game_id", gameId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .in("role", ["owner", "admin"])
    .maybeSingle();

  if (error) {
    return {
      error: "membership-unavailable",
      ok: false
    };
  }

  return {
    canCreateInvite: Boolean(data),
    ok: true
  };
}

export { getActiveOwnerAdminInvitePermission };
export type { OwnerAdminInvitePermissionResult };
