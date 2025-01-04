import { Profile, FriendRequest, Friend, FriendWithProfile, FriendRequestWithProfiles } from './friends';
import { Character, CharacterAchievement } from './character';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  target_days: number;
  reminder_time?: string;
  created_at: string;
  archived: boolean;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  date: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  target_date: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'archived';
  progress: number;
  created_at: string;
  completed_at?: string;
}

export interface GoalMilestone {
  id: string;
  goal_id: string;
  user_id: string;
  name: string;
  description?: string;
  completed: boolean;
  created_at: string;
  completed_at?: string;
}

export interface Database {
  public: {
    Tables: {
      habits: {
        Row: Habit;
        Insert: Omit<Habit, 'id' | 'created_at'>;
        Update: Partial<Omit<Habit, 'id' | 'created_at'>>;
      };
      habit_completions: {
        Row: HabitCompletion;
        Insert: Omit<HabitCompletion, 'id'>;
        Update: Partial<Omit<HabitCompletion, 'id'>>;
      };
      goals: {
        Row: Goal;
        Insert: Omit<Goal, 'id' | 'created_at' | 'completed_at'>;
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
        Update: Partial<Omit<Character, 'id' | 'created_at' | 'updated_at'>>;
      };
      character_achievements: {
        Row: CharacterAchievement;
        Insert: Omit<CharacterAchievement, 'id' | 'unlocked_at'>;
        Update: Partial<Omit<CharacterAchievement, 'id' | 'unlocked_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
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
