type PublicSupabaseEnv = {
  supabaseAnonKey: string;
  supabaseUrl: string;
};

function requirePublicEnv(name: string, value: string | undefined): string {
  if (value?.trim()) {
    return value;
  }

  throw new Error(
    `Missing required public environment variable: ${name}. Add it to your local environment before using Supabase.`
  );
}

export function getPublicSupabaseEnv(): PublicSupabaseEnv {
  return {
    supabaseAnonKey: requirePublicEnv(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    supabaseUrl: requirePublicEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL
    )
  };
}
