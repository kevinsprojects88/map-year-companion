const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const INVITE_TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;
const INVITE_TOKEN_MIN_LENGTH = 32;
const INVITE_TOKEN_MAX_LENGTH = 128;

type InviteInput = FormData | Record<string, unknown>;
type CreateGameInviteInput = InviteInput;
type AcceptGameInviteInput = InviteInput;

type CreateGameInviteData = {
  expiresAt: string | null;
  gameId: string;
  maxUses: number | null;
};

type CreateGameInviteFieldErrors = {
  expiresAt?: string;
  gameId?: string;
  maxUses?: string;
};

type CreateGameInviteValues = {
  expiresAt: string;
  gameId: string;
  maxUses: string;
};

type AcceptGameInviteData = {
  token: string;
};

type AcceptGameInviteFieldErrors = {
  token?: string;
};

type AcceptGameInviteValues = {
  token: string;
};

type CreateGameInviteValidationResult =
  | {
      data: CreateGameInviteData;
      ok: true;
      values: CreateGameInviteValues;
    }
  | {
      fieldErrors: CreateGameInviteFieldErrors;
      ok: false;
      values: CreateGameInviteValues;
    };

type AcceptGameInviteValidationResult =
  | {
      data: AcceptGameInviteData;
      ok: true;
      values: AcceptGameInviteValues;
    }
  | {
      fieldErrors: AcceptGameInviteFieldErrors;
      ok: false;
      values: AcceptGameInviteValues;
    };

function isFormDataInput(input: InviteInput): input is FormData {
  return typeof FormData !== "undefined" && input instanceof FormData;
}

function getInputValue(input: InviteInput, key: string) {
  if (isFormDataInput(input)) {
    return input.get(key);
  }

  return input[key];
}

function getTextValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return typeof value === "string" ? value.trim() : "";
}

function getCreateGameInviteValues(
  input: CreateGameInviteInput
): CreateGameInviteValues {
  return {
    expiresAt: getTextValue(getInputValue(input, "expiresAt")),
    gameId: getTextValue(getInputValue(input, "gameId")),
    maxUses: getTextValue(getInputValue(input, "maxUses"))
  };
}

function getAcceptGameInviteValues(
  input: AcceptGameInviteInput
): AcceptGameInviteValues {
  return {
    token: getTextValue(getInputValue(input, "token"))
  };
}

function validateCreateGameInviteInput(
  input: CreateGameInviteInput
): CreateGameInviteValidationResult {
  const values = getCreateGameInviteValues(input);
  const fieldErrors: CreateGameInviteFieldErrors = {};

  if (!UUID_PATTERN.test(values.gameId)) {
    fieldErrors.gameId = "Choose a valid game before creating an invite.";
  }

  let expiresAt: string | null = null;

  if (values.expiresAt) {
    const expiresAtTime = Date.parse(values.expiresAt);

    if (Number.isNaN(expiresAtTime)) {
      fieldErrors.expiresAt = "Enter a valid expiration date.";
    } else if (expiresAtTime <= Date.now()) {
      fieldErrors.expiresAt = "Expiration must be in the future.";
    } else {
      expiresAt = new Date(expiresAtTime).toISOString();
    }
  }

  let maxUses: number | null = null;

  if (values.maxUses) {
    const parsedMaxUses = Number(values.maxUses);

    if (!Number.isInteger(parsedMaxUses) || parsedMaxUses <= 0) {
      fieldErrors.maxUses = "Max uses must be a positive whole number.";
    } else {
      maxUses = parsedMaxUses;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      ok: false,
      values
    };
  }

  return {
    data: {
      expiresAt,
      gameId: values.gameId,
      maxUses
    },
    ok: true,
    values
  };
}

function validateAcceptGameInviteInput(
  input: AcceptGameInviteInput
): AcceptGameInviteValidationResult {
  const values = getAcceptGameInviteValues(input);
  const fieldErrors: AcceptGameInviteFieldErrors = {};

  if (!values.token) {
    fieldErrors.token = "Enter a valid invite token.";
  } else if (!INVITE_TOKEN_PATTERN.test(values.token)) {
    fieldErrors.token = "Invite token must use only URL-safe characters.";
  } else if (
    values.token.length < INVITE_TOKEN_MIN_LENGTH ||
    values.token.length > INVITE_TOKEN_MAX_LENGTH
  ) {
    fieldErrors.token = "Invite token is not the expected length.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      ok: false,
      values
    };
  }

  return {
    data: {
      token: values.token
    },
    ok: true,
    values
  };
}

export {
  getAcceptGameInviteValues,
  getCreateGameInviteValues,
  INVITE_TOKEN_MAX_LENGTH,
  INVITE_TOKEN_MIN_LENGTH,
  INVITE_TOKEN_PATTERN,
  validateAcceptGameInviteInput,
  validateCreateGameInviteInput,
  UUID_PATTERN
};
export type {
  AcceptGameInviteData,
  AcceptGameInviteFieldErrors,
  AcceptGameInviteInput,
  AcceptGameInviteValidationResult,
  AcceptGameInviteValues,
  CreateGameInviteData,
  CreateGameInviteFieldErrors,
  CreateGameInviteInput,
  CreateGameInviteValidationResult,
  CreateGameInviteValues
};
