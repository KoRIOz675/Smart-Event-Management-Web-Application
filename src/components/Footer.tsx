import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">

        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-radius-lg flex items-center justify-center shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">SmartEvent</span>
          </Link>
          <p className="mt-4 text-muted-foreground text-sm leading-relaxed italic">
            "Rendre chaque événement mémorable grâce à une gestion simplifiée et intelligente."
          </p>
        </div>

        <div>
          <h4 className="font-bold text-foreground text-xs mb-6 uppercase tracking-widest">
            Plateforme
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <Link href="/events" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                Parcourir les événements
              </Link>
            </li>
            <li>
              <Link href="/ticketing" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                Billetterie
              </Link>
            </li>
            <li>
              <Link href="/virtual" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                Événements Virtuels
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-foreground text-sm mb-6 uppercase tracking-widest">
            Société
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                À propos
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                Contactez-nous
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                Blog & Actualités
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-foreground text-sm mb-6 uppercase tracking-widest">
            Légal
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <Link href="/privacy" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                Confidentialité
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                CGU / CGV
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                Gestion des cookies
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 text-center border-t border-border pt-8 text-muted-foreground/60 text-[10px] uppercase tracking-widest">
        © {currentYear} Smart Event Management Web Application. Développé pour l'excellence.
      </div>
    </footer>
  );
};

export default Footer;