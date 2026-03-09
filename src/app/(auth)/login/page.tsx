"use client";

import { loginUser } from "@/actions/user-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function clientAction(formData: FormData) {
    setLoading(true);
    setError("");
    
    const res = await loginUser(formData);
    
    if (res.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(res.error || "Identifiants incorrects");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Connexion</h1>
      
      <form action={clientAction} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input 
            name="email" 
            type="email" 
            placeholder="votre@email.com" 
            required 
            className="p-3 border rounded-lg outline-blue-500 transition-all focus:ring-2 focus:ring-blue-200" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Mot de passe</label>
          <input 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            required 
            className="p-3 border rounded-lg outline-blue-500 transition-all focus:ring-2 focus:ring-blue-200" 
          />
        </div>

        <button 
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400 mt-2"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-blue-600 font-semibold hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}