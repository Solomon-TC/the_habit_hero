'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import CharacterCreation from '../../components/CharacterCreation';
import CharacterDisplay from '../../components/CharacterDisplay';
import type { Database } from '../../types/database';

export default function CharacterPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [hasCharacter, setHasCharacter] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

        // Check if user has a character
        const { data: character, error } = await supabase
          .from('characters')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error;
        }

        setHasCharacter(!!character);
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
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {!hasCharacter ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create Your Character</h1>
              <p className="mt-2 text-gray-600">
                Your character will level up as you complete habits and achieve goals
              </p>
            </div>
            <CharacterCreation 
              onCharacterCreated={() => setHasCharacter(true)} 
            />
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Your Character</h1>
              <p className="mt-2 text-gray-600">
                Track your progress and achievements
              </p>
            </div>
            <CharacterDisplay userId={userId} />
          </>
        )}
      </div>
    </div>
  );
}
