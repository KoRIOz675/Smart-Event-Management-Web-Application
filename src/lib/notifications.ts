import { db } from './index';
import { notifications, pushSubscriptions } from './schema';
import { eq } from 'drizzle-orm';
import webpush from 'web-push';

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

// Server-side translation dictionary since React's LangContext cannot be accessed here
const translations = {
    en: {
        fallbackTitle: 'New Notification - SmartEvent',
        bookingTitle: 'Booking Successful! 🎉',
        bookingBody: 'Your ticket has been successfully booked.',
        eventUpdatedTitle: 'Event Updated 📅',
        eventUpdatedBody: (title: string) => `The event "${title}" was updated by the organizer.`
    },
    fr: {
        fallbackTitle: 'Nouvelle notification - SmartEvent',
        bookingTitle: 'Réservation Réussie ! 🎉',
        bookingBody: 'Votre billet a été réservé avec succès.',
        eventUpdatedTitle: 'Événement Mis à Jour 📅',
        eventUpdatedBody: (title: string) => `L'événement "${title}" a été mis à jour par l'organisateur.`
    }
};

export async function createNotification(userId: string, messageString: string, eventId?: string) {
    try {
        await db.insert(notifications).values({
            userId,
            message: messageString,
            eventId,
        });

        // Default language for push notifications
        // Note: For true per-user localization in the future, you would need to add a 'language' column to the users table
        const userLang: 'en' | 'fr' = 'en';
        const t = translations[userLang];

        let pushTitle = t.fallbackTitle;
        let pushBody = messageString;

        try {
            const parsed = JSON.parse(messageString);
            if (parsed.type === 'BOOKING_CONFIRMED') {
                pushTitle = t.bookingTitle;
                pushBody = t.bookingBody;
            } else if (parsed.type === 'EVENT_UPDATED') {
                pushTitle = t.eventUpdatedTitle;
                pushBody = t.eventUpdatedBody(parsed.eventTitle || '');
            }
        } catch(e) {}

        const subs = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));

        const payload = JSON.stringify({
            title: pushTitle,
            body: pushBody,
            url: '/profile'
        });

        for (const sub of subs) {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            };

            try {
                await webpush.sendNotification(pushSubscription, payload);
            } catch (err: any) {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
                } else {
                    console.error('Error sending push notification:', err);
                }
            }
        }

    } catch (error) {
        console.error('Error in the notification process:', error);
    }
}