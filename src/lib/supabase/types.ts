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
    Enums: {
      game_member_role: "owner" | "admin" | "player";
      game_member_status: "active" | "removed";
      game_status: "setup" | "active" | "completed" | "archived";
    };
    Functions: Record<string, never>;
    Tables: {
      game_invites: {
        Insert: {
          created_at?: string;
          created_by: string;
          expires_at?: string | null;
          game_id: string;
          id?: string;
          max_uses?: number | null;
          revoked_at?: string | null;
          token_hash: string;
          used_count?: number;
        };
        Relationships: [
          {
            columns: ["created_by"];
            foreignKeyName: "game_invites_created_by_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["game_id"];
            foreignKeyName: "game_invites_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          }
        ];
        Row: {
          created_at: string;
          created_by: string;
          expires_at: string | null;
          game_id: string;
          id: string;
          max_uses: number | null;
          revoked_at: string | null;
          token_hash: string;
          used_count: number;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          expires_at?: string | null;
          game_id?: string;
          id?: string;
          max_uses?: number | null;
          revoked_at?: string | null;
          token_hash?: string;
          used_count?: number;
        };
      };
      game_memberships: {
        Insert: {
          created_at?: string;
          game_id: string;
          id?: string;
          joined_at?: string;
          role?: Database["public"]["Enums"]["game_member_role"];
          status?: Database["public"]["Enums"]["game_member_status"];
          turn_order_index?: number | null;
          updated_at?: string;
          user_id: string;
        };
        Relationships: [
          {
            columns: ["game_id"];
            foreignKeyName: "game_memberships_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          },
          {
            columns: ["user_id"];
            foreignKeyName: "game_memberships_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          }
        ];
        Row: {
          created_at: string;
          game_id: string;
          id: string;
          joined_at: string;
          role: Database["public"]["Enums"]["game_member_role"];
          status: Database["public"]["Enums"]["game_member_status"];
          turn_order_index: number | null;
          updated_at: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          game_id?: string;
          id?: string;
          joined_at?: string;
          role?: Database["public"]["Enums"]["game_member_role"];
          status?: Database["public"]["Enums"]["game_member_status"];
          turn_order_index?: number | null;
          updated_at?: string;
          user_id?: string;
        };
      };
      games: {
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          current_season?: string | null;
          current_turn_id?: string | null;
          current_week?: number | null;
          description?: string | null;
          id?: string;
          name: string;
          owner_id: string;
          status?: Database["public"]["Enums"]["game_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["owner_id"];
            foreignKeyName: "games_owner_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          }
        ];
        Row: {
          completed_at: string | null;
          created_at: string;
          current_season: string | null;
          current_turn_id: string | null;
          current_week: number | null;
          description: string | null;
          id: string;
          name: string;
          owner_id: string;
          status: Database["public"]["Enums"]["game_status"];
          updated_at: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          current_season?: string | null;
          current_turn_id?: string | null;
          current_week?: number | null;
          description?: string | null;
          id?: string;
          name?: string;
          owner_id?: string;
          status?: Database["public"]["Enums"]["game_status"];
          updated_at?: string;
        };
      };
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
