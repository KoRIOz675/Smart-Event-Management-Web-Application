import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { events, users, ticketTypes } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') return res.status(405).end();

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: "ID de l'événement manquant." });
  }

  try {
    const result = await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        location: events.location,
        isVirtual: events.isVirtual,
        startDate: events.startDate,
        endDate: events.endDate,
        capacity: events.capacity,
        category: events.category,
        imageUrl: events.imageUrl,
        organizerId: events.organizerId,
        createdAt: events.createdAt,
        organizer_name: users.fullName,
        price: sql<number>`(
          SELECT MIN(price) 
          FROM ${ticketTypes} 
          WHERE ${ticketTypes.eventId} = ${events.id}
        )`.mapWith(Number)
      })
      .from(events)
      .innerJoin(users, eq(events.organizerId, users.id))
      .where(eq(events.id, id))
      .limit(1);

    const event = result[0];

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error("Erreur détails événement:", error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}