'use client';

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function CharacterPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your Character
          </h1>
          <div className="space-y-6">
            <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
              <div className="text-gray-500">
                Character customization coming soon...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
