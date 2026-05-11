import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).end();

  const { userId, newRole } = req.body;

  const allowedRoles = ['attendee', 'organizer', 'admin'];
  if (!allowedRoles.includes(newRole)) {
    return res.status(400).json({ message: "Rôle invalide" });
  }

  try {
    await db.update(users)
      .set({ role: newRole })
      .where(eq(users.id, userId));

    return res.status(200).json({ message: "Rôle mis à jour avec succès" });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
}