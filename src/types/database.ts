export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      characters: {
        Row: {
          id: string
          user_id: string
          name: string
          level: number
          experience: number
          next_level_exp: number
          habits_completed: number
          goals_completed: number
          current_streak: number
          longest_streak: number
          created_at: string
          updated_at: string
          body_type: string
          hair_style: string
          hair_color: string
          skin_color: string
          eye_color: string
          shirt_style: string
          shirt_color: string
          pants_style: string
          pants_color: string
          shoes_style: string
          shoes_color: string
          color_primary: string
          color_secondary: string
          color_accent: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          level?: number
          experience?: number
          next_level_exp?: number
          habits_completed?: number
          goals_completed?: number
          current_streak?: number
          longest_streak?: number
          created_at?: string
          updated_at?: string
          body_type?: string
          hair_style?: string
          hair_color?: string
          skin_color?: string
          eye_color?: string
          shirt_style?: string
          shirt_color?: string
          pants_style?: string
          pants_color?: string
          shoes_style?: string
          shoes_color?: string
          color_primary?: string
          color_secondary?: string
          color_accent?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          level?: number
          experience?: number
          next_level_exp?: number
          habits_completed?: number
          goals_completed?: number
          current_streak?: number
          longest_streak?: number
          created_at?: string
          updated_at?: string
          body_type?: string
          hair_style?: string
          hair_color?: string
          skin_color?: string
          eye_color?: string
          shirt_style?: string
          shirt_color?: string
          pants_style?: string
          pants_color?: string
          shoes_style?: string
          shoes_color?: string
          color_primary?: string
          color_secondary?: string
          color_accent?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      character_customization_options: {
        Row: {
          id: string
          category: string
          option_id: string
          name: string
          sprite_position: number
          requires_color: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category: string
          option_id: string
          name: string
          sprite_position: number
          requires_color?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category?: string
          option_id?: string
          name?: string
          sprite_position?: number
          requires_color?: boolean
          created_at?: string
        }
        Relationships: []
      }
      friend_requests: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_requests_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      friends: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      goal_milestones: {
        Row: {
          id: string
          goal_id: string
          title: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          title: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          title?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_milestones_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          }
        ]
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          due_date: string | null
          completed: boolean
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          frequency: string
          completed_today: boolean
          streak: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          frequency?: string
          completed_today?: boolean
          streak?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          frequency?: string
          completed_today?: boolean
          streak?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          avatar_url: string | null
          friend_code: string
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name: string
          avatar_url?: string | null
          friend_code?: string
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string
          avatar_url?: string | null
          friend_code?: string
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      friends_with_profiles: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          created_at: string
          username: string
          display_name: string
          avatar_url: string | null
          friend_code: string
          bio: string | null
          character_name: string | null
          character_level: number | null
          character_experience: number | null
          character_next_level_exp: number | null
          character_habits_completed: number | null
          character_goals_completed: number | null
          character_current_streak: number | null
          character_body_type: string | null
          character_hair_style: string | null
          character_hair_color: string | null
          character_skin_color: string | null
          character_eye_color: string | null
          character_shirt_style: string | null
          character_shirt_color: string | null
          character_pants_style: string | null
          character_pants_color: string | null
          character_shoes_style: string | null
          character_shoes_color: string | null
          character_color_primary: string | null
          character_color_secondary: string | null
          character_color_accent: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friends_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      get_friends_with_profiles: {
        Args: {
          user_id_input: string
        }
        Returns: {
          id: string
          user_id: string
          friend_id: string
          created_at: string
          username: string
          display_name: string
          avatar_url: string | null
          friend_code: string
          bio: string | null
          character_name: string | null
          character_level: number | null
          character_experience: number | null
          character_next_level_exp: number | null
          character_habits_completed: number | null
          character_goals_completed: number | null
          character_current_streak: number | null
          character_body_type: string | null
          character_hair_style: string | null
          character_hair_color: string | null
          character_skin_color: string | null
          character_eye_color: string | null
          character_shirt_style: string | null
          character_shirt_color: string | null
          character_pants_style: string | null
          character_pants_color: string | null
          character_shoes_style: string | null
          character_shoes_color: string | null
          character_color_primary: string | null
          character_color_secondary: string | null
          character_color_accent: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
