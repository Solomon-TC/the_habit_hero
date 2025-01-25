-- Reset database script
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

-- Run migrations in order
\ir migrations/20240101000001_initial_schema.sql
\ir migrations/20240101000002_habits.sql
\ir migrations/20240101000003_goals.sql
\ir migrations/20240101000004_friends.sql
