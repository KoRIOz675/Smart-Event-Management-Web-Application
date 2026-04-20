import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/');
      } else {
        fetchAdminStats();
      }
    }
  }, [user, authLoading, router]);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Erreur stats", err);
    } finally {
      setLoadingData(false);
    }
  };
  if (authLoading || (!user || user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="animate-pulse font-bold text-slate-400">Vérification des accès...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Head>
        <title>{`Admin | SmartEvent`}</title>
      </Head>
      <NavBar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-10">Dashboard Admin</h1>

        {loadingData ? (
          <p>Chargement des statistiques...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-bold uppercase">Utilisateurs</p>
              <p className="text-4xl font-black mt-2">{stats?.totalUsers}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-bold uppercase">Événements</p>
              <p className="text-4xl font-black mt-2">{stats?.totalEvents}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-bold uppercase">Réservations</p>
              <p className="text-4xl font-black mt-2">{stats?.totalBookings}</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}