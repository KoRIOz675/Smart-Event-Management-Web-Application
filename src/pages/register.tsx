import React, { useState } from 'react';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'attendee' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Head>
        <title>Inscription | SmartEvent</title>
      </Head>
      <NavBar />
      
      <div className="flex flex-col items-center justify-center px-4 pt-12 pb-20">
        <div className="w-full max-w-md p-8 bg-card rounded-radius-4xl shadow-2xl border border-border">
          <h1 className="text-3xl font-black text-center tracking-tight mb-2">
            Créer un compte
          </h1>
          <p className="text-muted-foreground text-sm text-center mb-8 font-medium">
            Rejoignez la communauté SmartEvent
          </p>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm mb-6 text-center p-4 rounded-radius-lg border border-destructive/20 animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">
                Nom complet
              </label>
              <input 
                type="text" 
                placeholder="Ex: Jean Dupont" 
                required
                className="w-full p-4 rounded-radius-2xl bg-input text-foreground border border-border focus:ring-2 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground/40"
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">
                Adresse Email
              </label>
              <input 
                type="email" 
                placeholder="jean.dupont@exemple.com" 
                required
                className="w-full p-4 rounded-radius-2xl bg-input text-foreground border border-border focus:ring-2 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground/40"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">
                Mot de passe
              </label>
              <input 
                type="password" 
                placeholder="•••••••• (8 caract. min.)" 
                required
                className="w-full p-4 rounded-radius-2xl bg-input text-foreground border border-border focus:ring-2 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground/40"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">
                Vous êtes ?
              </label>
              <div className="relative">
                <select 
                  className="w-full p-4 rounded-radius-2xl bg-input text-foreground border border-border focus:ring-2 focus:ring-ring outline-none appearance-none cursor-pointer transition-all"
                  defaultValue="attendee"
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="attendee">🎟️ Je suis un Participant</option>
                  <option value="organizer">🏢 Je suis un Organisateur</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground p-4 rounded-radius-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/10 mt-4 active:scale-95"
            >
              Créer mon compte
            </button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-8">
            Déjà inscrit ?{' '}
            <a 
              href="/login" 
              className="text-primary font-bold hover:underline underline-offset-4"
            >
              Se connecter
            </a>
          </p>
        </div>
      
        <a href="/" className="mt-8 text-muted-foreground text-xs hover:text-foreground transition">
          ← Retour à l'accueil
        </a>
      </div>
    </div>
  );
}