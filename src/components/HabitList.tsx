'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';
import type { Habit, HabitCompletion } from '../types/database';
import EditHabitForm from './EditHabitForm';

type HabitWithCompletions = Habit & {
  completions: HabitCompletion[];
};

export default function HabitList() {
  const [habits, setHabits] = useState<HabitWithCompletions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<HabitWithCompletions | null>(null);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchHabits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)  // Add this line to filter by user_id
        .is('archived_at', null)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;

      // Fetch today's completions for these habits
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)  // Add this line to filter by user_id
        .eq('completion_date', today)  // Use completion_date instead of completed_at range
        .in('habit_id', habitsData.map(h => h.id));

      if (completionsError) throw completionsError;

      // Combine habits with their completions
      const habitsWithCompletions = habitsData.map(habit => ({
        ...habit,
        completions: completionsData.filter(c => c.habit_id === habit.id)
      }));

      setHabits(habitsWithCompletions);
    } catch (err) {
      console.error('Error fetching habits:', err);  // Add this line for debugging
      setError(err instanceof Error ? err.message : 'Failed to fetch habits');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const toggleHabitCompletion = async (habit: HabitWithCompletions) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const today = new Date().toISOString();
      const todayDate = today.split('T')[0];
      const isCompleted = habit.completions.some(c => c.completion_date === todayDate);

      if (isCompleted) {
        // Remove completion
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habit.id)
          .eq('user_id', user.id)
          .eq('completion_date', todayDate);

        if (error) throw error;
      } else {
        // Add completion
        const { error } = await supabase
          .from('habit_completions')
          .insert({
            habit_id: habit.id,
            user_id: user.id,
            completed_at: today,
            completion_date: todayDate  // Add this line
          });

        if (error) throw error;
      }

      // Refresh habits
      await fetchHabits();
    } catch (err) {
      console.error('Error toggling habit:', err);  // Add this line for debugging
      setError(err instanceof Error ? err.message : 'Failed to update habit');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading habits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">No habits created yet</div>
        <p className="text-sm text-gray-400">
          Create your first habit to start tracking your progress
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <div
          key={habit.id}
          className="bg-white shadow rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{habit.name}</h3>
                {habit.description && (
                  <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {habit.frequency === 'daily' ? 'Daily' : 
                   habit.frequency === 'weekly' ? `${habit.target_days.length} days per week` :
                   `${habit.target_days.length} days per month`}
                </div>
              </div>
              <button
                onClick={() => setEditingHabit(habit)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                ✎
              </button>
            </div>
          </div>
          <button
            onClick={() => toggleHabitCompletion(habit)}
            className={`ml-4 h-6 w-6 rounded-full border-2 transition-colors ${
              habit.completions.length > 0
                ? 'bg-primary border-primary text-white'
                : 'border-gray-300 hover:border-primary'
            }`}
          >
            {habit.completions.length > 0 && '✓'}
          </button>
        </div>
      ))}

      {editingHabit && (
        <EditHabitForm
          habit={editingHabit}
          onClose={() => setEditingHabit(null)}
          onHabitUpdated={fetchHabits}
        />
      )}
    </div>
  );
}
