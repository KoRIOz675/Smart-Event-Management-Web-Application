import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { bookings, events, ticketTypes } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: "ID utilisateur manquant ou invalide." });
  }

  try {
    const userTickets = await db
      .select({
        id: bookings.id,
        event_title: events.title,
        location: events.location,
        start_date: events.startDate,
        status: bookings.status,
        ticket_type: ticketTypes.name,
      })
      .from(bookings)
      .innerJoin(ticketTypes, eq(bookings.ticketTypeId, ticketTypes.id))
      .innerJoin(events, eq(ticketTypes.eventId, events.id))
      .where(eq(bookings.userId, userId))
      .orderBy(asc(events.startDate));

    return res.status(200).json(userTickets);
  } catch (error) {
    console.error("Erreur de récupération des tickets:", error);
    return res.status(500).json({ message: "Erreur lors de la récupération de vos billets." });
  }
}