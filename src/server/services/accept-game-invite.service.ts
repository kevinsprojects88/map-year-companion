import "server-only";

import { getAuthenticatedUser } from "@/lib/auth/require-user";
import {
  validateAcceptGameInviteInput,
  type AcceptGameInviteFieldErrors,
  type AcceptGameInviteInput,
  type AcceptGameInviteValues
} from "@/lib/validation/invite.schema";
import { hashInviteToken } from "@/server/services/invite-token.service";

const GENERIC_ACCEPT_INVITE_ERROR =
  "We could not accept this invite right now. Try again in a moment.";

type AcceptGameInviteForCurrentUserResult =
  | {
      gameId: string;
      membershipId: string;
      ok: true;
    }
  | {
      fieldErrors?: AcceptGameInviteFieldErrors;
      formError?: string;
      ok: false;
      values: AcceptGameInviteValues;
    };

type AcceptGameInviteRpcRow = {
  game_id: unknown;
  membership_id: unknown;
};

function getAcceptInviteRpcErrorMessage(message?: string) {
  switch (message) {
    case "A profile is required to accept an invite.":
      return "Finish your profile before accepting this invite.";
    case "Invite is invalid or no longer available.":
    case "This invite has expired.":
    case "This invite has no remaining uses.":
    case "This account cannot accept this invite right now. Ask the game owner to add you again.":
      return message;
    default:
      return GENERIC_ACCEPT_INVITE_ERROR;
  }
}

function getFirstRpcRow(data: unknown): AcceptGameInviteRpcRow | null {
  const row = Array.isArray(data) ? data[0] : data;

  if (!row || typeof row !== "object") {
    return null;
  }

  return row as AcceptGameInviteRpcRow;
}

async function acceptGameInviteForCurrentUser(
  input: AcceptGameInviteInput
): Promise<AcceptGameInviteForCurrentUserResult> {
  const validation = validateAcceptGameInviteInput(input);

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
      formError: "Sign in again before accepting this invite.",
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
      formError: GENERIC_ACCEPT_INVITE_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (!profile) {
    return {
      formError: "Finish your profile before accepting this invite.",
      ok: false,
      values: validation.values
    };
  }

  const tokenHash = hashInviteToken(validation.data.token);
  const { data, error } = await supabase.rpc("accept_game_invite", {
    invite_token_hash: tokenHash
  });

  if (error) {
    return {
      formError: getAcceptInviteRpcErrorMessage(error.message),
      ok: false,
      values: validation.values
    };
  }

  const acceptedInvite = getFirstRpcRow(data);

  if (
    !acceptedInvite ||
    typeof acceptedInvite.game_id !== "string" ||
    typeof acceptedInvite.membership_id !== "string"
  ) {
    return {
      formError: GENERIC_ACCEPT_INVITE_ERROR,
      ok: false,
      values: validation.values
    };
  }

  return {
    gameId: acceptedInvite.game_id,
    membershipId: acceptedInvite.membership_id,
    ok: true
  };
}

export { acceptGameInviteForCurrentUser };
export type { AcceptGameInviteForCurrentUserResult };
