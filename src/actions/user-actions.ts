"use server";

import { query } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

// Inscription (Register)
export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string || 'attendee';

  try {
    const sql = `
      INSERT INTO users (email, full_name, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, full_name, role;
    `;

    const result = await query(sql, [email, fullName, password, role]);
    const newUser = result.rows[0] as UserRow;

    if (newUser) {
      const cookieStore = await cookies();
      cookieStore.set("userId", newUser.id, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        path: "/" 
      });
    }

    return { success: true, user: newUser };
  } catch (error: any) {
    console.error("❌ ERREUR REGISTER :", error);
    return { success: false, error: error.detail || "Cet email est déjà utilisé." };
  }
}

// Connexion (Login)
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const sql = `SELECT id, email, full_name, role FROM users WHERE email = $1 AND password_hash = $2`;
    const result = await query(sql, [email, password]);
    const user = result.rows[0] as UserRow;

    if (!user) {
      return { success: false, error: "Identifiants incorrects." };
    }

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, { httpOnly: true, path: "/" });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Erreur lors de la connexion." };
  }
}

// Récupérer l'utilisateur actuel (Session)
export async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;

  try {
    const result = await query("SELECT id, email, full_name, role FROM users WHERE id = $1", [userId]);
    return result.rows[0] as UserRow;
  } catch {
    return null;
  }
}

// Déconnexion
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/");
}