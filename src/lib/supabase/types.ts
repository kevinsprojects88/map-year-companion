export type Json =
  | boolean
  | null
  | number
  | string
  | Json[]
  | { [key: string]: Json | undefined };

export type Database = {
  public: {
    CompositeTypes: Record<string, never>;
    Enums: Record<string, never>;
    Functions: Record<string, never>;
    Tables: {
      profiles: {
        Insert: {
          avatar_color?: string | null;
          created_at?: string;
          display_name: string;
          id: string;
          updated_at?: string;
        };
        Relationships: [];
        Row: {
          avatar_color: string | null;
          created_at: string;
          display_name: string;
          id: string;
          updated_at: string;
        };
        Update: {
          avatar_color?: string | null;
          created_at?: string;
          display_name?: string;
          id?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
  };
};
