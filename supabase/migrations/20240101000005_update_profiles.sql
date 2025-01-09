-- Function to generate a random friend code
CREATE OR REPLACE FUNCTION generate_friend_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$;

-- Update existing profiles with friend codes if they don't have one
DO $$
DECLARE
    profile_record RECORD;
BEGIN
    FOR profile_record IN 
        SELECT id 
        FROM profiles 
        WHERE friend_code IS NULL OR friend_code = ''
    LOOP
        -- Keep trying until we get a unique friend code
        WHILE TRUE LOOP
            BEGIN
                UPDATE profiles 
                SET friend_code = generate_friend_code()
                WHERE id = profile_record.id;
                EXIT; -- If we get here, the update succeeded
            EXCEPTION WHEN unique_violation THEN
                -- If we get a duplicate, the loop will try again
                CONTINUE;
            END;
        END LOOP;
    END LOOP;
END;
$$;

-- Make friend_code NOT NULL after ensuring all profiles have one
ALTER TABLE profiles 
    ALTER COLUMN friend_code SET NOT NULL;
