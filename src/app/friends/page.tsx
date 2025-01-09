'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import FriendsList from '../../components/FriendsList';
import FriendRequests from '../../components/FriendRequests';
import AddFriend from '../../components/AddFriend';
import FriendCode from '../../components/FriendCode';
import type { Database } from '../../types/database';

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'add'>('friends');

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check authentication
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) redirect('/auth');
  });

  const tabs = [
    { id: 'friends', label: 'Friends' },
    { id: 'requests', label: 'Friend Requests' },
    { id: 'add', label: 'Add Friend' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
          <p className="mt-2 text-gray-600">
            Connect with other habit heroes and support each other&apos;s journeys
          </p>
        </div>

        {/* Friend Code */}
        <FriendCode />

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'friends' && <FriendsList />}
          {activeTab === 'requests' && <FriendRequests />}
          {activeTab === 'add' && <AddFriend />}
        </div>
      </div>
    </div>
  );
}
