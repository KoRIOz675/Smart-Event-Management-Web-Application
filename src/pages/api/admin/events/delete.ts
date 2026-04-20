import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { events } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const { eventId } = req.query;

  try {
    await db.delete(events).where(eq(events.id, eventId as string));
    return res.status(200).json({ message: "Événement supprimé" });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la suppression" });
  }
}