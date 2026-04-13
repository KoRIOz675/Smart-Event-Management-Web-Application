import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { event_id, user_id } = req.body;

   try {
    const eventCheck = await pool.query('SELECT capacity FROM events WHERE id = $1', [event_id]);
    if (!eventCheck.rows[0]) {
        return res.status(404).json({ message: "Événement non trouvé." });
    }
    if (eventCheck.rows[0].capacity <= 0) {
      return res.status(400).json({ message: "Désolé, cet événement est complet." });
    }

    const existingBookingCheck = await pool.query(
        `
        SELECT b.id 
        FROM bookings b
        JOIN ticket_types tt ON b.ticket_type_id = tt.id
        WHERE b.user_id = $1 AND tt.event_id = $2
        `,
        [user_id, event_id]
    );

    if (existingBookingCheck.rows.length > 0) {
        return res.status(409).json({ message: "Vous avez déjà réservé un ticket pour cet événement." });
    }

    const ticketType = await pool.query('SELECT id FROM ticket_types WHERE event_id = $1 LIMIT 1', [event_id]);
    
    if (!ticketType.rows[0]) {
        return res.status(400).json({ message: "Aucun type de ticket disponible pour cet événement." });
    }

    await pool.query(
      'INSERT INTO bookings (user_id, ticket_type_id, status) VALUES ($1, $2, $3)',
      [user_id, ticketType.rows[0].id, 'confirmed']
    );
    await pool.query('UPDATE events SET capacity = capacity - 1 WHERE id = $1', [event_id]);

    return res.status(201).json({ message: "Réservation confirmée !" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la réservation." });
  }
}