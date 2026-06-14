import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

interface EventStat {
    id: string;
    title: string;
    startDate: string;
    category: string;
    registrations: number;
    originalCapacity: number;
    revenue: number;
    avgRating: string | null;
    feedbackCount: number;
}

interface Summary {
    totalEvents: number;
    totalRegistrations: number;
    totalRevenue: string;
    overallAvgRating: string | null;
}

export default function AnalyticsDashboard() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { t, lang } = useLang();
    const a = (t as any).analyticsPage;

    const [summary, setSummary] = useState<Summary | null>(null);
    const [eventStats, setEventStats] = useState<EventStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user || (user.role !== 'organizer' && user.role !== 'admin')) {
            router.push('/');
            return;
        }
        fetch(`/api/analytics/organizer?organizerId=${user.id}`)
            .then(res => res.json())
            .then(data => {
                setSummary(data.summary);
                setEventStats(data.events ?? []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user, authLoading, router]);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
        });

    const fillPct = (e: EventStat) =>
        e.originalCapacity > 0 ? Math.round((e.registrations / e.originalCapacity) * 100) : 0;

    if (authLoading || !user) return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-background text-slate-900 dark:text-foreground">
            <Head><title>{a?.pageTitle || 'Analytics | SmartEvent'}</title></Head>
            <NavBar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <header className="mb-10">
                    <h1 className="text-4xl font-black tracking-tight">{a?.title || 'Analytics'}</h1>
                    <p className="text-slate-500 dark:text-muted-foreground mt-1 font-medium">
                        {a?.subtitle || 'Performance overview for your events.'}
                    </p>
                </header>

                {/* Summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    <StatCard
                        label={a?.totalEvents || 'Total Events'}
                        value={summary?.totalEvents ?? '—'}
                        icon="📅"
                        color="text-violet-600"
                        bg="bg-violet-100"
                        loading={loading}
                    />
                    <StatCard
                        label={a?.totalRegistrations || 'Registrations'}
                        value={summary?.totalRegistrations ?? '—'}
                        icon="🎟️"
                        color="text-emerald-600"
                        bg="bg-emerald-100"
                        loading={loading}
                    />
                    <StatCard
                        label={a?.totalRevenue || 'Revenue'}
                        value={summary ? `${parseFloat(summary.totalRevenue).toFixed(2)} €` : '—'}
                        icon="💶"
                        color="text-blue-600"
                        bg="bg-blue-100"
                        loading={loading}
                    />
                    <StatCard
                        label={a?.avgRating || 'Avg Rating'}
                        value={summary?.overallAvgRating ? `${summary.overallAvgRating} ★` : '—'}
                        icon="⭐"
                        color="text-amber-600"
                        bg="bg-amber-100"
                        loading={loading}
                    />
                </div>

                {/* Per-event table */}
                <div className="bg-white dark:bg-card rounded-3xl border border-slate-200 dark:border-border shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-64 text-slate-400 font-medium italic animate-pulse">
                            Chargement...
                        </div>
                    ) : eventStats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                            <span className="text-5xl">📊</span>
                            <p className="font-bold text-slate-500">{a?.noEvents || "You haven't created any events yet."}</p>
                            <button
                                onClick={() => router.push('/organizers')}
                                className="text-sm font-bold text-primary hover:underline"
                            >
                                {a?.createFirst || 'Create your first event →'}
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-secondary/30 text-slate-400 dark:text-muted-foreground text-[10px] uppercase tracking-widest font-black">
                                        <th className="px-6 py-5">{a?.tableEvent || 'Event'}</th>
                                        <th className="px-6 py-5">{a?.tableRegistrations || 'Registrations'}</th>
                                        <th className="px-6 py-5">{a?.tableRevenue || 'Revenue'}</th>
                                        <th className="px-6 py-5">{a?.tableRating || 'Rating'}</th>
                                        <th className="px-6 py-5 text-right">{a?.tableActions || 'Actions'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-border">
                                    {eventStats.map(ev => (
                                        <tr key={ev.id} className="hover:bg-slate-50/70 dark:hover:bg-secondary/20 transition-colors">
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="font-bold text-slate-800 dark:text-foreground truncate">{ev.title}</div>
                                                <div className="text-xs text-slate-400 dark:text-muted-foreground mt-0.5">
                                                    {formatDate(ev.startDate)}
                                                    <span className="ml-2 uppercase font-black text-[10px] text-primary">{ev.category}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold mb-1.5">
                                                    {ev.registrations}
                                                    <span className="text-slate-400 dark:text-muted-foreground font-normal"> / {ev.originalCapacity}</span>
                                                </div>
                                                <div className="w-32 h-1.5 bg-slate-100 dark:bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${fillPct(ev) >= 90 ? 'bg-red-500' : fillPct(ev) >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${fillPct(ev)}%` }}
                                                    />
                                                </div>
                                                <div className="text-[10px] text-slate-400 dark:text-muted-foreground mt-1">{fillPct(ev)}%</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-slate-800 dark:text-foreground">
                                                    {ev.revenue > 0 ? `${ev.revenue.toFixed(2)} €` : (a?.free || 'Free')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {ev.avgRating ? (
                                                    <div>
                                                        <span className="font-bold text-amber-500">{ev.avgRating} ★</span>
                                                        <span className="text-xs text-slate-400 dark:text-muted-foreground ml-1">
                                                            ({ev.feedbackCount})
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 dark:text-muted-foreground italic">
                                                        {a?.noRating || 'No reviews'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => router.push(`/admin/edit-event/${ev.id}`)}
                                                    className="px-4 py-1.5 text-xs font-bold bg-slate-100 dark:bg-secondary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all"
                                                >
                                                    {a?.edit || 'Edit'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

function StatCard({ label, value, icon, color, bg, loading }: {
    label: string; value: string | number; icon: string;
    color: string; bg: string; loading: boolean;
}) {
    return (
        <div className="bg-white dark:bg-card p-6 rounded-3xl border border-slate-200 dark:border-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${bg} ${color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-slate-400 dark:text-muted-foreground text-[10px] font-black uppercase tracking-wider truncate">{label}</p>
                <p className={`text-2xl font-black mt-0.5 ${loading ? 'animate-pulse text-slate-300' : 'text-slate-900 dark:text-foreground'}`}>
                    {loading ? '...' : value}
                </p>
            </div>
        </div>
    );
}
