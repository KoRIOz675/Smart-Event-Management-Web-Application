import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { users, events, bookings } from '@/lib/schema';
import { sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [eventCount] = await db.select({ count: sql<number>`count(*)` }).from(events);
    const [bookingCount] = await db.select({ count: sql<number>`count(*)` }).from(bookings);

    return res.status(200).json({
      totalUsers: Number(userCount.count),
      totalEvents: Number(eventCount.count),
      totalBookings: Number(bookingCount.count),
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}