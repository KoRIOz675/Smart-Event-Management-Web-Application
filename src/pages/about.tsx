import React from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { useLang } from '@/context/LangContext';

export default function About() {
  const { t } = useLang();
  const page = t.aboutPage;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Head>
        <title>{page.pageTitle}</title>
        <meta name="description" content={page.heroSubtitle} />
      </Head>

      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-foreground">{page.heroTitle}</h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed mb-6">{page.heroSubtitle}</p>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground leading-relaxed">{page.intro}</p>
        </section>

        <section className="grid gap-12 lg:grid-cols-3 mb-20">
          <div className="rounded-radius-4xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{page.missionTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">{page.missionText}</p>
          </div>

          <div className="lg:col-span-2 rounded-radius-4xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{page.valuesTitle}</h2>
            <div className="space-y-4">
              {page.values.map((value, index) => (
                <div key={index} className="flex gap-3 items-start text-muted-foreground">
                  <span className="mt-1 text-primary font-bold">✓</span>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-radius-4xl border border-border bg-secondary/80 p-8 shadow-lg backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-foreground">{page.contactTitle}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{page.contactText}</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
