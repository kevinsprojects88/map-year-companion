import "server-only";

import { getAuthenticatedUser } from "@/lib/auth/require-user";
import {
  validateUpdateTurnOrderInput,
  type UpdateTurnOrderFieldErrors,
  type UpdateTurnOrderInput,
  type UpdateTurnOrderValues
} from "@/lib/validation/turn-order.schema";

const GENERIC_UPDATE_TURN_ORDER_ERROR =
  "We could not save turn order right now. Try again in a moment.";

type UpdateLobbyTurnOrderForCurrentUserResult =
  | {
      gameId: string;
      ok: true;
      values: UpdateTurnOrderValues;
    }
  | {
      fieldErrors?: UpdateTurnOrderFieldErrors;
      formError?: string;
      ok: false;
      values: UpdateTurnOrderValues;
    };

type ActiveMembershipRow = {
  user_id: string;
};

function getUpdateTurnOrderRpcErrorMessage(message?: string) {
  switch (message) {
    case "Only game owners and admins can save turn order.":
    case "Turn order must include every active member exactly once.":
    case "Turn order must include at least one active member.":
    case "Each active member can appear only once.":
    case "Each turn order member id must be valid.":
      return message;
    default:
      return GENERIC_UPDATE_TURN_ORDER_ERROR;
  }
}

function orderedIdsMatchActiveMembers({
  activeMemberships,
  orderedProfileIds
}: {
  activeMemberships: ActiveMembershipRow[];
  orderedProfileIds: string[];
}) {
  if (activeMemberships.length !== orderedProfileIds.length) {
    return false;
  }

  const activeProfileIds = new Set(
    activeMemberships.map((membership) => membership.user_id)
  );

  return orderedProfileIds.every((profileId) => activeProfileIds.has(profileId));
}

async function updateLobbyTurnOrderForCurrentUser(
  input: UpdateTurnOrderInput
): Promise<UpdateLobbyTurnOrderForCurrentUserResult> {
  const validation = validateUpdateTurnOrderInput(input);

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
      formError: "Sign in again before saving turn order.",
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
      formError: GENERIC_UPDATE_TURN_ORDER_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (!profile) {
    return {
      formError: "Finish your profile before saving turn order.",
      ok: false,
      values: validation.values
    };
  }

  const { data: permission, error: permissionError } = await supabase
    .from("game_memberships")
    .select("id")
    .eq("game_id", validation.data.gameId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .in("role", ["owner", "admin"])
    .maybeSingle();

  if (permissionError) {
    return {
      formError: GENERIC_UPDATE_TURN_ORDER_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (!permission) {
    return {
      formError: "Only game owners and admins can save turn order.",
      ok: false,
      values: validation.values
    };
  }

  const { data: activeMemberships, error: activeMembershipsError } =
    await supabase
      .from("game_memberships")
      .select("user_id")
      .eq("game_id", validation.data.gameId)
      .eq("status", "active");

  if (activeMembershipsError || !activeMemberships) {
    return {
      formError: GENERIC_UPDATE_TURN_ORDER_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (
    !orderedIdsMatchActiveMembers({
      activeMemberships,
      orderedProfileIds: validation.data.orderedProfileIds
    })
  ) {
    return {
      formError: "Turn order must include every active member exactly once.",
      ok: false,
      values: validation.values
    };
  }

  const { error: updateError } = await supabase.rpc("update_game_turn_order", {
    ordered_profile_ids: validation.data.orderedProfileIds,
    target_game_id: validation.data.gameId
  });

  if (updateError) {
    return {
      formError: getUpdateTurnOrderRpcErrorMessage(updateError.message),
      ok: false,
      values: validation.values
    };
  }

  return {
    gameId: validation.data.gameId,
    ok: true,
    values: validation.values
  };
}

export { updateLobbyTurnOrderForCurrentUser };
export type { UpdateLobbyTurnOrderForCurrentUserResult };
