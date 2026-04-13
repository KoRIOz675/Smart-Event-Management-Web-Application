import React from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLang();
  const f = t.footer;

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
            {f.tagline}
          </p>
        </div>

        <div>
          <h4 className="font-bold text-foreground text-xs mb-6 uppercase tracking-widest">
            {f.platformTitle}
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <Link href="/events" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                {f.browseEvents}
              </Link>
            </li>
            <li>
              <Link href="/ticketing" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                {f.ticketing}
              </Link>
            </li>
            <li>
              <Link href="/virtual" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                {f.virtualEvents}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm mb-6 uppercase tracking-widest">
            {f.companyTitle}
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                {f.about}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                {f.contact}
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                {f.blog}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm mb-6 uppercase tracking-widest">
            {f.legalTitle}
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <Link href="/privacy" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                {f.privacy}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                {f.terms}
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                {f.cookies}
              </Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 text-center border-t border-border pt-8 text-muted-foreground/60 text-[10px] uppercase tracking-widest">
        © {currentYear} {f.copyright}
      </div>
    </footer>
  );
};

export default Footer;