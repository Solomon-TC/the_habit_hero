'use client';

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';

export default function AccountPage() {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Account Settings
          </h1>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 text-gray-900">{email}</div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Stats</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-gray-500">Active Habits</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-gray-500">Goals Set</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-gray-500">Days Streak</div>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div>
              <button
                onClick={handleSignOut}
                className="w-full btn-primary bg-red-600 hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
