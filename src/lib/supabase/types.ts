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
      chat_message_type: "player" | "system";
      deck_source_type: "placeholder" | "manual" | "json_import" | "private_poc";
      deck_status: "draft" | "valid" | "locked";
      game_event_type:
        | "game_created"
        | "player_joined"
        | "deck_configured"
        | "initial_map_created"
        | "game_started"
        | "turn_draft_saved"
        | "turn_committed"
        | "map_revision_created"
        | "story_poll_created"
        | "process_vote_started"
        | "turn_reassigned"
        | "project_changed"
        | "resource_changed"
        | "discontent_changed"
        | "game_completed"
        | "game_archived";
      game_member_role: "owner" | "admin" | "player";
      game_member_status: "active" | "removed";
      game_status: "setup" | "active" | "completed" | "archived";
      process_vote_response: "yes" | "no" | "abstain";
      process_vote_status: "open" | "passed" | "failed" | "cancelled";
      process_vote_type: "reassign_stuck_turn";
      project_status: "active" | "completed" | "abandoned";
      resource_status: "abundance" | "scarcity" | "neutral" | "custom";
      story_poll_status: "open" | "closed";
      system_message_type: "info" | "warning" | "process" | "state_change";
      turn_status: "active" | "completed" | "reassigned" | "skipped";
    };
    Functions: {
      accept_game_invite: {
        Args: {
          invite_token_hash: string;
        };
        Returns: {
          game_id: string;
          membership_id: string;
        }[];
      };
      create_game_with_owner: {
        Args: {
          game_description?: string | null;
          game_name: string;
        };
        Returns: string;
      };
    };
    Tables: {
      chat_messages: {
        Insert: {
          author_id: string;
          body: string;
          created_at?: string;
          edited_at?: string | null;
          game_id: string;
          id?: string;
          linked_object_label?: string | null;
          message_type?: Database["public"]["Enums"]["chat_message_type"];
          system_type?: Database["public"]["Enums"]["system_message_type"] | null;
          turn_id?: string | null;
        };
        Relationships: [
          {
            columns: ["author_id"];
            foreignKeyName: "chat_messages_author_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["game_id"];
            foreignKeyName: "chat_messages_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          },
          {
            columns: ["turn_id"];
            foreignKeyName: "chat_messages_turn_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "turns";
          }
        ];
        Row: {
          author_id: string;
          body: string;
          created_at: string;
          edited_at: string | null;
          game_id: string;
          id: string;
          linked_object_label: string | null;
          message_type: Database["public"]["Enums"]["chat_message_type"];
          system_type: Database["public"]["Enums"]["system_message_type"] | null;
          turn_id: string | null;
        };
        Update: {
          author_id?: string;
          body?: string;
          created_at?: string;
          edited_at?: string | null;
          game_id?: string;
          id?: string;
          linked_object_label?: string | null;
          message_type?: Database["public"]["Enums"]["chat_message_type"];
          system_type?: Database["public"]["Enums"]["system_message_type"] | null;
          turn_id?: string | null;
        };
      };
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
      discontent_entries: {
        Insert: {
          count: number;
          created_at?: string;
          game_id: string;
          holder_user_id?: string | null;
          id?: string;
          linked_turn_id?: string | null;
          reason?: string | null;
        };
        Relationships: [
          {
            columns: ["game_id"];
            foreignKeyName: "discontent_entries_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          },
          {
            columns: ["holder_user_id"];
            foreignKeyName: "discontent_entries_holder_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["linked_turn_id"];
            foreignKeyName: "discontent_entries_linked_turn_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "turns";
          }
        ];
        Row: {
          count: number;
          created_at: string;
          game_id: string;
          holder_user_id: string | null;
          id: string;
          linked_turn_id: string | null;
          reason: string | null;
        };
        Update: {
          count?: number;
          created_at?: string;
          game_id?: string;
          holder_user_id?: string | null;
          id?: string;
          linked_turn_id?: string | null;
          reason?: string | null;
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
      game_events: {
        Insert: {
          actor_id?: string | null;
          created_at?: string;
          event_type: Database["public"]["Enums"]["game_event_type"];
          game_id: string;
          id?: string;
          payload?: Json | null;
          summary: string;
          turn_id?: string | null;
        };
        Relationships: [
          {
            columns: ["actor_id"];
            foreignKeyName: "game_events_actor_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["game_id"];
            foreignKeyName: "game_events_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          },
          {
            columns: ["turn_id"];
            foreignKeyName: "game_events_turn_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "turns";
          }
        ];
        Row: {
          actor_id: string | null;
          created_at: string;
          event_type: Database["public"]["Enums"]["game_event_type"];
          game_id: string;
          id: string;
          payload: Json | null;
          summary: string;
          turn_id: string | null;
        };
        Update: {
          actor_id?: string | null;
          created_at?: string;
          event_type?: Database["public"]["Enums"]["game_event_type"];
          game_id?: string;
          id?: string;
          payload?: Json | null;
          summary?: string;
          turn_id?: string | null;
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
      projects: {
        Insert: {
          completed_turn_id?: string | null;
          created_at?: string;
          description?: string | null;
          game_id: string;
          id?: string;
          name: string;
          remaining_weeks?: number | null;
          started_turn_id?: string | null;
          status?: Database["public"]["Enums"]["project_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["completed_turn_id"];
            foreignKeyName: "projects_completed_turn_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "turns";
          },
          {
            columns: ["game_id"];
            foreignKeyName: "projects_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          },
          {
            columns: ["started_turn_id"];
            foreignKeyName: "projects_started_turn_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "turns";
          }
        ];
        Row: {
          completed_turn_id: string | null;
          created_at: string;
          description: string | null;
          game_id: string;
          id: string;
          name: string;
          remaining_weeks: number | null;
          started_turn_id: string | null;
          status: Database["public"]["Enums"]["project_status"];
          updated_at: string;
        };
        Update: {
          completed_turn_id?: string | null;
          created_at?: string;
          description?: string | null;
          game_id?: string;
          id?: string;
          name?: string;
          remaining_weeks?: number | null;
          started_turn_id?: string | null;
          status?: Database["public"]["Enums"]["project_status"];
          updated_at?: string;
        };
      };
      process_vote_responses: {
        Insert: {
          created_at?: string;
          id?: string;
          process_vote_id: string;
          response: Database["public"]["Enums"]["process_vote_response"];
          updated_at?: string;
          voter_id: string;
        };
        Relationships: [
          {
            columns: ["process_vote_id"];
            foreignKeyName: "process_vote_responses_process_vote_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "process_votes";
          },
          {
            columns: ["voter_id"];
            foreignKeyName: "process_vote_responses_voter_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          }
        ];
        Row: {
          created_at: string;
          id: string;
          process_vote_id: string;
          response: Database["public"]["Enums"]["process_vote_response"];
          updated_at: string;
          voter_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          process_vote_id?: string;
          response?: Database["public"]["Enums"]["process_vote_response"];
          updated_at?: string;
          voter_id?: string;
        };
      };
      process_votes: {
        Insert: {
          created_at?: string;
          created_by: string;
          game_id: string;
          id?: string;
          reason?: string | null;
          resolved_at?: string | null;
          status?: Database["public"]["Enums"]["process_vote_status"];
          target_player_id?: string | null;
          turn_id: string;
          vote_type?: Database["public"]["Enums"]["process_vote_type"];
        };
        Relationships: [
          {
            columns: ["created_by"];
            foreignKeyName: "process_votes_created_by_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["game_id"];
            foreignKeyName: "process_votes_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          },
          {
            columns: ["target_player_id"];
            foreignKeyName: "process_votes_target_player_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["turn_id"];
            foreignKeyName: "process_votes_turn_id_fkey";
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
          reason: string | null;
          resolved_at: string | null;
          status: Database["public"]["Enums"]["process_vote_status"];
          target_player_id: string | null;
          turn_id: string;
          vote_type: Database["public"]["Enums"]["process_vote_type"];
        };
        Update: {
          created_at?: string;
          created_by?: string;
          game_id?: string;
          id?: string;
          reason?: string | null;
          resolved_at?: string | null;
          status?: Database["public"]["Enums"]["process_vote_status"];
          target_player_id?: string | null;
          turn_id?: string;
          vote_type?: Database["public"]["Enums"]["process_vote_type"];
        };
      };
      resources: {
        Insert: {
          created_at?: string;
          game_id: string;
          id?: string;
          name: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["resource_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["game_id"];
            foreignKeyName: "resources_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          }
        ];
        Row: {
          created_at: string;
          game_id: string;
          id: string;
          name: string;
          notes: string | null;
          status: Database["public"]["Enums"]["resource_status"];
          updated_at: string;
        };
        Update: {
          created_at?: string;
          game_id?: string;
          id?: string;
          name?: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["resource_status"];
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
      story_poll_options: {
        Insert: {
          id?: string;
          label: string;
          poll_id: string;
          sort_order: number;
        };
        Relationships: [
          {
            columns: ["poll_id"];
            foreignKeyName: "story_poll_options_poll_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "story_polls";
          }
        ];
        Row: {
          id: string;
          label: string;
          poll_id: string;
          sort_order: number;
        };
        Update: {
          id?: string;
          label?: string;
          poll_id?: string;
          sort_order?: number;
        };
      };
      story_poll_votes: {
        Insert: {
          created_at?: string;
          id?: string;
          option_id: string;
          poll_id: string;
          updated_at?: string;
          voter_id: string;
        };
        Relationships: [
          {
            columns: ["option_id"];
            foreignKeyName: "story_poll_votes_option_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "story_poll_options";
          },
          {
            columns: ["poll_id"];
            foreignKeyName: "story_poll_votes_poll_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "story_polls";
          },
          {
            columns: ["poll_id", "option_id"];
            foreignKeyName: "story_poll_votes_poll_option_fkey";
            isOneToOne: false;
            referencedColumns: ["poll_id", "id"];
            referencedRelation: "story_poll_options";
          },
          {
            columns: ["voter_id"];
            foreignKeyName: "story_poll_votes_voter_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          }
        ];
        Row: {
          created_at: string;
          id: string;
          option_id: string;
          poll_id: string;
          updated_at: string;
          voter_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          option_id?: string;
          poll_id?: string;
          updated_at?: string;
          voter_id?: string;
        };
      };
      story_polls: {
        Insert: {
          closed_at?: string | null;
          created_at?: string;
          created_by: string;
          description?: string | null;
          game_id: string;
          id?: string;
          question: string;
          status?: Database["public"]["Enums"]["story_poll_status"];
          turn_id: string;
        };
        Relationships: [
          {
            columns: ["created_by"];
            foreignKeyName: "story_polls_created_by_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
          {
            columns: ["game_id"];
            foreignKeyName: "story_polls_game_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "games";
          },
          {
            columns: ["turn_id"];
            foreignKeyName: "story_polls_turn_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "turns";
          }
        ];
        Row: {
          closed_at: string | null;
          created_at: string;
          created_by: string;
          description: string | null;
          game_id: string;
          id: string;
          question: string;
          status: Database["public"]["Enums"]["story_poll_status"];
          turn_id: string;
        };
        Update: {
          closed_at?: string | null;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          game_id?: string;
          id?: string;
          question?: string;
          status?: Database["public"]["Enums"]["story_poll_status"];
          turn_id?: string;
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
