import React, { useState } from 'react';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext'; // 1. Import du hook d'authentification

export default function Login() {
  const router = useRouter();
  const { login } = useAuth(); // 2. Récupération de la fonction login du contexte
  
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
        // 3. On enregistre l'utilisateur dans le contexte global
        login(data.user); 
        // 4. Redirection vers l'accueil
        router.push('/'); 
      } else {
        setError(data.message || "Identifiants invalides ou compte inexistant");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Head>
        <title>Connexion | SmartEvent</title>
      </Head>
      
      <NavBar />

      <div className="flex flex-col items-center justify-center px-4 pt-20">
        {/* Card de connexion utilisant ton theme.css */}
        <div className="w-full max-w-md p-8 bg-card rounded-radius-4xl shadow-2xl border border-border">
          <h1 className="text-3xl font-black mb-2 text-center tracking-tight">
            Connexion
          </h1>
          <p className="text-muted-foreground text-sm text-center mb-8 font-medium">
            Heureux de vous revoir !
          </p>

          {/* Affichage de l'erreur */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm mb-6 text-center p-3 rounded-radius-lg border border-destructive/20 animate-in fade-in zoom-in duration-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">
                Adresse Email
              </label>
              <input 
                type="email" 
                placeholder="exemple@email.com" 
                required
                className="w-full p-4 rounded-radius-2xl bg-input text-foreground border border-border focus:ring-2 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground/40" 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">
                Mot de passe
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
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
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-8">
            Pas encore de compte ?{' '}
            <a 
              href="/register" 
              className="text-primary font-bold hover:underline underline-offset-4"
            >
              S'inscrire
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