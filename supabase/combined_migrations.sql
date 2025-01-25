-- Combined migrations file
-- This file contains all migrations in order

-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS friend_requests CASCADE;
DROP TABLE IF EXISTS friends CASCADE;
DROP TABLE IF EXISTS goal_milestones CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS habit_completions CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS handle_friend_request_acceptance CASCADE;
DROP FUNCTION IF EXISTS generate_friend_code CASCADE;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS set_completion_date CASCADE;

-- Initial schema with profiles table
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

-- Function to generate random friend code
CREATE OR REPLACE FUNCTION generate_friend_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    -- Generate an 8-character code (e.g., 'HB4K9XY2')
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    new_friend_code TEXT;
BEGIN
    -- Generate a unique friend code
    LOOP
        new_friend_code := generate_friend_code();
        EXIT WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE friend_code = new_friend_code);
    END LOOP;

    -- Create new profile
    INSERT INTO public.profiles (id, username, display_name, friend_code)
    VALUES (
        NEW.id,
        LOWER(SPLIT_PART(NEW.email, '@', 1)),
        SPLIT_PART(NEW.email, '@', 1),
        new_friend_code
    );

    RETURN NEW;
END;
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Create trigger for updating profile timestamps
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

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

-- Create indexes for profiles
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS profiles_friend_code_idx ON profiles(friend_code);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    target_days INTEGER[] NOT NULL CHECK (array_length(target_days, 1) > 0),
    reminder_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    archived_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id, title)
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

-- Function to set completion_date from completed_at
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

-- Create trigger for updating habit timestamps
DROP TRIGGER IF EXISTS update_habits_updated_at ON habits;
CREATE TRIGGER update_habits_updated_at
    BEFORE UPDATE ON habits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for habits
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON habits(user_id);
CREATE INDEX IF NOT EXISTS habits_archived_at_idx ON habits(archived_at);
CREATE INDEX IF NOT EXISTS habit_completions_user_id_idx ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS habit_completions_habit_id_idx ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS habit_completions_completed_at_idx ON habit_completions(completed_at);
CREATE INDEX IF NOT EXISTS habit_completions_completion_date_idx ON habit_completions(completion_date);

-- Enable Row Level Security for habits
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

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

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed', 'archived')),
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id, title)
);

-- Create goal milestones table
CREATE TABLE IF NOT EXISTS goal_milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (goal_id, title)
);

-- Create triggers for updating goal timestamps
DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_goal_milestones_updated_at ON goal_milestones;
CREATE TRIGGER update_goal_milestones_updated_at
    BEFORE UPDATE ON goal_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for goals
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);
CREATE INDEX IF NOT EXISTS goals_status_idx ON goals(status);
CREATE INDEX IF NOT EXISTS goals_target_date_idx ON goals(target_date);
CREATE INDEX IF NOT EXISTS goal_milestones_goal_id_idx ON goal_milestones(goal_id);
CREATE INDEX IF NOT EXISTS goal_milestones_user_id_idx ON goal_milestones(user_id);
CREATE INDEX IF NOT EXISTS goal_milestones_completed_idx ON goal_milestones(completed);

-- Enable Row Level Security for goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;

-- Create policies for goals table
CREATE POLICY "Users can view their own goals"
    ON goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
    ON goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
    ON goals FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
    ON goals FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for goal_milestones table
CREATE POLICY "Users can view their own goal milestones"
    ON goal_milestones FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goal milestones"
    ON goal_milestones FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goal milestones"
    ON goal_milestones FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goal milestones"
    ON goal_milestones FOR DELETE
    USING (auth.uid() = user_id);

-- Create friend requests table
CREATE TABLE IF NOT EXISTS friend_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE (sender_id, receiver_id)
);

-- Create friends table (for accepted friendships)
CREATE TABLE IF NOT EXISTS friends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE (user_id, friend_id)
);

-- Create friends_with_profiles view
CREATE OR REPLACE VIEW friends_with_profiles AS
SELECT 
    f.id,
    f.user_id,
    f.friend_id,
    f.created_at,
    p.username,
    p.display_name,
    p.avatar_url,
    p.friend_code,
    p.bio
FROM friends f
JOIN profiles p ON f.friend_id = p.id;

-- Create friend_requests_with_profiles view
CREATE OR REPLACE VIEW friend_requests_with_profiles AS
SELECT 
    fr.id,
    fr.sender_id,
    fr.receiver_id,
    fr.status,
    fr.created_at,
    fr.updated_at,
    sp.username as sender_username,
    sp.display_name as sender_display_name,
    sp.avatar_url as sender_avatar_url,
    sp.friend_code as sender_friend_code,
    sp.bio as sender_bio,
    rp.username as receiver_username,
    rp.display_name as receiver_display_name,
    rp.avatar_url as receiver_avatar_url,
    rp.friend_code as receiver_friend_code,
    rp.bio as receiver_bio
FROM friend_requests fr
JOIN profiles sp ON fr.sender_id = sp.id
JOIN profiles rp ON fr.receiver_id = rp.id;

-- Function to handle friend request acceptance
CREATE OR REPLACE FUNCTION handle_friend_request_acceptance()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        -- Create friendship records (bidirectional)
        INSERT INTO friends (user_id, friend_id)
        VALUES 
            (NEW.sender_id, NEW.receiver_id),
            (NEW.receiver_id, NEW.sender_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for friend request acceptance
DROP TRIGGER IF EXISTS on_friend_request_acceptance ON friend_requests;
CREATE TRIGGER on_friend_request_acceptance
    AFTER UPDATE OF status ON friend_requests
    FOR EACH ROW
    EXECUTE FUNCTION handle_friend_request_acceptance();

-- Create trigger for updating friend request timestamps
DROP TRIGGER IF EXISTS update_friend_requests_updated_at ON friend_requests;
CREATE TRIGGER update_friend_requests_updated_at
    BEFORE UPDATE ON friend_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for friends
CREATE INDEX IF NOT EXISTS friend_requests_sender_id_idx ON friend_requests(sender_id);
CREATE INDEX IF NOT EXISTS friend_requests_receiver_id_idx ON friend_requests(receiver_id);
CREATE INDEX IF NOT EXISTS friend_requests_status_idx ON friend_requests(status);
CREATE INDEX IF NOT EXISTS friends_user_id_idx ON friends(user_id);
CREATE INDEX IF NOT EXISTS friends_friend_id_idx ON friends(friend_id);

-- Enable Row Level Security for friends
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- Create policies for friend_requests table
CREATE POLICY "Users can view friend requests they're involved in"
    ON friend_requests FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send friend requests"
    ON friend_requests FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update friend requests they're involved in"
    ON friend_requests FOR UPDATE
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id)
    WITH CHECK (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can delete friend requests they're involved in"
    ON friend_requests FOR DELETE
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Create policies for friends table
CREATE POLICY "Users can view their friends"
    ON friends FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can add friends"
    ON friends FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove friends"
    ON friends FOR DELETE
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
