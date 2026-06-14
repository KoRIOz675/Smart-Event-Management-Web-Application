import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

function toICSDate(dateStr: string) {
    return new Date(dateStr).toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
}
function googleCalendarUrl(ticket: any) {
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: ticket.event_title,
        dates: `${toICSDate(ticket.start_date)}/${toICSDate(ticket.end_date || ticket.start_date)}`,
        location: ticket.location || '',
    });
    return `https://calendar.google.com/calendar/render?${params}`;
}
function outlookCalendarUrl(ticket: any) {
    const params = new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        subject: ticket.event_title,
        startdt: new Date(ticket.start_date).toISOString(),
        enddt: new Date(ticket.end_date || ticket.start_date).toISOString(),
        location: ticket.location || '',
    });
    return `https://outlook.live.com/calendar/0/action/compose?${params}`;
}
function downloadICS(ticket: any) {
    const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SmartEvent//EN',
        'BEGIN:VEVENT',
        `UID:${ticket.id}@smartevent`,
        `DTSTART:${toICSDate(ticket.start_date)}`,
        `DTEND:${toICSDate(ticket.end_date || ticket.start_date)}`,
        `SUMMARY:${ticket.event_title}`,
        `LOCATION:${ticket.location || ''}`,
        'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ticket.event_title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function MyTickets() {
  const { user, loading: authLoading } = useAuth();
  const { t, lang } = useLang();
  const m = t.ticketsPage;
  const cal = (t as any).calendar;

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/bookings/user?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setTickets(data));
    }
  }, [user]);

  if (authLoading) return <div className="p-20 text-center">{m.loading}</div>;
  if (!user) return <div className="p-20 text-center">{m.loginRequired}</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black mb-8">{m.pageTitle}</h1>

        <div className="space-y-6">
          {tickets.length > 0 ? tickets.map((ticket: any) => (
            <div key={ticket.id} className="bg-card border-l-8 border-l-primary border border-border p-6 rounded-radius-2xl shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-bold">{ticket.event_title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {new Date(ticket.start_date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
                  </p>
                  <span className="text-[10px] bg-secondary px-2 py-1 rounded mt-2 inline-block font-bold uppercase text-primary">
                    {ticket.status}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground uppercase font-bold">{m.location}</p>
                  <p className="font-medium">{ticket.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-wrap mt-4 pt-4 border-t border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">{cal?.addTo || 'Add to calendar'}:</span>
                <a href={googleCalendarUrl(ticket)} target="_blank" rel="noopener noreferrer"
                  className="px-2 py-1 text-[10px] font-bold bg-secondary hover:bg-primary hover:text-primary-foreground rounded-lg transition-all">
                  {cal?.google || 'Google'}
                </a>
                <a href={outlookCalendarUrl(ticket)} target="_blank" rel="noopener noreferrer"
                  className="px-2 py-1 text-[10px] font-bold bg-secondary hover:bg-primary hover:text-primary-foreground rounded-lg transition-all">
                  {cal?.outlook || 'Outlook'}
                </a>
                <button onClick={() => downloadICS(ticket)}
                  className="px-2 py-1 text-[10px] font-bold bg-secondary hover:bg-primary hover:text-primary-foreground rounded-lg transition-all">
                  {cal?.ical || 'iCal'}
                </button>
              </div>
            </div>
          )) : (
            <p className="text-muted-foreground italic">{m.noBookings}</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}