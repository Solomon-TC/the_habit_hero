'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { HexColorPicker } from 'react-colorful';
import { Character, SPRITE_CATEGORIES, SpriteCategory } from '../types/character';
import SpriteCharacter from './SpriteCharacter';
import type { Database } from '../types/database';

interface Props {
  userId: string;
  onSave?: (character: Character) => void;
}

type ColorField = 'skin_color' | 'hair_color' | 'eye_color' | 'shirt_color' | 'pants_color' | 'shoes_color';

export default function CharacterCustomizer({ userId, onSave }: Props) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [activeColorPicker, setActiveColorPicker] = useState<ColorField | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const { data: character, error: characterError } = await supabase
          .from('characters')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (characterError) throw characterError;
        
        // Set default values if character doesn't exist
        if (!character) {
          const defaultCharacter: Partial<Character> = {
            user_id: userId,
            name: 'My Character',
            level: 1,
            experience: 0,
            next_level_exp: 100,
            body_type: 'default',
            hair_style: 'default',
            hair_color: '#4A4A4A',
            skin_color: '#F5D0C5',
            eye_color: '#4A4A4A',
            shirt_style: 'default',
            shirt_color: '#4A90E2',
            pants_style: 'default',
            pants_color: '#4A4A4A',
            shoes_style: 'default',
            shoes_color: '#4A4A4A',
            habits_completed: 0,
            goals_completed: 0,
            current_streak: 0,
            longest_streak: 0
          };

          const { data: newCharacter, error: createError } = await supabase
            .from('characters')
            .insert([defaultCharacter])
            .select()
            .single();

          if (createError) throw createError;
          setCharacter(newCharacter);
        } else {
          setCharacter(character);
        }
      } catch (err) {
        console.error('Error fetching character:', err);
        setError(err instanceof Error ? err.message : 'Failed to load character');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [userId]);

  const handleStyleChange = (category: SpriteCategory, value: string) => {
    if (!character) return;

    const field = `${category}_style` as keyof Character;
    setCharacter(prev => prev ? {
      ...prev,
      [field]: value
    } : null);
  };

  const handleColorChange = (field: ColorField, color: string) => {
    if (!character) return;
    setCharacter(prev => prev ? {
      ...prev,
      [field]: color
    } : null);
  };

  const handleSave = async () => {
    if (!character) return;

    try {
      const { error: updateError } = await supabase
        .from('characters')
        .update({
          body_type: character.body_type,
          hair_style: character.hair_style,
          hair_color: character.hair_color,
          skin_color: character.skin_color,
          eye_color: character.eye_color,
          shirt_style: character.shirt_style,
          shirt_color: character.shirt_color,
          pants_style: character.pants_style,
          pants_color: character.pants_color,
          shoes_style: character.shoes_style,
          shoes_color: character.shoes_color,
        })
        .eq('id', character.id);

      if (updateError) throw updateError;
      onSave?.(character);
    } catch (err) {
      console.error('Error saving character:', err);
      setError(err instanceof Error ? err.message : 'Failed to save character');
    }
  };

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

  const colorFields: Array<{ label: string; field: ColorField }> = [
    { label: 'Skin Color', field: 'skin_color' },
    { label: 'Hair Color', field: 'hair_color' },
    { label: 'Eye Color', field: 'eye_color' },
    { label: 'Shirt Color', field: 'shirt_color' },
    { label: 'Pants Color', field: 'pants_color' },
    { label: 'Shoes Color', field: 'shoes_color' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Character Preview */}
      <div className="flex flex-col items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <SpriteCharacter character={character} />
        </div>
      </div>

      {/* Customization Controls */}
      <div className="space-y-6">
        {/* Style Selectors */}
        {Object.entries(SPRITE_CATEGORIES).map(([category, config]) => (
          <div key={category} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {category} Style
            </label>
            <select
              value={character[`${category}_style` as keyof Character]}
              onChange={(e) => handleStyleChange(category as SpriteCategory, e.target.value)}
              className="input-field"
            >
              {config.options.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Color Pickers */}
        <div className="grid grid-cols-2 gap-4">
          {colorFields.map(({ label, field }) => (
            <div key={field} className="color-picker-wrapper">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <button
                type="button"
                onClick={() => setActiveColorPicker(activeColorPicker === field ? null : field)}
                className="w-full h-8 rounded border border-gray-300"
                style={{ backgroundColor: character[field] }}
              />
              {activeColorPicker === field && (
                <>
                  <div className="color-picker-popover">
                    <HexColorPicker
                      color={character[field]}
                      onChange={(color) => handleColorChange(field, color)}
                    />
                  </div>
                  <div
                    className="color-picker-cover"
                    onClick={() => setActiveColorPicker(null)}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full btn-primary mt-6"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
