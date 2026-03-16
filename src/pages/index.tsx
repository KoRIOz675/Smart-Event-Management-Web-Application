import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>SmartEvent | La gestion d'événements intelligente</title>
        <meta name="description" content="Plateforme complète pour organisateurs et participants" />
      </Head>

      {/* --- BARRE DE NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">SmartEvent</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <Link href="/events" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Parcourir</Link>
              <Link href="/organizers" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Organisateurs</Link>
              <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Tarifs</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Connexion</Link>
              <Link href="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-200">
                Démarrer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- SECTION HERO --- */}
      <main>
        <header className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-6">
              Nouveau : Support des événements virtuels hybrides 🚀
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              Créez des événements <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-500">
                qui marquent les esprits.
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Une solution tout-en-un pour planifier, vendre vos tickets et analyser vos performances en temps réel. Simple, puissant et accessible.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-xl">
                Lancer mon événement
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition">
                Voir la démo
              </button>
            </div>
          </div>
        </header>

        {/* --- BARRE DE RECHERCHE INTELLIGENTE --- */}
        <section className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
          <div className="bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 flex flex-col md:flex-row gap-2">
            <div className="flex-1 p-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-50">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Type d'événement</label>
              <input type="text" placeholder="Concert, Formation, Tech..." className="bg-transparent text-gray-800 font-medium placeholder:text-gray-300" />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-50">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Localisation</label>
              <input type="text" placeholder="Paris, Lyon ou Virtuel" className="bg-transparent text-gray-800 font-medium placeholder:text-gray-300" />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date</label>
              <input type="date" className="bg-transparent text-gray-800 font-medium" />
            </div>
            <button className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Trouver
            </button>
          </div>
        </section>

        {/* --- SECTION FONCTIONNALITÉS --- */}
        <section className="py-32 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                  Pensé pour les organisateurs <br />exigeants.
                </h2>
                <div className="space-y-6">
                  {[
                    { t: "Ticketing Multi-niveaux", d: "Gérez VIP, Early Bird et Standard facilement.", i: "🎫" },
                    { t: "Dashboard Analytique", d: "Suivez vos ventes et inscriptions en temps réel.", i: "📊" },
                    { t: "Gestion des capacités", d: "Listes d'attente automatiques et limites de sièges.", i: "👥" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-white transition group border border-transparent hover:border-gray-100 hover:shadow-sm">
                      <div className="text-2xl">{item.i}</div>
                      <div>
                        <h4 className="font-bold text-gray-900">{item.t}</h4>
                        <p className="text-gray-500 text-sm">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-indigo-600 rounded-3xl p-1 aspect-video shadow-2xl overflow-hidden group">
                <div className="bg-gray-900 w-full h-full rounded-[22px] flex items-center justify-center">
                   <span className="text-indigo-400 font-mono text-sm tracking-tighter opacity-50">Preview Dashboard UI</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-indigo-600">SmartEvent</span>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              La plateforme qui simplifie la gestion d'événements pour les entreprises et les particuliers.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-6 uppercase tracking-widest">Produit</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-indigo-600">Fonctionnalités</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Intégrations</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Ticketing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-6 uppercase tracking-widest">Société</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-indigo-600">À propos</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Blog</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-6 uppercase tracking-widest">Légal</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-indigo-600">Confidentialité</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">CGU</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center border-t border-gray-50 pt-8 text-gray-400 text-xs">
          © {new Date().getFullYear()} Smart Event Management platform. Made for Excellence.
        </div>
      </footer>
    </div>
  );
}