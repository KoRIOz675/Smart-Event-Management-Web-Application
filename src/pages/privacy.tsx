import React from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { useLang } from '@/context/LangContext';

export default function Privacy() {
  const { t } = useLang();
  const page = t.privacyPage;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Head>
        <title>{page.pageTitle}</title>
        <meta name="description" content={page.heroSubtitle} />
      </Head>

      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{page.heroTitle}</h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">{page.heroSubtitle}</p>
        </section>

        <section className="rounded-radius-4xl border border-border bg-card p-10 shadow-sm">
          <p className="text-muted-foreground leading-relaxed">{page.summary}</p>
          <ul className="mt-8 space-y-4 text-muted-foreground">
            <li>• Data is stored securely and only used for platform improvements.</li>
            <li>• We respect your privacy choices and manage cookies transparently.</li>
            <li>• Personal details are never shared without your consent.</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
