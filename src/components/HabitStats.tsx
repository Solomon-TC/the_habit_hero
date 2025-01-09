'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';
import type { Habit, HabitCompletion } from '../types/database';

type HabitWithCompletions = Habit & {
  completions: HabitCompletion[];
};

export default function HabitStats() {
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    currentStreak: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];

        // Get active habits with their completions
        const { data: habits, error: habitsError } = await supabase
          .from('habits')
          .select('*, completions:habit_completions(*)')
          .is('archived_at', null);

        if (habitsError) throw habitsError;

        // Calculate completions for today based on habit frequency
        let completedToday = 0;
        const habitsWithCompletions = habits as HabitWithCompletions[];

        habitsWithCompletions.forEach(habit => {
          const todayCompletions = habit.completions.filter(c => 
            new Date(c.completed_at).toISOString().split('T')[0] === today
          );

          // For daily habits, any completion today counts
          if (habit.frequency === 'daily' && todayCompletions.length > 0) {
            completedToday++;
          }
          // For weekly habits, check if the target days for this week are completed
          else if (habit.frequency === 'weekly') {
            const currentDay = new Date().getDay() + 1; // 1-7 (Sunday = 1)
            if (habit.target_days.includes(currentDay) && todayCompletions.length > 0) {
              completedToday++;
            }
          }
          // For monthly habits, check if the target days for this month are completed
          else if (habit.frequency === 'monthly') {
            const currentDate = new Date().getDate(); // 1-31
            if (habit.target_days.includes(currentDate) && todayCompletions.length > 0) {
              completedToday++;
            }
          }
        });

        // Calculate streak
        let streak = 0;
        const now = new Date();
        let currentDate = new Date(now);
        currentDate.setHours(0, 0, 0, 0);

        while (true) {
          const dateStr = currentDate.toISOString().split('T')[0];
          let allHabitsCompletedForDate = true;

          // Check each habit's completions for this date
          for (const habit of habitsWithCompletions) {
            const dateCompletions = habit.completions.filter(c => 
              new Date(c.completed_at).toISOString().split('T')[0] === dateStr
            );

            // Check if this habit needed to be completed on this date
            let neededCompletion = false;
            if (habit.frequency === 'daily') {
              neededCompletion = true;
            } else if (habit.frequency === 'weekly') {
              const dayOfWeek = currentDate.getDay() + 1; // 1-7 (Sunday = 1)
              neededCompletion = habit.target_days.includes(dayOfWeek);
            } else if (habit.frequency === 'monthly') {
              const dayOfMonth = currentDate.getDate(); // 1-31
              neededCompletion = habit.target_days.includes(dayOfMonth);
            }

            // If the habit needed completion but wasn't completed, break the streak
            if (neededCompletion && dateCompletions.length === 0) {
              allHabitsCompletedForDate = false;
              break;
            }
          }

          if (!allHabitsCompletedForDate) {
            break;
          }

          streak++;
          currentDate.setDate(currentDate.getDate() - 1);

          // Limit streak calculation to last 365 days
          if (streak >= 365) break;
        }

        setStats({
          totalHabits: habitsWithCompletions.length,
          completedToday,
          currentStreak: streak,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white shadow rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Habits</h3>
        <div className="text-3xl font-bold text-primary">{stats.totalHabits}</div>
        <p className="text-sm text-gray-500 mt-1">habits being tracked</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Today's Progress</h3>
        <div className="text-3xl font-bold text-primary">
          {stats.completedToday}/{stats.totalHabits}
        </div>
        <p className="text-sm text-gray-500 mt-1">habits completed today</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Streak</h3>
        <div className="text-3xl font-bold text-primary">{stats.currentStreak}</div>
        <p className="text-sm text-gray-500 mt-1">consecutive days</p>
      </div>
    </div>
  );
}
