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
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

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
    try {
      const res = await fetch('/api/admin/stats');
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Erreur lors du chargement des données admin", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleRoleChange = async (targetUserId: string, newRole: string) => {
    if (targetUserId === user?.id) {
      alert("Vous ne pouvez pas modifier votre propre rôle pour éviter de perdre l'accès à l'administration.");
      return;
    }

    setUpdatingUserId(targetUserId);
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
      } else {
        const error = await res.json();
        alert(error.message || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      alert("Erreur réseau");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (authLoading || (!user || user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400 animate-pulse">
        Vérification des droits d'accès...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Head>
        <title>{`Panel Admin | SmartEvent`}</title>
      </Head>
      <NavBar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight">Espace Administration</h1>
          <p className="text-slate-500 mt-2">Gérez les membres et visualisez l'activité de la plateforme.</p>
        </header>

        {loadingData ? (
          <div className="text-center py-20 font-medium text-slate-400">Chargement de la base de données...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard title="Utilisateurs" value={data?.totalUsers} icon="👥" color="text-blue-600" bg="bg-blue-100" />
              <StatCard title="Événements" value={data?.totalEvents} icon="📅" color="text-purple-600" bg="bg-purple-100" />
              <StatCard title="Réservations" value={data?.totalBookings} icon="🎟️" color="text-emerald-600" bg="bg-emerald-100" />
            </div>

            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold">Gestion des membres</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                      <th className="px-6 py-4">Utilisateur</th>
                      <th className="px-6 py-4">Rôle Actuel</th>
                      <th className="px-6 py-4 text-right">Modifier le rôle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {data?.allUsers?.map((u: any) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-700">{u.fullName}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                            u.role === 'admin' ? 'bg-red-100 text-red-600' : 
                            u.role === 'organizer' ? 'bg-amber-100 text-amber-600' : 
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select
                            value={u.role}
                            disabled={updatingUserId === u.id || u.id === user.id}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
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
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
      <div className={`${bg} ${color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black mt-1">{value}</p>
      </div>
    </div>
  );
}