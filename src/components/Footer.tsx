import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">

        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SmartEvent</span>
          </Link>
          <p className="mt-4 text-gray-500 text-sm leading-relaxed italic">
            "Rendre chaque événement mémorable grâce à une gestion simplifiée et intelligente."
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 text-xs mb-6 uppercase tracking-widest">Plateforme</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link href="/events" className="hover:text-indigo-600 transition">Parcourir les événements</Link></li>
            <li><Link href="/ticketing" className="hover:text-indigo-600 transition">Billetterie</Link></li>
            <li><Link href="/virtual" className="hover:text-indigo-600 transition">Événements Virtuels</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 text-sm mb-6 uppercase tracking-widest">Société</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link href="/about" className="hover:text-indigo-600 transition">À propos</Link></li>
            <li><Link href="/contact" className="hover:text-indigo-600 transition">Contactez-nous</Link></li>
            <li><Link href="/blog" className="hover:text-indigo-600 transition">Blog & Actualités</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 text-sm mb-6 uppercase tracking-widest">Légal</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link href="/privacy" className="hover:text-indigo-600 transition">Confidentialité</Link></li>
            <li><Link href="/terms" className="hover:text-indigo-600 transition">CGU / CGV</Link></li>
            <li><Link href="/cookies" className="hover:text-indigo-600 transition">Gestion des cookies</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 text-center border-t border-gray-50 pt-8 text-gray-400 text-xs">
        © {currentYear} Smart Event Management Web Application. Développé pour l'excellence.
      </div>
    </footer>
  );
};

export default Footer;