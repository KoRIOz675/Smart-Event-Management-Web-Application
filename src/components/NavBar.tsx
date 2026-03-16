import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, mounted, toggleTheme } = useTheme();
  const isDark = mounted && theme === 'dark';
  const themeButtonLabel = mounted ? (isDark ? 'Mode clair' : 'Mode sombre') : 'Changer le thème';

  const navLinks = [
    { name: 'Parcourir', href: '/explore' },
    { name: 'Organisateurs', href: '/organizers' },
    { name: 'Tarifs', href: '/pricing' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md transition-colors dark:border-white/10 dark:bg-gray-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
 
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100 transition group-hover:scale-105 dark:shadow-indigo-950/40">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">SmartEvent</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={themeButtonLabel}
              aria-pressed={isDark}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
            >
              <span className="flex h-5 w-5 items-center justify-center text-indigo-600 dark:text-indigo-300">
                {isDark ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v2.25m0 13.5V21m9-9h-2.25M5.25 12H3m15.114 6.364-1.591-1.591M7.477 7.477 5.886 5.886m12.228 0-1.591 1.591M7.477 16.523l-1.591 1.591M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
                  </svg>
                )}
              </span>
              <span>{themeButtonLabel}</span>
            </button>
            <Link href="/login" className="text-sm font-medium text-gray-700 transition hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400">
              Connexion
            </Link>
            <Link 
              href="/register" 
              className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 dark:shadow-indigo-950/40"
            >
              S&rsquo;inscrire
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-indigo-600 focus:outline-none dark:text-gray-200 dark:hover:text-indigo-400"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="animate-in slide-in-from-top-2 duration-200 md:hidden border-b border-gray-100 bg-white fade-in dark:border-white/10 dark:bg-gray-950">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-white/5 dark:hover:text-indigo-400"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 border-t border-gray-50 pt-4 dark:border-white/10">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={themeButtonLabel}
                aria-pressed={isDark}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-base font-medium text-gray-700 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
              >
                <span className="flex h-5 w-5 items-center justify-center text-indigo-600 dark:text-indigo-300">
                  {isDark ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v2.25m0 13.5V21m9-9h-2.25M5.25 12H3m15.114 6.364-1.591-1.591M7.477 7.477 5.886 5.886m12.228 0-1.591 1.591M7.477 16.523l-1.591 1.591M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
                    </svg>
                  )}
                </span>
                <span>{themeButtonLabel}</span>
              </button>
              <Link 
                href="/login" 
                className="block rounded-lg px-3 py-2 text-center text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                onClick={() => setIsOpen(false)}
              >
                Connexion
              </Link>
              <Link 
                href="/register" 
                className="block w-full rounded-xl bg-indigo-600 px-3 py-3 text-center text-base font-bold text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-950/40"
                onClick={() => setIsOpen(false)}
              >
                S&rsquo;inscrire
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;