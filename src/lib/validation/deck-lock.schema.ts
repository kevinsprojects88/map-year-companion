const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type LockDeckInput = FormData | Record<string, unknown>;

type LockDeckData = {
  gameId: string;
};

type LockDeckFieldErrors = {
  gameId?: string;
};

type LockDeckValues = {
  gameId: string;
};

type LockDeckValidationResult =
  | {
      data: LockDeckData;
      ok: true;
      values: LockDeckValues;
    }
  | {
      fieldErrors: LockDeckFieldErrors;
      ok: false;
      values: LockDeckValues;
    };

function isFormDataInput(input: LockDeckInput): input is FormData {
  return typeof FormData !== "undefined" && input instanceof FormData;
}

function getInputValue(input: LockDeckInput, key: string) {
  if (isFormDataInput(input)) {
    return input.get(key);
  }

  return input[key];
}

function getTextValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getLockDeckValues(input: LockDeckInput): LockDeckValues {
  return {
    gameId: getTextValue(getInputValue(input, "gameId"))
  };
}

function validateLockDeckInput(
  input: LockDeckInput
): LockDeckValidationResult {
  const values = getLockDeckValues(input);
  const fieldErrors: LockDeckFieldErrors = {};

  if (!UUID_PATTERN.test(values.gameId)) {
    fieldErrors.gameId = "Choose a valid game before locking the deck.";
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
      gameId: values.gameId
    },
    ok: true,
    values
  };
}

export { getLockDeckValues, validateLockDeckInput };
export type {
  LockDeckData,
  LockDeckFieldErrors,
  LockDeckInput,
  LockDeckValidationResult,
  LockDeckValues
};
