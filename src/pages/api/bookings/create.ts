import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { bookings, events, ticketTypes } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { event_id, user_id } = req.body;

  if (!event_id || !user_id) {
    return res.status(400).json({ message: "ID de l'événement et de l'utilisateur requis." });
  }

  try {
    return await db.transaction(async (tx) => {
      
      const [event] = await tx
        .select({ capacity: events.capacity })
        .from(events)
        .where(eq(events.id, event_id))
        .limit(1);

      if (!event) {
        return res.status(404).json({ message: "Événement non trouvé." });
      }

      if (event.capacity <= 0) {
        return res.status(400).json({ message: "Désolé, cet événement est complet." });
      }

      const [existingBooking] = await tx
        .select({ id: bookings.id })
        .from(bookings)
        .innerJoin(ticketTypes, eq(bookings.ticketTypeId, ticketTypes.id))
        .where(
          and(
            eq(bookings.userId, user_id),
            eq(ticketTypes.eventId, event_id)
          )
        )
        .limit(1);

      if (existingBooking) {
        return res.status(409).json({ message: "Vous avez déjà réservé pour cet événement." });
      }

      const [ticketType] = await tx
        .select({ id: ticketTypes.id })
        .from(ticketTypes)
        .where(eq(ticketTypes.eventId, event_id))
        .limit(1);

      if (!ticketType) {
        return res.status(400).json({ message: "Aucun type de ticket disponible." });
      }

      await tx.insert(bookings).values({
        userId: user_id,
        ticketTypeId: ticketType.id,
        status: 'confirmed',
      });

      await tx
        .update(events)
        .set({ capacity: sql`${events.capacity} - 1` })
        .where(eq(events.id, event_id));

      return res.status(201).json({ message: "Réservation confirmée !" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la réservation." });
  }
}