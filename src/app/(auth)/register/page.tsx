"use client";
import { registerUser } from "@/actions/user-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function clientAction(formData: FormData) {
    const res = await registerUser(formData);
    if (res.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Créer un compte</h1>
      <form action={clientAction} className="flex flex-col gap-4">
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>}
        <input name="fullName" placeholder="Nom complet" required className="p-3 border rounded-lg outline-blue-500 text-gray-800" />
        <input name="email" type="email" placeholder="Email" required className="p-3 border rounded-lg outline-blue-500 text-gray-800" />
        <input name="password" type="password" placeholder="Mot de passe" required className="p-3 border rounded-lg outline-blue-500 text-gray-800" />
        <select name="role" className="p-3 border rounded-lg bg-white outline-blue-500 text-gray-800">
          <option value="attendee">Je participe à des événements</option>
          <option value="organizer">J'organise des événements</option>
        </select>
        <button className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">S'inscrire</button>
      </form>
    </div>
  );
}