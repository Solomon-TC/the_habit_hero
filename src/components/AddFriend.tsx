'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '../types/database';

export default function AddFriend() {
  const [friendCode, setFriendCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [myFriendCode, setMyFriendCode] = useState<string | null>(null);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch current user's friend code on component mount
  const fetchMyFriendCode = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('friend_code')
      .eq('id', user.id)
      .single();

    if (profile) {
      setMyFriendCode(profile.friend_code);
    }
  };

  useEffect(() => {
    fetchMyFriendCode();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Find user by friend code
      const { data: foundUser, error: searchError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('friend_code', friendCode.toUpperCase())
        .single();

      if (searchError || !foundUser) {
        throw new Error('User not found');
      }

      if (foundUser.id === user.id) {
        throw new Error('You cannot add yourself as a friend');
      }

      // Check if friend request already exists
      const { data: existingRequest } = await supabase
        .from('friend_requests')
        .select('status')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${foundUser.id},receiver_id.eq.${foundUser.id}`)
        .single();

      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          throw new Error('A friend request already exists between you and this user');
        } else if (existingRequest.status === 'accepted') {
          throw new Error('You are already friends with this user');
        }
      }

      // Send friend request
      const { error: requestError } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: foundUser.id,
          status: 'pending'
        });

      if (requestError) throw requestError;

      setSuccess(`Friend request sent to ${foundUser.display_name}`);
      setFriendCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send friend request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {myFriendCode && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Your Friend Code</h3>
          <div className="flex items-center space-x-2">
            <code className="bg-gray-100 px-3 py-1 rounded text-lg font-mono">
              {myFriendCode}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(myFriendCode);
                setSuccess('Friend code copied to clipboard!');
                setTimeout(() => setSuccess(null), 3000);
              }}
              className="text-primary hover:text-primary/80"
            >
              Copy
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Share this code with friends so they can add you
          </p>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Add Friend</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="friendCode" className="block text-sm font-medium text-gray-700">
              Friend Code
            </label>
            <input
              id="friendCode"
              type="text"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              placeholder="Enter friend code (e.g., ABC123XY)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
              pattern="[A-Za-z0-9]{8}"
              title="Friend code must be 8 characters long and contain only letters and numbers"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter your friend's 8-character code to send them a friend request
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Friend Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
