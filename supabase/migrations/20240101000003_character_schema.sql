-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    experience INTEGER NOT NULL DEFAULT 0,
    next_level_exp INTEGER NOT NULL DEFAULT 100,
    color_primary TEXT NOT NULL DEFAULT '#4F46E5',
    color_secondary TEXT NOT NULL DEFAULT '#818CF8',
    color_accent TEXT NOT NULL DEFAULT '#C7D2FE',
    habits_completed INTEGER NOT NULL DEFAULT 0,
    goals_completed INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE (user_id)
);

-- Create character achievements table
CREATE TABLE IF NOT EXISTS character_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('habit_streak', 'goal_completion', 'level_up', 'milestone')),
    name TEXT NOT NULL,
    description TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE (character_id, name)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS characters_user_id_idx ON characters(user_id);
CREATE INDEX IF NOT EXISTS character_achievements_character_id_idx ON character_achievements(character_id);
CREATE INDEX IF NOT EXISTS character_achievements_user_id_idx ON character_achievements(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_achievements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own character" ON characters;
DROP POLICY IF EXISTS "Users can create their own character" ON characters;
DROP POLICY IF EXISTS "Users can update their own character" ON characters;
DROP POLICY IF EXISTS "Users can delete their own character" ON characters;
DROP POLICY IF EXISTS "Users can view their own achievements" ON character_achievements;
DROP POLICY IF EXISTS "Users can create their own achievements" ON character_achievements;
DROP POLICY IF EXISTS "Users can update their own achievements" ON character_achievements;
DROP POLICY IF EXISTS "Users can delete their own achievements" ON character_achievements;

-- Create policies for characters table
CREATE POLICY "Users can view their own character"
    ON characters FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own character"
    ON characters FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own character"
    ON characters FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own character"
    ON characters FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for character_achievements table
CREATE POLICY "Users can view their own achievements"
    ON character_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements"
    ON character_achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
    ON character_achievements FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own achievements"
    ON character_achievements FOR DELETE
    USING (auth.uid() = user_id);

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS character_exp_update ON characters;
DROP FUNCTION IF EXISTS update_character_exp();

-- Create function to update character experience
CREATE OR REPLACE FUNCTION update_character_exp()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if character leveled up
    WHILE NEW.experience >= NEW.next_level_exp LOOP
        -- Level up
        NEW.level := NEW.level + 1;
        -- Subtract current level requirement
        NEW.experience := NEW.experience - NEW.next_level_exp;
        -- Calculate next level requirement (increases by 50% each level)
        NEW.next_level_exp := FLOOR(NEW.next_level_exp * 1.5);
        
        -- Create level up achievement
        INSERT INTO character_achievements (
            character_id,
            user_id,
            type,
            name,
            description
        ) VALUES (
            NEW.id,
            NEW.user_id,
            'level_up',
            'Reached Level ' || NEW.level,
            'Advanced to level ' || NEW.level || ' through consistent habit completion and goal achievement'
        ) ON CONFLICT (character_id, name) DO NOTHING;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for character experience updates
CREATE TRIGGER character_exp_update
    BEFORE UPDATE OF experience ON characters
    FOR EACH ROW
    EXECUTE FUNCTION update_character_exp();
