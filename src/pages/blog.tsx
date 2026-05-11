import React from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { useLang } from '@/context/LangContext';

export default function Blog() {
  const { t } = useLang();
  const page = t.blogPage;

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
          <p className="mx-auto max-w-3xl text-base text-muted-foreground leading-relaxed mt-6">{page.intro}</p>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          <article className="rounded-radius-4xl border border-border bg-card p-8 shadow-sm">
            <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Feature</span>
            <h2 className="mt-4 text-2xl font-bold">Smart event planning tips</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">Learn how to build better experiences with smarter ticketing and attendee communication.</p>
          </article>
          <article className="rounded-radius-4xl border border-border bg-card p-8 shadow-sm">
            <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Insights</span>
            <h2 className="mt-4 text-2xl font-bold">Grow your event audience</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">Discover methods to improve visibility and turn attendees into loyal followers.</p>
          </article>
          <article className="rounded-radius-4xl border border-border bg-card p-8 shadow-sm">
            <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Updates</span>
            <h2 className="mt-4 text-2xl font-bold">Platform news and releases</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">Stay up to date with the latest SmartEvent features and product improvements.</p>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
