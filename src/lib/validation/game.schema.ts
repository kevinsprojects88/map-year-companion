const GAME_NAME_MAX_LENGTH = 120;
const GAME_DESCRIPTION_MAX_LENGTH = 1000;

type CreateGameInput = FormData | Record<string, unknown>;

type CreateGameData = {
  description: string | null;
  name: string;
};

type CreateGameFieldErrors = {
  description?: string;
  name?: string;
};

type CreateGameValues = {
  description: string;
  name: string;
};

type CreateGameValidationResult =
  | {
      data: CreateGameData;
      ok: true;
    }
  | {
      fieldErrors: CreateGameFieldErrors;
      ok: false;
      values: CreateGameValues;
    };

function isFormDataInput(input: CreateGameInput): input is FormData {
  return typeof FormData !== "undefined" && input instanceof FormData;
}

function getInputValue(input: CreateGameInput, key: string) {
  if (isFormDataInput(input)) {
    return input.get(key);
  }

  return input[key];
}

function getTextValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateCreateGameInput(
  input: CreateGameInput
): CreateGameValidationResult {
  const name = getTextValue(getInputValue(input, "name"));
  const description = getTextValue(getInputValue(input, "description"));
  const fieldErrors: CreateGameFieldErrors = {};

  if (!name) {
    fieldErrors.name = "Enter a game name.";
  } else if (name.length > GAME_NAME_MAX_LENGTH) {
    fieldErrors.name = "Game name must be 120 characters or fewer.";
  }

  if (description.length > GAME_DESCRIPTION_MAX_LENGTH) {
    fieldErrors.description =
      "Description must be 1000 characters or fewer.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      ok: false,
      values: {
        description,
        name
      }
    };
  }

  return {
    data: {
      description: description || null,
      name
    },
    ok: true
  };
}

export {
  GAME_DESCRIPTION_MAX_LENGTH,
  GAME_NAME_MAX_LENGTH,
  validateCreateGameInput
};
export type {
  CreateGameData,
  CreateGameFieldErrors,
  CreateGameInput,
  CreateGameValidationResult,
  CreateGameValues
};
