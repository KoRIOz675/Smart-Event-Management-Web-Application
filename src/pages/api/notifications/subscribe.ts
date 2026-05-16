import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { pushSubscriptions } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const { userId, subscription } = req.body;

    if (!userId || !subscription || !subscription.endpoint) {
        return res.status(400).json({ message: 'Hiányzó adatok.' });
    }

    try {
        const existing = await db.select()
            .from(pushSubscriptions)
            .where(and(
                eq(pushSubscriptions.userId, userId),
                eq(pushSubscriptions.endpoint, subscription.endpoint)
            ));

        if (existing.length === 0) {
            await db.insert(pushSubscriptions).values({
                userId,
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Szerver hiba' });
    }
}