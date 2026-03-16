import React from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Head>
        <title>SmartEvent | Gestion d&apos;événements intelligente</title>
        <meta name="description" content="Plateforme complète pour planifier, gérer et participer à des événements." />
      </Head>
      <NavBar />

      <main>
        <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Nouveau : Dashboard Organisateur v2.0
            </div>
            
            <h1 className="mb-8 text-5xl font-black leading-[1.1] tracking-tight text-gray-900 dark:text-white md:text-7xl">
              L&apos;événementiel <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-500">
                en mode intelligent.
              </span>
            </h1>
            
            <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
              Créez, gérez et vendez vos tickets en quelques clics. Que ce soit en présentiel, 
              en virtuel ou en hybride, SmartEvent s&apos;occupe de tout.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <button className="rounded-2xl bg-gray-900 px-8 py-4 font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
                Lancer un événement
              </button>
              <button className="rounded-2xl border border-gray-200 bg-white px-8 py-4 font-bold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:hover:bg-white/10">
                Explorer les fonctions
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 -mt-24 relative z-20">
          <div className="flex flex-col gap-2 rounded-3xl border border-gray-100 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/20 md:flex-row">
            <div className="flex flex-1 flex-col justify-center border-b border-gray-50 p-4 dark:border-white/10 md:border-r md:border-b-0">
              <label className="mb-1 ml-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Événement</label>
              <input type="text" placeholder="Concert, Formation, Tech..." className="bg-transparent font-semibold text-gray-800 placeholder:text-gray-300 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500" />
            </div>
            <div className="flex flex-1 flex-col justify-center border-b border-gray-50 p-4 dark:border-white/10 md:border-r md:border-b-0">
              <label className="mb-1 ml-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Où ça ?</label>
              <input type="text" placeholder="Paris, Lyon ou Virtuel" className="bg-transparent font-semibold text-gray-800 placeholder:text-gray-300 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500" />
            </div>
            <div className="flex flex-1 flex-col justify-center p-4">
              <label className="mb-1 ml-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Quand ?</label>
              <input type="date" className="bg-transparent font-semibold text-gray-800 focus:outline-none dark:text-gray-100" />
            </div>
            <button className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white transition hover:bg-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Rechercher
            </button>
          </div>
        </section>

        <section className="bg-gray-50/50 py-32 dark:bg-white/2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="mb-4 text-3xl font-black text-gray-900 dark:text-white md:text-4xl">Une solution complète</h2>
              <p className="text-gray-500 dark:text-gray-400">Tout ce dont vous avez besoin pour réussir votre projet événementiel.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="rounded-4xl border border-gray-100 bg-white p-10 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-950/40">
                  <span>🏢</span>
                </div>
                <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Pour les Organisateurs</h3>
                <ul className="space-y-4">
                  {[
                    "Création d'événements multi-tickets",
                    "Dashboard analytique en temps réel",
                    "Gestion intelligente des capacités",
                    "Messagerie directe avec les inscrits"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 italic text-gray-600 dark:text-gray-300">
                      <span className="text-indigo-600 font-bold">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-4xl border border-gray-100 bg-white p-10 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-2xl text-white shadow-lg shadow-emerald-100 dark:shadow-emerald-950/30">
                  <span>🎟️</span>
                </div>
                <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Pour les Participants</h3>
                <ul className="space-y-4">
                  {[
                    "Réservation et paiement sécurisé",
                    "Synchronisation Google Calendar & Outlook",
                    "Notifications et rappels automatiques",
                    "Système de feedback et notations"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 italic text-gray-600 dark:text-gray-300">
                      <span className="text-emerald-500 font-bold">✓</span> {item}
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