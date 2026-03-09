import { getOrganizerEvents } from "@/actions/event-actions";
import Link from "next/link";

export default async function DashboardPage() {
  const organizerId = "METTRE_TON_UUID_ICI"; 
  const events = await getOrganizerEvents(organizerId);

  const totalEvents = events.length;
  const totalParticipants = events.reduce((acc, curr) => acc + parseInt(curr.total_bookings), 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <Link href="/events/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Nouvel Événement
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 uppercase font-bold">Événements Actifs</p>
          <p className="text-3xl font-black text-blue-600">{totalEvents}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 uppercase font-bold">Total Inscriptions</p>
          <p className="text-3xl font-black text-green-600">{totalParticipants}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 uppercase font-bold">Note Moyenne</p>
          <p className="text-3xl font-black text-yellow-500"></p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold">Mes Événements</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4">Nom</th>
              <th className="p-4">Date</th>
              <th className="p-4">Lieu</th>
              <th className="p-4">Remplissage</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{event.title}</td>
                <td className="p-4 text-gray-600">{new Date(event.start_date).toLocaleDateString()}</td>
                <td className="p-4 text-gray-600">{event.location}</td>
                <td className="p-4">
                   <div className="w-full bg-gray-200 rounded-full h-2 w-24">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(event.total_bookings / event.capacity) * 100}%` }}
                      ></div>
                   </div>
                   <span className="text-xs text-gray-500">{event.total_bookings} / {event.capacity}</span>
                </td>
                <td className="p-4">
                  <Link href={`/events/${event.id}`} className="text-blue-600 hover:underline">Gérer</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}