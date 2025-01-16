'use client';

import CharacterSprite from '@/components/CharacterSprite';
import { BodyType, Character, HairStyle, PantsStyle, SPRITE_CATEGORIES, ShirtStyle, ShoesStyle } from '@/types/character';
import { useState } from 'react';

const defaultCharacter: Character = {
  id: 'test',
  user_id: 'test',
  name: 'Test Character',
  level: 1,
  experience: 0,
  next_level_exp: 100,
  habits_completed: 0,
  goals_completed: 0,
  current_streak: 0,
  longest_streak: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  body_type: 'default' as BodyType,
  hair_style: 'default' as HairStyle,
  hair_color: '#4A4A4A',
  skin_color: '#FFE4C4',
  shirt_style: 'default' as ShirtStyle,
  shirt_color: '#3498db',
  pants_style: 'default' as PantsStyle,
  pants_color: '#2c3e50',
  shoes_style: 'default' as ShoesStyle,
  shoes_color: '#8B4513'
};

type StyleKey = `${keyof typeof SPRITE_CATEGORIES}_style`;
type ColorKey = `${keyof typeof SPRITE_CATEGORIES}_color`;

export default function TestPage() {
  const [character, setCharacter] = useState<Character>(defaultCharacter);

  const handleStyleChange = (part: keyof typeof SPRITE_CATEGORIES, style: string) => {
    const key = `${part}_style` as StyleKey;
    setCharacter(prev => ({
      ...prev,
      [key]: style
    }));
  };

  const handleColorChange = (part: keyof typeof SPRITE_CATEGORIES, color: string) => {
    const key = `${part}_color` as ColorKey;
    setCharacter(prev => ({
      ...prev,
      [key]: color
    }));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Character Customization Test</h1>
      
      <div className="flex gap-8">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <CharacterSprite character={character} />
        </div>

        <div className="flex-1 space-y-6">
          {Object.entries(SPRITE_CATEGORIES).map(([category, { name, options }]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block font-medium">{name}</label>
                  <select 
                    value={character[`${category}_style` as keyof Character]}
                    onChange={(e) => handleStyleChange(category as keyof typeof SPRITE_CATEGORIES, e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {options.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {options[0].requiresColor && (
                  <div className="flex-1">
                    <label className="block font-medium">Color</label>
                    <input 
                      type="color"
                      value={character[`${category}_color` as keyof Character]}
                      onChange={(e) => handleColorChange(category as keyof typeof SPRITE_CATEGORIES, e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
