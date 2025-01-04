import '../styles/globals.css';
import type { Metadata } from 'next';
import Navigation from '../components/Navigation';

export const metadata: Metadata = {
  title: 'The Habit Hero',
  description: 'Level up your life by building better habits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We'll show navigation on all pages except auth-related ones
  const isAuthPage = children?.toString().includes('AuthForm') ?? false;

  return (
    <html lang="en">
      <body>
        {!isAuthPage && <Navigation />}
        {children}
      </body>
    </html>
  );
}
