import { db } from './index';
import { notifications } from './schema';

export async function createNotification(userId: string, message: string, eventId?: string) {
    try {
        await db.insert(notifications).values({
            userId,
            message,
            eventId,
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}