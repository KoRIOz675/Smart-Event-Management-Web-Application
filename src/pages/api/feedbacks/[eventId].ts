import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { feedbacks, users } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end();

    const { eventId } = req.query;

    if (!eventId || typeof eventId !== 'string') {
        return res.status(400).json({ message: "ID événement manquant." });
    }

    try {
        const results = await db
            .select({
                id: feedbacks.id,
                rating: feedbacks.rating,
                comment: feedbacks.comment,
                createdAt: feedbacks.createdAt,
                userId: feedbacks.userId,
                userName: users.fullName,
            })
            .from(feedbacks)
            .innerJoin(users, eq(feedbacks.userId, users.id))
            .where(eq(feedbacks.eventId, eventId))
            .orderBy(desc(feedbacks.createdAt));

        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors du chargement des avis." });
    }
}
