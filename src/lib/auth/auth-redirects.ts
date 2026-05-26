const DEFAULT_AUTH_REDIRECT_PATH = "/";

const authRedirectErrorMessages = {
  "exchange-failed":
    "That sign-in link could not be confirmed. Request a fresh link and try again.",
  "missing-code":
    "That sign-in link is missing the confirmation code. Request a fresh link and try again.",
  "provider-error":
    "Supabase could not finish the sign-in request. Request a fresh link and try again."
} as const;

type AuthRedirectError = keyof typeof authRedirectErrorMessages;

type AuthRedirectSearchParam = string | string[] | null | undefined;

function getFirstSearchParam(value: AuthRedirectSearchParam) {
  return Array.isArray(value) ? value[0] : value;
}

function isAuthRedirectError(value: string): value is AuthRedirectError {
  return Object.prototype.hasOwnProperty.call(authRedirectErrorMessages, value);
}

function isSafeInternalRedirectPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return false;
  }

  if (path.includes("\\") || /[\r\n\t]/.test(path)) {
    return false;
  }

  try {
    const parsedPath = new URL(path, "https://map-year-companion.local");

    if (parsedPath.origin !== "https://map-year-companion.local") {
      return false;
    }

    if (
      parsedPath.pathname === "/auth/callback" ||
      parsedPath.pathname === "/auth/sign-in"
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function resolveSafeAuthRedirectPath(
  value: AuthRedirectSearchParam,
  fallback = DEFAULT_AUTH_REDIRECT_PATH
) {
  const safeFallback = isSafeInternalRedirectPath(fallback)
    ? fallback
    : DEFAULT_AUTH_REDIRECT_PATH;
  const redirectPath = getFirstSearchParam(value)?.trim();

  if (!redirectPath || !isSafeInternalRedirectPath(redirectPath)) {
    return safeFallback;
  }

  return redirectPath;
}

function buildAuthCallbackUrl(origin: string, redirectPath: string) {
  const callbackUrl = new URL("/auth/callback", origin);
  const safeRedirectPath = resolveSafeAuthRedirectPath(redirectPath);

  if (safeRedirectPath !== DEFAULT_AUTH_REDIRECT_PATH) {
    callbackUrl.searchParams.set("next", safeRedirectPath);
  }

  return callbackUrl.toString();
}

function buildAuthSignInPath({
  error,
  next
}: {
  error?: AuthRedirectError;
  next?: AuthRedirectSearchParam;
}) {
  const signInPath = new URL(
    "/auth/sign-in",
    "https://map-year-companion.local"
  );
  const safeRedirectPath = resolveSafeAuthRedirectPath(next);

  if (error) {
    signInPath.searchParams.set("error", error);
  }

  if (safeRedirectPath !== DEFAULT_AUTH_REDIRECT_PATH) {
    signInPath.searchParams.set("next", safeRedirectPath);
  }

  return `${signInPath.pathname}${signInPath.search}`;
}

function getAuthRedirectErrorMessage(value: AuthRedirectSearchParam) {
  const error = getFirstSearchParam(value)?.trim();

  if (!error || !isAuthRedirectError(error)) {
    return null;
  }

  return authRedirectErrorMessages[error];
}

export {
  DEFAULT_AUTH_REDIRECT_PATH,
  buildAuthCallbackUrl,
  buildAuthSignInPath,
  getAuthRedirectErrorMessage,
  resolveSafeAuthRedirectPath
};
export type { AuthRedirectError, AuthRedirectSearchParam };
