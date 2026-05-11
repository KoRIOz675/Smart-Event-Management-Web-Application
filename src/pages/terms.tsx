import React from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { useLang } from '@/context/LangContext';

export default function Terms() {
  const { t } = useLang();
  const page = t.termsPage;

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
          <ol className="mt-8 space-y-4 text-muted-foreground list-decimal list-inside">
            <li>Use SmartEvent services fairly and responsibly.</li>
            <li>Respect intellectual property and user privacy.</li>
            <li>Follow event booking and cancellation rules.</li>
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  );
}
