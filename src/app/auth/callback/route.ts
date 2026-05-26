import { NextResponse, type NextRequest } from "next/server";

import {
  buildAuthSignInPath,
  resolveSafeAuthRedirectPath,
  type AuthRedirectError
} from "@/lib/auth/auth-redirects";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const DASHBOARD_REDIRECT_PATH = "/dashboard";
const PROFILE_SETUP_REDIRECT_PATH = "/onboarding/profile";

type ServerSupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

function redirectToSignIn(requestUrl: URL, error: AuthRedirectError, next: string) {
  return NextResponse.redirect(
    new URL(buildAuthSignInPath({ error, next }), requestUrl.origin)
  );
}

async function getDefaultSuccessfulAuthRedirectPath({
  supabase,
  userId
}: {
  supabase: ServerSupabaseClient;
  userId?: string;
}) {
  if (!userId) {
    return PROFILE_SETUP_REDIRECT_PATH;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return PROFILE_SETUP_REDIRECT_PATH;
  }

  return DASHBOARD_REDIRECT_PATH;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const requestedNext = requestUrl.searchParams.get("next");
  const next = resolveSafeAuthRedirectPath(
    requestedNext,
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
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectToSignIn(requestUrl, "exchange-failed", next);
  }

  if (requestedNext !== null) {
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  const defaultRedirectPath = await getDefaultSuccessfulAuthRedirectPath({
    supabase,
    userId: data.user?.id
  });

  return NextResponse.redirect(new URL(defaultRedirectPath, requestUrl.origin));
}
