const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type CreateGameInviteInput = FormData | Record<string, unknown>;

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

function isFormDataInput(input: CreateGameInviteInput): input is FormData {
  return typeof FormData !== "undefined" && input instanceof FormData;
}

function getInputValue(input: CreateGameInviteInput, key: string) {
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

export {
  getCreateGameInviteValues,
  validateCreateGameInviteInput,
  UUID_PATTERN
};
export type {
  CreateGameInviteData,
  CreateGameInviteFieldErrors,
  CreateGameInviteInput,
  CreateGameInviteValidationResult,
  CreateGameInviteValues
};
