-- Reset database script
-- This file contains all migrations in order

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own habits" ON habits;
DROP POLICY IF EXISTS "Users can insert their own habits" ON habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON habits;
DROP POLICY IF EXISTS "Users can view their own habit completions" ON habit_completions;
DROP POLICY IF EXISTS "Users can insert their own habit completions" ON habit_completions;
DROP POLICY IF EXISTS "Users can update their own habit completions" ON habit_completions;
DROP POLICY IF EXISTS "Users can delete their own habit completions" ON habit_completions;
DROP POLICY IF EXISTS "Users can view their own goals" ON goals;
DROP POLICY IF EXISTS "Users can insert their own goals" ON goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON goals;
DROP POLICY IF EXISTS "Users can view their own goal milestones" ON goal_milestones;
DROP POLICY IF EXISTS "Users can insert their own goal milestones" ON goal_milestones;
DROP POLICY IF EXISTS "Users can update their own goal milestones" ON goal_milestones;
DROP POLICY IF EXISTS "Users can delete their own goal milestones" ON goal_milestones;
DROP POLICY IF EXISTS "Users can view friend requests they're involved in" ON friend_requests;
DROP POLICY IF EXISTS "Users can send friend requests" ON friend_requests;
DROP POLICY IF EXISTS "Users can update friend requests they're involved in" ON friend_requests;
DROP POLICY IF EXISTS "Users can delete friend requests they're involved in" ON friend_requests;
DROP POLICY IF EXISTS "Users can view their friends" ON friends;
DROP POLICY IF EXISTS "Users can add friends" ON friends;
DROP POLICY IF EXISTS "Users can remove friends" ON friends;

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

-- Drop existing triggers
DROP TRIGGER IF EXISTS friend_request_accepted ON friend_requests;
DROP TRIGGER IF EXISTS update_friend_requests_updated_at ON friend_requests;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_habits_updated_at ON habits;
DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
DROP TRIGGER IF EXISTS update_goal_milestones_updated_at ON goal_milestones;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_completion_date_trigger ON habit_completions;

-- Drop existing views
DROP VIEW IF EXISTS friends_with_profiles CASCADE;
DROP VIEW IF EXISTS friend_requests_with_profiles CASCADE;

\ir migrations/20240101000001_initial_schema.sql
\ir migrations/20240101000002_habits.sql
\ir migrations/20240101000003_goals.sql
\ir migrations/20240101000004_friends.sql
