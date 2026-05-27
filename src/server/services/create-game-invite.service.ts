import "server-only";

import { getAuthenticatedUser } from "@/lib/auth/require-user";
import type { Database } from "@/lib/supabase/types";
import {
  validateCreateGameInviteInput,
  type CreateGameInviteFieldErrors,
  type CreateGameInviteInput,
  type CreateGameInviteValues
} from "@/lib/validation/invite.schema";
import { getActiveOwnerAdminInvitePermission } from "@/server/queries/invite.queries";
import {
  generateInviteToken,
  hashInviteToken
} from "@/server/services/invite-token.service";
import type { CreatedGameInvite } from "@/types/invite";

const GENERIC_CREATE_INVITE_ERROR =
  "We could not create an invite right now. Try again in a moment.";

type CreateGameInviteForCurrentUserResult =
  | ({
      ok: true;
    } & CreatedGameInvite)
  | {
      fieldErrors?: CreateGameInviteFieldErrors;
      formError?: string;
      ok: false;
      values: CreateGameInviteValues;
    };

async function createGameInviteForCurrentUser(
  input: CreateGameInviteInput
): Promise<CreateGameInviteForCurrentUserResult> {
  const validation = validateCreateGameInviteInput(input);

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
      formError: "Sign in again before creating an invite.",
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
      formError: GENERIC_CREATE_INVITE_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (!profile) {
    return {
      formError: "Finish your profile before creating an invite.",
      ok: false,
      values: validation.values
    };
  }

  const permission = await getActiveOwnerAdminInvitePermission(
    { supabase, user },
    validation.data.gameId
  );

  if (!permission.ok) {
    return {
      formError: GENERIC_CREATE_INVITE_ERROR,
      ok: false,
      values: validation.values
    };
  }

  if (!permission.canCreateInvite) {
    return {
      formError: "Only game owners and admins can create invites for this game.",
      ok: false,
      values: validation.values
    };
  }

  const token = generateInviteToken();
  const tokenHash = hashInviteToken(token);
  const insertPayload: Database["public"]["Tables"]["game_invites"]["Insert"] =
    {
      created_by: profile.id,
      game_id: validation.data.gameId,
      token_hash: tokenHash
    };

  if (validation.data.expiresAt) {
    insertPayload.expires_at = validation.data.expiresAt;
  }

  if (validation.data.maxUses !== null) {
    insertPayload.max_uses = validation.data.maxUses;
  }

  const { data: invite, error: inviteError } = await supabase
    .from("game_invites")
    .insert(insertPayload)
    .select("id")
    .single();

  if (inviteError || !invite) {
    return {
      formError: GENERIC_CREATE_INVITE_ERROR,
      ok: false,
      values: validation.values
    };
  }

  return {
    inviteId: invite.id,
    invitePath: `/invites/${token}`,
    ok: true,
    token
  };
}

export { createGameInviteForCurrentUser };
export type { CreateGameInviteForCurrentUserResult };
