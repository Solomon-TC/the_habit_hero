-- Create friend_requests table
CREATE TABLE IF NOT EXISTS friend_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE (sender_id, receiver_id),
    CHECK (sender_id != receiver_id)
);

-- Create friends table
CREATE TABLE IF NOT EXISTS friends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE (user_id, friend_id),
    CHECK (user_id != friend_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS friend_requests_sender_id_idx ON friend_requests(sender_id);
CREATE INDEX IF NOT EXISTS friend_requests_receiver_id_idx ON friend_requests(receiver_id);
CREATE INDEX IF NOT EXISTS friend_requests_status_idx ON friend_requests(status);
CREATE INDEX IF NOT EXISTS friends_user_id_idx ON friends(user_id);
CREATE INDEX IF NOT EXISTS friends_friend_id_idx ON friends(friend_id);

-- Set up Row Level Security (RLS)
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view friend requests they're involved in" ON friend_requests;
DROP POLICY IF EXISTS "Users can send friend requests" ON friend_requests;
DROP POLICY IF EXISTS "Users can update friend requests they received" ON friend_requests;
DROP POLICY IF EXISTS "Users can delete friend requests they're involved in" ON friend_requests;
DROP POLICY IF EXISTS "Users can view their friends" ON friends;
DROP POLICY IF EXISTS "Users can add friends" ON friends;
DROP POLICY IF EXISTS "Users can remove friends" ON friends;
DROP POLICY IF EXISTS "System can add friends" ON friends;

-- Create policies for friend_requests table
CREATE POLICY "Users can view friend requests they're involved in"
    ON friend_requests FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send friend requests"
    ON friend_requests FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update friend requests they received"
    ON friend_requests FOR UPDATE
    USING (auth.uid() = receiver_id)
    WITH CHECK (auth.uid() = receiver_id);

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

CREATE POLICY "System can add friends"
    ON friends FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM friend_requests fr
        WHERE fr.status = 'accepted'
        AND (
            (fr.sender_id = user_id AND fr.receiver_id = friend_id)
            OR
            (fr.receiver_id = user_id AND fr.sender_id = friend_id)
        )
    ));

CREATE POLICY "Users can remove friends"
    ON friends FOR DELETE
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS friend_request_accepted ON friend_requests;
DROP FUNCTION IF EXISTS handle_friend_request_acceptance();
DROP FUNCTION IF EXISTS get_friends_with_profiles(uuid);
DROP FUNCTION IF EXISTS get_friend_requests_with_profiles(uuid);

-- Create function to handle friend request acceptance
CREATE OR REPLACE FUNCTION handle_friend_request_acceptance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        -- Create bidirectional friendship
        INSERT INTO friends (user_id, friend_id)
        VALUES 
            (NEW.sender_id, NEW.receiver_id),
            (NEW.receiver_id, NEW.sender_id)
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for friend request acceptance
CREATE TRIGGER friend_request_accepted
    AFTER UPDATE ON friend_requests
    FOR EACH ROW
    EXECUTE FUNCTION handle_friend_request_acceptance();

-- Create secure function to get friends with profiles
CREATE OR REPLACE FUNCTION get_friends_with_profiles(user_id_input UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    friend_id UUID,
    created_at TIMESTAMPTZ,
    username TEXT,
    display_name TEXT,
    avatar_url TEXT,
    friend_code TEXT,
    bio TEXT
) SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the requesting user matches the input user_id
    IF auth.uid() != user_id_input THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    RETURN QUERY
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
    JOIN profiles p ON f.friend_id = p.id
    WHERE f.user_id = user_id_input;
END;
$$;

-- Create secure function to get friend requests with profiles
CREATE OR REPLACE FUNCTION get_friend_requests_with_profiles(user_id_input UUID)
RETURNS TABLE (
    id UUID,
    sender_id UUID,
    receiver_id UUID,
    status TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    sender_username TEXT,
    sender_display_name TEXT,
    sender_avatar_url TEXT,
    sender_friend_code TEXT,
    sender_bio TEXT,
    receiver_username TEXT,
    receiver_display_name TEXT,
    receiver_avatar_url TEXT,
    receiver_friend_code TEXT,
    receiver_bio TEXT
) SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the requesting user matches the input user_id
    IF auth.uid() != user_id_input THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    RETURN QUERY
    SELECT 
        fr.id,
        fr.sender_id,
        fr.receiver_id,
        fr.status,
        fr.created_at,
        fr.updated_at,
        sp.username AS sender_username,
        sp.display_name AS sender_display_name,
        sp.avatar_url AS sender_avatar_url,
        sp.friend_code AS sender_friend_code,
        sp.bio AS sender_bio,
        rp.username AS receiver_username,
        rp.display_name AS receiver_display_name,
        rp.avatar_url AS receiver_avatar_url,
        rp.friend_code AS receiver_friend_code,
        rp.bio AS receiver_bio
    FROM friend_requests fr
    JOIN profiles sp ON fr.sender_id = sp.id
    JOIN profiles rp ON fr.receiver_id = rp.id
    WHERE fr.sender_id = user_id_input OR fr.receiver_id = user_id_input;
END;
$$;
