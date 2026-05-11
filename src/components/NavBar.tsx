import React, { useState } from 'react';
import Link from 'next/link';
import { THEME_OPTIONS, useTheme } from '@/components/theme-provider';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, mounted, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const { lang, toggleLang, t } = useLang();

    const handleThemeChange = (value: string) => {
        const selectedTheme = THEME_OPTIONS.find((option) => option.value === value)?.value;
        if (selectedTheme) {
            setTheme(selectedTheme);
        }
    };

    const userName = user?.fullName || user?.full_name || 'User';
    const userInitial = userName.charAt(0);

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
                        <Link href="/explore" className="block text-foreground font-medium py-2">{t.browse}</Link>
                        {user?.role === 'organizer' && (
                            <Link href="/organizers" className="block text-foreground font-medium py-2">{t.organizers}</Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link href="/organizers" className="block text-foreground font-medium py-2">{t.organizers}</Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link href="/admin" className="block font-medium py-2" style={{ color: '#ef4444' }}>{t.admin}</Link>
                        )}
                        <Link href="/profile" className="block text-foreground font-medium py-2">{t.myTickets}</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {/*
                        <label className="text-xs font-semibold text-muted-foreground" htmlFor="theme-selector-desktop">
                            {t.theme}
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
                        </select>*/}

                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-border">
                                {/* Clickable Profile Avatar using the corrected variable */}
                                <Link
                                    href="/profile"
                                    className="w-10 h-10 bg-primary rounded-radius-xl flex items-center justify-center text-xl font-black text-primary-foreground shadow-md rotate-3 hover:rotate-6 hover:scale-105 transition-all"
                                    title="Go to Profile"
                                >
                                    {userInitial}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 rounded-radius-lg border border-destructive/20 text-destructive text-xs font-bold hover:bg-destructive hover:text-white transition-all"
                                >
                                    {t.signOut}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-sm font-medium hover:text-primary transition">{t.logIn}</Link>
                                <Link href="/register" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition">
                                    {t.signUp}
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleLang}
                            className="flex items-center gap-1 px-2 py-1 rounded-radius-lg border border-border text-xs font-bold hover:bg-secondary transition"
                        >
                            <span>{lang === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
                            <span>{lang.toUpperCase()}</span>
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground">
                            {isOpen ? "✕" : "☰"}
                        </button>
                    </div>

                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-background border-b border-border p-4 space-y-4 animate-in slide-in-from-top-2">
                    {user && (
                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-4 p-4 bg-secondary rounded-radius-xl mb-4 group cursor-pointer hover:bg-secondary/80 transition"
                        >
                            {/* Mobile Profile Block with Avatar */}
                            <div className="w-12 h-12 bg-primary rounded-radius-xl flex items-center justify-center text-xl font-black text-primary-foreground shadow-md rotate-3 group-hover:rotate-6 transition-all">
                                {userInitial}
                            </div>
                            <div className="flex flex-col text-left">
                                <p className="font-bold text-foreground">{userName}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">View Profile</p>
                            </div>
                        </Link>
                    )}

                    <Link href="/explore" className="block text-foreground font-medium py-2">{t.browse}</Link>
                    <Link href="/organizers" className="block text-foreground font-medium py-2">{t.organizers}</Link>
                    <Link href="/profile" className="block text-foreground font-medium py-2">{t.myTickets}</Link>

                    <div className="pt-4 border-t border-border flex flex-col gap-3">
                        {user ? (
                            <button onClick={logout} className="w-full bg-destructive text-white py-3 rounded-radius-xl font-bold">
                                {t.signOut}
                            </button>
                        ) : (
                            <>
                                <Link href="/login" className="w-full border border-border py-3 rounded-radius-xl text-center font-medium">{t.logIn}</Link>
                                <Link href="/register" className="w-full bg-primary text-primary-foreground py-3 rounded-radius-xl text-center font-bold shadow-lg">{t.signUp}</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;