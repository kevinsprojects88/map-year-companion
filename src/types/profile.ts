import type { Database } from "@/lib/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type ProfileActionState = {
  displayName: string;
  fieldErrors: {
    displayName?: string;
  };
  formError: string | null;
  status: "idle" | "error";
};
