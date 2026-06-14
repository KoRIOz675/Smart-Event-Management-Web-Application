import React, { useState } from 'react';

interface Props {
    eventTitle: string;
    price: number;
    p: any; // payment translations
    onSuccess: () => void;
    onCancel: () => void;
}

export default function PaymentModal({ eventTitle, price, p, onSuccess, onCancel }: Props) {
    const [name, setName] = useState('');
    const [card, setCard] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

    const formatCard = (v: string) =>
        v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

    const formatExpiry = (v: string) => {
        const digits = v.replace(/\D/g, '').slice(0, 4);
        return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    };

    const isValid =
        name.trim().length >= 2 &&
        card.replace(/\s/g, '').length === 16 &&
        expiry.length === 5 &&
        cvv.replace(/\D/g, '').length >= 3;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        setStep('processing');
        setTimeout(() => {
            setStep('success');
            setTimeout(onSuccess, 1500);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-card border border-border rounded-radius-4xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-primary px-8 pt-8 pb-6 text-primary-foreground">
                    <div className="flex items-center gap-3 mb-1">
                        <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="font-black text-lg">{p?.title || 'Secure Payment'}</span>
                    </div>
                    <p className="text-primary-foreground/60 text-xs">{p?.subtitle || 'Simulation — no real charge'}</p>
                    <div className="mt-4 flex justify-between items-end">
                        <span className="text-sm opacity-70 truncate max-w-[200px]">{eventTitle}</span>
                        <span className="text-3xl font-black">{price.toFixed(2)} €</span>
                    </div>
                </div>

                {/* Body */}
                <div className="px-8 py-6">
                    {step === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-3xl">✓</div>
                            <p className="font-black text-xl text-green-600 dark:text-green-400">{p?.successTitle || 'Payment accepted!'}</p>
                            <p className="text-sm text-muted-foreground">{p?.successMsg || 'Finalising your booking…'}</p>
                        </div>
                    ) : step === 'processing' ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="font-bold text-muted-foreground">{p?.processing || 'Processing...'}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">{p?.nameLabel || 'Name on card'}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder={p?.namePlaceholder || 'John Doe'}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-radius-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            {/* Card number */}
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">{p?.cardLabel || 'Card number'}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={card}
                                        onChange={e => setCard(formatCard(e.target.value))}
                                        placeholder={p?.cardPlaceholder || '1234 5678 9012 3456'}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-radius-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12 font-mono"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">💳</span>
                                </div>
                            </div>

                            {/* Expiry + CVV */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">{p?.expiryLabel || 'Expiry'}</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={expiry}
                                        onChange={e => setExpiry(formatExpiry(e.target.value))}
                                        placeholder={p?.expiryPlaceholder || 'MM/YY'}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-radius-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">{p?.cvvLabel || 'CVV'}</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={cvv}
                                        onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        placeholder={p?.cvvPlaceholder || '123'}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-radius-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="flex-1 py-3 border border-border rounded-radius-xl text-sm font-bold hover:bg-secondary transition"
                                >
                                    {p?.cancel || 'Cancel'}
                                </button>
                                <button
                                    type="submit"
                                    disabled={!isValid}
                                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-radius-xl text-sm font-black hover:opacity-90 transition disabled:opacity-40"
                                >
                                    {p?.pay || 'Pay'} — {price.toFixed(2)} €
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
