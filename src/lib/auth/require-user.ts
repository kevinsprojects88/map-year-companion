import "server-only";

import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { buildAuthSignInPath } from "@/lib/auth/auth-redirects";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type ServerSupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

type AuthenticatedUserContext = {
  supabase: ServerSupabaseClient;
  user: User;
};

async function hasSupabaseAuthCookie() {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .some(
      ({ name }) => name.startsWith("sb-") && name.includes("-auth-token")
    );
}

async function getAuthenticatedUser(): Promise<AuthenticatedUserContext | null> {
  if (!(await hasSupabaseAuthCookie())) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return {
    supabase,
    user: data.user
  };
}

async function requireUser(
  redirectTo = "/onboarding/profile"
): Promise<AuthenticatedUserContext> {
  const context = await getAuthenticatedUser();

  if (!context) {
    redirect(buildAuthSignInPath({ next: redirectTo }));
  }

  return context;
}

export { getAuthenticatedUser, requireUser };
export type { AuthenticatedUserContext };
