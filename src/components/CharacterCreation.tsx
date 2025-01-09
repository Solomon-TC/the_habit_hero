'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';
import type { Character, CharacterAchievement } from '../types/database';
import { DEFAULT_CHARACTER_COLORS } from '../types/character';

type Props = {
  onCharacterCreated: () => void;
};

export default function CharacterCreation({ onCharacterCreated }: Props) {
  const [name, setName] = useState('');
  const [colorPrimary, setColorPrimary] = useState<string>(DEFAULT_CHARACTER_COLORS.primary);
  const [colorSecondary, setColorSecondary] = useState<string>(DEFAULT_CHARACTER_COLORS.secondary);
  const [colorAccent, setColorAccent] = useState<string>(DEFAULT_CHARACTER_COLORS.accent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const newCharacter: Database['public']['Tables']['characters']['Insert'] = {
        user_id: user.id,
        name,
        color_primary: colorPrimary,
        color_secondary: colorSecondary,
        color_accent: colorAccent,
        level: 1,
        experience: 0,
        next_level_exp: 100,
        habits_completed: 0,
        goals_completed: 0,
        current_streak: 0,
        longest_streak: 0,
      };

      const { error: createError } = await supabase
        .from('characters')
        .insert(newCharacter);

      if (createError) throw createError;

      // Create first achievement
      const { data: characterData } = await supabase
        .from('characters')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!characterData) throw new Error('Failed to get character ID');

      const newAchievement: Database['public']['Tables']['character_achievements']['Insert'] = {
        user_id: user.id,
        character_id: characterData.id,
        type: 'milestone',
        name: 'Character Created',
        description: 'Started your journey of self-improvement',
      };

      const { error: achievementError } = await supabase
        .from('character_achievements')
        .insert(newAchievement);

      if (achievementError) throw achievementError;

      onCharacterCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Character</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Character Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Enter your character's name"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Character Colors</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="colorPrimary" className="block text-xs text-gray-500 mb-1">
                Primary
              </label>
              <input
                type="color"
                id="colorPrimary"
                value={colorPrimary}
                onChange={(e) => setColorPrimary(e.target.value)}
                className="block w-full h-10 rounded cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="colorSecondary" className="block text-xs text-gray-500 mb-1">
                Secondary
              </label>
              <input
                type="color"
                id="colorSecondary"
                value={colorSecondary}
                onChange={(e) => setColorSecondary(e.target.value)}
                className="block w-full h-10 rounded cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="colorAccent" className="block text-xs text-gray-500 mb-1">
                Accent
              </label>
              <input
                type="color"
                id="colorAccent"
                value={colorAccent}
                onChange={(e) => setColorAccent(e.target.value)}
                className="block w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="h-20 rounded-lg overflow-hidden grid grid-cols-3">
            <div style={{ backgroundColor: colorPrimary }} />
            <div style={{ backgroundColor: colorSecondary }} />
            <div style={{ backgroundColor: colorAccent }} />
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Character'}
        </button>
      </form>
    </div>
  );
}
