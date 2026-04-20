import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

export default function EventDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { t, lang } = useLang();
  const d = t.eventDetails;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => {
        setMessage(d.loadError);
        setLoading(false);
      });
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      setMessage(d.loginRedirectMsg);
      return router.push('/login');
    }

    setBookingLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: id, user_id: user.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(d.successMsg);
        setTimeout(() => router.push('/my-tickets'), 2000);
      } else {
        setMessage(data.message || d.bookingError);
      }
    } catch (err) {
      setMessage(d.networkError);
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-primary">
      {d.loading}
    </div>
  );

  if (!event || message.includes(d.notFound)) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-destructive">
      {d.notFound}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Head>
        <title>{event.title} | SmartEvent</title>
      </Head>
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-64 md:h-96 bg-muted rounded-radius-4xl mb-8 flex items-center justify-center text-8xl">
          {event.category === 'Technologie' ? '💻' : event.category === 'Musique' ? '🎵' : '📅'}
        </div>

        <div className="grid md:grid-cols-3 gap-12">

          <div className="md:col-span-2">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">
                {event.category}
              </span>
              <span className="text-muted-foreground text-sm italic">
                {d.organizedBy} <span className="text-foreground font-bold">{event.organizer_name}</span>
              </span>
            </div>

            <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">{d.about}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
              {event.description}
            </p>

            <div className="p-6 bg-card rounded-radius-2xl border border-border">
              <h3 className="font-bold mb-2">{d.location}</h3>
              <p className="text-muted-foreground">{event.location}</p>
              <p className="text-xs mt-2 text-muted-foreground italic">
                {d.dateTime} {formatDateTime(event.start_date)}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-24 p-8 bg-card border border-border rounded-radius-4xl shadow-2xl text-center">
              <p className="text-sm text-muted-foreground uppercase font-bold mb-2">{d.entryFee}</p>
              <p className="text-4xl font-black mb-6">
                {parseFloat(event.price) === 0 ? d.free : `${event.price}€`}
              </p>

              {user ? (
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading || event.capacity <= 0}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-radius-2xl font-bold hover:opacity-90 transition shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                >
                  {bookingLoading ? d.processing : event.capacity > 0 ? d.reserve : d.soldOut}
                </button>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-destructive/80 italic font-bold">
                    {d.loginRequired}
                  </p>
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full bg-secondary text-foreground py-4 rounded-radius-2xl font-bold hover:bg-border transition active:scale-95"
                  >
                    {d.loginBtn}
                  </button>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border space-y-3">
                  {message && (
                    <p className={`text-center text-sm font-bold p-2 rounded ${
                      message === d.successMsg 
                        ? 'text-green-600 bg-green-50 border border-green-200' 
                        : 'text-destructive bg-destructive/10'          
                    }`}>
                      {message}
                    </p>
                  )}
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{d.spotsLeft}</span>
                  <span className="font-bold text-primary">{event.capacity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}