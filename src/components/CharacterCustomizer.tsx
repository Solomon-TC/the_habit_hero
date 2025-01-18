'use client';

import { useCallback, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { HexColorPicker } from 'react-colorful';
import { Character, SPRITE_CATEGORIES, SpriteCategory } from '../types/character';
import CharacterSprite from './CharacterSprite';
import type { Database } from '../types/database';

interface Props {
  character: Character;
  onUpdate?: (character: Character) => void;
}

type StyleKey = `${SpriteCategory}_${'type' | 'style'}`;
type ColorKey = `${SpriteCategory}_color` | 'skin_color';

export default function CharacterCustomizer({ character, onUpdate }: Props) {
  const supabase = createClientComponentClient<Database>();
  const [selectedCategory, setSelectedCategory] = useState<SpriteCategory>('body');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleStyleChange = useCallback(async (category: SpriteCategory, style: string) => {
    const key = category === 'body' ? 'body_type' : `${category}_style`;
    const updatedCharacter = {
      ...character,
      [key]: style
    };

    if (onUpdate) {
      onUpdate(updatedCharacter);
    }

    await supabase
      .from('characters')
      .update({ [key]: style })
      .eq('id', character.id);
  }, [character, onUpdate, supabase]);

  const handleColorChange = useCallback(async (category: SpriteCategory, color: string) => {
    const key = category === 'body' ? 'skin_color' : `${category}_color`;
    const updatedCharacter = {
      ...character,
      [key]: color
    };

    if (onUpdate) {
      onUpdate(updatedCharacter);
    }

    await supabase
      .from('characters')
      .update({ [key]: color })
      .eq('id', character.id);
  }, [character, onUpdate, supabase]);

  const getStyleValue = (category: SpriteCategory): string => {
    return category === 'body' ? character.body_type : character[`${category}_style` as keyof Character] as string;
  };

  const getColorValue = (category: SpriteCategory): string => {
    return category === 'body' ? character.skin_color : character[`${category}_color` as keyof Character] as string;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <CharacterSprite character={character} className="w-32 h-48" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {Object.entries(SPRITE_CATEGORIES).map(([category, { name }]) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as SpriteCategory)}
            className={`px-4 py-2 rounded ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {SPRITE_CATEGORIES[selectedCategory].options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleStyleChange(selectedCategory, option.id)}
              className={`px-4 py-2 rounded ${
                getStyleValue(selectedCategory) === option.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>

        {SPRITE_CATEGORIES[selectedCategory].options[0].requiresColor && (
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full h-10 rounded border"
              style={{
                backgroundColor: getColorValue(selectedCategory)
              }}
            />
            {showColorPicker && (
              <div className="absolute z-10 mt-2">
                <HexColorPicker
                  color={getColorValue(selectedCategory)}
                  onChange={(color) => handleColorChange(selectedCategory, color)}
                />
                <div className="fixed inset-0 -z-10" onClick={() => setShowColorPicker(false)} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
