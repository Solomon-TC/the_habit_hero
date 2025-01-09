// Base types for database tables
export interface Profile {
  id: string;
  username: string;
  display_name: string;
  friend_code: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  target_date: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'archived';
  progress: number;
  created_at: string;
  completed_at: string | null;
}

export interface GoalMilestone {
  id: string;
  goal_id: string;
  user_id: string;
  name: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  completed_at: string | null;
}

export interface Character {
  id: string;
  user_id: string;
  name: string;
  level: number;
  experience: number;
  next_level_exp: number;
  color_primary: string;
  color_secondary: string;
  color_accent: string;
  habits_completed: number;
  goals_completed: number;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

export interface CharacterAchievement {
  id: string;
  character_id: string;
  user_id: string;
  type: 'habit_streak' | 'goal_completion' | 'level_up' | 'milestone';
  name: string;
  description: string | null;
  unlocked_at: string;
}

// Extended types for views
export interface FriendWithProfile extends Friend {
  username: string;
  display_name: string;
  avatar_url: string | null;
  friend_code: string;
  bio: string | null;
}

export interface FriendRequestWithProfiles extends FriendRequest {
  sender_username: string;
  sender_display_name: string;
  sender_avatar_url: string | null;
  sender_friend_code: string;
  sender_bio: string | null;
  receiver_username: string;
  receiver_display_name: string;
  receiver_avatar_url: string | null;
  receiver_friend_code: string;
  receiver_bio: string | null;
}

// Database type for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
      };
      friend_requests: {
        Row: FriendRequest;
        Insert: Omit<FriendRequest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FriendRequest, 'id' | 'created_at' | 'updated_at'>>;
      };
      friends: {
        Row: Friend;
        Insert: Omit<Friend, 'id' | 'created_at'>;
        Update: Partial<Omit<Friend, 'id' | 'created_at'>>;
      };
      goals: {
        Row: Goal;
        Insert: Omit<Goal, 'id' | 'created_at' | 'completed_at' | 'progress'>;
        Update: Partial<Omit<Goal, 'id' | 'created_at'>>;
      };
      goal_milestones: {
        Row: GoalMilestone;
        Insert: Omit<GoalMilestone, 'id' | 'created_at' | 'completed_at'>;
        Update: Partial<Omit<GoalMilestone, 'id' | 'created_at'>>;
      };
      characters: {
        Row: Character;
        Insert: Omit<Character, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Character, 'id' | 'created_at'>>;
      };
      character_achievements: {
        Row: CharacterAchievement;
        Insert: Omit<CharacterAchievement, 'id' | 'unlocked_at'>;
        Update: Partial<Omit<CharacterAchievement, 'id' | 'unlocked_at'>>;
      };
    };
    Views: {
      friends_with_profiles: {
        Row: FriendWithProfile;
      };
      friend_requests_with_profiles: {
        Row: FriendRequestWithProfiles;
      };
    };
  };
}
