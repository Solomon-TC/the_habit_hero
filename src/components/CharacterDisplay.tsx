'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';
import type { Character, CharacterAchievement } from '../types/database';
import { calculateExpPercentage, formatStreak, getLevelDescription } from '../utils/character';

type Props = {
  userId: string;
  showAchievements?: boolean;
};

export default function CharacterDisplay({ userId, showAchievements = true }: Props) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [achievements, setAchievements] = useState<CharacterAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        // Fetch character
        const { data: characterData, error: characterError } = await supabase
          .from('characters')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (characterError) throw characterError;
        setCharacter(characterData);

        if (showAchievements) {
          // Fetch achievements
          const { data: achievementsData, error: achievementsError } = await supabase
            .from('character_achievements')
            .select('*')
            .eq('character_id', characterData.id)
            .order('unlocked_at', { ascending: false });

          if (achievementsError) throw achievementsError;
          setAchievements(achievementsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load character');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacterData();
  }, [userId, showAchievements]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading character...</div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        {error || 'Character not found'}
      </div>
    );
  }

  const expPercentage = calculateExpPercentage(character);
  const levelTitle = getLevelDescription(character.level);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Character Header */}
      <div 
        className="p-6 relative"
        style={{ 
          background: `linear-gradient(135deg, ${character.color_primary}, ${character.color_secondary})` 
        }}
      >
        {/* Character Avatar */}
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white shadow-lg flex items-center justify-center">
          <div 
            className="w-20 h-20 rounded-full"
            style={{ backgroundColor: character.color_accent }}
          />
        </div>

        {/* Character Info */}
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-1">{character.name}</h2>
          <div className="text-sm opacity-90">
            Level {character.level} • {levelTitle}
          </div>
        </div>

        {/* Experience Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white mb-1">
            <span>EXP</span>
            <span>{character.experience} / {character.next_level_exp}</span>
          </div>
          <div className="h-2 bg-black/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all"
              style={{ width: `${expPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{character.habits_completed}</div>
          <div className="text-sm text-gray-500">Habits Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{character.goals_completed}</div>
          <div className="text-sm text-gray-500">Goals Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{formatStreak(character.current_streak)}</div>
          <div className="text-sm text-gray-500">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{formatStreak(character.longest_streak)}</div>
          <div className="text-sm text-gray-500">Longest Streak</div>
        </div>
      </div>

      {/* Achievements */}
      {showAchievements && achievements.length > 0 && (
        <div className="border-t">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
            <div className="space-y-3">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: character.color_primary }}
                  >
                    <span className="text-white text-sm">✦</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{achievement.name}</div>
                    {achievement.description && (
                      <div className="text-sm text-gray-500">{achievement.description}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(achievement.unlocked_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
