import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const organizer_id = req.body.organizer_id; 

  const { title, description, location, start_date, end_date, category, capacity, ticket_types } = req.body;

  try {
    const eventInsertQuery = `
      INSERT INTO events (organizer_id, title, description, location, start_date, end_date, capacity, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;
    
    const eventResult = await pool.query(eventInsertQuery, [
        organizer_id, title, description, location, start_date, end_date, capacity, category
    ]);

    const newEventId = eventResult.rows[0].id;
    if (ticket_types && Array.isArray(ticket_types) && ticket_types.length > 0) {
        const ticketInsertQuery = `
            INSERT INTO ticket_types (event_id, name, price, quantity_available)
            VALUES ($1, $2, $3, $4);
        `;
        for (const ticket of ticket_types) {
            await pool.query(ticketInsertQuery, [
                newEventId, 
                ticket.name, 
                ticket.price, 
                ticket.quantity_available
            ]);
        }
    } else {
        await pool.query(
            'INSERT INTO ticket_types (event_id, name, price, quantity_available) VALUES ($1, $2, $3, $4)',
            [newEventId, 'Standard', 0.00, capacity]
        );
    }

    return res.status(201).json({ message: "Événement créé avec succès", eventId: newEventId });

  } catch (error) {
    console.error("Erreur lors de la création de l'événement :", error);
    return res.status(500).json({ message: "Erreur serveur lors de la création." });
  }
}