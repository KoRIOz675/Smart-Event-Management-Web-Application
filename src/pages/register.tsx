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

    if (res.ok) router.push('/login');
    else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Inscription | SmartEvent</title>
      </Head>
      <NavBar />
      
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-4xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-2 text-center">Créer un compte</h1>
        <p className="text-gray-500 text-sm text-center mb-8">Rejoignez la communauté SmartEvent</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Nom complet</label>
            <input 
              type="text" 
              placeholder="Ex: Jean Dupont" 
              required
              className="w-full p-4 rounded-2xl bg-gray-50 text-gray-900 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Adresse Email</label>
            <input 
              type="email" 
              placeholder="jean.dupont@exemple.com" 
              required
              className="w-full p-4 rounded-2xl bg-gray-50 text-gray-900 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Mot de passe</label>
            <input 
              type="password" 
              placeholder="•••••••• (8 caractères min.)" 
              required
              className="w-full p-4 rounded-2xl bg-gray-50 text-gray-900 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Vous êtes ?</label>
            <select 
              className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 text-gray-600 appearance-none cursor-pointer"
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

        <p className="text-center text-gray-400 text-sm mt-8">
          Déjà inscrit ? <a href="/login" className="text-indigo-600 font-bold hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  );
}