import type {
  CreateGameInviteFieldErrors,
  CreateGameInviteValues
} from "@/lib/validation/invite.schema";

type CreatedGameInvite = {
  inviteId: string;
  invitePath: string;
  token: string;
};

type CreateGameInviteActionState = {
  fieldErrors: CreateGameInviteFieldErrors;
  formError: string | null;
  invite: CreatedGameInvite | null;
  status: "idle" | "error" | "success";
  values: CreateGameInviteValues;
};

export type { CreatedGameInvite, CreateGameInviteActionState };
