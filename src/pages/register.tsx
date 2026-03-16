import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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

    if (res.ok) router.push('/login');
    else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-background dark:text-foreground">
      <Head>
        <title>Inscription | SmartEvent</title>
      </Head>
      <NavBar />
      
      <div className="mx-auto mt-20 max-w-md rounded-4xl border border-gray-100 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
        <h1 className="mb-2 text-center text-3xl font-black text-gray-900 dark:text-white">Créer un compte</h1>
        <p className="mb-8 text-center text-sm text-gray-500 dark:text-gray-400">Rejoignez la communauté SmartEvent</p>

        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-3 text-center text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 ml-2 block text-xs font-bold uppercase text-gray-400 dark:text-gray-500">Nom complet</label>
            <input
              type="text" 
              placeholder="Ex: Jean Dupont" 
              required
              className="w-full rounded-2xl bg-gray-50 p-4 text-gray-900 transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 dark:bg-white/5 dark:text-gray-100 dark:placeholder:text-gray-500"
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            />
          </div>
          <div>
            <label className="mb-1 ml-2 block text-xs font-bold uppercase text-gray-400 dark:text-gray-500">Adresse Email</label>
            <input
              type="email" 
              placeholder="jean.dupont@exemple.com" 
              required
              className="w-full rounded-2xl bg-gray-50 p-4 text-gray-900 transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 dark:bg-white/5 dark:text-gray-100 dark:placeholder:text-gray-500"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="mb-1 ml-2 block text-xs font-bold uppercase text-gray-400 dark:text-gray-500">Mot de passe</label>
            <input
              type="password" 
              placeholder="•••••••• (8 caractères min.)" 
              required
              className="w-full rounded-2xl bg-gray-50 p-4 text-gray-900 transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 dark:bg-white/5 dark:text-gray-100 dark:placeholder:text-gray-500"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="mb-1 ml-2 block text-xs font-bold uppercase text-gray-400 dark:text-gray-500">Vous êtes ?</label>
            <select
              className="w-full cursor-pointer appearance-none rounded-2xl bg-gray-50 p-4 text-gray-600 transition focus:ring-2 focus:ring-indigo-500 dark:bg-white/5 dark:text-gray-200"
              defaultValue="attendee"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="attendee">🎟️ Je suis un Participant</option>
              <option value="organizer">🏢 Je suis un Organisateur</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4 active:scale-95"
          >
            Créer mon compte
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
          Déjà inscrit ? <Link href="/login" className="font-bold text-indigo-600 hover:underline dark:text-indigo-400">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}