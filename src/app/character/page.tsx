'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import CharacterCustomizer from '../../components/CharacterCustomizer';
import type { Database } from '../../types/database';
import type { Character } from '../../types/character';

export default function CharacterPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        redirect('/auth');
      }
      setUserId(user.id);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleSave = (character: Character) => {
    setSaveMessage('Character saved successfully!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Character Customization</h1>
          <p className="mt-2 text-gray-600">
            Customize your character&apos;s appearance and see your progress
          </p>
          {saveMessage && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
              {saveMessage}
            </div>
          )}
        </div>

        <CharacterCustomizer 
          userId={userId}
          onSave={handleSave}
        />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Your character represents your journey in building better habits.</p>
          <p>As you complete habits and achieve goals, your character will level up!</p>
        </div>
      </div>
    </div>
  );
}
