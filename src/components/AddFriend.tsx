'use client';

import { useState, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';
import type { Profile } from '../types/friends';
import { useDebounce } from 'use-debounce';

export default function AddFriend() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Search by username or display name
      const { data: profiles, error: searchError } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .neq('id', user.id) // Exclude current user
        .limit(5);

      if (searchError) throw searchError;

      // Filter out users who are already friends
      const { data: friends, error: friendsError } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id);

      if (friendsError) throw friendsError;

      const friendIds = new Set(friends?.map(f => f.friend_id));
      const filteredProfiles = profiles.filter(p => !friendIds.has(p.id));

      // Get pending friend requests
      const { data: requests, error: requestsError } = await supabase
        .from('friend_requests')
        .select('receiver_id')
        .eq('sender_id', user.id)
        .eq('status', 'pending');

      if (requestsError) throw requestsError;

      const pendingIds = new Set(requests?.map(r => r.receiver_id));
      setPendingRequests(pendingIds);

      setSearchResults(filteredProfiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search users');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const handleSendRequest = async (receiverId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: requestError } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          status: 'pending'
        });

      if (requestError) throw requestError;

      setPendingRequests(prev => new Set([...prev, receiverId]));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send friend request');
    }
  };

  // Search when debounced query changes
  useCallback(() => {
    searchUsers(debouncedQuery);
  }, [debouncedQuery, searchUsers]);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          Search Users
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or display name"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="text-gray-500">Searching...</div>
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map(profile => (
            <div
              key={profile.id}
              className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-lg font-semibold">
                      {profile.display_name[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {profile.display_name}
                  </h4>
                  <p className="text-sm text-gray-500">@{profile.username}</p>
                </div>
              </div>

              <button
                onClick={() => handleSendRequest(profile.id)}
                disabled={pendingRequests.has(profile.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pendingRequests.has(profile.id)
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {pendingRequests.has(profile.id) ? 'Request Sent' : 'Add Friend'}
              </button>
            </div>
          ))
        ) : searchQuery && !isLoading ? (
          <div className="text-center py-4">
            <div className="text-gray-500">No users found</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
