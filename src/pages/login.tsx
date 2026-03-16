import React, { useState } from 'react';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/'); 
    } else {
      setError("Identifiants invalides ou compte inexistant");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-background dark:text-foreground">
      <Head>
        <title>Connexion | SmartEvent</title>
      </Head>
      <NavBar />
      <div className="mx-auto mt-20 max-w-md rounded-4xl border border-gray-100 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
        <h1 className="mb-2 text-center text-3xl font-black text-gray-900 dark:text-white">Connexion</h1>
        <p className="mb-8 text-center text-sm text-gray-500 dark:text-gray-400">Heureux de vous revoir !</p>

        {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-500 dark:bg-red-500/10 dark:text-red-200">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" placeholder="Email" required
            className="w-full rounded-2xl bg-gray-50 p-4 text-gray-900 outline-none ring-0 transition placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 dark:bg-white/5 dark:text-gray-100 dark:placeholder:text-gray-500" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Mot de passe" required
            className="w-full rounded-2xl bg-gray-50 p-4 text-gray-900 outline-none ring-0 transition placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 dark:bg-white/5 dark:text-gray-100 dark:placeholder:text-gray-500" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg">
            Se connecter
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
          Pas encore de compte ? <a href="/register" className="font-bold text-indigo-600 hover:underline dark:text-indigo-400">S&rsquo;inscrire</a>
        </p>
      </div>
    </div>
  );
}