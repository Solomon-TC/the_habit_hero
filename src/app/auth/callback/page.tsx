import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (searchParams.code) {
    await supabase.auth.exchangeCodeForSession(searchParams.code);
  }

  redirect('/dashboard');
}
