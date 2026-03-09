import { query } from "@/lib/db";
import Link from "next/link";

export default async function HomePage() {
  const result = await query(
    "SELECT * FROM events WHERE start_date > NOW() ORDER BY start_date LIMIT 6"
  );
  const events = result.rows;

  return (
    <div className="space-y-10">
      <section className="text-center py-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          Gérez vos événements intelligemment
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          La plateforme centralisée pour la création, la billetterie et le feedback[cite: 4].
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event: any) => (
          <div key={event.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="h-48 bg-gray-200">
              {event.image_url && <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-xl">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-semibold">{event.location}</span>
                <Link href={`/events/${event.id}`} className="text-sm font-medium underline">
                  Voir plus
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}