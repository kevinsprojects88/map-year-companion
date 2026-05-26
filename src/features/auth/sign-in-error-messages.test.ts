import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSignInErrorMessages,
  friendlySignInErrorMessage
} from "./sign-in-error-messages";

test("returns only the friendly sign-in error outside development", () => {
  const messages = buildSignInErrorMessages({
    nodeEnv: "production",
    supabaseErrorMessage: "Email address is invalid"
  });

  assert.deepEqual(messages, [friendlySignInErrorMessage]);
});

test("includes Supabase sign-in error detail only in development", () => {
  const messages = buildSignInErrorMessages({
    nodeEnv: "development",
    supabaseErrorMessage: "Email address is invalid"
  });

  assert.deepEqual(messages, [
    friendlySignInErrorMessage,
    "Supabase detail: Email address is invalid"
  ]);
});
