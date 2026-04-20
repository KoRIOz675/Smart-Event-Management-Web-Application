import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib';
import { events, ticketTypes } from '@/lib/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { 
    organizer_id, 
    title, 
    description, 
    location, 
    start_date, 
    end_date, 
    category, 
    capacity, 
    ticket_types 
  } = req.body;

  try {
    const newEventId = await db.transaction(async (tx) => {
      
      const [insertedEvent] = await tx.insert(events).values({
        organizerId: organizer_id,
        title,
        description,
        location,
        startDate: new Date(start_date), 
        endDate: new Date(end_date),     
        capacity: parseInt(capacity),
        category,
      }).returning({ id: events.id });

      const eventId = insertedEvent.id;

      if (ticket_types && Array.isArray(ticket_types) && ticket_types.length > 0) {
        const ticketsToInsert = ticket_types.map((ticket: any) => ({
          eventId: eventId,
          name: ticket.name,
          price: ticket.price.toString(), 
          quantityAvailable: parseInt(ticket.quantity_available),
        }));

        await tx.insert(ticketTypes).values(ticketsToInsert);
      } else {
        await tx.insert(ticketTypes).values({
          eventId: eventId,
          name: 'Standard',
          price: "0.00",
          quantityAvailable: parseInt(capacity),
        });
      }

      return eventId;
    });

    return res.status(201).json({ 
      message: "Événement créé avec succès", 
      eventId: newEventId 
    });

  } catch (error) {
    console.error("Erreur lors de la création de l'événement :", error);
    return res.status(500).json({ message: "Erreur serveur lors de la création." });
  }
}