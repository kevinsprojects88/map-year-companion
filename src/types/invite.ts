import type {
  AcceptGameInviteFieldErrors,
  AcceptGameInviteValues,
  CreateGameInviteFieldErrors,
  CreateGameInviteValues
} from "@/lib/validation/invite.schema";

type CreatedGameInvite = {
  inviteId: string;
  invitePath: string;
  token: string;
};

type CreatedGameInviteActionResult = Pick<CreatedGameInvite, "invitePath">;

type CreateGameInviteActionState = {
  fieldErrors: CreateGameInviteFieldErrors;
  formError: string | null;
  invite: CreatedGameInviteActionResult | null;
  status: "idle" | "error" | "success";
  values: CreateGameInviteValues;
};

type AcceptedGameInvite = {
  gameId: string;
  membershipId: string;
};

type AcceptGameInviteActionState = {
  fieldErrors: AcceptGameInviteFieldErrors;
  formError: string | null;
  gameId: string | null;
  membershipId: string | null;
  status: "idle" | "error" | "success";
  values: AcceptGameInviteValues;
};

export type {
  AcceptedGameInvite,
  AcceptGameInviteActionState,
  CreatedGameInvite,
  CreatedGameInviteActionResult,
  CreateGameInviteActionState
};
