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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Head>
        <title>Connexion | SmartEvent</title>
      </Head>
      <NavBar />
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-4xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black mb-2 text-center">Connexion</h1>
        <p className="text-gray-500 text-sm text-center mb-8">Heureux de vous revoir !</p>

        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-3 rounded-xl">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" placeholder="Email" required
            className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Mot de passe" required
            className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg">
            Se connecter
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-8">
          Pas encore de compte ? <a href="/register" className="text-indigo-600 font-bold hover:underline">S'inscrire</a>
        </p>
      </div>
    </div>
  );
}