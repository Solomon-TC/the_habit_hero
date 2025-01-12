-- Add customization fields to characters table
ALTER TABLE characters 
  ADD COLUMN IF NOT EXISTS body_type TEXT NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS hair_style TEXT NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS hair_color TEXT NOT NULL DEFAULT '#4A4A4A',
  ADD COLUMN IF NOT EXISTS skin_color TEXT NOT NULL DEFAULT '#F5D0C5',
  ADD COLUMN IF NOT EXISTS eye_color TEXT NOT NULL DEFAULT '#4A4A4A',
  ADD COLUMN IF NOT EXISTS shirt_style TEXT NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS shirt_color TEXT NOT NULL DEFAULT '#4A90E2',
  ADD COLUMN IF NOT EXISTS pants_style TEXT NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS pants_color TEXT NOT NULL DEFAULT '#4A4A4A',
  ADD COLUMN IF NOT EXISTS shoes_style TEXT NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS shoes_color TEXT NOT NULL DEFAULT '#4A4A4A';

-- Create table for available customization options
CREATE TABLE IF NOT EXISTS character_customization_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  option_id TEXT NOT NULL,
  name TEXT NOT NULL,
  sprite_position INTEGER NOT NULL,
  requires_color BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE (category, option_id)
);

-- Insert default customization options
INSERT INTO character_customization_options 
  (category, option_id, name, sprite_position, requires_color)
VALUES
  -- Body Types
  ('body', 'default', 'Default', 0, false),
  ('body', 'athletic', 'Athletic', 1, false),
  ('body', 'round', 'Round', 2, false),
  
  -- Hair Styles
  ('hair', 'default', 'Short', 0, true),
  ('hair', 'long', 'Long', 1, true),
  ('hair', 'ponytail', 'Ponytail', 2, true),
  ('hair', 'spiky', 'Spiky', 3, true),
  
  -- Shirt Styles
  ('shirt', 'default', 'T-Shirt', 0, true),
  ('shirt', 'tank-top', 'Tank Top', 1, true),
  ('shirt', 'long-sleeve', 'Long Sleeve', 2, true),
  ('shirt', 'hoodie', 'Hoodie', 3, true),
  
  -- Pants Styles
  ('pants', 'default', 'Regular', 0, true),
  ('pants', 'shorts', 'Shorts', 1, true),
  ('pants', 'skirt', 'Skirt', 2, true),
  ('pants', 'baggy', 'Baggy', 3, true),
  
  -- Shoes Styles
  ('shoes', 'default', 'Sneakers', 0, true),
  ('shoes', 'boots', 'Boots', 1, true),
  ('shoes', 'sandals', 'Sandals', 2, true)
ON CONFLICT (category, option_id) DO NOTHING;

-- Set up RLS
ALTER TABLE character_customization_options ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view customization options"
  ON character_customization_options FOR SELECT
  TO authenticated
  USING (true);

-- Update friends view to include character customization fields
DROP VIEW IF EXISTS friends_with_profiles;
CREATE VIEW friends_with_profiles AS
SELECT 
  f.id,
  f.user_id,
  f.friend_id,
  f.created_at,
  p.username,
  p.display_name,
  p.avatar_url,
  p.friend_code,
  c.name as character_name,
  c.level as character_level,
  c.habits_completed as character_habits_completed,
  c.goals_completed as character_goals_completed,
  c.current_streak as character_current_streak,
  c.body_type as character_body_type,
  c.hair_style as character_hair_style,
  c.hair_color as character_hair_color,
  c.skin_color as character_skin_color,
  c.eye_color as character_eye_color,
  c.shirt_style as character_shirt_style,
  c.shirt_color as character_shirt_color,
  c.pants_style as character_pants_style,
  c.pants_color as character_pants_color,
  c.shoes_style as character_shoes_style,
  c.shoes_color as character_shoes_color
FROM friends f
JOIN profiles p ON f.friend_id = p.id
LEFT JOIN characters c ON f.friend_id = c.user_id;
