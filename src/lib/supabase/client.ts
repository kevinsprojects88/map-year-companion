import { createBrowserClient } from "@supabase/ssr";

import { getPublicSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

export function createBrowserSupabaseClient() {
  const { supabaseAnonKey, supabaseUrl } = getPublicSupabaseEnv();

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
