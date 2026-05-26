import "server-only";

import { requireUser } from "@/lib/auth/require-user";
import type { Profile } from "@/types/profile";

type CurrentUserProfileResult = {
  profile: Profile | null;
  profileError: "profile-unavailable" | null;
  userEmail: string | null;
};

async function getCurrentUserProfile(): Promise<CurrentUserProfileResult> {
  const { supabase, user } = await requireUser("/onboarding/profile");

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_color, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return {
      profile: null,
      profileError: "profile-unavailable",
      userEmail: user.email ?? null
    };
  }

  return {
    profile: data,
    profileError: null,
    userEmail: user.email ?? null
  };
}

export { getCurrentUserProfile };
export type { CurrentUserProfileResult };
