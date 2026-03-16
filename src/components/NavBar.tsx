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
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
 
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-radius-xl bg-primary shadow-lg shadow-primary/20 transition group-hover:scale-105">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">SmartEvent</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
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
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-secondary hover:text-primary"
            >
              <span className="flex h-5 w-5 items-center justify-center text-primary">
                {isDark ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v2.25m0 13.5V21m9-9h-2.25M5.25 12H3m15.114 6.364-1.591-1.591M7.477 7.477 5.886 5.886m12.228 0-1.591 1.591M7.477 16.523l-1.591 1.591M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
                  </svg>
                )}
              </span>
              <span className="hidden lg:inline">{themeButtonLabel}</span>
            </button>

            <Link href="/login" className="text-sm font-medium text-foreground transition hover:text-primary">
              Connexion
            </Link>

            <Link 
              href="/register" 
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 active:scale-95"
            >
              S&rsquo;inscrire
            </Link>
          </div>


          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary focus:outline-none p-2"
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
        <div className="animate-in slide-in-from-top-2 duration-200 md:hidden border-b border-border bg-background/95 backdrop-blur-md">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="block rounded-radius-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 border-t border-border pt-4 mt-2 text-foreground">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 rounded-radius-xl border border-border bg-secondary px-3 py-3 text-base font-medium transition hover:text-primary"
              >
                <span className="text-primary">{isDark ? "☀️" : "🌙"}</span>
                <span>{themeButtonLabel}</span>
              </button>
              
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Link 
                  href="/login" 
                  className="rounded-radius-xl border border-border bg-background py-3 text-center text-base font-medium hover:bg-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Connexion
                </Link>
                <Link 
                  href="/register" 
                  className="rounded-radius-xl bg-primary py-3 text-center text-base font-bold text-primary-foreground shadow-lg shadow-primary/20"
                  onClick={() => setIsOpen(false)}
                >
                  S&rsquo;inscrire
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;