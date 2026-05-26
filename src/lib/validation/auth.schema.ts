const EMAIL_MAX_LENGTH = 254;
const BASIC_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuthEmailValidationResult =
  | {
      email: string;
      ok: true;
    }
  | {
      message: string;
      ok: false;
    };

function validateMagicLinkEmail(value: string): AuthEmailValidationResult {
  const email = value.trim();

  if (!email) {
    return {
      message: "Enter the email address for your account.",
      ok: false
    };
  }

  if (email.length > EMAIL_MAX_LENGTH || !BASIC_EMAIL_PATTERN.test(email)) {
    return {
      message: "Enter a valid email address.",
      ok: false
    };
  }

  return { email, ok: true };
}

export { validateMagicLinkEmail };
export type { AuthEmailValidationResult };
