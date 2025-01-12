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
  // Customization fields
  body_type: BodyType;
  hair_style: HairStyle;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  shirt_style: ShirtStyle;
  shirt_color: string;
  pants_style: PantsStyle;
  pants_color: string;
  shoes_style: ShoesStyle;
  shoes_color: string;
}

export interface CharacterCustomizationOption {
  id: string;
  category: SpriteCategory;
  option_id: string;
  name: string;
  sprite_position: number;
  requires_color: boolean;
  created_at: string;
}

export interface CharacterSprite {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type BodyType = 'default' | 'athletic' | 'round';
export type HairStyle = 'default' | 'long' | 'ponytail' | 'spiky';
export type ShirtStyle = 'default' | 'tank-top' | 'long-sleeve' | 'hoodie';
export type PantsStyle = 'default' | 'shorts' | 'skirt' | 'baggy';
export type ShoesStyle = 'default' | 'boots' | 'sandals';

export const SPRITE_CATEGORIES = {
  body: {
    spriteWidth: 32,
    spriteHeight: 48,
    options: ['default', 'athletic', 'round'] as BodyType[]
  },
  hair: {
    spriteWidth: 32,
    spriteHeight: 48,
    options: ['default', 'long', 'ponytail', 'spiky'] as HairStyle[]
  },
  shirt: {
    spriteWidth: 32,
    spriteHeight: 48,
    options: ['default', 'tank-top', 'long-sleeve', 'hoodie'] as ShirtStyle[]
  },
  pants: {
    spriteWidth: 32,
    spriteHeight: 48,
    options: ['default', 'shorts', 'skirt', 'baggy'] as PantsStyle[]
  },
  shoes: {
    spriteWidth: 32,
    spriteHeight: 48,
    options: ['default', 'boots', 'sandals'] as ShoesStyle[]
  }
} as const;

export type SpriteCategory = keyof typeof SPRITE_CATEGORIES;

type SpriteOptionType<T extends SpriteCategory> = typeof SPRITE_CATEGORIES[T]['options'][number];

// Helper function to get sprite coordinates
export function getSpriteCoordinates<T extends SpriteCategory>(
  category: T,
  optionId: SpriteOptionType<T>
): CharacterSprite {
  const categoryConfig = SPRITE_CATEGORIES[category];
  const optionIndex = categoryConfig.options.indexOf(optionId as any);
  
  if (optionIndex === -1) {
    // Return default sprite position if option not found
    return {
      x: 0,
      y: 0,
      width: categoryConfig.spriteWidth,
      height: categoryConfig.spriteHeight
    };
  }

  return {
    x: optionIndex * categoryConfig.spriteWidth,
    y: 0,
    width: categoryConfig.spriteWidth,
    height: categoryConfig.spriteHeight
  };
}
