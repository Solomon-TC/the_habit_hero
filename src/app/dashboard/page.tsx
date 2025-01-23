'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import HabitList from '../../components/HabitList';
import GoalList from '../../components/GoalList';
import DateDisplay from '../../components/DateDisplay';
import HabitStats from '../../components/HabitStats';
import type { Database } from '../../types/database';

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

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
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Track your daily progress and achievements
              </p>
            </div>
            <DateDisplay />
          </div>

          {/* Stats Overview */}
          <div className="mt-6">
            <HabitStats key={refreshKey} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Today's Habits */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Today's Habits</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <Link
                  href="/habits"
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  Manage Habits →
                </Link>
              </div>
              <HabitList key={refreshKey} />
            </div>

            {/* Active Goals */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Active Goals</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Track your long-term progress
                  </p>
                </div>
                <Link
                  href="/goals"
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  Manage Goals →
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
