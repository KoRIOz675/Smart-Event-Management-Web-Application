import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { feedbacks } from '@/lib/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const { event_id, user_id, rating, comment } = req.body;

    if (!event_id || !user_id || rating == null) {
        return res.status(400).json({ message: "Champs requis manquants." });
    }

    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ message: "La note doit être entre 1 et 5." });
    }

    try {
        await db.insert(feedbacks).values({
            eventId: event_id,
            userId: user_id,
            rating: ratingNum,
            comment: comment || null,
        });

        return res.status(201).json({ message: "Avis envoyé avec succès." });
    } catch (error: any) {
        if (error?.code === '23505') {
            return res.status(409).json({ message: "Vous avez déjà laissé un avis pour cet événement." });
        }
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de l'envoi de l'avis." });
    }
}
