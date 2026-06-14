import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

interface TicketType {
  name: string;
  price: number;
  quantity_available: number;
}

interface EventData {
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  capacity: number;
  category: string;
  ticket_types: TicketType[];
}

export default function CreateEvent() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLang();
  const c = t.createEvent;

  const [eventData, setEventData] = useState<EventData>({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    capacity: 100,
    category: 'Technologie',
    ticket_types: [{ name: 'Standard', price: 10.00, quantity_available: 100 }],
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleTicketChange = (index: number, field: keyof TicketType, value: any) => {
    const newTickets = [...eventData.ticket_types];
    // @ts-ignore
    newTickets[index][field] = value;
    setEventData(prev => ({ ...prev, ticket_types: newTickets }));
  };

  const addTicketType = () => {
    setEventData(prev => ({
      ...prev,
      ticket_types: [...prev.ticket_types, { name: 'Standard', price: 0.00, quantity_available: 0 }]
    }));
  };

  const removeTicketType = (index: number) => {
    const newTickets = eventData.ticket_types.filter((_, i) => i !== index);
    setEventData(prev => ({ ...prev, ticket_types: newTickets }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    if (!user) {
      setMessage({ type: 'error', text: c.notLoggedIn });
      setIsSubmitting(false);
      return;
    }

    if (eventData.ticket_types.length === 0) {
      setMessage({ type: 'error', text: c.noTicketError });
      setIsSubmitting(false);
      return;
    }

    let imageUrl: string | null = null;
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
      const res = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...eventData, organizer_id: user.id, image_url: imageUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: `${c.successMsg} ${data.eventId}` });
        setTimeout(() => router.push('/explore'), 1500);
      } else {
        setMessage({ type: 'error', text: data.message || c.errorMsg });
      }
    } catch (err) {
      setMessage({ type: 'error', text: c.networkError });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">{c.loginRequired}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>{c.pageTitle}</title>
      </Head>
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black mb-2">{c.title}</h1>
        <p className="text-muted-foreground mb-8">{c.subtitle}</p>

        {message && (
          <div className={`p-4 rounded-radius-lg mb-6 ${message.type === 'success' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-card rounded-radius-4xl shadow-xl border border-border">
          <div className="space-y-4 border-b border-border pb-6">
            <h2 className="text-2xl font-bold text-primary">{c.generalInfo}</h2>

            <input
              type="text" name="title" placeholder={c.titlePlaceholder} required
              value={eventData.title} onChange={handleChange}
              className="w-full p-4 rounded-radius-2xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none"
            />

            <textarea
              name="description" placeholder={c.descPlaceholder} rows={4} required
              value={eventData.description} onChange={handleChange}
              className="w-full p-4 rounded-radius-2xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none"
            />

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                {(c as any).coverImage || 'Cover Image'}
              </label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-radius-2xl cursor-pointer hover:border-primary/60 transition overflow-hidden relative bg-input">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <span className="text-3xl">🖼️</span>
                    <span className="text-sm font-medium">{(c as any).coverImageHint || 'Click to upload (max 5 MB)'}</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
              </label>
              {imagePreview && (
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="mt-2 text-xs text-destructive hover:underline">
                  {(c as any).removeCover || 'Remove image'}
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text" name="location" placeholder={c.locationPlaceholder} required
                value={eventData.location} onChange={handleChange}
                className="w-full p-4 rounded-radius-2xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none"
              />
              <select
                name="category" value={eventData.category} onChange={handleChange} required
                className="w-full p-4 rounded-radius-2xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none appearance-none"
              >
                <option value="Technologie">{c.categories.tech}</option>
                <option value="Musique">{c.categories.music}</option>
                <option value="Business">{c.categories.business}</option>
                <option value="Culturel">{c.categories.cultural}</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">{c.startDate}</label>
                <input type="datetime-local" name="start_date" required
                  value={eventData.start_date} onChange={handleChange}
                  className="w-full p-4 rounded-radius-2xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">{c.endDate}</label>
                <input type="datetime-local" name="end_date" required
                  value={eventData.end_date} onChange={handleChange}
                  className="w-full p-4 rounded-radius-2xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">{c.capacity}</label>
                <input type="number" name="capacity" required min="1"
                  value={eventData.capacity}
                  onChange={(e) => setEventData({ ...eventData, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full p-4 rounded-radius-2xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Ticket Types */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">{c.ticketTypes}</h2>

            {eventData.ticket_types.map((ticket, index) => (
              <div key={index} className="p-5 border border-border rounded-radius-2xl bg-secondary/50 grid grid-cols-10 gap-3 items-center">
                <div className="col-span-10 sm:col-span-3">
                  <input
                    type="text" placeholder={c.ticketNamePlaceholder} value={ticket.name} required
                    onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                    className="w-full p-3 rounded-radius-lg bg-card border border-border text-foreground text-sm"
                  />
                </div>
                <div className="col-span-5 sm:col-span-3">
                  <input
                    type="number" placeholder={c.ticketPricePlaceholder} step="0.01" min="0" value={ticket.price} required
                    onChange={(e) => handleTicketChange(index, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full p-3 rounded-radius-lg bg-card border border-border text-foreground text-sm"
                  />
                </div>
                <div className="col-span-5 sm:col-span-3">
                  <input
                    type="number" placeholder={c.ticketQtyPlaceholder} min="0" value={ticket.quantity_available} required
                    onChange={(e) => handleTicketChange(index, 'quantity_available', parseInt(e.target.value) || 0)}
                    className="w-full p-3 rounded-radius-lg bg-card border border-border text-foreground text-sm"
                  />
                </div>
                <div className="col-span-10 sm:col-span-1 flex justify-end">
                  <button type="button" onClick={() => removeTicketType(index)} disabled={eventData.ticket_types.length === 1}
                    className="p-3 text-destructive hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <button type="button" onClick={addTicketType}
              className="w-full border border-primary/50 text-primary py-3 rounded-radius-xl font-bold hover:bg-primary/10 transition">
              {c.addTicket}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground p-4 rounded-radius-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/30 mt-6 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? c.submitting : c.submit}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}