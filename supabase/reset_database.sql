-- Reset database script
-- This will safely drop all existing tables and recreate them

-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS friend_requests CASCADE;
DROP TABLE IF EXISTS friends CASCADE;
DROP TABLE IF EXISTS character_achievements CASCADE;
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS goal_milestones CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS habit_completions CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_character_exp CASCADE;
DROP FUNCTION IF EXISTS handle_friend_request_acceptance CASCADE;

-- Drop existing triggers
DROP TRIGGER IF EXISTS character_exp_update ON characters;
DROP TRIGGER IF EXISTS friend_request_accepted ON friend_requests;

-- Now run the new migrations
\ir combined_migrations.sql
