'use client';

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function FriendsPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Friends
            </h1>
            <button className="btn-primary">
              Find Friends
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Friend Requests Section */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Friend Requests</h2>
              <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center justify-center text-center">
                <div className="text-gray-500">
                  No pending friend requests
                </div>
              </div>
            </div>

            {/* Your Friends Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Friends</h2>
              <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center justify-center text-center">
                <div className="text-gray-500 mb-4">
                  You haven't added any friends yet
                </div>
                <p className="text-sm text-gray-400 max-w-md">
                  Connect with friends to share progress, celebrate achievements, 
                  and keep each other accountable on your habit-building journey!
                </p>
              </div>
            </div>

            {/* Friend Activity Feed */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Friend Activity</h2>
              <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center justify-center text-center">
                <div className="text-gray-500">
                  No recent friend activity
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
