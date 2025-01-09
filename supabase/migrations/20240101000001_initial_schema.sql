-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    friend_code TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    target_days INTEGER[] NOT NULL CHECK (array_length(target_days, 1) > 0),
    reminder_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    archived_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id, name)
);

-- Create habit completions table
CREATE TABLE IF NOT EXISTS habit_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    completion_date DATE NOT NULL,
    UNIQUE (habit_id, completion_date)
);

-- Create function to set completion_date from completed_at
CREATE OR REPLACE FUNCTION set_completion_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.completion_date := DATE(NEW.completed_at);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set completion_date
CREATE TRIGGER set_completion_date_trigger
    BEFORE INSERT OR UPDATE OF completed_at ON habit_completions
    FOR EACH ROW
    EXECUTE FUNCTION set_completion_date();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON habits(user_id);
CREATE INDEX IF NOT EXISTS habit_completions_user_id_idx ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS habit_completions_habit_id_idx ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS habit_completions_completed_at_idx ON habit_completions(completed_at);
CREATE INDEX IF NOT EXISTS habit_completions_completion_date_idx ON habit_completions(completion_date);

-- Set up Row Level Security (RLS)
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for habits table
CREATE POLICY "Users can view their own habits"
    ON habits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits"
    ON habits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
    ON habits FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
    ON habits FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for habit_completions table
CREATE POLICY "Users can view their own habit completions"
    ON habit_completions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit completions"
    ON habit_completions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit completions"
    ON habit_completions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit completions"
    ON habit_completions FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for profiles table
CREATE POLICY "Users can view all profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);
