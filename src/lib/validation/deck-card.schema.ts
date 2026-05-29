const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CARD_KEY_MAX_LENGTH = 80;
const CARD_PROMPT_TEXT_MAX_LENGTH = 5000;
const CARD_SEASON_MAX_LENGTH = 40;
const MIN_CARD_WEEK_NUMBER = 1;
const MAX_CARD_WEEK_NUMBER = 52;

type UpsertDeckCardInput = FormData | Record<string, unknown>;

type UpsertDeckCardData = {
  cardKey: string;
  gameId: string;
  promptText: string | null;
  season: string | null;
  weekNumber: number;
};

type UpsertDeckCardFieldErrors = {
  cardKey?: string;
  gameId?: string;
  promptText?: string;
  season?: string;
  weekNumber?: string;
};

type UpsertDeckCardValues = {
  cardKey: string;
  gameId: string;
  promptText: string;
  season: string;
  weekNumber: string;
};

type UpsertDeckCardValidationResult =
  | {
      data: UpsertDeckCardData;
      ok: true;
      values: UpsertDeckCardValues;
    }
  | {
      fieldErrors: UpsertDeckCardFieldErrors;
      ok: false;
      values: UpsertDeckCardValues;
    };

function isFormDataInput(input: UpsertDeckCardInput): input is FormData {
  return typeof FormData !== "undefined" && input instanceof FormData;
}

function getInputValue(input: UpsertDeckCardInput, key: string) {
  if (isFormDataInput(input)) {
    return input.get(key);
  }

  return input[key];
}

function getTextValue(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return "";
}

function getNullableTextValue(value: string) {
  return value ? value : null;
}

function getUpsertDeckCardValues(
  input: UpsertDeckCardInput
): UpsertDeckCardValues {
  return {
    cardKey: getTextValue(getInputValue(input, "cardKey")),
    gameId: getTextValue(getInputValue(input, "gameId")),
    promptText: getTextValue(getInputValue(input, "promptText")),
    season: getTextValue(getInputValue(input, "season")),
    weekNumber: getTextValue(getInputValue(input, "weekNumber"))
  };
}

function parseWeekNumber(value: string) {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  return Number.parseInt(value, 10);
}

function validateUpsertDeckCardInput(
  input: UpsertDeckCardInput
): UpsertDeckCardValidationResult {
  const values = getUpsertDeckCardValues(input);
  const fieldErrors: UpsertDeckCardFieldErrors = {};
  const weekNumber = parseWeekNumber(values.weekNumber);

  if (!UUID_PATTERN.test(values.gameId)) {
    fieldErrors.gameId = "Choose a valid game before saving a card.";
  }

  if (
    weekNumber === null ||
    weekNumber < MIN_CARD_WEEK_NUMBER ||
    weekNumber > MAX_CARD_WEEK_NUMBER
  ) {
    fieldErrors.weekNumber = "Week number must be between 1 and 52.";
  }

  if (!values.cardKey) {
    fieldErrors.cardKey = "Card key is required.";
  } else if (values.cardKey.length > CARD_KEY_MAX_LENGTH) {
    fieldErrors.cardKey = "Card key must be 80 characters or fewer.";
  }

  if (values.season.length > CARD_SEASON_MAX_LENGTH) {
    fieldErrors.season = "Season must be 40 characters or fewer.";
  }

  if (values.promptText.length > CARD_PROMPT_TEXT_MAX_LENGTH) {
    fieldErrors.promptText = "Prompt text must be 5000 characters or fewer.";
  }

  if (Object.keys(fieldErrors).length > 0 || weekNumber === null) {
    return {
      fieldErrors,
      ok: false,
      values
    };
  }

  return {
    data: {
      cardKey: values.cardKey,
      gameId: values.gameId,
      promptText: getNullableTextValue(values.promptText),
      season: getNullableTextValue(values.season),
      weekNumber
    },
    ok: true,
    values
  };
}

export {
  CARD_KEY_MAX_LENGTH,
  CARD_PROMPT_TEXT_MAX_LENGTH,
  CARD_SEASON_MAX_LENGTH,
  MAX_CARD_WEEK_NUMBER,
  MIN_CARD_WEEK_NUMBER,
  getUpsertDeckCardValues,
  validateUpsertDeckCardInput
};
export type {
  UpsertDeckCardData,
  UpsertDeckCardFieldErrors,
  UpsertDeckCardInput,
  UpsertDeckCardValidationResult,
  UpsertDeckCardValues
};
