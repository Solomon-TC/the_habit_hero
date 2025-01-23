-- Update habits table
ALTER TABLE habits 
  -- Update frequency to include monthly
  DROP CONSTRAINT habits_frequency_check,
  ADD CONSTRAINT habits_frequency_check 
    CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  
  -- Change target_days to array
  ALTER COLUMN target_days TYPE INTEGER[] USING ARRAY[target_days],
  DROP CONSTRAINT habits_target_days_check,
  ADD CONSTRAINT habits_target_days_check 
    CHECK (array_length(target_days, 1) > 0),

  -- Replace archived boolean with timestamp
  DROP COLUMN archived,
  ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE;

-- Update habit_completions table
ALTER TABLE habit_completions
  -- Remove date column since we're using completed_at
  DROP COLUMN date,
  -- Remove unique constraint that used date
  DROP CONSTRAINT habit_completions_habit_id_date_key,
  -- Add new constraint using completed_at date part
  ADD CONSTRAINT habit_completions_habit_id_date_key 
    UNIQUE (habit_id, (DATE(completed_at)));

-- Drop old index and create new one
DROP INDEX IF EXISTS habit_completions_date_idx;
CREATE INDEX IF NOT EXISTS habit_completions_completed_at_idx 
  ON habit_completions(completed_at);
