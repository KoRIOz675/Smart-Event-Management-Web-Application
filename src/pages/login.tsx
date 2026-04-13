import React, { useState } from 'react';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLang();
  const l = t.login;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user);
        router.push('/');
      } else {
        setError(data.message || l.defaultError);
      }
    } catch (err) {
      setError(l.networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Head>
        <title>{l.title} | SmartEvent</title>
      </Head>

      <NavBar />

      <div className="flex flex-col items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md p-8 bg-card rounded-radius-4xl shadow-2xl border border-border">
          <h1 className="text-3xl font-black mb-2 text-center tracking-tight">
            {l.title}
          </h1>
          <p className="text-muted-foreground text-sm text-center mb-8 font-medium">
            {l.subtitle}
          </p>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm mb-6 text-center p-3 rounded-radius-lg border border-destructive/20 animate-in fade-in zoom-in duration-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">
                {l.email}
              </label>
              <input
                type="email"
                placeholder={l.emailPlaceholder}
                required
                className="w-full p-4 rounded-radius-2xl bg-input text-foreground border border-border focus:ring-2 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground/40"
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">
                {l.password}
              </label>
              <input
                type="password"
                placeholder={l.passwordPlaceholder}
                required
                className="w-full p-4 rounded-radius-2xl bg-input text-foreground border border-border focus:ring-2 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground/40"
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground p-4 rounded-radius-2xl font-bold hover:opacity-90 transition-all shadow-lg active:scale-95 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? l.submitting : l.submit}
            </button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-8">
            {l.noAccount}{' '}
            <a href="/register" className="text-primary font-bold hover:underline underline-offset-4">
              {l.signUp}
            </a>
          </p>
        </div>

        <a href="/" className="mt-8 text-muted-foreground text-xs hover:text-foreground transition">
          {l.backHome}
        </a>
      </div>
    </div>
  );
}