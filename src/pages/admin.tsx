import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'events'>('users');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/');
      } else {
        fetchAllData();
      }
    }
  }, [user, authLoading, router]);

  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/admin/stats');
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Erreur chargement admin:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleRoleChange = async (targetUserId: string, newRole: string) => {
    if (targetUserId === user?.id) {
      alert("Action impossible : vous ne pouvez pas modifier votre propre rôle.");
      return;
    }

    setUpdatingId(targetUserId);
    try {
      const res = await fetch('/api/admin/update-role', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId, newRole }),
      });

      if (res.ok) {
        setData((prev: any) => ({
          ...prev,
          allUsers: prev.allUsers.map((u: any) => 
            u.id === targetUserId ? { ...u, role: newRole } : u
          )
        }));
      }
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setUpdatingId(null);
    }
  };


  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet événement ?")) return;

    try {
      const res = await fetch(`/api/admin/events/delete?eventId=${eventId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setData((prev: any) => ({
          ...prev,
          allEvents: prev.allEvents.filter((e: any) => e.id !== eventId),
          totalEvents: prev.totalEvents - 1
        }));
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  if (authLoading || (!user || user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400 animate-pulse">
        Vérification des accès administrateur...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Head>
        <title>{`Console Admin | SmartEvent`}</title>
      </Head>
      <NavBar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight">Dashboard Admin</h1>
          <p className="text-slate-500 mt-2 font-medium">Gestion globale des utilisateurs et des événements.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Membres" value={data?.totalUsers} icon="👥" color="text-blue-600" bg="bg-blue-100" />
          <StatCard title="Événements" value={data?.totalEvents} icon="📅" color="text-purple-600" bg="bg-purple-100" />
          <StatCard title="Réservations" value={data?.totalBookings} icon="🎟️" color="text-emerald-600" bg="bg-emerald-100" />
        </div>

        <div className="flex gap-8 mb-8 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-2 font-bold text-sm transition-all ${activeTab === 'users' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-slate-400'}`}
          >
            👥 Gestion Utilisateurs
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`pb-4 px-2 font-bold text-sm transition-all ${activeTab === 'events' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-slate-400'}`}
          >
            📅 Gestion Événements
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden ">
          {loadingData ? (
            <div className="flex items-center justify-center h-64 text-slate-400 font-medium italic">
              Synchronisation avec la base de données...
            </div>
          ) : activeTab === 'users' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-5">Nom / Email</th>
                  <th className="px-6 py-5">Rôle</th>
                  <th className="px-6 py-5 text-right">Modifier Rôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.allUsers?.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{u.fullName}</div>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                        u.role === 'admin' ? 'bg-red-500 text-white' : 
                        u.role === 'organizer' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={u.role}
                        disabled={updatingId === u.id || u.id === user.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-30"
                      >
                        <option value="attendee">Attendee</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-5">Événement / Catégorie</th>
                  <th className="px-6 py-5">Organisateur</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.allEvents?.map((e: any) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{e.title}</div>
                      <div className="text-[10px] font-black uppercase text-blue-600">{e.category}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                      {e.organizerName || "Inconnu"}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs font-mono">
                      {new Date(e.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => router.push(`/admin/edit-event/${e.id}`)}
                          className="w-20 h-8 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-all"
                          title="Voir"
                        >
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(e.id)}
                          className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all text-sm"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 transition-all hover:shadow-md">
      <div className={`${bg} ${color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-black text-slate-900 mt-1">{value || 0}</p>
      </div>
    </div>
  );
}