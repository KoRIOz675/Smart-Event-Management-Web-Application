import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import Messages from '@/components/messages';
import OrganizerConversations from '@/components/OrganizerConversations';
import PaymentModal from '@/components/PaymentModal';

interface Feedback {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    userId: string;
    userName: string;
}

export default function EventDetails() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth();
    const { t, lang } = useLang();
    const d = t.eventDetails;
    const chatTrans = (t as any).chat; // Fallback helper for chat translation block

    const fb = (t as any).feedback;
    const p = (t as any).payment;

    const [showPayment, setShowPayment] = useState(false);

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/events/${id}`)
            .then(res => res.json())
            .then(data => {
                const eventData = Array.isArray(data) ? data[0] : data;

                if (!eventData || eventData.error || eventData.message) {
                    setMessage(d.notFound);
                    setEvent(null);
                } else {
                    setEvent(eventData);
                }
                setLoading(false);
            })
            .catch(() => {
                setMessage(d.loadError);
                setEvent(null);
                setLoading(false);
            });
    }, [id, d.notFound, d.loadError]);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/feedbacks/${id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setFeedbackList(data);
                    if (user) {
                        setAlreadyReviewed(data.some((f: Feedback) => f.userId === user.id));
                    }
                }
            })
            .catch(() => {});
    }, [id, user]);

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || userRating === 0) return;

        setFeedbackSubmitting(true);
        setFeedbackMsg('');

        try {
            const res = await fetch('/api/feedbacks/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_id: id,
                    user_id: user.id,
                    rating: userRating,
                    comment: userComment.trim() || null,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setFeedbackMsg(fb?.successMsg || 'Review submitted!');
                setAlreadyReviewed(true);
                const newFeedback: Feedback = {
                    id: Date.now().toString(),
                    rating: userRating,
                    comment: userComment.trim() || null,
                    createdAt: new Date().toISOString(),
                    userId: user.id,
                    userName: (user as any).fullName || (user as any).full_name || 'You',
                };
                setFeedbackList(prev => [newFeedback, ...prev]);
            } else {
                setFeedbackMsg(data.message || fb?.errorMsg || 'Error.');
            }
        } catch {
            setFeedbackMsg(fb?.errorMsg || 'Error.');
        } finally {
            setFeedbackSubmitting(false);
        }
    };

    const confirmBooking = async () => {
        setBookingLoading(true);
        setMessage('');
        setShowPayment(false);

        try {
            const res = await fetch('/api/bookings/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_id: id, user_id: user!.id }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(d.successMsg);
                setTimeout(() => router.push('/profile'), 2000);
            } else {
                setMessage(data.message || d.bookingError);
            }
        } catch {
            setMessage(d.networkError);
        } finally {
            setBookingLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            setMessage(d.loginRedirectMsg);
            return router.push('/login');
        }

        if (displayPrice > 0) {
            setShowPayment(true);
            return;
        }

        confirmBooking();
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center font-black uppercase tracking-widest text-primary animate-pulse">
            <NavBar />
            <div className="flex-1 flex items-center">{d.loading}</div>
        </div>
    );

    if (!event) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center font-bold text-destructive">
            <NavBar />
            <div className="flex-1 flex items-center">{message || d.notFound}</div>
        </div>
    );

    const displayTitle = event.title || event.event_title || 'Untitled Event';
    const displayCategory = event.category || 'General';
    const displayOrganizer = event.organizer_name || 'SmartEvent Organizer';
    const displayPrice = parseFloat(event.price || 0);
    const organizerId = event.organizerId ?? event.organizer_id ?? null;

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Head>
                <title>{displayTitle} | SmartEvent</title>
            </Head>
            <NavBar />

            <main className="max-w-5xl mx-auto px-4 py-12">
                <div className="h-64 md:h-96 bg-muted rounded-radius-4xl mb-8 flex items-center justify-center text-8xl shadow-inner border border-border overflow-hidden">
                    {event.imageUrl || event.image_url ? (
                        <img
                            src={event.imageUrl || event.image_url}
                            alt={displayTitle}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        displayCategory.toLowerCase().includes('tech') ? '💻' :
                        displayCategory.toLowerCase().includes('musi') ? '🎵' : '📅'
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{displayTitle}</h1>

                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">
                                {displayCategory}
                            </span>
                            <span className="text-muted-foreground text-sm italic">
                                {d.organizedBy} <span className="text-foreground font-bold">{displayOrganizer}</span>
                            </span>
                        </div>

                        <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">{d.about}</h2>
                        <p className="text-muted-foreground leading-relaxed mb-8 text-lg whitespace-pre-wrap">
                            {event.description || 'No description provided.'}
                        </p>

                        <div className="p-6 bg-card rounded-radius-2xl border border-border">
                            <h3 className="font-bold mb-2">{d.location}</h3>
                            <p className="text-muted-foreground">{event.location || 'Location TBD'}</p>
                            <p className="text-xs mt-2 text-muted-foreground italic font-medium">
                                {d.dateTime} {formatDateTime(event.startDate ?? event.start_date)}
                            </p>
                        </div>

                        {/* Attendee Messaging View */}
                        {user && organizerId && organizerId !== user.id && (
                            <div className="mt-8">
                                <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">
                                    {chatTrans?.contactOrganizer || (lang === 'fr' ? "Contacter l'organisateur" : "Contact Organizer")}
                                </h2>
                                <Messages
                                    eventId={id as string}
                                    currentUserId={user.id}
                                    targetUserId={organizerId}
                                />
                            </div>
                        )}

                        {/* Organizer Messaging View */}
                        {user && organizerId === user.id && (
                            <div className="mt-8">
                                <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">
                                    {chatTrans?.attendeeMessages || (lang === 'fr' ? "Messages des participants" : "Attendee Messages")}
                                </h2>
                                <OrganizerConversations
                                    eventId={id as string}
                                    organizerId={user.id}
                                />
                            </div>
                        )}

                        {/* Feedback & Reviews */}
                        <div className="mt-8">
                            <div className="flex items-center gap-4 mb-4 border-b border-border pb-2">
                                <h2 className="text-xl font-bold">{fb?.title || 'Reviews'}</h2>
                                {feedbackList.length > 0 && (
                                    <span className="text-sm text-muted-foreground">
                                        {(feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1)} ★ · {feedbackList.length} {fb?.reviews || 'reviews'}
                                    </span>
                                )}
                            </div>

                            {/* Submit form */}
                            {!user ? (
                                <p className="text-sm text-muted-foreground italic mb-4">{fb?.loginRequired || 'Log in to leave a review.'}</p>
                            ) : organizerId === user.id ? null : alreadyReviewed ? (
                                <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-4">{fb?.alreadyReviewed || 'You have already reviewed this event.'}</p>
                            ) : (
                                <form onSubmit={handleFeedbackSubmit} className="mb-6 p-4 bg-card border border-border rounded-radius-2xl space-y-3">
                                    <p className="font-semibold text-sm">{fb?.yourReview || 'Leave a review'}</p>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setUserRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                                            >
                                                <span className={(hoverRating || userRating) >= star ? 'text-yellow-400' : 'text-muted-foreground/30'}>★</span>
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={userComment}
                                        onChange={e => setUserComment(e.target.value)}
                                        placeholder={fb?.commentPlaceholder || 'Share your experience (optional)...'}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-radius-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    {feedbackMsg && (
                                        <p className={`text-sm font-medium ${feedbackMsg === (fb?.successMsg || 'Review submitted!') ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                                            {feedbackMsg}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={feedbackSubmitting || userRating === 0}
                                        className="px-5 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-radius-xl hover:opacity-90 transition disabled:opacity-50"
                                    >
                                        {feedbackSubmitting ? (fb?.submitting || 'Submitting...') : (fb?.submit || 'Submit review')}
                                    </button>
                                </form>
                            )}

                            {/* Reviews list */}
                            {feedbackList.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">{fb?.noReviews || 'No reviews yet. Be the first!'}</p>
                            ) : (
                                <div className="space-y-3">
                                    {feedbackList.map(feedback => (
                                        <div key={feedback.id} className="p-4 bg-card border border-border rounded-radius-2xl">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-sm">{feedback.userName}</span>
                                                <span className="text-yellow-400 text-sm">{'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}</span>
                                            </div>
                                            {feedback.comment && (
                                                <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground/60 mt-1">
                                                {new Date(feedback.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="sticky top-24 p-8 bg-card border border-border rounded-radius-4xl shadow-xl text-center">
                            <p className="text-sm text-muted-foreground uppercase font-bold mb-2">{d.entryFee}</p>
                            <p className="text-4xl font-black mb-6">
                                {displayPrice === 0 ? d.free : `${displayPrice}€`}
                            </p>

                            {user ? (
                                <button
                                    onClick={handleBooking}
                                    disabled={bookingLoading || event.capacity <= 0}
                                    className="w-full bg-primary text-primary-foreground py-4 rounded-radius-2xl font-bold hover:opacity-90 transition shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                                >
                                    {bookingLoading ? d.processing : event.capacity > 0 ? d.reserve : d.soldOut}
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-xs text-destructive/80 italic font-bold">
                                        {d.loginRequired}
                                    </p>
                                    <button
                                        onClick={() => router.push('/login')}
                                        className="w-full bg-secondary text-foreground py-4 rounded-radius-2xl font-bold hover:bg-border transition active:scale-95"
                                    >
                                        {d.loginBtn}
                                    </button>
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-border space-y-3">
                                {message && (
                                    <p className={`text-center text-sm font-bold p-3 rounded-radius-xl ${
                                        message === d.successMsg
                                            ? 'text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                            : 'text-destructive bg-destructive/10 border border-destructive/20'
                                    }`}>
                                        {message}
                                    </p>
                                )}
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">{d.spotsLeft}</span>
                                    <span className="font-bold text-primary text-sm">{event.capacity ?? 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {showPayment && (
                <PaymentModal
                    eventTitle={displayTitle}
                    price={displayPrice}
                    p={p}
                    onSuccess={confirmBooking}
                    onCancel={() => setShowPayment(false)}
                />
            )}
        </div>
    );
}