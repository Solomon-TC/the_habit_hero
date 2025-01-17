-- Add friend_code column to profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'friend_code'
    ) THEN
        ALTER TABLE profiles ADD COLUMN friend_code TEXT UNIQUE;
    END IF;
END $$;

-- Create function to generate random friend code
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

-- Generate friend codes for existing profiles that don't have one
DO $$
DECLARE
    profile_record RECORD;
    new_friend_code TEXT;
BEGIN
    FOR profile_record IN SELECT id FROM profiles WHERE friend_code IS NULL LOOP
        -- Generate a unique friend code
        LOOP
            new_friend_code := generate_friend_code();
            EXIT WHEN NOT EXISTS (
                SELECT 1 FROM profiles WHERE friend_code = new_friend_code
            );
        END LOOP;

        -- Update the profile with the new friend code
        UPDATE profiles 
        SET friend_code = new_friend_code 
        WHERE id = profile_record.id;
    END LOOP;
END $$;

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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS friend_requests_sender_id_idx ON friend_requests(sender_id);
CREATE INDEX IF NOT EXISTS friend_requests_receiver_id_idx ON friend_requests(receiver_id);
CREATE INDEX IF NOT EXISTS friends_user_id_idx ON friends(user_id);
CREATE INDEX IF NOT EXISTS friends_friend_id_idx ON friends(friend_id);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS profiles_friend_code_idx ON profiles(friend_code);

-- Enable Row Level Security
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
        
        -- Create achievement for both users
        WITH user_characters AS (
            SELECT id, user_id
            FROM characters
            WHERE user_id IN (NEW.sender_id, NEW.receiver_id)
        )
        INSERT INTO character_achievements (
            character_id,
            user_id,
            type,
            name,
            description
        )
        SELECT 
            uc.id,
            uc.user_id,
            'milestone',
            'Made a New Friend',
            'Connected with another habit hero on their journey'
        FROM user_characters uc
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

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
DROP TRIGGER IF EXISTS update_friend_requests_updated_at ON friend_requests;
CREATE TRIGGER update_friend_requests_updated_at
    BEFORE UPDATE ON friend_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update handle_new_user function to include friend_code
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

    -- Update existing profile or create new one
    INSERT INTO public.profiles (id, username, display_name, friend_code)
    VALUES (
        NEW.id,
        LOWER(SPLIT_PART(NEW.email, '@', 1)),
        SPLIT_PART(NEW.email, '@', 1),
        new_friend_code
    )
    ON CONFLICT (id) DO UPDATE
    SET friend_code = EXCLUDED.friend_code
    WHERE profiles.friend_code IS NULL;

    RETURN NEW;
END;
$$;

-- Recreate trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Grant permissions to public schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
