import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { messages, users } from '@/lib/schema';
import { eq, or, and } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end();

    const { userId, eventId } = req.query;
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        let messageConditions = or(eq(messages.senderId, userId), eq(messages.receiverId, userId));

        if (eventId && typeof eventId === 'string') {
            messageConditions = and(messageConditions, eq(messages.eventId, eventId));
        }

        const allUserMessages = await db
            .select({
                senderId: messages.senderId,
                receiverId: messages.receiverId,
            })
            .from(messages)
            .where(messageConditions);

        const partnerIds = Array.from(
            new Set(
                allUserMessages.map((m) => (m.senderId === userId ? m.receiverId : m.senderId))
            )
        );

        if (partnerIds.length === 0) {
            return res.status(200).json([]);
        }

        const activeConversations = [];
        for (const pId of partnerIds) {
            const [partnerUser] = await db
                .select({
                    id: users.id,
                    fullName: users.fullName,
                    email: users.email,
                    role: users.role,
                })
                .from(users)
                .where(eq(users.id, pId))
                .limit(1);

            if (partnerUser) {
                activeConversations.push(partnerUser);
            }
        }

        return res.status(200).json(activeConversations);
    } catch (error) {
        console.error("Error in /api/messages/conversations:", error);
        return res.status(500).json({ message: 'Failed to fetch conversations.', error: String(error) });
    }
}