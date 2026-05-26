const PROFILE_DISPLAY_NAME_MAX_LENGTH = 80;

type ProfileDisplayNameValidationResult =
  | {
      displayName: string;
      ok: true;
    }
  | {
      message: string;
      ok: false;
    };

function getTextValue(value: FormDataEntryValue | null | string) {
  return typeof value === "string" ? value : "";
}

function validateProfileDisplayName(
  value: FormDataEntryValue | null | string
): ProfileDisplayNameValidationResult {
  const displayName = getTextValue(value).trim();

  if (!displayName) {
    return {
      message: "Enter a display name.",
      ok: false
    };
  }

  if (displayName.length > PROFILE_DISPLAY_NAME_MAX_LENGTH) {
    return {
      message: "Display name must be 80 characters or fewer.",
      ok: false
    };
  }

  return { displayName, ok: true };
}

export { PROFILE_DISPLAY_NAME_MAX_LENGTH, validateProfileDisplayName };
export type { ProfileDisplayNameValidationResult };
