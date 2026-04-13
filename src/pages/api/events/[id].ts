import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') return res.status(405).end();

  try {
    const query = `
      SELECT e.*, u.full_name as organizer_name, 
             (SELECT MIN(price) FROM ticket_types WHERE event_id = e.id) as price
      FROM events e
      JOIN users u ON e.organizer_id = u.id
      WHERE e.id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}