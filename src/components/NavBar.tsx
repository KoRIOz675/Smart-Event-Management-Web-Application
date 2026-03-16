import React, { useState } from 'react';
import Link from 'next/link';
import { THEME_OPTIONS, useTheme } from '@/components/theme-provider';
import { useAuth } from '@/context/AuthContext'; 

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, mounted, setTheme } = useTheme();
  const { user, logout } = useAuth(); 

  const handleThemeChange = (value: string) => {
    const selectedTheme = THEME_OPTIONS.find((option) => option.value === value)?.value;
    if (selectedTheme) {
      setTheme(selectedTheme);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-foreground">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-radius-xl bg-primary shadow-lg shadow-primary/20 transition group-hover:scale-105">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight">SmartEvent</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-primary transition">Parcourir</Link>
            <Link href="/organizers" className="text-sm font-medium text-muted-foreground hover:text-primary transition">Organisateurs</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="theme-selector-desktop">
              Theme
            </label>
            <select
              id="theme-selector-desktop"
              value={theme}
              disabled={!mounted}
              onChange={(event) => handleThemeChange(event.target.value)}
              className="rounded-radius-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
            >
              {THEME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-border">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-foreground leading-none">{user.full_name}</span>
                  <span className="text-[10px] text-primary uppercase font-black tracking-tighter">{user.role}</span>
                </div>
                <button 
                  onClick={logout}
                  className="px-4 py-2 rounded-radius-lg border border-destructive/20 text-destructive text-xs font-bold hover:bg-destructive hover:text-white transition-all"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium hover:text-primary transition">Connexion</Link>
                <Link href="/register" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition">
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground">
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border p-4 space-y-4 animate-in slide-in-from-top-2">
          {user && (
            <div className="p-4 bg-secondary rounded-radius-xl text-center mb-4">
              <p className="font-bold text-foreground">{user.full_name}</p>
              <p className="text-xs text-primary uppercase font-black">{user.role}</p>
            </div>
          )}
          <Link href="/explore" className="block text-foreground font-medium py-2">Parcourir</Link>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="theme-selector-mobile">
              Theme
            </label>
            <select
              id="theme-selector-mobile"
              value={theme}
              disabled={!mounted}
              onChange={(event) => handleThemeChange(event.target.value)}
              className="w-full rounded-radius-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
            >
              {THEME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="pt-4 border-t border-border flex flex-col gap-3">
             {user ? (
               <button onClick={logout} className="w-full bg-destructive text-white py-3 rounded-radius-xl font-bold">Déconnexion</button>
             ) : (
               <>
                <Link href="/login" className="w-full border border-border py-3 rounded-radius-xl text-center font-medium">Connexion</Link>
                <Link href="/register" className="w-full bg-primary text-primary-foreground py-3 rounded-radius-xl text-center font-bold shadow-lg">S&apos;inscrire</Link>
               </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;