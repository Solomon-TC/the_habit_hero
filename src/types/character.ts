export type BodyType = 'default' | 'athletic' | 'round';
export type HairStyle = 'default' | 'long' | 'ponytail' | 'spiky';
export type ShirtStyle = 'default' | 'tank-top' | 'long-sleeve' | 'hoodie';
export type PantsStyle = 'default' | 'shorts' | 'skirt' | 'baggy';
export type ShoesStyle = 'default' | 'boots' | 'sandals';

export type SpriteCategory = 'body' | 'hair' | 'shirt' | 'pants' | 'shoes';

export const SPRITE_CATEGORIES: Record<SpriteCategory, {
  name: string;
  options: { id: string; name: string; requiresColor: boolean }[];
}> = {
  body: {
    name: 'Body Type',
    options: [
      { id: 'default', name: 'Default', requiresColor: true },
      { id: 'athletic', name: 'Athletic', requiresColor: true },
      { id: 'round', name: 'Round', requiresColor: true }
    ]
  },
  hair: {
    name: 'Hair Style',
    options: [
      { id: 'default', name: 'Default', requiresColor: true },
      { id: 'long', name: 'Long', requiresColor: true },
      { id: 'ponytail', name: 'Ponytail', requiresColor: true },
      { id: 'spiky', name: 'Spiky', requiresColor: true }
    ]
  },
  shirt: {
    name: 'Shirt Style',
    options: [
      { id: 'default', name: 'Default', requiresColor: true },
      { id: 'tank-top', name: 'Tank Top', requiresColor: true },
      { id: 'long-sleeve', name: 'Long Sleeve', requiresColor: true },
      { id: 'hoodie', name: 'Hoodie', requiresColor: true }
    ]
  },
  pants: {
    name: 'Pants Style',
    options: [
      { id: 'default', name: 'Default', requiresColor: true },
      { id: 'shorts', name: 'Shorts', requiresColor: true },
      { id: 'skirt', name: 'Skirt', requiresColor: true },
      { id: 'baggy', name: 'Baggy', requiresColor: true }
    ]
  },
  shoes: {
    name: 'Shoes Style',
    options: [
      { id: 'default', name: 'Default', requiresColor: true },
      { id: 'boots', name: 'Boots', requiresColor: true },
      { id: 'sandals', name: 'Sandals', requiresColor: true }
    ]
  }
};

export interface Character {
  id: string;
  user_id: string;
  name: string;
  level: number;
  experience: number;
  next_level_exp: number;
  habits_completed: number;
  goals_completed: number;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
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
  color_primary: string;
  color_secondary: string;
  color_accent: string;
}

export interface FriendWithProfile {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  friend_code: string;
  bio: string | null;
  character_name: string | null;
  character_level: number | null;
  character_experience: number | null;
  character_next_level_exp: number | null;
  character_habits_completed: number | null;
  character_goals_completed: number | null;
  character_current_streak: number | null;
  character_longest_streak: number | null;
  character_body_type: string | null;
  character_hair_style: string | null;
  character_hair_color: string | null;
  character_skin_color: string | null;
  character_eye_color: string | null;
  character_shirt_style: string | null;
  character_shirt_color: string | null;
  character_pants_style: string | null;
  character_pants_color: string | null;
  character_shoes_style: string | null;
  character_shoes_color: string | null;
  character_color_primary: string | null;
  character_color_secondary: string | null;
  character_color_accent: string | null;
}
