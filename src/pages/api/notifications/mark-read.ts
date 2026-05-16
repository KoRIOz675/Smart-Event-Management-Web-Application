import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/index';
import { notifications } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { notificationId } = req.body;

    if (!notificationId) {
        return res.status(400).json({ message: 'Notification ID is required' });
    }

    try {
        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, notificationId));

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}