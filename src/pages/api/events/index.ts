import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib'; // Adjust this import path if necessary based on your setup
import { events, ticketTypes } from '@/lib/schema';
import { sql, asc, getTableColumns, ilike, and, gte, lte, SQL } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, location, date } = req.query;
        const filters: SQL[] = [];

        // 1. Search by Title (Fixed: using events.title instead of events.name)
        if (name && typeof name === 'string' && name.trim()) {
            filters.push(ilike(events.title, `%${name.trim()}%`));
        }

        // 2. Search by Location
        if (location && typeof location === 'string' && location.trim()) {
            filters.push(ilike(events.location, `%${location.trim()}%`));
        }

        // 3. Search by Date
        if (date && typeof date === 'string') {
            const start = new Date(date);
            const end = new Date(date);
            // Set to the very end of the selected day
            end.setHours(23, 59, 59, 999);
            filters.push(gte(events.startDate, start));
            filters.push(lte(events.startDate, end));
        }

        // Execute the bulletproof database query
        const allEvents = await db
            .select({
                // Get all columns from the events table
                ...getTableColumns(events),
                // Subquery to find the lowest ticket price for this specific event
                price: sql<number>`(SELECT min(${ticketTypes.price}) FROM ${ticketTypes} WHERE ${ticketTypes.eventId} = ${events.id})`.mapWith(Number),
            })
            .from(events)
            .where(filters.length > 0 ? and(...filters) : undefined)
            .orderBy(asc(events.startDate));

        // Return the successfully fetched data!
        return res.status(200).json(allEvents);

    } catch (error: any) {
        // Safe crash handling so the frontend gets a proper JSON response instead of HTML
        console.error('Erreur lors de la récupération des événements:', error);

        return res.status(500).json({
            message: 'Erreur serveur',
            error: error?.message || String(error)
        });
    }
}