import React, { useEffect, useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const { t, lang } = useLang();
    const [tickets, setTickets] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);

    const m = t.ticketsPage;

    useEffect(() => {
        if (user?.id) {
            fetch(`/api/bookings/user?userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setTickets(Array.isArray(data) ? data : []);
                    setFetching(false);
                })
                .catch(() => setFetching(false));
        }
    }, [user]);

    // --- Fun Stats Logic ---
    const stats = useMemo(() => {
        if (!tickets.length) return null;

        const cities = tickets.map(t => t.location.split(',')[0].trim());
        const favoriteCity = [...new Set(cities)].sort((a,b) =>
            cities.filter(v => v===b).length - cities.filter(v => v===a).length
        )[0];

        // Rank now pulls dynamically from the translation context
        return {
            total: tickets.length,
            favoriteCity,
            rank: tickets.length > 10 ? m.legend : tickets.length > 5 ? m.explorer : m.newcomer
        };
    }, [tickets, m]);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse uppercase tracking-widest">{m.loading}</div>;
    if (!user) return <div className="min-h-screen flex items-center justify-center font-bold">{m.loginRequired}</div>;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Head><title>Profile | {user.fullName}</title></Head>
            <NavBar />

            <main className="max-w-6xl mx-auto px-4 py-12">

                {/* 1. Header & Fun Stats Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

                    {/* User Basic Info */}
                    <div className="w-24 h-24 bg-primary rounded-radius-3xl flex items-center justify-center text-3xl font-black text-primary-foreground mb-4 shadow-xl rotate-3 overflow-hidden">
                        {user.imageUrl ? (
                            <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover -rotate-3" />
                        ) : (
                            user.fullName?.charAt(0)
                        )}
                    </div>

                    {/* Fun Stats Cards */}
                    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-primary/5 border border-primary/10 p-6 rounded-radius-3xl flex flex-col justify-center">
                            <span className="text-[10px] font-black uppercase text-primary mb-1">{m.status}</span>
                            <span className="text-2xl font-black tracking-tighter">{stats?.rank ?? '...'}</span>
                        </div>
                        <div className="bg-card border border-border p-6 rounded-radius-3xl flex flex-col justify-center">
                            <span className="text-[10px] font-black uppercase text-muted-foreground mb-1">{m.totalEvents}</span>
                            <span className="text-2xl font-black tracking-tighter">{stats?.total ?? 0}</span>
                        </div>
                        <div className="bg-card border border-border p-6 rounded-radius-3xl flex flex-col justify-center col-span-2 md:col-span-1">
                            <span className="text-[10px] font-black uppercase text-muted-foreground mb-1">{m.favoriteSpot}</span>
                            <span className="text-2xl font-black tracking-tighter truncate">{stats?.favoriteCity ?? m.na}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Tickets List Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <h2 className="text-xl font-black uppercase tracking-tighter">{m.pageTitle}</h2>
                        <Link href="/explore" className="text-xs font-bold text-primary hover:underline">{m.findMore}</Link>
                    </div>

                    <div className="grid gap-3">
                        {fetching ? (
                            <div className="h-20 bg-muted animate-pulse rounded-radius-2xl" />
                        ) : tickets.length > 0 ? (
                            tickets.map((ticket: any) => (
                                <div
                                    key={ticket.id}
                                    className="group bg-card border border-border p-4 md:px-8 rounded-radius-2xl flex flex-col md:flex-row md:items-center justify-between hover:border-primary/50 transition-all gap-4"
                                >
                                    <div className="flex flex-1 items-center gap-4 overflow-hidden">
                                        <span className="font-bold text-lg shrink-0 whitespace-nowrap text-foreground group-hover:text-primary transition-colors">
                                            {ticket.event_title}
                                        </span>
                                        <span className="hidden md:inline text-muted-foreground/30">—</span>
                                        <span className="text-sm text-muted-foreground italic truncate flex-1 min-w-[100px]">
                                            {ticket.ticket_type} • {ticket.status}
                                        </span>
                                        <span className="hidden md:inline text-muted-foreground/30">—</span>
                                        <span className="text-sm text-muted-foreground flex items-center gap-1 shrink-0">
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {ticket.location}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                                        <div className="text-left md:text-right">
                                            <p className="text-sm font-black">
                                                {new Date(ticket.start_date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
                                            </p>
                                            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">
                                                ID: {ticket.id.slice(0, 8)}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/events/${ticket.event_id}`}
                                            className="bg-foreground text-background p-2.5 rounded-radius-xl hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-muted/5 rounded-radius-4xl border border-dashed border-border text-muted-foreground italic">
                                {m.noBookings}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}