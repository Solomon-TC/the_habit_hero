'use client';

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import HabitStats from '../../components/HabitStats';
import DateDisplay from '../../components/DateDisplay';

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || null);
      }
    };
    getUser();
  }, [supabase.auth]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back{email ? `, ${email.split('@')[0]}` : ''}!
              </h1>
              <p className="text-gray-600">
                Here's your progress for today
              </p>
            </div>
            <DateDisplay />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-8">
          <HabitStats />
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/habits')}
              className="p-4 border-2 border-primary rounded-lg text-left hover:bg-gray-50"
            >
              <h3 className="font-semibold text-primary">Track Today's Habits →</h3>
              <p className="text-sm text-gray-600">Mark your daily habits as complete</p>
            </button>
            <button
              onClick={() => router.push('/habits')}
              className="p-4 border-2 border-primary rounded-lg text-left hover:bg-gray-50"
            >
              <h3 className="font-semibold text-primary">Add New Habit →</h3>
              <p className="text-sm text-gray-600">Create a new habit to track</p>
            </button>
            <button
              onClick={() => router.push('/character')}
              className="p-4 border-2 border-primary rounded-lg text-left hover:bg-gray-50"
            >
              <h3 className="font-semibold text-primary">View Character →</h3>
              <p className="text-sm text-gray-600">Check your character's progress</p>
            </button>
            <button
              onClick={() => router.push('/friends')}
              className="p-4 border-2 border-primary rounded-lg text-left hover:bg-gray-50"
            >
              <h3 className="font-semibold text-primary">Connect with Friends →</h3>
              <p className="text-sm text-gray-600">Find accountability partners</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
