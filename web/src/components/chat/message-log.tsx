'use client';

import { useState } from 'react';
import { User } from 'lucide-react';

export function MessagesLog() {
    const [messages, setMessages] = useState<Record<string, string>[]>([]);

    return (
        <div className='flex flex-col gap-4 p-4'>
            {messages.map((msg, i) => {
                const isSender = i % 2 === 1; // odd = user, right side

                return (
                    <div
                        key={i}
                        className={`flex items-end gap-3 ${
                            isSender ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        {/* Avatar (only for messages from others) */}
                        {!isSender && (
                            <div className='flex justify-center items-center bg-muted rounded-full w-10 h-10 font-medium text-muted-foreground text-sm'>
                                <User className='w-5 h-5' />
                            </div>
                        )}

                        {/* Chat bubble */}
                        <div className='flex flex-col items-start max-w-[70%]'>
                            <div
                                className={`px-4 py-2 rounded-2xl max-w-full text-sm ${
                                    isSender
                                        ? 'bg-primary text-primary-foreground rounded-br-none'
                                        : 'bg-muted text-foreground rounded-bl-none'
                                }`}
                            >
                                {msg.text}
                            </div>
                            <span className='mt-1 text-muted-foreground text-xs'>
                                {msg.time}
                            </span>
                        </div>

                        {/* Avatar for sender (optional, usually omitted) */}
                        {isSender && (
                            <div className='flex justify-center items-center bg-muted rounded-full w-10 h-10 font-medium text-muted-foreground text-sm'>
                                <User className='w-5 h-5' />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
