import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const { userId } = req.query;

  if (!userId) return res.status(400).json({ message: "ID utilisateur manquant." });

  try {
    const query = `
      SELECT 
        b.id,
        e.title AS event_title,
        e.location,
        e.start_date,
        b.status,
        tt.name AS ticket_type
      FROM bookings b
      JOIN ticket_types tt ON b.ticket_type_id = tt.id -- Jointure 1 : Bookings -> Ticket Types
      JOIN events e ON tt.event_id = e.id              -- Jointure 2 : Ticket Types -> Events
      WHERE b.user_id = $1
      ORDER BY e.start_date ASC
    `;
    
    const result = await pool.query(query, [userId]);
    
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur de récupération des tickets:", error);
    return res.status(500).json({ message: "Erreur lors de la récupération de vos billets." });
  }
}