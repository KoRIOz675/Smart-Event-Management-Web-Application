import React, { useState, useEffect, useRef } from 'react';
import { useLang } from '@/context/LangContext';

interface MessagesProps {
    eventId: string;
    currentUserId: string;
    targetUserId: string;
    hideOuterStyles?: boolean;
}

type Message = {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
};

export default function Messages({ eventId, currentUserId, targetUserId, hideOuterStyles = false }: MessagesProps) {
    const { t } = useLang();
    const chatTrans = (t as any).chat;
    const [history, setHistory] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!currentUserId || !targetUserId || !eventId) return;

        const loadMessages = () => {
            fetch(`/api/messages?userId=${currentUserId}&partnerId=${targetUserId}&eventId=${eventId}`)
                .then(res => {
                    if (!res.ok) throw new Error("HTTP error " + res.status);
                    return res.json();
                })
                .then(data => { if (Array.isArray(data)) setHistory(data); })
                .catch(err => console.error("Error polling messages:", err));
        };

        loadMessages();
        const poll = setInterval(loadMessages, 4000);
        return () => clearInterval(poll);
    }, [currentUserId, targetUserId, eventId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId: currentUserId,
                    receiverId: targetUserId,
                    eventId,
                    content: text.trim()
                })
            });

            if (res.ok) {
                const data = await res.json();
                setHistory(prev => [...prev, data]);
                setText('');
            }
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    const outerClasses = hideOuterStyles
        ? "flex flex-col h-full w-full overflow-hidden"
        : "border border-border bg-card rounded-radius-2xl flex flex-col h-80 overflow-hidden shadow-sm";

    return (
        <div className={outerClasses}>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/10">
                {history.map(msg => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 text-sm rounded-radius-xl ${isMe ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-secondary text-foreground rounded-tl-none'}`}>
                                <p className="break-words leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>
            <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2 bg-card">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={chatTrans?.typePlaceholder || 'Type a message...'}
                    className="flex-1 px-4 py-2 text-sm bg-secondary border border-border rounded-radius-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-radius-xl hover:opacity-90 transition shadow-sm">
                    {chatTrans?.sendBtn || 'Send'}
                </button>
            </form>
        </div>
    );
}