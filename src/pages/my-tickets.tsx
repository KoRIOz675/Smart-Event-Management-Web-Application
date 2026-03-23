import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function MyTickets() {
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/bookings/user?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setTickets(data));
    }
  }, [user]);

  if (authLoading) return <div className="p-20 text-center">Chargement...</div>;
  if (!user) return <div className="p-20 text-center">Veuillez vous connecter.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black mb-8">Mes Billets 🎟️</h1>
        
        <div className="space-y-6">
          {tickets.length > 0 ? tickets.map((t: any) => (
            <div key={t.id} className="bg-card border-l-8 border-l-primary border border-border p-6 rounded-radius-2xl flex justify-between items-center shadow-sm">
              <div>
                <h3 className="text-xl font-bold">{t.event_title}</h3>
                <p className="text-muted-foreground text-sm">{new Date(t.start_date).toLocaleDateString()}</p>
                <span className="text-[10px] bg-secondary px-2 py-1 rounded mt-2 inline-block font-bold uppercase text-primary">
                  {t.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-bold">Lieu</p>
                <p className="font-medium">{t.location}</p>
              </div>
            </div>
          )) : (
            <p className="text-muted-foreground italic">Vous n'avez pas encore de réservations.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}