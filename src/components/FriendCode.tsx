'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';

export default function FriendCode() {
  const [friendCode, setFriendCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchFriendCode = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('friend_code')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setFriendCode(profile.friend_code);
      } catch (err) {
        console.error('Error fetching friend code:', err);
        setError(err instanceof Error ? err.message : 'Failed to load friend code');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriendCode();
  }, []);

  if (isLoading) return null;
  if (error) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Your Friend Code</h3>
        <p className="text-2xl font-bold text-primary tracking-wider">{friendCode}</p>
        <p className="text-xs text-gray-500 mt-1">Share this code with friends to connect</p>
      </div>
    </div>
  );
}
