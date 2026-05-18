import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { THEME_OPTIONS, useTheme } from '@/components/theme-provider';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

type Notification = {
    id: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};

const NavBar = () => {
    // ... (Keep all your existing state and setup code) ...
    const [isOpen, setIsOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const { theme, mounted, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const { lang, toggleLang, t } = useLang();
    const notificationRef = useRef<HTMLDivElement>(null);

    const userName = user?.fullName || user?.full_name || 'User';
    const userInitial = userName.charAt(0);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Fetch Notifications with Auto-Refresh (Polling)
    useEffect(() => {
        if (!user?.id) return;

        // Külön függvénybe tesszük a lekérdezést
        const fetchNotifications = () => {
            fetch(`/api/notifications?userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setNotifications(data);
                    }
                })
                .catch(err => console.error("Hiba az értesítések lekérésekor:", err));
        };

        // 1. Azonnali lekérdezés az oldal betöltésekor
        fetchNotifications();

        // 2. Automatikus frissítés 10 másodpercenként (10000 ms)
        const intervalId = setInterval(fetchNotifications, 10000);

        // 3. Takarítás, ha a komponens eltűnik, vagy a felhasználó kilép
        return () => clearInterval(intervalId);
    }, [user]);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        await fetch('/api/notifications/mark-read', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notificationId: id })
        });
    };

    const translateNotification = (rawMessage: string) => {
        try {
            // Attempt to parse the message as JSON
            const data = JSON.parse(rawMessage);

            if (data.type === 'BOOKING_CONFIRMED') {
                return t.notifBookingConfirmed;
            }
            if (data.type === 'EVENT_UPDATED') {
                // Replace the placeholder {{title}} with the actual event title
                return t.notifEventUpdated.replace('{{title}}', data.eventTitle);
            }
            return rawMessage; // Fallback if type isn't recognized
        } catch (e) {
            // If it's not JSON (e.g., an old hardcoded notification), return it as-is
            return rawMessage;
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
                        <Link href="/explore" className="block text-foreground font-medium py-2">{t.browse}</Link>
                        {user?.role === 'organizer' && (
                            <Link href="/organizers" className="block text-foreground font-medium py-2">{t.organizers}</Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link href="/admin" className="block font-medium py-2" style={{ color: '#ef4444' }}>{t.admin}</Link>
                        )}
                        <Link href="/profile" className="block text-foreground font-medium py-2">{t.myTickets}</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-border">

                                {/* Notification Bell */}
                                <div className="relative" ref={notificationRef}>
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-2 rounded-full hover:bg-secondary transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Notifications Dropdown */}
                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-2">
                                            <div className="p-3 border-b border-border font-bold">
                                                {t.notificationsTitle || 'Notifications'}
                                            </div>
                                            <div className="max-h-64 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="p-4 text-sm text-muted-foreground text-center">
                                                        {t.noNotifications || 'No new notifications'}
                                                    </div>
                                                ) : (
                                                    notifications.map(notification => (
                                                        <div
                                                            key={notification.id}
                                                            onClick={() => !notification.isRead && markAsRead(notification.id)}
                                                            className={`p-3 text-sm border-b border-border cursor-pointer transition ${notification.isRead ? 'opacity-60 bg-background' : 'bg-secondary/50 font-medium'}`}
                                                        >
                                                            {/* ✨ USE THE HELPER FUNCTION HERE */}
                                                            <p className="text-foreground">{translateNotification(notification.message)}</p>

                                                            <span className="text-xs text-muted-foreground mt-1 block">
                                        {new Date(notification.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
                                    </span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href="/profile"
                                    className="w-10 h-10 bg-primary rounded-radius-xl flex items-center justify-center text-xl font-black text-primary-foreground shadow-md rotate-3 hover:rotate-6 hover:scale-105 transition-all overflow-hidden"
                                >
                                    {user?.imageUrl ? (
                                        <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover -rotate-3" />
                                    ) : (
                                        userInitial
                                    )}
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
                    {/* ... Mobile Menu ... */}
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

            {/* Mobile Dropdown content kept same as your original, just optionally append the notification list inside the mobile menu if needed */}
        </nav>
    );
};

export default NavBar;