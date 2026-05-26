import { NextResponse, type NextRequest } from "next/server";

import {
  buildAuthSignInPath,
  resolveSafeAuthRedirectPath,
  type AuthRedirectError
} from "@/lib/auth/auth-redirects";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const PROFILE_SETUP_REDIRECT_PATH = "/onboarding/profile";

function redirectToSignIn(requestUrl: URL, error: AuthRedirectError, next: string) {
  return NextResponse.redirect(
    new URL(buildAuthSignInPath({ error, next }), requestUrl.origin)
  );
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const next = resolveSafeAuthRedirectPath(
    requestUrl.searchParams.get("next"),
    PROFILE_SETUP_REDIRECT_PATH
  );
  const code = requestUrl.searchParams.get("code");
  const providerError = requestUrl.searchParams.get("error");

  if (providerError) {
    return redirectToSignIn(requestUrl, "provider-error", next);
  }

  if (!code) {
    return redirectToSignIn(requestUrl, "missing-code", next);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectToSignIn(requestUrl, "exchange-failed", next);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
