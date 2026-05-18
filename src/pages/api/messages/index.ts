import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { messages } from '@/lib/schema';
import { eq, and, or, asc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { userId, partnerId, eventId } = req.query;

        if (!userId || !partnerId || typeof userId !== 'string' || typeof partnerId !== 'string') {
            return res.status(400).json({ message: 'User ID and Partner ID are required.' });
        }

        try {
            let conditions = or(
                and(eq(messages.senderId, userId), eq(messages.receiverId, partnerId)),
                and(eq(messages.senderId, partnerId), eq(messages.receiverId, userId))
            );

            if (eventId && typeof eventId === 'string') {
                conditions = and(conditions, eq(messages.eventId, eventId));
            }

            const chatHistory = await db
                .select()
                .from(messages)
                .where(conditions)
                .orderBy(asc(messages.createdAt));

            return res.status(200).json(chatHistory);
        } catch (error) {
            console.error("Error in GET /api/messages:", error);
            return res.status(500).json({ message: 'Failed to load chat history.', error: String(error) });
        }
    }

    if (req.method === 'POST') {
        const { senderId, receiverId, eventId, content } = req.body;

        if (!senderId || !receiverId || !content) {
            return res.status(400).json({ message: 'Missing required parameters.' });
        }

        try {
            const [newMessage] = await db
                .insert(messages)
                .values({
                    senderId,
                    receiverId,
                    eventId: eventId || null,
                    content,
                })
                .returning();

            return res.status(201).json(newMessage);
        } catch (error) {
            console.error("Error in POST /api/messages:", error);
            return res.status(500).json({ message: 'Failed to send message.', error: String(error) });
        }
    }

    return res.status(405).end();
}