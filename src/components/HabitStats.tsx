'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';

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

        // Get total active habits
        const { data: habits, error: habitsError } = await supabase
          .from('habits')
          .select('id')
          .eq('archived', false);

        if (habitsError) throw habitsError;

        // Get today's completions
        const { data: completions, error: completionsError } = await supabase
          .from('habit_completions')
          .select('*')
          .eq('date', today);

        if (completionsError) throw completionsError;

        // Calculate streak (simplified version - just counting consecutive days)
        const { data: streakData, error: streakError } = await supabase
          .from('habit_completions')
          .select('date')
          .order('date', { ascending: false })
          .limit(30); // Look at last 30 days max

        if (streakError) throw streakError;

        let streak = 0;
        if (streakData && streakData.length > 0) {
          const dates = streakData.map(d => new Date(d.date).toISOString().split('T')[0]);
          dates.sort((a, b) => b.localeCompare(a)); // Sort descending

          let currentDate = new Date();
          for (const date of dates) {
            const expectedDate = new Date(currentDate);
            expectedDate.setDate(currentDate.getDate() - streak);
            const expectedDateStr = expectedDate.toISOString().split('T')[0];

            if (date === expectedDateStr) {
              streak++;
              currentDate = new Date(date);
            } else {
              break;
            }
          }
        }

        setStats({
          totalHabits: habits?.length || 0,
          completedToday: completions?.length || 0,
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
