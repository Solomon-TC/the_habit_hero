import type { Character } from '../types/database';
import { EXPERIENCE_REWARDS } from '../types/character';

/**
 * Calculate the percentage of experience progress to next level
 */
export function calculateExpPercentage(character: Character): number {
  return (character.experience / character.next_level_exp) * 100;
}

/**
 * Calculate how much experience is needed for the next level
 */
export function calculateExpToNextLevel(character: Character): number {
  return character.next_level_exp - character.experience;
}

/**
 * Format a streak count with appropriate suffix
 */
export function formatStreak(count: number): string {
  if (count === 0) return '0 days';
  return `${count} day${count === 1 ? '' : 's'}`;
}

/**
 * Calculate experience reward for a specific action
 */
export function calculateExpReward(action: keyof typeof EXPERIENCE_REWARDS): number {
  return EXPERIENCE_REWARDS[action];
}

/**
 * Check if a character has reached a streak milestone
 * Returns the milestone reached (7, 30, 100, etc.) or null if no milestone reached
 */
export function checkStreakMilestone(currentStreak: number): number | null {
  const milestones = [7, 30, 100, 365];
  return milestones.find(m => currentStreak === m) || null;
}

/**
 * Get a descriptive string for the character's current level
 */
export function getLevelDescription(level: number): string {
  if (level < 5) return 'Novice';
  if (level < 10) return 'Apprentice';
  if (level < 20) return 'Adept';
  if (level < 35) return 'Expert';
  if (level < 50) return 'Master';
  return 'Grandmaster';
}

/**
 * Calculate the total experience earned by a character
 * This includes both current level experience and all previous levels
 */
export function calculateTotalExperience(character: Character): number {
  let total = character.experience;
  let prevLevelExp = 100; // Starting exp requirement
  
  // Add up exp requirements for all completed levels
  for (let i = 1; i < character.level; i++) {
    total += prevLevelExp;
    prevLevelExp = Math.floor(prevLevelExp * 1.5);
  }
  
  return total;
}
