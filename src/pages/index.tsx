import React from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Head>
        <title>SmartEvent | Gestion d&apos;événements intelligente</title>
        <meta name="description" content="Plateforme complète pour planifier, gérer et participer à des événements." />
      </Head>
      
      <NavBar />

      <main>
        <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-muted-foreground text-xs font-bold mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Nouveau : Dashboard Organisateur v2.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1]">
              L'événementiel <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-chart-1">
                en mode intelligent.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Créez, gérez et vendez vos tickets en quelques clics. Que ce soit en présentiel, 
              en virtuel ou en hybride, SmartEvent s&apos;occupe de tout.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-radius-2xl font-bold hover:opacity-90 transition shadow-xl hover:-translate-y-1">
                Lancer un événement
              </button>
              <button className="px-8 py-4 bg-background text-foreground border border-border rounded-radius-2xl font-bold hover:bg-secondary transition">
                Explorer les fonctions
              </button>
            </div>
          </div>
        </section>
        <section className="max-w-5xl mx-auto px-4 -mt-24 relative z-20">
          <div className="bg-card p-3 rounded-radius-4xl shadow-2xl border border-border flex flex-col md:flex-row gap-2">
            <div className="flex-1 p-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1">Événement</label>
              <input type="text" placeholder="Concert, Formation, Tech..." className="bg-transparent text-foreground font-semibold focus:outline-none placeholder:text-muted-foreground/50" />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1">Où ça ?</label>
              <input type="text" placeholder="Paris, Lyon ou Virtuel" className="bg-transparent text-foreground font-semibold focus:outline-none placeholder:text-muted-foreground/50" />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1">Quand ?</label>
              <input type="date" className="bg-transparent text-foreground font-semibold focus:outline-none" />
            </div>
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-radius-2xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Rechercher
            </button>
          </div>
        </section>

        <section className="py-32 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Une solution complète</h2>
              <p className="text-muted-foreground">Tout ce dont vous avez besoin pour réussir votre projet événementiel.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-card p-10 rounded-radius-4xl border border-border shadow-sm hover:shadow-md transition group">
                <div className="w-14 h-14 bg-primary rounded-radius-2xl flex items-center justify-center text-primary-foreground text-2xl mb-8 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                  <span>🏢</span>
                </div>
                <h3 className="text-2xl font-bold mb-6">Pour les Organisateurs</h3>
                <ul className="space-y-4">
                  {[
                    "Création d'événements multi-tickets",
                    "Dashboard analytique en temps réel",
                    "Gestion intelligente des capacités",
                    "Messagerie directe avec les inscrits"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground italic">
                      <span className="text-primary font-bold">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

            
              <div className="bg-card p-10 rounded-radius-4xl border border-border shadow-sm hover:shadow-md transition group">
                <div className="w-14 h-14 bg-accent rounded-radius-2xl flex items-center justify-center text-accent-foreground text-2xl mb-8 shadow-lg shadow-accent/20 transition-transform group-hover:scale-110">
                  <span>🎟️</span>
                </div>
                <h3 className="text-2xl font-bold mb-6">Pour les Participants</h3>
                <ul className="space-y-4">
                  {[
                    "Réservation et paiement sécurisé",
                    "Synchronisation Google Calendar & Outlook",
                    "Notifications et rappels automatiques",
                    "Système de feedback et notations"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground italic">
                      <span className="text-accent font-bold">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}