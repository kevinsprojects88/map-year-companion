const friendlySignInErrorMessage =
  "The sign-in email could not be sent. Check the address and try again.";

type BuildSignInErrorMessagesOptions = {
  nodeEnv: string | undefined;
  supabaseErrorMessage: string | null | undefined;
};

function buildSignInErrorMessages({
  nodeEnv,
  supabaseErrorMessage
}: BuildSignInErrorMessagesOptions) {
  const messages = [friendlySignInErrorMessage];
  const developerMessage = supabaseErrorMessage?.trim();

  if (nodeEnv === "development" && developerMessage) {
    messages.push(`Supabase detail: ${developerMessage}`);
  }

  return messages;
}

export { buildSignInErrorMessages, friendlySignInErrorMessage };
export type { BuildSignInErrorMessagesOptions };
