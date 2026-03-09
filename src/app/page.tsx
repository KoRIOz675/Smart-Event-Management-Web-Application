"use client" 
import { createUser } from "@/actions/user-actions";
import { useState } from "react";

export default function TestPage() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await createUser(formData);
    if (result.success) {
      setStatus(`Succès ! Utilisateur créé avec l'ID : ${result.user?.id}`);
    } else {
      setStatus(`Erreur : ${result.error}`);
    }
  }

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-6">Initialisation de la Database</h1>
      
      <form action={handleSubmit} className="flex flex-col gap-4 max-w-sm bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom Complet</label>
          <input 
            name="name" 
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
            placeholder="John Doe"
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            name="email" 
            type="email"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
            placeholder="john@example.com"
            required 
          />
        </div>

        <button 
          type="submit" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition shadow-sm"
        >
          Tester l'insertion SQL
        </button>
      </form>

      {status && (
        <div className={`mt-6 p-4 rounded-md max-w-sm ${status.startsWith('Erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {status}
        </div>
      )}
    </div>
  );
}