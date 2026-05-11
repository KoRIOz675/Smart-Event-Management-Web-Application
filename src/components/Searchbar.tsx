import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type Event = {
    id: string;
    title: string;       // Changed from name to title
    description: string; // Added description
    location: string;
    start_date: string;  // Changed from startDate to start_date
    price: number | string;
};

type Props = {
    t: Record<string, any>;
};

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export function SearchBar({ t }: Props) {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [results, setResults] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const debouncedName = useDebounce(name, 400);
    const debouncedLocation = useDebounce(location, 400);
    const debouncedDate = useDebounce(date, 400);

    const fetchEvents = useCallback(async () => {
        const isEmpty = !debouncedName.trim() && !debouncedLocation.trim() && !debouncedDate;

        if (isEmpty) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        const params = new URLSearchParams();
        if (debouncedName.trim()) params.set('name', debouncedName.trim());
        if (debouncedLocation.trim()) params.set('location', debouncedLocation.trim());
        if (debouncedDate) params.set('date', debouncedDate);

        setLoading(true);
        try {
            const res = await fetch(`/api/events?${params.toString()}`);
            const data = await res.json();

            if (res.ok && Array.isArray(data)) {
                setResults(data);
                setHasSearched(true);
            } else {
                setResults([]);
            }
        } catch (err) {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [debouncedName, debouncedLocation, debouncedDate]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return (
        <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-20">
            {/* Search Inputs */}
            <div className="bg-card p-3 rounded-radius-4xl shadow-2xl border border-border flex flex-col md:flex-row gap-2">
                <div className="flex-1 p-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1">{t.searchEvent}</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.searchEventPlaceholder} className="bg-transparent text-foreground font-semibold focus:outline-none placeholder:text-muted-foreground/50" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1">{t.searchWhere}</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t.searchWherePlaceholder} className="bg-transparent text-foreground font-semibold focus:outline-none placeholder:text-muted-foreground/50" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1">{t.searchWhen}</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-foreground font-semibold focus:outline-none" />
                </div>
                <button className="bg-primary text-primary-foreground px-8 py-4 rounded-radius-2xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
                    {t.searchBtn}
                </button>
            </div>

            {/* Results Dropdown */}
            {(loading || hasSearched) && (
                <div className="mt-4 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                    {loading ? (
                        <div className="p-6 text-center text-muted-foreground text-sm">{t.searching ?? 'Searching...'}</div>
                    ) : results.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground text-sm">{t.noResults ?? 'No events found.'}</div>
                    ) : (
                        <ul className="divide-y divide-border">
                            {results.map((event) => (
                                <li key={event.id}>
                                    <Link href={`/events/${event.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition group">

                                        {/* Name --- Description --- Location */}
                                        <div className="flex flex-1 items-center gap-3 overflow-hidden mr-4 text-sm">
                                            <span className="font-bold text-foreground shrink-0">{event.title}</span>
                                            <span className="text-muted-foreground/30 hidden md:inline">—</span>
                                            <span className="text-muted-foreground italic truncate hidden sm:inline">
                                                {event.description}
                                            </span>
                                            <span className="text-muted-foreground/30 hidden md:inline">—</span>
                                            <span className="text-muted-foreground shrink-0 flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                {event.location}
                                            </span>
                                        </div>

                                        {/* Price & Date */}
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-primary">
                                                {parseFloat(event.price as string) > 0 ? `${event.price}€` : (t.free ?? 'Free')}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-medium">
                                                {new Date(event.start_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}