'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';
import type { FriendRequestWithProfiles } from '../types/friends';

export default function FriendRequests() {
  const [incomingRequests, setIncomingRequests] = useState<FriendRequestWithProfiles[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequestWithProfiles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Fetch incoming requests
        const { data: incomingData, error: incomingError } = await supabase
          .from('friend_requests_with_profiles')
          .select('*')
          .eq('receiver_id', user.id)
          .eq('status', 'pending');

        if (incomingError) throw incomingError;
        setIncomingRequests(incomingData);

        // Fetch outgoing requests
        const { data: outgoingData, error: outgoingError } = await supabase
          .from('friend_requests_with_profiles')
          .select('*')
          .eq('sender_id', user.id)
          .eq('status', 'pending');

        if (outgoingError) throw outgoingError;
        setOutgoingRequests(outgoingData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load friend requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestAction = async (requestId: string, action: 'accepted' | 'rejected') => {
    try {
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: action })
        .eq('id', requestId);

      if (updateError) throw updateError;

      setIncomingRequests(prev => prev.filter(request => request.id !== requestId));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} friend request`);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId);

      if (deleteError) throw deleteError;

      setOutgoingRequests(prev => prev.filter(request => request.id !== requestId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel friend request');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading friend requests...</div>
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

  return (
    <div className="space-y-8">
      {/* Incoming Requests */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Incoming Requests ({incomingRequests.length})
        </h3>
        {incomingRequests.length === 0 ? (
          <p className="text-gray-500">No incoming friend requests</p>
        ) : (
          <div className="space-y-4">
            {incomingRequests.map(request => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  {request.sender_avatar_url ? (
                    <img
                      src={request.sender_avatar_url}
                      alt={request.sender_display_name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-lg font-semibold">
                        {request.sender_display_name[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {request.sender_display_name}
                    </h4>
                    <p className="text-sm text-gray-500">@{request.sender_username}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRequestAction(request.id, 'accepted')}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequestAction(request.id, 'rejected')}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Outgoing Requests */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sent Requests ({outgoingRequests.length})
        </h3>
        {outgoingRequests.length === 0 ? (
          <p className="text-gray-500">No outgoing friend requests</p>
        ) : (
          <div className="space-y-4">
            {outgoingRequests.map(request => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  {request.receiver_avatar_url ? (
                    <img
                      src={request.receiver_avatar_url}
                      alt={request.receiver_display_name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-lg font-semibold">
                        {request.receiver_display_name[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {request.receiver_display_name}
                    </h4>
                    <p className="text-sm text-gray-500">@{request.receiver_username}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCancelRequest(request.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Cancel Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
