import type { Character, CharacterAchievement } from './database';

export type { Character, CharacterAchievement };

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
