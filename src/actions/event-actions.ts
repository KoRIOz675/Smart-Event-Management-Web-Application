"use server";

import { query } from "@/lib/db";

export async function getOrganizerEvents(organizerId: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!organizerId || !uuidRegex.test(organizerId)) {
    console.warn("ID d'organisateur invalide ou manquant");
    return [];
  }

  try {
    const result = await query(
      `SELECT 
        e.id, 
        e.title, 
        e.start_date, 
        e.capacity,
        e.location,
        COUNT(b.id) as total_bookings
      FROM events e
      LEFT JOIN ticket_types tt ON e.id = tt.event_id
      LEFT JOIN bookings b ON tt.id = b.ticket_type_id
      WHERE e.organizer_id = $1
      GROUP BY e.id, e.title, e.start_date, e.capacity, e.location
      ORDER BY e.created_at DESC`,
      [organizerId]
    );
    return result.rows;
  } catch (error) {
    console.error("Erreur base de données:", error);
    return [];
  }
}


export async function createEvent(formData: FormData, organizerId: string) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const capacity = parseInt(formData.get("capacity") as string);
  const price = parseFloat(formData.get("price") as string) || 0;

  try {
    await query("BEGIN");

    const eventResult = await query(
      `INSERT INTO events (organizer_id, title, description, location, start_date, end_date, capacity)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [organizerId, title, description, location, startDate, endDate, capacity]
    );

    const eventId = eventResult.rows[0].id;

    await query(
      `INSERT INTO ticket_types (event_id, name, price, quantity_available)
       VALUES ($1, $2, $3, $4)`,
      [eventId, "Standard", price, capacity]
    );

    await query("COMMIT");
    return { success: true, eventId };
  } catch (error) {
    await query("ROLLBACK");
    console.error("Erreur création évènement:", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}