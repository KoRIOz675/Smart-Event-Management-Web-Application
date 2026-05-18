import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/index';
import { notifications } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const userNotifications = await db.select()
            .from(notifications)
            .where(eq(notifications.userId, userId))
            .orderBy(desc(notifications.createdAt))
            .limit(20);

        return res.status(200).json(userNotifications);
    } catch (error) {
        console.error("Error in /api/notifications:", error);
        return res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
}