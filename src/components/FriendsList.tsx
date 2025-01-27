'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';
import type { FriendWithProfile } from '../types/friends';

export default function FriendsList() {
  const [friends, setFriends] = useState<FriendWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: friendsData, error: friendsError } = await supabase
          .rpc('get_friends_with_profiles', { user_id_input: user.id });

        if (friendsError) throw friendsError;
        setFriends(friendsData);
      } catch (err) {
        console.error('Error fetching friends:', err);
        setError(err instanceof Error ? err.message : 'Failed to load friends');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('friends')
        .delete()
        .match({ user_id: friends[0]?.user_id, friend_id: friendId });

      if (deleteError) throw deleteError;

      setFriends(friends.filter(friend => friend.friend_id !== friendId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove friend');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading friends...</div>
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

  if (friends.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">No friends yet</div>
        <p className="text-sm text-gray-600 mb-4">
          Connect with other habit heroes to share your progress and stay motivated!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {friends.map(friend => (
        <div
          key={friend.id}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              {friend.avatar_url ? (
                <img
                  src={friend.avatar_url}
                  alt={friend.display_name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-lg font-semibold">
                    {friend.display_name[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {friend.display_name}
                </h3>
                <p className="text-sm text-gray-500">@{friend.username}</p>
                <p className="text-xs text-gray-400">Friend Code: {friend.friend_code}</p>
              </div>
            </div>

            <button
              onClick={() => handleRemoveFriend(friend.friend_id)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Remove Friend
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}
