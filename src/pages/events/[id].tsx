import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function EventDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
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
        setMessage("Erreur de chargement : Événement introuvable.");
        setLoading(false);
      });
  }, [id]);
  

  const handleBooking = async () => {
    if (!user) {
        setMessage("Veuillez vous connecter pour réserver.");
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
        setMessage(" Votre ticket est réservé. Redirection vers 'Mes Billets'...");
        setTimeout(() => router.push('/my-tickets'), 2000);
      } else {
        setMessage(data.message || "Erreur lors de la réservation.");
      }
    } catch (err) {
      setMessage("Erreur réseau lors de la tentative de réservation.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Chargement...</div>;
  if (!event || message.includes("Événement introuvable")) return <div className="min-h-screen bg-background flex items-center justify-center text-destructive">Événement introuvable</div>;

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
                Organisé par <span className="text-foreground font-bold">{event.organizer_name}</span>
              </span>
            </div>

            <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">À propos de cet événement</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
              {event.description}
            </p>

            <div className="p-6 bg-card rounded-radius-2xl border border-border">
              <h3 className="font-bold mb-2">📍 Lieu</h3>
              <p className="text-muted-foreground">{event.location}</p>
              <p className="text-xs mt-2 text-muted-foreground italic">
                Date et Heure : {new Date(event.start_date).toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-24 p-8 bg-card border border-border rounded-radius-4xl shadow-2xl text-center">
              <p className="text-sm text-muted-foreground uppercase font-bold mb-2">Tarif d'entrée</p>
              <p className="text-4xl font-black mb-6">
                {parseFloat(event.price) === 0 ? "Gratuit" : `${event.price}€`}
              </p>

              {user ? (
                <button 
                  onClick={handleBooking}
                  disabled={bookingLoading || event.capacity <= 0}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-radius-2xl font-bold hover:opacity-90 transition shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                >
                  {bookingLoading ? "Traitement..." : event.capacity > 0 ? "Réserver mon ticket" : "Complet"}
                </button>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-destructive/80 italic font-bold">
                    Vous devez être connecté pour réserver.
                  </p>
                  <button 
                    onClick={() => router.push('/login')}
                    className="w-full bg-secondary text-foreground py-4 rounded-radius-2xl font-bold hover:bg-border transition active:scale-95"
                  >
                    Se connecter
                  </button>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                {message && (
                  <p className={`text-center text-sm font-bold ${message.startsWith('✅') ? 'text-primary' : 'text-destructive'}`}>
                    {message}
                  </p>
                )}
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Places restantes :</span>
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