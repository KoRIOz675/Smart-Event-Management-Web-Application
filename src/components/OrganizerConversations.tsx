import React, { useState, useEffect } from 'react';
import Messages from './messages';

interface OrganizerConversationsProps {
    eventId: string;
    organizerId: string;
}

type Participant = {
    id: string;
    fullName: string;
    email: string;
};

export default function OrganizerConversations({ eventId, organizerId }: OrganizerConversationsProps) {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/messages/conversations?userId=${organizerId}&eventId=${eventId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setParticipants(data);
                    if (data.length > 0) setSelectedId(data[0].id);
                }
            })
            .catch(err => console.error(err));
    }, [organizerId, eventId]);

    return (
        <div className="grid md:grid-cols-3 border border-border bg-card rounded-radius-4xl h-[450px] overflow-hidden shadow-xl">
            {/* Left Sidebar: Conversing Contacts */}
            <div className="border-r border-border bg-background/30 overflow-y-auto p-3 space-y-1">
                {participants.length === 0 ? (
                    <div className="text-center text-xs text-muted-foreground p-4 mt-4">
                        No conversations yet
                    </div>
                ) : (
                    participants.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setSelectedId(p.id)}
                            className={`w-full text-left p-3 rounded-radius-2xl transition-all flex flex-col gap-0.5 ${selectedId === p.id ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-secondary'}`}
                        >
                            <span className="font-bold text-sm truncate">{p.fullName}</span>
                            <span className={`text-xs truncate ${selectedId === p.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                {p.email}
                            </span>
                        </button>
                    ))
                )}
            </div>

            {/* Right Main Panel: Viewport Area */}
            <div className="md:col-span-2 h-full flex flex-col justify-between bg-background/10 overflow-hidden">
                {selectedId ? (
                    <Messages
                        eventId={eventId}
                        currentUserId={organizerId}
                        targetUserId={selectedId}
                        hideOuterStyles={true}
                    />
                ) : (
                    <div className="m-auto text-sm text-muted-foreground font-medium">
                        Select a conversation to view messages
                    </div>
                )}
            </div>
        </div>
    );
}