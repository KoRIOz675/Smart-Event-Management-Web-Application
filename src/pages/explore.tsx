import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  category: string;
  price: number | string;
  is_virtual: boolean;
}

export default function ExplorePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  useEffect(() => {
    const results = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(results);
  }, [searchTerm, events]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Head>
        <title>Explorer les événements | SmartEvent</title>
      </Head>

      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Explorez les <span className="text-primary">Expériences</span>
            </h1>
            <p className="text-muted-foreground text-lg italic">
              Découvrez des événements uniques adaptés à vos centres d'intérêt.
            </p>
          </div>
          <div className="w-full md:w-80 relative group">
            <input 
              type="text" 
              placeholder="Rechercher un événement..."
              className="w-full p-4 pl-12 rounded-radius-2xl bg-card border border-border focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 bg-muted/20 animate-pulse rounded-radius-4xl border border-border"></div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div 
                key={event.id} 
                className="group bg-card border border-border rounded-radius-4xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col"
              >
                <div className="h-52 bg-muted relative flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                   <span className="text-5xl opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                    {event.category === 'Technologie' ? '💻' : event.category === 'Musique' ? '🎵' : '📅'}
                   </span>
                   <div className="absolute top-4 left-4 flex gap-2">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${event.is_virtual ? 'bg-chart-2/80 text-white' : 'bg-primary/80 text-primary-foreground'}`}>
                       {event.is_virtual ? 'Virtuel' : 'Présentiel'}
                     </span>
                   </div>
                </div>
                

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-primary font-bold text-xs uppercase tracking-tighter">
                      {new Date(event.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} • {new Date(event.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{event.category}</span>
                  </div>

                  <h3 className="text-xl font-extrabold mb-3 leading-tight group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-6 italic">
                    {event.description}
                  </p>
                  
                  <div className="mt-auto pt-5 border-t border-border flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-black">Prix</span>
                      <span className="font-black text-lg">
                        {parseFloat(event.price as string) === 0 ? "Gratuit" : `${event.price}€`}
                      </span>
                    </div>
                    <button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-radius-xl text-xs font-black hover:bg-primary hover:text-primary-foreground transition-all shadow-sm active:scale-95">
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-card rounded-radius-4xl border border-dashed border-border">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold">Aucun événement trouvé</h3>
            <p className="text-muted-foreground">Essayez une autre recherche ou une autre catégorie.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}