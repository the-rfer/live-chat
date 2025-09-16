'use client';

import { useEffect, useRef, useState } from 'react';
import { User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function MessagesLog({ scrollToBottom }) {
    const [messages, setMessages] = useState([]);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            const now = new Date();
            const time = now.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });

            setMessages((prev) => [
                ...prev,
                {
                    user: 'Ruben',
                    text: `mensagem ${prev.length + 1}`,
                    time,
                },
            ]);
        }, 3000);

        return () => clearInterval(intervalRef.current);
    }, []);

    // useEffect(() => {
    //     scrollToBottom?.();
    // }, [messages, scrollToBottom]);

    const stopMessages = () => {
        clearInterval(intervalRef.current);
    };

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

            <button
                onClick={stopMessages}
                className='self-start bg-red-500 mt-4 px-4 py-2 rounded text-white'
            >
                Stop Messages
            </button>
        </div>
    );
}

export function InputField({ onSend }) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        const trimmed = message.trim();
        if (!trimmed) return;

        onSend(trimmed);
        setMessage('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className='flex items-center gap-2 w-full'>
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className='max-w-full h-10 resize-none scrollbar-hide'
            />
            <Button
                type='button'
                onClick={handleSend}
                variant='ghost'
                // size='icon'
                className='flex border w-10 h-10'
            >
                <Send />
            </Button>
        </div>
    );
}
