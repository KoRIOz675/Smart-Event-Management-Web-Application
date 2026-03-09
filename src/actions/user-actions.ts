"use server"
import { query } from "@/lib/db";

interface UserRow {
  id: string;
  email: string;
}

export async function createUser(formData: FormData) {
  const email = formData.get("email") as string;
  const fullName = formData.get("name") as string;
  const passwordHash = "hash_temporaire"; 

  try {
    const sql = `
      INSERT INTO users (email, full_name, password_hash, role)
      VALUES ($1, $2, $3, 'organizer')
      RETURNING id, email;
    `;

    const result = await query(sql, [email, fullName, passwordHash]);
    
    const newUser = result.rows[0] as UserRow;

    if (!newUser) {
      throw new Error("L'insertion a échoué");
    }

    return { 
      success: true, 
      user: newUser 
    };
} catch (error: any) {
    console.error("❌ DÉTAILS DE L'ERREUR :", error);
    
    const errorMessage = error.detail || error.message || "Erreur de connexion ou contrainte SQL";
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}