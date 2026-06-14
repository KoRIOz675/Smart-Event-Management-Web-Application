import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function EditEvent() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();
  
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.push('/');
    if (id) fetchEvent();
  }, [id, authLoading]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${id}`);
      const data = await res.json();
      
      setEventData({
        ...data,
        start_date: formatDateForInput(data.startDate || data.start_date),
        end_date: formatDateForInput(data.endDate || data.end_date),
        ticket_types: data.ticket_types || [{ name: 'Standard', price: 0, quantity_available: data.capacity }]
      });
      if (data.imageUrl || data.image_url) {
        setImagePreview(data.imageUrl || data.image_url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setEventData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleTicketChange = (index: number, field: string, value: any) => {
    const newTickets = [...eventData.ticket_types];
    newTickets[index][field] = value;
    setEventData((prev: any) => ({ ...prev, ticket_types: newTickets }));
  };

  const addTicketType = () => {
    setEventData((prev: any) => ({
      ...prev,
      ticket_types: [...prev.ticket_types, { name: 'Nouveau Ticket', price: 0, quantity_available: 0 }]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageUrl = eventData.imageUrl || eventData.image_url || null;
    if (imageFile) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }
    }

    try {
      const res = await fetch('/api/admin/events/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...eventData, image_url: imageUrl }),
      });
      if (res.ok) {
        alert("Événement mis à jour avec succès !");
        router.push('/admin');
      }
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold animate-pulse">Chargement de l'événement...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head><title>Admin | Modifier l'événement</title></Head>
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <button onClick={() => router.back()} className="mb-6 text-sm font-bold text-primary hover:underline">
          ← Retour au Dashboard
        </button>
        
        <h1 className="text-4xl font-black mb-8">Modifier l'événement</h1>

        <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-card rounded-radius-4xl shadow-xl border border-border">
          
          <div className="space-y-4 border-b border-border pb-6">
            <h2 className="text-xl font-bold text-primary italic">Informations Générales</h2>
            <input
              type="text" name="title" placeholder="Titre de l'événement" required
              value={eventData.title} onChange={handleChange}
              className="w-full p-4 rounded-radius-2xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none font-bold"
            />
            <textarea
              name="description" placeholder="Description détaillée" rows={4} required
              value={eventData.description} onChange={handleChange}
              className="w-full p-4 rounded-radius-2xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none"
            />
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-2 block">Image de couverture</label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-radius-2xl cursor-pointer hover:border-primary/60 transition overflow-hidden relative bg-input">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <span className="text-3xl">🖼️</span>
                    <span className="text-sm font-medium">Cliquer pour changer (max 5 Mo)</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
              </label>
              {imagePreview && (
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); setEventData((p: any) => ({ ...p, imageUrl: null, image_url: null })); }}
                  className="mt-2 text-xs text-destructive hover:underline">
                  Supprimer l'image
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text" name="location" placeholder="Lieu ou URL" required
                value={eventData.location} onChange={handleChange}
                className="w-full p-4 rounded-radius-2xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none font-bold"
              />
              <select
                name="category" value={eventData.category} onChange={handleChange}
                className="w-full p-4 rounded-radius-2xl bg-input border border-border outline-none font-bold"
              >
                <option value="Technologie">Technologie</option>
                <option value="Musique">Musique</option>
                <option value="Business">Business</option>
                <option value="Gastronomie">Gastronomie</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 border-b border-border pb-6">
             <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Début</label>
                <input type="datetime-local" name="start_date" required
                  value={eventData.start_date} onChange={handleChange}
                  className="w-full p-3 rounded-radius-xl bg-input border border-border outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Fin</label>
                <input type="datetime-local" name="end_date" required
                  value={eventData.end_date} onChange={handleChange}
                  className="w-full p-3 rounded-radius-xl bg-input border border-border outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Capacité Totale</label>
                <input type="number" name="capacity" required
                  value={eventData.capacity}
                  onChange={(e) => setEventData({ ...eventData, capacity: parseInt(e.target.value) })}
                  className="w-full p-3 rounded-radius-xl bg-input border border-border outline-none font-bold"
                />
              </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary italic">Gestion des Tickets</h2>
            {eventData.ticket_types.map((ticket: any, index: number) => (
              <div key={index} className="p-4 border border-border rounded-radius-2xl bg-secondary/20 flex flex-wrap gap-4 items-center">
                <input
                  type="text" placeholder="Nom" value={ticket.name} required
                  onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                  className="flex-1  p-2 bg-transparent border-b border-border outline-none font-bold"
                />
                <input
                  type="number" placeholder="Prix" step="0.01" value={ticket.price} required
                  onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                  className="w-24 p-2 bg-transparent border-b border-border outline-none text-center"
                />
                <input
                  type="number" placeholder="Qté" value={ticket.quantity_available} required
                  onChange={(e) => handleTicketChange(index, 'quantity_available', e.target.value)}
                  className="w-24 p-2 bg-transparent border-b border-border outline-none text-center"
                />
                <button 
                  type="button" 
                  onClick={() => setEventData({ ...eventData, ticket_types: eventData.ticket_types.filter((_: any, i: number) => i !== index)})}
                  className="text-destructive font-bold px-2"
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={addTicketType} className="text-sm font-bold text-primary">+ Ajouter un type de ticket</button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground p-5 rounded-radius-2xl font-black shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Sauvegarde..." : "Enregistrer les modifications"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}