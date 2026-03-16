"use client";

import { createEvent } from "@/actions/event-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const ORGANIZER_ID = "TON_UUID_ICI"; 

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createEvent(formData, ORGANIZER_ID);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard"); 
      router.refresh(); 
    } else {
      alert("Erreur : " + result.error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Créer un nouvel évènement</h1>
      
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre</label>
          <input name="title" required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-800" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-800" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de début</label>
            <input name="startDate" required type="datetime-local" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de fin</label>
            <input name="endDate" required type="datetime-local" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-800" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacité max</label>
            <input name="capacity" required type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prix du ticket (€)</label>
            <input name="price" required type="number" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-800" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lieu</label>
          <input name="location" required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-gray-800" />
        </div>

        <button 
          disabled={loading}
          type="submit"
          className={`w-full py-3 px-4 rounded-md text-white font-bold transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? "Création en cours..." : "Publier l'évènement"}
        </button>
      </form>
    </div>
  );
}