const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type CreateDraftDeckInput = FormData | Record<string, unknown>;

type CreateDraftDeckData = {
  gameId: string;
};

type CreateDraftDeckFieldErrors = {
  gameId?: string;
};

type CreateDraftDeckValues = {
  gameId: string;
};

type CreateDraftDeckValidationResult =
  | {
      data: CreateDraftDeckData;
      ok: true;
      values: CreateDraftDeckValues;
    }
  | {
      fieldErrors: CreateDraftDeckFieldErrors;
      ok: false;
      values: CreateDraftDeckValues;
    };

function isFormDataInput(input: CreateDraftDeckInput): input is FormData {
  return typeof FormData !== "undefined" && input instanceof FormData;
}

function getInputValue(input: CreateDraftDeckInput, key: string) {
  if (isFormDataInput(input)) {
    return input.get(key);
  }

  return input[key];
}

function getTextValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getCreateDraftDeckValues(
  input: CreateDraftDeckInput
): CreateDraftDeckValues {
  return {
    gameId: getTextValue(getInputValue(input, "gameId"))
  };
}

function validateCreateDraftDeckInput(
  input: CreateDraftDeckInput
): CreateDraftDeckValidationResult {
  const values = getCreateDraftDeckValues(input);
  const fieldErrors: CreateDraftDeckFieldErrors = {};

  if (!UUID_PATTERN.test(values.gameId)) {
    fieldErrors.gameId = "Choose a valid game before creating a draft deck.";
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

export { getCreateDraftDeckValues, validateCreateDraftDeckInput };
export type {
  CreateDraftDeckData,
  CreateDraftDeckFieldErrors,
  CreateDraftDeckInput,
  CreateDraftDeckValidationResult,
  CreateDraftDeckValues
};
