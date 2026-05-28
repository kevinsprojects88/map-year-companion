const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type UpdateTurnOrderInput = FormData | Record<string, unknown>;

type UpdateTurnOrderData = {
  gameId: string;
  orderedProfileIds: string[];
};

type UpdateTurnOrderFieldErrors = {
  gameId?: string;
  orderedProfileIds?: string;
};

type UpdateTurnOrderValues = {
  gameId: string;
  orderedProfileIds: string[];
};

type UpdateTurnOrderValidationResult =
  | {
      data: UpdateTurnOrderData;
      ok: true;
      values: UpdateTurnOrderValues;
    }
  | {
      fieldErrors: UpdateTurnOrderFieldErrors;
      ok: false;
      values: UpdateTurnOrderValues;
    };

function isFormDataInput(input: UpdateTurnOrderInput): input is FormData {
  return typeof FormData !== "undefined" && input instanceof FormData;
}

function getInputValue(input: UpdateTurnOrderInput, key: string) {
  if (isFormDataInput(input)) {
    return input.get(key);
  }

  return input[key];
}

function getTextValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getOrderedProfileIdValues(input: UpdateTurnOrderInput) {
  const values = isFormDataInput(input)
    ? input.getAll("orderedProfileIds")
    : input.orderedProfileIds;

  if (Array.isArray(values)) {
    return values.map(getTextValue);
  }

  const singleValue = getTextValue(values);

  return singleValue ? [singleValue] : [];
}

function getUpdateTurnOrderValues(
  input: UpdateTurnOrderInput
): UpdateTurnOrderValues {
  return {
    gameId: getTextValue(getInputValue(input, "gameId")),
    orderedProfileIds: getOrderedProfileIdValues(input)
  };
}

function validateUpdateTurnOrderInput(
  input: UpdateTurnOrderInput
): UpdateTurnOrderValidationResult {
  const values = getUpdateTurnOrderValues(input);
  const fieldErrors: UpdateTurnOrderFieldErrors = {};

  if (!UUID_PATTERN.test(values.gameId)) {
    fieldErrors.gameId = "Choose a valid game before saving turn order.";
  }

  if (values.orderedProfileIds.length === 0) {
    fieldErrors.orderedProfileIds =
      "Turn order must include at least one active member.";
  } else if (
    values.orderedProfileIds.some(
      (orderedProfileId) => !UUID_PATTERN.test(orderedProfileId)
    )
  ) {
    fieldErrors.orderedProfileIds =
      "Each turn order member id must be valid.";
  } else if (
    new Set(values.orderedProfileIds).size !== values.orderedProfileIds.length
  ) {
    fieldErrors.orderedProfileIds = "Each active member can appear only once.";
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
      gameId: values.gameId,
      orderedProfileIds: values.orderedProfileIds
    },
    ok: true,
    values
  };
}

export { getUpdateTurnOrderValues, validateUpdateTurnOrderInput };
export type {
  UpdateTurnOrderData,
  UpdateTurnOrderFieldErrors,
  UpdateTurnOrderInput,
  UpdateTurnOrderValidationResult,
  UpdateTurnOrderValues
};
