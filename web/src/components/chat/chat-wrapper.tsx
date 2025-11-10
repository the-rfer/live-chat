'use client';

import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';
import { useIsOpen } from '@/hooks/is-open';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { InputField } from './input-field';
import { MessagesLog } from './message-log';
import { Sidebar } from './sidebar';
import { IsOpenProvider } from '@/context/is-open-context';
import { SocketProvider } from '@/context/socket-context';

export default function ChatWrapper() {
    return (
        <IsOpenProvider>
            <SocketProvider>
                <Chat />
            </SocketProvider>
        </IsOpenProvider>
    );
}

function Chat() {
    const { isOpen, toggleOpen } = useIsOpen();
    return (
        <div className='relative flex bg-card shadow p-4 border border-foreground/20 rounded-2xl w-[900px] h-[700px] overflow-hidden'>
            <Sidebar />
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
                    {/* FIXME: Utilizador escolhido da friendslist */}
                    {/* {selectedUser && <span>{selectedUser}</span>} */}
                    <p className='mx-auto font-semibold'>Barbara Faria</p>
                </div>
                <Separator />
                <div
                    // ref={messagesEndRef}
                    className='relative flex flex-col-reverse overflow-y-auto grow scrollbar-thumb-muted-foreground/30'
                >
                    <MessagesLog />
                </div>
                <div className='mt-auto p-2'>
                    <InputField />
                </div>
            </div>
        </div>
    );
}
