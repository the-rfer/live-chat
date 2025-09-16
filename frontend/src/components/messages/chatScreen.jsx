'use client';

import { ArrowRightFromLine, ArrowLeftFromLine } from 'lucide-react';
import { useIsOpen } from '@/hooks/useIsOpen';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/sidebar';
import { Separator } from '@/components/ui/separator';
import { MessagesLog, InputField } from '@/components/messages/messageLog';

export function ChatScreen({ connection, selectedUser }) {
    const { isOpen, toggleOpen } = useIsOpen();

    return (
        <div className='relative flex bg-background shadow p-4 border border-foreground/20 rounded-2xl w-[900px] h-[700px] overflow-hidden'>
            <Sidebar connection={connection} />
            <div className={`grow flex flex-col ${isOpen ? 'px-4' : 'px-2'}`}>
                <div
                    className={`flex items-center  w-full ${
                        isOpen ? 'min-h-[70px]' : 'min-h-14'
                    }`}
                >
                    <Button variant='ghost' size='icon' onClick={toggleOpen}>
                        {isOpen ? (
                            <ArrowLeftFromLine size={20} />
                        ) : (
                            <ArrowRightFromLine size={20} />
                        )}
                    </Button>
                    {selectedUser && <span>{selectedUser}</span>}
                    <p className='mx-auto font-semibold'>Barbara Faria</p>
                </div>
                <Separator />
                <div
                    // ref={messagesEndRef}
                    className='relative flex flex-col-reverse overflow-y-auto grow scrollbar-thumb-muted-foreground/30'
                >
                    <MessagesLog
                    //  scrollToBottom={scrollToBottom}
                    />
                </div>
                <div className='mt-auto p-2'>
                    <InputField
                        onSend={(msg) => console.log('Sending:', msg)}
                    />
                </div>
            </div>
        </div>
    );
}
