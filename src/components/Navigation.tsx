'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-primary">
                Habit Hero
              </Link>
            </div>

            {/* Main Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard')}`}
              >
                Dashboard
              </Link>
              <Link
                href="/habits"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/habits')}`}
              >
                Habits
              </Link>
              <Link
                href="/goals"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/goals')}`}
              >
                Goals
              </Link>
              <Link
                href="/character"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/character')}`}
              >
                Character
              </Link>
              <Link
                href="/friends"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/friends')}`}
              >
                Friends
              </Link>
            </div>
          </div>

          {/* Account Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link
              href="/account"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/account')}`}
            >
              Account
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard')}`}
          >
            Dashboard
          </Link>
          <Link
            href="/habits"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/habits')}`}
          >
            Habits
          </Link>
          <Link
            href="/goals"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/goals')}`}
          >
            Goals
          </Link>
          <Link
            href="/character"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/character')}`}
          >
            Character
          </Link>
          <Link
            href="/friends"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/friends')}`}
          >
            Friends
          </Link>
          <Link
            href="/account"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/account')}`}
          >
            Account
          </Link>
        </div>
      </div>
    </nav>
  );
}
