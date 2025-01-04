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

export const DEFAULT_CHARACTER_COLORS = {
  primary: '#4F46E5',   // Indigo-600
  secondary: '#818CF8', // Indigo-400
  accent: '#C7D2FE',    // Indigo-200
} as const;

export const EXPERIENCE_REWARDS = {
  HABIT_COMPLETION: 10,
  GOAL_COMPLETION: 50,
  STREAK_MILESTONE: 25, // For reaching streak milestones (e.g., 7 days, 30 days)
} as const;
