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
      deck_source_type: "placeholder" | "manual" | "json_import" | "private_poc";
      deck_status: "draft" | "valid" | "locked";
      game_member_role: "owner" | "admin" | "player";
      game_member_status: "active" | "removed";
      game_status: "setup" | "active" | "completed" | "archived";
      turn_status: "active" | "completed" | "reassigned" | "skipped";
    };
    Functions: Record<string, never>;
    Tables: {
      deck_cards: {
        Insert: {
          card_key: string;
          created_at?: string;
          deck_id: string;
          id?: string;
          metadata?: Json | null;
          prompt_text?: string | null;
          season?: string | null;
          updated_at?: string;
          week_number: number;
        };
        Relationships: [
          {
            columns: ["deck_id"];
            foreignKeyName: "deck_cards_deck_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "decks";
          }
        ];
        Row: {
          card_key: string;
          created_at: string;
          deck_id: string;
          id: string;
          metadata: Json | null;
          prompt_text: string | null;
          season: string | null;
          updated_at: string;
          week_number: number;
        };
        Update: {
          card_key?: string;
          created_at?: string;
          deck_id?: string;
          id?: string;
          metadata?: Json | null;
          prompt_text?: string | null;
          season?: string | null;
          updated_at?: string;
          week_number?: number;
        };
      };
      decks: {
        Insert: {
          created_at?: string;
          created_by: string;
          game_id: string;
          id?: string;
          locked_at?: string | null;
          source_type?: Database["public"]["Enums"]["deck_source_type"];
          status?: Database["public"]["Enums"]["deck_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["created_by"];
            foreignKeyName: "decks_created_by_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["game_id"];
            foreignKeyName: "decks_game_id_fkey";
            isOneToOne: true;
            referencedColumns: ["id"];
            referencedRelation: "games";
          }
        ];
        Row: {
          created_at: string;
          created_by: string;
          game_id: string;
          id: string;
          locked_at: string | null;
          source_type: Database["public"]["Enums"]["deck_source_type"];
          status: Database["public"]["Enums"]["deck_status"];
          updated_at: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          game_id?: string;
          id?: string;
          locked_at?: string | null;
          source_type?: Database["public"]["Enums"]["deck_source_type"];
          status?: Database["public"]["Enums"]["deck_status"];
          updated_at?: string;
        };
      };
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
            columns: ["current_turn_id"];
            foreignKeyName: "games_current_turn_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "turns";
          },
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
      map_drafts: {
        Insert: {
          base_revision_id?: string | null;
          created_at?: string;
          game_id: string;
          id?: string;
          map_document?: Json;
          player_id: string;
          saved_at?: string;
          turn_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["base_revision_id"];
            foreignKeyName: "map_drafts_base_revision_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "map_revisions";
          },
          {
            columns: ["game_id"];
            foreignKeyName: "map_drafts_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          },
          {
            columns: ["player_id"];
            foreignKeyName: "map_drafts_player_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["turn_id"];
            foreignKeyName: "map_drafts_turn_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "turns";
          }
        ];
        Row: {
          base_revision_id: string | null;
          created_at: string;
          game_id: string;
          id: string;
          map_document: Json;
          player_id: string;
          saved_at: string;
          turn_id: string | null;
          updated_at: string;
        };
        Update: {
          base_revision_id?: string | null;
          created_at?: string;
          game_id?: string;
          id?: string;
          map_document?: Json;
          player_id?: string;
          saved_at?: string;
          turn_id?: string | null;
          updated_at?: string;
        };
      };
      map_revisions: {
        Insert: {
          created_at?: string;
          created_by: string;
          game_id: string;
          id?: string;
          map_document?: Json;
          revision_number: number;
          summary?: string | null;
          turn_id?: string | null;
        };
        Relationships: [
          {
            columns: ["created_by"];
            foreignKeyName: "map_revisions_created_by_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["game_id"];
            foreignKeyName: "map_revisions_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          },
          {
            columns: ["turn_id"];
            foreignKeyName: "map_revisions_turn_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "turns";
          }
        ];
        Row: {
          created_at: string;
          created_by: string;
          game_id: string;
          id: string;
          map_document: Json;
          revision_number: number;
          summary: string | null;
          turn_id: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          game_id?: string;
          id?: string;
          map_document?: Json;
          revision_number?: number;
          summary?: string | null;
          turn_id?: string | null;
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
      turn_drafts: {
        Insert: {
          created_at?: string;
          game_id: string;
          id?: string;
          map_draft_id?: string | null;
          outcome_text?: string | null;
          player_id: string;
          saved_at?: string;
          state_changes_draft?: Json | null;
          turn_id: string;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["game_id"];
            foreignKeyName: "turn_drafts_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          },
          {
            columns: ["map_draft_id"];
            foreignKeyName: "turn_drafts_map_draft_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "map_drafts";
          },
          {
            columns: ["player_id"];
            foreignKeyName: "turn_drafts_player_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["turn_id"];
            foreignKeyName: "turn_drafts_turn_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "turns";
          }
        ];
        Row: {
          created_at: string;
          game_id: string;
          id: string;
          map_draft_id: string | null;
          outcome_text: string | null;
          player_id: string;
          saved_at: string;
          state_changes_draft: Json | null;
          turn_id: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          game_id?: string;
          id?: string;
          map_draft_id?: string | null;
          outcome_text?: string | null;
          player_id?: string;
          saved_at?: string;
          state_changes_draft?: Json | null;
          turn_id?: string;
          updated_at?: string;
        };
      };
      turn_outcomes: {
        Insert: {
          committed_at?: string;
          committed_by: string;
          game_id: string;
          id?: string;
          map_revision_id?: string | null;
          summary: string;
          turn_id: string;
        };
        Relationships: [
          {
            columns: ["committed_by"];
            foreignKeyName: "turn_outcomes_committed_by_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["game_id"];
            foreignKeyName: "turn_outcomes_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          },
          {
            columns: ["map_revision_id"];
            foreignKeyName: "turn_outcomes_map_revision_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "map_revisions";
          },
          {
            columns: ["turn_id"];
            foreignKeyName: "turn_outcomes_turn_id_fkey";
            isOneToOne: true;
            referencedColumns: ["id"];
            referencedRelation: "turns";
          }
        ];
        Row: {
          committed_at: string;
          committed_by: string;
          game_id: string;
          id: string;
          map_revision_id: string | null;
          summary: string;
          turn_id: string;
        };
        Update: {
          committed_at?: string;
          committed_by?: string;
          game_id?: string;
          id?: string;
          map_revision_id?: string | null;
          summary?: string;
          turn_id?: string;
        };
      };
      turns: {
        Insert: {
          active_player_id: string;
          completed_at?: string | null;
          created_at?: string;
          deck_card_id?: string | null;
          game_id: string;
          id?: string;
          reassigned_from_player_id?: string | null;
          started_at?: string;
          status?: Database["public"]["Enums"]["turn_status"];
          turn_number: number;
          week_number: number;
        };
        Relationships: [
          {
            columns: ["active_player_id"];
            foreignKeyName: "turns_active_player_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["deck_card_id"];
            foreignKeyName: "turns_deck_card_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "deck_cards";
          },
          {
            columns: ["game_id"];
            foreignKeyName: "turns_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          },
          {
            columns: ["reassigned_from_player_id"];
            foreignKeyName: "turns_reassigned_from_player_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          }
        ];
        Row: {
          active_player_id: string;
          completed_at: string | null;
          created_at: string;
          deck_card_id: string | null;
          game_id: string;
          id: string;
          reassigned_from_player_id: string | null;
          started_at: string;
          status: Database["public"]["Enums"]["turn_status"];
          turn_number: number;
          week_number: number;
        };
        Update: {
          active_player_id?: string;
          completed_at?: string | null;
          created_at?: string;
          deck_card_id?: string | null;
          game_id?: string;
          id?: string;
          reassigned_from_player_id?: string | null;
          started_at?: string;
          status?: Database["public"]["Enums"]["turn_status"];
          turn_number?: number;
          week_number?: number;
        };
      };
    };
    Views: Record<string, never>;
  };
};
