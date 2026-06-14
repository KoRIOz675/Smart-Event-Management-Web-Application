import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { events, ticketTypes, bookings, feedbacks } from '@/lib/schema';
import { eq, sql, desc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end();

    const { organizerId } = req.query;
    if (!organizerId || typeof organizerId !== 'string') {
        return res.status(400).json({ message: "organizerId manquant." });
    }

    try {
        const rows = await db
            .select({
                id: events.id,
                title: events.title,
                startDate: events.startDate,
                remainingCapacity: events.capacity,
                category: events.category,
                registrations: sql<number>`count(distinct ${bookings.id})`.mapWith(Number),
                revenue: sql<number>`coalesce(sum(case when ${bookings.id} is not null then ${ticketTypes.price}::decimal else 0 end), 0)`.mapWith(Number),
                avgRating: sql<string | null>`round(avg(${feedbacks.rating})::numeric, 1)`,
                feedbackCount: sql<number>`count(distinct ${feedbacks.id})`.mapWith(Number),
            })
            .from(events)
            .leftJoin(ticketTypes, eq(ticketTypes.eventId, events.id))
            .leftJoin(bookings, eq(bookings.ticketTypeId, ticketTypes.id))
            .leftJoin(feedbacks, eq(feedbacks.eventId, events.id))
            .where(eq(events.organizerId, organizerId))
            .groupBy(events.id)
            .orderBy(desc(events.startDate));

        const totalRegistrations = rows.reduce((s, r) => s + r.registrations, 0);
        const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
        const ratedEvents = rows.filter(r => r.avgRating !== null);
        const overallAvgRating =
            ratedEvents.length > 0
                ? (ratedEvents.reduce((s, r) => s + parseFloat(r.avgRating!), 0) / ratedEvents.length).toFixed(1)
                : null;

        return res.status(200).json({
            summary: {
                totalEvents: rows.length,
                totalRegistrations,
                totalRevenue: totalRevenue.toFixed(2),
                overallAvgRating,
            },
            events: rows.map(r => ({
                ...r,
                // original capacity = remaining + booked
                originalCapacity: r.remainingCapacity + r.registrations,
            })),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
}
