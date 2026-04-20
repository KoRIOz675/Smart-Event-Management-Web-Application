import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { users, events, bookings } from '@/lib/schema';
import { sql, eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [eventCount] = await db.select({ count: sql<number>`count(*)` }).from(events);
    const [bookingCount] = await db.select({ count: sql<number>`count(*)` }).from(bookings);
    
    const allUsers = await db.select().from(users).orderBy(users.fullName);

    const allEvents = await db
      .select({
        id: events.id,
        title: events.title,
        category: events.category,
        startDate: events.startDate,
        capacity: events.capacity,
        organizerName: users.fullName,
      })
      .from(events)
      .leftJoin(users, eq(events.organizerId, users.id))
      .orderBy(events.startDate);

    return res.status(200).json({
      totalUsers: Number(userCount.count),
      totalEvents: Number(eventCount.count),
      totalBookings: Number(bookingCount.count),
      allUsers,
      allEvents 
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}