import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { events, ticketTypes } from '@/lib/schema';
import { eq, sql, asc, getTableColumns } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const allEvents = await db
      .select({
        ...getTableColumns(events),
        price: sql<number>`min(${ticketTypes.price})`.mapWith(Number)
      })
      .from(events)
      .leftJoin(ticketTypes, eq(events.id, ticketTypes.eventId))
      .groupBy(events.id)
      .orderBy(asc(events.startDate));

    return res.status(200).json(allEvents);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}