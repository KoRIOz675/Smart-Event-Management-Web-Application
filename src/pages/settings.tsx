import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { THEME_OPTIONS, useTheme } from '@/components/theme-provider';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function SettingsPage() {
    const { user, loading: authLoading, updateUser } = useAuth();
    const { lang, toggleLang, t } = useLang();
    const { theme, mounted, setTheme } = useTheme();

    // Local state for UI tabs and mock toggles
    const [activeTab, setActiveTab] = useState('preferences');
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        marketing: false,
        ticketUpdates: true,
    });

    // Push notification state
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isPushLoading, setIsPushLoading] = useState(false);
    // Avatar upload state
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.imageUrl || null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        setUploading(true);

        const ext = file.name.split('.').pop();
        const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(file);
        });

        const res = await fetch('/api/user/upload-avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, base64, ext }),
        });

        if (res.ok) {
            const { imageUrl } = await res.json();
            // 👇 Force the browser to bypass the cache by adding a timestamp
            const cacheBustedUrl = `${imageUrl}?t=${Date.now()}`;

            setAvatarUrl(cacheBustedUrl);
            updateUser({ imageUrl: cacheBustedUrl });
        }
        setUploading(false);
    };

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register('/sw.js').then(swReg => {
                swReg.pushManager.getSubscription().then(sub => {
                    if (sub) setIsSubscribed(true);
                });
            });
        }
    }, []);

    const handleThemeChange = (value: string) => {
        const selectedTheme = THEME_OPTIONS.find((option) => option.value === value)?.value;
        if (selectedTheme) setTheme(selectedTheme);
    };

    const subscribeUser = async () => {
        if (!user) return alert(t.loginRequired || 'Please log in!');
        setIsPushLoading(true);

        try {
            const swRegistration = await navigator.serviceWorker.ready;

            const subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
            });

            const res = await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, subscription })
            });

            if (res.ok) {
                setIsSubscribed(true);
                alert(t.pushSubSuccess || 'successful!');
            }
        } catch (error) {
            console.error('error:', error);
            alert(t.pushSubError || 'unsuccessful, check browser settings.');
        } finally {
            setIsPushLoading(false);
        }
    };


    if (authLoading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse uppercase tracking-widest">{t.ticketsPage?.loading || 'Loading...'}</div>;
    if (!user) return <div className="min-h-screen flex items-center justify-center font-bold">{t.ticketsPage?.loginRequired || 'Please log in.'}</div>;

    const userName = user?.fullName || user?.full_name || 'User';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Head><title>Settings | SmartEvent</title></Head>
            <NavBar />

            <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Settings</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your account preferences and configurations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="col-span-1 space-y-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full text-left px-4 py-3 rounded-radius-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                        >
                            Profile Details
                        </button>
                        <button
                            onClick={() => setActiveTab('preferences')}
                            className={`w-full text-left px-4 py-3 rounded-radius-xl font-bold transition-all ${activeTab === 'preferences' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                        >
                            Preferences
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full text-left px-4 py-3 rounded-radius-xl font-bold transition-all ${activeTab === 'notifications' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                        >
                            Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full text-left px-4 py-3 rounded-radius-xl font-bold transition-all ${activeTab === 'security' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                        >
                            Security
                        </button>
                    </aside>

                    {/* Main Content Area */}
                    <div className="col-span-1 md:col-span-3 bg-card border border-border rounded-radius-3xl p-6 md:p-10 shadow-sm">

                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <h2 className="text-xl font-black uppercase tracking-tight border-b border-border pb-4">Profile Details</h2>

                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-radius-2xl overflow-hidden shadow-md rotate-3 bg-primary">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-black text-primary-foreground">
                                                {userInitial}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-radius-lg text-xs font-bold hover:bg-primary hover:text-primary-foreground transition disabled:opacity-50"
                                        >
                                            {uploading ? 'Uploading...' : 'Change Avatar'}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Full Name</label>
                                        <input type="text" defaultValue={userName} className="w-full bg-background border border-border rounded-radius-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
                                        <input type="email" defaultValue={user.email} disabled className="w-full bg-muted/50 border border-border rounded-radius-lg px-4 py-3 text-sm text-muted-foreground cursor-not-allowed" />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border flex justify-end">
                                    <button className="bg-foreground text-background px-6 py-3 rounded-radius-xl text-sm font-bold shadow-md hover:bg-primary hover:text-primary-foreground transition">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* PREFERENCES TAB */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <h2 className="text-xl font-black uppercase tracking-tight border-b border-border pb-4">App Preferences</h2>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-radius-xl border border-border hover:border-primary/50 transition">
                                    <div>
                                        <h3 className="font-bold">Display Language</h3>
                                        <p className="text-sm text-muted-foreground">Select your preferred language for the interface.</p>
                                    </div>
                                    <button
                                        onClick={toggleLang}
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-radius-lg border border-border bg-background font-bold hover:bg-secondary transition min-w-[120px]"
                                    >
                                        <span className="text-lg">{lang === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
                                        <span>{lang === 'fr' ? 'Français' : 'English'}</span>
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-radius-xl border border-border hover:border-primary/50 transition">
                                    <div>
                                        <h3 className="font-bold">Application Theme</h3>
                                        <p className="text-sm text-muted-foreground">Customize the visual appearance of SmartEvent.</p>
                                    </div>
                                    <select
                                        value={mounted ? theme : 'system'}
                                        onChange={(e) => handleThemeChange(e.target.value)}
                                        className="px-4 py-3 rounded-radius-lg border border-border bg-background font-bold text-foreground focus:outline-none focus:border-primary transition min-w-[120px]"
                                    >
                                        {THEME_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <h2 className="text-xl font-black uppercase tracking-tight border-b border-border pb-4">Notification Settings</h2>

                                {/* notifications ALERTS */}
                                <div className="p-6 bg-secondary/30 rounded-radius-2xl border border-primary/20">
                                    <h3 className="font-black text-lg mb-2">{t.pushSubTitle || 'Push Notifications'}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        {t.pushSubDesc || 'Receive instant notifications for successful bookings and event updates directly on your device!'}
                                    </p>

                                    <button
                                        onClick={subscribeUser}
                                        disabled={isSubscribed || isPushLoading}
                                        className={`px-6 py-3 rounded-radius-xl text-sm font-bold shadow-md transition-all ${
                                            isSubscribed
                                                ? 'bg-emerald-500/10 text-emerald-600 cursor-not-allowed border border-emerald-500/20'
                                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                        }`}
                                    >
                                        {isPushLoading
                                            ? (t.pushSubBtnLoading || 'Processing...')
                                            : isSubscribed
                                                ? (t.pushSubBtnDone || 'Notifications Enabled ✓')
                                                : (t.pushSubBtn || 'Subscribe to Push 🔔')
                                        }
                                    </button>
                                </div>

                                {/* EMAIL ALERTS */}
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 rounded-radius-xl border border-border cursor-pointer hover:bg-secondary/50 transition">
                                        <div>
                                            <h3 className="font-bold text-sm">Ticket Updates</h3>
                                            <p className="text-xs text-muted-foreground">Receive emails when your ticket status changes.</p>
                                        </div>
                                        <input type="checkbox" checked={notifications.ticketUpdates} onChange={(e) => setNotifications({...notifications, ticketUpdates: e.target.checked})} className="w-5 h-5 accent-primary cursor-pointer"/>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <h2 className="text-xl font-black uppercase tracking-tight border-b border-border pb-4">Security & Account</h2>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full md:w-1/2 bg-background border border-border rounded-radius-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition block" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">New Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full md:w-1/2 bg-background border border-border rounded-radius-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition block" />
                                    </div>
                                    <button className="bg-foreground text-background px-6 py-3 rounded-radius-xl text-sm font-bold shadow-md hover:bg-primary hover:text-primary-foreground transition mt-4">
                                        Update Password
                                    </button>
                                </div>

                                <div className="pt-8 mt-8 border-t border-border">
                                    <h3 className="text-destructive font-black uppercase mb-2">Danger Zone</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                    <button className="px-6 py-3 rounded-radius-xl border border-destructive/20 text-destructive text-sm font-bold hover:bg-destructive hover:text-white transition">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}