-- Drop the view first since it depends on the eye_color column
DROP VIEW IF EXISTS friends_with_profiles;

-- Drop eye_color column if it exists
ALTER TABLE characters DROP COLUMN IF EXISTS eye_color;

-- Add customization fields to characters table
ALTER TABLE characters 
  ADD COLUMN IF NOT EXISTS body_type TEXT NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS hair_style TEXT NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS hair_color TEXT NOT NULL DEFAULT '#4A4A4A',
  ADD COLUMN IF NOT EXISTS skin_color TEXT NOT NULL DEFAULT '#FFE4C4',
  ADD COLUMN IF NOT EXISTS shirt_style TEXT NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS shirt_color TEXT NOT NULL DEFAULT '#3498db',
  ADD COLUMN IF NOT EXISTS pants_style TEXT NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS pants_color TEXT NOT NULL DEFAULT '#2c3e50',
  ADD COLUMN IF NOT EXISTS shoes_style TEXT NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS shoes_color TEXT NOT NULL DEFAULT '#8B4513';

-- Drop and recreate the customization options table
DROP TABLE IF EXISTS character_customization_options;

CREATE TABLE character_customization_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  option_id TEXT NOT NULL,
  name TEXT NOT NULL,
  style_class TEXT NOT NULL,
  requires_color BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE (category, option_id)
);

-- Insert default customization options
INSERT INTO character_customization_options 
  (category, option_id, name, style_class, requires_color)
VALUES
  -- Body Types
  ('body', 'default', 'Default', 'body-default', false),
  ('body', 'athletic', 'Athletic', 'body-athletic', false),
  ('body', 'round', 'Round', 'body-round', false),
  
  -- Hair Styles
  ('hair', 'default', 'Short', 'hair-default', true),
  ('hair', 'long', 'Long', 'hair-long', true),
  ('hair', 'ponytail', 'Ponytail', 'hair-ponytail', true),
  ('hair', 'spiky', 'Spiky', 'hair-spiky', true),
  
  -- Shirt Styles
  ('shirt', 'default', 'T-Shirt', 'shirt-default', true),
  ('shirt', 'tank-top', 'Tank Top', 'shirt-tank-top', true),
  ('shirt', 'long-sleeve', 'Long Sleeve', 'shirt-long-sleeve', true),
  ('shirt', 'hoodie', 'Hoodie', 'shirt-hoodie', true),
  
  -- Pants Styles
  ('pants', 'default', 'Regular', 'pants-default', true),
  ('pants', 'shorts', 'Shorts', 'pants-shorts', true),
  ('pants', 'skirt', 'Skirt', 'pants-skirt', true),
  ('pants', 'baggy', 'Baggy', 'pants-baggy', true),
  
  -- Shoes Styles
  ('shoes', 'default', 'Sneakers', 'shoes-default', true),
  ('shoes', 'boots', 'Boots', 'shoes-boots', true),
  ('shoes', 'sandals', 'Sandals', 'shoes-sandals', true);

-- Set up RLS
ALTER TABLE character_customization_options ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view customization options"
  ON character_customization_options FOR SELECT
  TO authenticated
  USING (true);

-- Recreate the view without the eye_color field
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
  c.shirt_style as character_shirt_style,
  c.shirt_color as character_shirt_color,
  c.pants_style as character_pants_style,
  c.pants_color as character_pants_color,
  c.shoes_style as character_shoes_style,
  c.shoes_color as character_shoes_color
FROM friends f
JOIN profiles p ON f.friend_id = p.id
LEFT JOIN characters c ON f.friend_id = c.user_id;
