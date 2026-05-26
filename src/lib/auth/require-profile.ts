import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import {
  resolveSafeAuthRedirectPath,
  type AuthRedirectSearchParam
} from "@/lib/auth/auth-redirects";
import { requireUser } from "@/lib/auth/require-user";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/profile";

type ServerSupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

type AuthenticatedProfileContext = {
  profile: Profile;
  supabase: ServerSupabaseClient;
  user: User;
};

const DEFAULT_PROFILE_REDIRECT_PATH = "/dashboard";
const PROFILE_SETUP_PATH = "/onboarding/profile";

function buildProfileSetupPath(next?: AuthRedirectSearchParam) {
  const safeNext = resolveSafeAuthRedirectPath(
    next,
    DEFAULT_PROFILE_REDIRECT_PATH
  );
  const profileSetupPath = new URL(
    PROFILE_SETUP_PATH,
    "https://map-year-companion.local"
  );

  if (safeNext !== PROFILE_SETUP_PATH) {
    profileSetupPath.searchParams.set("next", safeNext);
  }

  return `${profileSetupPath.pathname}${profileSetupPath.search}`;
}

async function requireProfile(
  redirectTo: AuthRedirectSearchParam = DEFAULT_PROFILE_REDIRECT_PATH
): Promise<AuthenticatedProfileContext> {
  const safeRedirectTo = resolveSafeAuthRedirectPath(
    redirectTo,
    DEFAULT_PROFILE_REDIRECT_PATH
  );
  const { supabase, user } = await requireUser(safeRedirectTo);

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_color, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    redirect(buildProfileSetupPath(safeRedirectTo));
  }

  return {
    profile: data,
    supabase,
    user
  };
}

export { buildProfileSetupPath, requireProfile };
export type { AuthenticatedProfileContext };
