'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import HabitList from '../../components/HabitList';
import GoalList from '../../components/GoalList';
import CharacterDisplay from '../../components/CharacterDisplay';
import DateDisplay from '../../components/DateDisplay';
import type { Database } from '../../types/database';

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [hasCharacter, setHasCharacter] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          redirect('/auth');
        }
        setUserId(user.id);

        // Check if user has a character
        const { data: character, error } = await supabase
          .from('characters')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setHasCharacter(!!character);
      } catch (err) {
        console.error('Error checking character:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading || !userId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Track your daily progress and achievements
            </p>
          </div>
          <DateDisplay />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Section */}
          <div className="lg:col-span-1">
            {hasCharacter ? (
              <CharacterDisplay userId={userId} showAchievements={false} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Your Character</h2>
                <p className="text-gray-600 mb-6">
                  Start your journey by creating a character that will grow with your achievements
                </p>
                <Link
                  href="/character"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Character
                </Link>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Habits */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Today's Habits</h2>
                <Link
                  href="/habits"
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  View All →
                </Link>
              </div>
              <HabitList />
            </div>

            {/* Active Goals */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Active Goals</h2>
                <Link
                  href="/goals"
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  View All →
                </Link>
              </div>
              <GoalList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
