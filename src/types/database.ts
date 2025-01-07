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
    };
    Views: {
      friends_with_profiles: {
        Row: Friend & Omit<Profile, 'id'>;
      };
    };
  };
}
