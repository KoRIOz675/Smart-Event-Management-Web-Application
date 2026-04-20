import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { events, ticketTypes } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).end();
  const { id, title, description, location, category, capacity, start_date, end_date, ticket_types } = req.body;

  try {
    await db.update(events)
      .set({
        title,
        description,
        location,
        category,
        capacity: parseInt(capacity),
        startDate: new Date(start_date),
        endDate: new Date(end_date),
      })
      .where(eq(events.id, id));

    try {
      await db.transaction(async (tx) => {
        await tx.delete(ticketTypes).where(eq(ticketTypes.eventId, id));
        const ticketsToInsert = ticket_types.map((t: any) => ({
          eventId: id,
          name: t.name,
          price: t.price.toString(),
          quantityAvailable: parseInt(t.quantity_available),
        }));
        await tx.insert(ticketTypes).values(ticketsToInsert);
      });
    } catch (ticketError) {
      console.warn("L'événement a été mis à jour, mais pas les tickets (réservations en cours).");
    }

    return res.status(200).json({ message: "Succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}