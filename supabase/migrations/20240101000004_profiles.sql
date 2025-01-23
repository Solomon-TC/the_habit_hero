-- Create function to generate random friend code
CREATE OR REPLACE FUNCTION generate_friend_code()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger function to set friend code if not provided
CREATE OR REPLACE FUNCTION set_friend_code()
RETURNS TRIGGER AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    IF NEW.friend_code IS NULL THEN
        LOOP
            new_code := generate_friend_code();
            
            -- Check if code already exists
            SELECT EXISTS (
                SELECT 1 FROM profiles WHERE friend_code = new_code
            ) INTO code_exists;
            
            -- Exit loop if unique code found
            EXIT WHEN NOT code_exists;
        END LOOP;
        
        NEW.friend_code := new_code;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set friend code
DROP TRIGGER IF EXISTS ensure_friend_code ON profiles;
CREATE TRIGGER ensure_friend_code
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_friend_code();

-- Update existing profiles without friend codes
DO $$
DECLARE
    profile_record RECORD;
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    FOR profile_record IN SELECT id FROM profiles WHERE friend_code IS NULL LOOP
        LOOP
            new_code := generate_friend_code();
            
            -- Check if code already exists
            SELECT EXISTS (
                SELECT 1 FROM profiles WHERE friend_code = new_code
            ) INTO code_exists;
            
            -- Exit loop if unique code found
            EXIT WHEN NOT code_exists;
        END LOOP;
        
        UPDATE profiles SET friend_code = new_code WHERE id = profile_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
